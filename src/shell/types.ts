export type NodeKind = 'directory' | 'file' | 'pdf' | 'link'

export type VirtualNode = {
  type: NodeKind
  name: string
  content?: string
  target?: string
  children?: Record<string, VirtualNode>
}

export type ParsedCommand = {
  command: string
  args: string[]
  raw: string
}

export type CommandResult = {
  output: string
  animation?: 'donut'
  nextPath?: string[]
  clear?: boolean
  openTarget?: string
  kind?: 'info' | 'error' | 'success'
}

export type TerminalEntry = {
  id: string
  prompt: string
  command: string
  output?: string
  animation?: CommandResult['animation']
  kind?: CommandResult['kind']
}
