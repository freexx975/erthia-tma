import { useAppStore } from '../../stores/appStore'
import StepHeader from '../../components/StepHeader'
import { showToast } from '../../components/Toast'

const HAIR_COLORS = ['#2C1F0E','#8B4513','#C4973A','#F5DEB3','#E8C97A','#D2691E','#1C1C1C','#808080']
const EYE_COLORS  = ['#2C4A6E','#2D6A2D','#8B6914','#4A4A4A','#8B4513','#6B5B8A','#1E4D8C','#C4973A']
const SKIN_TONES  = ['#FDEBD0','#F5CBA7','#E59866','#CA6F1E','#A04000','#784212','#5D4037','#3E2723']

export default function CreateAppearanceScreen() {
  const { creation, setName, setAppearance, setScreen } = useAppStore()
  const { appearance } = creation

  const handleNext = () => {
    if (!creation.name.trim()) {
      showToast('Inserisci un nome per il tuo personaggio')
      return
    }
    setScreen('create-preview')
  }

  return (
    <div>
      <StepHeader currentStep={4} totalSteps={5} title="Aspetto e Nome" />

      <div className="panel">
        <div className="panel-title">✦ Nome del Personaggio</div>
        <input
          className="input"
          placeholder="Come ti chiami, avventuriero?"
          maxLength={28}
          value={creation.name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="panel">
        <div className="panel-title">✦ Aspetto Fisico</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <AeGroup label="Sesso">
            <select
              className="select"
              value={appearance.sex}
              onChange={e => setAppearance({ sex: e.target.value as any })}
            >
              <option value="male">Maschile</option>
              <option value="female">Femminile</option>
              <option value="androgynous">Androgino</option>
            </select>
          </AeGroup>

          <AeGroup label="Corporatura">
            <select
              className="select"
              value={appearance.build}
              onChange={e => setAppearance({ build: e.target.value as any })}
            >
              <option value="athletic">Atletica</option>
              <option value="muscular">Robusta</option>
              <option value="slender">Snella</option>
              <option value="stocky">Massiccia</option>
            </select>
          </AeGroup>

          <AeGroup label="Taglio capelli">
            <select
              className="select"
              value={appearance.hairStyle}
              onChange={e => setAppearance({ hairStyle: e.target.value })}
            >
              <option value="short">Corti</option>
              <option value="medium">Medi</option>
              <option value="long">Lunghi</option>
              <option value="shaved">Rasati</option>
              <option value="tied">Raccolti</option>
            </select>
          </AeGroup>

          <AeGroup label="Sopracciglia">
            <select
              className="select"
              value={appearance.eyebrows}
              onChange={e => setAppearance({ eyebrows: e.target.value })}
            >
              <option value="regular">Regolari</option>
              <option value="thick">Folte</option>
              <option value="arched">Arcuate</option>
              <option value="thin">Sottili</option>
            </select>
          </AeGroup>

          <AeGroup label="Naso">
            <select
              className="select"
              value={appearance.nose}
              onChange={e => setAppearance({ nose: e.target.value })}
            >
              <option value="straight">Dritto</option>
              <option value="aquiline">Aquilino</option>
              <option value="snub">Camuso</option>
              <option value="broad">Largo</option>
            </select>
          </AeGroup>

          <AeGroup label="Peli facciali">
            <select
              className="select"
              value={appearance.facialHair}
              onChange={e => setAppearance({ facialHair: e.target.value })}
            >
              <option value="none">Nessuno</option>
              <option value="stubble">Barba corta</option>
              <option value="beard">Barba lunga</option>
              <option value="mustache">Baffi</option>
              <option value="sideburns">Basette</option>
            </select>
          </AeGroup>
        </div>

        <AeGroup label="Cicatrici" style={{ marginTop: '8px' }}>
          <select
            className="select"
            value={appearance.scar}
            onChange={e => setAppearance({ scar: e.target.value })}
          >
            <option value="none">Nessuna</option>
            <option value="face">Sul viso</option>
            <option value="chin">Sul mento</option>
            <option value="eye">Sull'occhio</option>
            <option value="multiple">Multiple</option>
          </select>
        </AeGroup>

        <ColorPicker
          label="Colore capelli"
          colors={HAIR_COLORS}
          selected={appearance.hairColor}
          onChange={c => setAppearance({ hairColor: c })}
        />

        <ColorPicker
          label="Colore occhi"
          colors={EYE_COLORS}
          selected={appearance.eyeColor}
          onChange={c => setAppearance({ eyeColor: c })}
        />

        <ColorPicker
          label="Carnagione"
          colors={SKIN_TONES}
          selected={appearance.skinTone}
          onChange={c => setAppearance({ skinTone: c })}
        />
      </div>

      <div className="nav-row">
        <button className="btn" onClick={() => setScreen('create-stats')}>
          <span>← Indietro</span>
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          <span>Genera immagine →</span>
        </button>
      </div>
    </div>
  )
}

function AeGroup({ label, children, style }: {
  label: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div style={style}>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        marginBottom: '4px',
        display: 'block',
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function ColorPicker({ label, colors, selected, onChange }: {
  label: string
  colors: string[]
  selected: string
  onChange: (color: string) => void
}) {
  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        marginBottom: '4px',
      }}>
        {label}
      </div>
      <div className="color-row">
        {colors.map(color => (
          <div
            key={color}
            className={`color-dot ${selected === color ? 'selected' : ''}`}
            style={{ background: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  )
}
