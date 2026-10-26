// Areas beside HQ that are not FHNet business islands: Neihu Rainbow Riverside Park
// (with Songshan Airport across the Keelung River, a concept landscape not to scale)
// and the zone of FHNet's parent company FarEasTone.

export type ScenicArea = {
  id: string
  kind: 'scenic' | 'group'
  // Short label shown before the name, e.g. on the zone card and index.
  badge: string
  name: string
  tagline: string
  // Small print on the zone card about scale or content source.
  note: string
  color: string
  angle: number
  distance: number
  r: number
  link: string
}

export const RIVERSIDE: ScenicArea = {
  id: 'riverside',
  kind: 'scenic',
  badge: '景點',
  name: '內湖彩虹河濱公園',
  tagline: '總部旁的基隆河畔，抬頭就是松山機場的航線',
  note: '概念地景，非實際比例',
  color: '#e8738a',
  // Between the 智慧城市 (0°) and 智慧製造 (60°) bridges, where no other island sits.
  angle: 30,
  distance: 54,
  r: 10,
  link: 'hq',
}

export const FET_SITE = 'https://www.fetnet.net'
export const FET_ENTERPRISE = 'https://enterprise.fetnet.net/content/ebu/tw/index.html'

export const FET: ScenicArea = {
  id: 'fet',
  kind: 'group',
  badge: '母公司',
  name: '遠傳電信',
  tagline: '靠得更近，想得更遠：富鴻網所屬的遠傳集團',
  note: '內容整理自遠傳電信官網公開資訊',
  color: '#d64550',
  // Mirrors the riverside park on the other side of 智慧城市 (between 0° and 300°).
  angle: 330,
  distance: 54,
  r: 10,
  link: 'hq',
}

export const SCENIC_AREAS: ScenicArea[] = [RIVERSIDE, FET]

export function scenicById(id: string): ScenicArea | undefined {
  return SCENIC_AREAS.find((a) => a.id === id)
}

// Distances outward from the park center (along the area's angle) for the river,
// far bank and airport; the airport runway runs perpendicular to that direction.
export const RIVER = { from: 10.5, to: 19 }
export const AIRPORT = { center: 32, length: 62, depth: 22 }
