// Scenic area beside HQ: Neihu Rainbow Riverside Park on the Keelung River, with
// Songshan Airport on the far bank. A concept landscape, not to geographic scale.

export type ScenicArea = {
  id: string
  name: string
  tagline: string
  color: string
  angle: number
  distance: number
  r: number
  link: string
}

export const RIVERSIDE: ScenicArea = {
  id: 'riverside',
  name: '內湖彩虹河濱公園',
  tagline: '總部旁的基隆河畔，抬頭就是松山機場的航線',
  color: '#e8738a',
  // Between the 智慧城市 (0°) and 智慧製造 (60°) bridges, where no other island sits.
  angle: 30,
  distance: 54,
  r: 10,
  link: 'hq',
}

export const SCENIC_AREAS: ScenicArea[] = [RIVERSIDE]

export function scenicById(id: string): ScenicArea | undefined {
  return SCENIC_AREAS.find((a) => a.id === id)
}

// Distances outward from the park center (along the area's angle) for the river,
// far bank and airport; the airport runway runs perpendicular to that direction.
export const RIVER = { from: 10.5, to: 19 }
export const AIRPORT = { center: 32, length: 62, depth: 22 }
