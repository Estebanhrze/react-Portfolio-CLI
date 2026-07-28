export function parseCommand(input: string) {
  const raw = input.trim()
  const [command = '', ...args] = raw.split(/\s+/).filter(Boolean)

  return {
    command: command.toLowerCase(),
    args,
    raw,
  }
}
