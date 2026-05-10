import { useState } from 'react'
import { useAppStore } from '../../stores/appStore'
import StepHeader from '../../components/StepHeader'
import { showToast } from '../../components/Toast'
import {
  computeFinalStats, computeMaxHp, computeMaxMp, computeAC,
  getModifierStr, STAT_KEYS, STAT_LABELS,
  getNFTRarity, RARITY_LABELS, RARITY_COLORS,
  totalPointsSpent,
} from '../../utils/game'

export default function CreatePreviewScreen() {
  const { creation, confirmCreation, setImageUrl, setScreen } = useAppStore()
  const [regenLeft, setRegenLeft] = useState(10)
  const [minting, setMinting] = useState(false)

  if (!creation.race || !creation.charClass) {
    setScreen('create-race')
    return null
  }

  const finalStats = computeFinalStats(creation.stats, creation.race)
  const maxHp = computeMaxHp(creation.charClass, finalStats)
  const maxMp = computeMaxMp(creation.charClass, finalStats)
  const ac = computeAC(finalStats)
  const totalPoints = totalPointsSpent(creation.stats) + 48 // 48 = base
  const rarity = getNFTRarity(creation.diceSystem === 'dice' && creation.diceResult
    ? creation.diceResult.total
    : 27)

  const handleRegenerate = () => {
    if (regenLeft <= 0) {
      showToast('Rigenerazioni esaurite!')
      return
    }
    setRegenLeft(r => r - 1)
    showToast(`Immagine rigenerata! (${regenLeft - 1} rimaste)`)
    // TODO: chiamata API fal.ai
  }

  const handleMint = async () => {
    if (!creation.name.trim()) {
      showToast('Inserisci un nome!')
      return
    }
    setMinting(true)
    // Simula mint (TODO: TON Connect + smart contract)
    await new Promise(r => setTimeout(r, 1500))
    setImageUrl(null) // placeholder
    confirmCreation()
    showToast('✦ Personaggio creato!')
    setMinting(false)
  }

  return (
    <div>
      <StepHeader currentStep={5} totalSteps={5} title="Il Tuo Personaggio" />

      <div className="panel">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            color: 'var(--earth)',
            marginBottom: '2px',
          }}>
            {creation.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            marginBottom: '6px',
          }}>
            {creation.race.name} · {creation.charClass.name}
          </div>
          <span
            className="rarity-tag"
            style={{ color: RARITY_COLORS[rarity], borderColor: RARITY_COLORS[rarity] }}
          >
            {RARITY_LABELS[rarity]}
          </span>
        </div>

        {/* Portrait placeholder */}
        <div className="portrait-zone" style={{ height: 200, margin: '12px 0' }}>
          <div style={{ textAlign: 'center', color: 'rgba(30,77,140,.5)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '6px' }}>{creation.charClass.icon}</div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '0.78rem',
            }}>
              Immagine generata da AI<br />
              stile Larry Elmore / Jeff Easley
            </div>
          </div>
          <div className="portrait-corner tl" />
          <div className="portrait-corner tr" />
          <div className="portrait-corner bl" />
          <div className="portrait-corner br" />
        </div>

        <button
          className="btn btn-sm btn-block"
          onClick={handleRegenerate}
          style={{ marginBottom: '12px' }}
        >
          <span>↺ Rigenera ({regenLeft} rimaste)</span>
        </button>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: '5px',
          marginBottom: '10px',
        }}>
          {STAT_KEYS.map(key => (
            <div key={key} style={{
              background: 'rgba(139,105,20,.08)',
              border: '1px solid rgba(139,105,20,.2)',
              padding: '5px 2px',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {STAT_LABELS[key].slice(0,3)}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--earth)' }}>
                {finalStats[key]}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                {getModifierStr(finalStats[key])}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          marginBottom: '12px',
          fontFamily: 'var(--font-serif)',
        }}>
          <span>❤ HP {maxHp}</span>
          <span>✨ MP {maxMp}</span>
          <span>🛡 CA {ac}</span>
        </div>

        <div className="info-box" style={{ marginBottom: '10px' }}>
          Confermando, il personaggio verrà mintato come NFT sulla blockchain TON.
          Connetti il tuo wallet TON per procedere.
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={handleMint}
          disabled={minting}
        >
          <span>{minting ? 'Creazione in corso...' : '⬡ Connetti Wallet e Minta NFT'}</span>
        </button>
      </div>

      <div className="nav-row">
        <button className="btn btn-sm" onClick={() => setScreen('create-appearance')}>
          <span>← Modifica</span>
        </button>
      </div>
    </div>
  )
}
