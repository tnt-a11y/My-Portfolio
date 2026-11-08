import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { createSeed, evolveBoard, GRID_SIZE } from '../lib/life'
import type { Board } from '../lib/life'

interface Simulation {
  board: Board
  trails: Uint8Array
  generation: number
  seed: number
  width: number
  dpr: number
}

export function CellularAutomaton() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const generationRef = useRef<HTMLSpanElement>(null)
  const feedbackRef = useRef<HTMLParagraphElement>(null)
  const simulation = useRef<Simulation | null>(null)
  const cursor = useRef<{ x: number; y: number } | null>(null)
  const drawing = useRef(false)
  const paintFrame = useRef(0)
  const [running, setRunning] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const model = simulation.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context || !model) return
    const { width, dpr, board, trails } = model
    const cell = width / GRID_SIZE
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.fillStyle = '#0d0d0d'
    context.fillRect(0, 0, width, width)

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const index = y * GRID_SIZE + x
        if (!board[index] && !trails[index]) continue
        const opacity = board[index] ? .72 + .25 * (Math.sin(x * .16 + y * .12) + 1) / 2 : trails[index] * .035
        context.fillStyle = `rgba(235,235,235,${opacity})`
        context.fillRect(x * cell + 1.25, y * cell + 1.25, cell - 2.5, cell - 2.5)
      }
    }

    context.beginPath()
    context.lineWidth = 1 / dpr
    context.strokeStyle = '#ffffff12'
    for (let i = 0; i <= GRID_SIZE; i++) {
      const coordinate = Math.round(i * cell * dpr) / dpr + .5 / dpr
      context.moveTo(coordinate, 0)
      context.lineTo(coordinate, width)
      context.moveTo(0, coordinate)
      context.lineTo(width, coordinate)
    }
    context.stroke()

    if (cursor.current) {
      context.strokeStyle = '#fff'
      context.lineWidth = 1.5
      context.strokeRect(cursor.current.x * cell + 1, cursor.current.y * cell + 1, cell - 2, cell - 2)
    }
    if (generationRef.current) generationRef.current.textContent = String(model.generation).padStart(5, '0')
  }, [])

  const step = useCallback(() => {
    const model = simulation.current
    if (!model) return
    const next = evolveBoard(model.board)
    for (let i = 0; i < next.length; i++) {
      model.trails[i] = model.board[i] ? 7 : Math.max(0, model.trails[i] - 1)
    }
    model.board = next
    model.generation++
    draw()
  }, [draw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!simulation.current) simulation.current = { board: createSeed(), trails: new Uint8Array(GRID_SIZE ** 2), generation: 0, seed: 241, width: 400, dpr: 1 }
    const resize = () => {
      const model = simulation.current!
      model.width = canvas.getBoundingClientRect().width
      model.dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(model.width * model.dpr))
      canvas.height = canvas.width
      draw()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = () => { if (motion.matches) setRunning(false) }
    motion.addEventListener('change', onMotionChange)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', onMotionChange)
      cancelAnimationFrame(paintFrame.current)
    }
  }, [draw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let visible = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      clearTimeout(timer)
      if (running && visible && !document.hidden) timer = setTimeout(() => { step(); schedule() }, 150)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      schedule()
    }, { threshold: .05 })
    observer.observe(canvas)
    document.addEventListener('visibilitychange', schedule)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [running, step])

  const reseed = () => {
    const model = simulation.current
    if (!model) return
    model.board = createSeed(++model.seed)
    model.trails.fill(0)
    model.generation = 0
    draw()
  }

  const paint = (event: PointerEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event
    cancelAnimationFrame(paintFrame.current)
    paintFrame.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current
      const model = simulation.current
      if (!canvas || !model) return
      const box = canvas.getBoundingClientRect()
      const x = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor((clientX - box.left) / box.width * GRID_SIZE)))
      const y = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor((clientY - box.top) / box.height * GRID_SIZE)))
      model.board[y * GRID_SIZE + x] = 1
      draw()
    })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const model = simulation.current
    if (!model || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter'].includes(event.key)) return
    event.preventDefault()
    const point = { ...(cursor.current || { x: 20, y: 20 }) }
    if (event.key === 'ArrowLeft') point.x = (point.x + GRID_SIZE - 1) % GRID_SIZE
    if (event.key === 'ArrowRight') point.x = (point.x + 1) % GRID_SIZE
    if (event.key === 'ArrowUp') point.y = (point.y + GRID_SIZE - 1) % GRID_SIZE
    if (event.key === 'ArrowDown') point.y = (point.y + 1) % GRID_SIZE
    const index = point.y * GRID_SIZE + point.x
    if (event.key === ' ' || event.key === 'Enter') model.board[index] = Number(!model.board[index])
    cursor.current = point
    if (feedbackRef.current) feedbackRef.current.textContent = `Row ${point.y + 1}, column ${point.x + 1}, ${model.board[index] ? 'alive' : 'empty'}.`
    draw()
  }

  return <div className="cellular-art" aria-label="Cellular automata experiment">
    <div className="life-overline mono">CONWAY’S GAME OF LIFE</div>
    <div className="life-frame">
      <canvas ref={canvasRef} className="life-canvas" width="400" height="400" role="application" tabIndex={0} aria-label="Interactive Game of Life grid" aria-describedby="life-instructions" onKeyDown={onKeyDown} onFocus={() => { cursor.current = { x: 20, y: 20 }; draw() }} onBlur={() => { cursor.current = null; draw() }} onPointerDown={event => { if (event.button !== 0) return; drawing.current = true; event.currentTarget.setPointerCapture(event.pointerId); paint(event) }} onPointerMove={event => { if (drawing.current) paint(event) }} onPointerUp={() => { drawing.current = false }} onPointerCancel={() => { drawing.current = false }}>
        Conway’s Game of Life on a 40 by 40 square grid. Use the controls below to advance or restart the simulation.
      </canvas>
      <span className="life-corner life-corner--tl" aria-hidden="true" /><span className="life-corner life-corner--tr" aria-hidden="true" /><span className="life-corner life-corner--bl" aria-hidden="true" /><span className="life-corner life-corner--br" aria-hidden="true" />
    </div>
    <div className="life-console">
      <div className="life-readout mono"><span>GEN <span ref={generationRef} data-testid="life-generation">00000</span></span><span className="life-grid-size">40 × 40</span></div>
      <div className="life-controls"><button className="life-control" onClick={() => setRunning(value => !value)} aria-label={running ? 'Pause simulation' : 'Play simulation'} title={running ? 'Pause simulation' : 'Play simulation'}>{running ? <Pause size={13} /> : <Play size={13} />}</button><button className="life-control" onClick={step} disabled={running} aria-label="Next generation" title="Next generation"><SkipForward size={14} /></button><button className="life-control" onClick={reseed} aria-label="Reseed simulation" title="Reseed simulation"><RotateCcw size={13} /></button></div>
    </div>
    <div className="life-caption mono">CLICK OR DRAG TO DRAW</div>
    <p id="life-instructions" className="sr-only">Click or drag to add live cells. With the grid focused, use arrow keys to choose a cell and Space or Enter to toggle it. Pause, advance one generation, or reseed using the buttons. Animation pauses when offscreen and starts paused with reduced motion.</p>
    <p ref={feedbackRef} className="sr-only" aria-live="polite" aria-atomic="true" />
  </div>
}
