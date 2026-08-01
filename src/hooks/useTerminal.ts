import { useEffect, useMemo, useRef, useState } from 'react'
import { runCommand, getAutocompleteOptions } from '../shell/commands'
import { formatPrompt } from '../shell/filesystem'
import { parseCommand } from '../shell/parser'
import type { TerminalEntry } from '../shell/types'

const intro = [
  'Portfolio CLI listo. Escribe `help` para ver comandos.',
  'Prueba: ls, cd about-me, cat bio.txt, cd ../projects, tree, neofetch.',
].join('\n')

export function useTerminal() {
  const [path, setPath] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      id: crypto.randomUUID(),
      prompt: 'system',
      command: 'boot',
      output: intro,
      kind: 'info',
    },
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const prompt = useMemo(() => formatPrompt(path), [path])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function execute(commandInput = input) {
    const parsed = parseCommand(commandInput)
    const visibleCommand = commandInput.trim()
    if (!visibleCommand) {
      setEntries((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          prompt,
          command: '',
          output: '',
          kind: 'info',
        },
      ])
      setHistoryIndex(null)
      return
    }

    const nextHistory = [...commandHistory, visibleCommand]
    const result = runCommand(parsed, path, nextHistory)

    if (result.openTarget) {
      window.open(result.openTarget, '_blank', 'noopener,noreferrer')
    }

    if (result.clear) {
      setEntries([])
    } else {
      setEntries((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          prompt,
          command: visibleCommand,
          output: result.output,
          kind: result.kind,
        },
      ])
    }

    if (result.nextPath) setPath(result.nextPath)
    setCommandHistory(nextHistory)
    setHistoryIndex(null)
    setInput('')
  }

  function autocomplete() {
    const parts = input.split(/\s+/)
    const current = parts.at(-1) ?? ''
    const options = getAutocompleteOptions(path)
    const match = options.find((option) => option.startsWith(current))

    if (!match || match === current) return

    parts[parts.length - 1] = match
    setInput(parts.join(' '))
  }

  function recall(direction: 'prev' | 'next') {
    if (!commandHistory.length) return

    if (direction === 'prev') {
      const nextIndex = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(commandHistory[nextIndex])
      return
    }

    if (historyIndex === null) return
    const nextIndex = historyIndex + 1
    if (nextIndex >= commandHistory.length) {
      setHistoryIndex(null)
      setInput('')
    } else {
      setHistoryIndex(nextIndex)
      setInput(commandHistory[nextIndex])
    }
  }

  return {
    entries,
    input,
    inputRef,
    prompt,
    setInput,
    execute,
    autocomplete,
    recall,
  }
}
