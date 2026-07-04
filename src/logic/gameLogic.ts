import type { AllGridNotes, Card, CellValue, Player, Solution } from '../types/game'
import type { MysteryCase } from '../types/case'

type Case = MysteryCase

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

export function createSolution(gameCase: Case): Solution {
  return {
    suspect: pickRandom(gameCase.suspects),
    location: pickRandom(gameCase.locations),
    item: pickRandom(gameCase.items),
  }
}

export function dealCards(gameCase: Case, solution: Solution, playerNames: string[]): Player[] {
  const allCards: Card[] = [
    ...gameCase.suspects,
    ...gameCase.locations,
    ...gameCase.items,
  ]

  const solutionIds = new Set([
    solution.suspect.id,
    solution.location.id,
    solution.item.id,
  ])

  const deck = shuffle(allCards.filter(card => !solutionIds.has(card.id)))

  return playerNames.map((name, index) => ({
    id: `player-${index + 1}`,
    name,
    hand: deck.filter((_, i) => i % playerNames.length === index),
  }))
}

export function createNotes(players: Player[], gameCase: MysteryCase): AllGridNotes {
  const allCards = [...gameCase.suspects, ...gameCase.locations, ...gameCase.items]
  const notes: AllGridNotes = {}

  for (const player of players) {
    const handIds = new Set(player.hand.map(c => c.id))
    notes[player.id] = {}

    for (const card of allCards) {
      const iHaveIt = handIds.has(card.id)
      const cells: Record<string, CellValue> = {}

      cells[player.id] = iHaveIt ? 'has' : 'no'

      // Kui mängijal on see kaart, siis teistel kindlasti pole
      if (iHaveIt) {
        for (const other of players) {
          if (other.id !== player.id) cells[other.id] = 'no'
        }
      }

      notes[player.id][card.id] = cells
    }
  }
  return notes
}

export function findRefuter(
  players: Player[],
  activePlayerIndex: number,
  suspectId: string,
  locationId: string,
  itemId: string,
): { playerIndex: number; matchingCards: Card[] } | null {
  const hypothesisIds = new Set([suspectId, locationId, itemId])
  const count = players.length

  for (let i = 1; i < count; i++) {
    const idx = (activePlayerIndex + i) % count
    const matching = players[idx].hand.filter(card => hypothesisIds.has(card.id))
    if (matching.length > 0) {
      return { playerIndex: idx, matchingCards: matching }
    }
  }

  return null
}
