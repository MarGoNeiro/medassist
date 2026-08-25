import { useState } from 'react'
import './suites.css'

const PASI_REGIONS = [
  { id: 'head',  label: 'Голова',           w: 0.1 },
  { id: 'arms',  label: 'Верх. конечности', w: 0.2 },
  { id: 'trunk', label: 'Туловище',          w: 0.3 },
  { id: 'legs',  label: 'Ниж. конечности',  w: 0.4 },
]
const EID_OPTS  = [0,1,2,3,4].map(v => ({ v, l: String(v) }))
const AREA_OPTS = [
  { v:0,l:'0%' },{ v:1,l:'1–9%' },{ v:2,l:'10–29%' },
  { v:3,l:'30–49%' },{ v:4,l:'50–69%' },{ v:5,l:'70–89%' },{ v:6,l:'90–100%' },
]

function calcPasi(p) {
  return parseFloat(PASI_REGIONS.reduce((s, r) => {
    const { e, i, d, a } = p[r.id]
    return s + r.w * (e + i + d) * a
  }, 0).toFixed(1))
}
function pasiResult(score) {
  if (score < 10) return { label: 'Лёгкий псориаз',    badge: 'badge-green',  advice: 'Топические ГКС, аналоги витамина D, ингибиторы кальциневрина.' }
  if (score < 20) return { label: 'Средней тяжести',    badge: 'badge-yellow', advice: 'PASI ≥ 10 — показание для системной терапии: метотрексат, апремиласт, биологики.' }
  return                  { label: 'Тяжёлый псориаз',   badge: 'badge-red',    advice: 'PASI ≥ 20 — биологическая терапия: ИЛ-17А, ИЛ-23, анти-ФНО-α ингибиторы.' }
}

const FITZPATRICK = [
  { type:'I',   skin:'Очень светлая', burn:'Всегда сгорает',    tan:'никогда не загорает', risk:'Очень высокий риск рака кожи. SPF 50+ постоянно. Ежегодная дерматоскопия.' },
  { type:'II',  skin:'Светлая',       burn:'Легко сгорает',     tan:'слабо загорает',      risk:'Высокий риск. SPF 30–50. Осмотр невусов 1 раз в год.' },
  { type:'III', skin:'Светло-бежевая',burn:'Иногда сгорает',    tan:'хорошо загорает',     risk:'Умеренный риск. SPF 20–30. При наличии невусов — дерматоскопия.' },
  { type:'IV',  skin:'Оливковая',     burn:'Редко сгорает',     tan:'быстро загорает',     risk:'Низкий риск рака. Высокий риск поствосп. гиперпигментации после процедур.' },
  { type:'V',   skin:'Смуглая',       burn:'Очень редко',        tan:'интенсивно загорает', risk:'Минимальный риск рака. Высокий риск гиперпигментации и келоидов.' },
  { type:'VI',  skin:'Тёмная',        burn:'Никогда не сгорает',tan:'не меняет цвет',      risk:'Наименьший риск рака. Высокий риск гиперпигментации, келоидов, псевдофолликулита.' },
]

const DLQI_QUESTIONS = [
  'Зуд, боль или жжение кожи',
  'Стеснение или беспокойство из-за кожи',
  'Ограничения в быту (покупки, уборка)',
  'Выбор одежды из-за кожи',
  'Социальная и досуговая активность',
  'Занятия спортом',
  'Работа или учёба',
  'Неудобства для партнёра / близких',
  'Интимная жизнь',
  'Уход за кожей (процедуры, лечение)',
]
const DLQI_OPTS = ['Нет', 'Немного', 'Много', 'Очень']

function dlqiResult(score) {
  if (score <= 1)  return { label: 'Нет влияния',         badge: 'badge-green',  advice: 'Болезнь не влияет на качество жизни.' }
  if (score <= 5)  return { label: 'Незначительное',      badge: 'badge-green',  advice: 'Минимальное влияние на качество жизни.' }
  if (score <= 10) return { label: 'Умеренное',           badge: 'badge-yellow', advice: 'DLQI ≥ 6 — показание для системной терапии. При PASI ≥ 10 — рассмотреть биологики.' }
  if (score <= 20) return { label: 'Очень значимое',      badge: 'badge-yellow', advice: 'DLQI ≥ 10 + PASI ≥ 10 → критерий назначения биологической терапии по КР РФ.' }
  return                  { label: 'Чрезвычайно значимое',badge: 'badge-red',    advice: 'DLQI ≥ 10 + PASI ≥ 10 → биологики показаны: ИЛ-17А, ИЛ-23, анти-ФНО-α.' }
}

const TCS_GROUPS = [
  { potency: 'Слабые', color: '#34D399', drugs: 'Гидрокортизон 1–2.5%', use: 'Лицо, складки, аногенитальная область, дети' },
  { potency: 'Умеренные', color: '#FBBF24', drugs: 'Мометазон 0.1%, Флутиказон 0.05%, Флуоцинолон 0.025%', use: 'Туловище, конечности — основная зона' },
  { potency: 'Сильные', color: '#F97316', drugs: 'Бетаметазон валерат 0.1%, Бетаметазон дипропионат 0.05%', use: 'Кисти, стопы, волосистая часть головы, резистентные очаги' },
  { potency: 'Сверхсильные', color: '#F87171', drugs: 'Клобетазол пропионат 0.05% (Дермовейт)', use: 'Гиперкератоз, ограниченные очаги. Курс не более 2 нед.' },
]

const ABCDE = [
  { id:'a', letter:'A', name:'Асимметрия', desc:'Одна половина образования не совпадает с другой' },
  { id:'b', letter:'B', name:'Границы',    desc:'Неровные, размытые или зазубренные края' },
  { id:'c', letter:'C', name:'Цвет',       desc:'Неоднородный: коричневый, чёрный, красный, белый, синий' },
  { id:'d', letter:'D', name:'Диаметр',    desc:'Более 6 мм (размер ластика карандаша)' },
  { id:'e', letter:'E', name:'Эволюция',   desc:'Изменение размера, формы или цвета за последние недели' },
]

const initPasi = () => ({
  head:  { e:0, i:0, d:0, a:0 },
  arms:  { e:0, i:0, d:0, a:0 },
  trunk: { e:0, i:0, d:0, a:0 },
  legs:  { e:0, i:0, d:0, a:0 },
})

export default function DermatologySuite() {
  const [pasi,      setPasi]      = useState(initPasi)
  const [fitz,      setFitz]      = useState(null)
  const [abcde,     setAbcde]     = useState({ a:false, b:false, c:false, d:false, e:false })
  const [dlqiScores,setDlqiScores]= useState(Array(10).fill(0))

  const dlqiTotal = dlqiScores.reduce((a, b) => a + b, 0)
  const dlqiRes   = dlqiResult(dlqiTotal)

  const pasiScore  = calcPasi(pasi)
  const pasiRes    = pasiResult(pasiScore)
  const abcdeCount = Object.values(abcde).filter(Boolean).length
  const fitzInfo   = fitz !== null ? FITZPATRICK[fitz] : null
  const pasiColor  = pasiRes.badge === 'badge-green' ? '#34D399' : pasiRes.badge === 'badge-red' ? '#F87171' : '#FBBF24'

  const setField = (region, field, val) =>
    setPasi(prev => ({ ...prev, [region]: { ...prev[region], [field]: val } }))

  return (
    <div className="suite">

      <div className="dermato-two-col">
        {/* PASI */}
        <div className="suite-card dermato-pasi-card">
          <div className="suite-card-title">📊 PASI — индекс тяжести псориаза</div>
          <div className="pasi-table">
            <div className="pasi-header">
              <div>Зона / Вес</div>
              <div>Эритема</div>
              <div>Инфильтр.</div>
              <div>Шелушение</div>
              <div>Площадь</div>
            </div>
            {PASI_REGIONS.map(r => (
              <div key={r.id} className="pasi-row">
                <div className="pasi-zone">
                  {r.label}
                  <span className="pasi-weight">× {r.w}</span>
                </div>
                {['e','i','d'].map(field => (
                  <select key={field} className="suite-select pasi-select"
                    value={pasi[r.id][field]}
                    onChange={e => setField(r.id, field, parseInt(e.target.value))}>
                    {EID_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                ))}
                <select className="suite-select pasi-select"
                  value={pasi[r.id].a}
                  onChange={e => setField(r.id, 'a', parseInt(e.target.value))}>
                  {AREA_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="suite-result-banner scorad-result dermato-bottom-banner">
            <div className="scorad-score">
              <div className="suite-score-label">PASI</div>
              <div className="suite-score-big" style={{ color: pasiColor }}>{pasiScore}</div>
            </div>
            <div className="scorad-verdict">
              <span className={`suite-risk-badge ${pasiRes.badge}`}>{pasiRes.label}</span>
              <div className="suite-advice">{pasiRes.advice}</div>
            </div>
          </div>
        </div>

        {/* ABCDE */}
        <div className="suite-card dermato-abcde-card">
          <div className="suite-card-title">🔍 ABCDE — признаки меланомы</div>
          {ABCDE.map(f => (
            <button key={f.id} className="suite-toggle-row"
              onClick={() => setAbcde(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
              <div className="abcde-label">
                <span className="abcde-letter">{f.letter}</span>
                <div>
                  <div className="abcde-name">{f.name}</div>
                  <div className="abcde-desc">{f.desc}</div>
                </div>
              </div>
              <div className={`suite-toggle ${abcde[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
            </button>
          ))}
          <div className="suite-result-banner scorad-result dermato-bottom-banner">
            <div className="scorad-score">
              <div className="suite-score-label">ABCDE</div>
              <div className="suite-score-big" style={{ color: abcdeCount >= 3 ? '#F87171' : abcdeCount >= 1 ? '#FBBF24' : '#34D399' }}>{abcdeCount}/5</div>
            </div>
            <div className="scorad-verdict">
              {abcdeCount >= 3
                ? <><span className="suite-risk-badge badge-red">Биопсия</span><div className="suite-advice">≥3 признака — высокий риск меланомы. Срочно к онкодерматологу.</div></>
                : abcdeCount >= 1
                ? <><span className="suite-risk-badge badge-yellow">Наблюдение</span><div className="suite-advice">Дерматоскопия. Контроль каждые 3–6 мес.</div></>
                : <><span className="suite-risk-badge badge-green">Признаков нет</span><div className="suite-advice">Стандартная профилактика. SPF-защита.</div></>
              }
            </div>
          </div>
        </div>
      </div>

      {/* DLQI */}
      <div className="suite-card">
        <div className="suite-card-title">📋 DLQI — КАЧЕСТВО ЖИЗНИ (последняя неделя)</div>
        <div className="dlqi-two-col">
          {[0, 1].map(col => (
            <div key={col} className="dlqi-col">
              {DLQI_QUESTIONS.slice(col * 5, col * 5 + 5).map((q, qi) => {
                const idx = col * 5 + qi
                return (
                  <div key={idx} className="dlqi-row">
                    <div className="dlqi-label">{idx + 1}. {q}</div>
                    <div className="dlqi-btns">
                      {DLQI_OPTS.map((opt, oi) => (
                        <button key={oi}
                          className={`dlqi-btn ${dlqiScores[idx] === oi ? 'active' : ''}`}
                          onClick={() => setDlqiScores(prev => prev.map((v, i) => i === idx ? oi : v))}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        {(() => {
          const lineColor = dlqiRes.badge === 'badge-green' ? '#34D399' : dlqiRes.badge === 'badge-red' ? '#F87171' : '#FBBF24'
          return (
            <div className="allergy-compact-result dlqi-result-line" style={{ marginTop: 14, paddingTop: 12, borderTop: `3px solid ${lineColor}` }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: lineColor }}>{dlqiTotal}</span>
              <span className={`suite-risk-badge ${dlqiRes.badge}`}>{dlqiRes.label}</span>
              <span className="allergy-compact-advice">{dlqiRes.advice}</span>
            </div>
          )
        })()}
      </div>

      {/* Топические ГКС */}
      <div className="suite-card">
        <div className="suite-card-title">💊 ТОПИЧЕСКИЕ ГКС — ШПАРГАЛКА ПО ПОТЕНТНОСТИ</div>
        <div className="tcs-list">
          {TCS_GROUPS.map((g, i) => (
            <div key={i} className="tcs-row">
              <div className="tcs-potency" style={{ color: g.color }}>{g.potency}</div>
              <div className="tcs-drugs">{g.drugs}</div>
              <div className="tcs-use">{g.use}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fitzpatrick — полная ширина */}
      <div className="suite-card">
        <div className="suite-card-title">☀️ Фототип кожи по Фицпатрику</div>
        <div className="fitz-types">
          {FITZPATRICK.map((f, i) => (
            <button key={i} className={`fitz-btn ${fitz === i ? 'active' : ''}`}
              onClick={() => setFitz(fitz === i ? null : i)}>
              {f.type}
            </button>
          ))}
        </div>
        {fitzInfo ? (
          <div className="fitz-detail">
            <div className="fitz-detail-type">Тип {fitzInfo.type} — {fitzInfo.skin}</div>
            <div className="fitz-detail-row"><span>Реакция на солнце:</span> {fitzInfo.burn}, {fitzInfo.tan}</div>
            <div className="fitz-detail-rec">{fitzInfo.risk}</div>
          </div>
        ) : (
          <p className="dermato-hint">Выберите фототип — получите рекомендации по SPF и риску рака кожи</p>
        )}
      </div>
    </div>
  )
}
