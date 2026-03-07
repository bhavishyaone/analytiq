import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Plus, TrendingDown, Download, GitBranch } from 'lucide-react'
import api from '../services/api.js'
import { useProject } from '../context/ProjectContext.jsx'

const DATE_RANGES = [
  { label: 'Last 7 days',  value: 7  },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
]

export function Funnels() {
  const { activeProject } = useProject()
  const projectId = activeProject?._id

  const [steps, setSteps] = useState(['', ''])
  const [days, setDays]   = useState(30)
  const [error, setError] = useState('')

  const updateStep = (index, value) =>
    setSteps(prev => prev.map((s, i) => (i === index ? value : s)))

  const addStep = () => {
    if (steps.length < 20) setSteps(prev => [...prev, ''])
  }

  const removeStep = (index) => {
    if (steps.length > 2) setSteps(prev => prev.filter((_, i) => i !== index))
  }




  const {
    mutate: runFunnel,
    data: funnelResult,
    isPending,
    isError,
    reset,
  } = useMutation({
    mutationFn: () =>
      api.post(`/funnel/${projectId}?days=${days}`, {
        steps: steps.map(s => s.trim()),
      }).then(r => r.data.data),
  })

  const handleRun = () => {
    setError('')
    if (steps.map(s => s.trim()).some(s => s === '')) {
      setError('All steps must have an event name.')
      return
    }
    reset()
    runFunnel()
  }

  const handleDaysChange = (v) => { setDays(v); reset() }


  const results    = funnelResult ?? []
  const firstCount = results[0]?.count ?? 0
  const enriched   = results.map((item, i) => {
    const prevCount = i === 0 ? item.count : results[i - 1].count
    return {
      ...item,
      conversionFromFirst: firstCount > 0 ? +((item.count / firstCount) * 100).toFixed(1) : 0,
      conversionFromPrev:  prevCount > 0 && i > 0 ? +((item.count / prevCount) * 100).toFixed(1) : 100,
      dropoffPct:          i > 0 && prevCount > 0 ? +((1 - item.count / prevCount) * 100).toFixed(1) : 0,
    }
  })

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <GitBranch className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-900 font-semibold text-lg">No project selected</p>
        <p className="text-gray-500 text-sm mt-1">
          Go to Settings to create or select a project first.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">


      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Funnels</h1>
          <span className="text-sm text-gray-400 font-medium">Analysis Board</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {DATE_RANGES.map(r => (
              <button
                key={r.value}
                onClick={() => handleDaysChange(r.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  days === r.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className="flex flex-1 overflow-hidden">


        <div className="w-80 shrink-0 border-r border-gray-100 bg-white flex flex-col">


          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Funnel Builder
            </span>
            <button
              onClick={() => { setSteps(['', '']); reset() }}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
              title="Reset"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Steps</p>


            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={step}
                    onChange={e => updateStep(index, e.target.value)}
                    placeholder="Event name..."
                    className="flex-1 h-9 px-3 text-sm font-mono bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={() => removeStep(index)}
                    disabled={steps.length <= 2}
                    className="text-gray-300 hover:text-gray-500 text-lg leading-none disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>


            <button
              onClick={addStep}
              disabled={steps.length >= 20}
              className="flex items-center gap-1.5 text-sm text-indigo-600 font-medium hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>


            

            {error && <p className="text-xs text-rose-500">{error}</p>}
          </div>


          <div className="p-5 border-t border-gray-100 shrink-0">
            <button
              onClick={handleRun}
              disabled={isPending}
              className="w-full py-3 text-sm font-bold uppercase tracking-widest text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Calculating...' : 'Calculate Funnel'}
            </button>
          </div>
        </div>


        <div className="flex-1 overflow-y-auto p-8">


          {enriched.length === 0 && !isPending && !isError && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">
                Add steps on the left and click{' '}
                <strong className="text-gray-700">Calculate Funnel</strong> to see results.
              </p>
            </div>
          )}


          {isError && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
              <p className="text-sm text-rose-600 font-medium">
                Failed to calculate funnel. Check your event names and try again.
              </p>
            </div>
          )}


          {enriched.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-8">


              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-900">Funnel Results</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors" title="Share">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>


              <div className="space-y-8">
                {enriched.map((item, index) => (
                  <div key={item.step}>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-700 mb-3">
                      {index + 1}. {item.step}
                    </p>
                    <div className="h-14 bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <div
                        className="h-full rounded-lg transition-all duration-700"
                        style={{
                          width: `${Math.max(1, item.conversionFromFirst)}%`,
                          backgroundColor: `rgba(79,70,229,${1 - index * 0.25})`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        <span className="text-xl font-bold text-gray-900 tabular-nums">
                          {item.count.toLocaleString()}
                        </span>
                        {' '}users ({item.conversionFromFirst}%)
                      </p>
                      {index > 0 && (
                        <div className="flex items-center gap-1 text-xs text-rose-500 font-medium">
                          <TrendingDown className="w-3.5 h-3.5" />
                          {item.dropoffPct}% dropped after step {index}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>


              {enriched.length >= 2 && (
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
                    Overall Conversion Rate
                  </p>
                  <p className="text-5xl font-bold text-gray-900">
                    {enriched[enriched.length - 1].conversionFromFirst}%
                  </p>
                  <p className="text-sm text-gray-400 mt-1">From start to finish</p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
