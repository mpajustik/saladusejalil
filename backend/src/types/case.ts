export interface CaseCard {
  id: string
  name: string
  description: string
}

export interface CaseSuspect extends CaseCard {
  motive?: string
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
  intro?: string
  resolution?: string
  difficulty: 'easy' | 'medium' | 'hard'
  minPlayers: number
  maxPlayers: number
  suspects: CaseSuspect[]
  locations: CaseCard[]
  items: CaseCard[]
  rules: CaseRules
}
