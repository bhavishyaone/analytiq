import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Copy, Eye, EyeOff, RefreshCw, Plus, Check, Key, SlidersHorizontal, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api.js'
import { useProject } from '../context/ProjectContext.jsx'




export function Settings() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { activeProject, setActiveProject } = useProject()


  const [showKey, setShowKey]             = useState(false)
  const [copied, setCopied]               = useState(false)
  const [rotateConfirm, setRotateConfirm] = useState(false)


  const [editedName, setEditedName] = useState('')


  const [deleteConfirm, setDeleteConfirm] = useState(false)


  const [newProjectName, setNewProjectName]   = useState('')
  const [newProjectError, setNewProjectError] = useState('')


  useEffect(() => {
    if (activeProject?.name) setEditedName(activeProject.name)
  }, [activeProject?._id])


  const { data: projectsRes } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  })
  const projects = projectsRes?.projects ?? []




  const createMutation = useMutation({
    mutationFn: (name) => api.post('/projects', { name }).then(r => r.data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setActiveProject(res.project)
      setNewProjectName('')
      setNewProjectError('')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create project'),
  })


  const updateMutation = useMutation({
    mutationFn: ({ id, name }) => api.patch(`/projects/${id}`, { name }).then(r => r.data),
    onSuccess: (res) => {
      const updated = res.project ?? { ...activeProject, name: editedName }
      setActiveProject(updated)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update project'),
  })


  const rotateMutation = useMutation({
    mutationFn: (id) => api.patch(`/projects/${id}/rotate-key`).then(r => r.data),
    onSuccess: (res) => {
      setActiveProject({ ...activeProject, apiKey: res.apiKey })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setRotateConfirm(false)
      setShowKey(false)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to rotate API key'),
  })


  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setActiveProject(null)
      setDeleteConfirm(false)
      navigate('/projects')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete project'),
  })


  const maskedKey = activeProject?.apiKey
    ? `pk_live_${'•'.repeat(16)}`
    : ''

  const displayKey = showKey ? activeProject?.apiKey : maskedKey

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeProject.apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed — please copy manually')
    }
  }

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newProjectName.trim()) { setNewProjectError('Project name is required'); return }
    if (newProjectName.trim().length < 3) { setNewProjectError('Name must be at least 3 characters'); return }
    setNewProjectError('')
    createMutation.mutate(newProjectName.trim())
  }

  const handleSaveChanges = () => {
    if (!editedName.trim()) { toast.error('Project name cannot be empty'); return }
    if (editedName.trim().length < 5) { toast.error('Name must be at least 5 characters'); return }
    if (editedName.trim() === activeProject.name) { return }
    updateMutation.mutate({ id: activeProject._id, name: editedName.trim() })
  }


  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">


      <div className="px-8 py-5 bg-white border-b border-gray-100 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Project Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your project configuration, API keys, and danger zones.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8 space-y-10">



          {projects.length > 1 && (
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Switch Project</h2>
              <div className="space-y-2">
                {projects.map(p => (
                  <button
                    key={p._id}
                    onClick={() => setActiveProject(p)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors ${
                      activeProject?._id === p._id
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activeProject?._id === p._id ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                      <span className="text-sm font-medium text-gray-900">{p.name}</span>
                    </div>
                    {activeProject?._id === p._id && (
                      <span className="text-xs text-indigo-600 font-semibold">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeProject && (
            <>

              <section>

                <div className="flex items-center gap-2 mb-4">
                  <Key className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-indigo-700">API Keys</h2>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">


                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Public API Key</p>
                    <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden">

                      <div className="flex-1 flex items-center gap-2 px-4 h-10 bg-gray-50 font-mono text-sm text-gray-700 min-w-0 overflow-hidden">
                        <Eye className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate select-all">{displayKey}</span>
                      </div>

                      <button
                        onClick={() => setShowKey(v => !v)}
                        className="h-10 px-4 text-sm font-medium text-gray-600 border-l border-gray-200 bg-white hover:bg-gray-50 transition-colors shrink-0"
                      >
                        {showKey ? 'Hide' : 'Reveal'}
                      </button>

                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 h-10 px-4 text-sm font-medium text-gray-600 border-l border-gray-200 bg-white hover:bg-gray-50 transition-colors shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      This key is visible client-side. Do not use it for administrative tasks.
                    </p>
                  </div>


                  <div className="border-t border-gray-100" />


                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Quick Installation</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">


                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-[9px] text-gray-500 font-mono">$</span>
                          </div>
                          <span className="text-xs text-gray-400 font-medium">bash</span>
                        </div>
                        <code className="text-sm text-purple-600 font-mono">
                          npm install analytiq
                        </code>
                      </div>


                      <div className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-yellow-100 rounded flex items-center justify-center">
                            <span className="text-[9px] text-yellow-600 font-mono">JS</span>
                          </div>
                          <span className="text-xs text-gray-400 font-medium">javascript</span>
                        </div>
                        <div className="font-mono text-sm">
                          <p className="mb-2">
                            <span className="text-purple-600">import</span>
                            <span className="text-gray-700"> {'{ '}</span>
                            <span className="text-blue-600">init</span>
                            <span className="text-gray-700">, </span>
                            <span className="text-blue-600">track</span>
                            <span className="text-gray-700">{' } '}</span>
                            <span className="text-purple-600">from</span>
                            <span className="text-green-600"> 'analytiq'</span>
                            <span className="text-gray-700">;</span>
                          </p>
                          <p className="mt-4 text-gray-400 text-xs">
                            {'// Initialize once in your app'}
                          </p>
                          <p>
                            <span className="text-blue-600">init</span>
                            <span className="text-gray-700">(</span>
                            <span className="text-green-600">'{showKey ? activeProject.apiKey : 'pk_live_your_key_here'}'</span>
                            <span className="text-gray-700">);</span>
                          </p>
                          <p className="mt-4 text-gray-400 text-xs">
                            {'// Track events anywhere'}
                          </p>
                          <p>
                            <span className="text-blue-600">track</span>
                            <span className="text-gray-700">(</span>
                            <span className="text-green-600">'page_view'</span>
                            <span className="text-gray-700">, {'{ path: '}</span>
                            <span className="text-green-600">'/home'</span>
                            <span className="text-gray-700"> {'}'}</span>
                            <span className="text-gray-700">);</span>
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>


                  <div className="border-t border-gray-100" />


                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Rotate API Key</p>
                    <p className="text-xs text-gray-400 mb-3">
                      Generates a new key immediately. Your old key will stop working right away.
                    </p>
                    {!rotateConfirm ? (
                      <button
                        onClick={() => setRotateConfirm(true)}
                        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Rotate key
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-red-500 font-medium">Are you sure? Old key stops working.</p>
                        <button
                          onClick={() => rotateMutation.mutate(activeProject._id)}
                          disabled={rotateMutation.isPending}
                          className="h-8 px-4 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                          {rotateMutation.isPending ? 'Rotating…' : 'Yes, rotate'}
                        </button>
                        <button
                          onClick={() => setRotateConfirm(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </section>


              <section>
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-indigo-700">General</h2>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-5">


                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={e => setEditedName(e.target.value)}
                      className="w-full h-10 px-4 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>




                  <button
                    onClick={handleSaveChanges}
                    disabled={updateMutation.isPending}
                    className="h-10 px-6 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
                  </button>

                </div>
              </section>


              <section>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold text-red-500">Danger Zone</h2>
                </div>

                <div className="bg-red-50 rounded-xl border border-red-100 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-red-700">Delete this project</p>
                      <p className="text-xs text-red-500 mt-1 max-w-sm">
                        Deleting this project will permanently remove all events, funnels, and retention data
                        associated with it. This action cannot be undone.
                      </p>
                    </div>

                    {!deleteConfirm ? (
                      <button
                        onClick={() => setDeleteConfirm(true)}
                        className="shrink-0 h-9 px-4 text-sm font-semibold text-red-600 border border-red-300 rounded-lg bg-white hover:bg-red-50 transition-colors"
                      >
                        Delete Project
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => deleteMutation.mutate(activeProject._id)}
                          disabled={deleteMutation.isPending}
                          className="h-9 px-4 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          {deleteMutation.isPending ? 'Deleting…' : 'Confirm Delete'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </section>




            </>
          )}

        </div>
      </div>
    </div>
  )
}
