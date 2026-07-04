import { useState } from 'react'
import { caseRegistry } from '../../data/caseRegistry'
import { loadCustomCases, deleteCustomCase } from '../../utils/customCases'
import type { MysteryCase } from '../../types/case'

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Lihtne',
  medium: 'Keskmine',
  hard: 'Raske',
}

interface Props {
  onBack: () => void
  onCreateNew: () => void
}

function CaseRow({ c, onDelete }: { c: MysteryCase; onDelete?: () => void }) {
  return (
    <div className="admin-case-card">
      <div className="admin-case-info">
        <span className="admin-case-title">{c.title}</span>
        <span className="admin-case-id">{c.id}</span>
      </div>
      <div className="admin-case-stats">
        <span className="admin-stat">
          <span className="admin-stat-num">{c.suspects.length}</span> tegelast
        </span>
        <span className="admin-stat">
          <span className="admin-stat-num">{c.locations.length}</span> asukohta
        </span>
        <span className="admin-stat">
          <span className="admin-stat-num">{c.items.length}</span> eset
        </span>
        <span className={`admin-difficulty diff-${c.difficulty}`}>
          {DIFFICULTY_LABEL[c.difficulty]}
        </span>
        {onDelete && (
          <button
            className="btn-icon btn-icon-del"
            onClick={onDelete}
            title="Kustuta juhtum"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function AdminHome({ onBack, onCreateNew }: Props) {
  const [customCases, setCustomCases] = useState<MysteryCase[]>(loadCustomCases)

  function handleDelete(id: string) {
    deleteCustomCase(id)
    setCustomCases(loadCustomCases())
  }

  return (
    <div className="admin-screen">
      <div className="admin-topbar">
        <button className="btn-back" onClick={onBack}>← Tagasi</button>
        <span className="admin-badge">Admin</span>
      </div>

      <h2 className="admin-title">Admin-paneel</h2>
      <p className="admin-sub">Halda mängujuhtumeid — vaata olemasolevaid ja loo uusi.</p>

      <div className="admin-section">
        <div className="admin-section-header">
          <h3>Sisseehitatud juhtumid ({caseRegistry.length})</h3>
        </div>
        <div className="admin-case-list">
          {caseRegistry.map(c => <CaseRow key={c.id} c={c} />)}
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h3>Kohandatud juhtumid ({customCases.length})</h3>
          <button className="btn-primary admin-create-btn" onClick={onCreateNew}>
            + Loo uus juhtum
          </button>
        </div>

        {customCases.length === 0 ? (
          <p className="admin-empty">
            Kohandatud juhtumeid pole veel loodud. Vajuta "Loo uus juhtum".
          </p>
        ) : (
          <div className="admin-case-list">
            {customCases.map(c => (
              <CaseRow
                key={c.id}
                c={c}
                onDelete={() => handleDelete(c.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="admin-info">
        <p>Sisseehitatud juhtumid asuvad kaustades:</p>
        <code>src/cases/</code> ja <code>backend/src/cases/</code>
        <p style={{ marginTop: '0.5rem' }}>
          Juhend: <code>docs/HOW_TO_ADD_CASE.md</code>
        </p>
      </div>
    </div>
  )
}
