import type { ThreeEvent } from '@react-three/fiber'

// Pointer handlers that make a 3D character open its dialog when clicked,
// ignoring clicks that were really camera drags.
export function clickToTalk(open: () => void) {
  return {
    onClick: (e: ThreeEvent<MouseEvent>) => {
      if (e.delta > 6) return
      e.stopPropagation()
      open()
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      document.body.style.cursor = ''
    },
  }
}
