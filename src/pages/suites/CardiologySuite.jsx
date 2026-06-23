import { useState, useEffect } from 'react'
import './suites.css'

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

  const [age, setAge]           = useState(55)
  const [gender, setGender]     = useState('male')
  const [sbp, setSbp]           = useState(140)
  const [chol, setChol]         = useState(5.2)
  const [hdl, setHdl]           = useState(1.1)
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
    const ratio = hdl > 0 ? chol / hdl : 4.0
    if (ratio > 3.5) base += (ratio - 3.5) * 2.2
    if (smoker)  base *= 1.85
    if (diabetic) base *= 1.6
    if (gender === 'male') base *= 1.2
    setAscvd(parseFloat(Math.min(99.9, Math.max(0.1, base)).toFixed(1)))
  }, [age, gender, sbp, chol, hdl, smoker, diabetic])

  function toggle(id) {
    setFlags(prev => {
      const next = { ...prev, [id]: !prev[id] }
      if (id === 'age75' && !prev['age75']) next.age65 = true
      return next
    })
  }

  const ascvdCat = getAscvdCategory(ascvd)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FFF1F2' }}>🫀</div>
        <div>
          <h2>Рабочий кабинет кардиолога</h2>
          <p>CHA₂DS₂-VASc, 10-летний сердечно-сосудистый риск ASCVD, шпаргалка ЭКГ</p>
        </div>
      </div>

      {/* CHA2DS2-VASc */}
      <div className="suite-card">
        <div className="suite-card-title" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>🩺 Риск инсульта при ФП — CHA₂DS₂-VASc</span>
          <button onClick={() => setFlags({ chf:false, htn:false, age75:false, diabetes:false, stroke:false, vascular:false, age65:false, female:false })}
            style={{ fontSize:11, color:'var(--color-text-secondary)', background:'none', border:'none', cursor:'pointer', padding:'2px 6px' }}>
            Сбросить
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {CHA2_FIELDS.map(f => (
            <button key={f.id} className="suite-toggle-row"
              disabled={f.id === 'age65' && flags.age75}
              onClick={() => toggle(f.id)}
              style={{ opacity: f.id === 'age65' && flags.age75 ? 0.4 : 1 }}>
              <span className="suite-toggle-label" style={{ fontWeight: f.bold ? 700 : 500 }}>
                {f.label} <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>[+{f.points}]</span>
              </span>
              <div className={`suite-toggle ${flags[f.id] ? 'on' : ''}`}>
                <div className="suite-toggle-thumb" />
              </div>
            </button>
          ))}
        </div>
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">CHA₂DS₂-VASc балл</div>
            <div className="suite-score-big" style={{ color: '#F87171' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${cha2.badge}`}>{cha2.label} · {cha2.risk}/год</span>
            <div className="suite-advice">{cha2.advice}</div>
          </div>
        </div>
      </div>

      {/* ASCVD */}
      <div className="suite-card">
        <div className="suite-card-title">🫁 10-летний риск ССЗ (ASCVD)</div>
        <p style={{ fontSize:11, color:'var(--color-text-secondary)', marginBottom:10, lineHeight:1.4 }}>
          Приближённая оценка. Для точного расчёта — ACC/AHA ASCVD Risk Estimator Plus.
        </p>
        <div className="suite-grid">
          <div className="suite-field">
            <label>Возраст (лет)</label>
            <input className="suite-input" type="number" value={age}
              onChange={e => setAge(Math.max(1, parseInt(e.target.value) || 0))} />
          </div>
          <div className="suite-field">
            <label>Пол</label>
            <div className="suite-gender-row">
              <button className={`suite-gender-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>Муж</button>
              <button className={`suite-gender-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>Жен</button>
            </div>
          </div>
          <div className="suite-field">
            <label>Систолическое АД (мм рт.ст.)</label>
            <input className="suite-input" type="number" value={sbp}
              onChange={e => setSbp(Math.max(40, parseInt(e.target.value) || 120))} />
          </div>
          <div className="suite-field">
            <label>Общий холестерин (ммоль/л)</label>
            <input className="suite-input" type="number" step="0.1" value={chol}
              onChange={e => setChol(Math.max(0.1, parseFloat(e.target.value) || 0))} />
          </div>
          <div className="suite-field">
            <label>ЛПВП (ммоль/л)</label>
            <input className="suite-input" type="number" step="0.1" value={hdl}
              onChange={e => setHdl(Math.max(0.1, parseFloat(e.target.value) || 0))} />
          </div>
          <div className="suite-field" style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'flex-end' }}>
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
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">10-летний риск CC-катастрофы</div>
            <div className="suite-score-big" style={{ color: '#F87171' }}>{ascvd}%</div>
          </div>
          <span className={`suite-risk-badge ${ascvdCat.badge}`}>{ascvdCat.label}</span>
        </div>
      </div>

      {/* ECG cheat sheet */}
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
  )
}
