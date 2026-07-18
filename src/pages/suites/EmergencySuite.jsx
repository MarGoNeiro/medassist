import { useState } from 'react'
import './suites.css'

function newsScore({ rr, spo2, o2, sbp, hr, temp, conscious }) {
  let s = 0
  if (rr <= 8) s += 3
  else if (rr <= 11) s += 1
  else if (rr <= 20) s += 0
  else if (rr <= 24) s += 2
  else s += 3

  if (spo2 <= 91) s += 3
  else if (spo2 <= 93) s += 2
  else if (spo2 <= 95) s += 1

  if (o2) s += 2

  if (sbp <= 90) s += 3
  else if (sbp <= 100) s += 2
  else if (sbp <= 110) s += 1
  else if (sbp <= 219) s += 0
  else s += 3

  if (hr <= 40) s += 3
  else if (hr <= 50) s += 1
  else if (hr <= 90) s += 0
  else if (hr <= 110) s += 1
  else if (hr <= 130) s += 2
  else s += 3

  if (temp <= 35.0) s += 3
  else if (temp <= 36.0) s += 1
  else if (temp <= 38.0) s += 0
  else if (temp <= 39.0) s += 1
  else s += 2

  if (!conscious) s += 3

  return s
}

function newsResult(score) {
  if (score <= 4 && score >= 0) {
    if (score >= 3) return { label: 'Средний', badge: 'badge-yellow', color: '#FBBF24', advice: 'Мониторинг каждые 1 ч. Оценить врача.' }
    return { label: 'Низкий', badge: 'badge-green', color: '#34D399', advice: 'Мониторинг каждые 4–6 ч.' }
  }
  if (score <= 6) return { label: 'Средний', badge: 'badge-yellow', color: '#FBBF24', advice: 'Срочный осмотр врача. Мониторинг каждые 1 ч.' }
  return { label: 'Высокий – экстренный', badge: 'badge-red', color: '#F87171', advice: 'Немедленная реакция. Вызов реанимационной бригады.' }
}

const GCS_MOTOR = [
  { v:6,l:'6 – Выполняет команды' },{ v:5,l:'5 – Локализует боль' },{ v:4,l:'4 – Отдёргивает' },
  { v:3,l:'3 – Патол. сгибание' },{ v:2,l:'2 – Патол. разгибание' },{ v:1,l:'1 – Отсутствует' }
]
const GCS_EYES = [{ v:4,l:'4 – Самопроизвольно' },{ v:3,l:'3 – На голос' },{ v:2,l:'2 – На боль' },{ v:1,l:'1 – Нет' }]
const GCS_VERBAL = [{ v:5,l:'5 – Ориентирован' },{ v:4,l:'4 – Спутанный' },{ v:3,l:'3 – Слова' },{ v:2,l:'2 – Звуки' },{ v:1,l:'1 – Нет' }]

const PEARLS = [
  { title: '5 «Г»/«Т» при остановке сердца', body: '5 «Г»: Гипоксия · Гиповолемия · Гипо/гиперкалиемия · Гипотермия · Ацидоз (H⁺ ионы)\n5 «Т»: Тампонада сердца · Токсины · Тромбоз (ТЭЛА) · Тромбоз (ОКС) · Напряжённый пневмоторакс' },
  { title: 'Инсульт – FAST', body: 'F – Face (перекошено?) · A – Arms (слабость?) · S – Speech (речь?) · T – Time (вызов 103, до 4.5 ч – тромболизис)' },
  { title: 'ОКС – ЭКГ критерии STEMI', body: 'Элевация ST: V2–V3 ≥ 2 мм (м), ≥ 1.5 мм (ж); остальные отведения ≥ 1 мм. БЛНПГ новый. Реперфузия < 90 мин.' },
]

export default function EmergencySuite() {
  const [rr,        setRr]       = useState(16)
  const [spo2,      setSpo2]     = useState(97)
  const [o2,        setO2]       = useState(false)
  const [sbp,       setSbp]      = useState(120)
  const [hr,        setHr]       = useState(78)
  const [temp,      setTemp]     = useState(36.6)
  const [alteredCons, setAlteredCons] = useState(false)
  const [eyes,   setEyes]   = useState(4)
  const [verbal, setVerbal] = useState(5)
  const [motor,  setMotor]  = useState(6)

  const news  = newsScore({ rr, spo2, o2, sbp, hr, temp, conscious: !alteredCons })
  const nRes  = newsResult(news)
  const gcsTotal = eyes + verbal + motor

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FFF1F2' }}>🚑</div>
        <div>
          <h2>Кабинет врача скорой помощи</h2>
          <p>NEWS2 (ранняя тревога), ШКГ Глазго, экстренные алгоритмы</p>
        </div>
      </div>

      {/* NEWS2 */}
      <div className="suite-card">
        <div className="suite-card-title">📊 NEWS2 – шкала ранней тревоги</div>
        <div className="suite-grid">
          <div className="suite-field">
            <label>ЧДД (в мин.)</label>
            <input className="suite-input" type="number" value={rr}
              onChange={e => setRr(Math.max(1, parseInt(e.target.value) || 16))} />
          </div>
          <div className="suite-field">
            <label>SpO₂ (%)</label>
            <input className="suite-input" type="number" value={spo2}
              onChange={e => setSpo2(Math.min(100, Math.max(50, parseInt(e.target.value) || 97)))} />
          </div>
          <div className="suite-field">
            <label>АД сист. (мм рт.ст.)</label>
            <input className="suite-input" type="number" value={sbp}
              onChange={e => setSbp(Math.max(40, parseInt(e.target.value) || 120))} />
          </div>
          <div className="suite-field">
            <label>ЧСС (уд/мин)</label>
            <input className="suite-input" type="number" value={hr}
              onChange={e => setHr(Math.max(10, parseInt(e.target.value) || 78))} />
          </div>
          <div className="suite-field">
            <label>Температура (°C)</label>
            <input className="suite-input" type="number" step="0.1" value={temp}
              onChange={e => setTemp(Math.max(25, parseFloat(e.target.value) || 36.6))} />
          </div>
        </div>
        <button className="suite-toggle-row" style={{ marginTop: 4 }} onClick={() => setO2(v => !v)}>
          <span className="suite-toggle-label">Дополнительный O₂</span>
          <div className={`suite-toggle ${o2 ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
        </button>
        <button className="suite-toggle-row" onClick={() => setAlteredCons(v => !v)}>
          <span className="suite-toggle-label">Нарушение сознания (не A по AVPU) [+3]</span>
          <div className={`suite-toggle ${alteredCons ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
        </button>
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">NEWS2</div>
            <div className="suite-score-big" style={{ color: nRes.color }}>{news}</div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${nRes.badge}`}>{nRes.label}</span>
            <div className="suite-advice">{nRes.advice}</div>
          </div>
        </div>
      </div>

      {/* Glasgow */}
      <div className="suite-card">
        <div className="suite-card-title">🧠 ШКГ Глазго (Glasgow Coma Scale)</div>
        <div className="suite-grid-1 suite-grid" style={{ gap: 10 }}>
          <div className="suite-field">
            <label>Открывание глаз (E)</label>
            <select className="suite-select" value={eyes} onChange={e => setEyes(parseInt(e.target.value))}>
              {GCS_EYES.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
          <div className="suite-field">
            <label>Речевой ответ (V)</label>
            <select className="suite-select" value={verbal} onChange={e => setVerbal(parseInt(e.target.value))}>
              {GCS_VERBAL.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
          <div className="suite-field">
            <label>Двигательный ответ (M)</label>
            <select className="suite-select" value={motor} onChange={e => setMotor(parseInt(e.target.value))}>
              {GCS_MOTOR.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
        </div>
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">GCS (E{eyes} V{verbal} M{motor})</div>
            <div className="suite-score-big" style={{ color: '#34D399' }}>{gcsTotal}</div>
          </div>
          <span className={`suite-risk-badge ${gcsTotal >= 13 ? 'badge-yellow' : 'badge-red'}`}>
            {gcsTotal >= 13 ? 'Лёгкое нарушение' : gcsTotal >= 9 ? 'Умеренное нарушение' : 'Тяжёлая кома'}
          </span>
        </div>
      </div>

      {/* Pearls */}
      <div className="suite-card">
        <div className="suite-card-title">⚡ Экстренные алгоритмы – шпаргалка</div>
        {PEARLS.map((p, i) => (
          <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < PEARLS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>{p.title}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{p.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
