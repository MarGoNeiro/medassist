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

function calcSCORE2(sex, age, smoking, sbp, nonHDL) {
  const wAge   = (age - 60) / 5
  const wSBP   = (sbp - 120) / 20
  const wChol  = nonHDL - 3.5
  const wSmoke = smoking ? 1 : 0
  let lp, s0
  if (sex === 'm') {
    lp = 0.3742*wAge + 0.6012*wSmoke + 0.2777*wSBP + 0.1458*wChol - 0.0755*wAge*wSmoke - 0.0255*wAge*wSBP
    s0 = 0.9605
  } else {
    lp = 0.4648*wAge + 0.7744*wSmoke + 0.3131*wSBP + 0.1002*wChol - 0.1088*wAge*wSmoke - 0.0277*wAge*wSBP
    s0 = 0.9776
  }
  return Math.round(Math.max(0, (1 - Math.pow(s0, Math.exp(lp))) * 100) * 10) / 10
}

function score2Category(risk, age) {
  const threshold = age < 50 ? [2.5, 7.5] : [5, 10]
  if (risk < threshold[0]) return { label: 'Низкий / умеренный риск', badge: 'badge-green',  advice: 'Коррекция образа жизни. Медикаменты — по клинической ситуации.' }
  if (risk < threshold[1]) return { label: 'Высокий риск',            badge: 'badge-yellow', advice: 'Рассмотреть статины. Цель ХС-ЛПНП < 1.8 ммоль/л.' }
  return                         { label: 'Очень высокий риск',       badge: 'badge-red',    advice: 'Статины обязательны. Цель ХС-ЛПНП < 1.4 ммоль/л. Возможна комбинация.' }
}

function calcCKDEPI(sex, age, creatumol) {
  const creat  = creatumol / 88.4
  const kappa  = sex === 'f' ? 0.7  : 0.9
  const alpha  = sex === 'f' ? -0.241 : -0.302
  const sexFactor = sex === 'f' ? 1.012 : 1.0
  const ratio  = creat / kappa
  return Math.round(142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.2) * Math.pow(0.9938, age) * sexFactor)
}

function ckdStage(egfr) {
  if (egfr >= 90) return { stage: 'G1', label: 'Норма / повышена',      badge: 'badge-green',  advice: 'ХБП — только при наличии маркёров повреждения почек.' }
  if (egfr >= 60) return { stage: 'G2', label: 'Незначительно снижена', badge: 'badge-green',  advice: 'Наблюдение. Контроль АД, отказ от нефротоксинов.' }
  if (egfr >= 45) return { stage: 'G3а', label: 'Умеренно снижена',     badge: 'badge-yellow', advice: 'Коррекция доз ряда препаратов. Нефролог при прогрессировании.' }
  if (egfr >= 30) return { stage: 'G3б', label: 'Существенно снижена',  badge: 'badge-yellow', advice: 'Коррекция доз. Направление к нефрологу.' }
  if (egfr >= 15) return { stage: 'G4',  label: 'Тяжёлая',              badge: 'badge-red',    advice: 'Нефролог обязателен. Подготовка к ЗПТ.' }
  return               { stage: 'G5',  label: 'Терминальная ХБП',      badge: 'badge-red',    advice: 'ЗПТ (диализ или трансплантация).' }
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

export default function TherapistSuite() {
  const [curb, setCurb]     = useState({ confusion: false, urea: false, rr: false, bp: false, age: false })
  const [weight, setWeight] = useState(75)
  const [height, setHeight] = useState(170)
  const [s2Sex,    setS2Sex]    = useState('m')
  const [s2Age,    setS2Age]    = useState(55)
  const [s2Smoke,  setS2Smoke]  = useState(false)
  const [s2SBP,    setS2SBP]    = useState(130)
  const [s2NonHDL, setS2NonHDL] = useState(3.8)
  const [ckdSex, setCkdSex] = useState('m')
  const [ckdAge, setCkdAge] = useState(55)
  const [creat,  setCreat]  = useState(90)

  const curbScore = Object.values(curb).filter(Boolean).length
  const curbRes   = curbResult(curbScore)
  const bmiVal    = height > 0 ? parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)) : 0
  const bmiCat    = bmiVal > 0 ? bmiCategory(bmiVal) : null
  const egfr      = creat > 0 && ckdAge > 0 ? calcCKDEPI(ckdSex, ckdAge, creat) : null
  const ckdRes    = egfr !== null ? ckdStage(egfr) : null
  const s2Risk    = s2Age >= 40 && s2Age <= 69 ? calcSCORE2(s2Sex, s2Age, s2Smoke, s2SBP, s2NonHDL) : null
  const s2Res     = s2Risk !== null ? score2Category(s2Risk, s2Age) : null

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

      {/* SCORE2 */}
      <div className="suite-card">
        <div className="suite-card-title">❤️ SCORE2 — 10-летний риск ССЗ (возраст 40–69 лет)</div>
        <div className="suite-gender-row">
          <button className={`suite-gender-btn ${s2Sex === 'm' ? 'active' : ''}`} onClick={() => setS2Sex('m')}>Мужской</button>
          <button className={`suite-gender-btn ${s2Sex === 'f' ? 'active' : ''}`} onClick={() => setS2Sex('f')}>Женский</button>
        </div>
        <div className="suite-grid">
          <div className="suite-field">
            <label>Возраст (40–69 лет)</label>
            <input className="suite-input" type="number" min="40" max="69" value={s2Age}
              onChange={e => setS2Age(Math.min(69, Math.max(40, parseInt(e.target.value) || 40)))} />
          </div>
          <div className="suite-field">
            <label>АД систолическое (мм рт.ст.)</label>
            <input className="suite-input" type="number" step="1" value={s2SBP}
              onChange={e => setS2SBP(Math.max(80, parseInt(e.target.value) || 120))} />
          </div>
          <div className="suite-field">
            <label>Не-ЛПВП холестерин (ммоль/л)</label>
            <input className="suite-input" type="number" step="0.1" value={s2NonHDL}
              onChange={e => setS2NonHDL(Math.max(0.5, parseFloat(e.target.value) || 3.5))} />
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: '4px 0 8px' }}>Не-ЛПВП = Общий ХС − ЛПВП</p>
        <button className={`suite-toggle-row ${s2Smoke ? 'active' : ''}`} onClick={() => setS2Smoke(v => !v)}>
          <span className="suite-toggle-label">Курит в настоящее время</span>
          <div className={`suite-toggle ${s2Smoke ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
        </button>
        {s2Res && (
          <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 12 }}>
            <div>
              <div className="suite-score-big" style={{ color: s2Risk >= 10 ? '#F87171' : s2Risk >= (s2Age < 50 ? 2.5 : 5) ? '#FBBF24' : '#34D399' }}>
                {s2Risk}%
              </div>
            </div>
            <div>
              <span className={`suite-risk-badge ${s2Res.badge}`}>{s2Res.label}</span>
              <div className="suite-advice">{s2Res.advice}</div>
            </div>
          </div>
        )}
      </div>

      {/* CKD-EPI */}
      <div className="suite-card">
        <div className="suite-card-title">🫘 рСКФ по CKD-EPI 2021</div>
        <div className="suite-gender-row">
          <button className={`suite-gender-btn ${ckdSex === 'm' ? 'active' : ''}`} onClick={() => setCkdSex('m')}>Мужской</button>
          <button className={`suite-gender-btn ${ckdSex === 'f' ? 'active' : ''}`} onClick={() => setCkdSex('f')}>Женский</button>
        </div>
        <div className="suite-grid">
          <div className="suite-field">
            <label>Возраст (лет)</label>
            <input className="suite-input" type="number" min="18" max="110" value={ckdAge}
              onChange={e => setCkdAge(Math.min(110, Math.max(18, parseInt(e.target.value) || 18)))} />
          </div>
          <div className="suite-field">
            <label>Креатинин (мкмоль/л)</label>
            <input className="suite-input" type="number" step="1" min="20" value={creat}
              onChange={e => setCreat(Math.max(1, parseFloat(e.target.value) || 0))} />
          </div>
        </div>
        {ckdRes && (
          <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 12 }}>
            <div>
              <div className="suite-score-big" style={{ color: egfr >= 60 ? '#34D399' : egfr >= 30 ? '#FBBF24' : '#F87171' }}>
                {egfr}
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-secondary)' }}> мл/мин/1.73м²</span>
              </div>
            </div>
            <div>
              <span className={`suite-risk-badge ${ckdRes.badge}`}>{ckdRes.stage} — {ckdRes.label}</span>
              <div className="suite-advice">{ckdRes.advice}</div>
            </div>
          </div>
        )}
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
