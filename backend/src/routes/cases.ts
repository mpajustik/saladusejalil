import { Router } from 'express'
import { caseRegistry } from '../data/caseRegistry.js'
import { validateCase } from '../logic/validateCase.js'

export const casesRouter = Router()

// GET /api/cases — nimekiri kõigist saadaolevatest juhtumitest
casesRouter.get('/', (_req, res) => {
  const list = caseRegistry.map(c => ({
    id:          c.id,
    title:       c.title,
    description: c.description,
    difficulty:  c.difficulty,
    minPlayers:  c.minPlayers,
    maxPlayers:  c.maxPlayers,
    cardCount: {
      suspects:  c.suspects.length,
      locations: c.locations.length,
      items:     c.items.length,
    },
  }))
  res.json({ ok: true, cases: list })
})

// POST /api/cases/validate — kontrolli juhtumi JSON-i kehtivust
casesRouter.post('/validate', (req, res) => {
  const result = validateCase(req.body)
  if (result.valid) {
    res.json({ ok: true, valid: true, errors: [] })
  } else {
    res.status(400).json({ ok: false, valid: false, errors: result.errors })
  }
})
