import { useState, useEffect } from 'react'
import './suites.css'

const CURB_FIELDS = [
  { id: 'confusion', label: 'Нарушение сознания (новое)' },
  { id: 'urea',      label: 'Мочевина > 7 ммоль/л' },
  { id: 'rr',        label: 'ЧДД ≥ 30 в мин.' },
  { id: 'bp',        label: 'АД сист. < 90 или диаст. ≤ 60 мм рт.ст.' },
  { id: 'age',       label: 'Возраст ≥ 65 лет' },
]

function curbResult(score) {
  if (score <= 1) return { label: 'Низкий риск',     badge: 'badge-green',  advice: 'Амбулаторное лечение. Летальность ~1–2%.' }
  if (score === 2) return { label: 'Умеренный риск', badge: 'badge-yellow', advice: 'Рассмотреть кратковременную госпитализацию. Летальность ≈ 9%.' }
  return               { label: 'Высокий риск',     badge: 'badge-red',    advice: 'Госпитализация обязательна. При 4–5 — ОРИТ. Летальность ~22%.' }
}

function bmiCategory(bmi) {
  if (bmi < 16.0)  return { label: 'Тяжёлый дефицит массы', badge: 'badge-red' }
  if (bmi < 17.0)  return { label: 'Умеренный дефицит',     badge: 'badge-red' }
  if (bmi < 18.5)  return { label: 'Лёгкий дефицит',        badge: 'badge-yellow' }
  if (bmi < 25.0)  return { label: 'Норма',                  badge: 'badge-green' }
  if (bmi < 30.0)  return { label: 'Избыточная масса',       badge: 'badge-yellow' }
  if (bmi < 35.0)  return { label: 'Ожирение I ст.',         badge: 'badge-red' }
  if (bmi < 40.0)  return { label: 'Ожирение II ст.',        badge: 'badge-red' }
  return                  { label: 'Ожирение III ст. (морбидное)', badge: 'badge-red' }
}

const BP_CLASSES = [
  { name: 'Оптимальное',          sys: '< 120',   dia: '< 80',    color: '#34D399' },
  { name: 'Нормальное',           sys: '120–129', dia: '80–84',   color: '#34D399' },
  { name: 'Высокое нормальное',   sys: '130–139', dia: '85–89',   color: '#FBBF24' },
  { name: 'АГ 1 степени',         sys: '140–159', dia: '90–99',   color: '#FB923C' },
  { name: 'АГ 2 степени',         sys: '160–179', dia: '100–109', color: '#F87171' },
  { name: 'АГ 3 степени',         sys: '≥ 180',   dia: '≥ 110',  color: '#EF4444' },
]

export default function TherapistSuite({ specialty }) {
  const titleSuffix = specialty === 'Семейный врач' ? 'семейного врача' : 'терапевта'
  const [curb, setCurb]   = useState({ confusion: false, urea: false, rr: false, bp: false, age: false })
  const [weight, setWeight] = useState(75)
  const [height, setHeight] = useState(170)

  const curbScore = Object.values(curb).filter(Boolean).length
  const curbRes   = curbResult(curbScore)

  const bmiVal  = height > 0 ? parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)) : 0
  const bmiCat  = bmiVal > 0 ? bmiCategory(bmiVal) : null

  return (
    <div className="suite">

      {/* CURB-65 */}
      <div className="suite-card">
        <div className="suite-card-title">
          <span>🫁 CURB-65 — тяжесть пневмонии</span>
          <button className="suite-reset-btn" onClick={() => setCurb({ confusion:false, urea:false, rr:false, bp:false, age:false })}>Сбросить</button>
        </div>
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

      {/* BMI */}
      <div className="suite-card">
        <div className="suite-card-title">⚖️ Индекс массы тела (ИМТ)</div>
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
        </div>
        {bmiVal > 0 && (
          <div className="suite-result-banner">
            <div>
              <div className="suite-score-label">ИМТ (кг/м²)</div>
              <div className="suite-score-big" style={{ color: '#A78BFA' }}>{bmiVal}</div>
            </div>
            <span className={`suite-risk-badge ${bmiCat.badge}`}>{bmiCat.label}</span>
          </div>
        )}
      </div>

      {/* BP classes */}
      <div className="suite-card">
        <div className="suite-card-title">💓 Классификация АД (ЕОК 2023)</div>
        <div className="suite-cheatsheet">
          <div className="suite-cheatsheet-title">Категории артериального давления (мм рт.ст.)</div>
          {BP_CLASSES.map((bp, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < BP_CLASSES.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>{bp.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: bp.color, textAlign: 'right' }}>{bp.sys} / {bp.dia}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
