import { ISLANDS, islandPosition, type Island } from '../data/islands'
import { AIRPORT, RIVERSIDE, SCENIC_AREAS } from '../data/scenic'
import { makeWorld, type Vec2 } from '../lib/world'

// Everything walkable: the islands plus scenic areas such as the riverside park.
const AREAS = [...ISLANDS, ...SCENIC_AREAS]

export const WORLD = makeWorld(AREAS.map((a) => ({ id: a.id, r: a.r, link: a.link, ...islandPosition(a) })))

export const ISLAND_POS: Record<string, Vec2> = Object.fromEntries(AREAS.map((a) => [a.id, islandPosition(a)]))

type Linked = { id: string; link?: string; r: number }

// Angle (radians, atan2(x, -z) convention) from an area toward the area it bridges to.
function towardLink(area: Linked): number {
  const self = ISLAND_POS[area.id]
  const other = area.link ? ISLAND_POS[area.link] : { x: self.x, z: self.z + 1 }
  return Math.atan2(other.x - self.x, -(other.z - self.z))
}

const polar = (center: Vec2, angle: number, dist: number): Vec2 => ({
  x: center.x + Math.sin(angle) * dist,
  z: center.z - Math.cos(angle) * dist,
})

// Goal props sit on a ring around the landmark, skipping the bridge direction.
export function goalSpots(island: Island): Vec2[] {
  const n = island.goals.length
  const base = towardLink(island)
  const step = (Math.PI * 2) / n
  return island.goals.map((_, k) => polar(ISLAND_POS[island.id], base + step * k + step / 2, island.r * 0.58))
}

// Where 小Paul stands when touring this island: beside the bridge path.
export function soapboxSpot(island: Island): Vec2 {
  return polar(ISLAND_POS[island.id], towardLink(island) + 0.45, island.r * 0.6)
}

export const GOAL_SPOTS: { id: string; islandId: string; no: number; pos: Vec2 }[] = ISLANDS.flatMap((island) =>
  goalSpots(island).map((pos, k) => ({ id: island.goals[k].id, islandId: island.id, no: k + 1, pos })),
)

// NPC home spots sit between goal props (or on quarter points of a scenic area),
// away from the bridge path.
export function npcAnchors(area: Linked & { goals?: unknown[] }, count: number): Vec2[] {
  const base = towardLink(area)
  const step = (Math.PI * 2) / (area.goals?.length ?? 4)
  return Array.from({ length: count }, (_, j) => polar(ISLAND_POS[area.id], base + step * (j + 1), area.r * 0.42))
}

// Unit vectors for the riverside scene: `out` points away from HQ across the river,
// `along` runs parallel to the river and the airport runway.
export function riversideFrame() {
  const a = (RIVERSIDE.angle * Math.PI) / 180
  return { center: ISLAND_POS[RIVERSIDE.id], out: { x: Math.sin(a), z: -Math.cos(a) }, along: { x: Math.cos(a), z: Math.sin(a) } }
}

// Corners of the airport platform, in order around the rectangle.
export function airportCorners(): Vec2[] {
  const { center, out, along } = riversideFrame()
  const c = { x: center.x + out.x * AIRPORT.center, z: center.z + out.z * AIRPORT.center }
  const L = AIRPORT.length / 2
  const D = AIRPORT.depth / 2
  return [
    [-L, -D],
    [L, -D],
    [L, D],
    [-L, D],
  ].map(([l, d]) => ({ x: c.x + along.x * l + out.x * d, z: c.z + along.z * l + out.z * d }))
}
