import { useState, useEffect } from 'react'
import './suites.css'

const GRACE_AGE   = [{l:'< 30',pts:0},{l:'30–39',pts:8},{l:'40–49',pts:25},{l:'50–59',pts:41},{l:'60–69',pts:58},{l:'70–79',pts:75},{l:'80–89',pts:91},{l:'≥ 90',pts:100}]
const GRACE_HR    = [{l:'< 50',pts:0},{l:'50–69',pts:3},{l:'70–89',pts:9},{l:'90–109',pts:15},{l:'110–149',pts:24},{l:'150–199',pts:38},{l:'≥ 200',pts:46}]
const GRACE_SBP   = [{l:'< 80',pts:58},{l:'80–99',pts:53},{l:'100–119',pts:43},{l:'120–139',pts:34},{l:'140–159',pts:24},{l:'160–199',pts:10},{l:'≥ 200',pts:0}]
const GRACE_CREAT = [{l:'0–35',pts:1},{l:'36–70',pts:4},{l:'71–105',pts:7},{l:'106–140',pts:10},{l:'141–176',pts:13},{l:'177–353',pts:21},{l:'≥ 354',pts:28}]
const GRACE_KILLIP= [{l:'I — нет признаков СН',pts:0},{l:'II — хрипы / S3 / ↑ЦВД',pts:20},{l:'III — отёк лёгких',pts:39},{l:'IV — кардиогенный шок',pts:59}]

function graceResult(s) {
  if (s <= 108) return { label: 'Низкий',        badge: 'badge-green',  risk: '< 1%',  advice: 'Ранняя инвазивная стратегия 48–72 ч. КАГ при возможности.' }
  if (s <= 140) return { label: 'Промежуточный', badge: 'badge-yellow', risk: '1–3%',  advice: 'Ранняя инвазивная стратегия < 24 ч. КАГ + ЧКВ.' }
  return               { label: 'Высокий',       badge: 'badge-red',    risk: '> 3%',  advice: 'Экстренная инвазивная стратегия < 2 ч. Немедленная КАГ.' }
}

const NYHA_CLASSES = [
  { cls:'I',   color:'#34D399', desc:'Без ограничений. Обычная нагрузка не вызывает симптомов.',                prog:'5-летняя выживаемость ~85%' },
  { cls:'II',  color:'#FBBF24', desc:'Небольшое ограничение. Симптомы при умеренной нагрузке (2 этажа, >200 м).', prog:'5-летняя выживаемость ~75%' },
  { cls:'III', color:'#F97316', desc:'Значительное ограничение. Симптомы при минимальной нагрузке (<1 пролёт).', prog:'5-летняя выживаемость ~50%' },
  { cls:'IV',  color:'#F87171', desc:'Симптомы в покое. Любая нагрузка усиливает дискомфорт.',                  prog:'1-летняя выживаемость ~50%' },
]

const HASBLED_FIELDS = [
  { id:'htn',     label:'АД ≥ 160 мм рт.ст. (неконтролируемое)' },
  { id:'renal',   label:'Нарушение функции почек (диализ, Кр > 200 мкмоль/л)' },
  { id:'liver',   label:'Нарушение функции печени (цирроз, билирубин > 2N)' },
  { id:'stroke',  label:'Инсульт в анамнезе' },
  { id:'bleed',   label:'Кровотечение в анамнезе или предрасположенность' },
  { id:'inr',     label:'Лабильное МНО (TTR < 60%, при варфарине)' },
  { id:'elderly', label:'Возраст > 65 лет' },
  { id:'drugs',   label:'Аспирин / НПВС' },
  { id:'alcohol', label:'Алкоголь ≥ 8 доз/нед.' },
]

function hasbledResult(s) {
  if (s <= 2) return { label: 'Низкий риск',  badge: 'badge-green',  advice: 'Антикоагулянты безопасны. Стандартный мониторинг.' }
  return             { label: 'Высокий риск', badge: 'badge-red',    advice: 'HAS-BLED ≥ 3 — НЕ противопоказание к антикоагулянтам! Устранить модифицируемые факторы.' }
}

const CHA2_FIELDS = [
  { id: 'chf',      label: 'ХСН / дисфункция ЛЖ',                              points: 1 },
  { id: 'htn',      label: 'Артериальная гипертензия',                           points: 1 },
  { id: 'age75',    label: 'Возраст ≥ 75 лет',                                  points: 2, bold: true },
  { id: 'diabetes', label: 'Сахарный диабет',                                   points: 1 },
  { id: 'stroke',   label: 'Инсульт / ТИА / тромбоэмболия в анамнезе',          points: 2, bold: true },
  { id: 'vascular', label: 'Сосудистые заболевания (ИБС, ОИМ, атеросклероз)',   points: 1 },
  { id: 'age65',    label: 'Возраст 65–74 года',                                points: 1 },
  { id: 'female',   label: 'Женский пол',                                       points: 1 },
]

function getRisk(score) {
  if (score === 0) return { risk: '~0%',          label: 'Низкий',    badge: 'badge-green',  advice: 'Антикоагулянты не показаны. Ежегодная переоценка.' }
  if (score === 1) return { risk: '~1.3%',        label: 'Умеренный', badge: 'badge-yellow', advice: 'Рассмотреть ПОАК (апиксабан/ривароксабан) индивидуально.' }
  return             { risk: '2.2–15.2%+',        label: 'Высокий',   badge: 'badge-red',    advice: 'Антикоагулянтная терапия строго показана при отсутствии противопоказаний.' }
}

function getAscvdCategory(val) {
  if (val < 5)   return { label: 'Низкий риск (<5%)',             badge: 'badge-green' }
  if (val < 7.5) return { label: 'Пограничный (5–7.5%)',          badge: 'badge-yellow' }
  if (val < 20)  return { label: 'Умеренно-высокий (7.5–20%)',    badge: 'badge-yellow' }
  return               { label: 'Высокий риск (>20%)',            badge: 'badge-red' }
}

export default function CardiologySuite() {
  const [flags, setFlags] = useState({ chf: false, htn: false, age75: false, diabetes: false, stroke: false, vascular: false, age65: false, female: false })
  const [graceAge,     setGraceAge]     = useState(4)
  const [graceHr,      setGraceHr]      = useState(2)
  const [graceSbp,     setGraceSbp]     = useState(3)
  const [graceCreat,   setGraceCreat]   = useState(1)
  const [graceKillip,  setGraceKillip]  = useState(0)
  const [graceArrest,  setGraceArrest]  = useState(false)
  const [graceSt,      setGraceSt]      = useState(false)
  const [graceMarkers, setGraceMarkers] = useState(false)
  const [nyha,         setNyha]         = useState(null)
  const [hasbled,      setHasbled]      = useState({ htn:false, renal:false, liver:false, stroke:false, bleed:false, inr:false, elderly:false, drugs:false, alcohol:false })

  const [age, setAge]           = useState(55)
  const [gender, setGender]     = useState('male')
  const [sbp, setSbp]           = useState(140)
  const [chol, setChol]         = useState(5.2)
  const [ldl, setLdl]           = useState(2.8)
  const [smoker, setSmoker]     = useState(false)
  const [diabetic, setDiabetic] = useState(false)
  const [ascvd, setAscvd]       = useState(0)

  const score = CHA2_FIELDS.reduce((s, f) => s + (flags[f.id] ? f.points : 0), 0)
  const cha2 = getRisk(score)

  useEffect(() => {
    let base = 2.0
    if (age > 40) base += (age - 40) * 0.45
    if (age > 60) base += (age - 60) * 0.6
    if (sbp > 120) base += (sbp - 120) * 0.18
    if (sbp > 140) base += (sbp - 140) * 0.25
    if (chol > 5.0) base += (chol - 5.0) * 1.5
    if (ldl > 2.6)  base += (ldl - 2.6) * 3.5
    if (ldl > 4.0)  base += (ldl - 4.0) * 2.5
    if (smoker)  base *= 1.85
    if (diabetic) base *= 1.6
    if (gender === 'male') base *= 1.2
    setAscvd(parseFloat(Math.min(99.9, Math.max(0.1, base)).toFixed(1)))
  }, [age, gender, sbp, chol, ldl, smoker, diabetic])

  function toggle(id) {
    setFlags(prev => {
      const next = { ...prev, [id]: !prev[id] }
      if (id === 'age75' && !prev['age75']) next.age65 = true
      return next
    })
  }

  const ascvdCat     = getAscvdCategory(ascvd)
  const graceScore   = GRACE_AGE[graceAge].pts + GRACE_HR[graceHr].pts + GRACE_SBP[graceSbp].pts + GRACE_CREAT[graceCreat].pts + GRACE_KILLIP[graceKillip].pts + (graceArrest?39:0) + (graceSt?28:0) + (graceMarkers?14:0)
  const graceRes     = graceResult(graceScore)
  const hasbledScore = Object.values(hasbled).filter(Boolean).length
  const hasbledRes   = hasbledResult(hasbledScore)

  return (
    <div className="suite">

      {/* ASCVD + ECG — верхний ряд */}
      <div className="cardio-two-col">
        <div className="suite-card">
          <div className="suite-card-title">🫁 10-летний риск ССЗ (ASCVD)</div>
          <p style={{ fontSize:11, color:'var(--color-text-secondary)', marginBottom:8, lineHeight:1.4 }}>
            Приближённая оценка. Для точного расчёта — ACC/AHA ASCVD Risk Estimator Plus.
          </p>
          <div className="ascvd-layout">
            <div className="ascvd-grid">
              <div className="suite-field">
                <label>Возраст</label>
                <input className="suite-input" type="number" value={age}
                  onChange={e => setAge(Math.max(1, parseInt(e.target.value) || 0))} />
              </div>
              <div className="suite-field">
                <label>АД систол.</label>
                <input className="suite-input" type="number" value={sbp}
                  onChange={e => setSbp(Math.max(40, parseInt(e.target.value) || 120))} />
              </div>
              <div className="suite-field">
                <label>Пол</label>
                <div className="suite-gender-row">
                  <button className={`suite-gender-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>Муж</button>
                  <button className={`suite-gender-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>Жен</button>
                </div>
              </div>
              <div className="suite-field">
                <label>ЛПНП</label>
                <input className="suite-input" type="number" step="0.1" value={ldl}
                  onChange={e => setLdl(Math.max(0.1, parseFloat(e.target.value) || 0))} />
              </div>
              <div className="suite-field">
                <label>Холестерин</label>
                <input className="suite-input" type="number" step="0.1" value={chol}
                  onChange={e => setChol(Math.max(0.1, parseFloat(e.target.value) || 0))} />
              </div>
              <div className="suite-field" style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'flex-end' }}>
                <button className="suite-toggle-row" onClick={() => setSmoker(v => !v)} style={{ padding: '4px 0' }}>
                  <span className="suite-toggle-label" style={{ fontSize: 12 }}>Курение</span>
                  <div className={`suite-toggle ${smoker ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
                </button>
                <button className="suite-toggle-row" onClick={() => setDiabetic(v => !v)} style={{ padding: '4px 0' }}>
                  <span className="suite-toggle-label" style={{ fontSize: 12 }}>СД 2 типа</span>
                  <div className={`suite-toggle ${diabetic ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
                </button>
              </div>
            </div>
            <div className="nrs-result-col">
              <div className="nrs-result-label">ASCVD 10 лет</div>
              <div className="nrs-result-big" style={{ color: '#F87171' }}>{ascvd}%</div>
              <span className={`suite-risk-badge ${ascvdCat.badge}`}>{ascvdCat.label}</span>
            </div>
          </div>
        </div>

        <div className="suite-card">
          <div className="suite-card-title">⚡ Локализация по ЭКГ — шпаргалка</div>
          <div className="suite-cheatsheet">
            <div className="suite-cheatsheet-title">Отведения → зона поражения ЛЖ</div>
            <dl className="suite-cheatsheet-grid">
              <div><dt>Передняя стенка</dt><dd>V3, V4</dd></div>
              <div><dt>Перегородочная</dt><dd>V1, V2</dd></div>
              <div><dt>Боковая стенка</dt><dd>I, aVL, V5, V6</dd></div>
              <div><dt>Нижняя стенка</dt><dd>II, III, aVF</dd></div>
              <div><dt>Задняя стенка</dt><dd>V7–V9 (реципр. V1–V2)</dd></div>
              <div><dt>ПЖ</dt><dd>V3R, V4R</dd></div>
            </dl>
          </div>
        </div>
      </div>

      {/* CHA₂DS₂-VASc + HAS-BLED — бок о бок */}
      <div className="cardio-two-col cardio-af-pair">
        <div className="suite-card">
          <div className="suite-card-title">
            <span>🩺 CHA₂DS₂-VASc — риск инсульта при ФП</span>
            <button className="suite-reset-btn" onClick={() => setFlags({ chf:false, htn:false, age75:false, diabetes:false, stroke:false, vascular:false, age65:false, female:false })}>Сбросить</button>
          </div>
          {CHA2_FIELDS.map(f => (
            <button key={f.id} className="suite-toggle-row"
              disabled={f.id === 'age65' && flags.age75}
              onClick={() => toggle(f.id)}
              style={{ opacity: f.id === 'age65' && flags.age75 ? 0.4 : 1 }}>
              <span className="suite-toggle-label" style={{ fontWeight: f.bold ? 700 : 500 }}>
                {f.label} <span className="cha2-pts">[+{f.points}]</span>
              </span>
              <div className={`suite-toggle ${flags[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
            </button>
          ))}
          <div className="allergy-compact-result" style={{ marginTop: 10, paddingTop: 10, borderTop: `3px solid ${score >= 2 ? '#F87171' : score === 1 ? '#FBBF24' : '#34D399'}` }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: score >= 2 ? '#F87171' : score === 1 ? '#FBBF24' : '#34D399' }}>{score}</span>
            <span className={`suite-risk-badge ${cha2.badge}`}>{cha2.label} · {cha2.risk}/год</span>
            <span className="allergy-compact-advice">{cha2.advice}</span>
          </div>
        </div>

        <div className="suite-card">
          <div className="suite-card-title">
            <span>🩸 HAS-BLED — риск кровотечения (при ФП)</span>
            <button className="suite-reset-btn" onClick={() => setHasbled({ htn:false, renal:false, liver:false, stroke:false, bleed:false, inr:false, elderly:false, drugs:false, alcohol:false })}>Сбросить</button>
          </div>
          {HASBLED_FIELDS.map(f => (
            <button key={f.id} className="suite-toggle-row"
              onClick={() => setHasbled(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
              <span className="suite-toggle-label">{f.label}</span>
              <div className={`suite-toggle ${hasbled[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
            </button>
          ))}
          <div className="allergy-compact-result" style={{ marginTop: 10, paddingTop: 10, borderTop: `3px solid ${hasbledRes.badge === 'badge-green' ? '#34D399' : '#F87171'}` }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: hasbledRes.badge === 'badge-green' ? '#34D399' : '#F87171' }}>{hasbledScore}</span>
            <span className={`suite-risk-badge ${hasbledRes.badge}`}>{hasbledRes.label}</span>
            <span className="allergy-compact-advice">{hasbledRes.advice}</span>
          </div>
        </div>
      </div>

      {/* GRACE score */}
      <div className="suite-card">
        <div className="suite-card-title">🚨 GRACE — риск при ОКС (смерть в стационаре)</div>
        <div className="grace-row-top">
          {[
            { label: 'Возраст',          opts: GRACE_AGE,   val: graceAge,   set: setGraceAge },
            { label: 'ЧСС (уд/мин)',     opts: GRACE_HR,    val: graceHr,    set: setGraceHr },
            { label: 'АД сист.',         opts: GRACE_SBP,   val: graceSbp,   set: setGraceSbp },
            { label: 'Креатинин (мкмоль/л)', opts: GRACE_CREAT, val: graceCreat, set: setGraceCreat },
          ].map(f => (
            <div key={f.label} className="suite-field">
              <label>{f.label}</label>
              <select className="suite-select" value={f.val} onChange={e => f.set(+e.target.value)}>
                {f.opts.map((o, i) => <option key={i} value={i}>{o.l} (+{o.pts})</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="grace-row-bottom">
          <div className="suite-field">
            <label>Класс Killip</label>
            <select className="suite-select" value={graceKillip} onChange={e => setGraceKillip(+e.target.value)}>
              {GRACE_KILLIP.map((o, i) => <option key={i} value={i}>{o.l} (+{o.pts})</option>)}
            </select>
          </div>
          <button className="suite-toggle-row" onClick={() => setGraceArrest(v => !v)}>
            <span className="suite-toggle-label">Остановка сердца [+39]</span>
            <div className={`suite-toggle ${graceArrest ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
          <button className="suite-toggle-row" onClick={() => setGraceSt(v => !v)}>
            <span className="suite-toggle-label">Отклонение ST [+28]</span>
            <div className={`suite-toggle ${graceSt ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
          <button className="suite-toggle-row" onClick={() => setGraceMarkers(v => !v)}>
            <span className="suite-toggle-label">Кардиомаркёры [+14]</span>
            <div className={`suite-toggle ${graceMarkers ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
        </div>
        <div className="allergy-compact-result" style={{ marginTop: 10, paddingTop: 10, borderTop: `3px solid ${graceRes.badge === 'badge-green' ? '#34D399' : graceRes.badge === 'badge-red' ? '#F87171' : '#FBBF24'}` }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: graceRes.badge === 'badge-green' ? '#34D399' : graceRes.badge === 'badge-red' ? '#F87171' : '#FBBF24' }}>{graceScore}</span>
          <span className={`suite-risk-badge ${graceRes.badge}`}>{graceRes.label} · {graceRes.risk}</span>
          <span className="allergy-compact-advice">{graceRes.advice}</span>
        </div>
      </div>

      {/* NYHA */}
      <div className="suite-card">
        <div className="suite-card-title">🫀 NYHA — классификация ХСН</div>
        <div className="nyha-btns">
          {NYHA_CLASSES.map((n, i) => (
            <button key={i} className={`nyha-btn ${nyha === i ? 'active' : ''}`}
              style={nyha === i ? { borderColor: n.color, background: n.color + '22', color: n.color } : {}}
              onClick={() => setNyha(nyha === i ? null : i)}>
              {n.cls}
            </button>
          ))}
        </div>
        {nyha !== null && (
          <div className="nyha-detail">
            <div className="nyha-detail-class" style={{ color: NYHA_CLASSES[nyha].color }}>Класс {NYHA_CLASSES[nyha].cls}</div>
            <div className="nyha-detail-desc">{NYHA_CLASSES[nyha].desc}</div>
            <div className="nyha-detail-prog">{NYHA_CLASSES[nyha].prog}</div>
          </div>
        )}
        {nyha === null && <p className="dermato-hint">Выберите функциональный класс</p>}
      </div>

    </div>
  )
}
