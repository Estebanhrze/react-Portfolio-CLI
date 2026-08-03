import { useEffect, useMemo, useState } from 'react'

const width = 80
const height = 22
const luminance = '.,-~:;=!*#$@'

type RotationState = {
  a: number
  e: number
  c: number
  d: number
}

const systemInfo = [
  'esteban@portfolio',
  '-----------------',
  'backend: Java, Spring Boot, Python, FastAPI',
  'frontend: React, Astro, TypeScript, Javascript',
  'devops: Docker, Kubernetes',
  'database: PostgreSQL',
  'idioms: English + Spanish', 
  'shell: virtual CLI',
  'theme: glass terminal',
  '',
  'Run `help` to see commands.',
].join('\n')

function rotate(x: number, y: number, step: number) {
  const rotatedX = x - step * y
  const rotatedY = y + step * x
  const normalization = (3 - rotatedX * rotatedX - rotatedY * rotatedY) / 2

  return { x: rotatedX * normalization, y: rotatedY * normalization }
}

function renderDonut({ a, e, c, d }: RotationState) {
  const pixels = Array<string>(width * height).fill(' ')
  const depth = Array<number>(width * height).fill(0)
  let g = 0
  let h = 1

  for (let j = 0; j < 90; j += 1) {
    let G = 0
    let H = 1

    for (let i = 0; i < 314; i += 1) {
      const circle = h + 2
      const inverseDepth = 1 / (G * circle * a + g * e + 5)
      const tilt = G * circle * e - g * a
      const x = Math.floor(40 + 30 * inverseDepth * (H * circle * d - tilt * c))
      const y = Math.floor(12 + 15 * inverseDepth * (H * circle * c + tilt * d))
      const index = x + width * y
      const light = Math.floor(8 * ((g * a - G * h * e) * d - G * h * a - g * e - H * h * c))

      if (y > 0 && y < height && x > 0 && x < width && inverseDepth > depth[index]) {
        depth[index] = inverseDepth
        pixels[index] = luminance[Math.min(luminance.length - 1, Math.max(0, light))]
      }

      const innerRotation = rotate(H, G, 0.02)
      H = innerRotation.x
      G = innerRotation.y
    }

    const outerRotation = rotate(h, g, 0.07)
    h = outerRotation.x
    g = outerRotation.y
  }

  return Array.from({ length: height }, (_, row) => pixels.slice(row * width, (row + 1) * width).join('')).join('\n')
}

export function AsciiDonut() {
  const [rotation, setRotation] = useState<RotationState>({ a: 0, e: 1, c: 1, d: 0 })

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRotation((current) => {
        const firstAxis = rotate(current.e, current.a, 0.04)
        const secondAxis = rotate(current.d, current.c, 0.02)

        return { a: firstAxis.y, e: firstAxis.x, c: secondAxis.y, d: secondAxis.x }
      })
    }, 85)

    return () => window.clearInterval(timer)
  }, [])

  const frame = useMemo(() => renderDonut(rotation), [rotation])

  return (
    <div className="neofetch-output">
      <pre className="neofetch-donut" aria-label="Animated ASCII donut">{frame}</pre>
      <pre className="neofetch-info">{systemInfo}</pre>
    </div>
  )
}
