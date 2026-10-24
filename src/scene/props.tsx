import { useFrame } from '@react-three/fiber'
import { useRef, type ReactNode } from 'react'
import type { Group } from 'three'

// Low-poly building blocks. Positions are local to the prop's group.
type V3 = [number, number, number]

export function Box({ p = [0, 0, 0], s = [1, 1, 1], c, e }: { p?: V3; s?: V3; c: string; e?: boolean }) {
  return (
    <mesh position={p} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} emissive={e ? c : '#000'} emissiveIntensity={e ? 0.6 : 0} flatShading />
    </mesh>
  )
}

export function Cyl({ p = [0, 0, 0], r = 0.5, rt, h = 1, c, seg = 8, rot }: { p?: V3; r?: number; rt?: number; h?: number; c: string; seg?: number; rot?: V3 }) {
  return (
    <mesh position={p} rotation={rot} castShadow receiveShadow>
      <cylinderGeometry args={[rt ?? r, r, h, seg]} />
      <meshStandardMaterial color={c} flatShading />
    </mesh>
  )
}

export function Ball({ p = [0, 0, 0], r = 0.5, c, e }: { p?: V3; r?: number; c: string; e?: boolean }) {
  return (
    <mesh position={p} castShadow>
      <icosahedronGeometry args={[r, 1]} />
      <meshStandardMaterial color={c} emissive={e ? c : '#000'} emissiveIntensity={e ? 0.8 : 0} flatShading />
    </mesh>
  )
}

function Spin({ children, speed = 1, axis = 'y', p }: { children: ReactNode; speed?: number; axis?: 'x' | 'y' | 'z'; p?: V3 }) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation[axis] += dt * speed
  })
  return (
    <group ref={ref} position={p}>
      {children}
    </group>
  )
}

export function Tree({ p = [0, 0, 0], s = 1 }: { p?: V3; s?: number }) {
  return (
    <group position={p} scale={s}>
      <Cyl p={[0, 0.4, 0]} r={0.12} h={0.8} c="#8a6a4a" />
      <Cyl p={[0, 1.3, 0]} r={0.7} rt={0} h={1.6} c="#5f9e5a" seg={7} />
    </group>
  )
}

const WIN = '#ffe9a8'

function Windows({ w, h, d, rows, y0 = 0.6 }: { w: number; h: number; d: number; rows: number; y0?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <Box key={i} p={[0, y0 + (i * (h - y0)) / rows, d / 2 + 0.01]} s={[w * 0.8, 0.18, 0.02]} c={WIN} e />
      ))}
    </>
  )
}

// ---- landmarks (island centers) -------------------------------------------

export function Landmark({ id }: { id: string }) {
  switch (id) {
    case 'hq':
      return (
        <group>
          <Box p={[0, 3, 0]} s={[3, 6, 3]} c="#3d6fb6" />
          <Windows w={3} h={6} d={3} rows={7} />
          <Box p={[0, 6.4, 0]} s={[2, 0.8, 2]} c="#2b4f86" />
          <Cyl p={[0, 7.6, 0]} r={0.06} h={1.6} c="#ccc" />
          <Ball p={[0, 8.5, 0]} r={0.18} c="#ff6b5a" e />
          <Box p={[2.6, 1, 0]} s={[2.2, 2, 2.4]} c="#7aa3dc" />
          <Box p={[-2.6, 0.8, 0.4]} s={[2, 1.6, 2]} c="#a9c4ea" />
        </group>
      )
    case 'city':
      return (
        <group>
          <Box p={[0, 2.2, 0]} s={[2, 4.4, 2]} c="#7fb8d4" />
          <Windows w={2} h={4.4} d={2} rows={5} />
          <Box p={[1.8, 1.4, 0.4]} s={[1.4, 2.8, 1.4]} c="#a3cfe3" />
          <Box p={[-1.7, 1, -0.2]} s={[1.3, 2, 1.6]} c="#5d9cbd" />
        </group>
      )
    case 'mfg':
      return (
        <group>
          <Box p={[0, 1.2, 0]} s={[4, 2.4, 3]} c="#e8c27a" />
          {[-1.3, 0, 1.3].map((x) => (
            <Box key={x} p={[x, 2.75, 0]} s={[1.2, 0.7, 3]} c="#c98f3a" />
          ))}
          <Cyl p={[1.6, 3.2, -1]} r={0.25} h={2} c="#999" />
        </group>
      )
    case 'cloud':
      return (
        <group>
          <Box p={[0, 1, 0]} s={[2.6, 2, 2.6]} c="#ece7ff" />
          <Windows w={2.6} h={2} d={2.6} rows={2} y0={0.5} />
          <Spin speed={0.3} p={[0, 4.2, 0]}>
            <Ball p={[0, 0, 0]} r={1} c="#fff" />
            <Ball p={[0.9, -0.2, 0]} r={0.7} c="#f4f1ff" />
            <Ball p={[-0.9, -0.2, 0.1]} r={0.75} c="#f4f1ff" />
          </Spin>
        </group>
      )
    case 'energy':
      return <WindTurbine />
    case 'eng':
      return (
        <group>
          <Box p={[0, 1, 0]} s={[3, 2, 2.4]} c="#e7a493" />
          <Windows w={3} h={2} d={2.4} rows={2} y0={0.5} />
          <Box p={[0, 2.2, 0]} s={[3.2, 0.3, 2.6]} c="#a8503e" />
        </group>
      )
    case 'agents':
      return (
        <group>
          <Cyl p={[0, 0.15, 0]} r={2.2} h={0.3} c="#eee" seg={6} />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <Cyl key={k} p={[Math.sin((k * Math.PI) / 3) * 1.8, 1.4, Math.cos((k * Math.PI) / 3) * 1.8]} r={0.1} h={2.4} c="#fff" />
          ))}
          <Cyl p={[0, 2.8, 0]} r={2.4} rt={0.3} h={1} c="#d78fb2" seg={6} />
          <Box p={[0, 0.8, 0]} s={[0.8, 1, 0.8]} c="#555" />
        </group>
      )
    case 'news':
      return <FerrisWheel />
    case 'cases':
      return (
        <group>
          <Box p={[0, 0.3, 0]} s={[2.4, 0.6, 1]} c="#ddd" />
          <Box p={[0, 0.9, 0]} s={[0.8, 0.6, 1]} c="#ddd" />
          <Cyl p={[0, 1.6, 0]} r={0.15} rt={0.45} h={0.8} c="#f0c040" />
          <Ball p={[0, 2.2, 0]} r={0.2} c="#f0c040" e />
        </group>
      )
    case 'esg':
      return (
        <group>
          <Tree s={1.8} />
          <Tree p={[1.5, 0, 1]} s={1.1} />
          <Tree p={[-1.4, 0, 0.8]} s={1.2} />
        </group>
      )
    case 'offices':
      return (
        <group>
          <Cyl p={[0, 0.6, 0]} r={1.4} h={1.2} c="#c9d1da" seg={6} />
          <Box p={[0, 1.6, 0]} s={[1.6, 0.8, 0.2]} c="#2b4f86" />
        </group>
      )
    default:
      return null
  }
}

function WindTurbine() {
  return (
    <group>
      <Cyl p={[0, 3, 0]} r={0.22} rt={0.12} h={6} c="#f2f2f2" />
      <Spin axis="z" speed={1.6} p={[0, 6, 0.3]}>
        {[0, 1, 2].map((k) => (
          <group key={k} rotation={[0, 0, (k * Math.PI * 2) / 3]}>
            <Box p={[0, 1.4, 0]} s={[0.25, 2.8, 0.06]} c="#fff" />
          </group>
        ))}
        <Ball r={0.25} c="#ddd" />
      </Spin>
    </group>
  )
}

function FerrisWheel() {
  return (
    <group>
      <Box p={[0.6, 2, 0]} s={[0.15, 4, 0.15]} c="#888" />
      <Box p={[-0.6, 2, 0]} s={[0.15, 4, 0.15]} c="#888" />
      <Spin axis="x" speed={0.4} p={[0, 4, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[2.6, 0.08, 6, 24]} />
          <meshStandardMaterial color="#f3b24a" />
        </mesh>
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k * Math.PI) / 4
          return <Box key={k} p={[0, Math.sin(a) * 2.6, Math.cos(a) * 2.6]} s={[0.5, 0.4, 0.4]} c={['#ff7a6b', '#5fb3e8', '#8ad07a', '#ffd166'][k % 4]} />
        })}
      </Spin>
    </group>
  )
}

function Agv() {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime * 0.8
    ref.current.position.set(Math.sin(t) * 1.2, 0.2, Math.cos(t) * 0.8)
    ref.current.rotation.y = t + Math.PI / 2
  })
  return (
    <group ref={ref}>
      <Box s={[0.9, 0.3, 0.6]} c="#f5a623" />
      <Box p={[0, 0.35, 0]} s={[0.6, 0.4, 0.5]} c="#c88a4a" />
    </group>
  )
}

function Drone() {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = 2.4 + Math.sin(clock.elapsedTime * 2) * 0.2
  })
  return (
    <group ref={ref}>
      <Box s={[0.5, 0.15, 0.5]} c="#333" />
      {[-1, 1].map((x) => [-1, 1].map((z) => <Cyl key={`${x}${z}`} p={[x * 0.35, 0.1, z * 0.35]} r={0.18} h={0.03} c="#9cd" />))}
    </group>
  )
}

// ---- goal props -------------------------------------------------------------

export function GoalProp({ id }: { id: string }) {
  switch (id) {
    // hq
    case 'hq-profile':
      return (
        <group>
          <Box p={[0, 0.8, 0]} s={[0.3, 1.6, 0.3]} c="#555" />
          <Box p={[0, 1.6, 0]} s={[1.4, 0.9, 0.12]} c="#3d6fb6" e />
        </group>
      )
    case 'hq-milestone':
      return (
        <group>
          {[0, 1, 2, 3].map((k) => (
            <Box key={k} p={[k * 0.5 - 0.75, 0.25 + k * 0.25, 0]} s={[0.45, 0.5 + k * 0.5, 0.45]} c={['#a9c4ea', '#7aa3dc', '#3d6fb6', '#2b4f86'][k]} />
          ))}
        </group>
      )
    case 'hq-team':
      return (
        <group>
          <Cyl p={[0, 0.5, 0]} r={0.8} h={0.1} c="#c9a27a" />
          <Cyl p={[0, 0.25, 0]} r={0.1} h={0.5} c="#777" />
          {[0, 1, 2, 3].map((k) => (
            <Box key={k} p={[Math.sin((k * Math.PI) / 2) * 1.1, 0.25, Math.cos((k * Math.PI) / 2) * 1.1]} s={[0.35, 0.5, 0.35]} c="#2b4f86" />
          ))}
        </group>
      )
    // city
    case 'city-pole':
      return (
        <group>
          <Cyl p={[0, 1.6, 0]} r={0.1} h={3.2} c="#6c7a89" />
          <Box p={[0.4, 3.1, 0]} s={[0.8, 0.12, 0.25]} c="#6c7a89" />
          <Ball p={[0.75, 2.95, 0]} r={0.16} c="#fff3b0" e />
          <Box p={[0, 1.8, 0.14]} s={[0.35, 0.6, 0.1]} c="#4fa3c7" e />
        </group>
      )
    case 'city-busstop':
      return (
        <group>
          <Box p={[0, 1.2, -0.3]} s={[1.8, 1.4, 0.08]} c="#bfe3f2" />
          <Box p={[0, 1.95, 0]} s={[2, 0.1, 0.8]} c="#3a7ca5" />
          <Box p={[0, 0.45, 0]} s={[1.4, 0.1, 0.4]} c="#8a6a4a" />
          <Box p={[1.1, 1.1, 0.1]} s={[0.1, 1.2, 0.6]} c="#2b4f86" e />
        </group>
      )
    case 'city-ami':
      return (
        <group>
          <Box p={[0, 0.7, 0]} s={[1.4, 1.4, 1.4]} c="#f1e3c8" />
          <Cyl p={[0, 1.75, 0]} r={1.1} rt={0} h={0.8} c="#c0573e" seg={4} />
          <Box p={[0.72, 0.8, 0]} s={[0.06, 0.4, 0.3]} c="#7fe08a" e />
        </group>
      )
    case 'city-rescue':
      return (
        <group>
          <Box p={[0, 0.45, 0]} s={[1.8, 0.8, 0.9]} c="#e2483d" />
          <Box p={[0.6, 0.95, 0]} s={[0.6, 0.3, 0.8]} c="#bfe3f2" />
          <Drone />
        </group>
      )
    // mfg
    case 'mfg-agv':
      return (
        <group>
          <Cyl p={[0, 0.03, 0]} r={1.5} h={0.04} c="#f7d488" seg={16} />
          <Agv />
        </group>
      )
    case 'mfg-ai':
      return (
        <group>
          <Box p={[0, 0.4, 0]} s={[2, 0.2, 0.6]} c="#555" />
          {[-0.6, 0, 0.6].map((x) => (
            <Box key={x} p={[x, 0.6, 0]} s={[0.3, 0.2, 0.3]} c="#e0a03a" />
          ))}
          <Box p={[0, 1.5, 0]} s={[0.1, 1.8, 0.1]} c="#777" />
          <Box p={[0, 1.4, 0.2]} s={[0.3, 0.25, 0.4]} c="#222" />
          <Ball p={[0, 1.4, 0.42]} r={0.08} c="#ff4d4d" e />
        </group>
      )
    case 'mfg-asrs':
      return (
        <group>
          {[0, 1, 2].map((y) =>
            [0, 1, 2].map((x) => <Box key={`${x}${y}`} p={[x * 0.6 - 0.6, 0.35 + y * 0.6, 0]} s={[0.5, 0.45, 0.6]} c={['#d9a066', '#c48a4f', '#e6b87d'][(x + y) % 3]} />),
          )}
          <Box p={[0, 1.9, 0]} s={[2, 0.08, 0.8]} c="#8899aa" />
        </group>
      )
    case 'mfg-iiot':
      return (
        <group>
          <Box p={[0, 0.6, 0]} s={[1.4, 1.2, 1]} c="#9aa5b1" />
          <Box p={[0, 1.8, 0]} s={[1.2, 0.8, 0.1]} c="#1f3b57" />
          <Box p={[-0.3, 1.8, 0.06]} s={[0.4, 0.4, 0.02]} c="#7fe08a" e />
          <Box p={[0.3, 1.75, 0.06]} s={[0.4, 0.3, 0.02]} c="#4fa3c7" e />
        </group>
      )
    // cloud
    case 'cloud-air':
      return (
        <group>
          <Cyl p={[0, 1, 0]} r={0.08} h={2} c="#888" />
          <Box p={[0, 1.8, 0.12]} s={[0.5, 0.6, 0.25]} c="#f4f1ff" />
          <Ball p={[0, 2.25, 0]} r={0.12} c="#7fe08a" e />
        </group>
      )
    case 'cloud-ething':
      return (
        <group>
          {[-0.45, 0.45].map((x) => (
            <group key={x}>
              <Box p={[x, 0.9, 0]} s={[0.7, 1.8, 0.8]} c="#2f2f3a" />
              {[0.4, 0.8, 1.2, 1.6].map((y) => (
                <Box key={y} p={[x, y, 0.41]} s={[0.5, 0.08, 0.02]} c="#8c7bd6" e />
              ))}
            </group>
          ))}
        </group>
      )
    case 'cloud-face':
      return (
        <group>
          {[-0.6, 0.6].map((x) => (
            <Box key={x} p={[x, 0.5, 0]} s={[0.25, 1, 0.9]} c="#ccc" />
          ))}
          <Box p={[0.6, 1.15, 0]} s={[0.2, 0.3, 0.2]} c="#222" />
          <Box p={[0, 0.7, 0]} s={[0.9, 0.06, 0.06]} c="#ff6b5a" e />
        </group>
      )
    case 'cloud-property':
      return (
        <group>
          <Box p={[0, 1.3, 0]} s={[1.4, 2.6, 1.2]} c="#c9bff0" />
          <Windows w={1.4} h={2.6} d={1.2} rows={4} />
        </group>
      )
    // energy
    case 'energy-solar':
      return (
        <group>
          {[-0.7, 0.7].map((x) =>
            [-0.5, 0.5].map((z) => (
              <group key={`${x}${z}`} position={[x, 0.6, z]}>
                <Cyl p={[0, -0.3, 0]} r={0.05} h={0.6} c="#777" />
                <mesh rotation={[-0.5, 0, 0]} castShadow>
                  <boxGeometry args={[1.2, 0.05, 0.8]} />
                  <meshStandardMaterial color="#1f3b78" metalness={0.4} roughness={0.3} />
                </mesh>
              </group>
            )),
          )}
        </group>
      )
    case 'energy-storage':
      return (
        <group>
          <Box p={[0, 0.6, 0]} s={[2.2, 1.2, 1]} c="#e8eef2" />
          {[-0.7, 0, 0.7].map((x) => (
            <Box key={x} p={[x, 0.6, 0.51]} s={[0.5, 0.9, 0.02]} c="#5fb36b" />
          ))}
        </group>
      )
    case 'energy-battery':
      return (
        <group>
          {[-0.5, 0, 0.5].map((x) => (
            <group key={x}>
              <Cyl p={[x, 0.5, 0]} r={0.2} h={1} c="#3c8f4a" />
              <Cyl p={[x, 1.05, 0]} r={0.08} h={0.1} c="#ddd" />
            </group>
          ))}
        </group>
      )
    case 'energy-ev':
      return (
        <group>
          <Box p={[-0.8, 0.7, 0]} s={[0.5, 1.4, 0.35]} c="#f2f2f2" />
          <Box p={[-0.8, 1, 0.18]} s={[0.3, 0.3, 0.02]} c="#5fb36b" e />
          <Box p={[0.5, 0.35, 0]} s={[1.6, 0.4, 0.8]} c="#4a90d9" />
          <Box p={[0.4, 0.75, 0]} s={[0.9, 0.4, 0.7]} c="#bfe3f2" />
        </group>
      )
    // eng
    case 'eng-5g':
      return (
        <group>
          <Cyl p={[0, 2, 0]} r={0.5} rt={0.12} h={4} c="#c0c6cc" seg={4} />
          {[0, 1, 2].map((k) => (
            <group key={k} rotation={[0, (k * Math.PI * 2) / 3, 0]}>
              <Box p={[0, 3.6, 0.3]} s={[0.25, 0.7, 0.1]} c="#fff" />
            </group>
          ))}
          <Ball p={[0, 4.1, 0]} r={0.1} c="#ff4d4d" e />
        </group>
      )
    case 'eng-room':
      return (
        <group>
          {[-0.6, 0, 0.6].map((x) => (
            <group key={x}>
              <Box p={[x, 0.9, 0]} s={[0.5, 1.8, 0.8]} c="#2f2f3a" />
              <Box p={[x, 1.2, 0.41]} s={[0.3, 0.05, 0.02]} c="#7fe08a" e />
            </group>
          ))}
        </group>
      )
    case 'eng-telecom':
      return (
        <group>
          <Cyl p={[0, 0.6, 0]} r={0.6} h={0.4} c="#8a6a4a" rot={[Math.PI / 2, 0, 0]} seg={12} />
          <Cyl p={[0, 0.6, 0]} r={0.35} h={0.42} c="#ff8a3d" rot={[Math.PI / 2, 0, 0]} seg={12} />
          <Box p={[0.9, 0.05, 0]} s={[1, 0.05, 0.08]} c="#ff8a3d" />
        </group>
      )
    case 'eng-7x24':
      return (
        <group>
          <Box p={[0, 0.55, 0]} s={[1.8, 0.9, 0.9]} c="#f2f2f2" />
          <Box p={[0.7, 0.75, 0]} s={[0.4, 0.4, 0.92]} c="#bfe3f2" />
          <Box p={[-0.2, 0.6, 0.46]} s={[0.9, 0.2, 0.02]} c="#d96b5a" />
          {[-0.55, 0.55].map((x) => (
            <Cyl key={x} p={[x, 0.15, 0]} r={0.18} h={0.95} c="#222" rot={[Math.PI / 2, 0, 0]} />
          ))}
        </group>
      )
    // agents
    case 'agents-5g':
      return (
        <group>
          <Cyl p={[0, 0.4, 0]} r={0.6} h={0.8} c="#eee" seg={6} />
          <Box p={[0, 1.1, 0]} s={[0.5, 0.5, 0.15]} c="#f8f8f8" />
          <Ball p={[0.15, 1.25, 0.08]} r={0.04} c="#4fa3c7" e />
        </group>
      )
    case 'agents-cool':
      return (
        <group>
          <Box p={[0, 0.7, 0]} s={[1.6, 1.4, 0.9]} c="#dde3e8" />
          {[-0.4, 0.4].map((x) => (
            <Cyl key={x} p={[x, 1.42, 0]} r={0.3} h={0.05} c="#555" />
          ))}
          <Box p={[0, 0.7, 0.46]} s={[1.2, 0.08, 0.02]} c="#5fb3e8" e />
        </group>
      )
    case 'agents-power':
      return (
        <group>
          <Box p={[0, 0.9, 0]} s={[0.9, 1.8, 0.9]} c="#333" />
          <Box p={[0, 1.7, 0.46]} s={[0.7, 0.06, 0.02]} c="#c7799f" e />
        </group>
      )
    case 'agents-antenna':
      return (
        <group>
          <Cyl p={[0, 1.2, 0]} r={0.08} h={2.4} c="#888" />
          <Box p={[0, 2, 0.12]} s={[0.35, 1, 0.1]} c="#fafafa" />
          <Box p={[0.55, 0.3, 0]} s={[0.5, 0.6, 0.4]} c="#3c8f4a" />
        </group>
      )
    // news
    case 'news-park':
      return <Box p={[0, 0.4, 0]} s={[1.2, 0.8, 1.2]} c="#ff9f6b" />
    case 'news-satellite':
      return (
        <group>
          <Cyl p={[0, 0.5, 0]} r={0.12} h={1} c="#888" />
          <mesh position={[0, 1.2, 0]} rotation={[-0.8, 0, 0]}>
            <sphereGeometry args={[0.8, 12, 6, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#f2f2f2" side={2} />
          </mesh>
        </group>
      )
    case 'news-museum':
      return (
        <group>
          <Cyl p={[0, 0.6, 0]} r={1} h={1.2} c="#e8e2d0" seg={12} />
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#3d4f7a" flatShading />
          </mesh>
        </group>
      )
    // cases
    case 'cases-agv':
      return (
        <group>
          <Box p={[0, 0.25, 0]} s={[1, 0.5, 0.7]} c="#f5a623" />
          <Box p={[0, 0.65, 0]} s={[0.7, 0.3, 0.5]} c="#c88a4a" />
        </group>
      )
    case 'cases-robot':
      return (
        <group>
          <Cyl p={[0, 0.5, 0]} r={0.35} h={1} c="#f2f2f2" seg={12} />
          <Ball p={[0, 1.15, 0]} r={0.28} c="#dfe8f0" />
          <Cyl p={[0, 0.6, 0]} r={0.37} h={0.15} c="#7a5cff" seg={12} />
        </group>
      )
    case 'cases-hospital':
      return (
        <group>
          <Box p={[0, 1, 0]} s={[1.6, 2, 1.2]} c="#f4f4f4" />
          <Box p={[0, 1.5, 0.61]} s={[0.5, 0.15, 0.02]} c="#e2483d" />
          <Box p={[0, 1.5, 0.61]} s={[0.15, 0.5, 0.02]} c="#e2483d" />
        </group>
      )
    // esg
    case 'esg-netzero':
      return (
        <group>
          <Tree s={0.8} />
          <Box p={[0.8, 0.4, 0]} s={[0.6, 0.8, 0.6]} c="#5fb36b" />
          <Box p={[0.8, 0.85, 0]} s={[0.3, 0.1, 0.3]} c="#e8eef2" />
        </group>
      )
    case 'esg-workplace':
      return (
        <group>
          <Box p={[0, 0.6, 0]} s={[1.3, 1.2, 1.2]} c="#f6e7c8" />
          <Cyl p={[0, 1.5, 0]} r={1} rt={0} h={0.7} c="#e07a5f" seg={4} />
          <Ball p={[0, 2.3, 0]} r={0.2} c="#ff6b81" e />
        </group>
      )
    case 'esg-bio':
      return (
        <group>
          <Cyl p={[0, 0.03, 0]} r={1} h={0.05} c="#5fb3e8" seg={12} />
          <Ball p={[0.3, 0.15, 0.2]} r={0.15} c="#fff" />
          <Tree p={[-1, 0, -0.5]} s={0.6} />
        </group>
      )
    // offices
    case 'offices-taipei':
      return (
        <group>
          {[0, 1, 2, 3, 4].map((k) => (
            <Cyl key={k} p={[0, 0.4 + k * 0.7, 0]} r={0.5} rt={0.65} h={0.7} c="#5f8f7f" seg={4} />
          ))}
          <Cyl p={[0, 4, 0]} r={0.05} h={0.8} c="#ccc" />
        </group>
      )
    case 'offices-taichung':
      return (
        <group>
          <Box p={[0, 1, 0]} s={[1.2, 2, 1.2]} c="#c9d1da" />
          <Windows w={1.2} h={2} d={1.2} rows={3} />
        </group>
      )
    case 'offices-kaohsiung':
      return (
        <group>
          {[-0.45, 0.45].map((x) => (
            <Box key={x} p={[x, 1.2, 0]} s={[0.6, 2.4, 0.8]} c="#8fa3b8" />
          ))}
          <Box p={[0, 3, 0]} s={[0.5, 1.6, 0.6]} c="#8fa3b8" />
        </group>
      )
    default:
      return <Box p={[0, 0.5, 0]} c="#ccc" />
  }
}
