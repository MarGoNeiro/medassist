import { useState } from 'react'
import './suites.css'

function das28Category(score) {
  if (score < 2.6)  return { label: 'Ремиссия',               badge: 'badge-green',  advice: 'Цель достигнута. Поддерживающая терапия.' }
  if (score < 3.2)  return { label: 'Низкая активность (LDA)', badge: 'badge-green',  advice: 'Цель почти достигнута. Продолжить терапию.' }
  if (score < 5.1)  return { label: 'Умеренная активность',    badge: 'badge-yellow', advice: 'Пересмотреть терапию через 3 мес.' }
  return                   { label: 'Высокая активность',      badge: 'badge-red',    advice: 'Интенсификация: биолог. БПВП или комби БПВП.' }
}

function calcDAS28(tjc, sjc, vas, crp) {
  if (crp <= 0) return null
  return parseFloat((0.56 * Math.sqrt(tjc) + 0.28 * Math.sqrt(sjc) + 0.36 * Math.log(crp + 1) + 0.014 * vas + 0.96).toFixed(2))
}

const JOINT_PAIRS = [
  'Плечевой (оба)', 'Локтевой (оба)', 'Лучезапястный (оба)',
  'II–V пястно-фаланговые (оба)', 'Проксимальные межфаланговые (оба)',
  'Коленный (оба)',
]

const BIOLOGIC = [
  { class: 'иФНО-α',    drugs: 'Этанерцепт, Адалимумаб, Инфликсимаб, Цертолизумаб' },
  { class: 'иИЛ-6',     drugs: 'Тоцилизумаб, Сарилумаб' },
  { class: 'иЯК (JAKi)', drugs: 'Барицитиниб, Тофацитиниб, Упадацитиниб' },
  { class: 'иКД80/86',  drugs: 'Абатацепт' },
  { class: 'иCD20',     drugs: 'Ритуксимаб (резервный при RF+)' },
]

export default function RheumatologySuite() {
  const [tjc,  setTjc]  = useState(4)
  const [sjc,  setSjc]  = useState(3)
  const [vas,  setVas]  = useState(50)
  const [crp,  setCrp]  = useState(15)

  const das28 = calcDAS28(tjc, sjc, vas, crp)
  const dasRes = das28 !== null ? das28Category(das28) : null

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FFF1F2' }}>🦴</div>
        <div>
          <h2>Рабочий кабинет ревматолога</h2>
          <p>DAS28-CRP (активность РА), биологические БПВП, критерии АКР/EULAR</p>
        </div>
      </div>

      {/* DAS28 */}
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
          <div className="suite-result-banner">
            <div>
              <div className="suite-score-label">DAS28-CRP</div>
              <div className="suite-score-big" style={{ color: '#F87171' }}>{das28}</div>
            </div>
            <div style={{}}>
              <span className={`suite-risk-badge ${dasRes.badge}`}>{dasRes.label}</span>
              <div className="suite-advice">{dasRes.advice}</div>
            </div>
          </div>
        )}
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
