import { useState, useEffect } from 'react'
import './suites.css'

function bmiCategory(bmi) {
  if (bmi < 16.0)  return { label: 'Тяжёлый дефицит',   badge: 'badge-red',    color: '#F87171' }
  if (bmi < 17.0)  return { label: 'Умеренный дефицит',  badge: 'badge-red',    color: '#F87171' }
  if (bmi < 18.5)  return { label: 'Лёгкий дефицит',     badge: 'badge-yellow', color: '#FBBF24' }
  if (bmi < 25.0)  return { label: 'Норма (18.5–24.9)',   badge: 'badge-green',  color: '#34D399' }
  if (bmi < 30.0)  return { label: 'Избыточная масса',   badge: 'badge-yellow', color: '#FBBF24' }
  if (bmi < 35.0)  return { label: 'Ожирение I ст.',     badge: 'badge-red',    color: '#FB923C' }
  if (bmi < 40.0)  return { label: 'Ожирение II ст.',    badge: 'badge-red',    color: '#F87171' }
  return                  { label: 'Ожирение III ст.',   badge: 'badge-red',    color: '#EF4444' }
}

function idealWeightHamwi(height, isFemale) {
  const base = isFemale ? 45.4 : 48.1
  const extra = (height - 152.4) / 2.54 * (isFemale ? 2.27 : 2.72)
  return Math.round(base + extra)
}

const ACTIVITY_LEVELS = [
  { k: 1.2,   label: 'Минимальная (лежачий режим)' },
  { k: 1.375, label: 'Низкая (1–2 тренировки/нед)' },
  { k: 1.55,  label: 'Умеренная (3–5 тренировок/нед)' },
  { k: 1.725, label: 'Высокая (6–7 тренировок/нед)' },
  { k: 1.9,   label: 'Очень высокая (спортсмены)' },
]

const NRS_ITEMS = [
  { id: 'imb',    label: 'ИМТ < 20.5 кг/м²',                          pts: 1 },
  { id: 'loss',   label: 'Потеря массы > 5% за последние 3 месяца',    pts: 1 },
  { id: 'intake', label: 'Снижение питания на прошлой неделе',          pts: 1 },
  { id: 'ill',    label: 'Тяжёлое заболевание (ОРИТ, операция и т.д.)', pts: 1 },
]

export default function DietologySuite() {
  const [weight, setWeight]     = useState(75)
  const [height, setHeight]     = useState(170)
  const [age,    setAge]        = useState(35)
  const [female, setFemale]     = useState(false)
  const [activity, setActivity] = useState(1.55)
  const [nrs, setNrs]           = useState({ imb: false, loss: false, intake: false, ill: false })
  const [bmr, setBmr]           = useState(0)

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
        <div className="dieto-layout">

          {/* Левая колонка: ввод данных */}
          <div className="dieto-inputs">
            <div className="dieto-nums-row">
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
                <label>Возраст</label>
                <input className="suite-input" type="number" value={age}
                  onChange={e => setAge(Math.max(1, parseInt(e.target.value) || 0))} />
              </div>
            </div>
            <div className="dieto-act-row">
              <div className="suite-field dieto-act-field" style={{ flex: 2 }}>
                <label>Уровень активности</label>
                <select className="suite-select" value={activity} onChange={e => setActivity(parseFloat(e.target.value))}>
                  {ACTIVITY_LEVELS.map(l => <option key={l.k} value={l.k}>{l.label}</option>)}
                </select>
              </div>
              <div className="suite-field" style={{ flex: 1 }}>
                <label>Пол</label>
                <div className="suite-gender-row">
                  <button className={`suite-gender-btn ${!female ? 'active' : ''}`} onClick={() => setFemale(false)}>Мужской</button>
                  <button className={`suite-gender-btn ${female ? 'active' : ''}`}  onClick={() => setFemale(true)}>Женский</button>
                </div>
              </div>
            </div>
          </div>

          {/* Центральная колонка: ИМТ */}
          <div className="dieto-bmi-col">
            <div className="dieto-bmi-label">ИМТ</div>
            <div className="dieto-bmi-val" style={{ color: bmiCat?.color }}>{bmiVal}</div>
            {bmiCat && <span className={`suite-risk-badge ${bmiCat.badge}`}>{bmiCat.label}</span>}
          </div>

          {/* Правая колонка: 6 тайлов */}
          <div className="dieto-metrics">
            <div className="dieto-tile">
              <div className="dieto-tile-label">Идеальный вес</div>
              <div className="dieto-tile-value">{ideal} кг</div>
              <div className="dieto-tile-sub">Hamwi</div>
            </div>
            <div className="dieto-tile">
              <div className="dieto-tile-label">Базальный метаболизм</div>
              <div className="dieto-tile-value">{bmr} ккал</div>
              <div className="dieto-tile-sub">Mifflin–St Jeor</div>
            </div>
            <div className="dieto-tile">
              <div className="dieto-tile-label">Поддержание веса</div>
              <div className="dieto-tile-value dieto-green">{tdee} ккал</div>
              <div className="dieto-tile-sub">TDEE</div>
            </div>
            <div className="dieto-tile">
              <div className="dieto-tile-label">Снижение веса</div>
              <div className="dieto-tile-value dieto-pink">{tdee - 500} ккал</div>
              <div className="dieto-tile-sub">Дефицит −500 ккал/сут</div>
            </div>
            <div className="dieto-tile">
              <div className="dieto-tile-label">Норма белка</div>
              <div className="dieto-tile-value">{Math.round(weight * 1.2)}–{Math.round(weight * 2.0)} г</div>
              <div className="dieto-tile-sub">1.2–2.0 г/кг</div>
            </div>
            <div className="dieto-tile">
              <div className="dieto-tile-label">Норма воды</div>
              <div className="dieto-tile-value">{(weight * 30 / 1000).toFixed(1)}–{(weight * 35 / 1000).toFixed(1)} л</div>
              <div className="dieto-tile-sub">30–35 мл/кг</div>
            </div>
          </div>

        </div>
      </div>

      {/* NRS-2002 */}
      <div className="suite-card">
        <div className="suite-card-title">🏥 NRS-2002 – нутритивный риск госпитализированного пациента</div>
        <div className="nrs-layout">
          {/* Колонка 1 */}
          <div className="nrs-col">
            {[NRS_ITEMS[0], NRS_ITEMS[1]].map(f => (
              <button key={f.id} className="suite-toggle-row" onClick={() => setNrs(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
                <span className="suite-toggle-label">{f.label}</span>
                <div className={`suite-toggle ${nrs[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
              </button>
            ))}
          </div>
          {/* Колонка 2 */}
          <div className="nrs-col">
            {[NRS_ITEMS[2], NRS_ITEMS[3]].map(f => (
              <button key={f.id} className="suite-toggle-row" onClick={() => setNrs(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
                <span className="suite-toggle-label">{f.label}</span>
                <div className={`suite-toggle ${nrs[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
              </button>
            ))}
          </div>
          {/* Колонка 3: результат */}
          <div className="nrs-result-col">
            <div className="nrs-result-label">NRS-2002</div>
            <div className="nrs-result-big" style={{ color: nrsAge >= 3 ? '#F87171' : nrsAge >= 1 ? '#FBBF24' : '#34D399' }}>
              {nrsAge}
            </div>
            <span className={`suite-risk-badge ${nrsAge >= 3 ? 'badge-red' : nrsAge >= 1 ? 'badge-yellow' : 'badge-green'}`}>
              {nrsAge >= 3 ? 'Нутритивный риск' : nrsAge >= 1 ? 'Под наблюдением' : 'Риска нет'}
            </span>
            <div className="nrs-result-advice">
              {nrsAge >= 3
                ? 'Нутритивная поддержка обязательна. Нутрициолог, нутритивные смеси, контроль белка.'
                : nrsAge >= 1
                ? 'Контроль питания и динамики массы тела. Повторная оценка через неделю.'
                : 'Нутритивного риска нет. Повторная оценка еженедельно или при изменении состояния пациента.'}
            </div>
            {age >= 70 && <div className="nrs-age-note">+1 балл: возраст ≥ 70 лет</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
