import { useState } from "react"
import { supabase } from "../supabase"
import "../styles/AuthModal.css"

function AuthModal({ onClose }) {
  const [mode, setMode] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) {
        setError(error.message)
      } else {
        onClose()
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-overlay">
      <div className="auth-container">

        <div className="auth-titlebar">
          <div className="auth-titlebar-dots">
            <div className="auth-dot" />
            <div className="auth-dot" />
            <div className="auth-dot" />
          </div>
          <span className="auth-titlebar-text">
            {mode === "signin" ? "noctelle — sign in" : "noctelle — join"}
          </span>
          <div style={{ width: "42px" }} />
        </div>

        <div className="auth-body">
          {success ? (
            <>
              <p className="auth-label">check your inbox</p>
              <p className="auth-success">
                A confirmation email has been sent to <strong>{email}</strong>. Please verify your email to continue.
              </p>
              <div className="auth-actions">
                <button className="auth-close-btn" onClick={onClose}>
                  close
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="auth-label">
                {mode === "signin" ? "welcome back" : "join the sky"}
              </p>

              <input
                className="auth-input"
                type="email"
                placeholder="your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="auth-input"
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
                  className="auth-submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? "..."
                    : mode === "signin"
                    ? "✦ enter"
                    : "✦ begin"}
                </button>
                <button className="auth-close-btn" onClick={onClose}>
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
            </>
          )}
        </div>

        <div className="auth-footer-bar" />

      </div>
    </div>
  )
}

export default AuthModal