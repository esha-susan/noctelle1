import { useState } from "react"
import "../styles/Star.css"

function Star({ star, onStarClick }) {
  const [isGlowing, setIsGlowing] = useState(false)

  const getGlowLevel = (glowCount) => {
    if (glowCount >= 20) return "glow-4"
    if (glowCount >= 10) return "glow-3"
    if (glowCount >= 5)  return "glow-2"
    if (glowCount >= 1)  return "glow-1"
    return "glow-0"
  }

  const handleClick = () => {
    setIsGlowing(true)
    onStarClick(star)
    setTimeout(() => setIsGlowing(false), 600)
  }

  const glowLevel = getGlowLevel(star.glow_count)

  return (
    <div
      className={`star-letter ${glowLevel} ${isGlowing ? "star-glow-burst" : ""}`}
      style={{
        left: `${star.x}%`,
        top:  `${star.y}%`,
      }}
      onClick={handleClick}
    >
      <div className="star-core" />
      <div className="star-ring" />
    </div>
  )
}

export default Star