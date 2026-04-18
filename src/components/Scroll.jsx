import { useState, useRef, useEffect } from "react"
import "../styles/Scroll.css"

const SCROLL_CONTENT_TOP    = 0.36
const SCROLL_CONTENT_BOTTOM = 0.77
const SCROLL_CONTENT_LEFT   = 0.22
const SCROLL_CONTENT_RIGHT  = 0.77

function useScrollRect(ref, enabled) {
  const [rect, setRect] = useState(null)
  useEffect(() => {
    if (!enabled || !ref.current) return
    const update = () => {
      const el = ref.current
      if (!el) return
      const w = el.offsetWidth
      const h = el.offsetHeight
      setRect({
        top:    h * SCROLL_CONTENT_TOP,
        left:   w * SCROLL_CONTENT_LEFT,
        width:  w * (SCROLL_CONTENT_RIGHT - SCROLL_CONTENT_LEFT),
        height: h * (SCROLL_CONTENT_BOTTOM - SCROLL_CONTENT_TOP),
      })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref, enabled])
  return rect
}

function Scroll({ onSend, isPrivate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const containerRef = useRef(null)
  const rect = useScrollRect(containerRef, isOpen)

  const openScroll  = () => setIsOpen(true)
  const closeScroll = () => { setIsOpen(false); setTitle(""); setMessage("") }

  const handleSend = () => {
    if (title.trim() === "" || message.trim() === "") return
    onSend({
      title, message, isPrivate,
      id: Date.now(),
      x: Math.random() * 70 + 10,
      y: Math.random() * 45 + 5,
      glowCount: 0,
    })
    closeScroll()
  }

  const contentStyle = rect
    ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
    : { visibility: "hidden" }

  return (
    <>
      <button className="write-btn" onClick={openScroll}>
        ✦ write a letter
      </button>

      {isOpen && (
        <div className="scroll-overlay">
          <div className="scroll-container" ref={containerRef}>
            <img className="scroll-bg-img" src="/scroll-bg.png" alt="scroll" />
            <div className="scroll-content" style={contentStyle}>
              <p className="scroll-label">
                {isPrivate ? "✦ private sky" : "✦ public sky"}
              </p>
              <input
                className="scroll-input"
                type="text"
                placeholder="give your star a name..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={40}
              />
              <textarea
                className="scroll-textarea"
                placeholder="write what your heart carries..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={160}
              />
              <div className="scroll-bottom-row">
                <p className="char-counter">{message.length}/160</p>
                <div className="scroll-actions">
                  <button className="send-btn" onClick={handleSend}>✦ send to sky</button>
                  <button className="close-btn" onClick={closeScroll}>close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Scroll