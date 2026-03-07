import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Copy, Check, LayoutGrid } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export function AccountSettings() {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuth()


  const [name,  setName]  = useState(user?.name  ?? '')
  const [email, setEmail] = useState(user?.email ?? '')


  const [currentPw,  setCurrentPw]  = useState('')
  const [newPw,      setNewPw]      = useState('')
  const [confirmPw,  setConfirmPw]  = useState('')


  const [copied, setCopied] = useState(false)


  useEffect(() => {
    if (user?.name)  setName(user.name)
    if (user?.email) setEmail(user.email)
  }, [user?._id])

  const userId    = user?._id ?? user?.id ?? ''
  const shortId   = userId ? `usr_${userId.slice(0, 8)}` : 'usr_••••••••'

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(userId)
      setCopied(true)
      toast.success('User ID copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed')
    }
  }


  const profileMutation = useMutation({
    mutationFn: () => api.patch('/auth/me', { name: name.trim(), email: email.trim() }).then(r => r.data),
    onSuccess: (res) => {
      updateUser({ name: res.user.name, email: res.user.email })
      toast.success('Profile updated!')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update profile'),
  })


  const passwordMutation = useMutation({
    mutationFn: () =>
      api.patch('/auth/me', {
        currentPassword: currentPw,
        newPassword:     newPw,
        confirmPassword: confirmPw,
      }).then(r => r.data),
    onSuccess: () => {
      toast.success('Password updated!')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update password'),
  })

  const handleProfileSave = (e) => {
    e.preventDefault()
    if (!name.trim())  { toast.error('Name is required');  return }
    if (!email.trim()) { toast.error('Email is required'); return }
    profileMutation.mutate()
  }

  const handlePasswordSave = (e) => {
    e.preventDefault()
    if (!currentPw) { toast.error('Enter your current password'); return }
    if (!newPw)     { toast.error('Enter a new password');        return }
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return }
    if (newPw.length < 8)   { toast.error('Password must be at least 8 characters'); return }
    passwordMutation.mutate()
  }


  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="min-h-screen bg-white">


      <nav className="flex items-center justify-between px-10 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center">
            <LayoutGrid className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">Analytiq</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Projects
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        </div>
      </nav>


      <div className="max-w-2xl mx-auto px-10 py-12">

        <h1 className="text-3xl font-bold text-gray-900 mb-1">Account Settings</h1>
        <p className="text-sm text-gray-400 mb-10">
          Manage your profile, security, and developer preferences.
        </p>


        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Profile</h2>
          <div className="border-t border-gray-200 pt-5">
            <form onSubmit={handleProfileSave} className="space-y-4 max-w-sm">

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={profileMutation.isPending}
                className="h-9 px-5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {profileMutation.isPending ? 'Saving…' : 'Save changes'}
              </button>

            </form>
          </div>
        </section>

        <div className="border-t border-gray-100 mb-10" />


        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Change Password</h2>
          <div className="border-t border-gray-200 pt-5">
            <form onSubmit={handlePasswordSave} className="space-y-4 max-w-sm">

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Current password</label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">New password</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Confirm new password</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={passwordMutation.isPending}
                className="h-9 px-5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {passwordMutation.isPending ? 'Updating…' : 'Update password'}
              </button>

            </form>
          </div>
        </section>

        <div className="border-t border-gray-100 mb-10" />


        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">API &amp; Developer</h2>
          <div className="border-t border-gray-200 pt-5">

            <div className="max-w-sm">
              <label className="block text-sm text-gray-600 mb-1.5">Your user ID</label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex-1 h-10 px-3 flex items-center font-mono text-sm text-gray-700 bg-gray-50">
                  {shortId}
                </div>
                <button
                  onClick={handleCopyId}
                  className="h-10 w-10 flex items-center justify-center border-l border-gray-200 bg-white hover:bg-gray-50 text-gray-500 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Use this ID when reporting bugs or contacting support.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}
