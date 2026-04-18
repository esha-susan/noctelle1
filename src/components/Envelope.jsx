import { useEffect, useState } from "react"
import "../styles/Envelope.css"

function Envelope({ onComplete, starX, starY, onStarReveal }) {
  const [phase, setPhase] = useState("open")

  const targetX = (starX / 100) * window.innerWidth
  const targetY = (starY / 100) * window.innerHeight
  const startX = window.innerWidth / 2
  const startY = window.innerHeight - 200

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setPhase("closed")
    }, 700)

    const floatTimer = setTimeout(() => {
      setPhase("floating")
    }, 1400)

    const dissolveTimer = setTimeout(() => {
      setPhase("dissolving")
    }, 3400)

    // reveal the star only after burst completes
    const revealTimer = setTimeout(() => {
      onStarReveal()
    }, 4000)

    const doneTimer = setTimeout(() => {
      onComplete()
    }, 4100)

    return () => {
      clearTimeout(closeTimer)
      clearTimeout(floatTimer)
      clearTimeout(dissolveTimer)
      clearTimeout(revealTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  const getStyle = () => {
    if (phase === "open" || phase === "closed") {
      return {
        left: `${startX}px`,
        top: `${startY}px`,
        transform: "translate(-50%, -50%)"
      }
    }
    if (phase === "floating") {
      return {
        left: `${startX}px`,
        top: `${startY}px`,
        transform: "translate(-50%, -50%)",
        "--tx": `${targetX - startX}px`,
        "--ty": `${targetY - startY}px`,
      }
    }
    if (phase === "dissolving") {
      return {
        left: `${targetX}px`,
        top: `${targetY}px`,
        transform: "translate(-50%, -50%)"
      }
    }
  }

  return (
    <div
      className={`envelope-wrap phase-${phase}`}
      style={getStyle()}
    >
      <img
        className="envelope-img"
        src={phase === "open" ? "/envelope-open.png" : "/envelope-closed.png"}
        alt="envelope"
      />
      {phase === "dissolving" && (
        <div className="envelope-star-burst" />
      )}
    </div>
  )
}

export default Envelope