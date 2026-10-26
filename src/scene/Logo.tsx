import { useEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

export type LogoSpec = { src: string; aspect: number; panel: string }

// FHNet's official logo (www.fhnet.com.tw/images/logo.svg). Its wordmark is white,
// so it sits on a dark panel, as on the official site's header.
export const FHNET_LOGO: LogoSpec = { src: `${import.meta.env.BASE_URL}fhnet-logo.svg`, aspect: 117 / 56.7, panel: '#14313a' }

// FarEasTone's logo as supplied by FHNet (dark wordmark on white), on a white panel.
export const FET_LOGO: LogoSpec = { src: `${import.meta.env.BASE_URL}fet-logo.png`, aspect: 324 / 120, panel: '#ffffff' }

// Draw the image into a canvas texture; SVGs are rasterised large so signs stay crisp up close.
function useLogoTexture(logo: LogoSpec) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = Math.round(1024 / logo.aspect)
    const t = new CanvasTexture(canvas)
    t.colorSpace = SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [logo.aspect])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      const canvas = texture.image as HTMLCanvasElement
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
      texture.needsUpdate = true
    }
    img.src = logo.src
    return () => texture.dispose()
  }, [texture, logo.src])

  return texture
}

// A sign board in the logo's panel colour with the logo on its front face (+z).
export function LogoSign({ width, depth = 0.12, both = false, logo = FHNET_LOGO }: { width: number; depth?: number; both?: boolean; logo?: LogoSpec }) {
  const texture = useLogoTexture(logo)
  const height = (width / logo.aspect) * 1.15
  const face = [width * 0.92, (width * 0.92) / logo.aspect] as const
  const material = <meshBasicMaterial map={texture} transparent toneMapped={false} />
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={logo.panel} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.01]}>
        <planeGeometry args={face} />
        {material}
      </mesh>
      {both && (
        <mesh position={[0, 0, -depth / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={face} />
          {material}
        </mesh>
      )}
    </group>
  )
}
