import { useAppStore } from '../../stores/appStore'
import StepHeader from '../../components/StepHeader'
import { showToast } from '../../components/Toast'

const HAIR_COLORS = ['#2C1F0E','#8B4513','#C4973A','#F5DEB3','#E8C97A','#D2691E','#1C1C1C','#808080']
const EYE_COLORS  = ['#2C4A6E','#2D6A2D','#8B6914','#4A4A4A','#8B4513','#6B5B8A','#1E4D8C','#C4973A']
const SKIN_TONES  = ['#FDEBD0','#F5CBA7','#E59866','#CA6F1E','#A04000','#784212','#5D4037','#3E2723']

export default function CreateAppearanceScreen() {
  const { creation, setName, setAppearance, setScreen } = useAppStore()
  const { appearance } = creation

  return (
    <div style={{height:'100dvh',display:'flex',flexDirection:'column',overflow:'hidden',position:'fixed',inset:0,padding:'8px',paddingTop:'calc(8px + env(safe-area-inset-top))',paddingBottom:'calc(8px + env(safe-area-inset-bottom))'}}>
      <div style={{flexShrink:0}}><StepHeader currentStep={4} totalSteps={5} title="Aspetto e Nome" /></div>

      <div style={{flex:1,overflow:'hidden',background:'rgba(226,216,184,.82)',backdropFilter:'blur(8px)',border:'2px solid var(--earth-dark)',borderRadius:'2px',padding:'10px',marginBottom:'8px',overflowY:'auto'}}>

        <div style={{marginBottom:'8px'}}>
          <div style={{fontFamily:'var(--font-serif)',fontSize:'0.7rem',color:'var(--text-muted)',marginBottom:'4px'}}>Nome del Personaggio</div>
          <input className="input" placeholder="Come ti chiami?" maxLength={28} value={creation.name} onChange={e=>setName(e.target.value)} style={{fontSize:'0.9rem',padding:'8px 12px'}}/>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginBottom:'8px'}}>
          {[
            {label:'Sesso',key:'sex',opts:[['male','Maschile'],['female','Femminile'],['androgynous','Androgino']]},
            {label:'Corporatura',key:'build',opts:[['athletic','Atletica'],['muscular','Robusta'],['slender','Snella'],['stocky','Massiccia']]},
            {label:'Capelli',key:'hairStyle',opts:[['short','Corti'],['medium','Medi'],['long','Lunghi'],['shaved','Rasati'],['tied','Raccolti']]},
            {label:'Sopracciglia',key:'eyebrows',opts:[['regular','Regolari'],['thick','Folte'],['arched','Arcuate'],['thin','Sottili']]},
            {label:'Naso',key:'nose',opts:[['straight','Dritto'],['aquiline','Aquilino'],['snub','Camuso'],['broad','Largo']]},
            {label:'Peli facciali',key:'facialHair',opts:[['none','Nessuno'],['stubble','Barba corta'],['beard','Barba lunga'],['mustache','Baffi']]},
          ].map(({label,key,opts})=>(
            <div key={key}>
              <div style={{fontFamily:'var(--font-serif)',fontSize:'0.65rem',color:'var(--text-muted)',marginBottom:'3px'}}>{label}</div>
              <select className="select" style={{fontSize:'0.8rem',padding:'5px 24px 5px 8px'}}
                value={(appearance as any)[key]}
                onChange={e=>setAppearance({[key]:e.target.value})}>
                {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{marginBottom:'6px'}}>
          <div style={{fontFamily:'var(--font-serif)',fontSize:'0.65rem',color:'var(--text-muted)',marginBottom:'4px'}}>Colore capelli</div>
          <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
            {HAIR_COLORS.map(c=><div key={c} onClick={()=>setAppearance({hairColor:c})} style={{width:'22px',height:'22px',borderRadius:'50%',background:c,border:appearance.hairColor===c?'3px solid var(--earth-light)':'3px solid transparent',cursor:'pointer',transform:appearance.hairColor===c?'scale(1.2)':'scale(1)'}}/>)}
          </div>
        </div>
        <div style={{marginBottom:'6px'}}>
          <div style={{fontFamily:'var(--font-serif)',fontSize:'0.65rem',color:'var(--text-muted)',marginBottom:'4px'}}>Colore occhi</div>
          <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
            {EYE_COLORS.map(c=><div key={c} onClick={()=>setAppearance({eyeColor:c})} style={{width:'22px',height:'22px',borderRadius:'50%',background:c,border:appearance.eyeColor===c?'3px solid var(--earth-light)':'3px solid transparent',cursor:'pointer',transform:appearance.eyeColor===c?'scale(1.2)':'scale(1)'}}/>)}
          </div>
        </div>
        <div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:'0.65rem',color:'var(--text-muted)',marginBottom:'4px'}}>Carnagione</div>
          <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
            {SKIN_TONES.map(c=><div key={c} onClick={()=>setAppearance({skinTone:c})} style={{width:'22px',height:'22px',borderRadius:'50%',background:c,border:appearance.skinTone===c?'3px solid var(--earth-light)':'3px solid transparent',cursor:'pointer',transform:appearance.skinTone===c?'scale(1.2)':'scale(1)'}}/>)}
          </div>
        </div>
      </div>

      <div style={{flexShrink:0,display:'flex',gap:'8px',justifyContent:'center'}}>
        <button className="btn btn-sm" onClick={()=>setScreen('create-stats')}><span>← Indietro</span></button>
        <button className="btn btn-primary btn-sm" onClick={()=>{if(!creation.name.trim()){showToast('Inserisci un nome');return}setScreen('create-preview')}}><span>Avanti →</span></button>
      </div>
    </div>
  )
}
