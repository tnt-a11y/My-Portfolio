import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { AboutSection } from './components/AboutSection'
import { ProjectSection } from './components/ProjectSection'
import { ContactSection } from './components/ContactSection'
import { ServicesSection } from './components/ServicesSection'
import { PixelCursorTrail } from './components/PixelCursorTrail'
import { safeExternalUrl, sections, site } from './data/content'
import type { Project, SectionId } from './data/content'

gsap.registerPlugin(ScrollTrigger)
const ProjectModal = lazy(() => import('./components/ProjectModal'))

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<SectionId>(sections[0])
  const [selected, setSelected] = useState<Project | null>(null)

  useEffect(() => {
    const canonical = safeExternalUrl(site.canonicalUrl)
    if (!canonical) return
    // Production metadata is in the HTML so crawlers do not need JavaScript.
    if (document.querySelector('link[rel="canonical"]')) return
    const link = document.createElement('link')
    link.rel = 'canonical'
    link.href = canonical
    document.head.append(link)
    const ogUrl = document.createElement('meta')
    ogUrl.setAttribute('property', 'og:url')
    ogUrl.content = canonical
    document.head.append(ogUrl)
    const ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
    const priorImage = ogImage?.content
    if (ogImage) ogImage.content = new URL(`${import.meta.env.BASE_URL}og-image.png`, canonical).href
    return () => { link.remove(); ogUrl.remove(); if (ogImage && priorImage) ogImage.content = priorImage }
  }, [])

  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
        timeline.from('.brand', { y: -8, opacity: 0, duration: .5 })
          .from('.headline-line', { yPercent: 108, rotate: 2, duration: .95, stagger: .105 }, .06)
          .from('.hero-overline, .hero-actions', { y: 12, opacity: 0, duration: .65, stagger: .08 }, .3)
          .from('.cellular-art', { opacity: 0, scale: .97, duration: .9 }, .15)
          .from('.main-nav', { y: -8, opacity: 0, duration: .65 }, .32)
          .from('.hero-note, .hero-intro', { y: 14, opacity: 0, duration: .65, stagger: .06 }, .48)
        gsap.utils.toArray<HTMLElement>('.reveal').forEach(element => {
          gsap.from(element, { y: 30, opacity: 0, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } })
        })
      })
      let frame = 0
      const updateScroll = () => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight
          if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
          const threshold = window.scrollY + window.innerHeight * .4
          const current = max > 0 && window.scrollY >= max - 2
            ? sections.at(-1)
            : [...sections].reverse().find(id => (document.getElementById(id)?.offsetTop ?? Infinity) <= threshold)
          if (current) setActive(current)
        })
      }
      window.addEventListener('scroll', updateScroll, { passive: true })
      window.addEventListener('resize', updateScroll, { passive: true })
      updateScroll()
      return () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('scroll', updateScroll)
        window.removeEventListener('resize', updateScroll)
      }
    }, root)
    return () => { media.revert(); context.revert() }
  }, [])

  return <div ref={root} className="site-root">
    <a className="skip-link" href="#main">Skip to content</a>
    <div ref={progress} className="scroll-progress" aria-hidden="true" />
    <Navbar active={active} />
    <PixelCursorTrail disabled={!!selected} />
    <main id="main"><Hero /><ProjectSection onOpen={setSelected} /><AboutSection /><ServicesSection /><ContactSection /></main>
    {selected && <Suspense fallback={<div className="modal-loading" role="status">Opening project…</div>}><ProjectModal project={selected} onClose={() => setSelected(null)} /></Suspense>}
  </div>
}
