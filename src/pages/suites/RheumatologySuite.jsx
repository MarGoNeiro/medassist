import { useState } from 'react'
import './suites.css'

function das28Category(score) {
  if (score < 2.6) return { label: 'Ремиссия',               badge: 'badge-green',  advice: 'Цель достигнута. Поддерживающая терапия.' }
  if (score < 3.2) return { label: 'Низкая активность (LDA)', badge: 'badge-green',  advice: 'Цель почти достигнута. Продолжить терапию.' }
  if (score < 5.1) return { label: 'Умеренная активность',    badge: 'badge-yellow', advice: 'Пересмотреть терапию через 3 мес.' }
  return                  { label: 'Высокая активность',      badge: 'badge-red',    advice: 'Интенсификация: биолог. БПВП или комби БПВП.' }
}

function calcDAS28(tjc, sjc, vas, crp) {
  if (crp <= 0) return null
  return parseFloat((0.56 * Math.sqrt(tjc) + 0.28 * Math.sqrt(sjc) + 0.36 * Math.log(crp + 1) + 0.014 * vas + 0.96).toFixed(2))
}

const ACR_DOMAINS = [
  {
    label: 'Суставы',
    opts: [
      { text: '1 крупный сустав',                      score: 0 },
      { text: '2–10 крупных суставов',                  score: 1 },
      { text: '1–3 мелких сустава',                     score: 2 },
      { text: '4–10 мелких суставов',                   score: 3 },
      { text: '>10 суставов (включая ≥1 мелкий)',       score: 5 },
    ],
  },
  {
    label: 'Серология (РФ / АЦЦП)',
    opts: [
      { text: 'Оба отрицательные',          score: 0 },
      { text: 'Низкий позитив (≤3× нормы)', score: 2 },
      { text: 'Высокий позитив (>3× нормы)', score: 3 },
    ],
  },
  {
    label: 'Острофазовые показатели (СРБ / СОЭ)',
    opts: [
      { text: 'Норма',    score: 0 },
      { text: 'Повышены', score: 1 },
    ],
  },
  {
    label: 'Длительность симптомов',
    opts: [
      { text: '< 6 недель', score: 0 },
      { text: '≥ 6 недель', score: 1 },
    ],
  },
]

function acrResult(score) {
  if (score >= 6) return { label: 'РА подтверждён (≥6/10)', badge: 'badge-red',   advice: 'Критерии ACR/EULAR 2010 выполнены. Начать БПВП (метотрексат).' }
  return               { label: `РА не подтверждён (${score}/10)`, badge: 'badge-green', advice: 'Критерии не выполнены. Дообследование или наблюдение.' }
}

const SLEDAI_ITEMS = [
  { label: 'Судороги',                                    weight: 8 },
  { label: 'Психоз',                                      weight: 8 },
  { label: 'Органический мозговой синдром',               weight: 8 },
  { label: 'Нарушение зрения',                            weight: 8 },
  { label: 'Поражение черепных нервов',                   weight: 8 },
  { label: 'Волчаночная головная боль',                   weight: 8 },
  { label: 'ЦВА (новое нарушение мозг. кровообращения)',  weight: 8 },
  { label: 'Васкулит',                                    weight: 8 },
  { label: 'Артрит (≥2 сустава с болью и отёком)',        weight: 4 },
  { label: 'Миозит',                                      weight: 4 },
  { label: 'Цилиндры в моче',                             weight: 4 },
  { label: 'Гематурия (>5 эр/п.з., нет МКБ)',            weight: 4 },
  { label: 'Протеинурия >0.5 г/сут',                     weight: 4 },
  { label: 'Пиурия (>5 лейк/п.з., нет инфекции)',        weight: 4 },
  { label: 'Новая сыпь',                                  weight: 2 },
  { label: 'Алопеция (новая)',                            weight: 2 },
  { label: 'Язвы слизистых',                             weight: 2 },
  { label: 'Плеврит',                                    weight: 2 },
  { label: 'Перикардит',                                  weight: 2 },
  { label: 'Снижение комплемента (С3, С4, СН50)',         weight: 2 },
  { label: 'Повышение анти-dsDNA',                        weight: 2 },
  { label: 'Лихорадка >38°С (без инфекции)',              weight: 1 },
  { label: 'Тромбоцитопения <100×10⁹/л',                 weight: 1 },
  { label: 'Лейкопения <3×10⁹/л',                        weight: 1 },
]

function sledaiResult(score) {
  if (score === 0) return { label: 'Нет активности',          badge: 'badge-green',  advice: 'Ремиссия. Поддерживающая терапия.' }
  if (score <= 5)  return { label: 'Низкая активность',       badge: 'badge-green',  advice: 'Мониторинг. Поддерживающая терапия.' }
  if (score <= 10) return { label: 'Умеренная активность',    badge: 'badge-yellow', advice: 'Пересмотр терапии. ГКС ± иммуносупрессанты.' }
  if (score <= 19) return { label: 'Высокая активность',      badge: 'badge-red',    advice: 'Интенсификация. ГКС в высоких дозах + иммуносупрессанты.' }
  return                  { label: 'Очень высокая активность', badge: 'badge-red',   advice: 'SLEDAI ≥20. Пульс-терапия ГКС, биологическая терапия.' }
}

const BIOLOGIC = [
  { class: 'иФНО-α',     drugs: 'Этанерцепт, Адалимумаб, Инфликсимаб, Цертолизумаб' },
  { class: 'иИЛ-6',      drugs: 'Тоцилизумаб, Сарилумаб' },
  { class: 'иЯК (JAKi)', drugs: 'Барицитиниб, Тофацитиниб, Упадацитиниб' },
  { class: 'иКД80/86',   drugs: 'Абатацепт' },
  { class: 'иCD20',      drugs: 'Ритуксимаб (резервный при RF+)' },
]

export default function RheumatologySuite() {
  const [tjc, setTjc] = useState(4)
  const [sjc, setSjc] = useState(3)
  const [vas, setVas] = useState(50)
  const [crp, setCrp] = useState(15)
  const [acrVals, setAcrVals] = useState([0, 0, 0, 0])
  const [sledai, setSledai] = useState(Array(24).fill(false))

  const das28   = calcDAS28(tjc, sjc, vas, crp)
  const dasRes  = das28 !== null ? das28Category(das28) : null
  const acrScore = ACR_DOMAINS.reduce((sum, d, i) => sum + (d.opts[acrVals[i]]?.score ?? 0), 0)
  const acrRes  = acrResult(acrScore)
  const sledaiScore = SLEDAI_ITEMS.reduce((sum, item, i) => sum + (sledai[i] ? item.weight : 0), 0)
  const sledaiRes = sledaiResult(sledaiScore)

  return (
    <div className="suite">

      {/* DAS28-CRP */}
      <div className="suite-card">
        <div className="suite-card-title">📊 DAS28-CRP — активность ревматоидного артрита</div>
        <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
          Оценивают 28 суставов: плечевые, локтевые, лучезапястные, II–V ПФС, ПМФС (кроме ДМФ), коленные.
        </p>
        <div className="suite-grid">
          <div className="suite-field">
            <label>Болезненные суставы (TJC28)</label>
            <input className="suite-input" type="number" min="0" max="28" value={tjc}
              onChange={e => setTjc(Math.min(28, Math.max(0, parseInt(e.target.value) || 0)))} />
          </div>
          <div className="suite-field">
            <label>Воспалённые суставы (SJC28)</label>
            <input className="suite-input" type="number" min="0" max="28" value={sjc}
              onChange={e => setSjc(Math.min(28, Math.max(0, parseInt(e.target.value) || 0)))} />
          </div>
          <div className="suite-field">
            <label>Общее самочувствие пациента (VAS 0–100)</label>
            <input className="suite-input" type="number" min="0" max="100" value={vas}
              onChange={e => setVas(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))} />
          </div>
          <div className="suite-field">
            <label>СРБ (мг/л)</label>
            <input className="suite-input" type="number" step="0.5" min="0" value={crp}
              onChange={e => setCrp(Math.max(0, parseFloat(e.target.value) || 0))} />
          </div>
        </div>
        {das28 !== null && (
          <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 12 }}>
            <div>
              <div className="suite-score-label">DAS28-CRP</div>
              <div className="suite-score-big" style={{ color: '#F87171' }}>{das28}</div>
            </div>
            <div>
              <span className={`suite-risk-badge ${dasRes.badge}`}>{dasRes.label}</span>
              <div className="suite-advice">{dasRes.advice}</div>
            </div>
          </div>
        )}
      </div>

      {/* ACR/EULAR 2010 */}
      <div className="suite-card">
        <div className="suite-card-title">🔬 Критерии РА ACR/EULAR 2010</div>
        <div className="suite-grid">
          {ACR_DOMAINS.map((d, i) => (
            <div key={i} className="suite-field">
              <label>{d.label}</label>
              <select className="suite-select" value={acrVals[i]}
                onChange={e => { const a = [...acrVals]; a[i] = parseInt(e.target.value); setAcrVals(a) }}>
                {d.opts.map((o, j) => (
                  <option key={j} value={j}>{o.text} (+{o.score})</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 12 }}>
          <div>
            <div className="suite-score-big" style={{ color: acrScore >= 6 ? '#F87171' : '#34D399' }}>
              {acrScore}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-text-secondary)' }}>/10</span>
            </div>
          </div>
          <div>
            <span className={`suite-risk-badge ${acrRes.badge}`}>{acrRes.label}</span>
            <div className="suite-advice">{acrRes.advice}</div>
          </div>
        </div>
      </div>

      {/* SLEDAI-2K */}
      <div className="suite-card">
        <div className="suite-card-title">🌡️ SLEDAI-2K — активность системной красной волчанки</div>
        <div className="sledai-grid">
          {SLEDAI_ITEMS.map((item, i) => (
            <button key={i} className={`suite-toggle-row ${sledai[i] ? 'active' : ''}`}
              onClick={() => { const a = [...sledai]; a[i] = !a[i]; setSledai(a) }}>
              <span className="suite-toggle-label">
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary)', marginRight: 4 }}>+{item.weight}</span>
                {item.label}
              </span>
              <div className={`suite-toggle ${sledai[i] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
            </button>
          ))}
        </div>
        <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 12 }}>
          <div>
            <div className="suite-score-big" style={{ color: sledaiScore >= 6 ? '#F87171' : '#34D399' }}>{sledaiScore}</div>
          </div>
          <div>
            <span className={`suite-risk-badge ${sledaiRes.badge}`}>{sledaiRes.label}</span>
            <div className="suite-advice">{sledaiRes.advice}</div>
          </div>
        </div>
      </div>

      {/* Biologic DMARD */}
      <div className="suite-card">
        <div className="suite-card-title">💉 Биологические БПВП при РА (EULAR 2022)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BIOLOGIC.map((b, i) => (
            <div key={i} style={{ padding: '8px 10px', background: 'var(--color-bg)', borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-primary)', marginRight: 8 }}>{b.class}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text)' }}>{b.drugs}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, padding: '8px 12px', background: '#EFF6FF', borderRadius: 8 }}>
          <p style={{ fontSize: 11, color: '#1D4ED8', lineHeight: 1.5 }}>
            При неэффективности метотрексата (3–6 мес.) + неблагоприятные факторы (RF/АЦЦП высокий, эрозии) → переход на биологическую терапию или JAK-ингибитор.
          </p>
        </div>
      </div>

    </div>
  )
}
