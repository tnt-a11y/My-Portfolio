import { expect, test } from '@playwright/test'

test('eyes follow the pointer within their sockets, blink with local audio, and resume tracking', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const audioRequest = page.waitForRequest('**/media/ouch.wav')
  await page.goto('/')
  const eyes = page.getByRole('button', { name: 'Blink eyes and play Ouch' })
  await expect(eyes).toBeVisible()
  await page.mouse.move(1000, 650)
  const pupils = page.locator('.cursor-pupil')
  await expect.poll(() => pupils.first().evaluate(el => getComputedStyle(el).transform)).not.toBe('none')
  const offsets = await pupils.evaluateAll(es => es.map(el => {
    const matrix = new DOMMatrix(getComputedStyle(el).transform)
    return { x: matrix.m41, y: matrix.m42 }
  }))
  for (const offset of offsets) {
    expect(offset.x).toBeGreaterThan(0)
    expect(offset.y).toBeGreaterThan(0)
    expect(Math.hypot(offset.x, offset.y)).toBeLessThanOrEqual(5.01)
  }
  await eyes.click()
  await expect(eyes).toHaveClass(/is-blinking/)
  await audioRequest
  await expect(eyes).not.toHaveClass(/is-blinking/)
  await page.mouse.move(5, 10)
  await expect.poll(() => pupils.first().evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)).toBeLessThan(0)
  // Decode the shipped recording rather than relying only on the play() call.
  expect(await page.evaluate(async () => {
    const context = new AudioContext()
    try { return (await context.decodeAudioData(await (await fetch('/media/ouch.wav')).arrayBuffer())).duration }
    finally { await context.close() }
  })).toBeGreaterThan(.1)
})

test('reduced motion keeps pupils still while keyboard activation still blinks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  let audioRequests = 0
  page.on('request', request => { if (request.url().endsWith('/media/ouch.wav')) audioRequests++ })
  await page.goto('/')
  await page.mouse.move(1000, 650)
  expect(audioRequests).toBe(0)
  expect(await page.locator('.cursor-pupil').first().evaluate(el => {
    const matrix = new DOMMatrix(getComputedStyle(el).transform)
    return [matrix.m41, matrix.m42]
  })).toEqual([0, 0])
  const eyes = page.getByRole('button', { name: 'Blink eyes and play Ouch' })
  await eyes.focus()
  await page.keyboard.press('Enter')
  await expect(eyes).toHaveClass(/is-blinking/)
  await expect(eyes).not.toHaveClass(/is-blinking/)
  await expect.poll(() => audioRequests).toBe(1)
})
