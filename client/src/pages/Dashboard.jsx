import { Link, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '../services/api.js'
import { useProject } from '../context/ProjectContext.jsx'


function fmt(n = 0) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
      <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
      <div className="h-8 w-28 bg-gray-200 rounded" />
    </div>
  )
}

function ErrorRetry({ onRetry, label = 'Failed to load data.' }) {
  return (
    <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
      <p className="text-sm text-rose-600 flex-1">{label}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Retry
      </button>
    </div>
  )
}


function MetricCard({ label, value, loading, trend, trendUp }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">
        {loading ? <span className="text-gray-300">—</span> : fmt(value)}
      </p>
      <div className="flex items-center justify-between mt-3">

        {trend !== undefined ? (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp
              ? <ArrowUpRight className="w-3.5 h-3.5" />
              : <ArrowDownRight className="w-3.5 h-3.5" />
            }
            {trend}%
          </span>
        ) : (
          <span />
        )}

        <div className="flex items-end gap-0.5 h-6">
          {[3,5,4,7,5,8,6,9].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-indigo-200 rounded-sm"
              style={{ height: `${h * 3}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


export function Dashboard() {
  const { activeProject, selectedDays: days } = useProject()
  const projectId = activeProject?._id


  const { data: overviewRes, isLoading: overviewLoading, isError: overviewError, refetch: refetchOverview } = useQuery({
    queryKey: ['overview', projectId, days],
    queryFn: () => api.get(`/analytics/${projectId}/overview?days=${days}`).then(r => r.data.data),
    enabled: !!projectId,
  })

  const { data: timelineRes, isLoading: timelineLoading, isError: timelineError, refetch: refetchTimeline } = useQuery({
    queryKey: ['events-over-time', projectId, days],
    queryFn: () => api.get(`/analytics/${projectId}/events-over-time?days=${days}`).then(r => r.data.data),
    enabled: !!projectId,
  })

  const { data: topEventsRes, isError: topError, refetch: refetchTop } = useQuery({
    queryKey: ['top-events', projectId, days],
    queryFn: () => api.get(`/analytics/${projectId}/top-events?days=${days}`).then(r => r.data.data),
    enabled: !!projectId,
  })

  const { data: activeUsersRes, isError: usersError, refetch: refetchUsers } = useQuery({
    queryKey: ['active-users', projectId],
    queryFn: () => api.get(`/analytics/${projectId}/active-users`).then(r => r.data.data),
    enabled: !!projectId,
  })

  const { data: retentionRes } = useQuery({
    queryKey: ['retention-mini', projectId],
    queryFn: () => api.get(`/analytics/${projectId}/retention?days=90`).then(r => r.data.data),
    enabled: !!projectId,
  })


  const totalEvents = overviewRes?.totalEvents ?? 0
  const uniqueUsers = overviewRes?.uniqueUsers ?? 0
  const dau         = activeUsersRes?.dau       ?? 0
  const wau         = activeUsersRes?.wau       ?? 0
  const mau         = activeUsersRes?.mau       ?? 0
  const chartData   = Array.isArray(timelineRes) ? timelineRes : []
  const topEvents   = Array.isArray(topEventsRes) ? topEventsRes : []

  const retentionCohorts = Array.isArray(retentionRes) ? retentionRes : []
  const validCohorts = retentionCohorts.filter(c => c.totalUsers > 0)
  
  const getAvg = (key) => {
    if (validCohorts.length === 0) return 0
    const sum = validCohorts.reduce((acc, c) => acc + ((c[key] / c.totalUsers) * 100), 0)
    return Math.round(sum / validCohorts.length)
  }

  const retentionCurve = retentionCohorts.length > 0
    ? [
        { label: 'D0',  pct: 100 },
        { label: 'D1',  pct: getAvg('day1') },
        { label: 'D7',  pct: getAvg('day7') },
        { label: 'D14', pct: getAvg('day14') },
        { label: 'D30', pct: getAvg('day30') },
      ]
    : []


  if (!projectId) return <Navigate to="/projects" replace />

  const handleExport = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Events', totalEvents],
      ['Unique Users', uniqueUsers],
      ['DAU (Daily Active User)', dau],
      ['MAU (Monthly Active User)', mau],
      [],
      ['Events over time'],
      ['Date', 'Events'],
      ...chartData.map(row => [row.date, row.count])
    ].map(e => e.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `analytiq_overview_${days}days.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 bg-white border-b border-gray-100 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Overview</h1>
        <Button onClick={handleExport} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 px-3">
          <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export</span>
        </Button>
      </div>


      <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 md:space-y-8">


        {(overviewError || usersError) && (
          <ErrorRetry
            label="Failed to load overview metrics."
            onRetry={() => { refetchOverview(); refetchUsers() }}
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {overviewLoading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : (
            <>
              <MetricCard label="Total Events" value={totalEvents} loading={false} />
              <MetricCard label="Unique Users" value={uniqueUsers} loading={false} />
              <MetricCard label="DAU (Daily Active User)"    value={dau}         loading={false} />
              <MetricCard label="MAU (Monthly Active User)"  value={mau}         loading={false} />
            </>
          )}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">


          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-7">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Events over time</h3>
                <p className="text-xs text-gray-400 mt-0.5">Last {days} days</p>
              </div>
              {timelineError && (
                <button onClick={refetchTimeline} className="flex items-center gap-1 text-xs text-rose-500 font-medium">
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              )}
            </div>

            {timelineLoading ? (
              <div className="h-64 animate-pulse space-y-2 pt-4">
                {[80, 60, 90, 40, 70, 55, 85].map((h, i) => (
                  <div key={i} className="flex items-end gap-1 h-48">
                    {[30,50,40,70,45,60,35,80,55,65,75,50,45,70,60,80,55,65,40,50,70,60,45,80,55,65,35,70,55,60].map((p,j) => (
                      <div key={j} className="flex-1 bg-gray-200 rounded-t" style={{height:`${p}%`}} />
                    ))}
                  </div>
                )).slice(0,1)}
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                No events yet in this date range
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} barSize={7} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    width={38}
                  />
                  <Tooltip
                    contentStyle={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelStyle={{ color: '#374151', fontWeight: 600 }}
                  />

                  <Bar dataKey="count" name="Events" fill="#5858FF" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>


          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-7 flex flex-col">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Top Events
            </h3>
            {topEvents.length === 0 ? (
              <p className="text-xs text-gray-400 text-center mt-8">No events tracked yet</p>
            ) : (
              <ul className="flex-1 divide-y divide-gray-50">
                {topEvents.slice(0, 5).map((event, i) => (
                  <li
                    key={event.name}
                    className={`flex items-center justify-between py-3 px-2 text-sm ${
                      i === 0
                        ? 'border-l-2 border-indigo-500 bg-indigo-50/40 -mx-2 px-[10px] rounded-r-md'
                        : ''
                    }`}
                  >
                    <span className="font-mono text-xs text-gray-700 truncate">{event.name}</span>
                    <span className="font-bold text-gray-900 ml-2 shrink-0">
                      {event.count.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/app/events"
              className="mt-4 text-xs text-indigo-600 font-semibold hover:text-indigo-700"
            >
              VIEW ALL EVENTS →
            </Link>
          </div>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">


          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-7">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Active Users</h3>
            <div className="space-y-0">
              {[
                { label: 'DAU (Daily Active User)',    value: dau },
                { label: 'WAU (Weekly Active User)',   value: wau },
                { label: 'MAU (Monthly Active User)',  value: mau },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    {label}
                  </span>
                  <span className="text-xl font-bold text-gray-900">{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>


          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-7">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Retention Curve</h3>
              <Link
                to="/app/retention"
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                View full →
              </Link>
            </div>

            <div className="h-36 flex items-end gap-2 mt-2">
              {retentionCurve.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  Not enough data yet
                </div>
              ) : (
                retentionCurve.map(({ label, pct }) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-indigo-500 rounded-t transition-all"
                      style={{ height: `${(pct / 100) * 130}px` }}
                    />
                    <span className="text-[10px] text-gray-400">{label}</span>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Based on historical average
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
