import {useState} from 'react'
import {supabase} from '../supabase'
import '../styles/AuthModal.css'

function AuthModal({onClose}){
const[mode,setMode]=useState("signin")
const[email,setEmail]=useState("")
const[password,setPassword]=useState("")
const[error,setError]=useState("")
const[loading,setLoading]=useState(false)

const handleSubmit=async()=>{
    setError("")
    setLoading(true)

    if(mode==="signin"){
        const { error }=await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error){
            setError(error.message)
        }
        else{
            onClose()
        }
        
    }
    else{
        const {error}= await supabase.auth.signUp({
            email,
            password
        })
        if (error){
            setError(error.message)
        }
        else{
            onClose()
        }
    }
    setLoading(false)
}
return (
    <div className="auth-overlay">
      <div className="auth-container">

        <div className="scroll-top-roll">
          <div className="roll-bar" />
        </div>

        <div className="scroll-body auth-body">
          <p className="scroll-label">
            {mode === "signin" ? "welcome back" : "join the sky"}
          </p>

          <input
            className="scroll-input"
            type="email"
            placeholder="your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="scroll-input"
            type="password"
            placeholder="your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <div className="auth-actions">
            <button
              className="send-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "..."
                : mode === "signin"
                ? "✦ enter"
                : "✦ begin"}
            </button>
            <button className="close-btn" onClick={onClose}>
              close
            </button>
          </div>

          <p className="auth-switch">
            {mode === "signin"
              ? "no account yet?"
              : "already have one?"}
            <span
              className="auth-switch-btn"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin")
                setError("")
              }}
            >
              {mode === "signin" ? " join" : " sign in"}
            </span>
          </p>
        </div>

        <div className="scroll-bottom-roll">
          <div className="roll-bar" />
        </div>

      </div>
    </div>
  )
}
export default AuthModal