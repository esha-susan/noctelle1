import Star from "./Star"
import "../styles/ConstellationViewer.css"

function ConstellationViewer({ cluster, onStarClick, onClose, skyMode }) {
  return (
    <div className="cv-overlay">

      {/* header */}
      <div className="cv-header">
        <p className="cv-name">✦ {cluster.name}</p>
        <p className="cv-count">{cluster.stars.length} letters</p>
        <button className="cv-close" onClick={onClose}>
          close
        </button>
      </div>

      {/* star field */}
      <div className="cv-sky">

        {/* background stars decorative */}
        <div className="cv-bg-stars" />

        {/* actual letter stars — spread evenly */}
        {cluster.stars.map((star, i) => {
          const cols = Math.ceil(Math.sqrt(cluster.stars.length))
          const row = Math.floor(i / cols)
          const col = i % cols
          const totalRows = Math.ceil(cluster.stars.length / cols)

          const x = 15 + (col / (cols - 1 || 1)) * 70
          const y = 20 + (row / (totalRows - 1 || 1)) * 60

          const spreadStar = {
            ...star,
            x: cols === 1 ? 50 : x,
            y: totalRows === 1 ? 50 : y
          }

          return (
            <Star
              key={star.id}
              star={spreadStar}
              onStarClick={onStarClick}
            />
          )
        })}

        {/* constellation lines inside viewer */}
        <svg className="cv-lines">
          {cluster.stars.map((star, i) => {
            const cols = Math.ceil(Math.sqrt(cluster.stars.length))
            const row = Math.floor(i / cols)
            const col = i % cols
            const totalRows = Math.ceil(cluster.stars.length / cols)
            const x = 15 + (col / (cols - 1 || 1)) * 70
            const y = 20 + (row / (totalRows - 1 || 1)) * 60

            if (i === 0) return null

            const prevCol = (i - 1) % cols
            const prevRow = Math.floor((i - 1) / cols)
            const px = 15 + (prevCol / (cols - 1 || 1)) * 70
            const py = 20 + (prevRow / (totalRows - 1 || 1)) * 60

            return (
              <line
                key={i}
                x1={`${cols === 1 ? 50 : px}%`}
                y1={`${totalRows === 1 ? 50 : py}%`}
                x2={`${cols === 1 ? 50 : x}%`}
                y2={`${totalRows === 1 ? 50 : y}%`}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.8"
                strokeDasharray="3,4"
              />
            )
          })}
        </svg>

      </div>

    </div>
  )
}

export default ConstellationViewer