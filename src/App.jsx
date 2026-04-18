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
import Constellation from "./components/Constellation"
import ConstellationViewer from "./components/ConstellationViewer"
import { buildConstellations } from "./utils/clustering"

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
  const [selectedConstellation, setSelectedConstellation] = useState(null)

  const constellations = buildConstellations(stars)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

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

      if (!error) setStars(data || [])
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

      if (!error) setStars(data || [])
    }

    setLoading(false)
  }

  const handleSend = async (letter) => {
    setPendingStarPos({ x: letter.x, y: letter.y })
    setShowEnvelope(true)

    const { data, error } = await supabase
      .from("letters")
      .insert([
        {
          title: letter.title,
          message: letter.message,
          is_private: letter.isPrivate,
          x: letter.x,
          y: letter.y,
          glow_count: 0,
          user_id: user ? user.id : null,
        },
      ])
      .select()
      .single()

    if (error) {
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
    setPendingStars((pending) => {
      setStars((prev) => {
        const existingIds = new Set(prev.map((s) => s.id))
        const newOnes = pending.filter((s) => !existingIds.has(s.id))
        return [...prev, ...newOnes]
      })
      return []
    })
  }

  const handleStarClick = (star) => {
    setSelectedStar(star)
  }

  const handleGlow = async (star) => {
    const { error } = await supabase
      .from("letters")
      .update({ glow_count: star.glow_count + 1 })
      .eq("id", star.id)

    if (error) return

    setStars((prev) =>
      prev.map((s) =>
        s.id === star.id ? { ...s, glow_count: s.glow_count + 1 } : s
      )
    )

    setSelectedStar((prev) => ({
      ...prev,
      glow_count: prev.glow_count + 1,
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

    if (error) return

    setStars((prev) => prev.filter((s) => s.id !== star.id))
    setSelectedStar(null)
    setSelectedConstellation(null)
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

      {/* top bar */}
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

      {/* constellations */}
      {appReady &&
        !loading &&
        constellations.map((cluster) => (
          <Constellation
            key={cluster.id}
            cluster={cluster}
            onClick={setSelectedConstellation}
          />
        ))}

      {/* stars */}
      {appReady &&
        !loading &&
        stars.map((star) => (
          <Star key={star.id} star={star} onStarClick={handleStarClick} />
        ))}

      {/* constellation viewer */}
      {selectedConstellation && (
        <ConstellationViewer
          cluster={selectedConstellation}
          onStarClick={handleStarClick}
          onClose={() => setSelectedConstellation(null)}
          skyMode={skyMode}
        />
      )}

      {/* selected star viewer */}
      {selectedStar && (
        <div className="letter-viewer-overlay">
          <div
            className="letter-viewer-scroll"
            ref={(el) => {
              if (!el) return
              const update = () => {
                const w = el.offsetWidth
                const h = el.offsetHeight
                const content = el.querySelector(".viewer-content")
                if (!content) return
                content.style.top        = h * 0.36 + "px"
                content.style.left       = w * 0.22 + "px"
                content.style.width      = w * (0.77 - 0.22) + "px"
                content.style.height     = h * (0.77 - 0.36) + "px"
                content.style.visibility = "visible"
              }
              const ro = new ResizeObserver(update)
              ro.observe(el)
              update()
            }}
          >
            <img className="scroll-bg-img" src="/scroll-bg.png" alt="scroll" />
            <div className="viewer-content" style={{ visibility: "hidden" }}>
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
                  <button
                    className="close-btn"
                    onClick={() => setSelectedStar(null)}
                  >
                    close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* auth */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* envelope */}
      {showEnvelope && (
        <Envelope
          onComplete={() => setShowEnvelope(false)}
          starX={pendingStarPos.x}
          starY={pendingStarPos.y}
          onStarReveal={handleStarReveal}
        />
      )}

      {/* sky chooser */}
      <SkyChooser
        skyMode={skyMode}
        setSkyMode={setSkyMode}
        user={user}
        onAuthRequired={() => setShowAuth(true)}
      />

      {/* write scroll */}
      <Scroll onSend={handleSend} isPrivate={skyMode === "private"} />
    </div>
  )
}

export default App