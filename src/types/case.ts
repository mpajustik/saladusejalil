export interface CaseCard {
  id: string
  name: string
  description: string
}

export interface CaseRules {
  solutionMode: 'random' | 'fixed'
  allowAccusationAnytime: boolean
  useMovement: boolean
  noteMode: 'simple' | 'advanced'
}

export interface MysteryCase {
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
