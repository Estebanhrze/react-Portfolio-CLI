import { useEffect, useRef } from 'react'
import { useTerminal } from '../../hooks/useTerminal'

export function Terminal() {
  const { entries, input, inputRef, prompt, setInput, execute, autocomplete, recall } = useTerminal()
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' })
  }, [entries])

  return (
    <section className="terminal-window" onClick={() => inputRef.current?.focus()}>
      <header className="terminal-header">
        <div className="traffic-lights" aria-hidden="true">
          <span className="traffic-light red" />
          <span className="traffic-light yellow" />
          <span className="traffic-light green" />
        </div>
        <div className="terminal-title">portfolio-cli - zsh - 100x32</div>
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
            {entry.output ? <pre className={`terminal-result ${entry.kind ?? 'info'}`}>{entry.output}</pre> : null}
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
            {prompt}
          </label>
          <input
            ref={inputRef}
            id="terminal-input"
            value={input}
            style={{ width: `${Math.max(input.length, 1)}ch` }}
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



