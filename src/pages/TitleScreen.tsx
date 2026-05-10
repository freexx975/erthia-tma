import { useAppStore } from '../stores/appStore'

export default function TitleScreen() {
  const { setScreen, resetCreation } = useAppStore()

  const startCreation = () => {
    resetCreation()
    setScreen('create-race')
  }

  return (
    <div>
      <div className="game-title" style={{ padding: '24px 0 16px' }}>
        <div className="title-main">Erthia</div>
        <div className="title-sub">
          <span className="ornament">✦</span>
          Chronicles of the Ancient World
          <span className="ornament">✦</span>
        </div>
      </div>

      <div className="panel" style={{ textAlign: 'center', padding: '24px 16px' }}>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '0.92rem',
          color: 'var(--text-muted)',
          lineHeight: 1.7,
          marginBottom: '20px',
        }}>
          Il mondo di Erthia vi aspetta.<br />
          Forgia il tuo destino, scrivi la tua leggenda.
        </div>
        <button className="btn btn-primary" onClick={startCreation}>
          <span>✦ Crea il tuo Personaggio ✦</span>
        </button>
      </div>

      <div className="panel">
        <div className="panel-title">Il Mondo</div>
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          Erthia è un mondo antico — la sua mappa rispecchia terre che forse conosci,
          ma la sua storia è tutta da scrivere. Scegli la tua razza, la tua classe,
          il tuo destino.
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Powered by</div>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {['TON Blockchain', 'D&D 5e SRD', 'NFT Characters', 'DAO Governance'].map(tag => (
            <span key={tag} style={{
              background: 'rgba(196,151,58,.1)',
              border: '1px solid rgba(196,151,58,.3)',
              borderRadius: '2px',
              padding: '3px 8px',
              fontSize: '0.72rem',
              color: 'var(--earth)',
              fontFamily: 'var(--font-serif)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
