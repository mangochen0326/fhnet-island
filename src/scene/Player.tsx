import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3, type Group } from 'three'
import { useGame } from '../store/useGame'
import { GOAL_SPOTS, ISLAND_POS, WORLD } from './layout'
import { runtime } from './runtime'
import { Ball, Box, Cyl } from './props'

const SPEED = 7
const PAUL_RANGE = 3.2
const GOAL_RANGE = 2.8
const NPC_RANGE = 2.4
const MOVE_KEYS: Record<string, [number, number]> = {
  KeyW: [0, 1], ArrowUp: [0, 1],
  KeyS: [0, -1], ArrowDown: [0, -1],
  KeyA: [-1, 0], ArrowLeft: [-1, 0],
  KeyD: [1, 0], ArrowRight: [1, 0],
}

export function Player() {
  const ref = useRef<Group>(null)
  const body = useRef<Group>(null)
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as unknown as { target: Vector3 } | null
  const moveRequest = useGame((s) => s.moveRequest)
  const forward = useRef(new Vector3())
  const wasTalking = useRef(false)

  useEffect(() => {
    if (!moveRequest) return
    const target = ISLAND_POS[moveRequest.islandId]
    // Stop just in front of the landmark, on the side facing the hub.
    const len = Math.hypot(target.x, target.z) || 1
    const dest = { x: target.x - (target.x / len) * 4, z: target.z - (target.z / len) * 4 + (len === 1 ? 4 : 0) }
    runtime.path = WORLD.route({ x: runtime.player.x, z: runtime.player.z }, dest) ?? []
  }, [moveRequest])

  useFrame(({ clock }, rawDt) => {
    const g = ref.current
    if (!g) return
    const dt = Math.min(rawDt, 0.1)
    const before = runtime.player.clone()

    // A dialog that just opened cancels any walk in progress, so the visitor stays put
    // while reading; moving again afterwards closes the dialog.
    const game = useGame.getState()
    const talking = game.talkOpen || game.talkNpcId !== null
    if (talking && !wasTalking.current) runtime.path = []
    wasTalking.current = talking

    // Keyboard input is relative to the camera heading.
    let ix = 0
    let iz = 0
    for (const k of runtime.keys) {
      const m = MOVE_KEYS[k]
      if (m) {
        ix += m[0]
        iz += m[1]
      }
    }
    let moving = false
    if (ix || iz) {
      runtime.path = []
      camera.getWorldDirection(forward.current)
      const fx = forward.current.x
      const fz = forward.current.z
      const fl = Math.hypot(fx, fz) || 1
      const dir = { x: (fx / fl) * iz - (fz / fl) * ix, z: (fz / fl) * iz + (fx / fl) * ix }
      const next = WORLD.tryMove({ x: before.x, z: before.z }, dir, SPEED * dt)
      runtime.player.set(next.x, 0, next.z)
      moving = true
    } else if (runtime.path.length) {
      const wp = runtime.path[0]
      const dx = wp.x - before.x
      const dz = wp.z - before.z
      const d = Math.hypot(dx, dz)
      const stepLen = SPEED * dt
      if (d <= stepLen) {
        runtime.player.set(wp.x, 0, wp.z)
        runtime.path.shift()
      } else {
        runtime.player.set(before.x + (dx / d) * stepLen, 0, before.z + (dz / d) * stepLen)
      }
      moving = true
    }

    if (moving && talking) {
      if (game.talkOpen) game.closeTalk()
      if (game.talkNpcId) game.closeNpc()
    }

    const delta = runtime.player.clone().sub(before)
    g.position.copy(runtime.player)
    if (delta.lengthSq() > 1e-8) {
      g.rotation.y = Math.atan2(delta.x, delta.z)
      camera.position.add(delta)
      controls?.target.add(delta)
    }
    if (body.current) body.current.position.y = moving ? Math.abs(Math.sin(clock.elapsedTime * 12)) * 0.15 : 0

    // Zone and proximity checks feed the HUD prompt and passport.
    const s = useGame.getState()
    s.setCurrentIsland(WORLD.islandAt(runtime.player.x, runtime.player.z))
    let npc: { id: string; d: number } | null = null
    for (const [id, pos] of runtime.npcs) {
      const d = pos.distanceTo(runtime.player)
      if (d < NPC_RANGE && (!npc || d < npc.d)) npc = { id, d }
    }
    if (runtime.player.distanceTo(runtime.paul) < PAUL_RANGE) {
      s.setNearby({ type: 'paul', id: 'paul' })
    } else if (npc) {
      s.setNearby({ type: 'npc', id: npc.id })
    } else {
      let best: { id: string; d: number } | null = null
      for (const spot of GOAL_SPOTS) {
        const d = Math.hypot(spot.pos.x - runtime.player.x, spot.pos.z - runtime.player.z)
        if (d < GOAL_RANGE && (!best || d < best.d)) best = { id: spot.id, d }
      }
      s.setNearby(best ? { type: 'goal', id: best.id } : null)
    }
  })

  return (
    <group ref={ref} position={runtime.player.toArray()}>
      <group ref={body}>
        <Cyl p={[-0.18, 0.3, 0]} r={0.12} h={0.6} c="#2b3a55" />
        <Cyl p={[0.18, 0.3, 0]} r={0.12} h={0.6} c="#2b3a55" />
        <Cyl p={[0, 0.95, 0]} r={0.38} rt={0.32} h={0.8} c="#1d6fb8" />
        <Box p={[0, 0.95, 0.33]} s={[0.4, 0.5, 0.04]} c="#ffb547" />
        <Ball p={[0, 1.6, 0]} r={0.33} c="#f2c9a0" />
        <mesh position={[0, 1.78, 0]}>
          <sphereGeometry args={[0.38, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffd23f" flatShading />
        </mesh>
        <Box p={[0, 1.78, 0.25]} s={[0.6, 0.05, 0.3]} c="#ffd23f" />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.7, 0.9, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <Html position={[0, 2.6, 0]} center zIndexRange={[40, 0]}>
        <span className="you-tag">你，訪客工程師</span>
      </Html>
    </group>
  )
}
