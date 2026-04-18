import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Sky from "./components/Sky"
import MusicPlayer from "./components/MusicPlayer"
import Scroll from "./components/Scroll"
import Star from "./components/Star"
import AuthModal from "./components/AuthModal"
import LoadingScreen from "./components/LoadingScreen"
import Envelope from "./components/Envelope"
import SkyChooser from "./components/SkyChooser"

function App() {
  const [stars, setStars] = useState([])
  const [pendingStars, setPendingStars] = useState([])
  const [selectedStar, setSelectedStar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [appReady, setAppReady] = useState(false)
  const [skyMode, setSkyMode] = useState("public")
  const [showEnvelope, setShowEnvelope] = useState(false)
  const [pendingStarPos, setPendingStarPos] = useState({ x: 50, y: 20 })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchLetters()
  }, [skyMode, user])

  const fetchLetters = async () => {
    setLoading(true)
    setStars([])

    if (skyMode === "public") {
      const { data, error } = await supabase
        .from("letters")
        .select("*")
        .eq("is_private", false)

      if (error) {
        console.error("Error fetching public letters:", error.message)
      } else {
        setStars(data)
      }

    } else {
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("letters")
        .select("*")
        .eq("is_private", true)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error fetching private letters:", error.message)
      } else {
        setStars(data)
      }
    }

    setLoading(false)
  }

  const handleSend = async (letter) => {
    setPendingStarPos({ x: letter.x, y: letter.y })
    setShowEnvelope(true)

    const { data, error } = await supabase
      .from("letters")
      .insert([{
        title: letter.title,
        message: letter.message,
        is_private: letter.isPrivate,
        x: letter.x,
        y: letter.y,
        glow_count: 0,
        user_id: user ? user.id : null
      }])
      .select()
      .single()

    if (error) {
      console.error("Error saving letter:", error.message)
      setShowEnvelope(false)
      return
    }

    const isCurrentMode =
      (skyMode === "public" && !letter.isPrivate) ||
      (skyMode === "private" && letter.isPrivate)

    if (isCurrentMode) {
      setPendingStars((prev) => [...prev, data])
    }
  }

  const handleStarReveal = () => {
    setStars((prevStars) => [...prevStars, ...pendingStars])
    setPendingStars([])
  }

  const handleStarClick = (star) => {
    setSelectedStar(star)
  }

  const handleCloseViewer = () => {
    setSelectedStar(null)
  }

  const handleGlow = async (star) => {
    const { error } = await supabase
      .from("letters")
      .update({ glow_count: star.glow_count + 1 })
      .eq("id", star.id)

    if (error) {
      console.error("Error updating glow:", error.message)
      return
    }

    setStars((prevStars) =>
      prevStars.map((s) =>
        s.id === star.id
          ? { ...s, glow_count: s.glow_count + 1 }
          : s
      )
    )

    setSelectedStar((prev) => ({
      ...prev,
      glow_count: prev.glow_count + 1
    }))
  }

  const handleDelete = async (star) => {
    const confirmed = window.confirm(
      "are you sure you want to remove this star from the sky?"
    )
    if (!confirmed) return

    const { error } = await supabase
      .from("letters")
      .delete()
      .eq("id", star.id)

    if (error) {
      console.error("Error deleting letter:", error.message)
      return
    }

    setStars((prevStars) =>
      prevStars.filter((s) => s.id !== star.id)
    )
    setSelectedStar(null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSkyMode("public")
  }

  return (
    <div className="app-container">
      <LoadingScreen onComplete={() => setAppReady(true)} />

      <div className="background-layer" />
      <Sky />
      <MusicPlayer />

      {/* top left — auth */}
      <div className="top-bar">
        {user ? (
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button className="signout-btn" onClick={handleSignOut}>
              leave
            </button>
          </div>
        ) : (
          <button className="signin-btn" onClick={() => setShowAuth(true)}>
            ✦ enter
          </button>
        )}
      </div>

      {/* stars */}
      {appReady && !loading && stars.map((star) => (
        <Star
          key={star.id}
          star={star}
          onStarClick={handleStarClick}
        />
      ))}

      {/* loading indicator */}
      {appReady && loading && (
        <div className="sky-loading">
          <span className="sky-loading-dot d1">✦</span>
          <span className="sky-loading-dot d2">✦</span>
          <span className="sky-loading-dot d3">✦</span>
        </div>
      )}

      {/* letter viewer */}
      {selectedStar && (
        <div className="letter-viewer-overlay">
          <div className="letter-viewer-scroll">
            <img
              className="scroll-bg-img"
              src="/scroll-bg.png"
              alt="scroll"
            />
            <div className="viewer-content">
              <p className="viewer-title">✦ {selectedStar.title} ✦</p>
              <p className="viewer-message">{selectedStar.message}</p>
              <div className="viewer-footer">
                {skyMode === "public" && (
                  <button
                    className="glow-btn"
                    onClick={() => handleGlow(selectedStar)}
                  >
                    ✦ glow ({selectedStar.glow_count})
                  </button>
                )}
                <div className="viewer-right-actions">
                  {user && selectedStar.user_id === user.id && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(selectedStar)}
                    >
                      ✦ delete
                    </button>
                  )}
                  <button className="close-btn" onClick={handleCloseViewer}>
                    close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* auth modal */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}

      {/* envelope animation */}
      {showEnvelope && (
        <Envelope
          onComplete={() => setShowEnvelope(false)}
          starX={pendingStarPos.x}
          starY={pendingStarPos.y}
          onStarReveal={handleStarReveal}
        />
      )}

      {/* sky chooser — above write button */}
      <SkyChooser
        skyMode={skyMode}
        setSkyMode={setSkyMode}
        user={user}
        onAuthRequired={() => setShowAuth(true)}
      />

      {/* write button */}
      <Scroll onSend={handleSend} isPrivate={skyMode === "private"} />

    </div>
  )
}

export default App