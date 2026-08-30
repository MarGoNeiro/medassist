import { useState, useEffect } from 'react'
import './suites.css'

const ECOG = [
  { score: 0, label: 'Полностью активен',       desc: 'Без ограничений. Деятельность как до болезни.' },
  { score: 1, label: 'Ограничена тяж. нагрузка', desc: 'Амбулаторно. Лёгкая работа.' },
  { score: 2, label: 'Амбулаторно > 50% дня',   desc: 'Обслуживает себя сам. Не работает.' },
  { score: 3, label: 'Ограниченный самоуход',    desc: 'В постели > 50% дня.' },
  { score: 4, label: 'Прикован к постели',       desc: 'Не способен к самообслуживанию.' },
  { score: 5, label: 'Смерть',                   desc: '' },
]

function ecogColor(score) {
  if (score <= 1) return '#34D399'
  if (score <= 2) return '#FBBF24'
  if (score <= 3) return '#FB923C'
  return '#F87171'
}

export default function OncologySuite() {
  const [weight, setWeight]   = useState(70)
  const [height, setHeight]   = useState(170)
  const [dose,   setDose]     = useState(75)
  const [ecog,   setEcog]     = useState(0)

  const bsa = height > 0 && weight > 0
    ? parseFloat(Math.sqrt((height * weight) / 3600).toFixed(2))
    : 0
  const totalDose = bsa > 0 ? parseFloat((dose * bsa).toFixed(0)) : 0

  const ecogInfo = ECOG[ecog]

  const NAUSEA_PROTOCOLS = [
    { risk: 'Высокий (цисплатин, антрациклины)', protocol: 'Апрепитант + 5-HT3 + дексаметазон' },
    { risk: 'Умеренный (карбоплатин, оксалиплатин)', protocol: '5-HT3 антагонист + дексаметазон ± апрепитант' },
    { risk: 'Низкий (таксаны, гемцитабин)', protocol: 'Дексаметазон 8 мг однократно' },
    { risk: 'Минимальный (винорельбин, блеомицин)', protocol: 'Профилактика не показана' },
  ]

  return (
    <div className="suite">

      <div className="suite-three-col">

      {/* BSA */}
      <div className="suite-card">
        <div className="suite-card-title">💉 Расчёт дозы химиопрепарата через BSA</div>
        <div className="suite-grid">
          <div className="suite-field">
            <label>Вес (кг)</label>
            <input className="suite-input" type="number" step="0.5" value={weight}
              onChange={e => setWeight(Math.max(1, parseFloat(e.target.value) || 0))} />
          </div>
          <div className="suite-field">
            <label>Рост (см)</label>
            <input className="suite-input" type="number" value={height}
              onChange={e => setHeight(Math.max(1, parseInt(e.target.value) || 0))} />
          </div>
          <div className="suite-field" style={{ gridColumn: 'span 2' }}>
            <label>Целевая доза препарата (мг/м²)</label>
            <input className="suite-input" type="number" step="5" value={dose}
              onChange={e => setDose(Math.max(1, parseFloat(e.target.value) || 75))} />
          </div>
        </div>
        <div style={{ marginTop: 14, borderTop: '3px solid #22C55E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>BSA (Мостеллер)</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{bsa} м²</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Абсолютная доза</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#34D399' }}>{totalDose} мг</span>
          </div>
        </div>
      </div>

      {/* Antiemetics */}
      <div className="suite-card">
        <div className="suite-card-title">🤢 Противорвотная профилактика (ASCO/NCCN)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NAUSEA_PROTOCOLS.map((p, i) => (
            <div key={i} style={{ padding: '8px 10px', background: 'var(--color-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 3 }}>{p.risk}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text)', fontWeight: 600 }}>{p.protocol}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ECOG */}
      <div className="suite-card">
        <div className="suite-card-title">🏃 Шкала ECOG — статус работоспособности</div>
        <div className="suite-field">
          <label>Статус ECOG</label>
          <select className="suite-select" value={ecog} onChange={e => setEcog(parseInt(e.target.value))}>
            {ECOG.map(e => <option key={e.score} value={e.score}>ECOG {e.score} — {e.label}</option>)}
          </select>
        </div>
        <div style={{ marginTop: 14, borderTop: `3px solid ${ecogColor(ecog)}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>ECOG статус</span>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: ecogColor(ecog) }}>{ecog}</span>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{ecogInfo.label}</div>
            </div>
          </div>
          {ecogInfo.desc && (
            <div style={{ padding: '9px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {ecogInfo.desc}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '9px 0' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Тактика ХТ</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'right', maxWidth: 200 }}>
              {ecog <= 2 ? 'Стандартная ХТ. Хороший прогноз переносимости.' :
               ecog === 3 ? 'Редуцированные дозы. ХТ с осторожностью.' :
               'ХТ, как правило, не показана. Паллиативная помощь.'}
            </span>
          </div>
        </div>
      </div>

      </div>{/* /suite-three-col */}
    </div>
  )
}
