import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useMemo, type CSSProperties } from 'react'
import { Color } from 'three'
import type { Island as IslandData } from '../data/islands'
import { useGame } from '../store/useGame'
import { ISLAND_POS, goalSpots } from './layout'
import { GoalProp, Landmark, Tree } from './props'

const CIRCLED = ['①', '②', '③', '④', '⑤']

export function Island({ island, onGround }: { island: IslandData; onGround: (e: ThreeEvent<MouseEvent>) => void }) {
  const pos = ISLAND_POS[island.id]
  const spots = useMemo(() => goalSpots(island), [island])
  const grass = useMemo(() => new Color(island.color).lerp(new Color('#cfe8b8'), 0.75).getStyle(), [island.color])
  const plaza = useMemo(() => new Color(island.color).lerp(new Color('#f4efe4'), 0.82).getStyle(), [island.color])
  const read = useGame((s) => s.readGoals)
  const openGoal = useGame((s) => s.openGoal)
  const openIsland = useGame((s) => s.openIsland)

  return (
    <group position={[pos.x, 0, pos.z]}>
      {/* rock base, sand rim, grass top */}
      <mesh position={[0, -1.6, 0]} receiveShadow>
        <cylinderGeometry args={[island.r * 0.98, island.r * 0.8, 2.6, 6]} />
        <meshStandardMaterial color="#a89884" flatShading />
      </mesh>
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[island.r * 1.03, island.r, 0.5, 6]} />
        <meshStandardMaterial color="#efdcb3" flatShading />
      </mesh>
      <mesh position={[0, 0, 0]} receiveShadow onClick={onGround} name="ground">
        <cylinderGeometry args={[island.r * 0.97, island.r * 0.97, 0.08, 6]} />
        <meshStandardMaterial color={grass} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow onClick={onGround}>
        <cylinderGeometry args={[island.r * 0.32, island.r * 0.32, 0.04, 6]} />
        <meshStandardMaterial color={plaza} />
      </mesh>

      <Landmark id={island.id} />

      {island.goals.map((goal, k) => {
        const p = spots[k]
        return (
          <group key={goal.id} position={[p.x - pos.x, 0.05, p.z - pos.z]}>
            <mesh receiveShadow position={[0, 0.02, 0]}>
              <cylinderGeometry args={[1.25, 1.25, 0.05, 20]} />
              <meshStandardMaterial color={read.includes(goal.id) ? '#ffe2a8' : '#ffffff'} transparent opacity={0.75} />
            </mesh>
            <GoalProp id={goal.id} />
            <Html position={[0, 3.2, 0]} center zIndexRange={[20, 0]}>
              <button
                type="button"
                className={`goal-tag${read.includes(goal.id) ? ' is-read' : ''}`}
                onClick={() => openGoal(goal.id)}
                data-testid={`goal-tag-${goal.id}`}
              >
                <span className="goal-no">{CIRCLED[k]}</span>
                {goal.title}
              </button>
            </Html>
          </group>
        )
      })}

      {/* scattered trees along the rim */}
      {[0.5, 1.6, 2.6, 3.7, 4.7, 5.8].map((a, k) => (
        <Tree key={k} p={[Math.sin(a) * island.r * 0.82, 0, -Math.cos(a) * island.r * 0.82]} s={0.55 + (k % 3) * 0.15} />
      ))}

      <Html position={[0, island.kind === 'hub' ? 9.5 : 7, 0]} center zIndexRange={[30, 0]}>
        <button type="button" className={`island-tag kind-${island.kind}`} style={{ '--c': island.color } as CSSProperties} onClick={() => openIsland(island.id)}>
          <span className="island-no">{island.no}</span>
          {island.name}
        </button>
      </Html>
    </group>
  )
}
