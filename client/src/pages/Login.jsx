import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function Login() {

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({ email: '', password: '' })

  const navigate = useNavigate()
  const { login } = useAuth()

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
      toast.success('Welcome back!')
      navigate('/app')           
    } 
    catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Try again.')
    } 
    finally {
      setLoading(false)
    }
  }


  return (
    <div>
      <h2>Sign in to Analytiq</h2>
      <p>
        Don't have an account?{' '}
        <Link to="/register">Create one for free</Link>
      </p>

      <form onSubmit={handleSubmit}>


        <div>
          <label htmlFor="email">Email</label><br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
          
          {errors.email && (
            <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>
              {errors.email}
            </span>
          )}
        </div>


        <div>
          <label htmlFor="password">Password</label><br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {errors.password && (
            <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>
              {errors.password}
            </span>
          )}
        </div>


        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

      </form>
    </div>
  )
}