import { useEffect, useState } from 'react'
import { createGame, getCases } from '../../api/gameApi'
import type { CaseSummary } from '../../api/gameApi'

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Lihtne',
  medium: 'Keskmine',
  hard: 'Raske',
}

interface Props {
  onBack: () => void
  onCreated: (session: { gameId: string; playerId: string; roomCode: string }) => void
}

export function CreateRoom({ onBack, onCreated }: Props) {
  const [name, setName]         = useState('')
  const [caseId, setCaseId]     = useState('')
  const [cases, setCases]       = useState<CaseSummary[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    getCases()
      .then(list => {
        setCases(list)
        if (list.length > 0) setCaseId(list[0].id)
      })
      .catch(() => setError('Juhtumite laadimine ebaõnnestus.'))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !caseId) return
    setLoading(true)
    setError(null)
    try {
      const session = await createGame(name.trim(), caseId)
      onCreated(session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Viga')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lobby-screen">
      <button className="btn-back" onClick={onBack}>← Tagasi</button>
      <h2>Loo mängutuba</h2>
      <p className="lobby-sub">Vali juhtum ja sisesta oma nimi.</p>
      <form className="lobby-form" onSubmit={handleSubmit}>

        {cases.length > 0 && (
          <div className="case-list">
            <p className="case-list-label">Vali juhtum</p>
            {cases.map(c => (
              <button
                key={c.id}
                type="button"
                className={`case-card ${caseId === c.id ? 'case-card-selected' : ''}`}
                onClick={() => setCaseId(c.id)}
              >
                <span className="case-card-title">{c.title}</span>
                <span className="case-card-meta">
                  {DIFFICULTY_LABEL[c.difficulty] ?? c.difficulty} · {c.minPlayers}–{c.maxPlayers} mängijat
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="form-row">
          <label>Sinu nimi</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="nt. Merlis"
            maxLength={20}
            autoFocus
          />
        </div>
        {error && <p className="lobby-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading || !name.trim() || !caseId}>
          {loading ? 'Loon tuba…' : 'Loo tuba'}
        </button>
      </form>
    </div>
  )
}
