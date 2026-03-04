import { Link,useNavigate } from "react-router-dom";
import { useAuth} from "../context/AuthContext.jsx";
import { useState } from "react";

export function Login(){

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()   
    setError('')
    setLoading(true)

    try {
      await login(email, password)   
      navigate('/login')               
    } 
    catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } 
    finally {
      setLoading(false)
    }
  }




  return(

    <div>
      <h2>Sign in to Analytiq</h2>
      <p>Don't have an account? <Link to="/register">Create one for free</Link></p>

       {error && <p style={{ color: 'red' }}>{error}</p>}

       <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label><br/>
          <input 
            id="email"
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="Enter your Email."
          />
        </div>
        
        <div>
          <label htmlFor="password">Password</label><br/>
          <input 
            id="password" 
            type="password" 
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="Enter your Password." 
          />
        </div>

        <button type="submit" disabled={loading} >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        </form>
    </div>
  )
}

