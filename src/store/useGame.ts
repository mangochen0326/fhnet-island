import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ALL_GOALS, ISLANDS } from '../data/islands'
import { INTRO_STEPS } from '../data/intro'
import { NPCS, npcsOf } from '../data/npcs'

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'

export type Nearby = { type: 'paul' | 'npc' | 'goal'; id: string } | null

// 'zone' zooms the camera into one business zone; 'map' shows the whole archipelago.
export type View = { mode: 'map' | 'zone'; islandId: string | null; seq: number }

type GameState = {
  introStep: number | null
  selectedIslandId: string | null
  selectedGoalId: string | null
  query: string
  readGoals: string[]
  visitedIslands: string[]
  timeOfDay: TimeOfDay
  talkOpen: boolean
  passportOpen: boolean
  panelOpen: boolean
  nearby: Nearby
  currentIslandId: string | null
  paulIslandId: string
  moveRequest: { islandId: string; seq: number } | null
  talkNpcId: string | null
  talkedNpcs: string[]
  view: View

  nextIntro: () => void
  skipIntro: () => void
  openIsland: (id: string) => void
  closeIsland: () => void
  openGoal: (id: string) => void
  closeGoal: () => void
  setQuery: (q: string) => void
  visitIsland: (id: string) => void
  setCurrentIsland: (id: string | null) => void
  setTime: (t: TimeOfDay) => void
  openTalk: () => void
  closeTalk: () => void
  setPassportOpen: (open: boolean) => void
  setPanelOpen: (open: boolean) => void
  setNearby: (n: Nearby) => void
  setPaulIsland: (id: string) => void
  interact: () => void
  travelTo: (islandId: string) => void
  resetProgress: () => void
  openNpc: (id: string) => void
  closeNpc: () => void
  showMap: () => void
}

const addOnce = (list: string[], id: string) => (list.includes(id) ? list : [...list, id])

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      introStep: 0,
      selectedIslandId: null,
      selectedGoalId: null,
      query: '',
      readGoals: [],
      visitedIslands: [],
      timeOfDay: 'day',
      talkOpen: false,
      passportOpen: false,
      // On phones the index starts collapsed so the island is visible.
      panelOpen: typeof window === 'undefined' || window.innerWidth > 820,
      nearby: null,
      currentIslandId: null,
      paulIslandId: 'hq',
      moveRequest: null,
      talkNpcId: null,
      talkedNpcs: [],
      view: { mode: 'map', islandId: null, seq: 0 },

      nextIntro: () =>
        set(({ introStep }) => ({
          introStep: introStep === null || introStep + 1 >= INTRO_STEPS.length ? null : introStep + 1,
        })),
      skipIntro: () => set({ introStep: null }),

      openIsland: (id) => set({ selectedIslandId: id, selectedGoalId: null }),
      closeIsland: () => set({ selectedIslandId: null, selectedGoalId: null }),
      openGoal: (id) => {
        const goal = ALL_GOALS.find((g) => g.id === id)
        if (!goal) return
        set(({ readGoals }) => ({
          selectedIslandId: goal.islandId,
          selectedGoalId: id,
          readGoals: addOnce(readGoals, id),
        }))
      },
      closeGoal: () => set({ selectedGoalId: null }),
      setQuery: (query) => set({ query }),

      // Only real islands earn passport stamps; scenic areas such as the riverside park don't.
      visitIsland: (id) => {
        if (!ISLANDS.some((i) => i.id === id)) return
        set(({ visitedIslands }) => ({ visitedIslands: addOnce(visitedIslands, id) }))
      },
      setCurrentIsland: (id) => {
        if (get().currentIslandId === id) return
        set({ currentIslandId: id })
        if (id) {
          get().visitIsland(id)
          set(({ view }) => ({ view: { mode: 'zone', islandId: id, seq: view.seq + 1 } }))
        }
      },
      setTime: (timeOfDay) => set({ timeOfDay }),

      openTalk: () => set({ talkOpen: true, talkNpcId: null }),
      closeTalk: () => set({ talkOpen: false }),
      setPassportOpen: (passportOpen) => set({ passportOpen }),
      setPanelOpen: (panelOpen) => set({ panelOpen }),
      setNearby: (nearby) => {
        const cur = get().nearby
        if (cur?.type === nearby?.type && cur?.id === nearby?.id) return
        set({ nearby })
      },
      setPaulIsland: (paulIslandId) => set({ paulIslandId }),

      interact: () => {
        const { nearby } = get()
        if (nearby?.type === 'paul') get().openTalk()
        else if (nearby?.type === 'npc') get().openNpc(nearby.id)
        else if (nearby?.type === 'goal') get().openGoal(nearby.id)
      },
      travelTo: (islandId) => set(({ moveRequest }) => ({ moveRequest: { islandId, seq: (moveRequest?.seq ?? 0) + 1 } })),
      resetProgress: () => set({ readGoals: [], visitedIslands: [], talkedNpcs: [] }),
      openNpc: (id) => {
        if (!NPCS.some((n) => n.id === id)) return
        set(({ talkedNpcs }) => ({ talkNpcId: id, talkOpen: false, talkedNpcs: addOnce(talkedNpcs, id) }))
      },
      closeNpc: () => set({ talkNpcId: null }),
      showMap: () => set(({ view }) => ({ view: { mode: 'map', islandId: null, seq: view.seq + 1 } })),
    }),
    {
      name: 'fhnet-island',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ introStep, readGoals, visitedIslands, talkedNpcs, timeOfDay }) => ({ introStep, readGoals, visitedIslands, talkedNpcs, timeOfDay }),
    },
  ),
)

export function progress(s: Pick<GameState, 'readGoals' | 'visitedIslands' | 'talkedNpcs'>) {
  return {
    islands: s.visitedIslands.length,
    islandTotal: ISLANDS.length,
    goals: s.readGoals.length,
    goalTotal: ALL_GOALS.length,
    npcs: s.talkedNpcs.length,
    npcTotal: NPCS.length,
  }
}

// Zone missions: talk to the residents and read the services of one island.
export function zoneProgress(s: Pick<GameState, 'readGoals' | 'talkedNpcs'>, islandId: string) {
  const npcs = npcsOf(islandId)
  const goals = ISLANDS.find((i) => i.id === islandId)?.goals ?? []
  return {
    npcs: npcs.filter((n) => s.talkedNpcs.includes(n.id)).length,
    npcTotal: npcs.length,
    goals: goals.filter((g) => s.readGoals.includes(g.id)).length,
    goalTotal: goals.length,
  }
}
