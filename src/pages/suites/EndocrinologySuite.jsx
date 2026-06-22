import { useState } from 'react'
import './suites.css'

function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Дефицит массы тела', badge: 'badge-yellow' }
  if (bmi < 25.0) return { label: 'Норма',               badge: 'badge-green' }
  if (bmi < 30.0) return { label: 'Избыточная масса',    badge: 'badge-yellow' }
  if (bmi < 35.0) return { label: 'Ожирение I',          badge: 'badge-red' }
  if (bmi < 40.0) return { label: 'Ожирение II',         badge: 'badge-red' }
  return                 { label: 'Ожирение III (морбидное)', badge: 'badge-red' }
}

function hba1cToGlucose(hba1c) {
  return parseFloat(((hba1c * 1.594) - 2.594).toFixed(1))
}

function hba1cCategory(hba1c) {
  if (hba1c < 5.7) return { label: 'Норма',                           badge: 'badge-green',  dm: 'СД не исключён' }
  if (hba1c < 6.0) return { label: 'Преддиабет (риск)',               badge: 'badge-yellow', dm: 'Изменение образа жизни' }
  if (hba1c < 6.5) return { label: 'Преддиабет',                      badge: 'badge-yellow', dm: 'Высокий риск СД2' }
  if (hba1c < 7.0) return { label: 'СД — целевые значения',           badge: 'badge-green',  dm: 'Целевой уровень для большинства пациентов' }
  if (hba1c < 8.0) return { label: 'СД — частичная компенсация',      badge: 'badge-yellow', dm: 'Усилить терапию' }
  return                  { label: 'СД — декомпенсация',              badge: 'badge-red',    dm: 'Пересмотр терапии обязателен' }
}

const THYROID_REF = [
  { name: 'ТТГ',          range: '0.27–4.2 мЕд/л',   note: 'Первичный скрининг' },
  { name: 'Св. Т4',       range: '9–20 пмоль/л',      note: 'Контроль при изменённом ТТГ' },
  { name: 'Св. Т3',       range: '2.6–5.7 пмоль/л',  note: 'При конверсионной патологии' },
  { name: 'АТ к ТПО',     range: '< 34 МЕ/мл',       note: 'Аутоиммунный тиреоидит' },
  { name: 'АТ к ТГ',      range: '< 115 МЕ/мл',      note: 'Тиреоидит Хашимото' },
  { name: 'Кальцитонин',  range: '< 5.8 пг/мл (м),\n< 3.4 пг/мл (ж)', note: 'Медуллярный рак ЩЖ' },
]

export default function EndocrinologySuite() {
  const [weight, setWeight]   = useState(80)
  const [height, setHeight]   = useState(170)
  const [hba1c,  setHba1c]   = useState(6.8)

  const bmiVal  = height > 0 ? parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)) : 0
  const bmiCat  = bmiVal > 0 ? bmiCategory(bmiVal) : null
  const eAG     = hba1cToGlucose(hba1c)
  const hba1cCat = hba1cCategory(hba1c)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FFF7ED' }}>🦋</div>
        <div>
          <h2>Рабочий кабинет эндокринолога</h2>
          <p>ИМТ, HbA1c ↔ средняя глюкоза, нормы гормонов щитовидной железы</p>
        </div>
      </div>

      {/* BMI */}
      <div className="suite-card">
        <div className="suite-card-title">⚖️ Индекс массы тела (ИМТ / BMI)</div>
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
              <div className="suite-score-label">ИМТ</div>
              <div className="suite-score-big" style={{ color: '#FB923C' }}>{bmiVal}</div>
            </div>
            <span className={`suite-risk-badge ${bmiCat.badge}`}>{bmiCat.label}</span>
          </div>
        )}
      </div>

      {/* HbA1c */}
      <div className="suite-card">
        <div className="suite-card-title">🍬 HbA1c → Средняя гликемия</div>
        <div className="suite-field">
          <label>HbA1c (%)</label>
          <input className="suite-input" type="number" step="0.1" min="4" max="16" value={hba1c}
            onChange={e => setHba1c(Math.max(4, Math.min(16, parseFloat(e.target.value) || 6.5)))} />
        </div>
        <div className="suite-dark-box">
          <div className="suite-dark-row">
            <span className="suite-dark-label">Средняя глюкоза плазмы (eAG)</span>
            <span className="suite-dark-value accent-yellow">{eAG > 0 ? `${eAG} ммоль/л` : '—'}</span>
          </div>
          <div className="suite-dark-row">
            <span className="suite-dark-label">Интерпретация HbA1c</span>
            <span className={`suite-risk-badge ${hba1cCat.badge}`} style={{ fontSize: 10 }}>{hba1cCat.label}</span>
          </div>
          <div className="suite-dark-row">
            <span className="suite-dark-label">Рекомендация</span>
            <span className="suite-dark-label" style={{ textAlign: 'right', maxWidth: 180 }}>{hba1cCat.dm}</span>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: '8px 12px', background: '#FFF7ED', borderRadius: 8 }}>
          <p style={{ fontSize: 11, color: '#78350F', lineHeight: 1.5 }}>
            Целевой HbA1c: <b>{'< 7%'}</b> (большинство), <b>{'< 6.5%'}</b> (молодые без риска), <b>{'< 8%'}</b> (пожилые, ≥ 2 тяжёлых ГГ в анамнезе)
          </p>
        </div>
      </div>

      {/* Thyroid reference */}
      <div className="suite-card">
        <div className="suite-card-title">🦋 Нормы гормонов щитовидной железы</div>
        <table className="suite-table">
          <thead>
            <tr><th>Показатель</th><th>Норма</th><th>Применение</th></tr>
          </thead>
          <tbody>
            {THYROID_REF.map((r, i) => (
              <tr key={i}>
                <td className="col-time">{r.name}</td>
                <td className="col-drug" style={{ whiteSpace: 'pre-line' }}>{r.range}</td>
                <td className="col-note">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
