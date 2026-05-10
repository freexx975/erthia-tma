import { useState } from 'react'
import { useAppStore } from '../stores/appStore'
import { showToast } from '../components/Toast'
import {
  STAT_KEYS, STAT_LABELS, getModifierStr,
  RARITY_LABELS, RARITY_COLORS, getNFTRarity,
} from '../utils/game'
import type { AppScreen } from '../types'

type TabId = 'quests' | 'abilities' | 'spells' | 'inventory' | 'info' | 'nft'

export default function HubScreen() {
  const { character, tasks, completeTask, setScreen, screen, mintNFT } = useAppStore()
  const [activeTab, setActiveTab] = useState<TabId>('quests')

  if (!character) {
    setScreen('title')
    return null
  }

  const rarity = getNFTRarity(27) // TODO: salvare punti totali nel character
  const hpPct = (character.hp / character.maxHp) * 100
  const mpPct = character.maxMp > 0 ? (character.mp / character.maxMp) * 100 : 0
  const xpPct = (character.xp / character.xpNext) * 100
  const dailyCoins = tasks.filter(t => t.completed).reduce((a, t) => a + t.reward, 0)

  const TABS: { id: TabId; icon: string; label: string }[] = [
    { id: 'quests',    icon: '📜', label: 'Quest' },
    { id: 'abilities', icon: '⚔',  label: 'Abilità' },
    { id: 'spells',    icon: '✨',  label: 'Magie' },
    { id: 'inventory', icon: '🎒', label: 'Inv.' },
    { id: 'info',      icon: '📖', label: 'Info' },
    { id: 'nft',       icon: '⬡',  label: 'NFT' },
  ]

  return (
    <div>
      {/* SCHEDA PERSONAGGIO */}
      <div style={{
        background: 'var(--parchment)',
        border: '2px solid var(--earth-dark)',
        borderRadius: '3px',
        overflow: 'hidden',
        boxShadow: '3px 3px 12px rgba(44,31,14,.18)',
        position: 'relative',
        marginBottom: '10px',
      }}>
        {/* Inner border decoration */}
        <div style={{
          position: 'absolute', inset: '5px',
          border: '1px solid rgba(139,105,20,.25)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--earth-dark), var(--earth))',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              color: 'var(--gold-light)',
              textShadow: '1px 1px 2px rgba(0,0,0,.4)',
            }}>
              {character.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '0.75rem',
              color: 'rgba(240,237,224,.7)',
              marginTop: '1px',
            }}>
              {character.race.name} · {character.charClass.name} {character.charClass.icon}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.7rem',
            color: 'var(--cloud-dark)',
            background: 'rgba(0,0,0,.2)',
            border: '1px solid var(--gold)',
            padding: '2px 8px',
            borderRadius: '2px',
          }}>
            Liv. {character.level}
          </div>
        </div>

        {/* Portrait */}
        <div className="portrait-zone" style={{ height: 160 }}>
          <div style={{ textAlign: 'center', color: 'rgba(30,77,140,.5)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '4px' }}>{character.charClass.icon}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.72rem' }}>
              {character.name} di Erthia
            </div>
          </div>
          <div className="portrait-corner tl" />
          <div className="portrait-corner tr" />
          <div className="portrait-corner bl" />
          <div className="portrait-corner br" />
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          background: 'rgba(44,31,14,.04)',
          borderBottom: '1px solid rgba(139,105,20,.2)',
        }}>
          {STAT_KEYS.map((key, i) => (
            <div key={key} style={{
              padding: '6px 4px',
              textAlign: 'center',
              borderRight: i < 5 ? '1px solid rgba(139,105,20,.15)' : 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {key}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--earth)', lineHeight: 1.1 }}>
                {character.finalStats[key]}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                {getModifierStr(character.finalStats[key])}
              </div>
            </div>
          ))}
        </div>

        {/* HP / MP bars */}
        <div style={{ padding: '8px 14px' }}>
          <BarRow label="Vita" value={character.hp} max={character.maxHp} pct={hpPct} cls="bar-hp" />
          <BarRow label="Mana" value={character.mp} max={character.maxMp} pct={mpPct} cls="bar-mp" />
        </div>

        {/* XP bar */}
        <div style={{ padding: '0 14px 2px' }}>
          <div className="bar-wrap" style={{ height: 4 }}>
            <div className="bar-fill bar-xp" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '3px 14px 8px',
          fontFamily: 'var(--font-serif)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
        }}>
          <span>EXP: {character.xp}/{character.xpNext}</span>
          <span>🪙 {character.fakeCoins + dailyCoins} Erthia Coin</span>
        </div>

        {/* Tab navigation */}
        <div className="sheet-actions">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`action-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'quests' && (
        <div className="panel">
          <div className="panel-title">📜 Quest Giornaliere</div>
          <div className="coin-display">
            <span style={{ fontSize: '1rem' }}>🪙</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Erthia Coin guadagnati oggi
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              color: 'var(--gold)',
              marginLeft: 'auto',
            }}>
              +{dailyCoins}
            </span>
          </div>
          {tasks.map(task => (
            <div key={task.id} className="task-row">
              <div
                className={`task-check ${task.completed ? 'done' : ''}`}
                onClick={() => {
                  if (!task.completed) {
                    completeTask(task.id)
                    showToast(`+${task.reward} Erthia Coin!`)
                  }
                }}
              >
                {task.completed ? '✓' : ''}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--ink)',
                flex: 1,
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1,
              }}>
                {task.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                color: 'var(--gold)',
                flexShrink: 0,
              }}>
                +{task.reward}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'abilities' && (
        <div className="panel">
          <div className="panel-title">⚔ Abilità di Classe</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '10px' }}>
            Abilità disponibili al Livello 1
          </div>
          {character.charClass.startingAbilities.map(ab => (
            <div key={ab} style={{
              padding: '7px 0',
              borderBottom: '1px solid rgba(139,105,20,.15)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
            }}>
              <strong style={{ color: 'var(--earth)' }}>{ab}</strong>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'spells' && (
        <div className="panel">
          <div className="panel-title">✨ Magie e Incantesimi</div>
          {character.charClass.spellcaster ? (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {character.charClass.name} è un incantatore. Gli incantesimi si sbloccano progredendo di livello.
            </div>
          ) : (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {character.charClass.name} non è un incantatore. Nessun incantesimo disponibile.
            </div>
          )}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="panel">
          <div className="panel-title">🎒 Inventario</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Il tuo zaino è vuoto. Esplora il mondo per trovare oggetti ed equipaggiamento.
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '12px', fontFamily: 'var(--font-serif)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>🪙 Gold: {character.gold}</span>
            <span>🥈 Argento: {character.silver}</span>
            <span>🪙 Bronzo: {character.bronze}</span>
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div className="panel">
          <div className="panel-title">📖 Scheda Completa</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 2, color: 'var(--ink)' }}>
            <div><strong style={{ color: 'var(--earth)' }}>Razza:</strong> {character.race.name}</div>
            <div><strong style={{ color: 'var(--earth)' }}>Classe:</strong> {character.charClass.name}</div>
            <div><strong style={{ color: 'var(--earth)' }}>Livello:</strong> {character.level}</div>
            <div><strong style={{ color: 'var(--earth)' }}>HP:</strong> {character.hp}/{character.maxHp}</div>
            <div><strong style={{ color: 'var(--earth)' }}>CA:</strong> {character.ac}</div>
            <div className="gold-divider" />
            {STAT_KEYS.map(key => (
              <div key={key}>
                <strong style={{ color: 'var(--earth)' }}>{STAT_LABELS[key]}:</strong>{' '}
                {character.finalStats[key]} ({getModifierStr(character.finalStats[key])})
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'nft' && (
        <div className="panel">
          <div className="panel-title">⬡ NFT Personaggio</div>
          {character.nftMinted ? (
            <div>
              <div className="info-box" style={{ marginBottom: '10px' }}>
                Il tuo personaggio è un NFT unico sulla blockchain TON. Puoi trasferirlo,
                venderlo o usarlo come credenziale in Erthia.
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(45,106,45,.1)',
                  border: '1px solid var(--forest)',
                  borderRadius: '2px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  color: 'var(--forest)',
                  fontFamily: 'var(--font-serif)',
                }}>
                  ✓ Mintato
                </span>
                <span style={{
                  background: 'rgba(30,77,140,.1)',
                  border: '1px solid var(--sea)',
                  borderRadius: '2px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  color: 'var(--sea)',
                  fontFamily: 'var(--font-serif)',
                }}>
                  TON Blockchain
                </span>
                <span className="rarity-tag" style={{ color: RARITY_COLORS[rarity], borderColor: RARITY_COLORS[rarity] }}>
                  {RARITY_LABELS[rarity]}
                </span>
              </div>
              {character.nftAddress && (
                <div style={{ marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  {character.nftAddress}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="info-box" style={{ marginBottom: '10px' }}>
                Il tuo personaggio non è ancora stato mintato come NFT. Connetti il tuo wallet TON per procedere.
              </div>
              <button className="btn btn-primary btn-block" onClick={() => {
                mintNFT()
                showToast('✦ NFT mintato! (demo)')
              }}>
                <span>⬡ Minta NFT su TON</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="nav-row" style={{ marginTop: '8px' }}>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => {
            if (confirm('Vuoi creare un nuovo personaggio?')) {
              setScreen('create-race')
            }
          }}
        >
          <span>Nuovo personaggio</span>
        </button>
      </div>
    </div>
  )
}

function BarRow({ label, value, max, pct, cls }: {
  label: string
  value: number
  max: number
  pct: number
  cls: string
}) {
  return (
    <div style={{ marginBottom: '6px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-serif)',
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '3px',
      }}>
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="bar-wrap">
        <div className={`bar-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
