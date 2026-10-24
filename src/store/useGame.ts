import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ALL_GOALS, ISLANDS } from '../data/islands'
import { INTRO_STEPS } from '../data/intro'

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'

export type Nearby = { type: 'paul' | 'goal'; id: string } | null

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

      nextIntro: () =>
        set(({ introStep }) => ({
          introStep: introStep === null || introStep + 1 >= INTRO_STEPS.length ? null : introStep + 1,
        })),
      skipIntro: () => set({ introStep: null }),

      openIsland: (id) => set({ selectedIslandId: id, selectedGoalId: null, panelOpen: true }),
      closeIsland: () => set({ selectedIslandId: null, selectedGoalId: null }),
      openGoal: (id) => {
        const goal = ALL_GOALS.find((g) => g.id === id)
        if (!goal) return
        set(({ readGoals }) => ({
          selectedIslandId: goal.islandId,
          selectedGoalId: id,
          readGoals: addOnce(readGoals, id),
          panelOpen: true,
        }))
      },
      closeGoal: () => set({ selectedGoalId: null }),
      setQuery: (query) => set({ query }),

      visitIsland: (id) => set(({ visitedIslands }) => ({ visitedIslands: addOnce(visitedIslands, id) })),
      setCurrentIsland: (id) => {
        if (get().currentIslandId === id) return
        set({ currentIslandId: id })
        if (id) get().visitIsland(id)
      },
      setTime: (timeOfDay) => set({ timeOfDay }),

      openTalk: () => set({ talkOpen: true }),
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
        else if (nearby?.type === 'goal') get().openGoal(nearby.id)
      },
      travelTo: (islandId) => set(({ moveRequest }) => ({ moveRequest: { islandId, seq: (moveRequest?.seq ?? 0) + 1 } })),
      resetProgress: () => set({ readGoals: [], visitedIslands: [] }),
    }),
    {
      name: 'fhnet-island',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ introStep, readGoals, visitedIslands, timeOfDay }) => ({ introStep, readGoals, visitedIslands, timeOfDay }),
    },
  ),
)

export function progress(s: Pick<GameState, 'readGoals' | 'visitedIslands'>) {
  return {
    islands: s.visitedIslands.length,
    islandTotal: ISLANDS.length,
    goals: s.readGoals.length,
    goalTotal: ALL_GOALS.length,
  }
}
