import "../styles/SkyChooser.css"

function SkyChooser({ skyMode, setSkyMode, user, onAuthRequired }) {

  const handlePrivate = () => {
    if (!user) {
      onAuthRequired()
      return
    }
    setSkyMode("private")
  }

  return (
    <div className="sky-chooser">

      <div
        className={`sky-choice ${skyMode === "public" ? "chosen" : ""}`}
        onClick={() => setSkyMode("public")}
      >
        <div className="sky-choice-icon">✦</div>
        <div className="sky-choice-text">
          <p className="sky-choice-title">public sky</p>
          <p className="sky-choice-sub">visible to everyone</p>
        </div>
      </div>

      <div className="sky-choice-divider">·</div>

      <div
        className={`sky-choice ${skyMode === "private" ? "chosen" : ""}`}
        onClick={handlePrivate}
      >
        <div className="sky-choice-icon">✧</div>
        <div className="sky-choice-text">
          <p className="sky-choice-title">private sky</p>
          <p className="sky-choice-sub">only yours to see</p>
        </div>
      </div>

    </div>
  )
}

export default SkyChooser