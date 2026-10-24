import { ISLANDS, islandPosition, type Island } from '../data/islands'
import { makeWorld, type Vec2 } from '../lib/world'

export const WORLD = makeWorld(ISLANDS.map((i) => ({ id: i.id, r: i.r, link: i.link, ...islandPosition(i) })))

export const ISLAND_POS: Record<string, Vec2> = Object.fromEntries(ISLANDS.map((i) => [i.id, islandPosition(i)]))

// Angle (radians, atan2(x, -z) convention) from an island toward the island it bridges to.
function towardLink(island: Island): number {
  const self = ISLAND_POS[island.id]
  const other = island.link ? ISLAND_POS[island.link] : { x: self.x, z: self.z + 1 }
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
