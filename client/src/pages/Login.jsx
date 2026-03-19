import { Link, useNavigate, Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { GoogleLogin } from '@react-oauth/google'
import api from '../services/api.js'
import { useState, useEffect } from 'react'
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
  const { login, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'

  if (isAuthenticated && !isDemo) return <Navigate to="/projects" replace />

  useEffect(() => {
    if (isDemo) {
      if (isAuthenticated) {
        logout()
      }
      setEmail('demo@gmail.com')
      setPassword('demo123')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo])

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


        <Link to="/" className="flex items-center gap-2 cursor-pointer relative z-10 hover:opacity-80 transition-opacity">
          <img src="/logo.svg" alt="Analytiq Logo" className="w-8 h-8 object-contain rounded-lg shrink-0" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">Analytiq</span>
        </Link>


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


      <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-12">
        <div className="w-full max-w-sm space-y-6">


          <Link to="/" className="flex items-center gap-2 lg:hidden cursor-pointer relative z-10 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Analytiq Logo" className="w-8 h-8 object-contain rounded-lg shrink-0" />
            <span className="text-lg font-bold text-gray-900">Analytiq</span>
          </Link>

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

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setEmail('demo@gmail.com')
                setPassword('demo123')
                setLoginError('')
                setErrors({ email: '', password: '' })
                setLoading(true)
                try {
                  await login('demo@gmail.com', 'demo123', true)
                  navigate('/projects')
                } catch {
                  setLoginError('Demo login failed. Run npm run seed first.')
                } finally {
                  setLoading(false)
                }
              }}
              className="w-full h-11 border border-indigo-200 text-indigo-600 text-sm font-semibold rounded-md hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              Try Demo →
            </button>

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

          <div className="flex flex-col space-y-3 items-center w-full">
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    try {
                        const response = await api.post('/auth/google', {
                            idToken: credentialResponse.credential
                        })
                        localStorage.setItem('token', response.data.token)
                        window.location.href = '/projects'
                    } catch (error) {
                        toast.error('Google login failed. Please try again.')
                    }
                }}
                onError={() => {
                    toast.error('Google login was unsuccessful.')
                }}
                shape="rectangular"
                theme="outline"
            />
          </div>

        </div>
      </div>

    </div>
  )
}