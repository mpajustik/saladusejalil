import { validateCase } from '../../../logic/validateCase'
import type { DraftCase } from '../../../types/draftCase'

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Lihtne',
  medium: 'Keskmine',
  hard: 'Raske',
}

interface Props {
  draft: DraftCase
  onBack: () => void
  onSave: () => void
  saving?: boolean
}

export function PreviewAndValidate({ draft, onBack, onSave, saving }: Props) {
  const result = validateCase(draft)
  const isValid = result.valid

  return (
    <div className="editor-step">
      <h3 className="editor-step-title">Vaata üle ja salvesta</h3>

      {/* Valideerimise tulemus */}
      {isValid ? (
        <div className="validation-ok">
          <span className="validation-icon">✓</span>
          Juhtum on kehtiv — kõik nõuded täidetud.
        </div>
      ) : (
        <div className="validation-errors">
          <p className="validation-errors-title">Leitud {result.errors.length} viga:</p>
          <ul>
            {result.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Kokkuvõte */}
      <div className="preview-card">
        <div className="preview-header">
          <h4 className="preview-title">{draft.title || '(pealkiri puudub)'}</h4>
          <div className="preview-meta">
            <span>{DIFFICULTY_LABEL[draft.difficulty] ?? draft.difficulty}</span>
            <span>{draft.minPlayers}–{draft.maxPlayers} mängijat</span>
            <code className="preview-id">{draft.id || '(id puudub)'}</code>
          </div>
        </div>
        {draft.description && (
          <p className="preview-description">{draft.description}</p>
        )}
      </div>

      <div className="preview-categories">
        <PreviewCategory
          title="Tegelased"
          items={draft.suspects}
          min={3}
        />
        <PreviewCategory
          title="Asukohad"
          items={draft.locations}
          min={3}
        />
        <PreviewCategory
          title="Esemed"
          items={draft.items}
          min={3}
        />
      </div>

      <div className="editor-nav">
        <button className="btn-secondary" onClick={onBack}>← Tagasi</button>
        <button
          className="btn-primary"
          onClick={onSave}
          disabled={!isValid || saving}
        >
          {saving ? 'Salvestan…' : '💾 Salvesta juhtum'}
        </button>
      </div>
    </div>
  )
}

function PreviewCategory({ title, items, min }: {
  title: string
  items: Array<{ id: string; name: string; description: string }>
  min: number
}) {
  const ok = items.length >= min
  return (
    <div className={`preview-category ${ok ? 'category-ok' : 'category-warn'}`}>
      <div className="preview-category-header">
        <span className="preview-category-title">{title}</span>
        <span className={`preview-category-count ${ok ? 'count-ok' : 'count-warn'}`}>
          {items.length}
          {!ok && ` (min ${min})`}
        </span>
      </div>
      {items.length > 0 ? (
        <ul className="preview-item-list">
          {items.map(item => (
            <li key={item.id}>
              <span className="preview-item-name">{item.name}</span>
              {item.description && (
                <span className="preview-item-desc"> — {item.description}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="preview-empty">Ühtegi kirjet pole lisatud.</p>
      )}
    </div>
  )
}
