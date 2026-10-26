import { describe, expect, it } from 'vitest'
import { WORLD, airportCorners } from '../scene/layout'
import { ISLANDS, islandPosition } from './islands'
import { NPCS, npcsOf } from './npcs'
import { RIVERSIDE, scenicById } from './scenic'

const parkPos = islandPosition(RIVERSIDE)

describe('riverside park', () => {
  it('is walkable and reachable from HQ over a bridge', () => {
    expect(WORLD.islandAt(parkPos.x, parkPos.z)).toBe('riverside')
    expect(WORLD.route({ x: 0, z: 4 }, parkPos)).not.toBeNull()
  })

  it('keeps clear of every island', () => {
    for (const island of ISLANDS) {
      const p = islandPosition(island)
      expect(Math.hypot(p.x - parkPos.x, p.z - parkPos.z)).toBeGreaterThan(island.r + RIVERSIDE.r + 4)
    }
  })

  it('has residents to talk to', () => {
    expect(npcsOf('riverside').length).toBeGreaterThanOrEqual(2)
    expect(scenicById('riverside')).toBe(RIVERSIDE)
  })
})

describe('Songshan Airport', () => {
  const corners = airportCorners()

  it('sits in open water, off every island and the park', () => {
    // Sample the airport footprint and make sure none of it is walkable ground.
    const [a, b, , d] = corners
    for (let i = 0; i <= 20; i++) {
      for (let j = 0; j <= 20; j++) {
        const x = a.x + ((b.x - a.x) * i) / 20 + ((d.x - a.x) * j) / 20
        const z = a.z + ((b.z - a.z) * i) / 20 + ((d.z - a.z) * j) / 20
        expect(WORLD.walkable(x, z)).toBe(false)
      }
    }
  })

  it('stays farther out than the park', () => {
    for (const c of corners) expect(Math.hypot(c.x, c.z)).toBeGreaterThan(Math.hypot(parkPos.x, parkPos.z))
  })
})

describe('NPC placement', () => {
  it('only places residents on islands or scenic areas', () => {
    for (const n of NPCS) expect(ISLANDS.some((i) => i.id === n.islandId) || scenicById(n.islandId)).toBeTruthy()
  })
})
