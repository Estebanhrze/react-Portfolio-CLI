import { useEffect, useRef, useState } from 'react'

type CursorState = {
  x: number
  y: number
  active: boolean
}

export function NinjaCursor() {
  const [state, setState] = useState<CursorState>({ x: 0, y: 0, active: false })
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let frame = 0

    function onPointerMove(event: PointerEvent) {
      target.current = { x: event.clientX, y: event.clientY }
      const element = event.target instanceof Element ? event.target : null
      const active = Boolean(element?.closest('button, a, input, .terminal-window, .terminal-command, .terminal-result'))
      setState((value) => ({ ...value, active }))
    }

    function tick() {
      current.current.x += (target.current.x - current.current.x) * 0.18
      current.current.y += (target.current.y - current.current.y) * 0.18
      setState((value) => ({ ...value, x: current.current.x, y: current.current.y }))
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove)
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      className={`ninja-cursor ${state.active ? 'active' : ''}`}
      style={{ transform: `translate3d(${state.x}px, ${state.y}px, 0)` }}
      aria-hidden="true"
    >
      <span />
    </div>
  )
}
