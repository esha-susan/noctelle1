import { useState } from "react"
import Sky from "./components/Sky"
import MusicPlayer from "./components/MusicPlayer"
import Scroll from "./components/Scroll"

function App() {
  const [stars, setStars] = useState([])

  const handleSend = (letter) => {
    setStars((prevStars) => [...prevStars, letter])
  }

  return (
    <div className="app-container">
      <div className="background-layer" />
      <Sky />
      <MusicPlayer />
      <Scroll onSend={handleSend} />
    </div>
  )
}

export default App