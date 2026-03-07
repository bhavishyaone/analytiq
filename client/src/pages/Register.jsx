import { use, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import { LayoutGrid, CheckSquare, Code2, EyeOff, Eye } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Label } from '../components/ui/label.jsx'


const perks = [
  'Free plan — no credit card needed',
  'Unlimited events on free tier',
  'SDK for Node.js, React, and plain JS',
]


export function Register(){
  const [name,setName] = useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [errors, setErrors] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading]   = useState(false)
  const [showPassword, setShowPassword] = useState(false)



  const navigate = useNavigate()

  const { register } = useAuth()

  const validate = ()=>{
     
    const newErrors = { name: '', email: '', password: '' }
    let valid = true

    if(!name.trim()){
      newErrors.name = "Full name is required"
      valid =false
    }

    if (!email) {
      newErrors.email = "Email is required"
      valid = false
    } 
    else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address"
      valid = false
    }


    if (!password) {
      newErrors.password = 'Password is required'
      valid = false
    } 
    else if (password.length < 8) {
      newErrors.password = 'Password must be at least 6 characters'  

    }

    setErrors(newErrors)
    return valid

  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    if (!validate()){ return}
    setLoading(true)

    try {
      await register(name, email, password)   
      navigate('/projects')
    }
    catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.')
    } 
    finally {
      setLoading(false)
    }
  }





    return (

    <div className="min-h-screen flex bg-white">


      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-14 border-r border-gray-100">


        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Analytiq</span>
        </div>


        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Set up in under 5 minutes.
            </h1>
            <p className="text-indigo-500 text-sm leading-relaxed">
              Join thousands of developers tracking their events with precision.
            </p>
          </div>


          <ul className="space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded border-2 border-indigo-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-indigo-500" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">{perk}</span>
              </li>
            ))}
          </ul>
        </div>


        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Code2 className="w-3.5 h-3.5" />
          <span>Developer-first analytics platform</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm space-y-6">


          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Analytiq</span>
          </div>


          <div>
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-1 text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                Sign in →
              </Link>
            </p>
          </div>


          <form onSubmit={handleSubmit} noValidate className="space-y-4">


            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Full Name
              </Label>
              <Input
                id="name" type="text" value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter Your Name"
                autoComplete="name"
                className={`h-11 text-sm ${errors.name ? 'border-red-400' : ''}`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>


            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Email Address
              </Label>
              <Input
                id="email" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter Your Email Address"
                autoComplete="email"
                className={`h-11 text-sm ${errors.email ? 'border-red-400' : ''}`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>


            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}   
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Your Email Address."
                  autoComplete="new-password"
                  className={`h-11 text-sm pr-10 ${errors.password ? 'border-red-400' : ''}`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>


            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base"
            >
              {loading ? 'Creating account…' : 'Create account →'}
            </Button>

          </form>

        </div>
      </div>

    </div>
  )

}











