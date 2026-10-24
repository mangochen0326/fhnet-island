import { Billboard, Html, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { SRGBColorSpace, type Group } from 'three'
import { ISLANDS } from '../data/islands'
import type { Vec2 } from '../lib/world'
import { useGame } from '../store/useGame'
import { WORLD, soapboxSpot } from './layout'
import { runtime } from './runtime'
import { Box } from './props'

const WALK_SPEED = 3.2
const STAY_SECONDS = 18
const TOUR = ISLANDS.map((i) => i.id)

// 小Paul tours every island, pausing at each soapbox; he waits while someone talks to him.
export function Paul() {
  const ref = useRef<Group>(null)
  const figure = useRef<Group>(null)
  const texture = useTexture(`${import.meta.env.BASE_URL}paul.webp`)
  texture.colorSpace = SRGBColorSpace
  const state = useRef<{ path: Vec2[]; stay: number; index: number }>({ path: [], stay: 6, index: 0 })

  if (runtime.paul.lengthSq() === 0) {
    const start = soapboxSpot(ISLANDS[0])
    runtime.paul.set(start.x, 0, start.z)
  }

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.1)
    const st = state.current
    const game = useGame.getState()
    const busy = game.talkOpen || game.introStep !== null

    if (!st.path.length) {
      if (!busy) st.stay -= dt
      if (st.stay <= 0) {
        st.index = (st.index + 1) % TOUR.length
        const next = soapboxSpot(ISLANDS[st.index])
        st.path = WORLD.route({ x: runtime.paul.x, z: runtime.paul.z }, next) ?? []
        st.stay = STAY_SECONDS
      }
    } else if (!busy) {
      const wp = st.path[0]
      const dx = wp.x - runtime.paul.x
      const dz = wp.z - runtime.paul.z
      const d = Math.hypot(dx, dz)
      const stepLen = WALK_SPEED * dt
      if (d <= stepLen) {
        runtime.paul.set(wp.x, 0, wp.z)
        st.path.shift()
        if (!st.path.length) game.setPaulIsland(TOUR[st.index])
      } else {
        runtime.paul.set(runtime.paul.x + (dx / d) * stepLen, 0, runtime.paul.z + (dz / d) * stepLen)
      }
    }

    ref.current?.position.copy(runtime.paul)
    if (figure.current) {
      const walking = st.path.length > 0 && !busy
      figure.current.position.y = (walking ? Math.abs(Math.sin(clock.elapsedTime * 9)) * 0.12 : 0) + (walking ? 0 : 0.3)
    }
  })

  return (
    <group ref={ref}>
      <Box p={[0, 0.15, 0]} s={[1.1, 0.3, 0.8]} c="#8a6a4a" />
      <group ref={figure}>
        <Billboard position={[0, 1.3, 0]} lockX lockZ>
          <mesh>
            <planeGeometry args={[1.3, 2.6]} />
            <meshBasicMaterial map={texture} transparent alphaTest={0.4} toneMapped={false} />
          </mesh>
        </Billboard>
      </group>
      <Html position={[0, 3.2, 0]} center zIndexRange={[40, 0]}>
        <button type="button" className="paul-tag" onClick={() => useGame.getState().openTalk()} data-testid="paul-tag">
          小Paul
        </button>
      </Html>
    </group>
  )
}
