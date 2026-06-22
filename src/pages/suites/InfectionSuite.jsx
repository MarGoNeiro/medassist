import { useState } from 'react'
import './suites.css'

const QSOFA = [
  { id: 'rr',  label: 'ЧДД ≥ 22 в мин.' },
  { id: 'ams', label: 'Нарушение сознания (GCS < 15)' },
  { id: 'sbp', label: 'АД сист. ≤ 100 мм рт.ст.' },
]

function qsofaResult(score) {
  if (score < 2) return { label: 'Низкий риск сепсиса', badge: 'badge-green',  advice: 'Мониторинг. При ухудшении — переоценить.' }
  return               { label: 'Высокий риск сепсиса', badge: 'badge-red',    advice: 'Сепсис вероятен. Посевы, антибиотики, ИВЛ-подготовка. Оценить SOFA.' }
}

const ANTIBIOTICS = [
  { group: 'Пенициллины (защищ.)', spectrum: 'Гр+, Гр−, анаэробы', examples: 'Амоксициллин/клав., Ампициллин/сульбактам', use: 'Пневмония, ИДМТ, интраабдом.' },
  { group: 'Цефалоспорины III',    spectrum: 'Гр−, Гр+ (частично)', examples: 'Цефтриаксон, Цефотаксим, Цефиксим',        use: 'Пневмония, менингит, UTI' },
  { group: 'Карбапенемы',          spectrum: 'Широкий, включая ESBL', examples: 'Имипенем, Меропенем, Эртапенем',           use: 'Нозок. инфекции, мультирез.' },
  { group: 'Фторхинолоны',         spectrum: 'Гр−, атипичные',       examples: 'Левофлоксацин, Ципрофлоксацин',           use: 'UTI, пневмония, ОКИ (осторожно!)' },
  { group: 'Макролиды',            spectrum: 'Атипичные, Гр+',       examples: 'Азитромицин, Кларитромицин',              use: 'ВП, хламидии, микоплазма' },
  { group: 'Гликопептиды',         spectrum: 'MRSA, Гр+ (устойчивые)', examples: 'Ванкомицин, Тейкопланин',               use: 'MRSA, CLABSI, серьёзные Гр+' },
  { group: 'Метронидазол',         spectrum: 'Анаэробы, простейшие', examples: 'Метронидазол, Тинидазол',                 use: 'Абдом. инфекции, C.diff (совм.)' },
]

const COVID_WATCH = [
  { name: 'SpO₂ < 95%',       action: 'Дотация O₂; оценить КТ грудной клетки' },
  { name: 'ЧДД > 22',         action: 'Оценить тяжесть; >28 → ОРИТ' },
  { name: 'SpO₂ < 93% на O₂', action: 'Прон-позиция; рассмотреть ИВЛ' },
  { name: 'IL-6 > 40 пкг/мл', action: 'Рассмотреть тоцилизумаб (по показаниям)' },
  { name: 'Д-димер > 1000',   action: 'Терапевтическая антикоагуляция (по показаниям)' },
]

export default function InfectionSuite() {
  const [qsofa, setQsofa] = useState({ rr: false, ams: false, sbp: false })

  const qsofaScore = Object.values(qsofa).filter(Boolean).length
  const qsofaRes   = qsofaResult(qsofaScore)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#F0FFF4' }}>🦠</div>
        <div>
          <h2>Рабочий кабинет инфекциониста</h2>
          <p>qSOFA (сепсис), спектр антибиотиков, маркёры тяжести COVID-19</p>
        </div>
      </div>

      {/* qSOFA */}
      <div className="suite-card">
        <div className="suite-card-title">⚠️ qSOFA — скрининг сепсиса</div>
        {QSOFA.map(f => (
          <button key={f.id} className="suite-toggle-row" onClick={() => setQsofa(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
            <span className="suite-toggle-label">{f.label}</span>
            <div className={`suite-toggle ${qsofa[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
        ))}
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">qSOFA</div>
            <div className="suite-score-big" style={{ color: qsofaScore >= 2 ? '#F87171' : '#34D399' }}>{qsofaScore} / 3</div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${qsofaRes.badge}`}>{qsofaRes.label}</span>
            <div className="suite-advice">{qsofaRes.advice}</div>
          </div>
        </div>
      </div>

      {/* Antibiotics */}
      <div className="suite-card">
        <div className="suite-card-title">💊 Спектр антибиотиков — шпаргалка</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ANTIBIOTICS.map((ab, i) => (
            <div key={i} style={{ padding: '8px 10px', background: 'var(--color-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 3 }}>{ab.group}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text)', marginBottom: 2 }}>🎯 {ab.spectrum} · {ab.examples}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>📌 {ab.use}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COVID */}
      <div className="suite-card">
        <div className="suite-card-title">🔴 Маркёры тяжести и триггеры эскалации</div>
        <table className="suite-table">
          <thead>
            <tr><th>Показатель</th><th>Тактика</th></tr>
          </thead>
          <tbody>
            {COVID_WATCH.map((r, i) => (
              <tr key={i}>
                <td className="col-time">{r.name}</td>
                <td className="col-note">{r.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
