import { useState } from 'react'
import './suites.css'

const CURB_FIELDS = [
  { id: 'confusion', label: 'Нарушение сознания (новое)' },
  { id: 'urea',      label: 'Мочевина > 7 ммоль/л' },
  { id: 'rr',        label: 'ЧДД ≥ 30 в мин.' },
  { id: 'bp',        label: 'АД сист. < 90 или диаст. ≤ 60' },
  { id: 'age',       label: 'Возраст ≥ 65 лет' },
]

function curbResult(score) {
  if (score <= 1) return { label: 'Низкий риск',     badge: 'badge-green',  advice: 'Амбулаторно. Летальность < 3%.' }
  if (score === 2) return { label: 'Умеренный риск', badge: 'badge-yellow', advice: 'Рассмотреть госпитализацию. Летальность ≈ 9%.' }
  return               { label: 'Высокий риск',     badge: 'badge-red',    advice: 'Госпитализация. При 4–5 — ОРИТ. Летальность 15–40%.' }
}

const CAT_ITEMS = [
  'Кашель (никогда → всегда)',
  'Мокрота (нет → полная грудь)',
  'Давление в груди (нет → очень сильное)',
  'Одышка при подъёме на 1 этаж (нет → очень выражена)',
  'Ограничение активности дома (нет → полное)',
  'Уверенность выходить из дома (спокоен → не выхожу)',
  'Сон (хороший → очень плохой)',
  'Энергия (много → нет совсем)',
]

function catCategory(score) {
  if (score <= 9)  return { label: 'Минимальное влияние ХОБЛ', badge: 'badge-green' }
  if (score <= 20) return { label: 'Умеренное влияние',         badge: 'badge-yellow' }
  if (score <= 30) return { label: 'Выраженное влияние',        badge: 'badge-red' }
  return                 { label: 'Очень выраженное',           badge: 'badge-red' }
}

const SPIRO_PATTERNS = [
  { pattern: 'Норма',           fev1fvc: '≥ 0.70', fev1: '≥ 80%', note: 'Нет нарушений' },
  { pattern: 'Обструкция',      fev1fvc: '< 0.70', fev1: 'Снижен', note: 'ХОБЛ, БА, бронхоэктазы' },
  { pattern: 'Рестрикция',      fev1fvc: '≥ 0.70', fev1: '< 80%, ФЖЕЛ < 80%', note: 'Фиброз, ожирение, плеврит' },
  { pattern: 'Смешанный',       fev1fvc: '< 0.70', fev1: 'Снижен, ФЖЕЛ < 80%', note: 'Бронхоэктазы + фиброз' },
]

export default function PulmonologySuite() {
  const [curb, setCurb]   = useState({ confusion: false, urea: false, rr: false, bp: false, age: false })
  const [catScores, setCat] = useState(Array(8).fill(2))

  const curbScore = Object.values(curb).filter(Boolean).length
  const curbRes   = curbResult(curbScore)
  const catTotal  = catScores.reduce((a, b) => a + b, 0)
  const catCat    = catCategory(catTotal)

  return (
    <div className="suite">

      {/* CURB-65 */}
      <div className="suite-card">
        <div className="suite-card-title">🤒 CURB-65 — тяжесть пневмонии</div>
        {CURB_FIELDS.map(f => (
          <button key={f.id} className="suite-toggle-row" onClick={() => setCurb(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
            <span className="suite-toggle-label">{f.label}</span>
            <div className={`suite-toggle ${curb[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
        ))}
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">CURB-65</div>
            <div className="suite-score-big" style={{ color: '#60A5FA' }}>{curbScore}</div>
          </div>
          <div style={{}}>
            <span className={`suite-risk-badge ${curbRes.badge}`}>{curbRes.label}</span>
            <div className="suite-advice">{curbRes.advice}</div>
          </div>
        </div>
      </div>

      {/* CAT */}
      <div className="suite-card">
        <div className="suite-card-title">📊 CAT Test — влияние ХОБЛ на жизнь (0–40 баллов)</div>
        {CAT_ITEMS.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <div className="suite-field">
              <label style={{ marginBottom: 6, display: 'block' }}>
                {idx + 1}. {item} — <b>{catScores[idx]}</b>
              </label>
              <input type="range" min={0} max={5} value={catScores[idx]}
                onChange={e => { const a = [...catScores]; a[idx] = parseInt(e.target.value); setCat(a) }}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                <span>0 — нет</span><span>5 — максимум</span>
              </div>
            </div>
          </div>
        ))}
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">Сумма CAT</div>
            <div className="suite-score-big" style={{ color: '#34D399' }}>{catTotal}</div>
          </div>
          <span className={`suite-risk-badge ${catCat.badge}`}>{catCat.label}</span>
        </div>
      </div>

      {/* Spirometry */}
      <div className="suite-card">
        <div className="suite-card-title">💨 Шпаргалка: интерпретация спирометрии</div>
        <table className="suite-table">
          <thead>
            <tr><th>Паттерн</th><th>ОФВ1/ФЖЕЛ</th><th>ОФВ1%</th><th>Примеры</th></tr>
          </thead>
          <tbody>
            {SPIRO_PATTERNS.map((r, i) => (
              <tr key={i}>
                <td className="col-time" style={{ minWidth: 80 }}>{r.pattern}</td>
                <td className="col-drug">{r.fev1fvc}</td>
                <td style={{ padding: '9px 8px 9px 0', color: 'var(--color-text)', fontSize: 12 }}>{r.fev1}</td>
                <td className="col-note">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
