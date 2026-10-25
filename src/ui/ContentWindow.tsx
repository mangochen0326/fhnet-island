import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { islandById, type Island } from '../data/islands'
import { useGame } from '../store/useGame'

const CIRCLED = ['①', '②', '③', '④', '⑤']

function IslandContent({ island }: { island: Island }) {
  const { openGoal, closeGoal, travelTo } = useGame.getState()
  const selectedGoalId = useGame((s) => s.selectedGoalId)
  const readGoals = useGame((s) => s.readGoals)
  const goal = island.goals.find((g) => g.id === selectedGoalId)

  if (goal) {
    return (
      <article className="goal-card" data-testid="goal-card">
        <button type="button" className="back" onClick={closeGoal}>
          ← {island.name}
        </button>
        <h2>{goal.title}</h2>
        <p>{goal.summary}</p>
        <ul className="points">
          {goal.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <a className="cta" href={goal.url} target="_blank" rel="noreferrer">
          到富鴻網官網看更多 ↗
        </a>
      </article>
    )
  }

  return (
    <>
      <h2>{island.name}</h2>
      <p className="tagline">{island.tagline}</p>
      <p className="muted">{island.intro}</p>
      <div className="actions">
        <button type="button" className="cta" onClick={() => travelTo(island.id)} data-testid="travel">
          ✈ 走到這座島
        </button>
        <a className="ghost" href={island.url} target="_blank" rel="noreferrer">
          官網介紹 ↗
        </a>
      </div>
      <ol className="goal-list">
        {island.goals.map((g, k) => (
          <li key={g.id}>
            <button type="button" onClick={() => openGoal(g.id)} data-testid={`goal-row-${g.id}`}>
              <span className="goal-no">{CIRCLED[k]}</span>
              <span>
                <strong>{g.title}</strong>
                <small>{g.summary}</small>
              </span>
              {readGoals.includes(g.id) && <span className="check">✓</span>}
            </button>
          </li>
        ))}
      </ol>
    </>
  )
}

// Floating, draggable window over the 3D stage that shows an island or one of its goals.
export function ContentWindow() {
  const selected = useGame((s) => s.selectedIslandId)
  const closeIsland = useGame((s) => s.closeIsland)
  const island = selected ? islandById(selected) : undefined
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number } | null>(null)

  // Each newly opened island starts back at the default position.
  useEffect(() => setOffset({ x: 0, y: 0 }), [selected])

  if (!island) return null

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    drag.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (drag.current) setOffset({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y })
  }
  const onPointerUp = () => {
    drag.current = null
  }

  return (
    <section
      className="content-window"
      role="dialog"
      aria-label={island.name}
      style={{ translate: `${offset.x}px ${offset.y}px`, '--c': island.color } as CSSProperties}
      data-testid="island-detail"
    >
      <header className="window-bar" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        <span className="kicker" style={{ color: island.color }}>
          {island.no} · {island.kind === 'main' ? '解決方案' : island.kind === 'ext' ? '延伸島' : '總部'}
        </span>
        <button type="button" className="window-close" onClick={closeIsland} aria-label="關閉" data-testid="window-close">
          ✕
        </button>
      </header>
      <div className="window-body">
        <IslandContent island={island} />
      </div>
    </section>
  )
}
