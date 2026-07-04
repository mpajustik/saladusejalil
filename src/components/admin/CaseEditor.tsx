import { useState } from 'react'
import { EMPTY_DRAFT } from '../../types/draftCase'
import { GeneralDataForm } from './steps/GeneralDataForm'
import { CardListEditor } from './steps/CardListEditor'
import { PreviewAndValidate } from './steps/PreviewAndValidate'
import { saveCustomCase } from '../../utils/customCases'
import type { DraftCase } from '../../types/draftCase'
import type { MysteryCase } from '../../types/case'

type EditorStep = 'general' | 'suspects' | 'locations' | 'items' | 'preview'

const STEP_LABELS: Record<EditorStep, string> = {
  general:   '1. Üldandmed',
  suspects:  '2. Tegelased',
  locations: '3. Asukohad',
  items:     '4. Esemed',
  preview:   '5. Salvesta',
}

const STEP_ORDER: EditorStep[] = ['general', 'suspects', 'locations', 'items', 'preview']

interface Props {
  onBack: () => void
}

export function CaseEditor({ onBack }: Props) {
  const [draft, setDraft]       = useState<DraftCase>(EMPTY_DRAFT)
  const [step, setStep]         = useState<EditorStep>('general')
  const [saving, setSaving]     = useState(false)
  const [savedCase, setSavedCase] = useState<MysteryCase | null>(null)

  function updateDraft(updates: Partial<DraftCase>) {
    setDraft(prev => ({ ...prev, ...updates }))
  }

  function goToStep(s: EditorStep) {
    setStep(s)
    window.scrollTo(0, 0)
  }

  function handleSave() {
    setSaving(true)
    try {
      const newCase: MysteryCase = { ...draft }
      saveCustomCase(newCase)
      setSavedCase(newCase)
    } finally {
      setSaving(false)
    }
  }

  function handleCreateAnother() {
    setDraft(EMPTY_DRAFT)
    setStep('general')
    setSavedCase(null)
    window.scrollTo(0, 0)
  }

  const currentIndex = STEP_ORDER.indexOf(step)

  // Edu-ekraan pärast salvestamist
  if (savedCase) {
    return (
      <div className="admin-screen">
        <div className="admin-topbar">
          <button className="btn-back" onClick={onBack}>← Admin-paneel</button>
          <span className="admin-badge">Admin</span>
        </div>
        <div className="save-success">
          <div className="save-success-icon">✓</div>
          <h3>Juhtum salvestatud!</h3>
          <p className="save-success-title">„{savedCase.title}"</p>
          <p className="save-success-sub">
            Juhtum on saadaval mängimiseks kohe — vali see mängu alustamisel.
          </p>
          <div className="editor-nav">
            <button className="btn-primary" onClick={onBack}>Vaata admin-paneeli</button>
            <button className="btn-secondary" onClick={handleCreateAnother}>Loo veel üks juhtum</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-screen">
      <div className="admin-topbar">
        <button className="btn-back" onClick={onBack}>← Tagasi</button>
        <span className="admin-badge">Admin</span>
      </div>

      <h2 className="admin-title">Uus juhtum</h2>
      {draft.title && <p className="admin-sub">„{draft.title}"</p>}

      {/* Sammude navigeerimine */}
      <div className="editor-steps">
        {STEP_ORDER.map((s, i) => (
          <button
            key={s}
            className={`editor-step-btn ${step === s ? 'editor-step-active' : ''} ${i < currentIndex ? 'editor-step-done' : ''}`}
            onClick={() => i < currentIndex ? goToStep(s) : undefined}
            disabled={i > currentIndex}
          >
            {i < currentIndex ? '✓' : i + 1}
          </button>
        ))}
        <span className="editor-step-label">{STEP_LABELS[step]}</span>
      </div>

      {step === 'general' && (
        <GeneralDataForm
          draft={draft}
          onChange={updateDraft}
          onNext={() => goToStep('suspects')}
        />
      )}

      {step === 'suspects' && (
        <CardListEditor
          title="Tegelased"
          singularLabel="tegelane"
          pluralLabel="tegelast"
          cards={draft.suspects}
          onChange={suspects => updateDraft({ suspects })}
          onBack={() => goToStep('general')}
          onNext={() => goToStep('locations')}
          nextLabel="Järgmine: Asukohad →"
        />
      )}

      {step === 'locations' && (
        <CardListEditor
          title="Asukohad"
          singularLabel="asukoht"
          pluralLabel="asukohta"
          cards={draft.locations}
          onChange={locations => updateDraft({ locations })}
          onBack={() => goToStep('suspects')}
          onNext={() => goToStep('items')}
          nextLabel="Järgmine: Esemed →"
        />
      )}

      {step === 'items' && (
        <CardListEditor
          title="Esemed ja tõendid"
          singularLabel="ese"
          pluralLabel="eset"
          cards={draft.items}
          onChange={items => updateDraft({ items })}
          onBack={() => goToStep('locations')}
          onNext={() => goToStep('preview')}
          nextLabel="Järgmine: Vaata üle →"
        />
      )}

      {step === 'preview' && (
        <PreviewAndValidate
          draft={draft}
          onBack={() => goToStep('items')}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  )
}
