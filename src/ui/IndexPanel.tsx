import { ALL_GOALS, ISLANDS, searchIslands, type Island } from '../data/islands'
import { SCENIC_AREAS } from '../data/scenic'
import { useGame } from '../store/useGame'

function IslandRow({ island }: { island: Island }) {
  const openIsland = useGame((s) => s.openIsland)
  const visited = useGame((s) => s.visitedIslands.includes(island.id))
  const selected = useGame((s) => s.selectedIslandId === island.id)
  return (
    <li>
      <button type="button" className={`index-row${selected ? ' is-selected' : ''}`} aria-current={selected || undefined} onClick={() => openIsland(island.id)} data-testid={`island-row-${island.id}`}>
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
  const q = query.trim().toLowerCase()
  const scenic = SCENIC_AREAS.filter((a) => !q || `${a.name}${a.tagline}`.toLowerCase().includes(q))
  const travelTo = useGame((s) => s.travelTo)
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
      {scenic.length > 0 && (
        <section>
          <h3 className="section-title">景點</h3>
          <ul className="index-list">
            {scenic.map((a) => (
              <li key={a.id}>
                <button type="button" className="index-row" onClick={() => travelTo(a.id)} data-testid={`scenic-row-${a.id}`}>
                  <span className="index-no" style={{ color: a.color }}>
                    ✈
                  </span>
                  <span className="index-text">
                    <strong>{a.name}</strong>
                    <small>{a.tagline}</small>
                  </span>
                  <span className="index-count">走過去 ↗</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {ids.size === 0 && scenic.length === 0 && <p className="muted empty">找不到「{query}」相關的服務，換個關鍵字試試。</p>}
    </>
  )
}

export function IndexPanel() {
  const open = useGame((s) => s.panelOpen)
  const setOpen = useGame((s) => s.setPanelOpen)
  return (
    <aside className={`panel${open ? ' is-open' : ''}`} data-testid="panel">
      <button type="button" className="panel-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? '收合 ▾' : '島嶼索引 ▴'}
      </button>
      <div className="panel-body">
        <IslandList />
      </div>
    </aside>
  )
}
