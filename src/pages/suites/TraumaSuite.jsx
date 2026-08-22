import { useState } from 'react'
import './suites.css'

const DVT_WELLS = [
  { id: 'active_cancer',    label: 'Активная опухоль (лечение < 6 мес. / паллиативная)', pts: 1 },
  { id: 'paralysis',        label: 'Паралич, парез или иммобилизация н/к (гипс)',         pts: 1 },
  { id: 'bed_rest',         label: 'Постельный режим > 3 дней или хирургия < 12 нед.',   pts: 1 },
  { id: 'tenderness',       label: 'Болезненность по ходу глубоких вен н/к',              pts: 1 },
  { id: 'swelling',         label: 'Отёк всей нижней конечности',                         pts: 1 },
  { id: 'calf_swelling',    label: 'Отёк голени > 3 см vs. здоровой',                    pts: 1 },
  { id: 'pitting',          label: 'Отёк со вдавлением (только поражённая н/к)',          pts: 1 },
  { id: 'collateral',       label: 'Расширение коллатеральных вен (не варикозных)',        pts: 1 },
  { id: 'prev_dvt',         label: 'ТГВ в анамнезе',                                      pts: 1 },
  { id: 'alt_diagnosis',    label: 'Другой диагноз столь же или более вероятен',          pts: -2 },
]

function wellsDvtResult(score) {
  if (score <= 0) return { label: 'Низкая вероятность ТГВ', badge: 'badge-green',  advice: 'D-димер. Если нормальный – ТГВ исключён.' }
  if (score <= 1) return { label: 'Умеренная вероятность',  badge: 'badge-yellow', advice: 'D-димер. При повышении → УЗДГ вен н/к.' }
  return               { label: 'Высокая вероятность ТГВ', badge: 'badge-red',    advice: 'УЗДГ вен н/к немедленно. Начать антикоагулянты.' }
}

const AO_GUIDE = [
  { type: 'A (простой)',     sub: 'A1 – клиновидный',              color: '#34D399' },
  { type: 'A (простой)',     sub: 'A2 – вколоченный',              color: '#34D399' },
  { type: 'A (простой)',     sub: 'A3 – многооскольчатый простой', color: '#34D399' },
  { type: 'B (частичный)',   sub: 'B1 – медиальный клин',          color: '#FBBF24' },
  { type: 'B (частичный)',   sub: 'B2 – боковой клин',             color: '#FBBF24' },
  { type: 'B (частичный)',   sub: 'B3 – фрагментированный клин',   color: '#FBBF24' },
  { type: 'C (сложный)',     sub: 'C1 – полный простой',           color: '#F87171' },
  { type: 'C (сложный)',     sub: 'C2 – сложный сегментарный',     color: '#F87171' },
  { type: 'C (сложный)',     sub: 'C3 – полный многооскольчатый',  color: '#F87171' },
]

const GUSTILO = [
  { type: 'I',    desc: 'Рана < 1 см, чистая, мин. контаминация',                   infection: '0–2%',   color: '#34D399' },
  { type: 'II',   desc: 'Рана 1–10 см, умеренный ушиб мягких тканей',               infection: '2–10%',  color: '#FBBF24' },
  { type: 'IIIA', desc: 'Рана > 10 см, адекватное покрытие кости',                  infection: '7%',     color: '#FB923C' },
  { type: 'IIIB', desc: 'Массивная травма МТ, оголение кости, требует пластики',     infection: '10–50%', color: '#F87171' },
  { type: 'IIIC', desc: 'Сосудистая травма, требует реконструкции',                  infection: '25–50%', color: '#EF4444' },
]

export default function TraumaSuite() {
  const [wells, setWells] = useState(Object.fromEntries(DVT_WELLS.map(f => [f.id, false])))

  const wellsScore = DVT_WELLS.reduce((s, f) => s + (wells[f.id] ? f.pts : 0), 0)
  const wellsRes   = wellsDvtResult(wellsScore)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#F0FFF4' }}>🦴</div>
        <div>
          <h2>Кабинет травматолога-ортопеда</h2>
          <p>Wells DVT (тромбоз вен), классификация AO/OTA, Gustilo-Anderson</p>
        </div>
      </div>

      {/* Wells DVT */}
      <div className="suite-card">
        <div className="suite-card-title">
          <span>🩸 Wells – вероятность ТГВ нижних конечностей</span>
          <button className="suite-reset-btn" onClick={() => setWells(Object.fromEntries(DVT_WELLS.map(f => [f.id, false])))}>Сбросить</button>
        </div>
        {DVT_WELLS.map(f => (
          <button key={f.id} className="suite-toggle-row" onClick={() => setWells(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
            <span className="suite-toggle-label" style={{ color: f.pts < 0 ? '#F87171' : 'var(--color-text)' }}>
              {f.label} <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>[{f.pts > 0 ? '+' : ''}{f.pts}]</span>
            </span>
            <div className={`suite-toggle ${wells[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
        ))}
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">Wells DVT</div>
            <div className="suite-score-big" style={{ color: '#60A5FA' }}>{wellsScore}</div>
          </div>
          <div style={{ flex: 1 }}>
            <span className={`suite-risk-badge ${wellsRes.badge}`}>{wellsRes.label}</span>
            <div className="suite-advice">{wellsRes.advice}</div>
          </div>
        </div>
      </div>

      {/* AO */}
      <div className="suite-card">
        <div className="suite-card-title">📋 Классификация AO/OTA переломов</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {AO_GUIDE.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: r.color, minWidth: 70, flexShrink: 0 }}>{r.type}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{r.sub}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, padding: '8px 12px', background: '#EFF6FF', borderRadius: 8 }}>
          <p style={{ fontSize: 11, color: '#1D4ED8', lineHeight: 1.4 }}>
            Система: 2 цифры (кость · сегмент) + A/B/C (простой/частичный/сложный) + 1–3 подгруппа. Пример: 32-A1 = диафиз бедра, простой клиновидный.
          </p>
        </div>
      </div>

      {/* Gustilo */}
      <div className="suite-card">
        <div className="suite-card-title">🩹 Классификация открытых переломов Gustilo-Anderson</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {GUSTILO.map((g, i) => (
            <div key={i} style={{ padding: '8px 10px', background: 'var(--color-bg)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 900, fontSize: 13, color: g.color, minWidth: 36, flexShrink: 0 }}>Тип {g.type}</span>
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-text)', lineHeight: 1.4 }}>{g.desc}</div>
                <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>Риск инф. {g.infection}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
