import { useEffect, useRef } from 'react'

/** Pointer work stays outside React and is coalesced to one update per frame. */
export function usePointerSurface<T extends HTMLElement>(tilt = false) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    const reset = () => {
      cancelAnimationFrame(frame)
      element.style.setProperty('--rx', '0deg')
      element.style.setProperty('--ry', '0deg')
      element.style.setProperty('--mx', '0px')
      element.style.setProperty('--my', '0px')
    }
    const move = (event: PointerEvent) => {
      if (!media.matches) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        element.style.setProperty('--spot-x', `${x}px`)
        element.style.setProperty('--spot-y', `${y}px`)
        if (tilt) {
          element.style.setProperty('--rx', `${-(y / rect.height - .5) * 2}deg`)
          element.style.setProperty('--ry', `${(x / rect.width - .5) * 2}deg`)
        } else {
          element.style.setProperty('--mx', `${(x / rect.width - .5) * 5}px`)
          element.style.setProperty('--my', `${(y / rect.height - .5) * 5}px`)
        }
      })
    }
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', reset)
    media.addEventListener('change', reset)
    return () => {
      reset()
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', reset)
      media.removeEventListener('change', reset)
    }
  }, [tilt])
  return ref
}
