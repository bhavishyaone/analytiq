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
  const [profileError, setProfileError] = useState('')


  const [currentPw,  setCurrentPw]  = useState('')
  const [newPw,      setNewPw]      = useState('')
  const [confirmPw,  setConfirmPw]  = useState('')
  const [passwordError, setPasswordError] = useState('')


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
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed')
    }
  }


  const profileMutation = useMutation({
    mutationFn: () => api.patch('/auth/me', { name: name.trim(), email: email.trim() }).then(r => r.data),
    onSuccess: (res) => {
      updateUser({ name: res.user.name, email: res.user.email })
      setProfileError('')
    },
    onError: (err) => setProfileError(err.response?.data?.message || 'Failed to update profile'),
  })


  const passwordMutation = useMutation({
    mutationFn: () =>
      api.patch('/auth/me', {
        currentPassword: currentPw,
        newPassword:     newPw,
        confirmPassword: confirmPw,
      }).then(r => r.data),
    onSuccess: () => {
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setPasswordError('')
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update password'
      setPasswordError(msg)
    },
  })

  const handleProfileSave = (e) => {
    e.preventDefault()
    setProfileError('')
    if (!name.trim())  { setProfileError('Name is required');  return }
    if (!email.trim()) { setProfileError('Email is required'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setProfileError('Invalid email address'); return }
    profileMutation.mutate()
  }

  const handlePasswordSave = (e) => {
    e.preventDefault()
    setPasswordError('')
    if (!currentPw) { setPasswordError('Enter your current password'); return }
    if (!newPw)     { setPasswordError('Enter a new password');        return }
    if (newPw !== confirmPw) { setPasswordError('Passwords do not match'); return }
    if (newPw.length < 8)   { setPasswordError('Password must be at least 8 characters'); return }
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
            <form onSubmit={handleProfileSave} noValidate className="space-y-4 max-w-sm">

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

              {profileError && (
                <p className="text-sm text-red-500 mt-1">{profileError}</p>
              )}

            </form>
          </div>
        </section>

        <div className="border-t border-gray-100 mb-10" />


        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Change Password</h2>
          <div className="border-t border-gray-200 pt-5">
            <form onSubmit={handlePasswordSave} noValidate className="space-y-4 max-w-sm">

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

              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}

            </form>
          </div>
        </section>

      </div>
    </div>
  )
}
