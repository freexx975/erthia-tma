import { useState } from 'react'
import { useAppStore } from '../../stores/appStore'
import { enabledRaces } from '../../data/races'
import type { Race } from '../../types'
import StepHeader from '../../components/StepHeader'
import { showToast } from '../../components/Toast'

function Modal({children,onClose}:{children:React.ReactNode,onClose:()=>void}) {
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:200,background:'rgba(42,30,10,.8)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'var(--parchment)',border:'2px solid var(--earth-dark)',borderRadius:'3px',padding:'18px',width:'100%',maxWidth:'380px',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:'8px',right:'10px',background:'none',border:'none',fontSize:'1.2rem',color:'var(--earth)',cursor:'pointer'}}>✕</button>
        {children}
      </div>
    </div>
  )
}

export default function CreateRaceScreen() {
  const { creation, setRace, setScreen } = useAppStore()
  const [modal, setModal] = useState<Race | null>(null)

  return (
    <div style={{height:'100dvh',display:'flex',flexDirection:'column',overflow:'hidden',position:'fixed',inset:0,padding:'8px',paddingTop:'calc(8px + env(safe-area-inset-top))',paddingBottom:'calc(8px + env(safe-area-inset-bottom))'}}>
      <div style={{flexShrink:0}}><StepHeader currentStep={1} totalSteps={5} title="Scegli la Razza" /></div>
      <div style={{flex:1,overflow:'hidden',background:'rgba(226,216,184,.82)',backdropFilter:'blur(8px)',border:'2px solid var(--earth-dark)',borderRadius:'2px',padding:'10px',marginBottom:'8px'}}>
        <div className="panel-title">✦ Popoli di Erthia</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gridTemplateRows:'repeat(3,1fr)',gap:'5px',height:'calc(100% - 28px)'}}>
          {enabledRaces.map(race => (
            <div key={race.id} onClick={()=>{setRace(race);setModal(race)}}
              style={{background:creation.race?.id===race.id?'rgba(196,151,58,.3)':'rgba(248,245,236,.9)',border:creation.race?.id===race.id?'2px solid var(--earth-light)':'2px solid var(--earth-dark)',borderRadius:'2px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',padding:'4px'}}>
              <div style={{fontSize:'1.3rem',lineHeight:1}}>{race.icon}</div>
              <div style={{fontFamily:'var(--font-serif)',fontSize:'0.6rem',color:'var(--ink)',marginTop:'2px',textAlign:'center',lineHeight:1.1}}>{race.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{flexShrink:0,display:'flex',gap:'8px',justifyContent:'center'}}>
        <button className="btn btn-sm" onClick={()=>setScreen('title')}><span>← Indietro</span></button>
        <button className="btn btn-primary btn-sm" onClick={()=>{if(!creation.race){showToast('Scegli una razza');return}setScreen('create-class')}}><span>Avanti →</span></button>
      </div>
      {modal&&<Modal onClose={()=>setModal(null)}>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',color:'var(--earth)',marginBottom:'8px'}}>{modal.icon} {modal.name}</div>
        <p style={{fontSize:'0.85rem',color:'var(--text-muted)',lineHeight:1.6,marginBottom:'8px'}}>{modal.description}</p>
        <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:'12px'}}>
          <strong style={{color:'var(--earth)'}}>Bonus:</strong>{' '}
          {Object.entries(modal.statBonus).filter(([k])=>k!=='any2').map(([k,v])=>`${k} +${v}`).join(', ')}
          {modal.statBonus.any2?' · +1 a due stat':''}
        </div>
        <button className="btn btn-primary btn-block" onClick={()=>setModal(null)}><span>Conferma {modal.name}</span></button>
      </Modal>}
    </div>
  )
}
