import { useEffect, useState } from 'react'
import { useAppStore } from '../../stores/appStore'
import StepHeader from '../../components/StepHeader'
import { showToast } from '../../components/Toast'
import { computeFinalStats, computeMaxHp, computeMaxMp, computeAC, getModifierStr, STAT_KEYS, STAT_LABELS, getNFTRarity, RARITY_LABELS, RARITY_COLORS } from '../../utils/game'
import { generateCharacterImageUrl } from '../../utils/imageGen'

export default function CreatePreviewScreen() {
  const { creation, confirmCreation, setImageUrl, imageUrl, setScreen } = useAppStore()
  const [regenLeft, setRegenLeft] = useState(10)
  const [minting, setMinting] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  if (!creation.race || !creation.charClass) { setScreen('create-race'); return null }

  const finalStats = computeFinalStats(creation.stats, creation.race)
  const maxHp = computeMaxHp(creation.charClass, finalStats)
  const maxMp = computeMaxMp(creation.charClass, finalStats)
  const ac = computeAC(finalStats)
  const rarity = getNFTRarity(creation.diceSystem==='dice'&&creation.diceResult?creation.diceResult.total:27)

  useEffect(() => {
    if (!imageUrl) {
      setImageUrl(generateCharacterImageUrl(creation.race!, creation.charClass!, creation.appearance))
      setImgLoaded(false)
    }
  }, [])

  const handleRegenerate = () => {
    if (regenLeft<=0){showToast('Rigenerazioni esaurite!');return}
    setRegenLeft(r=>r-1)
    setImgLoaded(false)
    setImageUrl(generateCharacterImageUrl(creation.race!, creation.charClass!, creation.appearance))
  }

  const handleMint = async () => {
    if (!creation.name.trim()){showToast('Inserisci un nome!');return}
    setMinting(true)
    await new Promise(r=>setTimeout(r,1500))
    confirmCreation()
    showToast('✦ Personaggio creato!')
    setMinting(false)
  }

  return (
    <div style={{height:'100dvh',display:'flex',flexDirection:'column',overflow:'hidden',position:'fixed',inset:0,padding:'8px',paddingTop:'calc(8px + env(safe-area-inset-top))',paddingBottom:'calc(8px + env(safe-area-inset-bottom))'}}>
      <div style={{flexShrink:0}}><StepHeader currentStep={5} totalSteps={5} title="Il Tuo Personaggio" /></div>

      {/* Intestazione */}
      <div style={{flexShrink:0,textAlign:'center',marginBottom:'6px'}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',color:'var(--snow)',textShadow:'1px 1px 4px rgba(0,0,0,.6)'}}>{creation.name}</div>
        <div style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:'0.75rem',color:'rgba(240,237,224,.8)'}}>{creation.race.name} · {creation.charClass.name}</div>
        <span className="rarity-tag" style={{color:RARITY_COLORS[rarity],borderColor:RARITY_COLORS[rarity],fontSize:'0.65rem'}}>{RARITY_LABELS[rarity]}</span>
      </div>

      {/* Ritratto */}
      <div style={{flex:1,position:'relative',overflow:'hidden',border:'2px solid var(--earth-dark)',borderRadius:'2px',marginBottom:'6px'}}>
        {imageUrl&&<img src={imageUrl} alt={creation.name} onLoad={()=>setImgLoaded(true)} style={{width:'100%',height:'100%',objectFit:'cover',display:imgLoaded?'block':'none'}}/>}
        {!imgLoaded&&<div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(160deg,var(--sky-light),var(--sky))'}}>
          <div style={{fontSize:'3rem'}}>{creation.charClass.icon}</div>
          <div style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:'0.75rem',color:'rgba(30,77,140,.6)',marginTop:'6px'}}>Caricamento ritratto...</div>
        </div>}
        <div className="portrait-corner tl"/><div className="portrait-corner tr"/>
        <div className="portrait-corner bl"/><div className="portrait-corner br"/>
      </div>

      {/* Stats compatte */}
      <div style={{flexShrink:0,display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'3px',marginBottom:'6px'}}>
        {STAT_KEYS.map(key=>(
          <div key={key} style={{background:'rgba(226,216,184,.85)',border:'1px solid var(--earth-dark)',padding:'3px 2px',textAlign:'center',borderRadius:'2px'}}>
            <div style={{fontFamily:'var(--font-serif)',fontSize:'0.5rem',color:'var(--text-muted)',textTransform:'uppercase'}}>{key}</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'0.85rem',color:'var(--earth)'}}>{finalStats[key]}</div>
            <div style={{fontSize:'0.5rem',color:'var(--text-muted)'}}>{getModifierStr(finalStats[key])}</div>
          </div>
        ))}
      </div>

      {/* Info + bottoni */}
      <div style={{flexShrink:0,display:'flex',gap:'4px',justifyContent:'center',marginBottom:'6px',fontSize:'0.72rem',color:'rgba(240,237,224,.8)',fontFamily:'var(--font-serif)'}}>
        <span>❤ {maxHp}</span><span>·</span><span>✨ {maxMp}</span><span>·</span><span>🛡 {ac}</span>
      </div>

      <div style={{flexShrink:0,display:'flex',gap:'6px',justifyContent:'center'}}>
        <button className="btn btn-sm" onClick={()=>setScreen('create-appearance')}><span>← Modifica</span></button>
        <button className="btn btn-sm" onClick={handleRegenerate} disabled={regenLeft<=0}><span>↺ ({regenLeft})</span></button>
        <button className="btn btn-primary btn-sm" onClick={handleMint} disabled={minting}><span>{minting?'...':'⬡ Minta NFT'}</span></button>
      </div>
    </div>
  )
}
