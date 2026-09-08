import { useState } from 'react'
import './suites.css'

const CURB_FIELDS = [
  { id: 'confusion', label: 'Нарушение сознания (новое)' },
  { id: 'urea',      label: 'Мочевина > 7 ммоль/л' },
  { id: 'rr',        label: 'ЧДД ≥ 30 в мин.' },
  { id: 'bp',        label: 'АД сист. < 90 или диаст. ≤ 60' },
  { id: 'age',       label: 'Возраст ≥ 65 лет' },
]

function curbResult(score) {
  if (score <= 1) return { label: 'Низкий риск',     badge: 'badge-green',  advice: 'Амбулаторно. Летальность < 3%.' }
  if (score === 2) return { label: 'Умеренный риск', badge: 'badge-yellow', advice: 'Рассмотреть госпитализацию. Летальность ≈ 9%.' }
  return               { label: 'Высокий риск',     badge: 'badge-red',    advice: 'Госпитализация. При 4–5 — ОРИТ. Летальность 15–40%.' }
}

const CAT_ITEMS = [
  'Кашель (никогда → всегда)',
  'Мокрота (нет → полная грудь)',
  'Давление в груди (нет → очень сильное)',
  'Одышка при подъёме на 1 этаж (нет → очень выражена)',
  'Ограничение активности дома (нет → полное)',
  'Уверенность выходить из дома (спокоен → не выхожу)',
  'Сон (хороший → очень плохой)',
  'Энергия (много → нет совсем)',
]

function catCategory(score) {
  if (score <= 9)  return { label: 'Минимальное влияние ХОБЛ', badge: 'badge-green' }
  if (score <= 20) return { label: 'Умеренное влияние',         badge: 'badge-yellow' }
  if (score <= 30) return { label: 'Выраженное влияние',        badge: 'badge-red' }
  return                 { label: 'Очень выраженное',           badge: 'badge-red' }
}

const SPIRO_PATTERNS = [
  { pattern: 'Норма',      fev1fvc: '≥ 0.70', fev1: '≥ 80%',              note: 'Нет нарушений' },
  { pattern: 'Обструкция', fev1fvc: '< 0.70', fev1: 'Снижен',             note: 'ХОБЛ, БА, бронхоэктазы' },
  { pattern: 'Рестрикция', fev1fvc: '≥ 0.70', fev1: '< 80%, ФЖЕЛ < 80%', note: 'Фиброз, ожирение, плеврит' },
  { pattern: 'Смешанный',  fev1fvc: '< 0.70', fev1: 'Снижен, ФЖЕЛ < 80%',note: 'Бронхоэктазы + фиброз' },
]

const GOLD_STAGES = [
  { stage: 'GOLD 1', label: 'Лёгкая',        badge: 'badge-green',  fev1: '≥ 80%',       tactics: 'КДБА по требованию. Вакцинация от гриппа и пневмококка.' },
  { stage: 'GOLD 2', label: 'Средняя',        badge: 'badge-yellow', fev1: '50–79%',      tactics: 'ДДБА или ДДХЛ (LABA / LAMA). Лёгочная реабилитация.' },
  { stage: 'GOLD 3', label: 'Тяжёлая',        badge: 'badge-yellow', fev1: '30–49%',      tactics: 'LABA + LAMA. При частых обострениях — + ИГКС.' },
  { stage: 'GOLD 4', label: 'Крайне тяжёлая', badge: 'badge-red',    fev1: '< 30%',       tactics: 'LABA + LAMA + ИГКС. Оценка ДГВЛ. Паллиативная поддержка.' },
]

const MMRC = [
  { grade: '0', desc: 'Одышка только при очень интенсивной нагрузке' },
  { grade: '1', desc: 'Одышка при быстрой ходьбе или подъёме в гору' },
  { grade: '2', desc: 'Идёт медленнее ровесников или останавливается при ходьбе в своём темпе' },
  { grade: '3', desc: 'Останавливается примерно через 100 м или через несколько минут на ровном месте' },
  { grade: '4', desc: 'Одышка не позволяет выйти из дома или появляется при одевании' },
]

const ABE_GROUPS = [
  {
    group: 'A',
    badge: 'badge-green',
    criteria: 'CAT < 10 (или mMRC 0–1) + ≤ 1 обострения без госпитализации',
    therapy: 'LABA или LAMA (монотерапия)',
  },
  {
    group: 'B',
    badge: 'badge-yellow',
    criteria: 'CAT ≥ 10 (или mMRC ≥ 2) + ≤ 1 обострения без госпитализации',
    therapy: 'LABA + LAMA (комбинация)',
  },
  {
    group: 'E',
    badge: 'badge-red',
    criteria: '≥ 2 обострений или ≥ 1 с госпитализацией (любой уровень симптомов)',
    therapy: 'LABA + LAMA, при эозинофилах ≥ 300 — + ИГКС',
  },
]

export default function PulmonologySuite() {
  const [curb, setCurb]     = useState({ confusion: false, urea: false, rr: false, bp: false, age: false })
  const [catScores, setCat] = useState(Array(8).fill(2))

  const curbScore = Object.values(curb).filter(Boolean).length
  const curbRes   = curbResult(curbScore)
  const catTotal  = catScores.reduce((a, b) => a + b, 0)
  const catCat    = catCategory(catTotal)

  return (
    <div className="suite">

      {/* CURB-65 */}
      <div className="suite-card">
          <div className="suite-card-title">🤒 CURB-65 — тяжесть пневмонии</div>
          {CURB_FIELDS.map(f => (
            <button key={f.id} className={`suite-toggle-row ${curb[f.id] ? 'active' : ''}`}
              onClick={() => setCurb(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
              <span className="suite-toggle-label">{f.label}</span>
              <div className={`suite-toggle ${curb[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
            </button>
          ))}
          <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div className="suite-score-big" style={{ color: '#60A5FA' }}>{curbScore}</div>
            </div>
            <div>
              <span className={`suite-risk-badge ${curbRes.badge}`} style={{ fontSize: 11, padding: '3px 10px' }}>{curbRes.label}</span>
              <div className="suite-advice" style={{ fontSize: 13 }}>{curbRes.advice}</div>
            </div>
          </div>
        </div>

      {/* CAT */}
      <div className="suite-card">
        <div className="suite-card-title">📊 CAT Test — влияние ХОБЛ на жизнь (0–40 баллов)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
          {CAT_ITEMS.map((item, idx) => {
            const set = v => { const a = [...catScores]; a[idx] = Math.min(5, Math.max(0, v)); setCat(a) }
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.3 }}>{idx + 1}. {item}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => set(catScores[idx] - 1)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: 18, fontWeight: 700, color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>−</button>
                  <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)', minWidth: 24, textAlign: 'center' }}>{catScores[idx]}</span>
                  <button onClick={() => set(catScores[idx] + 1)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: 18, fontWeight: 700, color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
                  <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>/ 5</span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div className="suite-score-big" style={{ color: '#34D399' }}>{catTotal}</div>
          </div>
          <div>
            <span className={`suite-risk-badge ${catCat.badge}`} style={{ fontSize: 11, padding: '3px 10px' }}>{catCat.label}</span>
          </div>
        </div>
      </div>

      {/* 2×2 grid: Спирометрия | GOLD / mMRC | ABE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        <div className="suite-card">
          <div className="suite-card-title">💨 Интерпретация спирометрии</div>
          <table className="suite-table">
            <thead>
              <tr><th>Паттерн</th><th>ОФВ1/ФЖЕЛ</th><th>ОФВ1%</th><th>Примеры</th></tr>
            </thead>
            <tbody>
              {SPIRO_PATTERNS.map((r, i) => (
                <tr key={i}>
                  <td className="col-time" style={{ minWidth: 80 }}>{r.pattern}</td>
                  <td className="col-drug">{r.fev1fvc}</td>
                  <td style={{ padding: '9px 8px 9px 0', color: 'var(--color-text)', fontSize: 12 }}>{r.fev1}</td>
                  <td className="col-note">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="suite-card">
          <div className="suite-card-title">🫁 GOLD — стадии ХОБЛ (post-BD ОФВ1/ФЖЕЛ &lt; 0.70)</div>
          {GOLD_STAGES.map((g, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < GOLD_STAGES.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>{g.stage} — {g.label}</span>
                <span className={`suite-risk-badge ${g.badge}`} style={{ fontSize: 10, padding: '2px 8px' }}>ОФВ1 {g.fev1}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{g.tactics}</div>
            </div>
          ))}
        </div>

        <div className="suite-card">
          <div className="suite-card-title">😮‍💨 Шкала одышки mMRC</div>
          {MMRC.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < MMRC.length - 1 ? '1px solid var(--color-border)' : 'none', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)', minWidth: 20, lineHeight: 1.3 }}>{m.grade}</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{m.desc}</span>
            </div>
          ))}
        </div>

        <div className="suite-card">
          <div className="suite-card-title">📂 GOLD ABE — группы ХОБЛ (2023)</div>
          {ABE_GROUPS.map((g, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < ABE_GROUPS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>Группа {g.group}</span>
                <span className={`suite-risk-badge ${g.badge}`} style={{ fontSize: 10, padding: '2px 8px' }}>{g.therapy}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{g.criteria}</div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
