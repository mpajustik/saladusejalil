import { useState } from 'react'
import type { CaseCard } from '../../../types/case'

function toId(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/õ/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

interface Props {
  title: string
  singularLabel: string   // "tegelane", "asukoht", "ese"
  pluralLabel: string     // "tegelased", "asukohad", "esemed"
  cards: CaseCard[]
  onChange: (cards: CaseCard[]) => void
  minCards?: number
  onNext: () => void
  onBack: () => void
  nextLabel?: string
}

export function CardListEditor({
  title, singularLabel, pluralLabel,
  cards, onChange,
  minCards = 3,
  onNext, onBack,
  nextLabel,
}: Props) {
  const [name, setName]         = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [editName, setEditName]       = useState('')
  const [editDesc, setEditDesc]       = useState('')
  const [error, setError]             = useState<string | null>(null)

  function addCard() {
    const trimmed = name.trim()
    if (!trimmed) return

    const id = toId(trimmed)
    if (!id) { setError('Nimi ei saa olla ainult erimärgid.'); return }

    const existingIds = cards.map(c => c.id)
    const finalId = existingIds.includes(id)
      ? `${id}-${cards.length + 1}`
      : id

    onChange([...cards, { id: finalId, name: trimmed, description: description.trim() }])
    setName('')
    setDescription('')
    setError(null)
  }

  function removeCard(id: string) {
    onChange(cards.filter(c => c.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function startEdit(card: CaseCard) {
    setEditingId(card.id)
    setEditName(card.name)
    setEditDesc(card.description)
  }

  function saveEdit() {
    if (!editingId || !editName.trim()) return
    onChange(cards.map(c =>
      c.id === editingId
        ? { ...c, name: editName.trim(), description: editDesc.trim() }
        : c
    ))
    setEditingId(null)
  }

  const canProceed = cards.length >= minCards

  return (
    <div className="editor-step">
      <h3 className="editor-step-title">{title}</h3>

      <div className="card-editor-count">
        <span className={cards.length >= minCards ? 'count-ok' : 'count-warn'}>
          {cards.length} {pluralLabel}
        </span>
        {cards.length < minCards && (
          <span className="count-hint"> — vähemalt {minCards} nõutud</span>
        )}
      </div>

      {/* Olemasolevad kaardid */}
      {cards.length > 0 && (
        <ul className="card-editor-list">
          {cards.map(card => (
            <li key={card.id} className="card-editor-item">
              {editingId === card.id ? (
                <div className="card-edit-form">
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Nimi"
                    autoFocus
                  />
                  <input
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    placeholder="Kirjeldus"
                  />
                  <div className="card-edit-actions">
                    <button className="btn-primary" onClick={saveEdit} disabled={!editName.trim()}>Salvesta</button>
                    <button className="btn-secondary" onClick={() => setEditingId(null)}>Tühista</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-item-info">
                    <span className="card-item-name">{card.name}</span>
                    {card.description && (
                      <span className="card-item-desc">{card.description}</span>
                    )}
                    <span className="card-item-id">{card.id}</span>
                  </div>
                  <div className="card-item-actions">
                    <button className="btn-icon" onClick={() => startEdit(card)} title="Muuda">✎</button>
                    <button className="btn-icon btn-icon-del" onClick={() => removeCard(card.id)} title="Kustuta">✕</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Lisa uus kaart */}
      <div className="card-add-form">
        <p className="card-add-label">Lisa {singularLabel}</p>
        <div className="form-row">
          <label>Nimi <span className="required">*</span></label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCard()}
            placeholder={`nt. ${singularLabel === 'tegelane' ? 'Mari Tamm' : singularLabel === 'asukoht' ? 'Keemialabor' : 'Mälupulk'}`}
            maxLength={60}
          />
        </div>
        <div className="form-row">
          <label>Kirjeldus <span className="label-hint">(valikuline)</span></label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCard()}
            placeholder="Lühikirjeldus"
            maxLength={200}
          />
        </div>
        {error && <p className="editor-field-error">{error}</p>}
        <button
          className="btn-secondary"
          onClick={addCard}
          disabled={!name.trim()}
        >
          + Lisa {singularLabel}
        </button>
      </div>

      <div className="editor-nav">
        <button className="btn-secondary" onClick={onBack}>← Tagasi</button>
        <button className="btn-primary" onClick={onNext} disabled={!canProceed}>
          {nextLabel ?? 'Järgmine →'}
        </button>
      </div>
    </div>
  )
}
