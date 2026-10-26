import { describe, expect, it } from 'vitest'
import { CYCLE, RUNWAY_HALF, landing, takeoff } from './flight'

const samples = (fn: (t: number) => ReturnType<typeof takeoff>) => Array.from({ length: 400 }, (_, i) => fn((i / 400) * CYCLE))

describe('takeoff', () => {
  it('starts rolling on the runway and ends high above it', () => {
    const start = takeoff(0)
    expect(start.y).toBe(0)
    expect(Math.abs(start.x)).toBeLessThanOrEqual(RUNWAY_HALF)
    const climb = takeoff(CYCLE * 0.65)
    expect(climb.y).toBeGreaterThan(15)
  })

  it('moves smoothly while visible; resets only while hidden', () => {
    const s = samples(takeoff)
    for (let i = 1; i < s.length; i++) {
      if (!s[i].visible || !s[i - 1].visible) continue
      expect(Math.hypot(s[i].x - s[i - 1].x, s[i].y - s[i - 1].y)).toBeLessThan(3)
    }
  })

  it('only leaves the ground after the runway roll', () => {
    for (const p of samples(takeoff)) if (p.visible && p.y > 0) expect(p.x).toBeLessThan(0)
  })
})

describe('landing', () => {
  it('approaches from the sky and touches down on the runway', () => {
    expect(landing(0).y).toBeGreaterThan(15)
    const rolled = landing(CYCLE * 0.6)
    expect(rolled.y).toBe(0)
    expect(Math.abs(rolled.x)).toBeLessThanOrEqual(RUNWAY_HALF)
  })

  it('never sinks below the runway and pitches nose-up only in the air', () => {
    for (const p of samples(landing)) {
      expect(p.y).toBeGreaterThanOrEqual(0)
      if (p.y === 0) expect(p.pitch).toBe(0)
    }
  })

  it('wraps around the cycle', () => {
    expect(landing(CYCLE * 1.25)).toEqual(landing(CYCLE * 0.25))
  })
})
