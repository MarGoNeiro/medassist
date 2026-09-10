import { useState } from 'react'
import './suites.css'

function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Дефицит массы тела', badge: 'badge-yellow' }
  if (bmi < 25.0) return { label: 'Норма',               badge: 'badge-green' }
  if (bmi < 30.0) return { label: 'Избыточная масса',    badge: 'badge-yellow' }
  if (bmi < 35.0) return { label: 'Ожирение I',          badge: 'badge-red' }
  if (bmi < 40.0) return { label: 'Ожирение II',         badge: 'badge-red' }
  return                 { label: 'Ожирение III (морбидное)', badge: 'badge-red' }
}

const DM_CRITERIA = [
  { label: 'Глюкоза натощак',      norm: '< 6.1',      pre: '6.1–6.9 (НГН)',  dm: '≥ 7.0' },
  { label: 'Глюкоза через 2ч ОГТТ', norm: '< 7.8',    pre: '7.8–11.0 (НТГ)', dm: '≥ 11.1' },
  { label: 'HbA1c',                norm: '< 6.0%',     pre: '6.0–6.4%',       dm: '≥ 6.5%' },
  { label: 'Случайная глюкоза',    norm: '—',          pre: '—',              dm: '≥ 11.1 + симптомы' },
]

const HBA1C_TARGETS = [
  { group: 'Молодые, нет ССЗ, нет риска ГГ',                       target: '< 6.5%', badge: 'badge-green' },
  { group: 'Большинство пациентов (стандарт)',                       target: '< 7.0%', badge: 'badge-green' },
  { group: 'Пожилые 65+, умеренный риск ГГ',                        target: '< 7.5%', badge: 'badge-yellow' },
  { group: 'Пожилые с тяжёлыми ГГ / ССЗ / деменция',               target: '< 8.0%', badge: 'badge-yellow' },
  { group: 'ХБП 4–5 / ХСН / терминальные состояния',               target: '< 8.5%', badge: 'badge-red' },
]

const THYROID_REF = [
  { name: 'ТТГ',          range: '0.27–4.2 мЕд/л',   note: 'Первичный скрининг' },
  { name: 'Св. Т4',       range: '9–20 пмоль/л',      note: 'Контроль при изменённом ТТГ' },
  { name: 'Св. Т3',       range: '2.6–5.7 пмоль/л',  note: 'При конверсионной патологии' },
  { name: 'АТ к ТПО',     range: '< 34 МЕ/мл',       note: 'Аутоиммунный тиреоидит' },
  { name: 'АТ к ТГ',      range: '< 115 МЕ/мл',      note: 'Тиреоидит Хашимото' },
  { name: 'Кальцитонин',  range: '< 5.8 (м) / < 3.4 (ж) пг/мл', note: 'Медуллярный рак ЩЖ' },
]

export default function EndocrinologySuite() {
  const [weight, setWeight] = useState(80)
  const [height, setHeight] = useState(170)

  const bmiVal = height > 0 ? parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)) : 0
  const bmiCat = bmiVal > 0 ? bmiCategory(bmiVal) : null

  return (
    <div className="suite">

      {/* BMI */}
      <div className="suite-card">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
          <div className="suite-field" style={{ flex: 1, minWidth: 100, marginBottom: 0 }}>
            <label>Вес (кг)</label>
            <input className="suite-input" type="number" step="0.5" value={weight}
              onChange={e => setWeight(Math.max(1, parseFloat(e.target.value) || 0))} />
          </div>
          <div className="suite-field" style={{ flex: 1, minWidth: 100, marginBottom: 0 }}>
            <label>Рост (см)</label>
            <input className="suite-input" type="number" value={height}
              onChange={e => setHeight(Math.max(1, parseInt(e.target.value) || 0))} />
          </div>
          {bmiVal > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 2 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#FB923C' }}>{bmiVal}</span>
              <span className={`suite-risk-badge ${bmiCat.badge}`}>{bmiCat.label}</span>
            </div>
          )}
        </div>
      </div>

      <div className="endo-dm-row">

        {/* Diagnostic criteria */}
        <div className="suite-card endo-dm-criteria">
          <div className="suite-card-title">🩸 Критерии диагностики СД и преддиабета (ммоль/л)</div>
          <table className="suite-table">
            <thead>
              <tr><th>Показатель</th><th style={{ color: '#34D399' }}>Норма</th><th style={{ color: '#FBBF24' }}>Преддиабет</th><th style={{ color: '#F87171' }}>СД</th></tr>
            </thead>
            <tbody>
              {DM_CRITERIA.map((r, i) => (
                <tr key={i}>
                  <td className="col-time">{r.label}</td>
                  <td style={{ padding: '9px 8px', color: '#34D399', fontWeight: 600 }}>{r.norm}</td>
                  <td style={{ padding: '9px 8px', color: '#FBBF24', fontWeight: 600 }}>{r.pre}</td>
                  <td style={{ padding: '9px 8px', color: '#F87171', fontWeight: 600 }}>{r.dm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Target HbA1c */}
        <div className="suite-card endo-dm-targets">
          <div className="suite-card-title">🎯 Целевой HbA1c по группам пациентов (СД2)</div>
          {HBA1C_TARGETS.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < HBA1C_TARGETS.length - 1 ? '1px solid var(--color-border)' : 'none', gap: 12 }}>
              <span style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.4 }}>{t.group}</span>
              <span className={`suite-risk-badge ${t.badge}`} style={{ flexShrink: 0, fontSize: 13, padding: '4px 12px' }}>{t.target}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Thyroid reference */}
      <div className="suite-card">
        <div className="suite-card-title">🦋 Нормы гормонов щитовидной железы</div>
        <table className="suite-table" style={{ width: '100%', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '40%' }} />
          </colgroup>
          <thead>
            <tr><th>Показатель</th><th>Норма</th><th>Применение</th></tr>
          </thead>
          <tbody>
            {THYROID_REF.map((r, i) => (
              <tr key={i}>
                <td className="col-time">{r.name}</td>
                <td className="col-drug">{r.range}</td>
                <td className="col-note">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
