import { expect, test } from '@playwright/test'

test('portrait has a prominent responsive size and the real game uses lightweight media', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const photo = page.getByRole('img', { name: 'Portrait of Tahmid Nasif Tamal' })
  expect((await photo.boundingBox())!.width).toBeGreaterThanOrEqual(300)
  await expect(page.getByRole('heading', { name: 'About me', exact: true })).toBeVisible()
  await page.setViewportSize({ width: 375, height: 812 })
  expect((await photo.boundingBox())!.width).toBeGreaterThanOrEqual(300)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const card = page.getByRole('button', { name: 'View RED TEAM ROCKSTARS details' })
  await expect(card).toHaveCount(1)
  const thumbnail = page.locator('.project-card').filter({ has: card }).locator('.project-preview > img')
  await expect(thumbnail).toHaveAttribute('loading', 'lazy')
  await expect(thumbnail).toHaveAttribute('src', /headquarters\.webp$/)
  expect(await page.evaluate(() => performance.getEntriesByType('resource').some(entry => /\.wasm|WebGL\.loader/.test(entry.name)))).toBe(false)
})

test('all personal photos reveal color independently, then return to monochrome', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const photos = page.locator('.photo-color-reveal')
  await expect(photos).toHaveCount(5)
  for (let index = 0; index < 5; index++) {
    const photo = photos.nth(index)
    const image = photo.locator('img')
    await photo.scrollIntoViewIfNeeded()
    await page.mouse.move(5, 150)
    await expect(image).toHaveCSS('filter', 'grayscale(1)')
    expect(await image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true)
    await photo.hover()
    await page.waitForTimeout(200)
    const amount = await image.evaluate(element => Number.parseFloat(getComputedStyle(element).filter.match(/[\d.]+/)![0]))
    expect(amount).toBeGreaterThan(0)
    expect(amount).toBeLessThan(1)
    await expect(image).toHaveCSS('filter', 'grayscale(0)')
    for (let other = 0; other < 5; other++) if (other !== index) await expect(photos.nth(other).locator('img')).toHaveCSS('filter', 'grayscale(1)')
    await page.mouse.move(5, 150)
    await expect(image).toHaveCSS('filter', 'grayscale(1)')
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await photos.nth(1).focus()
  await expect(photos.nth(1).locator('img')).toHaveCSS('filter', 'grayscale(0)')
  await expect(photos.nth(1).locator('img')).toHaveCSS('transition-duration', '0s')
})

test('small portraits sit beneath the first photo and align with the sea photos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const width of [600, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 })
    const main = (await page.locator('.portrait-frame').boundingBox())!
    const small = await page.locator('.supporting-gallery .personal-photo-frame').all()
    const sea = await page.locator('.personal-gallery .personal-photo-frame').all()
    for (let index = 0; index < 2; index++) {
      const left = (await small[index].boundingBox())!
      const right = (await sea[index].boundingBox())!
      expect(left.y).toBeGreaterThan(main.y + main.height)
      expect(left.width).toBeLessThan(main.width * .6)
      expect(left.height).toBeLessThan(right.height)
      expect(Math.abs(left.y + left.height - right.y - right.height)).toBeLessThanOrEqual(1)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('identity uses one senior title and has no decorative periods or repeated filler', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page).toHaveTitle('Tahmid Nasif Tamal | Senior Game Developer')
  await expect(page.getByText('Senior Game Developer', { exact: true })).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Blink eyes and play Ouch' })).toBeVisible()
  await expect(page.locator('.cursor-eye')).toHaveCount(2)
  await expect(page.locator('.headline-line')).toHaveText(['TAHMID', 'NASIF', 'TAMAL'])
  await expect(page.locator('.hero-intro > p')).toHaveCount(1)
  await expect(page.getByText(/Independent Developer|Creative Technologist|Creative mind|Technical hands|From a spark|More to come|From an idea/i)).toHaveCount(0)
  await expect(page.locator('.name-period, .brand-period, .nav-dot, .social-disabled')).toHaveCount(0)
  await expect(page.locator('.site-footer p')).toHaveText(/© \d{4} Tahmid Nasif Tamal$/)
})

test('game cards and dialogs remain colorful and link to the correct playable game', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const games = [
    { title: 'GULP IT BRO!', url: 'https://trinitrointeractive.itch.io/gulp-it-bro' },
    { title: 'MAZE FUNKER', url: 'https://trinitrointeractive.itch.io/maze-funker' },
    { title: 'RED TEAM ROCKSTARS', url: 'https://trinitrointeractive.itch.io/red-team-rockstars' },
    { title: 'THE VOTE', url: 'https://trinitrointeractive.itch.io/the-vote' },
  ]
  await expect(page.locator('.project-card')).toHaveCount(4)
  for (const game of games) {
    const card = page.locator('.project-card').filter({ has: page.getByRole('heading', { name: game.title, exact: true }) })
    await expect(card.locator('.project-preview > img')).toHaveCSS('filter', 'none')
    await card.getByRole('button').click()
    const dialog = page.getByRole('dialog', { name: game.title })
    await expect(dialog.getByRole('link', { name: 'PLAY PROJECT' })).toHaveAttribute('href', game.url)
    await expect(dialog.locator('.modal-still img')).toHaveCSS('filter', 'none')
    await expect(dialog.getByRole('link', { name: 'View Source' })).toHaveCount(0)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(card.getByRole('button')).toBeFocused()
  }
})

test('pixel trail has a bounded pool, finishes at rest, and disables for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const trail = page.locator('.pixel-cursor-trail')
  await expect(trail.locator('span')).toHaveCount(18)
  await page.mouse.move(200, 200)
  await page.mouse.move(800, 400, { steps: 12 })
  await expect.poll(() => trail.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBeGreaterThan(0)
  await page.waitForTimeout(500)
  expect(await trail.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.mouse.move(900, 500, { steps: 8 })
  await expect(trail).toHaveCSS('display', 'none')
  expect(await trail.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
})

test('cursor trail yields to the project dialog and returns after closing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.getByRole('button', { name: 'View RED TEAM ROCKSTARS details' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  const trail = page.locator('.pixel-cursor-trail')
  await expect(trail).toHaveAttribute('hidden', '')
  expect(await trail.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trail).not.toHaveAttribute('hidden', '')
})

test('unconfigured project media and build still have honest fallback states', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route(/\/src\/data\/content\.ts(?:\?.*)?$/, async route => {
    const response = await route.fetch()
    await route.fulfill({ response, body: `${await response.text()}\nprojects[0].poster = null; projects[0].playableUrl = null; projects[0].sourceUrl = null;\n` })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'View RED TEAM ROCKSTARS details' }).click()
  await expect(page.getByText('Gameplay preview coming soon')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Playable build coming soon' })).toBeDisabled()
  await expect(page.getByRole('link', { name: 'View Source' })).toHaveCount(0)
})
