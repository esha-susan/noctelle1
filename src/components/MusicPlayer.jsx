import { useEffect, useRef, useState } from "react"
import "../styles/MusicPlayer.css"

function MusicPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)


  const fadeIn = (audio) => {
    let vol = 0
    const interval = setInterval(() => {
      if (vol < 0.4) {
        vol = parseFloat((vol + 0.01).toFixed(2))
        audio.volume = vol
      } else {
        clearInterval(interval)
        setIsPlaying(true)
      }
    }, 100)
  }

  useEffect(() => {
    const audio = audioRef.current
    audio.volume = 0
    audio.loop = true

    const startMusic = () => {
      if (!hasStarted) {
        audio.play()
        setHasStarted(true)
        fadeIn(audio)
      }
    }

    window.addEventListener("click", startMusic)

    return () => {
      window.removeEventListener("click", startMusic)
    }
  }, [hasStarted])

  
  const toggleMusic = () => {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className="music-player">
      <audio ref={audioRef} src="/music.mp3" />
      <button className="music-btn" onClick={toggleMusic}>
        {isPlaying ? "⏸" : "►"}
      </button>
    </div>
  )
}

export default MusicPlayer