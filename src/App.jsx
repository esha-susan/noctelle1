import { useState } from "react"
import Sky from "./components/Sky"
import MusicPlayer from "./components/MusicPlayer"
import Scroll from "./components/Scroll"
import Star from "./components/Star"

function App() {
  const [stars, setStars] = useState([])
  const [selectedStar, setSelectedStar] = useState(null)

  const handleSend = (letter) => {
    setStars((prevStars) => [...prevStars, letter])
  }

  const handleStarClick = (star) => {
    setSelectedStar(star)
  }

  const handleCloseViewer = () => {
    setSelectedStar(null)
  }

  return (
    <div className="app-container">
      <div className="background-layer" />
      <Sky />
      <MusicPlayer />

      {stars.map((star) => (
        <Star
          key={star.id}
          star={star}
          onStarClick={handleStarClick}
        />
      ))}

      {selectedStar && (
        <div className="letter-viewer-overlay">
          <div className="letter-viewer-scroll">
            <div className="scroll-top-roll"><div className="roll-bar" /></div>
            <div className="scroll-body viewer-body">
              <p className="scroll-label">✦ {selectedStar.title} ✦</p>
              <p className="viewer-message">{selectedStar.message}</p>
              <div className="scroll-actions">
                <button className="close-btn" onClick={handleCloseViewer}>
                  close
                </button>
              </div>
            </div>
            <div className="scroll-bottom-roll"><div className="roll-bar" /></div>
          </div>
        </div>
      )}

      <Scroll onSend={handleSend} />
    </div>
  )
}

export default App