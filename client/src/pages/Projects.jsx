import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ArrowRight, LayoutGrid, LogOut, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api.js'
import { useProject } from '../context/ProjectContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export function Projects() {
  const navigate    = useNavigate()
  const queryClient = useQueryClient()
  const { setActiveProject } = useProject()
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName]   = useState('')
  const [nameError, setNameError] = useState('')


  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U'


  const { data: projectsRes, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  })
  const projects = projectsRes?.projects ?? []


  const { data: overviewMap } = useQuery({
    queryKey: ['projects-overview', projects.map(p => p._id).join(',')],
    queryFn: async () => {
      const results = await Promise.all(
        projects.map(p =>
          api.get(`/analytics/${p._id}/overview?days=30`)
             .then(r => [p._id, r.data.data?.totalEvents ?? 0])
             .catch(() => [p._id, 0])
        )
      )
      return Object.fromEntries(results)
    },
    enabled: projects.length > 0,
  })


  const createMutation = useMutation({
    mutationFn: (name) => api.post('/projects', { name }).then(r => r.data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setActiveProject(res.project)
      navigate('/app')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create project'),
  })

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newName.trim()) { setNameError('Project name is required'); return }
    if (newName.trim().length < 3) { setNameError('At least 3 characters'); return }
    setNameError('')
    createMutation.mutate(newName.trim())
  }

  const handleOpen = (project) => {
    setActiveProject(project)
    navigate('/app')
  }

  return (
    <div className="min-h-screen bg-white">


      <nav className="flex items-center justify-between px-10 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Analytiq Logo" className="w-7 h-7 object-contain rounded shrink-0" />
          <span className="font-bold text-gray-900 text-base tracking-tight">Analytiq</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(v => !v)}
            className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity"
          >
            {initials}
          </button>

          {showDropdown && (
            <>

              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />

              <div className="absolute right-0 top-10 z-20 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 overflow-hidden">
                <button
                  onClick={() => { setShowDropdown(false); navigate('/account-settings') }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Account settings
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => { logout(); navigate('/login') }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </nav>


      <div className="max-w-4xl mx-auto px-10 py-12">


        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New project
          </button>
        </div>


        {isLoading ? (
          <div className="grid grid-cols-2 gap-5">
            {[1, 2].map(i => (
              <div key={i} className="border border-gray-100 rounded-xl p-5 h-36 animate-pulse bg-gray-50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">


            {projects.map(project => (
              <div
                key={project._id}
                className="border-t-4 border-t-indigo-600 border border-gray-100 rounded-xl p-5 flex flex-col gap-6"
              >
                <div>
                  <p className="text-lg font-bold text-gray-900">{project.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {overviewMap?.[project._id] != null
                      ? `${overviewMap[project._id].toLocaleString()} events in the last 30 days`
                      : 'Loading...'}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md font-mono text-xs text-gray-500">
                    pk_live_{'•'.repeat(9)}
                  </div>
                  <button
                    onClick={() => handleOpen(project)}
                    className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}


            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50 transition-colors min-h-[160px]"
              >
                <Plus className="w-9 h-9 text-indigo-500" />
                <span className="text-sm font-semibold text-indigo-600">Create new project</span>
              </button>
            ) : (
              <div className="border-2 border-dashed border-indigo-400 rounded-xl p-5 flex flex-col justify-center gap-3 min-h-[160px]">
                <p className="text-sm font-semibold text-gray-700">New project name</p>
                <form onSubmit={handleCreate} className="flex flex-col gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Enter Your Project Name."
                    className="h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {nameError && <p className="text-xs text-red-500">{nameError}</p>}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="flex-1 h-8 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {createMutation.isPending ? 'Creating…' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setNewName(''); setNameError('') }}
                      className="h-8 px-3 text-xs text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
