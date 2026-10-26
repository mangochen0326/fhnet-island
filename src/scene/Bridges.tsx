import type { ThreeEvent } from '@react-three/fiber'
import { BRIDGE_HALF_WIDTH } from '../lib/world'
import { WORLD } from './layout'

const RADIUS: Record<string, number> = Object.fromEntries(WORLD.islands.map((i) => [i.id, i.r]))

export function Bridges({ onGround }: { onGround: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <>
      {WORLD.bridges.map((b) => {
        const ra = RADIUS[b.from] * 0.8
        const rb = RADIUS[b.to] * 0.8
        const dx = b.b.x - b.a.x
        const dz = b.b.z - b.a.z
        const d = Math.hypot(dx, dz)
        const ux = dx / d
        const uz = dz / d
        // Deck spans from rim to rim, centered between the two rims.
        const start = { x: b.a.x + ux * ra, z: b.a.z + uz * ra }
        const len = d - ra - rb
        const cx = start.x + (ux * len) / 2
        const cz = start.z + (uz * len) / 2
        const yaw = Math.atan2(dx, dz)
        const posts = Math.max(2, Math.round(len / 3))
        return (
          <group key={`${b.from}-${b.to}`} position={[cx, 0, cz]} rotation={[0, yaw, 0]}>
            <mesh position={[0, -0.05, 0]} receiveShadow castShadow onClick={onGround}>
              <boxGeometry args={[BRIDGE_HALF_WIDTH * 2, 0.25, len + 2]} />
              <meshStandardMaterial color="#c9a27a" flatShading />
            </mesh>
            {[-1, 1].map((side) => (
              <group key={side}>
                <mesh position={[side * BRIDGE_HALF_WIDTH, 0.55, 0]}>
                  <boxGeometry args={[0.1, 0.08, len + 2]} />
                  <meshStandardMaterial color="#8a6a4a" />
                </mesh>
                {Array.from({ length: posts + 1 }, (_, k) => (
                  <mesh key={k} position={[side * BRIDGE_HALF_WIDTH, 0.3, -len / 2 + (k * len) / posts]}>
                    <boxGeometry args={[0.14, 0.6, 0.14]} />
                    <meshStandardMaterial color="#8a6a4a" />
                  </mesh>
                ))}
              </group>
            ))}
            {[-len / 3, len / 3].map((z) => (
              <mesh key={z} position={[0, -1.2, z]}>
                <cylinderGeometry args={[0.25, 0.3, 2.2, 6]} />
                <meshStandardMaterial color="#8a7a6a" />
              </mesh>
            ))}
          </group>
        )
      })}
    </>
  )
}
