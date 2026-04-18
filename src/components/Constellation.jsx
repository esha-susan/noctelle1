import { getClusterCenter, getConstellationLines } from "../utils/clustering"
import "../styles/Constellation.css"

function Constellation({ cluster, onClick }) {
  const center = getClusterCenter(cluster)
  const lines = getConstellationLines(cluster)
  const isGroup = cluster.stars.length > 1

  return (
    <>
      {/* pixel lines between stars */}
      {isGroup && lines.map((line, i) => (
        <ConstellationLine key={i} line={line} />
      ))}

      {/* invisible clickable area over the cluster center */}
      {isGroup && (
        <div
          className="constellation-label"
          style={{
            left: `${center.x}%`,
            top: `${center.y - 6}%`,
          }}
          onClick={() => onClick(cluster)}
        >
          <span className="constellation-name">{cluster.name}</span>
        </div>
      )}
    </>
  )
}

function ConstellationLine({ line }) {
  // convert percentage positions to actual pixel positions for SVG line
  return (
    <div
      className="constellation-line-wrap"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5
      }}
    >
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "visible"
        }}
      >
        <line
          x1={`${line.x1}%`}
          y1={`${line.y1}%`}
          x2={`${line.x2}%`}
          y2={`${line.y2}%`}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
          strokeDasharray="2,3"
        />
      </svg>
    </div>
  )
}

export default Constellation