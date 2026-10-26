import { Html } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useRef } from 'react'
import { type Group } from 'three'
import { AIRPORT, RIVER, RIVERSIDE } from '../data/scenic'
import { landing, takeoff, type FlightPose } from '../lib/flight'
import { useGame } from '../store/useGame'
import { ISLAND_POS } from './layout'
import { Ball, Box, Cyl, Tree } from './props'

// Local frame of the riverside scene: +x runs along the river and runway,
// -z points away from HQ (across the river). See riversideFrame() in layout.ts.
const YAW = (-RIVERSIDE.angle * Math.PI) / 180
const out = (d: number) => -d

const RAINBOW = ['#e8473f', '#f28b30', '#f6cf3c', '#5fb36b', '#3f9fd9', '#4b5fc4', '#8a5cc7']
const RUNWAY_OUT = AIRPORT.center - 2
const RIVER_LEN = 110

function Plane({ scale = 1, livery = '#1d6fb8' }: { scale?: number; livery?: string }) {
  // Nose points toward -x.
  return (
    <group scale={scale}>
      <mesh scale={[3, 0.6, 0.6]} castShadow>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color="#fbfcfc" flatShading />
      </mesh>
      <mesh position={[2.6, 0.25, 0]} scale={[0.9, 0.38, 0.34]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#fbfcfc" flatShading />
      </mesh>
      <mesh position={[-2.45, 0.2, 0]} scale={[0.42, 0.18, 0.4]}>
        <sphereGeometry args={[1, 10, 6]} />
        <meshStandardMaterial color="#8fd0ec" />
      </mesh>
      <Box p={[0, -0.05, 0.56]} s={[4.4, 0.08, 0.03]} c={livery} />
      <Box p={[0, -0.05, -0.56]} s={[4.4, 0.08, 0.03]} c={livery} />
      {[1, -1].map((side) => (
        <group key={side}>
          <group position={[0.2, -0.25, side * 1.7]} rotation={[0, -side * 0.45, 0]}>
            <Box s={[1.2, 0.12, 3.2]} c="#eef2f4" />
          </group>
          <Cyl p={[-0.2, -0.45, side * 1.3]} r={0.22} h={0.85} c="#dfe5e8" rot={[0, 0, Math.PI / 2]} />
          <group position={[2.95, 0.35, side * 0.62]} rotation={[0, -side * 0.4, 0]}>
            <Box s={[0.6, 0.08, 1.3]} c="#eef2f4" />
          </group>
          <Ball p={[0.2, -0.25, side * 3.25]} r={0.08} c={side > 0 ? '#3ddc84' : '#ff4d4d'} e />
        </group>
      ))}
      <group position={[2.9, 0.85, 0]} rotation={[0, 0, 0.5]}>
        <Box s={[1, 1.2, 0.12]} c={livery} />
      </group>
    </group>
  )
}

// A plane that follows one of the flight paths along the runway.
function FlyingPlane({ path, offset }: { path: (t: number) => FlightPose; offset: number }) {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const p = path(clock.elapsedTime + offset)
    g.visible = p.visible
    g.position.set(p.x, 0.75 + p.y, out(RUNWAY_OUT))
    g.rotation.z = -p.pitch
  })
  return (
    <group ref={ref}>
      <Plane scale={0.9} />
    </group>
  )
}

// Circles over the archipelago so planes are visible from every island.
function CruisingPlane() {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const a = clock.elapsedTime * 0.07
    g.position.set(Math.cos(a) * 72, 30 + Math.sin(clock.elapsedTime * 0.5) * 1.2, Math.sin(a) * 60)
    // Nose (-x) along the direction of travel.
    g.rotation.set(0, Math.PI / 2 - a, 0.12)
  })
  return (
    <group ref={ref}>
      <Plane scale={1.1} livery="#e8738a" />
    </group>
  )
}

function RainbowBridge() {
  const span = RIVER.to - RIVER.from + 3
  const mid = out((RIVER.from + RIVER.to) / 2)
  return (
    <group position={[-6, 0, mid]}>
      <Box p={[0, 0.15, 0]} s={[2.2, 0.25, span]} c="#d9d4c4" />
      {[-1, 1].map((side) => (
        <Box key={side} p={[side * 1.05, 0.6, 0]} s={[0.08, 0.7, span]} c="#f4f1ea" />
      ))}
      {/* Arch ribs in rainbow colors spanning the river */}
      {RAINBOW.map((c, k) => (
        <mesh key={c} position={[-0.9 + k * 0.3, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[span / 2, 0.09, 6, 28, Math.PI]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.25} flatShading />
        </mesh>
      ))}
      <Html position={[0, span / 2 + 1.4, 0]} center zIndexRange={[25, 0]}>
        <span className="deco-tag">🌈 彩虹橋</span>
      </Html>
    </group>
  )
}

function Airport() {
  const z = out(AIRPORT.center)
  return (
    <group position={[0, 0, z]}>
      {/* Platform and grass bank */}
      <Box p={[0, -0.45, 0]} s={[AIRPORT.length, 1, AIRPORT.depth]} c="#c9d3b5" />
      {/* Runway 10/28 with dashed centre line and threshold bars */}
      <group position={[0, 0.07, -(RUNWAY_OUT - AIRPORT.center)]}>
        <Box s={[AIRPORT.length - 6, 0.04, 3.6]} c="#5a636b" />
        {Array.from({ length: 15 }, (_, i) => (
          <Box key={i} p={[-24 + i * 3.4, 0.03, 0]} s={[1.6, 0.03, 0.18]} c="#ffffff" />
        ))}
        {[-1, 1].map((end) =>
          [-1.2, -0.6, 0, 0.6, 1.2].map((zz) => <Box key={`${end}${zz}`} p={[end * 26.5, 0.03, zz]} s={[1.4, 0.03, 0.25]} c="#ffffff" />),
        )}
      </group>
      {/* Taxiway and apron */}
      <Box p={[0, 0.05, -4]} s={[AIRPORT.length - 14, 0.04, 2]} c="#7a8288" />
      <Box p={[-4, 0.05, -7]} s={[24, 0.04, 5]} c="#8d959a" />
      {/* Terminal with glass roof */}
      <Box p={[-4, 1.1, -10]} s={[18, 2.2, 3.6]} c="#f2f3f0" />
      <Box p={[-4, 2.4, -10]} s={[18.6, 0.5, 4.2]} c="#9fd4e6" />
      <Html position={[-4, 4.2, -10]} center zIndexRange={[25, 0]}>
        <span className="deco-tag airport">✈ TSA 臺北松山機場</span>
      </Html>
      {/* Control tower */}
      <Cyl p={[14, 3.2, -9]} r={0.5} rt={0.4} h={6.4} c="#f2f3f0" />
      <Cyl p={[14, 6.9, -9]} r={1.1} rt={1.3} h={1.2} c="#9fd4e6" seg={8} />
      <Cyl p={[14, 7.7, -9]} r={1.3} rt={0.4} h={0.4} c="#5a636b" seg={8} />
      <Ball p={[14, 8.2, -9]} r={0.12} c="#ff4d4d" e />
      {/* Parked planes at the gates */}
      {[-9, 1].map((x) => (
        <group key={x} position={[x, 0.75, -6.6]} rotation={[0, Math.PI / 2, 0]}>
          <Plane scale={0.75} />
        </group>
      ))}
    </group>
  )
}

function River() {
  const width = RIVER.to - RIVER.from
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.84, out((RIVER.from + RIVER.to) / 2)]}>
        <planeGeometry args={[RIVER_LEN, width]} />
        <meshStandardMaterial color="#7fd0e0" roughness={0.25} />
      </mesh>
      {/* Grassy levees on both banks */}
      {[RIVER.from - 0.6, RIVER.to + 0.8].map((d) => (
        <Box key={d} p={[0, -0.55, out(d)]} s={[RIVER_LEN, 0.6, 1.4]} c="#9cc48a" />
      ))}
      <Html position={[18, 0.6, out((RIVER.from + RIVER.to) / 2)]} center zIndexRange={[25, 0]}>
        <span className="deco-tag river">基隆河</span>
      </Html>
      <Html position={[-6, 1.2, out(RIVER.to + 1.6)]} center zIndexRange={[25, 0]}>
        <span className="deco-tag">往松山・饒河街 →</span>
      </Html>
    </group>
  )
}

// Park furniture on the riverside island, in the rotated local frame.
function ParkFurniture() {
  return (
    <group>
      {/* Viewing deck facing the runway */}
      <group position={[4, 0, out(6.2)]}>
        <Box p={[0, 0.25, 0]} s={[5, 0.3, 2.4]} c="#c9a27a" />
        {[-2.4, 2.4].map((x) => (
          <Box key={x} p={[x, 0.75, 0]} s={[0.1, 0.7, 2.4]} c="#8a6a4a" />
        ))}
        <Box p={[0, 0.75, -1.15]} s={[5, 0.7, 0.1]} c="#8a6a4a" />
        <Cyl p={[1.4, 0.95, -0.6]} r={0.08} h={0.8} c="#555" />
        <Box p={[1.4, 1.4, -0.6]} s={[0.4, 0.2, 0.25]} c="#2f3e57" />
        <Html position={[0, 2.4, 0]} center zIndexRange={[25, 0]}>
          <span className="deco-tag">🔭 觀機平台</span>
        </Html>
      </group>
      {/* Benches and lamps along the riverside path */}
      {[-6, -2.5].map((x) => (
        <group key={x} position={[x, 0, out(5.6)]}>
          <Box p={[0, 0.35, 0]} s={[1.6, 0.12, 0.5]} c="#8a6a4a" />
          <Box p={[0, 0.6, 0.22]} s={[1.6, 0.4, 0.08]} c="#8a6a4a" />
          <Cyl p={[1.2, 1.2, 0]} r={0.06} h={2.4} c="#4a4a4a" />
          <Ball p={[1.2, 2.45, 0]} r={0.16} c="#fff3b0" e />
        </group>
      ))}
      {/* Rainbow flowerbeds */}
      {RAINBOW.map((c, k) => (
        <Box key={c} p={[-7 + k * 1.1, 0.12, out(-2.5)]} s={[1, 0.2, 1.4]} c={c} />
      ))}
      <Tree p={[-3, 0, out(-5)]} s={1.1} />
      <Tree p={[6, 0, out(-4)]} s={0.9} />
      <Tree p={[-8, 0, out(2)]} s={0.8} />
    </group>
  )
}

export function Riverside({ onGround }: { onGround: (e: ThreeEvent<MouseEvent>) => void }) {
  const pos = ISLAND_POS[RIVERSIDE.id]
  const travelTo = useGame((s) => s.travelTo)
  return (
    <group>
      {/* Park ground: world-aligned hexagon so it matches the walkable area */}
      <group position={[pos.x, 0, pos.z]}>
        <mesh position={[0, -1.6, 0]} receiveShadow>
          <cylinderGeometry args={[RIVERSIDE.r * 0.98, RIVERSIDE.r * 0.8, 2.6, 6]} />
          <meshStandardMaterial color="#a89884" flatShading />
        </mesh>
        <mesh position={[0, -0.25, 0]} receiveShadow>
          <cylinderGeometry args={[RIVERSIDE.r * 1.03, RIVERSIDE.r, 0.5, 6]} />
          <meshStandardMaterial color="#efdcb3" flatShading />
        </mesh>
        <mesh receiveShadow onClick={onGround} name="ground">
          <cylinderGeometry args={[RIVERSIDE.r * 0.97, RIVERSIDE.r * 0.97, 0.08, 6]} />
          <meshStandardMaterial color="#b9e0a5" />
        </mesh>
        {/* Bike path loop */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} onClick={onGround}>
          <ringGeometry args={[RIVERSIDE.r * 0.62, RIVERSIDE.r * 0.72, 6]} />
          <meshStandardMaterial color="#e8c9a0" />
        </mesh>
        <Html position={[0, 6, 0]} center zIndexRange={[30, 0]}>
          <button type="button" className="island-tag kind-scenic" onClick={() => travelTo(RIVERSIDE.id)} data-testid="riverside-tag">
            <span className="island-no">景點</span>
            {RIVERSIDE.name}
          </button>
        </Html>
      </group>

      <group position={[pos.x, 0, pos.z]} rotation={[0, YAW, 0]}>
        <ParkFurniture />
        <River />
        <RainbowBridge />
        <Airport />
        <FlyingPlane path={takeoff} offset={0} />
        <FlyingPlane path={landing} offset={13} />
      </group>
      <CruisingPlane />
    </group>
  )
}
