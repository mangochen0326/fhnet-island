import { describe, expect, it } from 'vitest'
import { makeWorld } from '../lib/world'
import { ALL_GOALS, ISLANDS, SITE, islandPosition, searchIslands } from './islands'

describe('island data', () => {
  it('has one hub, six main and four extension islands', () => {
    const count = (kind: string) => ISLANDS.filter((i) => i.kind === kind).length
    expect([count('hub'), count('main'), count('ext')]).toEqual([1, 6, 4])
  })

  it('uses unique island and goal ids', () => {
    expect(new Set(ISLANDS.map((i) => i.id)).size).toBe(ISLANDS.length)
    expect(new Set(ALL_GOALS.map((g) => g.id)).size).toBe(ALL_GOALS.length)
  })

  it('links every goal to the official site', () => {
    for (const g of ALL_GOALS) expect(g.url.startsWith(SITE)).toBe(true)
  })

  it('connects every island to the hub without overlaps', () => {
    const world = makeWorld(ISLANDS.map((i) => ({ id: i.id, r: i.r, link: i.link, ...islandPosition(i) })))
    for (const island of ISLANDS) {
      const p = islandPosition(island)
      expect(world.islandAt(p.x, p.z)).toBe(island.id)
      expect(world.route({ x: 0, z: 0 }, p)).not.toBeNull()
    }
  })
})

describe('searchIslands', () => {
  it('returns every island for an empty query', () => {
    expect(searchIslands('  ')).toHaveLength(ISLANDS.length)
  })

  it('matches goal text and ignores case', () => {
    expect(searchIslands('agv')).toEqual(expect.arrayContaining(['mfg', 'cases']))
    expect(searchIslands('充電樁')).toContain('energy')
  })

  it('returns nothing for unknown keywords', () => {
    expect(searchIslands('不存在的關鍵字')).toEqual([])
  })
})
