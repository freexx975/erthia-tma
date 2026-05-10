import { useAppStore } from '../../stores/appStore'
import { enabledRaces } from '../../data/races'
import StepHeader from '../../components/StepHeader'
import { showToast } from '../../components/Toast'

export default function CreateRaceScreen() {
  const { creation, setRace, setScreen } = useAppStore()

  const handleNext = () => {
    if (!creation.race) {
      showToast('Scegli una razza per continuare')
      return
    }
    setScreen('create-class')
  }

  return (
    <div>
      <StepHeader currentStep={1} totalSteps={5} title="Scegli la Razza" />

      <div className="panel">
        <div className="panel-title">✦ Popoli di Erthia</div>
        <div className="grid-2">
          {enabledRaces.map(race => (
            <div
              key={race.id}
              className={`opt-card ${creation.race?.id === race.id ? 'selected' : ''}`}
              onClick={() => setRace(race)}
            >
              <span className="opt-icon">{race.icon}</span>
              <div className="opt-name">{race.name}</div>
              <div className="opt-desc">{race.description.slice(0, 60)}...</div>
            </div>
          ))}
        </div>
      </div>

      {creation.race && (
        <div className="panel">
          <div className="panel-title">✦ {creation.race.name}</div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '8px' }}>
            {creation.race.description}
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <strong style={{ color: 'var(--earth)' }}>Bonus statistiche:</strong>{' '}
            {Object.entries(creation.race.statBonus)
              .filter(([k]) => k !== 'any2')
              .map(([k, v]) => `${k} +${v}`)
              .join(', ')
            }
            {creation.race.statBonus.any2 ? ' +1 a due stat a scelta' : ''}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--earth)' }}>Tratti:</strong>{' '}
            {creation.race.traits.join(', ')}
          </div>
        </div>
      )}

      <div className="nav-row">
        <button className="btn" onClick={() => setScreen('title')}>
          <span>← Indietro</span>
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          <span>Avanti →</span>
        </button>
      </div>
    </div>
  )
}
