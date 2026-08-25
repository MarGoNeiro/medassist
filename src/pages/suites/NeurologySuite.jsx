import { useState } from 'react'
import './suites.css'

const ABCD2_FIELDS = [
  {
    id: 'age',      label: 'Возраст',
    opts: [{ v: 0, l: '< 60 лет [0]' }, { v: 1, l: '≥ 60 лет [+1]' }]
  },
  {
    id: 'bp',       label: 'АД при первичном осмотре',
    opts: [{ v: 0, l: '< 140/90 [0]' }, { v: 1, l: '≥ 140/90 [+1]' }]
  },
  {
    id: 'clinical', label: 'Клинические проявления ТИА',
    opts: [{ v: 0, l: 'Другие симптомы [0]' }, { v: 1, l: 'Речевые нарушения без слабости [+1]' }, { v: 2, l: 'Односторонняя слабость [+2]' }]
  },
  {
    id: 'duration', label: 'Длительность симптомов',
    opts: [{ v: 0, l: '< 10 мин [0]' }, { v: 1, l: '10–59 мин [+1]' }, { v: 2, l: '≥ 60 мин [+2]' }]
  },
  {
    id: 'diabetes', label: 'Сахарный диабет',
    opts: [{ v: 0, l: 'Нет [0]' }, { v: 1, l: 'Есть [+1]' }]
  },
]

function abcd2Risk(score) {
  if (score <= 3) return { label: 'Низкий риск',      pct: '1% / 2д.',  badge: 'badge-green',  advice: 'Амбулаторное наблюдение; инициировать антитромботическую терапию.' }
  if (score <= 5) return { label: 'Умеренный риск',   pct: '4% / 2д.',  badge: 'badge-yellow', advice: 'Госпитализация для углублённого обследования и мониторинга.' }
  return               { label: 'Высокий риск',      pct: '8% / 2д.',  badge: 'badge-red',    advice: 'Экстренная госпитализация. Риск инсульта в течение 48 ч очень высок.' }
}

const MOCA_DOMAINS = [
  { id: 'visuo',     label: 'Зрительно-пространственная / исполнительная', max: 5 },
  { id: 'naming',    label: 'Называние (3 животных)',                       max: 3 },
  { id: 'attention', label: 'Внимание',                                     max: 6 },
  { id: 'language',  label: 'Речь',                                         max: 3 },
  { id: 'abstract',  label: 'Абстракция',                                   max: 2 },
  { id: 'recall',    label: 'Отсроченное воспроизведение (5 слов)',         max: 5 },
  { id: 'orient',    label: 'Ориентация',                                   max: 6 },
  { id: 'edu',       label: 'Образование ≤ 12 лет',                        max: 1 },
]

function mocaResult(score) {
  if (score >= 26) return { label: 'Норма',                         badge: 'badge-green',  advice: 'Когнитивных нарушений не выявлено. Контроль через 1 год.' }
  if (score >= 18) return { label: 'Лёгкие когнитивные нарушения', badge: 'badge-yellow', advice: 'МКН — повторное тестирование через 6–12 мес. Исключить депрессию, сосудистые факторы риска.' }
  if (score >= 10) return { label: 'Умеренные нарушения',           badge: 'badge-yellow', advice: 'МКН средней степени — МРТ головного мозга, расширенное нейропсихологическое тестирование.' }
  return                  { label: 'Тяжёлые нарушения',             badge: 'badge-red',    advice: 'Выраженный когнитивный дефицит — нейропсихолог, решение вопроса о дееспособности.' }
}

const nihssItems = [
  { id: 'loc',       label: 'Уровень сознания', max: 3,
    opts: ['0 — Ясное', '1 — Оглушение (выполняет не все команды)', '2 — Сопор (реакция на боль)', '3 — Кома'] },
  { id: 'gaze',      label: 'Взор горизонтальный', max: 2,
    opts: ['0 — Норма', '1 — Частичный паралич взора', '2 — Полный паралич / девиация'] },
  { id: 'visual',    label: 'Поля зрения', max: 3,
    opts: ['0 — Норма', '1 — Частичная гемианопсия', '2 — Полная гемианопсия', '3 — Двусторонняя (слепота)'] },
  { id: 'facial',    label: 'Парез лица', max: 3,
    opts: ['0 — Норма', '1 — Лёгкий (носогубная складка)', '2 — Частичный (нижняя половина)', '3 — Полный (лоб + нижняя половина)'] },
  { id: 'motorL',    label: 'Двигательная рука (левая)', max: 4,
    opts: ['0 — Нет дрейфа 10 с', '1 — Дрейф до кушетки', '2 — Преодолевает гравитацию', '3 — Не преодолевает', '4 — Плегия'] },
  { id: 'motorR',    label: 'Двигательная рука (правая)', max: 4,
    opts: ['0 — Нет дрейфа 10 с', '1 — Дрейф до кушетки', '2 — Преодолевает гравитацию', '3 — Не преодолевает', '4 — Плегия'] },
  { id: 'motorLegL', label: 'Двигательная нога (левая)', max: 4,
    opts: ['0 — Нет дрейфа 5 с', '1 — Дрейф до кушетки', '2 — Преодолевает гравитацию', '3 — Не преодолевает', '4 — Плегия'] },
  { id: 'motorLegR', label: 'Двигательная нога (правая)', max: 4,
    opts: ['0 — Нет дрейфа 5 с', '1 — Дрейф до кушетки', '2 — Преодолевает гравитацию', '3 — Не преодолевает', '4 — Плегия'] },
  { id: 'ataxia',    label: 'Атаксия в конечностях', max: 2,
    opts: ['0 — Нет / невозможно оценить', '1 — В одной конечности', '2 — В двух конечностях'] },
  { id: 'sensory',   label: 'Чувствительность', max: 2,
    opts: ['0 — Норма', '1 — Лёгкая/умеренная потеря (укол ощущается)', '2 — Тяжёлая/полная потеря'] },
  { id: 'language',  label: 'Речь (афазия)', max: 3,
    opts: ['0 — Норма', '1 — Лёгкая афазия (подбирает слова)', '2 — Тяжёлая афазия (фраза невозможна)', '3 — Мутизм / глобальная афазия'] },
  { id: 'dysarthria', label: 'Дизартрия', max: 2,
    opts: ['0 — Норма', '1 — Лёгкая (стёртая речь)', '2 — Тяжёлая (непонятна окружающим)'] },
  { id: 'neglect',   label: 'Угасание / игнорирование', max: 2,
    opts: ['0 — Норма', '1 — Игнорирует в одной модальности', '2 — Игнорирует в ≥ 2 модальностях'] },
]

function nihssSeverity(score) {
  if (score === 0)  return { label: 'Нет неврологического дефицита', badge: 'badge-green' }
  if (score <= 4)   return { label: 'Минимальный дефицит',           badge: 'badge-green' }
  if (score <= 15)  return { label: 'Умеренный инсульт',             badge: 'badge-yellow' }
  if (score <= 20)  return { label: 'Тяжёлый инсульт',               badge: 'badge-red' }
  return                  { label: 'Очень тяжёлый инсульт',          badge: 'badge-red' }
}

export default function NeurologySuite() {
  const [abcd2, setAbcd2] = useState({ age: 0, bp: 0, clinical: 0, duration: 0, diabetes: 0 })
  const [nihss, setNihss] = useState(Object.fromEntries(nihssItems.map(f => [f.id, 0])))
  const [moca,  setMoca]  = useState(Object.fromEntries(MOCA_DOMAINS.map(d => [d.id, 0])))

  const abcdScore = Object.values(abcd2).reduce((a, b) => a + b, 0)
  const abcdRes   = abcd2Risk(abcdScore)

  const nihssScore = Object.values(nihss).reduce((a, b) => a + b, 0)
  const nihssRes   = nihssSeverity(nihssScore)

  const mocaScore = Math.min(30, Object.values(moca).reduce((a, b) => a + b, 0))
  const mocaRes   = mocaResult(mocaScore)

  function stepMoca(id, delta, max) {
    setMoca(prev => ({ ...prev, [id]: Math.max(0, Math.min(max, prev[id] + delta)) }))
  }

  return (
    <div className="suite">

      <div className="cardio-two-col">
      {/* ABCD2 */}
      <div className="suite-card">
        <div className="suite-card-title">
          <span>⚠️ Шкала ABCD² — риск инсульта после ТИА</span>
          <button className="suite-reset-btn" onClick={() => setAbcd2({ age:0, bp:0, clinical:0, duration:0, diabetes:0 })}>Сбросить</button>
        </div>
        <div className="suite-form-2col">
          {ABCD2_FIELDS.map(f => (
            <div key={f.id} className="suite-field" style={{ marginBottom: 10 }}>
              <label>{f.label}</label>
              <select className="suite-select"
                value={abcd2[f.id]}
                onChange={e => setAbcd2(prev => ({ ...prev, [f.id]: parseInt(e.target.value) }))}>
                {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">ABCD² Score</div>
            <div className="suite-score-big score-sm" style={{ color: '#60A5FA' }}>{abcdScore}</div>
          </div>
          <div>
            <span className={`suite-risk-badge ${abcdRes.badge}`}>{abcdRes.label} · {abcdRes.pct}</span>
            <div className="suite-advice">{abcdRes.advice}</div>
          </div>
        </div>
      </div>

      {/* Quick reference */}
      <div className="suite-card">
        <div className="suite-card-title">📖 Тромболизис — окно терапии</div>
        <div className="suite-cheatsheet">
          <div className="suite-cheatsheet-title">Временные критерии rt-PA / Альтеплаза</div>
          <dl className="suite-cheatsheet-grid" style={{ gap: 10, gridTemplateColumns: '1fr' }}>
            <div><dt style={{ fontSize: 13 }}>Ишемический инсульт</dt><dd style={{ fontSize: 15 }}>до 4,5 ч от начала симптомов</dd></div>
            <div><dt style={{ fontSize: 13 }}>NIHSS для тромболизиса</dt><dd style={{ fontSize: 15 }}>4–25 баллов (оптимально)</dd></div>
            <div><dt style={{ fontSize: 13 }}>Внутриартериальный лизис</dt><dd style={{ fontSize: 15 }}>до 6 ч (СМА), до 24 ч (баз. арт.)</dd></div>
            <div><dt style={{ fontSize: 13 }}>Тромбэктомия</dt><dd style={{ fontSize: 15 }}>до 6–24 ч при ASPECTS ≥ 6</dd></div>
          </dl>
        </div>
      </div>
      </div>

      {/* NIHSS */}
      <div className="suite-card">
        <div className="suite-card-title">
          <span>📊 Скринер NIHSS — тяжесть инсульта</span>
          <button className="suite-reset-btn" onClick={() => setNihss(Object.fromEntries(nihssItems.map(f => [f.id, 0])))}>Сбросить</button>
        </div>
        <div className="suite-form-2col">
          {nihssItems.map(f => (
            <div key={f.id} className="suite-field">
              <label>{f.label}</label>
              <select className="suite-select"
                value={nihss[f.id]}
                onChange={e => setNihss(prev => ({ ...prev, [f.id]: parseInt(e.target.value) }))}>
                {f.opts.map((o, i) => (
                  <option key={i} value={i}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">Сумма NIHSS</div>
            <div className="suite-score-big score-sm" style={{ color: '#60A5FA' }}>{nihssScore}</div>
          </div>
          <span className={`suite-risk-badge ${nihssRes.badge}`}>{nihssRes.label}</span>
        </div>
      </div>

      {/* MoCA */}
      <div className="suite-card">
        <div className="suite-card-title">
          <span>🧠 MoCA — скрининг когнитивных нарушений</span>
          <button className="suite-reset-btn" onClick={() => setMoca(Object.fromEntries(MOCA_DOMAINS.map(d => [d.id, 0])))}>Сбросить</button>
        </div>
        <div className="moca-two-col">
          {[0, 1].map(col => (
            <div key={col} className="moca-col">
              {MOCA_DOMAINS.slice(col * 4, col * 4 + 4).map(d => (
                <div key={d.id} className="moca-row">
                  <span className="moca-label">{d.label}</span>
                  <div className="moca-stepper">
                    <button className="moca-stepper-btn" onClick={() => stepMoca(d.id, -1, d.max)}>−</button>
                    <span className="moca-stepper-val">{moca[d.id]}<span className="moca-stepper-max">/{d.max}</span></span>
                    <button className="moca-stepper-btn" onClick={() => stepMoca(d.id, +1, d.max)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="suite-result-banner" style={{ justifyContent: 'flex-end', borderTop: `3px solid ${mocaRes.badge === 'badge-green' ? '#34D399' : mocaRes.badge === 'badge-red' ? '#F87171' : '#FBBF24'}`, borderRadius: 0, background: 'none', padding: '12px 0 0 0', marginTop: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div className="suite-score-label">MoCA</div>
            <div className="suite-score-big score-sm" style={{ color: mocaRes.badge === 'badge-green' ? '#34D399' : mocaRes.badge === 'badge-red' ? '#F87171' : '#FBBF24' }}>{mocaScore}/30</div>
          </div>
          <div>
            <span className={`suite-risk-badge ${mocaRes.badge}`} style={{ fontSize: 11, padding: '3px 10px' }}>{mocaRes.label}</span>
            <div className="suite-advice" style={{ fontSize: 12 }}>{mocaRes.advice}</div>
          </div>
        </div>
      </div>

    </div>
  )
}
