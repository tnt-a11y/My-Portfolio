import { expect, test } from '@playwright/test'
import { createSeed, evolveBoard } from '../src/lib/life'

test('Conway rules preserve a still life and oscillate a blinker', () => {
  const size = 8
  const block = new Uint8Array(size * size)
  for (const [x, y] of [[3, 3], [4, 3], [3, 4], [4, 4]]) block[y * size + x] = 1
  expect(evolveBoard(block, size)).toEqual(block)

  const horizontal = new Uint8Array(size * size)
  for (const x of [2, 3, 4]) horizontal[3 * size + x] = 1
  const vertical = new Uint8Array(size * size)
  for (const y of [2, 3, 4]) vertical[y * size + 3] = 1
  expect(evolveBoard(horizontal, size)).toEqual(vertical)
  expect(evolveBoard(vertical, size)).toEqual(horizontal)
})

test('the simulation wraps correctly at grid edges and reseeds reproducibly', () => {
  const size = 8
  const horizontal = new Uint8Array(size * size)
  for (const x of [7, 0, 1]) horizontal[3 * size + x] = 1
  const vertical = new Uint8Array(size * size)
  for (const y of [2, 3, 4]) vertical[y * size] = 1
  expect(evolveBoard(horizontal, size)).toEqual(vertical)
  expect(createSeed(241)).toEqual(createSeed(241))
  expect(createSeed(241)).not.toEqual(createSeed(242))
})

test('reduced motion starts paused; stepping, reseeding and keyboard drawing work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const grid = page.getByRole('application', { name: 'Interactive Game of Life grid' })
  const generation = page.getByTestId('life-generation')
  await expect(page.getByRole('button', { name: 'Play simulation', exact: true })).toBeVisible()
  await expect(generation).toHaveText('00000')
  const square = await grid.boundingBox()
  expect(Math.abs(square!.width - square!.height)).toBeLessThan(1)
  await page.getByRole('button', { name: 'Next generation' }).click()
  await expect(generation).toHaveText('00001')
  await page.getByRole('button', { name: 'Reseed simulation' }).click()
  await expect(generation).toHaveText('00000')
  await grid.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.cellular-art [aria-live="polite"]')).toContainText('Row 21, column 22')
  const before = await page.locator('.cellular-art [aria-live="polite"]').textContent()
  await page.keyboard.press('Space')
  expect(await page.locator('.cellular-art [aria-live="polite"]').textContent()).not.toBe(before)
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Play simulation', exact: true })).toBeFocused()
})

test('the live grid plays, pauses and suspends its work when offscreen or the tab is hidden', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const generation = page.getByTestId('life-generation')
  await expect.poll(async () => Number(await generation.textContent())).toBeGreaterThan(1)
  await page.getByRole('button', { name: 'Pause simulation', exact: true }).click()
  const paused = await generation.textContent()
  await page.waitForTimeout(400)
  await expect(generation).toHaveText(paused!)
  await page.getByRole('button', { name: 'Play simulation', exact: true }).click()
  await expect.poll(() => generation.textContent()).not.toBe(paused)

  await page.getByRole('navigation').getByRole('link', { name: /contact/i }).click()
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  const offscreen = await generation.textContent()
  await page.waitForTimeout(400)
  await expect(generation).toHaveText(offscreen!)
  await page.getByRole('link', { name: 'BACK TO TOP', exact: true }).click()
  await expect.poll(() => generation.textContent()).not.toBe(offscreen)

  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  const hidden = await generation.textContent()
  await page.waitForTimeout(400)
  await expect(generation).toHaveText(hidden!)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect.poll(() => generation.textContent()).not.toBe(hidden)
})

test('pointer drawing changes the paused grid and the supplied portrait loads', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const grid = page.getByRole('application', { name: 'Interactive Game of Life grid' })
  await grid.focus()
  const before = await grid.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
  await grid.click({ position: { x: 10, y: 10 } })
  await expect.poll(() => grid.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())).not.toBe(before)
  const portrait = page.getByRole('img', { name: 'Portrait of Tahmid Nasif Tamal' })
  await expect(portrait).toBeVisible()
  expect(await portrait.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  await expect(portrait).toHaveCSS('filter', 'grayscale(1)')
  await expect(page.locator('.orbital-art')).toHaveCount(0)
})
