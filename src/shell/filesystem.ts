import type { VirtualNode } from './types'

export function formatPath(path: string[]) {
  return path.length ? `/${path.join('/')}` : '/'
}

export function formatPrompt(path: string[]) {
  const suffix = path.length ? `~/${path.join('/')}` : '~'
  return `guest@portfolio:${suffix}$`
}

export function getNode(root: VirtualNode, path: string[]) {
  return path.reduce<VirtualNode | undefined>((node, segment) => {
    return node?.children?.[segment]
  }, root)
}

export function resolveChild(root: VirtualNode, path: string[], name: string) {
  return getNode(root, path)?.children?.[name]
}

export function listCurrent(root: VirtualNode, path: string[]) {
  const node = getNode(root, path)
  if (!node?.children) return []

  return Object.values(node.children).map((child) => ({
    name: child.name,
    type: child.type,
  }))
}

export function tree(root: VirtualNode, depth = 0): string[] {
  if (!root.children) return []

  return Object.values(root.children).flatMap((node) => {
    const prefix = `${'  '.repeat(depth)}${node.type === 'directory' ? '+ ' : '- '}`
    const line = `${prefix}${node.name}`
    return node.children ? [line, ...tree(node, depth + 1)] : [line]
  })
}
