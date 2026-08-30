import { useState } from 'react'
import './suites.css'

const AGE_GROUPS = [
  { label: '< 15 лет',  score: 1  },
  { label: '15–44 лет', score: 0  },
  { label: '≥ 45 лет',  score: -1 },
]

const MC_ITEMS = [
  { id: 'temp',    label: 'Температура ≥ 38°C' },
  { id: 'cough',   label: 'Отсутствие кашля' },
  { id: 'nodes',   label: 'Увеличение передних шейных лимфоузлов' },
  { id: 'exudate', label: 'Налёты или экссудат на миндалинах' },
]

function mcResult(score) {
  if (score <= 0) return { label: 'Антибиотики не показаны', badge: 'badge-green',  pct: '< 2% БГСА',   advice: 'Вероятна вирусная этиология. Симптоматическое лечение, наблюдение.' }
  if (score === 1) return { label: 'Антибиотики не показаны', badge: 'badge-green',  pct: '5–10% БГСА',  advice: 'Вероятность стрептококка низкая. Симптоматическое лечение.' }
  if (score <= 3) return { label: 'Экспресс-тест на БГСА',   badge: 'badge-yellow', pct: '11–35% БГСА',  advice: 'При положительном тесте — амоксициллин 500 мг × 3 р/сут × 10 дней. При аллергии — азитромицин 500 мг × 1 р/сут × 5 дней.' }
  return            { label: 'Антибиотики показаны',         badge: 'badge-red',    pct: '> 50% БГСА',   advice: 'Амоксициллин 500 мг × 3 р/сут × 10 дней. При аллергии на пенициллины — азитромицин 500 мг × 1 р/сут × 5 дней.' }
}

const HEARING_LEVELS = [
  { degree: 'Норма',       db: '≤ 25',  badge: 'badge-green',  desc: 'Нарушений восприятия речи нет' },
  { degree: 'I степень',   db: '26–40', badge: 'badge-green',  desc: 'Трудности при тихой беседе' },
  { degree: 'II степень',  db: '41–60', badge: 'badge-yellow', desc: 'Трудности даже в тихой обстановке' },
  { degree: 'III степень', db: '61–80', badge: 'badge-yellow', desc: 'Слышат только громкие слова вблизи' },
  { degree: 'IV степень',  db: '81–94', badge: 'badge-red',    desc: 'Слышат лишь очень громкие звуки' },
  { degree: 'Глухота',     db: '≥ 95',  badge: 'badge-red',    desc: 'Полная потеря слуха' },
]

export default function ENTSuite() {
  const [ageIdx, setAgeIdx] = useState(1)
  const [items, setItems]   = useState({ temp: false, cough: false, nodes: false, exudate: false })

  const toggle = id => setItems(prev => ({ ...prev, [id]: !prev[id] }))
  const score  = AGE_GROUPS[ageIdx].score + Object.values(items).filter(Boolean).length
  const res    = mcResult(score)

  return (
    <div className="suite">

      <div className="nephr-two-col">

        {/* McIsaac */}
        <div className="suite-card">
          <div className="suite-card-title">🦠 Шкала Мак-Айзека — показания к антибиотикам при тонзиллофарингите</div>
          <div className="suite-field">
            <label>Возраст</label>
            <select className="suite-select" value={ageIdx} onChange={e => setAgeIdx(parseInt(e.target.value))}>
              {AGE_GROUPS.map((g, i) => (
                <option key={i} value={i}>{g.label} ({g.score > 0 ? '+' : ''}{g.score})</option>
              ))}
            </select>
          </div>
          {MC_ITEMS.map(item => (
            <button key={item.id} className={`suite-toggle-row ${items[item.id] ? 'active' : ''}`}
              onClick={() => toggle(item.id)}>
              <span className="suite-toggle-label">{item.label}</span>
              <span className="suite-toggle-check">{items[item.id] ? '✓' : ''}</span>
            </button>
          ))}
          <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div className="suite-score-label">Мак-Айзека</div>
              <div className="suite-score-big" style={{ color: '#60A5FA' }}>{score}</div>
            </div>
            <div>
              <span className={`suite-risk-badge ${res.badge}`} style={{ fontSize: 11, padding: '3px 10px' }}>{res.label} · {res.pct}</span>
              <div className="suite-advice" style={{ fontSize: 13 }}>{res.advice}</div>
            </div>
          </div>
        </div>

        {/* Hearing loss */}
        <div className="suite-card">
          <div className="suite-card-title">👂 Степени тугоухости (ВОЗ) — средний порог 500–4000 Гц</div>
          {HEARING_LEVELS.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < HEARING_LEVELS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', minWidth: 100 }}>{h.degree}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text-secondary)', minWidth: 56 }}>{h.db} дБ</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{h.desc}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
