import type { CaseCard, CaseRules } from './case'

// Kõik väljad alguses valikulised — täidetakse sammhaaval
export interface DraftCase {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  minPlayers: number
  maxPlayers: number
  suspects: CaseCard[]
  locations: CaseCard[]
  items: CaseCard[]
  rules: CaseRules
}

export const EMPTY_DRAFT: DraftCase = {
  id: '',
  title: '',
  description: '',
  difficulty: 'easy',
  minPlayers: 3,
  maxPlayers: 6,
  suspects: [],
  locations: [],
  items: [],
  rules: {
    solutionMode: 'random',
    allowAccusationAnytime: true,
    useMovement: false,
    noteMode: 'simple',
  },
}
