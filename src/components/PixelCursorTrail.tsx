import { useEffect, useRef } from 'react'

const PIXELS = Array.from({ length: 18 }, (_, index) => index)

/** A fixed particle pool; only transforms/opacity animate, and idle work stops. */
export function PixelCursorTrail({ disabled = false }: { disabled?: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = root.current
    if (!container || disabled) return
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const pixels = Array.from(container.children) as HTMLElement[]
    const animations: (Animation | undefined)[] = new Array(pixels.length)
    let frame = 0, index = 0
    let lastX = -1, lastY = -1
    let nextX = 0, nextY = 0

    const clear = () => {
      cancelAnimationFrame(frame)
      frame = 0
      lastX = lastY = -1
      animations.forEach(animation => animation?.cancel())
    }
    const emit = (x: number, y: number) => {
      const slot = index++ % pixels.length
      const pixel = pixels[slot]
      const size = slot % 3 === 0 ? 5 : 3
      x = Math.round(x / 5) * 5
      y = Math.round(y / 5) * 5
      animations[slot]?.cancel()
      pixel.style.width = pixel.style.height = `${size}px`
      animations[slot] = pixel.animate([
        { transform: `translate3d(${x}px,${y}px,0)`, opacity: .38 },
        { transform: `translate3d(${x}px,${y + 10}px,0)`, opacity: 0 },
      ], { duration: 380, easing: 'cubic-bezier(.2,.6,.3,1)', fill: 'forwards' })
    }
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== 'mouse' || document.hidden) return
      nextX = event.clientX
      nextY = event.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const distance = lastX < 0 ? 24 : Math.hypot(nextX - lastX, nextY - lastY)
        if (distance < 18) return
        const count = Math.min(3, Math.max(1, Math.floor(distance / 22)))
        const startX = lastX < 0 ? nextX : lastX
        const startY = lastY < 0 ? nextY : lastY
        for (let i = 1; i <= count; i++) {
          emit(startX + (nextX - startX) * i / count, startY + (nextY - startY) * i / count)
        }
        lastX = nextX
        lastY = nextY
      })
    }
    const onVisibility = () => { if (document.hidden) clear() }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', clear)
    window.addEventListener('blur', clear)
    document.addEventListener('visibilitychange', onVisibility)
    media.addEventListener('change', clear)
    return () => {
      clear()
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', clear)
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', onVisibility)
      media.removeEventListener('change', clear)
    }
  }, [disabled])

  return <div ref={root} className="pixel-cursor-trail" aria-hidden="true" hidden={disabled}>
    {PIXELS.map(index => <span key={index} className="cursor-pixel" />)}
  </div>
}
