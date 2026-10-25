import { describe, expect, it } from 'vitest'
import { ALL_GOALS, ISLANDS } from './islands'
import { NPCS, npcsOf } from './npcs'

describe('NPC data', () => {
  it('uses unique ids', () => {
    expect(new Set(NPCS.map((n) => n.id)).size).toBe(NPCS.length)
  })

  it('places every NPC on an existing island and links real goals', () => {
    const islands = new Set(ISLANDS.map((i) => i.id))
    const goals = new Set(ALL_GOALS.map((g) => g.id))
    for (const n of NPCS) {
      expect(islands.has(n.islandId)).toBe(true)
      if (n.goalId) expect(goals.has(n.goalId)).toBe(true)
      expect(n.lines.length).toBeGreaterThan(0)
    }
  })

  it('links each NPC to a goal on its own island', () => {
    for (const n of NPCS) {
      if (!n.goalId) continue
      expect(ALL_GOALS.find((g) => g.id === n.goalId)!.islandId).toBe(n.islandId)
    }
  })

  it('gives every business zone at least two residents and every island one', () => {
    for (const island of ISLANDS) {
      expect(npcsOf(island.id).length).toBeGreaterThanOrEqual(island.kind === 'main' ? 2 : 1)
    }
  })
})
