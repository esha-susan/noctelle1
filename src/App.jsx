import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Sky from "./components/Sky"
import MusicPlayer from "./components/MusicPlayer"
import Scroll from "./components/Scroll"
import Star from "./components/Star"
import AuthModal from "./components/AuthModal"
import LoadingScreen from "./components/LoadingScreen"

function App() {
  const [stars, setStars] = useState([])
  const [selectedStar, setSelectedStar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [appReady, setAppReady] = useState(false)
  const [skyMode, setSkyMode] = useState("public")

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
      return
    }

    const isCurrentMode =
      (skyMode === "public" && !letter.isPrivate) ||
      (skyMode === "private" && letter.isPrivate)

    if (isCurrentMode) {
      setStars((prevStars) => [...prevStars, data])
    }
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSkyMode("public")
  }

  const toggleSkyMode = () => {
    setSkyMode((prev) => prev === "public" ? "private" : "public")
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

      {/* sky mode toggle — only when logged in */}
      {user && (
        <div className="sky-toggle-wrap">
          <button
            className={`sky-toggle-btn ${skyMode === "public" ? "active" : ""}`}
            onClick={() => setSkyMode("public")}
          >
            ✦ public sky
          </button>
          <span className="sky-toggle-divider">·</span>
          <button
            className={`sky-toggle-btn ${skyMode === "private" ? "active" : ""}`}
            onClick={() => setSkyMode("private")}
          >
            ✦ private sky
          </button>
        </div>
      )}

      {/* stars */}
      {appReady && !loading && stars.map((star) => (
        <Star
          key={star.id}
          star={star}
          onStarClick={handleStarClick}
        />
      ))}

      {/* loading indicator when switching modes */}
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
            <div className="scroll-top-roll">
              <div className="roll-bar" />
            </div>
            <div className="scroll-body viewer-body">
              <p className="scroll-label">✦ {selectedStar.title} ✦</p>
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
                <button className="close-btn" onClick={handleCloseViewer}>
                  close
                </button>
              </div>
            </div>
            <div className="scroll-bottom-roll">
              <div className="roll-bar" />
            </div>
          </div>
        </div>
      )}

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}

      <Scroll onSend={handleSend} />
    </div>
  )
}

export default App