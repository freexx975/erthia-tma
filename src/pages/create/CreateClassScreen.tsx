import { useAppStore } from '../../stores/appStore'
import { enabledClasses } from '../../data/classes'
import StepHeader from '../../components/StepHeader'
import { showToast } from '../../components/Toast'

export default function CreateClassScreen() {
  const { creation, setClass, setScreen } = useAppStore()

  const handleNext = () => {
    if (!creation.charClass) {
      showToast('Scegli una classe per continuare')
      return
    }
    setScreen('create-stats')
  }

  return (
    <div>
      <StepHeader currentStep={2} totalSteps={5} title="Scegli la Classe" />

      <div className="panel">
        <div className="panel-title">✦ Classi di Erthia</div>
        <div className="grid-3">
          {enabledClasses.map(cls => (
            <div
              key={cls.id}
              className={`opt-card ${creation.charClass?.id === cls.id ? 'selected' : ''}`}
              onClick={() => setClass(cls)}
            >
              <span className="opt-icon">{cls.icon}</span>
              <div className="opt-name">{cls.name}</div>
              <div className="opt-desc">{cls.description.slice(0, 40)}...</div>
            </div>
          ))}
        </div>
      </div>

      {creation.charClass && (
        <div className="panel">
          <div className="panel-title">✦ {creation.charClass.name}</div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '8px' }}>
            {creation.charClass.description}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.78rem' }}>
            <div>
              <span style={{ color: 'var(--earth)', fontWeight: 600 }}>Dado vita:</span>{' '}
              <span style={{ color: 'var(--text-muted)' }}>d{creation.charClass.hitDie}</span>
            </div>
            <div>
              <span style={{ color: 'var(--earth)', fontWeight: 600 }}>Magia:</span>{' '}
              <span style={{ color: 'var(--text-muted)' }}>{creation.charClass.spellcaster ? 'Sì' : 'No'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--earth)', fontWeight: 600 }}>Stat primarie:</span>{' '}
              <span style={{ color: 'var(--text-muted)' }}>{creation.charClass.primaryStats.join(', ')}</span>
            </div>
            <div>
              <span style={{ color: 'var(--earth)', fontWeight: 600 }}>Sottoclasse:</span>{' '}
              <span style={{ color: 'var(--text-muted)' }}>Liv. {creation.charClass.subclassLevel}</span>
            </div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--earth)' }}>Abilità iniziali:</strong>{' '}
            {creation.charClass.startingAbilities.join(', ')}
          </div>
        </div>
      )}

      <div className="nav-row">
        <button className="btn" onClick={() => setScreen('create-race')}>
          <span>← Indietro</span>
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          <span>Avanti →</span>
        </button>
      </div>
    </div>
  )
}
