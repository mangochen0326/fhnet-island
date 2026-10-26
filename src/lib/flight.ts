// Flight paths for the Songshan Airport planes, in the airport's local frame:
// x runs along the runway (planes travel toward -x), y is height above the runway.

export const CYCLE = 26
export const RUNWAY_HALF = 26

export type FlightPose = { x: number; y: number; pitch: number; visible: boolean }

const phase = (t: number) => (((t % CYCLE) + CYCLE) % CYCLE) / CYCLE

// Roll down the runway with increasing speed, rotate, then climb out over the river.
export function takeoff(t: number): FlightPose {
  const T = phase(t)
  if (T < 0.35) {
    const k = T / 0.35
    return { x: 24 - k * k * 24, y: 0, pitch: 0, visible: true }
  }
  if (T < 0.75) {
    const k = (T - 0.35) / 0.4
    return { x: -k * 70, y: k * k * 34, pitch: 0.22, visible: true }
  }
  // Out of sight until the next departure lines up.
  return { x: 24, y: 0, pitch: 0, visible: T > 0.96 }
}

// Glide in from the east, flare, touch down and slow to the apron end.
export function landing(t: number): FlightPose {
  const T = phase(t)
  if (T < 0.4) {
    const k = T / 0.4
    return { x: 80 - k * 58, y: (1 - k) * (1 - k) * 26, pitch: 0.06 * (1 - k), visible: true }
  }
  if (T < 0.65) {
    const k = (T - 0.4) / 0.25
    return { x: 22 - (1 - (1 - k) * (1 - k)) * 36, y: 0, pitch: 0, visible: true }
  }
  return { x: -14, y: 0, pitch: 0, visible: T < 0.78 }
}
