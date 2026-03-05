import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Copy, Eye, EyeOff, RefreshCw, Plus, Check, Settings as SettingsIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '../services/api.js'
import { useProject } from '../context/ProjectContext.jsx'

export function Settings() {
  const queryClient = useQueryClient()
  const { activeProject, setActiveProject } = useProject()

  // Form state — create new project
  const [projectName, setProjectName]   = useState('')
  const [nameError, setNameError]       = useState('')

  // API key UI state
  const [showKey, setShowKey]           = useState(false)
  const [copied, setCopied]             = useState(false)
  const [rotateConfirm, setRotateConfirm] = useState(false)

  // ── Fetch all projects owned by the user ─────────────────────────────
  // GET /api/projects — returns array of project objects
  const { data: projectsRes, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  })
  const projects = projectsRes?.data ?? []

  // ── Create project ────────────────────────────────────────────────────
  // POST /api/projects { name } → returns new project with apiKey
  const createMutation = useMutation({
    mutationFn: (name) => api.post('/projects', { name }).then(r => r.data),
    onSuccess: (res) => {
      const newProject = res.data
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setActiveProject(newProject)    // auto-select the new project
      setProjectName('')
      setNameError('')
      toast.success(`Project "${newProject.name}" created!`)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create project')
    },
  })

  // ── Rotate API key ────────────────────────────────────────────────────
  // PATCH /api/projects/:id/rotate-key → returns { newApiKey }
  const rotateMutation = useMutation({
    mutationFn: (id) => api.patch(`/projects/${id}/rotate-key`).then(r => r.data),
    onSuccess: (res) => {
      // Update the active project with the new key
      const updatedProject = { ...activeProject, apiKey: res.data.newApiKey }
      setActiveProject(updatedProject)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setRotateConfirm(false)
      setShowKey(true)
      toast.success('API key rotated. Old key is now invalid.')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to rotate key')
    },
  })

  // ── Validate + submit create form ─────────────────────────────────────
  const handleCreate = (e) => {
    e.preventDefault()
    if (!projectName.trim()) {
      setNameError('Project name is required')
      return
    }
    if (projectName.trim().length < 3) {
      setNameError('Name must be at least 3 characters')
      return
    }
    setNameError('')
    createMutation.mutate(projectName.trim())
  }

  // ── Copy API key to clipboard ─────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeProject.apiKey)
      setCopied(true)
      toast.success('API key copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed — please copy manually')
    }
  }

  // ── Masked key display ────────────────────────────────────────────────
  const maskedKey = activeProject?.apiKey
    ? `${activeProject.apiKey.slice(0, 8)}${'•'.repeat(24)}`
    : ''

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center gap-3 px-8 py-5 bg-white border-b border-gray-100 shrink-0">
        <SettingsIcon className="w-5 h-5 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-2xl">

        {/* ── CREATE NEW PROJECT ── */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Create a new project</h2>
          <p className="text-sm text-gray-500 mb-5">
            Each project has its own API key and event stream.
          </p>

          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="project-name" className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Project Name
              </Label>
              <div className="flex gap-2">
                <Input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="e.g. Acme SaaS App"
                  className={`h-10 text-sm flex-1 ${nameError ? 'border-red-400' : ''}`}
                />
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {createMutation.isPending ? 'Creating…' : 'Create'}
                </Button>
              </div>
              {nameError && <p className="text-xs text-red-500">{nameError}</p>}
            </div>
          </form>
        </section>

        {/* ── EXISTING PROJECTS ── */}
        {projects.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Your Projects</h2>
            {projectsLoading ? (
              <p className="text-sm text-gray-400">Loading…</p>
            ) : (
              <ul className="space-y-2">
                {projects.map(project => (
                  <li
                    key={project._id}
                    onClick={() => setActiveProject(project)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                      activeProject?._id === project._id
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activeProject?._id === project._id ? 'bg-indigo-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm font-medium text-gray-900">{project.name}</span>
                    </div>
                    {activeProject?._id === project._id && (
                      <span className="text-xs text-indigo-600 font-semibold">Active</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ── API KEY SECTION — only shown when a project is selected ── */}
        {activeProject && (
          <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">API Key</h2>
              <p className="text-sm text-gray-500 mt-1">
                Use this key to send events from your app. Keep it secret.
              </p>
            </div>

            {/* Key display + copy + show/hide */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {activeProject.name}
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 h-10 font-mono text-sm text-gray-700">
                  {showKey ? activeProject.apiKey : maskedKey}
                </div>
                <button
                  onClick={() => setShowKey(v => !v)}
                  title={showKey ? 'Hide key' : 'Show key'}
                  className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleCopy}
                  title="Copy API key"
                  className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SDK snippet */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                SDK Usage
              </Label>
              <pre className="bg-gray-950 text-green-400 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed">
{`import { init, track } from '@analytiq/sdk'

init('${showKey ? activeProject.apiKey : maskedKey}')

track('button_clicked', { page: 'dashboard' })`}
              </pre>
            </div>

            {/* Rotate key */}
            <div className="pt-2 border-t border-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Rotate API Key</h3>
              <p className="text-xs text-gray-500 mb-3">
                Generates a new key instantly. Your old key will stop working immediately.
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
                  <Button
                    size="sm"
                    onClick={() => rotateMutation.mutate(activeProject._id)}
                    disabled={rotateMutation.isPending}
                    className="bg-red-500 hover:bg-red-600 text-white h-8"
                  >
                    {rotateMutation.isPending ? 'Rotating…' : 'Yes, rotate'}
                  </Button>
                  <button
                    onClick={() => setRotateConfirm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
