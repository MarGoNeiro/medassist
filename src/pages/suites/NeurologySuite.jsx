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

const nihssItems = [
  { id: 'loc',       label: 'Уровень сознания',       max: 3 },
  { id: 'gaze',      label: 'Взор (горизонтальный)',   max: 2 },
  { id: 'visual',    label: 'Поля зрения',             max: 3 },
  { id: 'facial',    label: 'Мимическая мускулатура',  max: 3 },
  { id: 'motorL',    label: 'Двигательная рука L',     max: 4 },
  { id: 'motorR',    label: 'Двигательная рука R',     max: 4 },
  { id: 'motorLegL', label: 'Двигательная нога L',     max: 4 },
  { id: 'motorLegR', label: 'Двигательная нога R',     max: 4 },
  { id: 'ataxia',    label: 'Атаксия в конечностях',   max: 2 },
  { id: 'sensory',   label: 'Чувствительность',        max: 2 },
  { id: 'language',  label: 'Речь (афазия)',            max: 3 },
  { id: 'dysarthria', label: 'Дизартрия',              max: 2 },
  { id: 'neglect',   label: 'Игнорирование/Гемиинопсия', max: 2 },
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

  const abcdScore = Object.values(abcd2).reduce((a, b) => a + b, 0)
  const abcdRes   = abcd2Risk(abcdScore)

  const nihssScore = Object.values(nihss).reduce((a, b) => a + b, 0)
  const nihssRes   = nihssSeverity(nihssScore)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#EFF6FF' }}>🧠</div>
        <div>
          <h2>Рабочий кабинет невролога</h2>
          <p>ABCD² (риск инсульта после ТИА) и скринер NIHSS</p>
        </div>
      </div>

      {/* ABCD2 */}
      <div className="suite-card">
        <div className="suite-card-title">⚠️ Шкала ABCD² — риск инсульта после ТИА</div>
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
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">ABCD² Score</div>
            <div className="suite-score-big" style={{ color: '#60A5FA' }}>{abcdScore}</div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${abcdRes.badge}`}>{abcdRes.label} · {abcdRes.pct}</span>
            <div className="suite-advice">{abcdRes.advice}</div>
          </div>
        </div>
      </div>

      {/* NIHSS */}
      <div className="suite-card">
        <div className="suite-card-title">📊 Скринер NIHSS — тяжесть инсульта</div>
        <div className="suite-grid">
          {nihssItems.map(f => (
            <div key={f.id} className="suite-field">
              <label>{f.label}</label>
              <select className="suite-select"
                value={nihss[f.id]}
                onChange={e => setNihss(prev => ({ ...prev, [f.id]: parseInt(e.target.value) }))}>
                {Array.from({ length: f.max + 1 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">Сумма NIHSS</div>
            <div className="suite-score-big" style={{ color: '#60A5FA' }}>{nihssScore}</div>
          </div>
          <span className={`suite-risk-badge ${nihssRes.badge}`}>{nihssRes.label}</span>
        </div>
      </div>

      {/* Quick reference */}
      <div className="suite-card">
        <div className="suite-card-title">📖 Тромболизис — окно терапии</div>
        <div className="suite-cheatsheet">
          <div className="suite-cheatsheet-title">Временные критерии rt-PA / Альтеплаза</div>
          <dl className="suite-cheatsheet-grid" style={{ gap: 12 }}>
            <div><dt>Ишемический инсульт</dt><dd>до 4,5 ч от начала симптомов</dd></div>
            <div><dt>NIHSS для тромболизиса</dt><dd>4–25 баллов (оптимально)</dd></div>
            <div><dt>Внутриартериальный лизис</dt><dd>до 6 ч (СМА), до 24 ч (баз. арт.)</dd></div>
            <div><dt>Тромбэктомия</dt><dd>до 6–24 ч при ASPECTS ≥ 6</dd></div>
          </dl>
        </div>
      </div>
    </div>
  )
}
