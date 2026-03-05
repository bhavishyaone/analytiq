import { use, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export function Register(){
  const [name,setName] = useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [errors, setErrors] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading]   = useState(false)


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
      toast.success('Account created! Welcome.')
      navigate('/app')
    }
    catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.')
    } 
    finally {
      setLoading(false)
    }
  }





  return (
    <div>
      <h2>Create your account</h2>
      <p>Already have an account? <Link to="/login">Sign in →</Link></p>
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="name">Full Name</label><br />
          <input
            id="name" type="text" value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter Your Name"
          />
          {errors.name && <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>{errors.name}</span>}
        </div>

        <div>
          <label htmlFor="email">Email Address</label><br />
          <input
            id="email" type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter Youe Email Address"
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="password">Password</label><br />
          <input
            id="password" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {errors.password && <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>{errors.password}</span>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account →'}
        </button>
      </form>
    </div>
  )
}









