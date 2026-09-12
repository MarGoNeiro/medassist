import { useState } from 'react'
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

// Classic SCORE table — высокий риск (Россия), риск смерти от ССЗ за 10 лет
// [sex][smoke][age][sbp] → массив из 5 значений для ОХС 4,5,6,7,8 ммоль/л
const SCORE_TABLE = {
  f: {
    0: {
      40: { 120:[0,0,0,0,0], 140:[0,0,0,0,0], 160:[0,0,0,0,0], 180:[0,0,0,0,0] },
      50: { 120:[0,0,1,1,1], 140:[0,1,1,1,1], 160:[1,1,1,1,1], 180:[1,1,1,2,2] },
      55: { 120:[1,1,1,1,1], 140:[1,1,1,1,2], 160:[1,2,2,2,3], 180:[2,2,3,3,4] },
      60: { 120:[1,1,2,2,2], 140:[2,2,2,3,3], 160:[3,3,3,4,5], 180:[4,4,5,6,7] },
      65: { 120:[2,2,3,3,4], 140:[3,3,4,5,6], 160:[5,5,6,7,8], 180:[7,8,9,10,12] },
    },
    1: {
      40: { 120:[0,0,0,0,0], 140:[0,0,0,0,0], 160:[0,0,0,0,0], 180:[0,0,0,1,1] },
      50: { 120:[1,1,1,1,1], 140:[1,1,1,1,2], 160:[1,2,2,2,3], 180:[2,2,3,3,4] },
      55: { 120:[1,1,2,2,2], 140:[2,2,2,3,3], 160:[3,3,4,4,5], 180:[4,5,5,6,7] },
      60: { 120:[2,3,3,4,4], 140:[3,4,5,5,6], 160:[5,6,7,8,9], 180:[8,9,10,11,13] },
      65: { 120:[4,5,5,6,7], 140:[6,7,8,9,11], 160:[9,10,12,13,16], 180:[13,15,17,19,22] },
    },
  },
  m: {
    0: {
      40: { 120:[0,0,1,1,1], 140:[0,1,1,1,1], 160:[1,1,1,1,1], 180:[1,1,1,2,2] },
      50: { 120:[1,1,2,2,2], 140:[2,2,2,3,3], 160:[2,3,3,4,5], 180:[4,4,5,6,7] },
      55: { 120:[2,2,3,3,4], 140:[3,3,4,5,6], 160:[4,5,6,7,8], 180:[6,7,8,10,12] },
      60: { 120:[3,3,4,5,6], 140:[4,5,6,7,9], 160:[6,7,9,10,12], 180:[9,11,13,15,18] },
      65: { 120:[4,5,6,7,9], 140:[6,8,9,11,13], 160:[9,11,13,15,18], 180:[14,16,19,22,26] },
    },
    1: {
      40: { 120:[1,1,1,1,1], 140:[1,1,1,2,2], 160:[1,2,2,2,3], 180:[2,2,3,3,4] },
      50: { 120:[2,3,3,4,5], 140:[3,4,5,6,7], 160:[5,6,7,8,10], 180:[7,8,10,12,14] },
      55: { 120:[4,4,5,6,8], 140:[5,6,8,9,11], 160:[8,9,11,13,16], 180:[12,13,16,19,22] },
      60: { 120:[6,7,8,10,12], 140:[8,9,11,13,16], 160:[12,14,17,20,24], 180:[18,21,24,28,33] },
      65: { 120:[9,10,12,14,17], 140:[13,15,17,20,24], 160:[18,21,25,29,34], 180:[26,30,35,41,47] },
    },
  },
}

const SCORE_AGES = [40, 50, 55, 60, 65]
const SCORE_SBPS = [120, 140, 160, 180]

function lookupSCORE(sex, age, smoking, sbp, chol) {
  const snapAge  = SCORE_AGES.reduce((p, c) => Math.abs(c-age) < Math.abs(p-age) ? c : p)
  const snapSBP  = SCORE_SBPS.reduce((p, c) => Math.abs(c-sbp) < Math.abs(p-sbp) ? c : p)
  const cholIdx  = Math.min(4, Math.max(0, Math.round(chol) - 4))
  return SCORE_TABLE[sex][smoking ? 1 : 0][snapAge][snapSBP][cholIdx]
}

function scoreCategory(risk) {
  if (risk < 1)  return { label: 'Низкий риск',          badge: 'badge-green',  advice: 'Коррекция образа жизни.' }
  if (risk < 5)  return { label: 'Умеренный риск',        badge: 'badge-yellow', advice: 'Коррекция образа жизни. Рассмотреть статины при ХС-ЛПНП > 4.9 ммоль/л.' }
  if (risk < 10) return { label: 'Высокий риск',          badge: 'badge-red',    advice: 'Статины. Цель ХС-ЛПНП < 1.8 ммоль/л или снижение ≥ 50%.' }
  return               { label: 'Очень высокий риск',    badge: 'badge-red',    advice: 'Статины обязательны. Цель ХС-ЛПНП < 1.4 ммоль/л или снижение ≥ 50%.' }
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
  const [scoreSex,   setSCoreSex]   = useState('m')
  const [scoreAge,   setScoreAge]   = useState(55)
  const [scoreSmoke, setScoreSmoke] = useState(false)
  const [scoreSBP,   setScoreSBP]   = useState(140)
  const [scoreChol,  setScoreChol]  = useState(5.0)
  const [ckdSex, setCkdSex] = useState('m')
  const [ckdAge, setCkdAge] = useState(55)
  const [creat,  setCreat]  = useState(90)

  const curbScore = Object.values(curb).filter(Boolean).length
  const curbRes   = curbResult(curbScore)
  const bmiVal    = height > 0 ? parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)) : 0
  const bmiCat    = bmiVal > 0 ? bmiCategory(bmiVal) : null
  const egfr      = creat > 0 && ckdAge > 0 ? calcCKDEPI(ckdSex, ckdAge, creat) : null
  const ckdRes    = egfr !== null ? ckdStage(egfr) : null
  const scoreRisk = scoreAge >= 40 && scoreAge <= 65 ? lookupSCORE(scoreSex, scoreAge, scoreSmoke, scoreSBP, scoreChol) : null
  const scoreRes  = scoreRisk !== null ? scoreCategory(scoreRisk) : null

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

      {/* Classic SCORE */}
      <div className="suite-card">
        <div className="suite-card-title">❤️ SCORE — 10-летний риск смерти от ССЗ (возраст 40–65 лет)</div>
        <div className="suite-gender-row">
          <button className={`suite-gender-btn ${scoreSex === 'm' ? 'active' : ''}`} onClick={() => setSCoreSex('m')}>Мужской</button>
          <button className={`suite-gender-btn ${scoreSex === 'f' ? 'active' : ''}`} onClick={() => setSCoreSex('f')}>Женский</button>
        </div>
        <div className="suite-grid">
          <div className="suite-field">
            <label>Возраст (40–65 лет)</label>
            <input className="suite-input" type="number" min="40" max="65" value={scoreAge}
              onChange={e => setScoreAge(Math.min(65, Math.max(40, parseInt(e.target.value) || 55)))} />
          </div>
          <div className="suite-field">
            <label>АД систолическое (мм рт.ст.)</label>
            <input className="suite-input" type="number" step="5" min="100" max="200" value={scoreSBP}
              onChange={e => setScoreSBP(Math.min(200, Math.max(100, parseInt(e.target.value) || 140)))} />
          </div>
          <div className="suite-field">
            <label>Общий холестерин (ммоль/л)</label>
            <input className="suite-input" type="number" step="0.5" min="3" max="9" value={scoreChol}
              onChange={e => setScoreChol(Math.min(9, Math.max(3, parseFloat(e.target.value) || 5.0)))} />
          </div>
        </div>
        <button className={`suite-toggle-row ${scoreSmoke ? 'active' : ''}`} onClick={() => setScoreSmoke(v => !v)}>
          <span className="suite-toggle-label">Курит в настоящее время</span>
          <div className={`suite-toggle ${scoreSmoke ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
        </button>
        {scoreRes && (
          <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 12 }}>
            <div>
              <div className="suite-score-big" style={{ color: scoreRisk >= 10 ? '#F87171' : scoreRisk >= 5 ? '#F87171' : scoreRisk >= 1 ? '#FBBF24' : '#34D399' }}>
                {scoreRisk}%
              </div>
            </div>
            <div>
              <span className={`suite-risk-badge ${scoreRes.badge}`}>{scoreRes.label}</span>
              <div className="suite-advice">{scoreRes.advice}</div>
            </div>
          </div>
        )}
        {scoreAge < 40 || scoreAge > 65 ? (
          <div className="suite-advice" style={{ paddingTop: 8 }}>Возраст вне диапазона таблицы SCORE (40–65 лет)</div>
        ) : null}
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
