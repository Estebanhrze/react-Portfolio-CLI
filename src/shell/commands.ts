import { fileSystem } from '../data/filesystem'
import { formatPath, listCurrent, resolveChild, tree } from './filesystem'
import type { CommandResult, ParsedCommand } from './types'

const commands = [
  'neofetch',
  'banner',
  'cat',
  'cd',
  'clear',
  'date',
  'echo',
  'help',
  'history',
  'ls',
  'open',
  'projects',
  'pwd',
  'repo',
  'resume',
  'skills',
  'social',
  'tree',
  'version',
  'whoami',
]

function ok(output: string, extra?: Partial<CommandResult>): CommandResult {
  return { output, kind: 'success', ...extra }
}

function info(output: string, extra?: Partial<CommandResult>): CommandResult {
  return { output, kind: 'info', ...extra }
}

function error(output: string): CommandResult {
  return { output, kind: 'error' }
}

function printableList(items: ReturnType<typeof listCurrent>) {
  if (!items.length) return '(empty)'

  return items
    .map((item) => {
      if (item.type === 'directory') return `${item.name}/`
      if (item.type === 'pdf') return `${item.name}  [pdf]`
      if (item.type === 'link') return `${item.name}  [link]`
      return item.name
    })
    .join('\n')
}

function clickableResources(path: string[], items: ReturnType<typeof listCurrent>) {
  return items.flatMap((item) => {
    if (item.type !== 'link' && item.type !== 'pdf') return []

    const node = resolveChild(fileSystem, path, item.name)
    const target = node?.target ?? node?.content
    return target ? [{ name: item.name, type: item.type, target }] : []
  })
}

export function runCommand(parsed: ParsedCommand, path: string[], history: string[]): CommandResult {
  const { command, args, raw } = parsed

  if (!raw) return info('')

  switch (command) {
    case 'ls': {
      const items = listCurrent(fileSystem, path)
      return ok(printableList(items), { resources: clickableResources(path, items) })
    }

    case 'cd': {
      const target = args[0]
      if (!target || target === '/') return ok(formatPath([]), { nextPath: [] })
      if (target === '..') return ok(formatPath(path.slice(0, -1)), { nextPath: path.slice(0, -1) })

      const child = resolveChild(fileSystem, path, target)
      if (!child) return error(`Folder not found: ${target}`)
      if (child.type === 'file') return ok(child.content ?? '')
      if (child.type !== 'directory') return error(`Not a folder: ${target}`)

      const nextPath = [...path, target]
      return ok(formatPath(nextPath), { nextPath })
    }

    case 'pwd':
      return ok(formatPath(path))

    case 'cat': {
      const target = args[0]
      if (!target) return error('Usage: cat <file>')
      const node = resolveChild(fileSystem, path, target)
      if (!node) return error(`File not found: ${target}`)
      if (node.type === 'directory') return error(`Cannot cat a folder: ${target}`)
      return ok(node.content ?? node.target ?? '')
    }

    case 'open': {
      const target = args[0]
      if (!target) return error('Usage: open <file|link>')
      const node = resolveChild(fileSystem, path, target)
      if (!node) return error(`Resource not found: ${target}`)
      if (node.type === 'directory') return error(`Cannot open a folder directly: ${target}`)
      return ok(`Opening ${target}...`, { openTarget: node.target ?? node.content })
    }

    case 'clear':
      return { output: '', clear: true, kind: 'info' }

    case 'history':
      return info(history.length ? history.map((item, index) => `${index + 1}  ${item}`).join('\n') : 'No commands yet')

    case 'help':
      return info(commands.join('\n'))

    case 'tree':
      return info(['/'].concat(tree(fileSystem)).join('\n'))

    case 'date':
      return info(new Date().toLocaleString())

    case 'echo':
      return info(args.join(' '))

    case 'whoami':
      return info('esteban - explorando el portfolio CLI de Esteban')

    case 'banner':
      return info([
        '██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗',
        '██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗',
        '██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║',
        '██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║',
        '██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝',
        '╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝',
        '',
        '███████╗  ███████╗  ████████╗  ███████╗  ██████╗    █████╗   ███╗   ██╗',
        '██╔════╝  ██╔════╝  ╚══██╔══╝  ██╔════╝  ██╔══██╗  ██╔══██╗  ████╗  ██║',
        '█████╗    ███████╗     ██║     █████╗    ██████╔╝  ███████║  ██╔██╗ ██║',
        '██╔══╝    ╚════██║     ██║     ██╔══╝    ██╔══██╗  ██╔══██║  ██║╚██╗██║',
        '███████╗  ███████║     ██║     ███████╗  ██████╔╝  ██║  ██║  ██║ ╚████║',
        '╚══════╝  ╚══════╝     ╚═╝     ╚══════╝  ╚═════╝   ╚═╝  ╚═╝  ╚═╝  ╚═══╝',
      ].join('\n'))
    case 'version':
      return info('portfolio-cli v0.1.0')

    case 'social':
      return info('github: https://github.com/\nlinkedin: https://www.linkedin.com/')

    case 'repo':
      return ok('Opening repository...', { openTarget: 'https://github.com/Estebanhrze' })

    case 'resume':
      return ok('Opening CV...', { openTarget: '/pdfs/cv.pdf' })

    case 'skills': {
      const node = fileSystem.children?.['about-me']?.children?.['skills.txt']
      return info(node?.content ?? '')
    }

    case 'projects':
      return info(printableList(listCurrent(fileSystem, ['projects'])))

    case 'neofetch':
      return info('', { animation: 'donut' })

    default:
      return error(`Command not found: ${command}. Try help`)
  }
}

export function getAutocompleteOptions(path: string[]) {
  return [...commands, ...listCurrent(fileSystem, path).map((item) => item.name)]
}
