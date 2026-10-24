import { ALL_GOALS, ISLANDS, islandById, searchIslands, type Island } from '../data/islands'
import { useGame } from '../store/useGame'

const CIRCLED = ['①', '②', '③', '④', '⑤']

function IslandRow({ island }: { island: Island }) {
  const openIsland = useGame((s) => s.openIsland)
  const visited = useGame((s) => s.visitedIslands.includes(island.id))
  return (
    <li>
      <button type="button" className="index-row" onClick={() => openIsland(island.id)} data-testid={`island-row-${island.id}`}>
        <span className="index-no" style={{ color: island.color }}>
          {island.no}
        </span>
        <span className="index-text">
          <strong>
            {island.name}
            {visited && <span className="stamp-dot" title="已登島" />}
          </strong>
          <small>{island.tagline}</small>
        </span>
        <span className="index-count">{island.goals.length} 項 ↗</span>
      </button>
    </li>
  )
}

function IslandList() {
  const query = useGame((s) => s.query)
  const setQuery = useGame((s) => s.setQuery)
  const ids = new Set(searchIslands(query))
  const group = (kind: Island['kind']) => ISLANDS.filter((i) => i.kind === kind && ids.has(i.id))
  const sections: [string, Island[]][] = [
    ['總部', group('hub')],
    ['六大解決方案', group('main')],
    ['延伸島', group('ext')],
  ]
  return (
    <>
      <header className="panel-head">
        <p className="kicker">THE SOLUTION INDEX</p>
        <h2>開創數位未來，共享數位生活。</h2>
        <p className="muted">
          6 大解決方案＋4 延伸島／{ALL_GOALS.length} 項服務重點
          <br />
          選一座島，走進它的世界。
        </p>
        <input
          className="search"
          type="search"
          placeholder="搜尋服務、關鍵字…（例如 AGV、儲能）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="search"
        />
      </header>
      {sections.map(([title, list]) =>
        list.length ? (
          <section key={title}>
            <h3 className="section-title">{title}</h3>
            <ul className="index-list">
              {list.map((i) => (
                <IslandRow key={i.id} island={i} />
              ))}
            </ul>
          </section>
        ) : null,
      )}
      {ids.size === 0 && <p className="muted empty">找不到「{query}」相關的服務，換個關鍵字試試。</p>}
    </>
  )
}

function IslandDetail({ island }: { island: Island }) {
  const { closeIsland, openGoal, closeGoal, travelTo } = useGame.getState()
  const selectedGoalId = useGame((s) => s.selectedGoalId)
  const readGoals = useGame((s) => s.readGoals)
  const goal = island.goals.find((g) => g.id === selectedGoalId)

  return (
    <div className="island-detail" data-testid="island-detail">
      <button type="button" className="back" onClick={goal ? closeGoal : closeIsland}>
        ← {goal ? island.name : '全部島嶼'}
      </button>
      <p className="kicker" style={{ color: island.color }}>
        {island.no} · {island.kind === 'main' ? '解決方案' : island.kind === 'ext' ? '延伸島' : '總部'}
      </p>
      <h2>{goal ? goal.title : island.name}</h2>

      {goal ? (
        <article className="goal-card" data-testid="goal-card">
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
      ) : (
        <>
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
      )}
    </div>
  )
}

export function IndexPanel() {
  const selected = useGame((s) => s.selectedIslandId)
  const open = useGame((s) => s.panelOpen)
  const setOpen = useGame((s) => s.setPanelOpen)
  const island = selected ? islandById(selected) : undefined
  return (
    <aside className={`panel${open ? ' is-open' : ''}`} data-testid="panel">
      <button type="button" className="panel-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? '收合 ▾' : '島嶼索引 ▴'}
      </button>
      <div className="panel-body">{island ? <IslandDetail island={island} /> : <IslandList />}</div>
    </aside>
  )
}
