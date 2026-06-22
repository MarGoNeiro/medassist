import { useState, useEffect } from 'react'
import './suites.css'

function bmiCategory(bmi) {
  if (bmi < 16.0)  return { label: 'Тяжёлый дефицит', badge: 'badge-red', color: '#F87171' }
  if (bmi < 17.0)  return { label: 'Умеренный дефицит', badge: 'badge-red', color: '#F87171' }
  if (bmi < 18.5)  return { label: 'Лёгкий дефицит', badge: 'badge-yellow', color: '#FBBF24' }
  if (bmi < 25.0)  return { label: 'Норма (18.5–24.9)', badge: 'badge-green', color: '#34D399' }
  if (bmi < 30.0)  return { label: 'Избыточная масса', badge: 'badge-yellow', color: '#FBBF24' }
  if (bmi < 35.0)  return { label: 'Ожирение I ст.', badge: 'badge-red', color: '#FB923C' }
  if (bmi < 40.0)  return { label: 'Ожирение II ст.', badge: 'badge-red', color: '#F87171' }
  return                  { label: 'Ожирение III ст.', badge: 'badge-red', color: '#EF4444' }
}

function idealWeightHamwi(height, isFemale) {
  const base = isFemale ? 45.4 : 48.1
  const extra = (height - 152.4) / 2.54 * (isFemale ? 2.27 : 2.72)
  return Math.round(base + extra)
}

const ACTIVITY_LEVELS = [
  { k: 1.2,  label: 'Минимальная (лежачий режим)' },
  { k: 1.375, label: 'Низкая (1–2 тренировки/нед)' },
  { k: 1.55,  label: 'Умеренная (3–5 тренировок/нед)' },
  { k: 1.725, label: 'Высокая (6–7 тренировок/нед)' },
  { k: 1.9,   label: 'Очень высокая (спортсмены)' },
]

const NRS_ITEMS = [
  { id: 'imb',    label: 'ИМТ < 20.5 кг/м²',                       pts: 1 },
  { id: 'loss',   label: 'Потеря массы > 5% за последние 3 месяца', pts: 1 },
  { id: 'intake', label: 'Снижение питания на прошлой неделе',      pts: 1 },
  { id: 'ill',    label: 'Тяжёлое заболевание (ОРИТ, операция и т.д.)', pts: 1 },
]

export default function DietologySuite() {
  const [weight, setWeight]   = useState(75)
  const [height, setHeight]   = useState(170)
  const [age,    setAge]      = useState(35)
  const [female, setFemale]   = useState(false)
  const [activity, setActivity] = useState(1.55)
  const [nrs, setNrs]         = useState({ imb: false, loss: false, intake: false, ill: false })
  const [bmr, setBmr]         = useState(0)

  useEffect(() => {
    const b = 10 * weight + 6.25 * height - 5 * age + (female ? -161 : 5)
    setBmr(Math.round(b))
  }, [weight, height, age, female])

  const bmiVal = height > 0 ? parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)) : 0
  const bmiCat = bmiVal > 0 ? bmiCategory(bmiVal) : null
  const tdee   = Math.round(bmr * activity)
  const ideal  = idealWeightHamwi(height, female)
  const nrsScore = Object.values(nrs).filter(Boolean).length
  const nrsAge = age >= 70 ? nrsScore + 1 : nrsScore

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FEFCE8' }}>🥗</div>
        <div>
          <h2>Кабинет диетолога / нутрициолога</h2>
          <p>ИМТ, базальный метаболизм (Mifflin–St Jeor), идеальный вес, NRS-2002</p>
        </div>
      </div>

      {/* BMI + Mifflin */}
      <div className="suite-card">
        <div className="suite-card-title">⚖️ ИМТ и суточная энергопотребность</div>
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
          <div className="suite-field">
            <label>Возраст (лет)</label>
            <input className="suite-input" type="number" value={age}
              onChange={e => setAge(Math.max(1, parseInt(e.target.value) || 0))} />
          </div>
          <div className="suite-field">
            <label>Пол</label>
            <div className="suite-gender-row">
              <button className={`suite-gender-btn ${!female ? 'active' : ''}`} onClick={() => setFemale(false)}>Муж</button>
              <button className={`suite-gender-btn ${female ? 'active' : ''}`}  onClick={() => setFemale(true)}>Жен</button>
            </div>
          </div>
        </div>
        <div className="suite-field" style={{ marginTop: 10 }}>
          <label>Уровень активности</label>
          <select className="suite-select" value={activity} onChange={e => setActivity(parseFloat(e.target.value))}>
            {ACTIVITY_LEVELS.map(l => <option key={l.k} value={l.k}>{l.label}</option>)}
          </select>
        </div>
        <div className="suite-dark-box" style={{ marginTop: 14 }}>
          <div className="suite-dark-row">
            <span className="suite-dark-label">ИМТ</span>
            <div style={{ textAlign: 'right' }}>
              <span className="suite-dark-value" style={{ color: bmiCat?.color || 'white' }}>{bmiVal}</span>
              {bmiCat && <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{bmiCat.label}</div>}
            </div>
          </div>
          <div className="suite-dark-row">
            <div className="suite-dark-label">Идеальный вес (Hamwi)<small>Ориентировочный</small></div>
            <span className="suite-dark-value">{ideal} кг</span>
          </div>
          <div className="suite-dark-row">
            <span className="suite-dark-label">Базальный метаболизм (БМ)</span>
            <span className="suite-dark-value">{bmr} ккал/сут</span>
          </div>
          <div className="suite-dark-row">
            <div className="suite-dark-label">Суточная калорийность (TDEE)<small>Поддержание веса</small></div>
            <span className="suite-dark-value accent-green">{tdee} ккал</span>
          </div>
          <div className="suite-dark-row">
            <span className="suite-dark-label">Дефицит −500 ккал → снижение</span>
            <span className="suite-dark-value accent-pink">{tdee - 500} ккал</span>
          </div>
        </div>
      </div>

      {/* NRS-2002 */}
      <div className="suite-card">
        <div className="suite-card-title">🏥 NRS-2002 — нутритивный риск госп. пациента</div>
        {NRS_ITEMS.map(f => (
          <button key={f.id} className="suite-toggle-row" onClick={() => setNrs(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
            <span className="suite-toggle-label">{f.label}</span>
            <div className={`suite-toggle ${nrs[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
        ))}
        {age >= 70 && (
          <div style={{ padding: '8px 12px', background: '#FEF9C3', borderRadius: 8, marginTop: 6, fontSize: 11, color: '#92400E' }}>
            +1 балл автоматически — возраст ≥ 70 лет
          </div>
        )}
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">NRS-2002</div>
            <div className="suite-score-big" style={{ color: nrsAge >= 3 ? '#F87171' : '#34D399' }}>{nrsAge}</div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${nrsAge >= 3 ? 'badge-red' : 'badge-green'}`}>
              {nrsAge >= 3 ? 'Нутр. риск есть' : 'Нутр. риск нет'}
            </span>
            <div className="suite-advice">
              {nrsAge >= 3 ? 'Нутритивная поддержка обязательна. Нутриционист + нутр. смеси.' : 'Повторная оценка еженедельно или при изменении состояния.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
