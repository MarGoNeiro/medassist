import { useState } from 'react'
import './suites.css'

function newsParameters({ rr, spo2, o2, sbp, hr, temp, conscious }) {
  let rrScore = 0
  if (rr <= 8) rrScore = 3; else if (rr <= 11) rrScore = 1; else if (rr <= 20) rrScore = 0; else if (rr <= 24) rrScore = 2; else rrScore = 3

  let spo2Score = 0
  if (spo2 <= 91) spo2Score = 3; else if (spo2 <= 93) spo2Score = 2; else if (spo2 <= 95) spo2Score = 1

  let sbpScore = 0
  if (sbp <= 90) sbpScore = 3; else if (sbp <= 100) sbpScore = 2; else if (sbp <= 110) sbpScore = 1; else if (sbp <= 219) sbpScore = 0; else sbpScore = 3

  let hrScore = 0
  if (hr <= 40) hrScore = 3; else if (hr <= 50) hrScore = 1; else if (hr <= 90) hrScore = 0; else if (hr <= 110) hrScore = 1; else if (hr <= 130) hrScore = 2; else hrScore = 3

  let tempScore = 0
  if (temp <= 35.0) tempScore = 3; else if (temp <= 36.0) tempScore = 1; else if (temp <= 38.0) tempScore = 0; else if (temp <= 39.0) tempScore = 1; else tempScore = 2

  return {
    respiration: rrScore,
    oxygenSaturation: spo2Score,
    systolicBloodPressure: sbpScore,
    pulse: hrScore,
    temperature: tempScore,
    consciousness: conscious ? 0 : 3,
    supplementalOxygen: o2 ? 2 : 0,
  }
}

function newsResult(score, hasSingleRedScore) {
  if (score >= 7) return {
    label: 'Высокий',
    badge: 'badge-red',
    color: '#F87171',
    advice: 'Непрерывный контроль жизненных показателей и экстренная оценка командой с компетенциями критической помощи; необходимость перевода и дальнейшие действия — по локальному протоколу.',
  }
  if (score >= 5) return {
    label: 'Средний',
    badge: 'badge-yellow',
    color: '#FBBF24',
    advice: 'Срочный осмотр врача. Контроль показателей не реже 1 раза в час до осмотра и документированного плана; оценить необходимость эскалации помощи.',
  }
  if (hasSingleRedScore) return {
    label: 'Одиночный тревожный параметр',
    badge: 'badge-yellow',
    color: '#FBBF24',
    advice: 'Один физиологический параметр получил 3 балла: требуется срочный осмотр врача. Контроль не реже 1 раза в час до осмотра и плана дальнейшего наблюдения.',
  }
  if (score === 0) return {
    label: 'Низкий',
    badge: 'badge-green',
    color: '#34D399',
    advice: 'Сумма 0. По NEWS2 RCP минимальный интервал наблюдения — 12 часов; корректировать частоту по клинической оценке и локальному протоколу.',
  }
  return {
    label: 'Низкий',
    badge: 'badge-green',
    color: '#34D399',
    advice: 'Сумма 1–4. По NEWS2 RCP наблюдение обычно проводят каждые 4–6 часов; корректировать частоту по клинической оценке и локальному протоколу.',
  }
}

const GCS_EYES   = [{ v:4,l:'4 – Самопроизвольно' },{ v:3,l:'3 – На голос' },{ v:2,l:'2 – На боль' },{ v:1,l:'1 – Нет' }]
const GCS_VERBAL = [{ v:5,l:'5 – Ориентирован' },{ v:4,l:'4 – Спутанный' },{ v:3,l:'3 – Слова' },{ v:2,l:'2 – Звуки' },{ v:1,l:'1 – Нет' }]
const GCS_MOTOR  = [{ v:6,l:'6 – Выполняет команды' },{ v:5,l:'5 – Локализует боль' },{ v:4,l:'4 – Отдёргивает' },{ v:3,l:'3 – Патол. сгибание' },{ v:2,l:'2 – Патол. разгибание' },{ v:1,l:'1 – Отсутствует' }]

const PEARLS = [
  { title: '5 «Г»/«Т» при остановке сердца', body: '5 «Г»: Гипоксия · Гиповолемия · Гипо/гиперкалиемия · Гипотермия · Ацидоз (H⁺)\n5 «Т»: Тампонада · Токсины · Тромбоз ТЭЛА · Тромбоз ОКС · Напряжённый пневмоторакс' },
  { title: 'Инсульт – FAST', body: 'F – Face (перекошено?) · A – Arms (слабость?) · S – Speech (речь?) · T – Time (103, до 4.5 ч – тромболизис)' },
  { title: 'ОКС – STEMI критерии', body: 'Элевация ST: V2–V3 ≥ 2 мм (м) / 1.5 мм (ж); остальные ≥ 1 мм. Новый БЛНПГ. Реперфузия < 90 мин.' },
]

export default function EmergencySuite() {
  const [rrRaw,       setRrRaw]       = useState('16')
  const [spo2Raw,     setSpo2Raw]     = useState('97')
  const [o2,          setO2]          = useState(false)
  const [sbpRaw,      setSbpRaw]      = useState('120')
  const [hrRaw,       setHrRaw]       = useState('78')
  const [tempRaw,     setTempRaw]     = useState('36.6')
  const [alteredCons, setAlteredCons] = useState(false)
  const [eyes,        setEyes]        = useState(4)
  const [verbal,      setVerbal]      = useState(5)
  const [motor,       setMotor]       = useState(6)

  const rr   = Math.max(1,   parseInt(rrRaw)     || 16)
  const spo2 = Math.min(100, Math.max(50, parseInt(spo2Raw)  || 97))
  const sbp  = Math.max(40,  parseInt(sbpRaw)    || 120)
  const hr   = Math.max(10,  parseInt(hrRaw)     || 78)
  const temp = Math.max(25,  parseFloat(tempRaw) || 36.6)

  const newsScores = newsParameters({ rr, spo2, o2, sbp, hr, temp, conscious: !alteredCons })
  const news = Object.values(newsScores).reduce((sum, value) => sum + value, 0)
  const hasSingleRedScore = [
    newsScores.respiration,
    newsScores.oxygenSaturation,
    newsScores.systolicBloodPressure,
    newsScores.pulse,
    newsScores.temperature,
    newsScores.consciousness,
  ].some(score => score === 3)
  const nRes = newsResult(news, hasSingleRedScore)
  const gcsTotal = eyes + verbal + motor
  const gcsLabel = gcsTotal >= 13 ? 'Лёгкое нарушение' : gcsTotal >= 9 ? 'Умеренное' : 'Тяжёлая кома'
  const gcsBadge = gcsTotal >= 9 ? 'badge-yellow' : 'badge-red'
  const gcsAdvice = gcsTotal <= 8 ? 'Показана интубация / защита ДП.' : gcsTotal <= 12 ? 'Тщательный мониторинг, риск аспирации.' : 'Пациент в сознании, стандартный мониторинг.'

  return (
    <div className="suite">

      {/* NEWS2 — полная ширина */}
      <div className="suite-card">
        <div className="suite-card-title">📊 NEWS2 – шкала ранней тревоги</div>
        <div className="news2-three-col">
          {/* Колонка 1: ЧДД, SpO₂, АД */}
          <div className="news2-col">
            <div className="suite-field">
              <label>ЧДД (в мин.)</label>
              <input className="suite-input" type="number" value={rrRaw}
                onChange={e => setRrRaw(e.target.value)}
                onBlur={() => setRrRaw(String(Math.max(1, parseInt(rrRaw) || 16)))} />
            </div>
            <div className="suite-field">
              <label>SpO₂ (%)</label>
              <input className="suite-input" type="number" value={spo2Raw}
                onChange={e => setSpo2Raw(e.target.value)}
                onBlur={() => setSpo2Raw(String(Math.min(100, Math.max(50, parseInt(spo2Raw) || 97))))} />
            </div>
            <div className="suite-field">
              <label>АД сист. (мм рт.ст.)</label>
              <input className="suite-input" type="number" value={sbpRaw}
                onChange={e => setSbpRaw(e.target.value)}
                onBlur={() => setSbpRaw(String(Math.max(40, parseInt(sbpRaw) || 120)))} />
            </div>
          </div>

          {/* Колонка 2: ЧСС, Темп, тогглы */}
          <div className="news2-col">
            <div className="suite-field">
              <label>ЧСС (уд/мин)</label>
              <input className="suite-input" type="number" value={hrRaw}
                onChange={e => setHrRaw(e.target.value)}
                onBlur={() => setHrRaw(String(Math.max(10, parseInt(hrRaw) || 78)))} />
            </div>
            <div className="suite-field">
              <label>Температура (°C)</label>
              <input className="suite-input" type="number" step="0.1" value={tempRaw}
                onChange={e => setTempRaw(e.target.value)}
                onBlur={() => setTempRaw(String(Math.max(25, parseFloat(tempRaw) || 36.6)))} />
            </div>
            <button className="suite-toggle-row" onClick={() => setO2(v => !v)}>
              <span className="suite-toggle-label">Дополнительный O₂</span>
              <div className={`suite-toggle ${o2 ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
            </button>
            <button className="suite-toggle-row" onClick={() => setAlteredCons(v => !v)}>
              <span className="suite-toggle-label">Нарушение сознания [+3]</span>
              <div className={`suite-toggle ${alteredCons ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
            </button>
          </div>

          {/* Колонка 3: результат */}
          <div className="news2-result-col">
            <div className="suite-score-big" style={{ color: nRes.color }}>{news}</div>
            <span className={`suite-risk-badge ${nRes.badge}`}>{nRes.label}</span>
            <div className="suite-advice" style={{ marginTop: 6 }}>{nRes.advice}</div>
            <a href="https://www.rcp.ac.uk/resources/national-early-warning-score-news-2/" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 6, fontSize: 11, color: '#93C5FD' }}>
              Источник порогов: Royal College of Physicians (NEWS2)
            </a>
          </div>
        </div>
      </div>

      {/* ШКГ + Алгоритмы рядом */}
      <div className="emergency-two-col">
        <div className="suite-card">
          <div className="suite-card-title">🧠 ШКГ Глазго (Glasgow Coma Scale)</div>
          <div className="gcs-two-col">
            <div className="gcs-fields-col">
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
            <div className="gcs-result-col">
              <div className="suite-score-label">GCS (E{eyes} V{verbal} M{motor})</div>
              <div className="suite-score-big" style={{ color: '#34D399' }}>{gcsTotal}</div>
              <span className={`suite-risk-badge ${gcsBadge}`}>{gcsLabel}</span>
              <div className="suite-advice" style={{ marginTop: 6 }}>{gcsAdvice}</div>
            </div>
          </div>
        </div>

        <div className="suite-card emergency-pearls-card">
          <div className="suite-card-title">⚡ Экстренные алгоритмы – шпаргалка</div>
          <div className="pearl-list">
            {PEARLS.map((p, i) => (
              <div key={i} className={`pearl-item${i === PEARLS.length - 1 ? ' pearl-item-last' : ''}`}>
                <div className="pearl-title">{p.title}</div>
                <div className="pearl-body">{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
