import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, RefreshCw } from 'lucide-react'
import api from '../services/api.js'
import { useProject } from '../context/ProjectContext.jsx'




const RETENTION_PERIODS = [
  { key: 'day1',  label: 'Day 1'  },
  { key: 'day7',  label: 'Day 7'  },
  { key: 'day14', label: 'Day 14' },
  { key: 'day30', label: 'Day 30' },
]



const heatColor = (pct) => {
  const clamped = Math.min(100, Math.max(0, pct))
  const opacity = 0.08 + (clamped / 100) * 0.85
  return `rgba(79,70,229,${opacity.toFixed(2)})`
}


const heatTextColor = (pct) => (pct >= 50 ? '#ffffff' : '#1f2937')


const fmtWeek = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function Retention() {
  const { activeProject, selectedDays: days } = useProject()
  const projectId = activeProject?._id


  const { data: retentionData, isLoading, isError, refetch } = useQuery({
    queryKey: ['retention', projectId, days],
    queryFn: () =>
      api.get(`/analytics/${projectId}/retention?days=${days}`).then(r => r.data.data),
    enabled: !!projectId,
  })

  const cohorts = retentionData ?? []


  const totalCohorts = cohorts.length
  const totalUsersTracked = cohorts.reduce((sum, c) => sum + c.totalUsers, 0)


  const avgRetention = RETENTION_PERIODS.reduce((acc, { key }) => {
    const validCohorts = cohorts.filter(c => c.totalUsers > 0)
    acc[key] = validCohorts.length > 0
      ? validCohorts.reduce((sum, c) => sum + ((c[key] / c.totalUsers) * 100), 0) / validCohorts.length
      : 0
    return acc
  }, {})

  if (!projectId) return <Navigate to="/projects" replace />

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">


      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 bg-white border-b border-gray-100 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Retention</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-0.5">
            Track how many users return after their first visit.
          </p>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">

        {isError && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
            <p className="text-sm text-rose-600 flex-1">Failed to load retention data.</p>
            <button
              onClick={refetch}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Users Tracked
            </p>
            <p className="text-4xl font-bold text-gray-900 tabular-nums">
              {isLoading ? '—' : totalUsersTracked.toLocaleString()}
            </p>
          </div>


          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Cohort Weeks
            </p>
            <p className="text-4xl font-bold text-gray-900 tabular-nums">
              {isLoading ? '—' : totalCohorts}
            </p>
          </div>


          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Avg Day‑30 Retention
            </p>
            <p className="text-4xl font-bold text-indigo-600 tabular-nums">
              {isLoading ? '—' : `${avgRetention.day30?.toFixed(1) ?? 0}%`}
            </p>
          </div>

        </div>


        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">


          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Weekly Cohort Retention</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Each row = users who first appeared that week. Cells show % still active after N days.
            </p>
          </div>


          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold uppercase tracking-widest text-gray-400 px-5 py-3 min-w-[140px]">
                    Cohort Week
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-widest text-gray-400 px-4 py-3 w-28">
                    Users
                  </th>
                  {RETENTION_PERIODS.map(p => (
                    <th key={p.key} className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 px-4 py-3 w-24">
                      {p.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">


                {!isLoading && cohorts.length > 0 && (
                  <tr className="bg-indigo-50">
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                        Average
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-500">—</td>
                    {RETENTION_PERIODS.map(({ key, label }) => (
                      <td key={key} className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-indigo-700">
                          {avgRetention[key]?.toFixed(1)}%
                        </span>
                      </td>
                    ))}
                  </tr>
                )}


                {isLoading && Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4">
                      <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-12 bg-gray-100 rounded animate-pulse ml-auto" />
                    </td>
                    {RETENTION_PERIODS.map(p => (
                      <td key={p.key} className="px-4 py-4">
                        <div className="h-8 w-14 bg-gray-100 rounded-lg animate-pulse mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}


                {!isLoading && cohorts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm font-medium">
                        No cohort data found for the last {days} days.
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Make sure events are being tracked with a userId.
                      </p>
                    </td>
                  </tr>
                )}


                {cohorts.map((cohort) => (
                  <tr key={cohort.cohortWeek} className="hover:bg-gray-50 transition-colors">


                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        Week of {fmtWeek(cohort.cohortWeek)}
                      </span>
                    </td>


                    <td className="px-4 py-4 text-right">
                      <span className="text-sm text-gray-500 tabular-nums">
                        {cohort.totalUsers.toLocaleString()}
                      </span>
                    </td>


                    {RETENTION_PERIODS.map(({ key }) => {
                      const retained = cohort[key] ?? 0
                      const pct = cohort.totalUsers > 0
                        ? (retained / cohort.totalUsers) * 100
                        : 0

                      return (
                        <td key={key} className="px-4 py-4">
                          <div
                            className="mx-auto w-14 h-9 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: heatColor(pct) }}
                          >
                            <span
                              className="text-xs font-semibold tabular-nums"
                              style={{ color: heatTextColor(pct) }}
                            >
                              {pct.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      )
                    })}

                  </tr>
                ))}

              </tbody>
            </table>
          </div>


          {!isLoading && cohorts.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
              <span className="text-xs text-gray-400">Low</span>
              <div className="flex gap-1">
                {[5, 20, 35, 50, 65, 80, 95].map(p => (
                  <div
                    key={p}
                    className="w-6 h-4 rounded"
                    style={{ backgroundColor: heatColor(p) }}
                    title={`~${p}%`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">High</span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
