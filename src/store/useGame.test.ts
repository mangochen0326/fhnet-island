import { beforeEach, describe, expect, it } from 'vitest'
import { ALL_GOALS, ISLANDS } from '../data/islands'
import { INTRO_STEPS } from '../data/intro'
import { progress, useGame } from './useGame'

const initial = useGame.getState()

beforeEach(() => {
  localStorage.clear()
  useGame.setState(initial, true)
})

describe('intro', () => {
  it('advances through steps and finishes', () => {
    const { nextIntro } = useGame.getState()
    for (let i = 0; i < INTRO_STEPS.length; i++) nextIntro()
    expect(useGame.getState().introStep).toBe(null)
  })

  it('can be skipped at once', () => {
    useGame.getState().skipIntro()
    expect(useGame.getState().introStep).toBe(null)
  })
})

describe('islands and goals', () => {
  it('opening a goal selects its island and marks it read once', () => {
    const { openGoal } = useGame.getState()
    openGoal('energy-ev')
    openGoal('energy-ev')
    const s = useGame.getState()
    expect(s.selectedIslandId).toBe('energy')
    expect(s.selectedGoalId).toBe('energy-ev')
    expect(s.readGoals).toEqual(['energy-ev'])
  })

  it('ignores unknown goal ids', () => {
    useGame.getState().openGoal('nope')
    expect(useGame.getState().selectedGoalId).toBe(null)
  })

  it('closing an island also closes its goal', () => {
    useGame.getState().openGoal('city-pole')
    useGame.getState().closeIsland()
    const s = useGame.getState()
    expect([s.selectedIslandId, s.selectedGoalId]).toEqual([null, null])
  })

  it('records each island visit once', () => {
    const { visitIsland } = useGame.getState()
    visitIsland('mfg')
    visitIsland('mfg')
    expect(useGame.getState().visitedIslands).toEqual(['mfg'])
  })

  it('travelTo issues an increasing move request for the island', () => {
    useGame.getState().travelTo('cloud')
    const first = useGame.getState().moveRequest!
    useGame.getState().travelTo('cloud')
    const second = useGame.getState().moveRequest!
    expect(first.islandId).toBe('cloud')
    expect(second.seq).toBeGreaterThan(first.seq)
  })
})

describe('interact', () => {
  it('talks to Paul when he is nearby', () => {
    useGame.getState().setNearby({ type: 'paul', id: 'paul' })
    useGame.getState().interact()
    expect(useGame.getState().talkOpen).toBe(true)
  })

  it('opens the nearby goal', () => {
    useGame.getState().setNearby({ type: 'goal', id: 'mfg-agv' })
    useGame.getState().interact()
    expect(useGame.getState().selectedGoalId).toBe('mfg-agv')
  })

  it('does nothing when nothing is nearby', () => {
    useGame.getState().interact()
    const s = useGame.getState()
    expect([s.talkOpen, s.selectedGoalId]).toEqual([false, null])
  })
})

describe('progress', () => {
  it('counts visited islands and read goals against totals', () => {
    useGame.getState().visitIsland('hq')
    useGame.getState().openGoal('hq-profile')
    expect(progress(useGame.getState())).toEqual({
      islands: 1,
      islandTotal: ISLANDS.length,
      goals: 1,
      goalTotal: ALL_GOALS.length,
    })
  })

  it('persists progress to localStorage', () => {
    useGame.getState().openGoal('esg-bio')
    expect(localStorage.getItem('fhnet-island')).toContain('esg-bio')
  })
})
