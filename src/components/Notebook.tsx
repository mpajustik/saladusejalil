import type { Card, NoteStatus } from '../types/game'
import type { MysteryCase } from '../types/case'

const STATUS_CYCLE: NoteStatus[] = ['unknown', 'possible', 'eliminated']

const STATUS_LABEL: Record<NoteStatus, string> = {
  unknown: '?',
  possible: '✓',
  eliminated: '✗',
}

const STATUS_CLASS: Record<NoteStatus, string> = {
  unknown: 'note-unknown',
  possible: 'note-possible',
  eliminated: 'note-eliminated',
}

function NoteRow({ card, status, onToggle }: {
  card: Card
  status: NoteStatus
  onToggle: () => void
}) {
  return (
    <li className={`note-row ${STATUS_CLASS[status]}`}>
      <button className="note-toggle" onClick={onToggle} title="Muuda staatust">
        {STATUS_LABEL[status]}
      </button>
      <span className="note-card-name">{card.name}</span>
    </li>
  )
}

function NoteGroup({ title, cards, notes, onToggle }: {
  title: string
  cards: Card[]
  notes: Record<string, NoteStatus>
  onToggle: (cardId: string) => void
}) {
  return (
    <section className="note-group">
      <h3>{title}</h3>
      <ul>
        {cards.map(card => (
          <NoteRow
            key={card.id}
            card={card}
            status={notes[card.id] ?? 'unknown'}
            onToggle={() => onToggle(card.id)}
          />
        ))}
      </ul>
    </section>
  )
}

export function Notebook({ playerName, gameCase, notes, onUpdate }: {
  playerName: string
  gameCase: MysteryCase
  notes: Record<string, NoteStatus>
  onUpdate: (cardId: string, newStatus: NoteStatus) => void
}) {
  function toggle(cardId: string) {
    const current = notes[cardId] ?? 'unknown'
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length]
    onUpdate(cardId, next)
  }

  return (
    <div className="notebook">
      <h2 className="notebook-title">Märkmik — {playerName}</h2>
      <p className="notebook-hint">
        <strong>Kuidas kasutada:</strong> Iga kord kui mõni mängija näitab sulle kaarti — tõmba see <strong>✗ välistatuks</strong>. Sinu enda kaardid on juba välistatud. Kui kõik peale kolme on välistatud, tead vastust.
        Vahetades korda, anna seade järgmisele mängijale.
      </p>
      <div className="notebook-grid">
        <NoteGroup title="Tegelased" cards={gameCase.suspects} notes={notes} onToggle={toggle} />
        <NoteGroup title="Asukohad"  cards={gameCase.locations} notes={notes} onToggle={toggle} />
        <NoteGroup title="Esemed"    cards={gameCase.items}     notes={notes} onToggle={toggle} />
      </div>
    </div>
  )
}
