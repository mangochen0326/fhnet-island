import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { MathUtils, Spherical, Vector3 } from 'three'
import { useGame } from '../store/useGame'

// Distance and tilt for each view: close-up for a business zone, bird's-eye for the map.
const VIEWS = {
  zone: { radius: 22, phi: 0.95 },
  map: { radius: 82, phi: 0.62 },
}
// Wider shots for zones whose scenery lies beyond the island itself.
const ZONE_OVERRIDES: Record<string, { radius: number; phi: number }> = {
  riverside: { radius: 38, phi: 0.85 },
}
const DURATION = 0.9

// Eases the orbit camera between zone and map views while keeping its heading.
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as unknown as { target: Vector3 } | null
  const view = useGame((s) => s.view)
  const anim = useRef<{ from: Spherical; to: Spherical; t: number } | null>(null)

  useEffect(() => {
    if (!controls || view.seq === 0) return
    const from = new Spherical().setFromVector3(camera.position.clone().sub(controls.target))
    const goal = (view.mode === 'zone' && view.islandId && ZONE_OVERRIDES[view.islandId]) || VIEWS[view.mode]
    anim.current = { from, to: new Spherical(goal.radius, goal.phi, from.theta), t: 0 }
  }, [view, camera, controls])

  useFrame((_, dt) => {
    const a = anim.current
    if (!a || !controls) return
    a.t = Math.min(1, a.t + dt / DURATION)
    const k = MathUtils.smootherstep(a.t, 0, 1)
    const s = new Spherical(MathUtils.lerp(a.from.radius, a.to.radius, k), MathUtils.lerp(a.from.phi, a.to.phi, k), a.from.theta)
    camera.position.copy(controls.target).add(new Vector3().setFromSpherical(s))
    camera.lookAt(controls.target)
    if (a.t >= 1) anim.current = null
  })

  return null
}
