import { OrbitControls } from '@react-three/drei'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { ISLANDS } from '../data/islands'
import { useGame, type TimeOfDay } from '../store/useGame'
import { Bridges } from './Bridges'
import { Island } from './Island'
import { WORLD } from './layout'
import { Paul } from './Paul'
import { Player } from './Player'
import { runtime } from './runtime'

const LIGHTING: Record<TimeOfDay, { sky: string; water: string; ambient: number; sun: number; sunColor: string; sunPos: [number, number, number] }> = {
  dawn: { sky: '#f6d6c4', water: '#7fb3c9', ambient: 0.55, sun: 1.2, sunColor: '#ffc6a0', sunPos: [-40, 18, 20] },
  day: { sky: '#cfe9f5', water: '#6cb6d6', ambient: 0.7, sun: 1.6, sunColor: '#ffffff', sunPos: [30, 50, 25] },
  dusk: { sky: '#f3b58a', water: '#5d8fb0', ambient: 0.5, sun: 1.1, sunColor: '#ff9a5c', sunPos: [45, 14, -10] },
  night: { sky: '#132036', water: '#1d3550', ambient: 0.25, sun: 0.35, sunColor: '#9fb8ff', sunPos: [-20, 40, -30] },
}

// Walk to a clicked point, ignoring clicks that were really camera drags.
function handleGround(e: ThreeEvent<MouseEvent>) {
  if (e.delta > 6) return
  e.stopPropagation()
  const path = WORLD.route({ x: runtime.player.x, z: runtime.player.z }, { x: e.point.x, z: e.point.z })
  if (path) runtime.path = path
}

function useKeyboard() {
  useEffect(() => {
    const isTyping = (t: EventTarget | null) => t instanceof HTMLElement && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')
    const down = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return
      if (e.code === 'KeyE') useGame.getState().interact()
      else if (e.code === 'Escape') {
        const s = useGame.getState()
        if (s.talkOpen) s.closeTalk()
        else if (s.selectedGoalId) s.closeGoal()
        else if (s.selectedIslandId) s.closeIsland()
      } else runtime.keys.add(e.code)
    }
    const up = (e: KeyboardEvent) => runtime.keys.delete(e.code)
    const clear = () => runtime.keys.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [])
}

export function Scene() {
  const time = useGame((s) => s.timeOfDay)
  const light = LIGHTING[time]
  useKeyboard()

  return (
    <Canvas shadows camera={{ position: window.innerWidth > 820 ? [0, 22, 30] : [0, 34, 44], fov: 45, near: 0.5, far: 400 }} dpr={[1, 1.5]} data-testid="scene">
      <color attach="background" args={[light.sky]} />
      <fog attach="fog" args={[light.sky, 70, 160]} />
      <ambientLight intensity={light.ambient} />
      <hemisphereLight args={[light.sky, '#6b8f5a', 0.35]} />
      <directionalLight
        position={light.sunPos}
        intensity={light.sun}
        color={light.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
        <circleGeometry args={[200, 48]} />
        <meshStandardMaterial color={light.water} roughness={0.35} metalness={0.1} />
      </mesh>
      <Suspense fallback={null}>
        {ISLANDS.map((island) => (
          <Island key={island.id} island={island} onGround={handleGround} />
        ))}
        <Bridges onGround={handleGround} />
        <Player />
        <Paul />
      </Suspense>
      <OrbitControls makeDefault target={[0, 0, 4]} enablePan={false} minDistance={10} maxDistance={90} maxPolarAngle={1.3} minPolarAngle={0.35} />
    </Canvas>
  )
}
