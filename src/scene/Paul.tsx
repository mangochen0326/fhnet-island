import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import type { Group } from 'three'
import { ISLANDS } from '../data/islands'
import type { Vec2 } from '../lib/world'
import { useGame } from '../store/useGame'
import { WORLD, soapboxSpot } from './layout'
import { clickToTalk } from './clickable'
import { runtime } from './runtime'
import { Ball, Box, Cyl } from './props'

const WALK_SPEED = 3.2
const STAY_SECONDS = 18
const TOUR = ISLANDS.map((i) => i.id)

// 小Paul tours every island, pausing at each soapbox; he waits while someone talks to him.
export function Paul() {
  const ref = useRef<Group>(null)
  const figure = useRef<Group>(null)
  const arm = useRef<Group>(null)
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

    const before = ref.current?.position.clone()
    ref.current?.position.copy(runtime.paul)
    const walking = st.path.length > 0 && !busy
    if (figure.current) {
      figure.current.position.y = walking ? Math.abs(Math.sin(clock.elapsedTime * 9)) * 0.12 : 0.3
      // Face the walking direction; when standing, turn toward the visitor.
      const look = walking && before ? runtime.paul.clone().sub(before) : runtime.player.clone().sub(runtime.paul)
      if (look.lengthSq() > 1e-6) figure.current.rotation.y = Math.atan2(look.x, look.z)
    }
    // Wave while standing on the soapbox, swing the arm while walking.
    if (arm.current) arm.current.rotation.z = walking ? Math.sin(clock.elapsedTime * 9) * 0.4 : 2.5 + Math.sin(clock.elapsedTime * 6) * 0.35
  })

  return (
    <group ref={ref}>
      <Box p={[0, 0.15, 0]} s={[1.1, 0.3, 0.8]} c="#8a6a4a" />
      <group ref={figure} {...clickToTalk(() => useGame.getState().openTalk())}>
        <PaulFigure arm={arm} />
      </group>
      <Html position={[0, 3.1, 0]} center zIndexRange={[40, 0]}>
        <button type="button" className="paul-tag" onClick={() => useGame.getState().openTalk()} data-testid="paul-tag">
          小Paul
        </button>
      </Html>
    </group>
  )
}

const SUIT = '#243a66'
const SKIN = '#f2c9a0'
const HAIR = '#1f1a17'

// Low-poly figurine of 小Paul: big head, navy suit, striped tie, waving right hand.
// The illustrated portrait is only shown in the talk dialog.
function PaulFigure({ arm }: { arm: RefObject<Group | null> }) {
  return (
    <group>
      {/* legs and shoes */}
      <Cyl p={[-0.17, 0.35, 0]} r={0.13} h={0.7} c={SUIT} />
      <Cyl p={[0.17, 0.35, 0]} r={0.13} h={0.7} c={SUIT} />
      <Box p={[-0.17, 0.05, 0.06]} s={[0.22, 0.1, 0.34]} c="#111" />
      <Box p={[0.17, 0.05, 0.06]} s={[0.22, 0.1, 0.34]} c="#111" />
      {/* jacket, shirt and tie */}
      <Cyl p={[0, 1.05, 0]} r={0.4} rt={0.34} h={0.8} c={SUIT} />
      <Box p={[0, 1.22, 0.3]} s={[0.22, 0.4, 0.06]} c="#e8eef5" />
      <Box p={[0, 1.15, 0.34]} s={[0.08, 0.38, 0.03]} c="#4a6fa5" />
      {/* left arm resting, right arm waving */}
      <Cyl p={[-0.44, 1.05, 0]} r={0.1} h={0.6} c={SUIT} rot={[0, 0, -0.15]} />
      <group ref={arm} position={[0.4, 1.35, 0]}>
        <Cyl p={[0, -0.28, 0]} r={0.1} h={0.56} c={SUIT} />
        <Ball p={[0, -0.6, 0]} r={0.12} c={SKIN} />
      </group>
      {/* oversized head with side-parted hair */}
      <Ball p={[0, 1.85, 0]} r={0.46} c={SKIN} />
      <mesh position={[0, 2.02, -0.04]} scale={[1, 0.75, 1]}>
        <sphereGeometry args={[0.49, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={HAIR} flatShading />
      </mesh>
      <Box p={[-0.12, 2.1, 0.36]} s={[0.5, 0.14, 0.16]} c={HAIR} />
      <Ball p={[-0.15, 1.88, 0.42]} r={0.05} c="#2a1f1a" />
      <Ball p={[0.15, 1.88, 0.42]} r={0.05} c="#2a1f1a" />
      <Box p={[0, 1.7, 0.43]} s={[0.22, 0.05, 0.04]} c="#c0504a" />
      <Ball p={[-0.46, 1.85, 0]} r={0.08} c={SKIN} />
      <Ball p={[0.46, 1.85, 0]} r={0.08} c={SKIN} />
    </group>
  )
}
