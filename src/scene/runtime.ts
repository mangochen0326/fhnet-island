import { Vector3 } from 'three'
import type { Vec2 } from '../lib/world'

// Per-frame mutable state shared between scene components; kept out of React/zustand
// so that 60fps updates never trigger re-renders.
export const runtime = {
  player: new Vector3(-1, 0, 5),
  paul: new Vector3(),
  path: [] as Vec2[],
  keys: new Set<string>(),
  npcs: new Map<string, Vector3>(),
}
