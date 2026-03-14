import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Download, Calendar, BarChart2, Layers, RefreshCw } from 'lucide-react'
import api from '../services/api.js'
import { useProject } from '../context/ProjectContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const DATE_RANGES = [
  { label: 'Last 7 days',  value: 7  },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
]

const PAGE_SIZE = 7

const EVENT_COLORS = [
  { bg: 'bg-blue-100',   text: 'text-blue-600'   },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-green-100',  text: 'text-green-600'  },
  { bg: 'bg-orange-100', text: 'text-orange-600' },
  { bg: 'bg-rose-100',   text: 'text-rose-600'   },
  { bg: 'bg-cyan-100',   text: 'text-cyan-600'   },
  { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { bg: 'bg-indigo-100', text: 'text-indigo-600' },
]

const hashColor = (name = '') => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % EVENT_COLORS.length
  return EVENT_COLORS[Math.abs(h)]
}

const fmt = (n) => (n ?? 0).toLocaleString()

const timeAgo = (ts) => {
  if (!ts) return 'N/A'
  const diffMs = Date.now() - new Date(ts).getTime()
  const mins   = Math.floor(diffMs / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`
  const days_ = Math.floor(hrs / 24)
  return `${days_} day${days_ > 1 ? 's' : ''} ago`
}

const freshnessDot = (ts) => {
  if (!ts) return 'bg-gray-300'
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000)
  if (mins < 5)  return 'bg-green-500'
  if (mins < 60) return 'bg-amber-400'
  return 'bg-gray-300'
}

const handleExport = (events, days) => {
  const header = 'Event Name,Count,Unique Users,Last Seen\n'
  const rows   = events
    .map(e =>
      `"${e.name}",${e.count},${e.uniqueUsers},"${
        e.lastSeen ? new Date(e.lastSeen).toLocaleString() : 'N/A'
      }"`
    )
    .join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `analytiq-events-${days}d.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function Events() {
  const { activeProject, selectedDays: days, setSelectedDays } = useProject()
  const { user }          = useAuth()
  const projectId         = activeProject?._id

  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [dateOpen, setDateOpen] = useState(false)

  const { data: overviewData } = useQuery({
    queryKey: ['overview', projectId, days],
    queryFn:  () =>
      api.get(`/analytics/${projectId}/overview?days=${days}`).then(r => r.data.data),
    enabled: !!projectId,
  })

  const { data: topEventsData, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['top-events', projectId, days],
    queryFn:  () =>
      api.get(`/analytics/${projectId}/top-events?days=${days}`).then(r => r.data.data),
    enabled: !!projectId,
    refetchInterval: 30000, 
  })

  const [secondsAgo, setSecondsAgo] = useState(0);
  useEffect(() => {
    if (!dataUpdatedAt) return;
    const interval = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - dataUpdatedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  const allEvents   = Array.isArray(topEventsData) ? topEventsData : []
  const filtered    = search.trim()
    ? allEvents.filter(e => e.name.toLowerCase().includes(search.trim().toLowerCase()))
    : allEvents
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage    = Math.min(page, totalPages)
  const pageEvents  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const maxCount    = allEvents[0]?.count ?? 1
  const barWidth    = (count) => `${Math.max(3, (count / maxCount) * 100)}%`

  const totalEvents      = overviewData?.totalEvents ?? 0
  const activeEventTypes = allEvents.length

  const handleSearch = (v) => { setSearch(v); setPage(1) }
  const handleDays   = (v) => { setSelectedDays(v); setPage(1); setDateOpen(false) }

  if (!projectId) return <Navigate to="/projects" replace />

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      <div className="flex items-start justify-between px-4 md:px-8 py-4 md:py-5 bg-white border-b border-gray-100 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            {dataUpdatedAt && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Updated {secondsAgo}s ago
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and analyze your raw event stream data.
          </p>
        </div>
        <div className="flex items-center gap-2">

          <span className="text-sm text-gray-600 font-medium">
            {user?.name || user?.email?.split('@')[0] || 'User'}
          </span>
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(user?.name || user?.email || 'U')[0].toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 md:space-y-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Total Events ({days}D)
                </p>
                <p className="text-4xl font-bold text-gray-900 tabular-nums">
                  {isLoading ? '—' : fmt(totalEvents)}
                </p>
              </div>
              <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <BarChart2 className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Active Event Types
                </p>
                <p className="text-4xl font-bold text-gray-900 tabular-nums">
                  {isLoading ? '—' : fmt(activeEventTypes)}
                </p>
              </div>
              <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 md:px-5 py-4 border-b border-gray-100">

            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Filter by event name..."
                className="w-full pl-9 pr-4 h-9 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <button
                onClick={() => setDateOpen(o => !o)}
                className="flex items-center gap-2 h-9 px-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-400" />
                {DATE_RANGES.find(r => r.value === days)?.label}
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dateOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-10 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                  {DATE_RANGES.map(r => (
                    <button
                      key={r.value}
                      onClick={() => handleDays(r.value)}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        days === r.value
                          ? 'bg-indigo-50 text-indigo-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleExport(filtered, days)}
              className="flex items-center justify-center gap-2 h-9 px-4 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold uppercase tracking-widest text-gray-400 px-5 py-3">
                  Event Name
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-widest text-gray-400 px-5 py-3 w-48">
                  Count
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-widest text-gray-400 px-5 py-3 w-36">
                  Unique Users
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-widest text-gray-400 px-5 py-3 w-36">
                  Last Seen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">

              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse ml-auto" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-16 bg-gray-100 rounded animate-pulse ml-auto" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse ml-auto" />
                  </td>
                </tr>
              ))}

              {!isLoading && pageEvents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm font-medium">
                      {search ? `No events matching "${search}"` : `No events in the last ${days} days.`}
                    </p>
                    {search && (
                      <button
                        onClick={() => handleSearch('')}
                        className="mt-2 text-indigo-600 text-sm hover:underline"
                      >
                        Clear filter
                      </button>
                    )}
                  </td>
                </tr>
              )}

              {pageEvents.map((event) => {
                const color = hashColor(event.name)
                return (
                  <tr key={event.name} className="hover:bg-gray-50 transition-colors">

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}>
                          <span className={`text-xs font-bold ${color.text}`}>
                            {event.name?.[0]?.toUpperCase() || '-'}
                          </span>
                        </div>
                        <span className="text-sm font-mono font-semibold text-gray-800">
                          {event.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-sm font-semibold text-gray-800 tabular-nums">
                          {fmt(event.count)}
                        </span>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: barWidth(event.count) }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm text-gray-600 tabular-nums">
                        {fmt(event.uniqueUsers)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${freshnessDot(event.lastSeen)}`} />
                        <span className="text-sm text-gray-600">
                          {timeAgo(event.lastSeen)}
                        </span>
                      </div>
                    </td>

                  </tr>
                )
              })}

            </tbody>
          </table>

          {!isLoading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                Showing {(safePage - 1) * PAGE_SIZE + 1} to{' '}
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>
    </div>
  )
}
