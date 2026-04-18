const CONSTELLATION_NAMES = [
    "lyra", "selene", "vespera", "noctis",
    "calyx", "anima", "solene", "mira",
    "vesper", "caelum", "lumen", "aura",
    "seren", "nova", "elio", "ciel"
  ]
  
  // calculate distance between two stars
  // x and y are percentages (0-100)
  const distance = (a, b) => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }
  
  // minimum distance to be considered in same cluster
  const CLUSTER_RADIUS = 18
  
  export const buildConstellations = (stars) => {
    const clusters = []
    const assigned = new Set()
  
    stars.forEach((star) => {
      if (assigned.has(star.id)) return
  
      // start new cluster with this star
      const cluster = {
        id: `cluster-${clusters.length}`,
        name: CONSTELLATION_NAMES[clusters.length % CONSTELLATION_NAMES.length],
        stars: [star]
      }
      assigned.add(star.id)
  
      // find all nearby stars not yet assigned
      stars.forEach((other) => {
        if (assigned.has(other.id)) return
        if (distance(star, other) <= CLUSTER_RADIUS) {
          cluster.stars.push(other)
          assigned.add(other.id)
        }
      })
  
      clusters.push(cluster)
    })
  
    return clusters
  }
  
  // get center point of a constellation
  export const getClusterCenter = (cluster) => {
    const avgX = cluster.stars.reduce((sum, s) => sum + s.x, 0) / cluster.stars.length
    const avgY = cluster.stars.reduce((sum, s) => sum + s.y, 0) / cluster.stars.length
    return { x: avgX, y: avgY }
  }
  
  // generate pixel line paths between stars in constellation
  export const getConstellationLines = (cluster) => {
    const lines = []
    const stars = cluster.stars
    if (stars.length < 2) return lines
  
    // connect each star to its nearest neighbor
    stars.forEach((star, i) => {
      let nearest = null
      let nearestDist = Infinity
  
      stars.forEach((other, j) => {
        if (i === j) return
        const d = distance(star, other)
        if (d < nearestDist) {
          nearestDist = d
          nearest = other
        }
      })
  
      if (nearest) {
        // avoid duplicate lines
        const exists = lines.some(
          l => (l.x1 === nearest.x && l.y1 === nearest.y &&
                 l.x2 === star.x && l.y2 === star.y)
        )
        if (!exists) {
          lines.push({
            x1: star.x,
            y1: star.y,
            x2: nearest.x,
            y2: nearest.y
          })
        }
      }
    })
  
    return lines
  }