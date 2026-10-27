import { expect, test, type Page } from '@playwright/test'

async function start(page: Page) {
  await page.goto('./')
  await expect(page.getByTestId('intro')).toBeVisible()
  await page.getByTestId('intro-skip').click()
  await expect(page.getByTestId('intro')).toBeHidden()
}

// The index is a collapsed bottom sheet on phones.
async function openPanel(page: Page) {
  const panel = page.getByTestId('panel')
  if (!(await panel.getAttribute('class'))?.includes('is-open')) await panel.getByRole('button', { name: /島嶼索引/ }).click()
  await expect(panel).toHaveClass(/is-open/)
}

const playerPos = (page: Page) =>
  page.evaluate(() => {
    const { runtime } = (window as unknown as { __fhnetIsland: { runtime: { player: { x: number; z: number } } } }).__fhnetIsland
    return { x: runtime.player.x, z: runtime.player.z }
  })

test('renders the 3D scene, demo badge and intro without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('./')
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByTestId('demo-badge')).toContainText('Demo')
  await page.getByTestId('intro-next').click()
  await page.getByTestId('intro-next').click()
  await page.getByTestId('intro-next').click()
  await expect(page.getByTestId('intro')).toBeHidden()
  await expect(page.getByTestId('goal-tag-mfg-agv')).toBeAttached()
  expect(errors).toEqual([])
})

test('remembers that the intro was dismissed', async ({ page }) => {
  await start(page)
  await page.reload()
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByTestId('intro')).toBeHidden()
})

test('search filters the island index', async ({ page }) => {
  await start(page)
  await openPanel(page)
  await page.getByTestId('search').fill('充電樁')
  await expect(page.getByTestId('island-row-energy')).toBeVisible()
  await expect(page.getByTestId('island-row-mfg')).toBeHidden()
  await page.getByTestId('search').fill('完全找不到的字')
  await expect(page.getByText('找不到')).toBeVisible()
})

test('reading a goal earns a stamp and links to the official site', async ({ page, isMobile }) => {
  await start(page)
  const count = page.getByTestId('stamp-count')
  const before = await count.textContent()
  await openPanel(page)
  await page.getByTestId('island-row-energy').click()
  await page.getByTestId('goal-row-energy-ev').click()
  const card = page.getByTestId('goal-card')
  await expect(card).toContainText('CHAdeMO')
  await expect(card.getByRole('link')).toHaveAttribute('href', 'https://www.fhnet.com.tw/solution/renewable-energy/charging-pile')
  await expect(count).not.toHaveText(before!)

  await page.getByTestId('window-close').click()
  await expect(page.getByTestId('island-detail')).toBeHidden()
  if (isMobile) await page.getByRole('button', { name: /收合/ }).click()
  await page.getByTestId('passport-button').click()
  await expect(page.getByTestId('passport')).toContainText('服務 1/')
})

test('island content opens in a floating window over the scene', async ({ page }) => {
  await start(page)
  await openPanel(page)
  await page.getByTestId('island-row-hq').click()
  const win = page.getByTestId('island-detail')
  await expect(win).toBeVisible()
  await win.getByTestId('goal-row-hq-profile').click()
  await expect(page.getByTestId('goal-card')).toContainText('遠傳電信')
  // The window floats over the stage, not inside the index panel.
  await expect(page.getByTestId('panel').getByTestId('island-detail')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('goal-card')).toBeHidden()
  await page.keyboard.press('Escape')
  await expect(win).toBeHidden()
})

test('travel walks the player across bridges to the island', async ({ page }) => {
  await start(page)
  await openPanel(page)
  await page.getByTestId('island-row-mfg').click()
  await page.getByTestId('travel').click()
  await expect.poll(async () => (await playerPos(page)).x, { timeout: 30_000 }).toBeGreaterThan(20)
})

test('keyboard WASD moves the player', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard only')
  await start(page)
  const before = await playerPos(page)
  await page.locator('canvas').click({ position: { x: 5, y: 5 } })
  await page.keyboard.down('KeyW')
  await page.waitForTimeout(600)
  await page.keyboard.up('KeyW')
  const after = await playerPos(page)
  expect(Math.hypot(after.x - before.x, after.z - before.z)).toBeGreaterThan(1)
})

test('小Paul answers quick questions', async ({ page }) => {
  await start(page)
  await page.getByTestId('paul-tag').click()
  const talk = page.getByTestId('talk')
  await expect(talk).toBeVisible()
  await page.getByTestId('faq-contact').click()
  await expect(page.getByTestId('talk-text')).toContainText('welcome@fhnet.com.tw')
  await page.getByTestId('talk-close').click()
  await expect(talk).toBeHidden()
})

test('zone residents talk about their services and count toward the zone mission', async ({ page }) => {
  await start(page)
  // The visitor starts on the HQ island, so its zone mission is shown.
  await expect(page.getByTestId('zone-hud')).toContainText('富鴻網總部')
  await expect(page.getByTestId('zone-npcs')).toHaveText('街坊探索 0/2')

  await page.getByTestId('passport-button').click()
  await page.getByTestId('passport').getByRole('button', { name: /人資夥伴/ }).click()
  const talk = page.getByTestId('npc-talk')
  await expect(talk).toContainText('彈性工時')
  await page.getByTestId('npc-next').click()
  await expect(page.getByTestId('npc-text')).toContainText('hr@fhnet.com.tw')
  await page.getByTestId('npc-goal').click()
  await expect(talk).toBeHidden()
  await expect(page.getByTestId('goal-card')).toContainText('遠傳電信')
  await page.getByTestId('window-close').click()
  await expect(page.getByTestId('zone-npcs')).toHaveText('街坊探索 1/2')
})

test('return to map zooms out of the zone', async ({ page, isMobile }) => {
  test.skip(isMobile, 'zone buttons are desktop-only')
  await start(page)
  await page.getByTestId('show-map').click()
  await expect(page.getByTestId('zone-hud')).toContainText('全島地圖')
})

test('moving closes the open dialog without pressing goodbye', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard only')
  await start(page)
  await page.getByTestId('paul-tag').click()
  await expect(page.getByTestId('talk')).toBeVisible()
  await page.keyboard.down('KeyS')
  await expect(page.getByTestId('talk')).toBeHidden()
  await page.keyboard.up('KeyS')

  await page.getByTestId('passport-button').click()
  await page.getByTestId('passport').getByRole('button', { name: /人資夥伴/ }).click()
  await expect(page.getByTestId('npc-talk')).toBeVisible()
  await page.keyboard.down('KeyW')
  await expect(page.getByTestId('npc-talk')).toBeHidden()
  await page.keyboard.up('KeyW')
})

test('opening a dialog stops a walk in progress', async ({ page, isMobile }) => {
  await start(page)
  await openPanel(page)
  await page.getByTestId('island-row-mfg').click()
  await page.getByTestId('travel').click()
  await page.getByTestId('window-close').click()
  if (isMobile) await page.getByRole('button', { name: /收合/ }).click()
  await page.getByTestId('passport-button').click()
  await page.getByTestId('passport').getByRole('button', { name: /人資夥伴/ }).click()
  // The dialog stays open and the visitor stays put because the walk was cancelled.
  const pos = await playerPos(page)
  await page.waitForTimeout(1500)
  await expect(page.getByTestId('npc-talk')).toBeVisible()
  expect(await playerPos(page)).toEqual(pos)
})

test('the riverside park looks across the Keelung River to Songshan Airport', async ({ page }) => {
  await start(page)
  await expect(page.getByText('TSA 臺北松山機場')).toBeAttached()
  await expect(page.getByText('彩虹橋')).toBeAttached()
  await openPanel(page)
  await page.getByTestId('scenic-row-riverside').click()
  await expect(page.getByTestId('zone-hud')).toContainText('內湖彩虹河濱公園', { timeout: 30_000 })
  await expect(page.getByTestId('zone-npcs')).toHaveText('街坊探索 0/3')
})

test('the FarEasTone zone introduces the parent company and links to its site', async ({ page, isMobile }) => {
  await start(page)
  await openPanel(page)
  await page.getByTestId('scenic-row-fet').click()
  await expect(page.getByTestId('zone-hud')).toContainText('遠傳電信', { timeout: 30_000 })
  await expect(page.getByTestId('zone-hud')).toContainText('內容整理自遠傳電信官網')

  if (isMobile) await page.getByRole('button', { name: /收合/ }).click()
  await page.getByTestId('passport-button').click()
  await page.getByTestId('passport').getByRole('button', { name: /集團服務專員/ }).click()
  await expect(page.getByTestId('npc-text')).toContainText('富鴻網是遠傳集團的一員')
  await page.getByTestId('npc-next').click()
  await expect(page.getByTestId('npc-link')).toHaveAttribute('href', /enterprise\.fetnet\.net/)
})

test('HQ and the FarEasTone zone show their company logos', async ({ page }) => {
  const fhnet = page.waitForResponse((r) => r.url().endsWith('/fhnet-logo.svg'))
  const fet = page.waitForResponse((r) => r.url().endsWith('/fet-logo.png'))
  await page.goto('./')
  expect((await fhnet).ok()).toBe(true)
  expect((await fet).ok()).toBe(true)
})

test('link previews have Open Graph tags and a reachable image', async ({ page, request }) => {
  await page.goto('./')
  const image = await page.locator('meta[property="og:image"]').getAttribute('content')
  expect(image).toBe('https://fhnet-island.vercel.app/og-image.png')
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /富鴻網解決方案島/)
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
  // The image is served from this build too, so check it locally.
  const res = await request.get('og-image.png')
  expect(res.ok()).toBe(true)
  expect(res.headers()['content-type']).toContain('image/png')
})
