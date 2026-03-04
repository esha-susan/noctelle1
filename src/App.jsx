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

  useEffect(() => {
    fetchLetters()

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

  const fetchLetters = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("letters")
      .select("*")
      .eq("is_private", false)

    if (error) {
      console.error("Error fetching letters:", error.message)
    } else {
      setStars(data)
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

    if (!letter.isPrivate) {
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
  }

  return (
    <div className="app-container">
      <LoadingScreen onComplete={() => setAppReady(true)} />

      <div className="background-layer" />
      <Sky />
      <MusicPlayer />

      <div className="top-bar">
        {user ? (
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button className="signout-btn" onClick={handleSignOut}>
              leave
            </button>
          </div>
        ) : (
          <button
            className="signin-btn"
            onClick={() => setShowAuth(true)}
          >
            ✦ enter
          </button>
        )}
      </div>

      {appReady && !loading && stars.map((star) => (
        <Star
          key={star.id}
          star={star}
          onStarClick={handleStarClick}
        />
      ))}

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
                <button
                  className="glow-btn"
                  onClick={() => handleGlow(selectedStar)}
                >
                  ✦ glow ({selectedStar.glow_count})
                </button>
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