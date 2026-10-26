import { useEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

// The official FHNet logo (www.fhnet.com.tw/images/logo.svg). Its wordmark is white,
// so it is always shown on a dark panel, as on the official site's header.
const LOGO_URL = `${import.meta.env.BASE_URL}fhnet-logo.svg`
const ASPECT = 117 / 56.7
const PANEL = '#14313a'

// Rasterise the SVG at a high resolution so the sign stays crisp up close.
function useLogoTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = Math.round(1024 / ASPECT)
    const t = new CanvasTexture(canvas)
    t.colorSpace = SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      const canvas = texture.image as HTMLCanvasElement
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
      texture.needsUpdate = true
    }
    img.src = LOGO_URL
    return () => texture.dispose()
  }, [texture])

  return texture
}

// A dark sign board with the logo on its front face (+z).
export function LogoSign({ width, depth = 0.12, both = false }: { width: number; depth?: number; both?: boolean }) {
  const texture = useLogoTexture()
  const height = (width / ASPECT) * 1.15
  const logo = (
    <meshBasicMaterial map={texture} transparent toneMapped={false} />
  )
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={PANEL} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.92, (width * 0.92) / ASPECT]} />
        {logo}
      </mesh>
      {both && (
        <mesh position={[0, 0, -depth / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[width * 0.92, (width * 0.92) / ASPECT]} />
          {logo}
        </mesh>
      )}
    </group>
  )
}
