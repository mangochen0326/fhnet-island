import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { FAQ } from '../data/faq'
import { ALL_GOALS, ISLANDS, SITE, islandById } from '../data/islands'
import { INTRO_STEPS } from '../data/intro'
import { progress, useGame, type TimeOfDay } from '../store/useGame'

const BASE = import.meta.env.BASE_URL
const TIMES: [TimeOfDay, string, string][] = [
  ['dawn', '🌅', '清晨'],
  ['day', '☀️', '白天'],
  ['dusk', '🌇', '黃昏'],
  ['night', '🌙', '夜晚'],
]

export function TitleCard() {
  const time = useGame((s) => s.timeOfDay)
  const setTime = useGame((s) => s.setTime)
  return (
    <div className="title-card">
      <div className="title-row">
        <h1>富鴻網解決方案島</h1>
        <div className="time-toggle" role="group" aria-label="時段">
          {TIMES.map(([t, icon, label]) => (
            <button key={t} type="button" className={time === t ? 'on' : ''} onClick={() => setTime(t)} title={label} aria-label={label}>
              {icon}
            </button>
          ))}
        </div>
      </div>
      <p className="subtitle">Field Delivery Service · 數位轉型服務的提供者</p>
      <p className="badge" data-testid="demo-badge">
        Demo 展示 · 內容整理自富鴻網官網
      </p>
      <a className="site-link" href={SITE} target="_blank" rel="noreferrer">
        前往富鴻網官網 ↗
      </a>
    </div>
  )
}

export function TopActions() {
  const visitedIslands = useGame((s) => s.visitedIslands)
  const readGoals = useGame((s) => s.readGoals)
  const p = progress({ visitedIslands, readGoals })
  const setPassportOpen = useGame((s) => s.setPassportOpen)
  return (
    <div className="top-actions">
      <button type="button" onClick={() => setPassportOpen(true)} data-testid="passport-button">
        🛂 服務護照{' '}
        <span data-testid="stamp-count">
          {p.islands + p.goals} / {p.islandTotal + p.goalTotal}
        </span>
      </button>
    </div>
  )
}

export function HelpBar() {
  return <p className="help-bar">WASD 移動 · 左鍵拖曳旋轉 · 滾輪縮放 · 點地面走過去 · E 對話</p>
}

export function InteractPrompt() {
  const nearby = useGame((s) => s.nearby)
  const interact = useGame((s) => s.interact)
  const busy = useGame((s) => s.talkOpen || s.introStep !== null)
  if (!nearby || busy) return null
  const label =
    nearby.type === 'paul'
      ? '與小Paul 對話'
      : (() => {
          const g = ALL_GOALS.find((x) => x.id === nearby.id)
          return g ? `查看「${g.title}」` : ''
        })()
  return (
    <button type="button" className="interact" onClick={interact} data-testid="interact">
      <kbd>E</kbd> {label}
    </button>
  )
}

export function Intro() {
  const step = useGame((s) => s.introStep)
  const { nextIntro, skipIntro } = useGame.getState()
  if (step === null) return null
  const s = INTRO_STEPS[step]
  const last = step === INTRO_STEPS.length - 1
  return (
    <div className="modal-backdrop">
      <div className="modal intro" role="dialog" aria-modal="true" aria-labelledby="intro-title" data-testid="intro">
        <p className="kicker">{s.kicker}</p>
        <h2 id="intro-title">{s.title}</h2>
        <p>{s.body}</p>
        <div className="dots">
          {INTRO_STEPS.map((_, k) => (
            <span key={k} className={k === step ? 'on' : ''} />
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="ghost" onClick={skipIntro} data-testid="intro-skip">
            略過
          </button>
          <button type="button" className="cta" onClick={nextIntro} data-testid="intro-next">
            {last ? '開始探索' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function TalkDialog() {
  const open = useGame((s) => s.talkOpen)
  const paulIsland = useGame((s) => s.paulIslandId)
  const close = useGame((s) => s.closeTalk)
  const travelTo = useGame((s) => s.travelTo)
  const openIsland = useGame((s) => s.openIsland)
  const [line, setLine] = useState(0)
  const [faqId, setFaqId] = useState<string | null>(null)
  const island = islandById(paulIsland) ?? ISLANDS[0]

  useEffect(() => {
    if (open) {
      setLine(0)
      setFaqId(null)
    }
  }, [open, paulIsland])

  if (!open) return null
  const faq = FAQ.find((f) => f.id === faqId)
  const text = faq ? faq.a : island.guide[line]
  const hasMore = !faq && line < island.guide.length - 1

  return (
    <div className="talk" role="dialog" aria-label="小Paul 對話" data-testid="talk">
      <img className="talk-avatar" src={`${BASE}paul.webp`} alt="小Paul" />
      <div className="talk-bubble">
        <p className="kicker">小Paul · 在{island.name}</p>
        <p className="talk-text" data-testid="talk-text">
          {text}
        </p>
        {faq?.url && (
          <a href={faq.url} target="_blank" rel="noreferrer" className="talk-link">
            官網相關頁面 ↗
          </a>
        )}
        <div className="talk-actions">
          {hasMore && (
            <button type="button" className="cta" onClick={() => setLine(line + 1)}>
              下一句
            </button>
          )}
          {faq && (
            <button type="button" className="ghost" onClick={() => setFaqId(null)}>
              ← 回到導覽
            </button>
          )}
          {island.kind !== 'hub' && (
            <button
              type="button"
              className="ghost"
              onClick={() => {
                openIsland(island.id)
                close()
              }}
            >
              看{island.name}介紹
            </button>
          )}
          <button type="button" className="ghost" onClick={close} data-testid="talk-close">
            再見
          </button>
        </div>
        <div className="faq" aria-label="常見問題">
          {FAQ.map((f) => (
            <button key={f.id} type="button" className={f.id === faqId ? 'on' : ''} onClick={() => setFaqId(f.id)} data-testid={`faq-${f.id}`}>
              {f.q}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              travelTo('offices')
              close()
            }}
          >
            帶我去服務據點
          </button>
        </div>
      </div>
    </div>
  )
}

export function Passport() {
  const open = useGame((s) => s.passportOpen)
  const setOpen = useGame((s) => s.setPassportOpen)
  const visited = useGame((s) => s.visitedIslands)
  const read = useGame((s) => s.readGoals)
  const reset = useGame((s) => s.resetProgress)
  const openGoal = useGame((s) => s.openGoal)
  if (!open) return null
  const p = progress({ visitedIslands: visited, readGoals: read })
  const complete = p.islands === p.islandTotal && p.goals === p.goalTotal
  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div className="modal passport" role="dialog" aria-modal="true" aria-label="服務護照" onClick={(e) => e.stopPropagation()} data-testid="passport">
        <p className="kicker">SERVICE PASSPORT</p>
        <h2>服務護照</h2>
        <p className="muted">
          登島 {p.islands}/{p.islandTotal} · 服務 {p.goals}/{p.goalTotal}
          {complete && ' · 🎉 全部集滿，歡迎來信 welcome@fhnet.com.tw 聊聊你的需求！'}
        </p>
        <div className="stamps">
          {ISLANDS.map((island) => (
            <section key={island.id} className={`stamp-card${visited.includes(island.id) ? ' on' : ''}`} style={{ '--c': island.color } as CSSProperties}>
              <header>
                <span className="stamp">{visited.includes(island.id) ? '✓' : island.no}</span>
                <strong>{island.name}</strong>
              </header>
              <div className="stamp-goals">
                {island.goals.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={read.includes(g.id) ? 'on' : ''}
                    title={g.title}
                    onClick={() => {
                      openGoal(g.id)
                      setOpen(false)
                    }}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="ghost" onClick={reset}>
            重新開始
          </button>
          <button type="button" className="cta" onClick={() => setOpen(false)}>
            關閉
          </button>
        </div>
      </div>
    </div>
  )
}

// Short-lived notice whenever a new island stamp is earned.
export function StampToast() {
  const visited = useGame((s) => s.visitedIslands)
  const [msg, setMsg] = useState<string | null>(null)
  const prev = useRef(visited.length)
  useEffect(() => {
    if (visited.length > prev.current) {
      const island = islandById(visited[visited.length - 1])
      if (island) setMsg(`登島蓋章：${island.name}`)
      const t = setTimeout(() => setMsg(null), 2400)
      prev.current = visited.length
      return () => clearTimeout(t)
    }
    prev.current = visited.length
  }, [visited])
  return msg ? (
    <div className="toast" role="status">
      {msg}
    </div>
  ) : null
}
