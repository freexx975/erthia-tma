import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../stores/appStore'
import StepHeader from '../../components/StepHeader'
import { showToast } from '../../components/Toast'
import { STAT_KEYS, STAT_LABELS, pointCost, getModifierStr, computeFinalStats, rollDiceSystem } from '../../utils/game'
import type { StatKey, DiceRollResult } from '../../types'

const STAT_MIN = 8
const STAT_MAX = 15

function Modal({children,onClose}:{children:React.ReactNode,onClose:()=>void}) {
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:200,background:'rgba(42,30,10,.8)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'var(--parchment)',border:'2px solid var(--earth-dark)',borderRadius:'3px',padding:'18px',width:'100%',maxWidth:'380px',position:'relative',maxHeight:'80vh',overflowY:'auto'}}>
        <button onClick={onClose} style={{position:'absolute',top:'8px',right:'10px',background:'none',border:'none',fontSize:'1.2rem',color:'var(--earth)',cursor:'pointer'}}>✕</button>
        {children}
      </div>
    </div>
  )
}

export default function CreateStatsScreen() {
  const { creation, setStat, setDiceSystem, setScreen } = useAppStore()
  const [diceResult, setDiceResult] = useState<DiceRollResult | null>(null)
  const [rolling, setRolling] = useState(false)
  const [availablePoints, setAvailablePoints] = useState(27)
  const [showDiceModal, setShowDiceModal] = useState(false)

  const finalStats = creation.race ? computeFinalStats(creation.stats, creation.race) : creation.stats

  const getRaceBonus = (key: StatKey): number => {
    if (!creation.race) return 0
    return (creation.race.statBonus[key] || 0) as number
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
    }, 600)
  }

  const handleIncrease = (key: StatKey) => {
    const current = creation.stats[key]
    if (current >= STAT_MAX) return
    if (remaining < pointCost(current + 1)) return
    setStat(key, current + 1)
  }

  const handleDecrease = (key: StatKey) => {
    if (creation.stats[key] <= STAT_MIN) return
    setStat(key, creation.stats[key] - 1)
  }

  const canInc = (key: StatKey) => creation.stats[key] < STAT_MAX && remaining >= pointCost(creation.stats[key] + 1)

  const switchSystem = (system: 'pointbuy' | 'dice') => {
    setDiceSystem(system)
    STAT_KEYS.forEach(key => setStat(key, 8))
    if (system === 'pointbuy') { setAvailablePoints(27); setDiceResult(null) }
    if (system === 'dice') setShowDiceModal(true)
  }

  return (
    <div style={{height:'100dvh',display:'flex',flexDirection:'column',overflow:'hidden',position:'fixed',inset:0,padding:'8px',paddingTop:'calc(8px + env(safe-area-inset-top))',paddingBottom:'calc(8px + env(safe-area-inset-bottom))'}}>
      <div style={{flexShrink:0}}><StepHeader currentStep={3} totalSteps={5} title="Caratteristiche" /></div>

      <div style={{flexShrink:0,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginBottom:'6px'}}>
        <div className={`opt-card ${creation.diceSystem==='pointbuy'?'selected':''}`} onClick={()=>switchSystem('pointbuy')} style={{padding:'8px'}}>
          <span className="opt-icon" style={{fontSize:'1.1rem'}}>📊</span>
          <div className="opt-name" style={{fontSize:'0.72rem'}}>Point Buy (27pt)</div>
        </div>
        <div className={`opt-card ${creation.diceSystem==='dice'?'selected':''}`} onClick={()=>switchSystem('dice')} style={{padding:'8px'}}>
          <span className="opt-icon" style={{fontSize:'1.1rem'}}>🎲</span>
          <div className="opt-name" style={{fontSize:'0.72rem'}}>
            {diceResult ? `Dadi (${diceResult.total}pt)` : 'Sistema Dadi'}
          </div>
        </div>
      </div>

      <div style={{flex:1,overflow:'hidden',background:'rgba(226,216,184,.82)',backdropFilter:'blur(8px)',border:'2px solid var(--earth-dark)',borderRadius:'2px',padding:'8px',marginBottom:'6px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px',fontSize:'0.7rem',fontFamily:'var(--font-serif)',color:'var(--text-muted)'}}>
          <span>Base · Bonus · Finale</span>
          <span style={{color:'var(--earth)',fontFamily:'var(--font-display)',fontSize:'0.85rem'}}>{remaining}/{availablePoints}pt</span>
        </div>
        {STAT_KEYS.map(key => {
          const base = creation.stats[key]
          const bonus = getRaceBonus(key)
          const finale = finalStats[key]
          return (
            <div key={key} style={{display:'flex',alignItems:'center',gap:'4px',marginBottom:'5px'}}>
              <div style={{fontFamily:'var(--font-serif)',fontSize:'0.62rem',color:'var(--text-muted)',width:'72px',flexShrink:0}}>{STAT_LABELS[key]}</div>
              <div style={{flex:1,height:'6px',background:'rgba(42,30,10,.1)',border:'1px solid var(--border-soft)',borderRadius:'1px',overflow:'hidden'}}>
                <div style={{height:'100%',width:((base-8)/7*100)+'%',background:'linear-gradient(90deg,var(--earth-dark),var(--earth-light))'}}/>
              </div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'0.75rem',color:'var(--earth)',width:'18px',textAlign:'center'}}>{base}</div>
              <div style={{fontSize:'0.6rem',color:'var(--earth-light)',width:'28px',textAlign:'center'}}>{bonus>0?'+'+bonus:bonus<0?bonus:'—'}</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'0.85rem',color:'var(--forest-dark)',width:'22px',textAlign:'center'}}>{finale}</div>
              <div style={{display:'flex',gap:'2px'}}>
                <button className="stat-btn" style={{width:'18px',height:'18px',fontSize:'0.75rem'}} onClick={()=>handleDecrease(key)} disabled={base<=STAT_MIN}>−</button>
                <button className="stat-btn" style={{width:'18px',height:'18px',fontSize:'0.75rem'}} onClick={()=>handleIncrease(key)} disabled={!canInc(key)}>+</button>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{flexShrink:0,display:'flex',gap:'8px',justifyContent:'center'}}>
        <button className="btn btn-sm" onClick={()=>setScreen('create-class')}><span>← Indietro</span></button>
        <button className="btn btn-primary btn-sm" onClick={()=>{
          if(creation.diceSystem==='dice'&&!diceResult){showToast('Tira i dadi prima!');return}
          setScreen('create-appearance')
        }}><span>Avanti →</span></button>
      </div>

      {showDiceModal&&<Modal onClose={()=>setShowDiceModal(false)}>
        <div style={{fontFamily:'var(--font-serif)',fontSize:'1rem',color:'var(--earth)',marginBottom:'10px'}}>🎲 I Dadi di Erthia</div>
        <p style={{fontSize:'0.82rem',color:'var(--text-muted)',marginBottom:'12px',lineHeight:1.5}}>
          Tre dadi speciali (valori 1-2-3). Totale: <strong>21 + somma</strong> (range 24-30).
        </p>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',margin:'12px 0'}}>
          {[0,1,2].map(i=>(
            <motion.div key={i} className="dice-face" animate={rolling?{rotate:[0,-15,10,0]}:{}} transition={{duration:0.5,delay:i*0.1}}>
              {diceResult?diceResult.dice[i]:'?'}
            </motion.div>
          ))}
        </div>
        {diceResult&&<div style={{textAlign:'center',marginBottom:'12px'}}>
          <div className="dice-total">{diceResult.total}</div>
          <div style={{fontSize:'0.75rem',color:'var(--text-muted)',fontFamily:'var(--font-serif)'}}>{diceResult.breakdown}</div>
        </div>}
        <button className="btn btn-primary btn-block" onClick={handleRoll} disabled={rolling} style={{marginBottom:'8px'}}>
          <span>{rolling?'Tirando...':(diceResult?'↺ Ritira':'🎲 Tira i Dadi')}</span>
        </button>
        {diceResult&&<button className="btn btn-block" onClick={()=>setShowDiceModal(false)}>
          <span>Conferma {diceResult.total} punti</span>
        </button>}
      </Modal>}
    </div>
  )
}
