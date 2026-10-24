// Pure geometry for the island map: walkable area, island lookup and routing.
// Islands are hexagons with a vertex pointing along +z (three.js CylinderGeometry
// with 6 radial segments), connected by straight bridges.

export type Vec2 = { x: number; z: number }

export type IslandLayout = { id: string; x: number; z: number; r: number; link?: string }

export type Bridge = { from: string; to: string; a: Vec2; b: Vec2 }

export const BRIDGE_HALF_WIDTH = 1.6
const SHORE_MARGIN = 0.5

export function hexContains(cx: number, cz: number, r: number, x: number, z: number): boolean {
  const dx = Math.abs(x - cx)
  const dz = Math.abs(z - cz)
  return dx <= (r * Math.sqrt(3)) / 2 && dz + dx / Math.sqrt(3) <= r
}

export function segmentDistance(p: Vec2, a: Vec2, b: Vec2): number {
  const abx = b.x - a.x
  const abz = b.z - a.z
  const len2 = abx * abx + abz * abz
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.z - a.z) * abz) / len2))
  return Math.hypot(p.x - (a.x + abx * t), p.z - (a.z + abz * t))
}

// Point inside `from`, halfway between its center and edge, toward `to`.
function bridgeEnd(from: IslandLayout, to: IslandLayout): Vec2 {
  const d = Math.hypot(to.x - from.x, to.z - from.z)
  const k = (from.r * 0.5) / d
  return { x: from.x + (to.x - from.x) * k, z: from.z + (to.z - from.z) * k }
}

export function makeWorld(islands: IslandLayout[]) {
  const byId = new Map(islands.map((i) => [i.id, i]))
  const bridges: Bridge[] = []
  const neighbors = new Map<string, string[]>(islands.map((i) => [i.id, []]))

  for (const island of islands) {
    if (!island.link) continue
    const other = byId.get(island.link)
    if (!other) throw new Error(`Island ${island.id} links to unknown island ${island.link}`)
    bridges.push({ from: island.id, to: other.id, a: { x: island.x, z: island.z }, b: { x: other.x, z: other.z } })
    neighbors.get(island.id)!.push(other.id)
    neighbors.get(other.id)!.push(island.id)
  }

  function islandAt(x: number, z: number): string | null {
    for (const i of islands) if (hexContains(i.x, i.z, i.r, x, z)) return i.id
    return null
  }

  function bridgeAt(x: number, z: number): Bridge | null {
    return bridges.find((b) => segmentDistance({ x, z }, b.a, b.b) <= BRIDGE_HALF_WIDTH) ?? null
  }

  function walkable(x: number, z: number): boolean {
    for (const i of islands) if (hexContains(i.x, i.z, i.r - SHORE_MARGIN, x, z)) return true
    return bridgeAt(x, z) !== null
  }

  // Breadth-first path of island ids from `start` to `goal`, inclusive.
  function islandPath(start: string, goal: string): string[] | null {
    const prev = new Map<string, string | null>([[start, null]])
    const queue = [start]
    while (queue.length) {
      const id = queue.shift()!
      if (id === goal) {
        const path: string[] = []
        for (let cur: string | null = id; cur !== null; cur = prev.get(cur)!) path.unshift(cur)
        return path
      }
      for (const n of neighbors.get(id)!) {
        if (!prev.has(n)) {
          prev.set(n, id)
          queue.push(n)
        }
      }
    }
    return null
  }

  function route(from: Vec2, to: Vec2): Vec2[] | null {
    if (!walkable(to.x, to.z)) return null
    const goal = islandAt(to.x, to.z)
    let start = islandAt(from.x, from.z)
    const waypoints: Vec2[] = []

    if (!start) {
      const bridge = bridgeAt(from.x, from.z)
      if (!bridge) return [to]
      if (!goal) return [to]
      // Leave the bridge toward whichever end is fewer hops from the goal.
      const viaFrom = islandPath(bridge.from, goal)
      const viaTo = islandPath(bridge.to, goal)
      if (!viaFrom && !viaTo) return null
      const useFrom = viaFrom && (!viaTo || viaFrom.length <= viaTo.length)
      start = useFrom ? bridge.from : bridge.to
      const other = useFrom ? bridge.to : bridge.from
      waypoints.push(bridgeEnd(byId.get(start)!, byId.get(other)!))
    }

    if (!goal || goal === start) return [...waypoints, to]

    const path = islandPath(start, goal)
    if (!path) return null
    for (let k = 0; k < path.length - 1; k++) {
      const a = byId.get(path[k])!
      const b = byId.get(path[k + 1])!
      waypoints.push(bridgeEnd(a, b), bridgeEnd(b, a))
    }
    return [...waypoints, to]
  }

  // Move `dist` along `dir`, sliding along one axis when the direct step hits water.
  function tryMove(pos: Vec2, dir: Vec2, dist: number): Vec2 {
    const len = Math.hypot(dir.x, dir.z) || 1
    const dx = (dir.x / len) * dist
    const dz = (dir.z / len) * dist
    const candidates = [
      { x: pos.x + dx, z: pos.z + dz },
      { x: pos.x + dx, z: pos.z },
      { x: pos.x, z: pos.z + dz },
    ]
    return candidates.find((c) => walkable(c.x, c.z)) ?? pos
  }

  return { islands, bridges, walkable, islandAt, route, tryMove }
}

export type World = ReturnType<typeof makeWorld>
