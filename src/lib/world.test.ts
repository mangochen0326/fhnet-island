import { describe, expect, it } from 'vitest'
import { hexContains, makeWorld, segmentDistance } from './world'

const layout = [
  { id: 'hub', x: 0, z: 0, r: 8 },
  { id: 'east', x: 30, z: 0, r: 8, link: 'hub' },
  { id: 'far', x: 60, z: 0, r: 6, link: 'east' },
  { id: 'north', x: 0, z: -30, r: 8, link: 'hub' },
]

describe('hexContains', () => {
  it('contains the center and the pointy tip along z', () => {
    expect(hexContains(0, 0, 10, 0, 0)).toBe(true)
    expect(hexContains(0, 0, 10, 0, 9.9)).toBe(true)
    expect(hexContains(0, 0, 10, 0, 10.1)).toBe(false)
  })

  it('excludes points beyond the flat side along x', () => {
    const half = (10 * Math.sqrt(3)) / 2
    expect(hexContains(0, 0, 10, half - 0.1, 0)).toBe(true)
    expect(hexContains(0, 0, 10, half + 0.1, 0)).toBe(false)
  })

  it('excludes the corner region outside the slanted edge', () => {
    expect(hexContains(0, 0, 10, 8, 8)).toBe(false)
  })
})

describe('segmentDistance', () => {
  it('measures perpendicular and endpoint distance', () => {
    expect(segmentDistance({ x: 5, z: 3 }, { x: 0, z: 0 }, { x: 10, z: 0 })).toBeCloseTo(3)
    expect(segmentDistance({ x: -4, z: 3 }, { x: 0, z: 0 }, { x: 10, z: 0 })).toBeCloseTo(5)
  })
})

describe('makeWorld', () => {
  const world = makeWorld(layout)

  it('creates one bridge per link', () => {
    expect(world.bridges.map((b) => `${b.from}-${b.to}`)).toEqual(['east-hub', 'far-east', 'north-hub'])
  })

  it('treats islands and bridges as walkable and water as not', () => {
    expect(world.walkable(0, 0)).toBe(true)
    expect(world.walkable(15, 0)).toBe(true) // on the hub–east bridge
    expect(world.walkable(15, 5)).toBe(false) // water beside the bridge
    expect(world.walkable(20, -20)).toBe(false)
  })

  it('finds the island under a point', () => {
    expect(world.islandAt(30, 2)).toBe('east')
    expect(world.islandAt(15, 0)).toBe(null)
  })

  it('routes inside one island straight to the target', () => {
    expect(world.route({ x: 0, z: 0 }, { x: 2, z: 3 })).toEqual([{ x: 2, z: 3 }])
  })

  it('routes across islands through bridge ends', () => {
    const path = world.route({ x: 0, z: -30 }, { x: 60, z: 1 })!
    expect(path.at(-1)).toEqual({ x: 60, z: 1 })
    // north -> hub -> east -> far: two waypoints per bridge
    expect(path.length).toBe(7)
    for (const p of path) expect(world.walkable(p.x, p.z)).toBe(true)
  })

  it('refuses to route into water', () => {
    expect(world.route({ x: 0, z: 0 }, { x: 20, z: -20 })).toBe(null)
  })

  it('routes from a bridge to the nearest bridge end first', () => {
    const path = world.route({ x: 14, z: 0 }, { x: 30, z: 0 })!
    expect(path.at(-1)).toEqual({ x: 30, z: 0 })
  })

  it('slides along the shore instead of entering water', () => {
    const next = world.tryMove({ x: 6.5, z: 0 }, { x: 1, z: 1 }, 2)
    expect(world.walkable(next.x, next.z)).toBe(true)
  })
})
