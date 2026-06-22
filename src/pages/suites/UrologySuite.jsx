import { useState } from 'react'
import './suites.css'

const IPSS_QUESTIONS = [
  { q: 'Ощущение неполного опустошения мочевого пузыря',               id: 'q1' },
  { q: 'Необходимость мочиться чаще чем каждые 2 часа',                id: 'q2' },
  { q: 'Прерывистое, повторное мочеиспускание',                        id: 'q3' },
  { q: 'Невозможность подождать (императивные позывы)',                 id: 'q4' },
  { q: 'Слабая струя мочи',                                            id: 'q5' },
  { q: 'Затруднённое начало мочеиспускания',                           id: 'q6' },
  { q: 'Ночное мочеиспускание (ноктурия): сколько раз за ночь?',       id: 'q7', isNocturia: true },
]

const IPSS_OPTS_USUAL = [
  { v: 0, l: 'Никогда' }, { v: 1, l: '< 1/5 случаев' }, { v: 2, l: '< половины' },
  { v: 3, l: 'Примерно половину' }, { v: 4, l: '> половины' }, { v: 5, l: 'Почти всегда' }
]
const NOCTURIA_OPTS = [
  { v: 0, l: '0 раз' }, { v: 1, l: '1 раз' }, { v: 2, l: '2 раза' },
  { v: 3, l: '3 раза' }, { v: 4, l: '4 раза' }, { v: 5, l: '5+ раз' }
]

function ipssResult(score) {
  if (score <= 7)  return { label: 'Лёгкие симптомы', badge: 'badge-green',  advice: 'Активное наблюдение. Поведенческие меры, питьевой режим.' }
  if (score <= 19) return { label: 'Умеренные симптомы', badge: 'badge-yellow', advice: 'α1-блокатор ± ингибитор 5α-редуктазы. Наблюдение уролога.' }
  return                  { label: 'Тяжёлые симптомы', badge: 'badge-red',   advice: 'Медикаментозная коррекция; при неэффективности — ТУР простаты.' }
}

const KIDNEY_STONES = [
  { type: 'Кальций-оксалатные (70%)', color: '#94A3B8', tips: 'Гидратация 2–3 л/сут. ↓ оксалат в пище (шоколад, орехи). ↓ соли. Тиазиды при гиперкальциурии.' },
  { type: 'Уратные (10%)', color: '#FBBF24', tips: 'Ощелачивание мочи (pH 6.5–7.0). Аллопуринол при гиперурикемии. ↓ пурины.' },
  { type: 'Струвитные (15%)', color: '#F87171', tips: 'Лечить инфекцию мочевых путей. Ацеогидроксамовая кислота. ЧНЛТ/ТУН.' },
  { type: 'Цистиновые (1%)', color: '#C084FC', tips: 'Гидратация > 3 л/сут. D-пеницилламин или тиопронин. Ощелачивание.' },
]

export default function UrologySuite() {
  const [ipss, setIpss] = useState(Object.fromEntries(IPSS_QUESTIONS.map(q => [q.id, 0])))
  const [qol, setQol]   = useState(3)

  const ipssScore = Object.values(ipss).reduce((a, b) => a + b, 0)
  const ipssRes   = ipssResult(ipssScore)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#EFF6FF' }}>💧</div>
        <div>
          <h2>Рабочий кабинет уролога</h2>
          <p>IPSS (симптомы НМП), мочекаменная болезнь, алгоритмы</p>
        </div>
      </div>

      {/* IPSS */}
      <div className="suite-card">
        <div className="suite-card-title">📋 IPSS — симптомы нижних мочевых путей (ДГПЖ)</div>
        {IPSS_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="suite-field" style={{ marginBottom: 10 }}>
            <label>{idx + 1}. {q.q}</label>
            <select className="suite-select" value={ipss[q.id]}
              onChange={e => setIpss(prev => ({ ...prev, [q.id]: parseInt(e.target.value) }))}>
              {(q.isNocturia ? NOCTURIA_OPTS : IPSS_OPTS_USUAL).map(o => (
                <option key={o.v} value={o.v}>{o.l}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="suite-field" style={{ marginTop: 6 }}>
          <label>Качество жизни при данных симптомах (0 — отлично, 6 — ужасно)</label>
          <input type="range" min={0} max={6} value={qol} onChange={e => setQol(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-text-secondary)' }}>
            <span>0 — Отлично</span><span>QoL: {qol}</span><span>6 — Ужасно</span>
          </div>
        </div>
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">IPSS</div>
            <div className="suite-score-big" style={{ color: '#60A5FA' }}>{ipssScore} / 35</div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${ipssRes.badge}`}>{ipssRes.label}</span>
            <div className="suite-advice">{ipssRes.advice}</div>
          </div>
        </div>
      </div>

      {/* Kidney stones */}
      <div className="suite-card">
        <div className="suite-card-title">🪨 Мочекаменная болезнь — по типу камней</div>
        {KIDNEY_STONES.map((s, i) => (
          <div key={i} style={{ marginBottom: 10, padding: '8px 10px', background: 'var(--color-bg)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 3 }}>{s.type}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{s.tips}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
