import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { projects } from '../src/data/content'

const featured = projects[0]
const projectCard = (page: Page) => page.getByRole('button', { name: `View ${featured.title} details` })
const dialog = (page: Page) => page.getByRole('dialog', { name: featured.title })

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test('ordered sections, configured projects and icon contacts, deferred game media', async ({ page }) => {
  const errors: string[] = []
  const mediaRequests: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('request', request => { if (/\.(mp4|webm|mov)(?:\?|$)/.test(request.url())) mediaRequests.push(request.url()) })
  await page.goto('/')
  await expect(page.locator('main > section')).toHaveCount(4)
  expect(await page.locator('main > section').evaluateAll(elements => elements.map(element => element.id))).toEqual(['projects', 'about', 'services', 'contact'])
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  await expect(nav.getByRole('link')).toHaveCount(4)
  await expect(nav.getByRole('link')).toHaveText(['PROJECTS', 'ABOUT', 'SERVICES', 'CONTACT'])
  for (const id of ['about', 'projects', 'contact']) {
    await expect(nav.getByRole('link', { name: new RegExp(id, 'i') })).toHaveAttribute('href', `#${id}`)
  }
  await expect(projectCard(page)).toHaveCount(1)
  await expect(page.locator('.project-card')).toHaveCount(projects.length)
  await expect(page.locator('video')).toHaveCount(0)
  await expect(page.locator('.contact-links > a')).toHaveCount(5)
  await expect(page.locator('.contact-links')).toHaveText('')
  await expect(page.getByRole('button', { name: /copy email/i })).toHaveCount(0)
  await projectCard(page).click()
  await expect(dialog(page)).toBeVisible()
  await expect(dialog(page).getByRole('img', { name: `${featured.title} game screenshot` })).toBeVisible()
  if (featured.playableUrl) await expect(dialog(page).getByRole('link', { name: 'PLAY PROJECT' })).toHaveAttribute('href', featured.playableUrl)
  else await expect(page.getByRole('button', { name: 'Playable build coming soon' })).toBeDisabled()
  await expect(dialog(page).locator('video')).toHaveCount(0)
  if (featured.sourceUrl) await expect(dialog(page).getByRole('link', { name: 'View Source' })).toHaveAttribute('href', featured.sourceUrl)
  else await expect(dialog(page).getByRole('link', { name: 'View Source' })).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(dialog(page)).toHaveCount(0)
  expect(mediaRequests).toEqual([])
  expect(errors).toEqual([])
})

test('modal traps focus, locks scroll, closes on Escape, restores focus and scroll', async ({ page }) => {
  await page.goto('/')
  await projectCard(page).scrollIntoViewIfNeeded()
  await projectCard(page).focus()
  const initialScroll = await page.evaluate(() => window.scrollY)
  await page.keyboard.press('Enter')
  await expect(dialog(page)).toBeVisible()
  const close = page.getByRole('button', { name: 'Close project details' })
  await expect(close).toBeFocused()
  const focusableCount = await dialog(page).locator('button:not(:disabled), a[href], video[controls]').count()
  for (let i = 0; i < focusableCount; i++) await page.keyboard.press('Tab')
  await expect(close).toBeFocused()
  for (let i = 0; i < focusableCount; i++) await page.keyboard.press('Shift+Tab')
  await expect(close).toBeFocused()
  await expect(page.locator('body')).toHaveCSS('position', 'fixed')
  await page.mouse.wheel(0, 500)
  await expect(page.locator('body')).toHaveCSS('top', `-${initialScroll}px`)
  await page.keyboard.press('Escape')
  await expect(dialog(page)).toHaveCount(0)
  await expect(projectCard(page)).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('position', 'fixed')
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(initialScroll, 0)
})

test('inside clicks stay open; backdrop and close button dismiss; repeat opens remain reliable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  for (let i = 0; i < 5; i++) {
    await projectCard(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.getByRole('heading', { name: 'FEATURES', exact: true }).click()
    await expect(dialog(page)).toBeVisible()
    if (i % 2 === 0) await page.mouse.click(3, 3)
    else await page.getByRole('button', { name: 'Close project details' }).click()
    await expect(dialog(page)).toHaveCount(0)
    await expect(projectCard(page)).toBeFocused()
  }
  expect(errors).toEqual([])
})

test('navigation scrolls and updates active section', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation')
  await nav.getByRole('link', { name: /projects/i }).click()
  await expect(nav.getByRole('link', { name: /projects/i })).toHaveAttribute('aria-current', 'location')
  await expect(page).toHaveURL(/#projects$/)
  await nav.getByRole('link', { name: /contact/i }).click()
  await expect(nav.getByRole('link', { name: /contact/i })).toHaveAttribute('aria-current', 'location')
  await expect(page.locator('.scroll-progress')).not.toHaveCSS('transform', 'matrix(0, 0, 0, 1, 0, 0)')
})

test('Contact stays active at the page bottom with reveal motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const nav = page.getByRole('navigation')
  await nav.getByRole('link', { name: /contact/i }).click()
  await expect(nav.getByRole('link', { name: /contact/i })).toHaveAttribute('aria-current', 'location')
  await page.waitForTimeout(1300)
  await expect(nav.getByRole('link', { name: /contact/i })).toHaveAttribute('aria-current', 'location')
})

for (const width of [320, 375, 430, 768, 1024, 1366, 1440, 1920]) {
  test(`responsive page and modal at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 500 ? 812 : 900 })
    await page.goto('/')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await projectCard(page).click()
    await expect(dialog(page)).toBeVisible()
    const box = await dialog(page).boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.width).toBeLessThanOrEqual(width)
    expect(await dialog(page).evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
    const build = dialog(page).locator('.modal-cta .button')
    await build.scrollIntoViewIfNeeded()
    await expect(build).toBeInViewport()
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toHaveCount(0)
  })
}

test('mobile orientation change retains usable modal', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await projectCard(page).click()
  await page.setViewportSize({ width: 812, height: 375 })
  await expect(dialog(page)).toBeVisible()
  await dialog(page).locator('.modal-cta .button').scrollIntoViewIfNeeded()
  await expect(dialog(page).locator('.modal-cta .button')).toBeInViewport()
  await page.keyboard.press('Escape')
  await expect(page.locator('body')).not.toHaveCSS('position', 'fixed')
})

test('reduced motion keeps content visible and removes decorative animation', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  await expect(page.locator('.photo-color-reveal img').first()).toHaveCSS('transition-duration', '0s')
  await expect(page.locator('.headline-line').first()).toHaveCSS('transform', 'none')
  await projectCard(page).click()
  await expect(dialog(page)).toHaveCSS('transform', 'none')
})

test('page and modal have no automated accessibility violations', async ({ page }) => {
  await page.goto('/')
  const pageResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(pageResults.violations).toEqual([])
  await projectCard(page).click()
  const modalResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(modalResults.violations).toEqual([])
})

test('configured media remains lazy and a failed source falls back gracefully', async ({ page }) => {
  let videoRequests = 0
  await page.route(/\/src\/data\/content\.ts(?:\?.*)?$/, async route => {
    const response = await route.fetch()
    const body = (await response.text()).replace('videoSource: null,', 'videoSource: "media/unavailable.mp4",')
    await route.fulfill({ response, body })
  })
  await page.route('**/media/unavailable.mp4', async route => { videoRequests++; await route.fulfill({ status: 404, body: '' }) })
  await page.goto('/')
  expect(videoRequests).toBe(0)
  await projectCard(page).click()
  await expect(page.getByText('THE PREVIEW IS CURRENTLY UNAVAILABLE')).toBeVisible()
  expect(videoRequests).toBeGreaterThan(0)
  await expect(dialog(page).locator('video')).toHaveCount(0)
  await page.keyboard.press('Escape')
})

test('configured video autoplays muted with controls, releases on close and works on reopen', async ({ page }) => {
  let requests = 0
  await page.route(/\/src\/data\/content\.ts(?:\?.*)?$/, async route => {
    const response = await route.fetch()
    await route.fulfill({ response, body: (await response.text()).replace('videoSource: null,', 'videoSource: "media/test-preview.webm",') })
  })
  await page.route('**/media/test-preview.webm', async route => {
    requests++
    await route.fulfill({ contentType: 'video/webm', body: readFileSync(new URL('./fixtures/preview.webm', import.meta.url)) })
  })
  await page.goto('/')
  expect(requests).toBe(0)
  for (let i = 0; i < 2; i++) {
    await projectCard(page).click()
    const player = dialog(page).locator('video')
    await expect(player).toBeVisible()
    await expect.poll(() => player.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(2)
    await expect.poll(() => player.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false)
    expect(await player.evaluate((element: HTMLVideoElement) => element.muted && element.controls && element.playsInline && element.loop)).toBe(true)
    const handle = await player.elementHandle()
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toHaveCount(0)
    expect(await handle!.evaluate(element => (element as HTMLVideoElement).paused && !element.hasAttribute('src'))).toBe(true)
    await handle?.dispose()
  }
  expect(requests).toBeGreaterThan(0)
})

test('blocked autoplay exposes a manual play control', async ({ page }) => {
  await page.addInitScript(() => {
    // Block native autoplay too, so it cannot bypass the simulated play() policy.
    const setAttribute = Element.prototype.setAttribute
    Element.prototype.setAttribute = function (name: string, value: string) {
      if (this instanceof HTMLMediaElement && name.toLowerCase() === 'autoplay') return
      setAttribute.call(this, name, value)
    }
    Object.defineProperty(HTMLMediaElement.prototype, 'autoplay', { configurable: true, get: () => false, set: () => {} })
    HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Autoplay is blocked', 'NotAllowedError'))
  })
  await page.route(/\/src\/data\/content\.ts(?:\?.*)?$/, async route => {
    const response = await route.fetch()
    await route.fulfill({ response, body: (await response.text()).replace('videoSource: null,', 'videoSource: "media/test-preview.webm",') })
  })
  await page.route('**/media/test-preview.webm', route => route.fulfill({ contentType: 'video/webm', body: readFileSync(new URL('./fixtures/preview.webm', import.meta.url)) }))
  await page.goto('/')
  await projectCard(page).click()
  await expect(page.getByRole('button', { name: 'Play gameplay preview' })).toBeVisible()
  await page.keyboard.press('Escape')
})

test('icon contacts use the supplied accounts, keyboard labels and safe external links', async ({ page }) => {
  await page.route(/\/src\/data\/content\.ts(?:\?.*)?$/, async route => {
    const response = await route.fetch()
    const body = `${await response.text()}\nprojects[0].playableUrl = 'https://example.com/play'; projects[0].sourceUrl = 'https://example.com/source';\n`
    await route.fulfill({ response, body })
  })
  await page.goto('/')
  const accounts = [
    ['GitHub', 'https://github.com/tnt-a11y'],
    ['Facebook', 'https://www.facebook.com/tahmid.nasif.tamal.2024'],
    ['Gmail', 'mailto:tahmidnasiftamal@gmail.com'],
    ['LinkedIn', 'https://www.linkedin.com/in/tahmid-nasif-tamal-34baa5446'],
    ['itch.io', 'https://trinitrointeractive.itch.io/'],
  ]
  await expect(page.locator('.contact-links')).toHaveText('')
  await page.getByRole('link', { name: 'GitHub', exact: true }).focus()
  for (const [name, url] of accounts) {
    const link = page.getByRole('link', { name, exact: true })
    await expect(link).toHaveAttribute('href', url)
    await expect(link).toBeFocused()
    await expect(link.locator('svg')).toHaveAttribute('aria-hidden', 'true')
    if (name !== 'Gmail') {
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
    await page.keyboard.press('Tab')
  }
  await projectCard(page).click()
  for (const name of ['PLAY PROJECT', 'View Source']) {
    const link = dialog(page).getByRole('link', { name })
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
  await page.keyboard.press('Escape')
})

test('adding another data record creates an independently working project card', async ({ page }) => {
  await page.route(/\/src\/data\/content\.ts(?:\?.*)?$/, async route => {
    const response = await route.fetch()
    const body = `${await response.text()}\nprojects.push({ ...projects[0], id: '999', slug: 'project-999', title: 'PROJECT 999' });\n`
    await route.fulfill({ response, body })
  })
  await page.goto('/')
  await expect(page.locator('.project-card')).toHaveCount(projects.length + 1)
  await page.getByRole('button', { name: 'View PROJECT 999 details' }).click()
  await expect(page.getByRole('dialog', { name: 'PROJECT 999' })).toBeVisible()
  await page.keyboard.press('Escape')
})
