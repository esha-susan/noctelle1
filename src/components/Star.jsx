import { useState } from "react"
import "../styles/Star.css"

function Star({ star, onStarClick }) {
  const [isGlowing, setIsGlowing] = useState(false)

  const handleClick = () => {
    setIsGlowing(true)
    onStarClick(star)
    setTimeout(() => setIsGlowing(false), 600)
  }

  return (
    <div
      className={`star-letter ${isGlowing ? "star-glow-burst" : ""}`}
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
      }}
      onClick={handleClick}
    >
      <div className="star-core" />
      <div className="star-ring" />
    </div>
  )
}

export default Star