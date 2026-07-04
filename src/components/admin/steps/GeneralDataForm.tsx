import { useEffect } from 'react'
import type { DraftCase } from '../../../types/draftCase'

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/õ/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

interface Props {
  draft: DraftCase
  onChange: (updated: Partial<DraftCase>) => void
  onNext: () => void
}

export function GeneralDataForm({ draft, onChange, onNext }: Props) {
  // Auto-genereeri id pealkirjast (kui id pole käsitsi muudetud)
  useEffect(() => {
    if (draft.title && !draft.id) {
      onChange({ id: toSlug(draft.title) })
    }
  }, [draft.title])

  const canProceed =
    draft.title.trim().length > 0 &&
    draft.id.trim().length > 0 &&
    draft.description.trim().length > 0 &&
    draft.maxPlayers >= draft.minPlayers

  return (
    <div className="editor-step">
      <h3 className="editor-step-title">Üldandmed</h3>

      <div className="editor-form">
        <div className="form-row">
          <label>Pealkiri <span className="required">*</span></label>
          <input
            type="text"
            value={draft.title}
            onChange={e => {
              const title = e.target.value
              onChange({ title, id: toSlug(title) })
            }}
            placeholder="nt. Kadunud Leiutise Juhtum"
            maxLength={80}
            autoFocus
          />
        </div>

        <div className="form-row">
          <label>
            ID <span className="required">*</span>
            <span className="label-hint"> — ainult väiketähed, numbrid ja sidekriips</span>
          </label>
          <input
            type="text"
            value={draft.id}
            onChange={e => onChange({ id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
            placeholder="nt. kadunud-leiutis"
            maxLength={60}
          />
        </div>

        <div className="form-row">
          <label>Kirjeldus <span className="required">*</span></label>
          <textarea
            value={draft.description}
            onChange={e => onChange({ description: e.target.value })}
            placeholder="Lühikirjeldus mis juhtus ja mida mängijad peavad välja selgitama."
            rows={3}
            maxLength={500}
          />
          <span className="char-count">{draft.description.length}/500</span>
        </div>

        <div className="form-row-inline">
          <div className="form-row">
            <label>Raskusaste</label>
            <select
              value={draft.difficulty}
              onChange={e => onChange({ difficulty: e.target.value as DraftCase['difficulty'] })}
            >
              <option value="easy">Lihtne</option>
              <option value="medium">Keskmine</option>
              <option value="hard">Raske</option>
            </select>
          </div>

          <div className="form-row">
            <label>Min mängijaid</label>
            <input
              type="number"
              value={draft.minPlayers}
              min={2} max={6}
              onChange={e => onChange({ minPlayers: Number(e.target.value) })}
            />
          </div>

          <div className="form-row">
            <label>Max mängijaid</label>
            <input
              type="number"
              value={draft.maxPlayers}
              min={draft.minPlayers} max={6}
              onChange={e => onChange({ maxPlayers: Number(e.target.value) })}
            />
          </div>
        </div>

        {draft.maxPlayers < draft.minPlayers && (
          <p className="editor-field-error">Max mängijaid peab olema ≥ min mängijaid</p>
        )}
      </div>

      <div className="editor-nav">
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          Järgmine: Tegelased →
        </button>
      </div>
    </div>
  )
}
