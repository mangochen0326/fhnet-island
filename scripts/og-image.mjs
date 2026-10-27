// Renders public/og-image.png (1200x630), the link-preview image for social sharing.
// Usage: pnpm build && pnpm preview --port 4173 (in another terminal), then
//        node scripts/og-image.mjs [http://127.0.0.1:4173/]
import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const url = process.argv[2] ?? 'http://127.0.0.1:4173/'
const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url))

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })

// Skip the intro so the scene is unobstructed.
await page.addInitScript(() => {
  localStorage.setItem('fhnet-island', JSON.stringify({ state: { introStep: null, readGoals: [], visitedIslands: [], talkedNpcs: [], timeOfDay: 'day' }, version: 0 }))
})
await page.goto(url)
await page.waitForSelector('canvas')
await page.waitForFunction(() => '__fhnetIsland' in window)

// Pull back to the bird's-eye view, then let the camera settle and textures load.
await page.evaluate(() => window.__fhnetIsland.useGame.getState().showMap())
await page.waitForTimeout(6000)

// Replace the in-game HUD with a title card made for the preview.
await page.addStyleTag({
  content: `
    .panel, .title-card, .top-actions, .help-bar, .zone-hud, .interact, .toast, .goal-tag, .npc-tag, .you-tag, .paul-tag { display: none !important; }
    .og-card { position: fixed; left: 48px; bottom: 48px; z-index: 999; padding: 28px 36px; border-radius: 24px;
      background: rgba(20, 49, 58, 0.92); color: #fff; font-family: 'Noto Sans TC', 'PingFang TC', sans-serif;
      box-shadow: 0 16px 40px rgba(0,0,0,.35); }
    .og-card img { height: 64px; display: block; margin-bottom: 14px; }
    .og-card h1 { margin: 0; font-size: 56px; letter-spacing: .06em; }
    .og-card p { margin: 10px 0 0; font-size: 24px; color: #cfe3ea; }
  `,
})
await page.evaluate(() => {
  const card = document.createElement('div')
  card.className = 'og-card'
  card.innerHTML = `<img src="fhnet-logo.svg" alt="" /><h1>富鴻網解決方案島</h1><p>走進 3D 島嶼，逛遍六大解決方案</p>`
  document.body.appendChild(card)
})
await page.waitForTimeout(800)
await page.screenshot({ path: out })
await browser.close()
console.log(`wrote ${out}`)
