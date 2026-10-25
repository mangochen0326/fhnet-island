import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Vector3, type Group } from 'three'
import { islandById } from '../data/islands'
import { NPCS, npcsOf, type Npc } from '../data/npcs'
import type { Vec2 } from '../lib/world'
import { useGame } from '../store/useGame'
import { GOAL_SPOTS, ISLAND_POS, WORLD, npcAnchors } from './layout'
import { Ball, Box, Cyl } from './props'
import { runtime } from './runtime'

const WANDER_RADIUS = 1.4
const SPEED = 1.1
// Keep residents on open ground: off the central landmark and the service props.
function isOpenGround(npc: Npc, p: Vec2): boolean {
  if (!WORLD.walkable(p.x, p.z)) return false
  const c = ISLAND_POS[npc.islandId]
  if (Math.hypot(p.x - c.x, p.z - c.z) < (npc.islandId === 'hq' ? 4 : 3)) return false
  return GOAL_SPOTS.every((g) => Math.hypot(g.pos.x - p.x, g.pos.z - p.z) > 1.6)
}

const SKINS = ['#f2c9a0', '#e8b48a', '#d9a27a', '#f5d3b3']
const HAIRS = ['#1f1a17', '#3b2a20', '#5a4030', '#2a2a2a']

// Low-poly resident whose outfit tells their job at a glance.
function Figure({ npc, seed }: { npc: Npc; seed: number }) {
  const skin = SKINS[seed % SKINS.length]
  const hair = HAIRS[seed % HAIRS.length]
  const top = npc.look === 'suit' ? '#2f3e57' : npc.look === 'coat' ? '#f4f6f8' : npc.color
  const legs = npc.look === 'worker' ? '#3d4a5c' : npc.look === 'casual' ? '#4b5d78' : '#2b3442'
  return (
    <group>
      <Cyl p={[-0.13, 0.3, 0]} r={0.1} h={0.6} c={legs} />
      <Cyl p={[0.13, 0.3, 0]} r={0.1} h={0.6} c={legs} />
      <Cyl p={[0, 0.88, 0]} r={0.3} rt={0.26} h={0.66} c={top} />
      {npc.look === 'suit' && <Box p={[0, 0.98, 0.25]} s={[0.07, 0.34, 0.03]} c={npc.color} />}
      {npc.look === 'worker' && <Box p={[0, 0.9, 0.24]} s={[0.4, 0.5, 0.04]} c="#ffb547" />}
      {npc.look === 'coat' && <Box p={[0, 0.7, 0.26]} s={[0.04, 0.5, 0.02]} c="#c9d1da" />}
      <Cyl p={[-0.34, 0.9, 0]} r={0.08} h={0.5} c={top} />
      <Cyl p={[0.34, 0.9, 0]} r={0.08} h={0.5} c={top} />
      <Ball p={[0, 1.45, 0]} r={0.3} c={skin} />
      {npc.look === 'worker' ? (
        <mesh position={[0, 1.58, 0]}>
          <sphereGeometry args={[0.33, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={npc.color} flatShading />
        </mesh>
      ) : npc.look === 'engineer' ? (
        <group>
          <mesh position={[0, 1.6, 0]}>
            <sphereGeometry args={[0.31, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={npc.color} flatShading />
          </mesh>
          <Box p={[0, 1.6, 0.27]} s={[0.36, 0.04, 0.22]} c={npc.color} />
        </group>
      ) : (
        <mesh position={[0, 1.55, -0.02]} scale={[1, 0.8, 1]}>
          <sphereGeometry args={[0.32, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hair} flatShading />
        </mesh>
      )}
      <Ball p={[-0.1, 1.48, 0.27]} r={0.035} c="#2a1f1a" />
      <Ball p={[0.1, 1.48, 0.27]} r={0.035} c="#2a1f1a" />
    </group>
  )
}

function Resident({ npc, home, seed }: { npc: Npc; home: Vec2; seed: number }) {
  const ref = useRef<Group>(null)
  const body = useRef<Group>(null)
  const talked = useGame((s) => s.talkedNpcs.includes(npc.id))
  const openNpc = useGame((s) => s.openNpc)
  const st = useRef({ target: home as Vec2, pause: 1 + (seed % 4), pos: new Vector3(home.x, 0, home.z) })

  // Register the live position so the player can detect proximity.
  useMemo(() => runtime.npcs.set(npc.id, st.current.pos), [npc.id])

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.1)
    const s = st.current
    const game = useGame.getState()
    const talking = game.talkNpcId === npc.id
    const near = s.pos.distanceTo(runtime.player) < 3

    let walking = false
    if (talking || near || game.introStep !== null) {
      // Stop and face the visitor.
      const look = runtime.player.clone().sub(s.pos)
      if (body.current && look.lengthSq() > 1e-6) body.current.rotation.y = Math.atan2(look.x, look.z)
    } else if (s.pause > 0) {
      s.pause -= dt
      if (s.pause <= 0) {
        const a = Math.random() * Math.PI * 2
        const d = Math.random() * WANDER_RADIUS
        const t = { x: home.x + Math.sin(a) * d, z: home.z + Math.cos(a) * d }
        s.target = isOpenGround(npc, t) ? t : home
      }
    } else {
      const dx = s.target.x - s.pos.x
      const dz = s.target.z - s.pos.z
      const d = Math.hypot(dx, dz)
      if (d < 0.05) {
        s.pause = 2 + Math.random() * 4
      } else {
        const step = Math.min(d, SPEED * dt)
        s.pos.set(s.pos.x + (dx / d) * step, 0, s.pos.z + (dz / d) * step)
        if (body.current) body.current.rotation.y = Math.atan2(dx, dz)
        walking = true
      }
    }
    ref.current?.position.copy(s.pos)
    if (body.current) body.current.position.y = walking ? Math.abs(Math.sin(clock.elapsedTime * 8 + seed)) * 0.08 : 0
  })

  return (
    <group ref={ref} position={[home.x, 0, home.z]}>
      <group ref={body}>
        <Figure npc={npc} seed={seed} />
      </group>
      <Html position={[0, 2.3, 0]} center zIndexRange={[35, 0]}>
        <button type="button" className={`npc-tag${talked ? ' is-talked' : ''}`} onClick={() => openNpc(npc.id)} data-testid={`npc-tag-${npc.id}`}>
          {talked ? '✓ ' : '💬 '}
          {npc.role}
        </button>
      </Html>
    </group>
  )
}

export function Npcs() {
  const placed = useMemo(() => {
    const byIsland = new Map<string, Vec2[]>()
    return NPCS.map((npc, seed) => {
      if (!byIsland.has(npc.islandId)) {
        const island = islandById(npc.islandId)!
        byIsland.set(npc.islandId, npcAnchors(island, npcsOf(npc.islandId).length))
      }
      const index = npcsOf(npc.islandId).indexOf(npc)
      return { npc, seed, home: byIsland.get(npc.islandId)![index] }
    })
  }, [])
  return (
    <>
      {placed.map(({ npc, seed, home }) => (
        <Resident key={npc.id} npc={npc} home={home} seed={seed} />
      ))}
    </>
  )
}
