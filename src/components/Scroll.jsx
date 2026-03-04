import { useState } from "react"
import "../styles/Scroll.css"

function Scroll({ onSend }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)

  const openScroll = () => {
    setIsOpen(true)
  }

  const closeScroll = () => {
    setIsOpen(false)
    setTitle("")
    setMessage("")
    setIsPrivate(false)
  }

  const handleSend = () => {
    if (title.trim() === "" || message.trim() === "") return

    onSend({
      title,
      message,
      isPrivate,
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 50 + 5,
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

            <div className="scroll-top-roll">
              <div className="roll-bar" />
            </div>

            <div className="scroll-body">
              <p className="scroll-label">a letter to the sky</p>

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
                maxLength={300}
              />

              <div className="scroll-options">
                <label className="privacy-label">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  private sky
                </label>
              </div>

              <div className="scroll-actions">
                <button className="send-btn" onClick={handleSend}>
                  ✦ send to sky
                </button>
                <button className="close-btn" onClick={closeScroll}>
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
    </>
  )
}

export default Scroll