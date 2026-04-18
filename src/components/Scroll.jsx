import { useState } from "react"
import "../styles/Scroll.css"

function Scroll({ onSend, isPrivate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")

  const openScroll = () => setIsOpen(true)

  const closeScroll = () => {
    setIsOpen(false)
    setTitle("")
    setMessage("")
  }

  const handleSend = () => {
    if (title.trim() === "" || message.trim() === "") return
    onSend({
      title,
      message,
      isPrivate,
      id: Date.now(),
      x: Math.random() * 70 + 10,
      y: Math.random() * 45 + 5,
      glowCount: 0
    })
    closeScroll()
  }

  return (
    <>
      <button className="write-btn" onClick={openScroll}>
        ✦ write a letter
      </button>

      {isOpen && (
        <div className="scroll-overlay">
          <div className="scroll-container">
            <img
              className="scroll-bg-img"
              src="/scroll-bg.png"
              alt="scroll"
            />
            <div className="scroll-content">

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
              <p className="char-counter">{message.length}/160</p>
              <div className="scroll-bottom-row">
                <div className="scroll-actions">
                  <button className="send-btn" onClick={handleSend}>
                    ✦ send to sky
                  </button>
                  <button className="close-btn" onClick={closeScroll}>
                    close
                  </button>
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