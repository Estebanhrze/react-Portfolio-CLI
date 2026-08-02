import { useEffect, useRef, useState } from 'react'
import { useTerminal } from '../../hooks/useTerminal'
import { AsciiDonut } from './AsciiDonut'

export function Terminal() {
  const { entries, input, inputRef, prompt, setInput, execute, autocomplete, recall } = useTerminal()
  const outputRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ columns: 100, rows: 32 })

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' })
  }, [entries])

  useEffect(() => {
    const output = outputRef.current
    if (!output) return

    const updateDimensions = () => {
      const styles = window.getComputedStyle(output)
      const fontSize = Number.parseFloat(styles.fontSize)
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const charWidth = context
        ? ((context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`), context.measureText('0').width)
        : fontSize * 0.6
      const horizontalPadding = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight)
      const verticalPadding = Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom)
      const lineHeight = Number.parseFloat(styles.lineHeight) || fontSize * 1.2
      const columns = Math.max(1, Math.floor((output.clientWidth - horizontalPadding) / charWidth))
      const rows = Math.max(1, Math.floor((output.clientHeight - verticalPadding) / lineHeight))

      setDimensions((current) => (current.columns === columns && current.rows === rows ? current : { columns, rows }))
    }

    const observer = new ResizeObserver(updateDimensions)
    observer.observe(output)
    updateDimensions()

    return () => observer.disconnect()
  }, [])
  return (
    <section className="terminal-window" onClick={() => inputRef.current?.focus()}>
      <header className="terminal-header">
        <div className="traffic-lights" aria-hidden="true">
          <span className="traffic-light red" />
          <span className="traffic-light yellow" />
          <span className="traffic-light green" />
        </div>
        <div className="terminal-title">portfolio-cli - zsh - {dimensions.columns}x{dimensions.rows}</div>
        <div className="terminal-status">online</div>
      </header>

      <div className="terminal-output" ref={outputRef}>
        {entries.map((entry) => (
          <article className="terminal-entry" key={entry.id}>
            {entry.prompt !== 'system' ? (
              <div className="terminal-command-row">
                <span className="terminal-prompt">{entry.prompt}</span>
                <span className="terminal-command">{entry.command}</span>
              </div>
            ) : null}
            {entry.output ? (
              <pre className={`terminal-result ${entry.kind ?? 'info'}`}>
                {entry.output.split('\n').map((line, index, lines) => {
                  const resource = entry.resources?.find((item) => line === `${item.name}  [${item.type}]`)

                  return (
                    <span key={`${entry.id}-${index}`}>
                      {resource ? (
                        <>
                          {resource.name}{'  '}
                          <a className="terminal-resource-link" href={resource.target} target="_blank" rel="noreferrer">
                            [{resource.type}]
                          </a>
                        </>
                      ) : (
                        line
                      )}
                      {index < lines.length - 1 ? '\n' : null}
                    </span>
                  )
                })}
              </pre>
            ) : null}
            {entry.animation === 'donut' ? <AsciiDonut /> : null}
          </article>
        ))}

        <form
          className="terminal-input-row"
          onSubmit={(event) => {
            event.preventDefault()
            execute()
          }}
        >
          <label className="terminal-prompt" htmlFor="terminal-input">
            {prompt}&nbsp;
          </label>
          <input
            ref={inputRef}
            id="terminal-input"
            value={input}
            style={{ width: `${input.length}ch` }}
            spellCheck={false}
            autoComplete="off"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp') {
                event.preventDefault()
                recall('prev')
              }
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                recall('next')
              }
              if (event.key === 'Tab') {
                event.preventDefault()
                autocomplete()
              }
            }}
          />
          <span className="terminal-caret" aria-hidden="true" />
        </form>
      </div>
    </section>
  )
}

