import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Code2, Play, X } from 'lucide-react'
import gsap from 'gsap'
import { mediaUrl, safeExternalUrl } from '../data/content'
import type { Project } from '../data/content'
import { ProjectArtwork } from './Artwork'
import './modal.css'

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const closing = useRef(false)
  const animation = useRef<gsap.core.Tween | null>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [needsPlay, setNeedsPlay] = useState(false)
  const source = mediaUrl(project.videoSource)
  const playable = safeExternalUrl(project.playableUrl)
  const sourceCode = safeExternalUrl(project.sourceUrl)
  const poster = mediaUrl(project.poster)

  const requestClose = useCallback(() => {
    if (closing.current) return
    closing.current = true
    video.current?.pause()
    animation.current?.kill()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { onClose(); return }
    dialog.current?.classList.add('is-closing')
    animation.current = gsap.to(dialog.current, { opacity: 0, y: 12, scale: .985, duration: .18, ease: 'power2.in', onComplete: onClose })
  }, [onClose])

  useLayoutEffect(() => {
    const element = dialog.current!
    const originalFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const scrollY = window.scrollY
    const body = document.body
    const saved = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    if (scrollbar) body.style.paddingRight = `${scrollbar}px`
    closing.current = false
    element.showModal()
    closeButton.current?.focus({ preventScroll: true })
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      animation.current = gsap.fromTo(element, { opacity: 0, y: 18, scale: .975 }, { opacity: 1, y: 0, scale: 1, duration: .35, ease: 'power3.out', clearProps: 'transform' })
    })
    const player = video.current
    let live = true
    if (player && source) {
      // StrictMode replays effects on the same DOM node after cleanup releases src.
      player.src = source
      player.muted = true
      player.play().catch(() => { if (live) setNeedsPlay(true) })
    }
    return () => {
      live = false
      animation.current?.kill()
      media.revert()
      if (player) { player.pause(); player.removeAttribute('src'); player.load() }
      element.close()
      Object.assign(body.style, saved)
      const behavior = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, scrollY)
      document.documentElement.style.scrollBehavior = behavior
      originalFocus?.focus({ preventScroll: true })
    }
  }, [source])

  function trapFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const focusable = Array.from(dialog.current!.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], video[controls], [tabindex="0"]')).filter(element => element.getClientRects().length)
    const first = focusable[0], last = focusable.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }

  async function playVideo() {
    try { await video.current?.play(); setNeedsPlay(false) } catch { setNeedsPlay(true) }
  }

  return createPortal(<dialog ref={dialog} className="project-modal" aria-labelledby="modal-title" aria-describedby="modal-description" onCancel={event => { event.preventDefault(); requestClose() }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) requestClose() } }} onKeyDown={trapFocus}>
    <div className="modal-shell">
      <button ref={closeButton} className="modal-close icon-button" onClick={requestClose} aria-label="Close project details"><X size={20} strokeWidth={1.5} /></button>
      <div className="modal-media-column"><div className="modal-media">
        {source && !videoFailed ? <><video ref={video} src={source} poster={poster} controls autoPlay muted playsInline loop preload="metadata" onError={() => setVideoFailed(true)} onPlay={() => setNeedsPlay(false)} aria-label={`${project.title} gameplay video`} />{needsPlay && <button className="manual-play button" onClick={playVideo}><Play size={18} />Play gameplay preview</button>}</> : !source && poster ? <div className="modal-still"><img src={poster} alt={`${project.title} game screenshot`} width="1600" height="900" /></div> : <div className="video-placeholder"><ProjectArtwork compact /><div className="video-placeholder-copy"><span className="placeholder-play"><Play size={25} strokeWidth={1} /></span><p>Gameplay preview coming soon</p>{videoFailed && <span className="mono">THE PREVIEW IS CURRENTLY UNAVAILABLE</span>}</div></div>}
      </div></div>
      <div className="modal-details"><div className="modal-eyebrow mono">{project.category}</div><h2 id="modal-title">{project.title}</h2>{project.status && <span className="modal-status">{project.status}</span>}<p id="modal-description" className="modal-description">{project.description}</p>{project.features.length > 0 && <div className="modal-features"><h3 className="mono">FEATURES</h3><ul>{project.features.map(feature => <li key={feature}><span>↗</span>{feature}</li>)}</ul></div>}
      <dl className="project-facts"><div><dt>TECHNOLOGIES</dt><dd>{project.technologies.length ? project.technologies.join(' / ') : 'To be announced'}</dd></div><div><dt>PLATFORM</dt><dd>{project.platform || 'To be announced'}</dd></div></dl>
      <div className="modal-cta">{playable ? <a href={playable} target="_blank" rel="noopener noreferrer" className="button button--primary">PLAY PROJECT<ArrowUpRight size={18} /></a> : <button className="button disabled-build" disabled>Playable build coming soon<Play size={15} /></button>}{sourceCode && <a href={sourceCode} target="_blank" rel="noopener noreferrer" className="text-link source-link"><Code2 size={16} />View Source<ArrowUpRight size={14} /></a>}</div></div>
    </div>
  </dialog>, document.body)
}
