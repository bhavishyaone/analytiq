import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Clock, Filter, Users, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


const features = [
  {
    icon: Clock,
    title: 'Real-time event tracking',
    description: 'Monitor user actions as they happen with zero latency.',
  },
  {
    icon: Filter,
    title: 'Funnel drop-off analysis',
    description: 'Identify exactly where users drop off in your flow.',
  },
  {
    icon: Users,
    title: 'Cohort retention metrics',
    description: 'Deep dive into user retention patterns over time.',
  },
]

export function Login() {

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()




  if (isAuthenticated) return <Navigate to="/projects" replace />

  const validate = () => {
    const newErrors = { email: '', password: '' }
    let valid = true

    if (!email) {
      newErrors.email = 'Email is required'
      valid = false
    } 
    else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address'
      valid = false
    }

    if (!password) {
      newErrors.password = 'Password is required'
      valid = false
    } 
    else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validate()) return
    setLoading(true)

    try {
      await login(email, password)
      navigate('/projects')

    } 
    catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials'
      setLoginError(msg)
    } 
    finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex bg-white">


      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-14 border-r border-gray-100">


        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-600 rotate-45 rounded-sm shrink-0" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">Analytiq</span>
        </div>


        <div className="space-y-10">
          <h1 className="text-5xl font-black text-gray-900 leading-tight">
            The analytics platform built for developers.
          </h1>

          <ul className="space-y-7">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-400">© 2026 Analytiq Inc. All rights reserved.</p>
      </div>


      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm space-y-6">


          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-5 h-5 bg-indigo-600 rotate-45 rounded-sm" />
            <span className="text-lg font-bold text-gray-900">Analytiq</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sign in to Analytiq</h2>
            <p className="mt-1 text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                Create Your account.
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-widest text-gray-500"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="Enter Your Email Address"
                autoComplete="email"
                className={`h-11 text-sm ${errors.email ? 'border-red-400' : ''}`}
                onChange={e => { setEmail(e.target.value); setLoginError('') }}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-widest text-gray-500"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  placeholder="Enter Your Password"
                  autoComplete="current-password"
                  className={`h-11 text-sm pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  onChange={e => { setPassword(e.target.value); setLoginError('') }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base"
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </Button>

            {loginError && (
              <p className="text-sm text-red-500 text-center">{loginError}</p>
            )}

          </form>

          

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">

            <Button
              type="button"
              variant="outline"
              className="h-10 text-sm font-medium"
              onClick={() => toast('GitHub login coming soon.', { icon: '⚠️' })}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.04c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.74-1.33-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.8 1.3 3.48.99.1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.28-1.23 3.28-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-10 text-sm font-medium"
              onClick={() => toast('Google login coming soon.', { icon: '⚠️' })}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>

          </div>

        </div>
      </div>

    </div>
  )
}