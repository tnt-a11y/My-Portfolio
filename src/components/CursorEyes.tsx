import { useEffect, useRef, useState } from 'react'

export function CursorEyes() {
  const button = useRef<HTMLButtonElement>(null)
  const sound = useRef<HTMLAudioElement | null>(null)
  const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [blinking, setBlinking] = useState(false)

  useEffect(() => {
    const eyes = Array.from(button.current!.querySelectorAll<HTMLElement>('.cursor-eye'))
    const pupils = eyes.map(eye => eye.querySelector<HTMLElement>('.cursor-pupil')!)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let x = 0, y = 0
    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      pupils.forEach(pupil => { pupil.style.transform = 'translate(0px, 0px)' })
    }
    const move = (event: PointerEvent) => {
      if (motion.matches || event.pointerType !== 'mouse' || document.hidden) return
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        // Read both bounds before writing transforms; no React renders on movement.
        const offsets = eyes.map(eye => {
          const bounds = eye.getBoundingClientRect()
          const dx = x - (bounds.left + bounds.width / 2)
          const dy = y - (bounds.top + bounds.height / 2)
          const distance = Math.hypot(dx, dy)
          const scale = distance ? Math.min(5, distance / 12) / distance : 0
          return [dx * scale, dy * scale]
        })
        pupils.forEach((pupil, index) => { pupil.style.transform = `translate(${offsets[index][0]}px, ${offsets[index][1]}px)` })
      })
    }
    const visibility = () => { if (document.hidden) reset() }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', reset)
    document.documentElement.addEventListener('pointerleave', reset)
    document.addEventListener('visibilitychange', visibility)
    motion.addEventListener('change', reset)
    return () => {
      reset()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('blur', reset)
      document.documentElement.removeEventListener('pointerleave', reset)
      document.removeEventListener('visibilitychange', visibility)
      motion.removeEventListener('change', reset)
      if (blinkTimer.current) clearTimeout(blinkTimer.current)
      sound.current?.pause()
    }
  }, [])

  function blink() {
    if (blinkTimer.current) return
    setBlinking(true)
    blinkTimer.current = setTimeout(() => {
      setBlinking(false)
      blinkTimer.current = null
    }, 260)
    sound.current ??= new Audio(`${import.meta.env.BASE_URL}media/ouch.wav`)
    sound.current.volume = .55
    sound.current.currentTime = 0
    void sound.current.play().catch(() => { /* Browsers may silence audio by preference. */ })
  }

  return <button ref={button} className={`brand cursor-eyes${blinking ? ' is-blinking' : ''}`} type="button" onClick={blink} aria-label="Blink eyes and play Ouch" title="Click to blink">
    {[0, 1].map(eye => <span key={eye} className="cursor-eye" aria-hidden="true"><span className="cursor-pupil"><span /></span></span>)}
  </button>
}
