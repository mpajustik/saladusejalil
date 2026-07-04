import type { BackendPlayer, Card, CardCategory } from '../types.js'
import type { CaseCard, MysteryCase } from '../types/case.js'

type CaseData = MysteryCase

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// CaseCard → Card: lisab kategooria
function toCard(c: CaseCard, category: CardCategory): Card {
  return { id: c.id, name: c.name, category }
}

export interface Solution {
  suspect: Card
  location: Card
  item: Card
}

export function createSolution(caseData: CaseData): Solution {
  return {
    suspect:  toCard(pickRandom(caseData.suspects),  'suspect'),
    location: toCard(pickRandom(caseData.locations), 'location'),
    item:     toCard(pickRandom(caseData.items),     'item'),
  }
}

export function dealCards(caseData: CaseData, solution: Solution, players: BackendPlayer[]): void {
  const solutionIds = new Set([solution.suspect.id, solution.location.id, solution.item.id])

  const allCards: Card[] = [
    ...caseData.suspects.map(c => toCard(c, 'suspect')),
    ...caseData.locations.map(c => toCard(c, 'location')),
    ...caseData.items.map(c => toCard(c, 'item')),
  ]

  const deck = shuffle(allCards.filter(c => !solutionIds.has(c.id)))

  players.forEach((player, idx) => {
    player.hand = deck.filter((_, i) => i % players.length === idx)
  })
}

export function findRefuter(
  players: BackendPlayer[],
  activeIndex: number,
  suspectId: string,
  locationId: string,
  itemId: string,
): { playerIndex: number; matchingCards: Card[] } | null {
  const ids = new Set([suspectId, locationId, itemId])
  for (let i = 1; i < players.length; i++) {
    const idx = (activeIndex + i) % players.length
    const matching = players[idx].hand.filter(c => ids.has(c.id))
    if (matching.length > 0) return { playerIndex: idx, matchingCards: matching }
  }
  return null
}
