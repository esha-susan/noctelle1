import { useEffect, useState } from "react"
import "../styles/LoadingScreen.css"

function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState("visible")

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setPhase("fading")
    }, 3500)

    const hideTimer = setTimeout(() => {
      setPhase("hidden")
      onComplete()
    }, 4800)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (phase === "hidden") return null

  return (
    <div className={`loading-screen ${phase === "fading" ? "loading-fade" : ""}`}>

      {/* static background */}
      <div className="loading-bg" />

      {/* shooting stars */}
      <div className="shoot shoot-1" />
      <div className="shoot shoot-2" />
      <div className="shoot shoot-3" />

      {/* animated twinkling stars scattered over the sky */}
      <div className="twinkle-field">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className={`twinkle-dot td-${i}`} />
        ))}
      </div>

      {/* bottom content */}
      <div className="loading-footer">
        <p className="loading-subtitle">a sky full of letters</p>
        <div className="loading-bar-wrap">
          <div className="loading-bar-fill" />
        </div>
        <div className="loading-hint">click anywhere to begin</div>
      </div>

    </div>
  )
}

export default LoadingScreen