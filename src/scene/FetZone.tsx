import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { FET } from '../data/scenic'
import { useGame } from '../store/useGame'
import { ISLAND_POS, ringSpots } from './layout'
import { FET_LOGO, LogoSign } from './Logo'
import { Ball, Box, Cyl, Tree } from './props'

const RED = FET.color
const GROUP = [
  { name: '數聯資安', color: '#4b5fc4' },
  { name: '博弘雲端科技', color: '#3f9fd9' },
  { name: '富鴻網', color: '#1d6fb8' },
  { name: '旭天能源', color: '#5fb36b' },
]

function Tag({ text, y }: { text: string; y: number }) {
  return (
    <Html position={[0, y, 0]} center zIndexRange={[25, 0]}>
      <span className="deco-tag">{text}</span>
    </Html>
  )
}

// Telecom headquarters tower with rooftop antennas; the zone's landmark.
function Tower() {
  return (
    <group>
      <Box p={[0, 3.6, 0]} s={[2.8, 7.2, 2.8]} c="#eef1f4" />
      {[1.2, 2.6, 4, 5.4, 6.8].map((y) => (
        <Box key={y} p={[0, y, 1.42]} s={[2.4, 0.5, 0.04]} c="#9fd4e6" />
      ))}
      <Box p={[0, 7.4, 0]} s={[3, 0.4, 3]} c={RED} />
      {/* Rooftop crown with the FarEasTone logo on all four sides */}
      {[0, 1, 2, 3].map((k) => (
        <group key={k} rotation={[0, (k * Math.PI) / 2, 0]}>
          <group position={[0, 8.25, 1.42]}>
            <LogoSign width={2.8} logo={FET_LOGO} />
          </group>
        </group>
      ))}
      <Cyl p={[0.8, 9.6, 0]} r={0.06} h={1.2} c="#c0c6cc" />
      <Ball p={[0.8, 10.25, 0]} r={0.12} c="#ff4d4d" e />
      <Box p={[0, 0.9, 1.6]} s={[1.4, 1.8, 0.3]} c={RED} />
    </group>
  )
}

function Idc() {
  return (
    <group>
      <Box p={[0, 1.1, 0]} s={[2.6, 2.2, 1.8]} c="#2f3e57" />
      {[0.5, 0.95, 1.4, 1.85].map((y) => (
        <Box key={y} p={[0, y, 0.91]} s={[2.2, 0.08, 0.02]} c="#3ddc84" e />
      ))}
      <Box p={[0, 2.3, 0]} s={[2.8, 0.2, 2]} c="#c0c6cc" />
      <Tag text="☁ TPKC 雲端運算中心" y={3.4} />
    </group>
  )
}

function Mast() {
  return (
    <group>
      <Cyl p={[0, 2.4, 0]} r={0.45} rt={0.12} h={4.8} c="#c0c6cc" seg={4} />
      {[0, 1, 2].map((k) => (
        <group key={k} rotation={[0, (k * Math.PI * 2) / 3, 0]}>
          <Box p={[0, 4.3, 0.28]} s={[0.25, 0.8, 0.1]} c="#ffffff" />
        </group>
      ))}
      <Ball p={[0, 4.95, 0]} r={0.1} c="#ff4d4d" e />
      <Tag text="📶 5G 基地台" y={5.8} />
    </group>
  )
}

function SmartPole() {
  return (
    <group>
      <Cyl p={[0, 1.7, 0]} r={0.1} h={3.4} c="#6c7a89" />
      <Box p={[0.35, 3.3, 0]} s={[0.7, 0.12, 0.25]} c="#6c7a89" />
      <Ball p={[0.65, 3.15, 0]} r={0.16} c="#fff3b0" e />
      <Box p={[0, 1.9, 0.14]} s={[0.35, 0.6, 0.1]} c={RED} e />
      <Tag text="遠傳智慧杆" y={4.2} />
    </group>
  )
}

// Four kiosks for the group companies listed on FarEasTone's enterprise site.
function GroupPlaza() {
  return (
    <group>
      <Cyl p={[0, 0.06, 0]} r={2} h={0.08} c="#f4efe4" seg={16} />
      {GROUP.map((g, k) => {
        const a = (k / GROUP.length) * Math.PI * 2 + Math.PI / 4
        return (
          <group key={g.name} position={[Math.sin(a) * 1.3, 0, Math.cos(a) * 1.3]}>
            <Box p={[0, 0.45, 0]} s={[0.7, 0.9, 0.7]} c={g.color} />
            <Box p={[0, 0.95, 0]} s={[0.9, 0.1, 0.9]} c="#ffffff" />
          </group>
        )
      })}
      <Html position={[0, 2.2, 0]} center zIndexRange={[25, 0]}>
        <span className="deco-tag group-tags">
          遠傳集團
          {GROUP.map((g) => (
            <em key={g.name} style={{ background: g.color }}>
              {g.name}
            </em>
          ))}
        </span>
      </Html>
    </group>
  )
}

function EsgGarden() {
  return (
    <group>
      <Tree s={1} />
      <Tree p={[0.9, 0, 0.5]} s={0.7} />
      <Box p={[-0.8, 0.3, 0.4]} s={[0.8, 0.6, 0.5]} c="#5fb36b" />
      <Tag text="🌱 永續" y={2.8} />
    </group>
  )
}

export function FetZone({ onGround }: { onGround: (e: ThreeEvent<MouseEvent>) => void }) {
  const pos = ISLAND_POS[FET.id]
  const travelTo = useGame((s) => s.travelTo)
  // Props on an outer ring between the resident spots (which sit at multiples of 72°).
  const [idc, mast, plaza, pole, garden] = ringSpots(FET, 5, FET.r * 0.66, Math.PI / 5)
  const at = (p: { x: number; z: number }) => [p.x - pos.x, 0.05, p.z - pos.z] as [number, number, number]
  // Logo monument beside the bridge landing, facing visitors arriving from HQ.
  const [gate] = ringSpots(FET, 1, FET.r * 0.76, 0.25)
  const hq = ISLAND_POS[FET.link]
  const gateYaw = Math.atan2(hq.x - gate.x, hq.z - gate.z)

  return (
    <group position={[pos.x, 0, pos.z]}>
      <mesh position={[0, -1.6, 0]} receiveShadow>
        <cylinderGeometry args={[FET.r * 0.98, FET.r * 0.8, 2.6, 6]} />
        <meshStandardMaterial color="#a89884" flatShading />
      </mesh>
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[FET.r * 1.03, FET.r, 0.5, 6]} />
        <meshStandardMaterial color="#efdcb3" flatShading />
      </mesh>
      <mesh receiveShadow onClick={onGround} name="ground">
        <cylinderGeometry args={[FET.r * 0.97, FET.r * 0.97, 0.08, 6]} />
        <meshStandardMaterial color="#dfe9d6" />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow onClick={onGround}>
        <cylinderGeometry args={[FET.r * 0.32, FET.r * 0.32, 0.04, 6]} />
        <meshStandardMaterial color="#f6e3e4" />
      </mesh>

      <Tower />
      <group position={at(idc)}>
        <Idc />
      </group>
      <group position={at(mast)}>
        <Mast />
      </group>
      <group position={at(plaza)}>
        <GroupPlaza />
      </group>
      <group position={at(pole)}>
        <SmartPole />
      </group>
      <group position={at(garden)}>
        <EsgGarden />
      </group>
      <group position={at(gate)} rotation={[0, gateYaw, 0]}>
        {[-1.2, 1.2].map((x) => (
          <Box key={x} p={[x, 0.4, 0]} s={[0.2, 0.8, 0.2]} c="#c0c6cc" />
        ))}
        <group position={[0, 1.5, 0]}>
          <LogoSign width={3} depth={0.2} both logo={FET_LOGO} />
        </group>
      </group>

      <Html position={[0, 11.4, 0]} center zIndexRange={[30, 0]}>
        <button type="button" className="island-tag kind-group" onClick={() => travelTo(FET.id)} data-testid="fet-tag">
          <span className="island-no">{FET.badge}</span>
          {FET.name}
        </button>
      </Html>
    </group>
  )
}
