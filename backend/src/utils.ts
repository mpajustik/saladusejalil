const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // ilma segadusttekitavate I ja O tähtedeta

export function generateRoomCode(): string {
  return Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}
