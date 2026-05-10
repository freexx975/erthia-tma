import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../stores/appStore'
import StepHeader from '../../components/StepHeader'
import { showToast } from '../../components/Toast'
import { STAT_KEYS, STAT_LABELS, pointCost, getModifierStr, computeFinalStats, rollDiceSystem } from '../../utils/game'

const STAT_MIN = 8
const STAT_MAX = 15

export default function CreateStatsScreen() {
  const { creation, setStat, setDiceSystem, setScreen } = useAppStore()
  const [rolling, setRolling] = useState(false)
  const [diceResult, setDiceResult] = useState(null)
  const [availablePoints, setAvailablePoints] = useState(27)

  const finalStats = creation.race ? computeFinalStats(creation.stats, creation.race) : creation.stats

  const getRaceBonus = (key) => {
    if (!creation.race) return 0
    return (creation.race.statBonus[key] || 0)
  }

  const pointsSpent = STAT_KEYS.reduce((total, key) => {
    let cost = 0
    for (let i = STAT_MIN + 1; i <= creation.stats[key]; i++) cost += pointCost(i)
    return total + cost
  }, 0)

  const remaining = availablePoints - pointsSpent

  const handleRoll = () => {
    setRolling(true)
    setTimeout(() => {
      const result = rollDiceSystem()
      setDiceResult(result)
      setAvailablePoints(result.total)
      STAT_KEYS.forEach(key => setStat(key, 8))
      setRolling(false)
      showToast('Hai ottenuto ' + result.total + ' punti!')
    }, 600)
  }

  const handleIncrease = (key) => {
    const current = creation.stats[key]
    if (current >= STAT_MAX) return
    const cost = pointCost(current + 1)
    if (remaining < cost) return
    setStat(key, current + 1)
  }

  const handleDecrease = (key) => {
    if (creation.stats[key] <= STAT_MIN) return
    setStat(key, creation.stats[key] - 1)
  }

  const canInc = (key) => {
    const current = creation.stats[key]
    if (current >= STAT_MAX) return false
    return remaining >= pointCost(current + 1)
  }

  const switchSystem = (system) => {
    setDiceSystem(system)
    STAT_KEYS.forEach(key => setStat(key, 8))
    if (system === 'pointbuy') { setAvailablePoints(27); setDiceResult(null) }
  }

  return (
    <div>
      <StepHeader currentStep={3} totalSteps={5} title="Caratteristiche" />
      <div className="panel">
        <div className="panel-title">✦ Metodo di Creazione</div>
        <div className="grid-2">
          <div className={'opt-card ' + (creation.diceSystem === 'pointbuy' ? 'selected' : '')} onClick={() => switchSystem('pointbuy')}>
            <span className="opt-icon">📊</span>
            <div className="opt-name">Point Buy</div>
            <div className="opt-desc">27 punti, risultato certo</div>
          </div>
          <div className={'opt-card ' + (creation.diceSystem === 'dice' ? 'selected' : '')} onClick={() => switchSystem('dice')}>
            <span className="opt-icon">🎲</span>
            <div className="opt-name">Sistema a Dadi</div>
            <div className="opt-desc">21+3d3, rischio e fortuna</div>
          </div>
        </div>
      </div>

      {creation.diceSystem === 'dice' && (
        <div className="panel">
          <div className="panel-title">✦ I Dadi di Erthia</div>
          <div className="dice-container">
            {[0,1,2].map(i => (
              <motion.div key={i} className="dice-face" animate={rolling ? {rotate:[0,-15,10,0]} : {}} transition={{duration:0.5,delay:i*0.1}}>
                {diceResult ? diceResult.dice[i] : '?'}
              </motion.div>
            ))}
          </div>
          {diceResult && (
            <div style={{textAlign:'center',marginBottom:'10px'}}>
              <div className="dice-total">{diceResult.total}</div>
              <div style={{fontSize:'0.75rem',color:'var(--text-muted)',fontFamily:'var(--font-serif)'}}>{diceResult.breakdown}</div>
            </div>
          )}
          <button className="btn btn-primary btn-block" onClick={handleRoll} disabled={rolling}>
            <span>{rolling ? 'Tirando...' : diceResult ? '↺ Ritira i Dadi' : '🎲 Tira i Dadi'}</span>
          </button>
          {diceResult && <div style={{fontSize:'0.72rem',color:'var(--text-muted)',textAlign:'center',fontStyle:'italic',marginTop:'4px'}}>Ritirare azzera le statistiche distribuite</div>}
        </div>
      )}

      {(creation.diceSystem === 'pointbuy' || diceResult) && (
        <div className="panel">
          <div className="panel-title">✦ Distribuisci i Punti</div>

          {creation.race && (
            <div className="info-box" style={{marginBottom:'10px'}}>
              Bonus razza <strong>{creation.race.name}</strong> già incluso nei valori finali (colonna destra).
            </div>
          )}

          <div style={{fontFamily:'var(--font-serif)',fontSize:'0.78rem',color:'var(--text-muted)',textAlign:'right',marginBottom:'8px'}}>
            Punti disponibili: <span style={{color:'var(--earth)',fontSize:'0.9rem',fontFamily:'var(--font-display)'}}>{remaining}</span>/{availablePoints}
          </div>

          {/* Header colonne */}
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',fontSize:'0.6rem',color:'var(--text-muted)',fontFamily:'var(--font-serif)',letterSpacing:'0.08em',textTransform:'uppercase'}}>
            <div style={{width:'86px',flexShrink:0}}></div>
            <div style={{flex:1,textAlign:'center'}}>Base</div>
            <div style={{width:'22px',textAlign:'center'}}>Base</div>
            <div style={{width:'36px',textAlign:'center',color:'var(--earth)'}}>+Bonus</div>
            <div style={{width:'36px',textAlign:'center',color:'var(--forest)'}}>Finale</div>
            <div style={{width:'44px'}}></div>
          </div>

          {STAT_KEYS.map(key => {
            const base = creation.stats[key]
            const bonus = getRaceBonus(key)
            const finale = finalStats[key]
            return (
              <div key={key} className="stat-row">
                <div className="stat-label">{STAT_LABELS[key]}</div>
                <div className="bar-wrap" style={{flex:1}}>
                  <div className="bar-fill bar-stat" style={{width:((base-8)/7*100)+'%'}} />
                </div>
                <div className="stat-val">{base}</div>
                <div style={{fontSize:'0.7rem',color:'var(--earth)',width:'36px',textAlign:'center',fontFamily:'var(--font-serif)'}}>
                  {bonus > 0 ? '+'+bonus : bonus < 0 ? bonus : '—'}
                </div>
                <div style={{fontFamily:'var(--font-display)',fontSize:'0.95rem',color:'var(--forest-dark)',width:'36px',textAlign:'center',fontWeight:'bold'}}>
                  {finale}
                  <div style={{fontSize:'0.55rem',color:'var(--text-muted)',fontFamily:'var(--font-serif)'}}>{getModifierStr(finale)}</div>
                </div>
                <div className="stat-adj">
                  <button className="stat-btn" onClick={() => handleDecrease(key)} disabled={base <= STAT_MIN}>−</button>
                  <button className="stat-btn" onClick={() => handleIncrease(key)} disabled={!canInc(key)}>+</button>
                </div>
              </div>
            )
          })}

          {creation.diceSystem === 'pointbuy' && (
            <div className="info-box" style={{marginTop:'8px'}}>
              Costo: 1 punto per valori fino a 13, 2 punti per 14-15.
            </div>
          )}
        </div>
      )}

      <div className="nav-row">
        <button className="btn" onClick={() => setScreen('create-class')}><span>← Indietro</span></button>
        <button className="btn btn-primary" onClick={() => {
          if(creation.diceSystem==='dice'&&!diceResult){showToast('Tira i dadi prima!');return}
          setScreen('create-appearance')
        }}><span>Avanti →</span></button>
      </div>
    </div>
  )
}
