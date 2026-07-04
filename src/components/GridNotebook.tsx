import type { MysteryCase } from '../types/case'
import type { CellValue, GridNotes } from '../types/game'

// Klikiga tsükkel teiste mängijate veergudes
const CYCLE: CellValue[] = ['', 'has', 'no', 'probably-no', 'maybe']

interface Player { id: string; name: string }

interface Props {
  gameCase: MysteryCase
  players: Player[]
  myPlayerId: string
  notes: GridNotes
  onUpdate: (cardId: string, targetPlayerId: string, value: CellValue) => void
}

function abbreviate(name: string) {
  return name.length > 9 ? name.slice(0, 8) + '…' : name
}

function cellChar(value: CellValue): string {
  if (value === 'has')         return 'X'
  if (value === 'no')          return '—'
  if (value === 'probably-no') return '~'
  if (value === 'maybe')       return '?'
  return ''
}

function cellClass(value: CellValue, locked: boolean): string {
  if (value === 'has')         return locked ? 'gc-has-locked'  : 'gc-has'
  if (value === 'no')          return locked ? 'gc-no-locked'   : 'gc-no'
  if (value === 'probably-no') return 'gc-probably-no'
  if (value === 'maybe')       return 'gc-maybe'
  return locked ? 'gc-empty-locked' : 'gc-empty'
}

function CardGroup({ title, cards, players, myPlayerId, notes, onUpdate }: {
  title: string
  cards: MysteryCase['suspects']
  players: Player[]
  myPlayerId: string
  notes: GridNotes
  onUpdate: (cardId: string, targetPlayerId: string, value: CellValue) => void
}) {
  return (
    <>
      <tr className="grid-category-row">
        <th className="grid-category-label" colSpan={players.length + 1}>{title}</th>
      </tr>
      {cards.map(card => (
        <tr key={card.id} className="grid-card-row">
          <td className="grid-card-name">{card.name}</td>
          {players.map(player => {
            const value: CellValue = (notes[card.id]?.[player.id] as CellValue) || ''
            const locked = player.id === myPlayerId
            const cls = cellClass(value, locked)
            return (
              <td
                key={player.id}
                className={`grid-cell ${cls}`}
                onClick={locked ? undefined : () => {
                  const next = CYCLE[(CYCLE.indexOf(value) + 1) % CYCLE.length]
                  onUpdate(card.id, player.id, next)
                }}
                title={locked
                  ? (value === 'has' ? 'Sinu käes' : 'Sul ei ole')
                  : 'Kliki muutmiseks'
                }
              >
                {cellChar(value)}
              </td>
            )
          })}
        </tr>
      ))}
    </>
  )
}

export function GridNotebook({ gameCase, players, myPlayerId, notes, onUpdate }: Props) {
  return (
    <div className="grid-notebook">
      <div className="grid-notebook-legend">
        <span className="legend-item"><span className="gc-has" style={{ padding: '0 4px' }}>X</span> omab</span>
        <span className="legend-item"><span className="gc-no" style={{ padding: '0 4px' }}>—</span> ei oma</span>
        <span className="legend-item"><span className="gc-probably-no" style={{ padding: '0 4px' }}>~</span> pigem ei oma</span>
        <span className="legend-item"><span className="gc-maybe" style={{ padding: '0 4px' }}>?</span> võib olla</span>
        <span className="legend-hint">Kliki muutmiseks</span>
      </div>
      <div className="grid-notebook-scroll">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-header-card"></th>
              {players.map(p => (
                <th key={p.id} className={`grid-header-player ${p.id === myPlayerId ? 'header-me' : ''}`}>
                  {abbreviate(p.name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CardGroup title="KES?" cards={gameCase.suspects}
              players={players} myPlayerId={myPlayerId} notes={notes} onUpdate={onUpdate} />
            <CardGroup title="KUS?" cards={gameCase.locations}
              players={players} myPlayerId={myPlayerId} notes={notes} onUpdate={onUpdate} />
            <CardGroup title="MILLEGA?" cards={gameCase.items}
              players={players} myPlayerId={myPlayerId} notes={notes} onUpdate={onUpdate} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
