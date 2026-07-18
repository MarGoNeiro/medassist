import { useState } from 'react'
import './suites.css'

const ANAPH_STEPS = [
  { num: 1, color: '#DC2626', text: 'Адреналин 0.3–0.5 мг в/м (бедро, середина)', sub: 'Дети: 0.01 мг/кг, макс 0.5 мг. Повторить через 5–15 мин при необходимости.' },
  { num: 2, color: '#D97706', text: 'Положение: лёжа, ноги приподняты', sub: 'Потеря сознания — восстановительное положение. Рвота — на боку. Одышка — полусидя.' },
  { num: 3, color: '#2563EB', text: 'Вызвать СМП. Мониторинг АД, ЧСС, SpO₂', sub: 'Венозный доступ. Оксигенотерапия при SpO₂ < 92%. При остановке — СЛР.' },
  { num: 4, color: '#7C3AED', text: 'ГКС: дексаметазон 8 мг или МП 125 мг в/в', sub: 'Дополнительно к адреналину — для предотвращения второй волны (через 4–12 ч).' },
  { num: 5, color: '#065F46', text: 'АГП I поколения: хлоропирамин 20 мг в/м', sub: 'Вспомогательная терапия после адреналина. Не заменяет адреналин!' },
]

const GINA_STEPS = [
  { step: 1, note: 'симптомы < 2 раз/мес', preferred: 'ИКС/формотерол низкие дозы по требованию', alt: 'КДБА по требованию (только при очень редких, кратких симптомах)' },
  { step: 2, note: '> 2 раз/мес, не ежедневно', preferred: 'Низкие дозы ИКС ежедневно + КДБА по требованию', alt: 'ИКС/формотерол по требованию или ИКС + АЛТР' },
  { step: 3, note: 'большинство дней, ночные ≥1/нед', preferred: 'Низкие дозы ИКС/ДДБА (фиксированная комбинация)', alt: 'Средние дозы ИКС или низкие ИКС + АЛТР' },
  { step: 4, note: 'неконтролируемая на ст. 3', preferred: 'Средние/высокие дозы ИКС/ДДБА', alt: '+ Тиотропий (спирива-респимат) или + АЛТР' },
  { step: 5, note: 'тяжёлая рефрактерная', preferred: 'Высокие ИКС/ДДБА + фенотипирование', alt: 'Омализумаб (анти-IgE), меполизумаб/бенрализумаб (анти-ИЛ-5), дупилумаб' },
]

const AGP = [
  { gen: 'II поколение (предпочтительны)', drugs: 'Цетиризин 10 мг, Лоратадин 10 мг, Дезлоратадин 5 мг, Фексофенадин 120–180 мг, Биластин 20 мг', note: 'Нет значимого седативного эффекта. Для длительной терапии.' },
  { gen: 'I поколение (ограниченно)', drugs: 'Хлоропирамин 25 мг, Клемастин 1 мг, Дифенгидрамин 25–50 мг', note: 'Седация, холинолитические эффекты. Только коротким курсом или парентерально при анафилаксии.' },
]

function scoradResult(s) {
  if (s <= 25) return { label: 'Лёгкое течение', badge: 'badge-green',  advice: 'Эмоленты ежедневно, топические ГКС низкой потентности при обострениях.' }
  if (s <= 50) return { label: 'Среднетяжёлое', badge: 'badge-yellow', advice: 'ТГК средней/высокой потентности, ингибиторы кальциневрина (пимекролимус, такролимус).' }
  return           { label: 'Тяжёлое течение', badge: 'badge-red',    advice: 'Системная терапия: дупилумаб, циклоспорин А 3–5 мг/кг/сут, метотрексат.' }
}

export default function AllergySuite() {
  const [area,       setArea]       = useState(15)
  const [intensity,  setIntensity]  = useState(6)
  const [subjective, setSubjective] = useState(4)

  const scorad = parseFloat((area * 0.2 + intensity * 0.7 + subjective).toFixed(1))
  const res = scoradResult(scorad)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FFF7ED' }}>🌿</div>
        <div>
          <h2>Рабочий кабинет аллерголога-иммунолога</h2>
          <p>Анафилаксия, ступени астмы GINA 2023, шкала SCORAD, антигистаминные</p>
        </div>
      </div>

      {/* ── Анафилаксия ── */}
      <div className="suite-card">
        <div className="suite-card-title">🚨 АНАФИЛАКСИЯ — НЕОТЛОЖНАЯ ПОМОЩЬ</div>
        <div className="allergy-anaph-list">
          {ANAPH_STEPS.map(s => (
            <div key={s.num} className="allergy-anaph-step" style={{ '--step-color': s.color }}>
              <div className="allergy-anaph-num">{s.num}</div>
              <div>
                <div className="allergy-anaph-text">{s.text}</div>
                <div className="allergy-anaph-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GINA ── */}
      <div className="suite-card">
        <div className="suite-card-title">🫁 СТУПЕНЧАТАЯ ТЕРАПИЯ БА (GINA 2023)</div>
        <div className="allergy-gina-list">
          {GINA_STEPS.map(s => (
            <div key={s.step} className="allergy-gina-step">
              <div className="allergy-gina-header">
                <span className="allergy-gina-badge">Ступень {s.step}</span>
                <span className="allergy-gina-note">{s.note}</span>
              </div>
              <div className="allergy-gina-preferred">{s.preferred}</div>
              <div className="allergy-gina-alt">Альт.: {s.alt}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SCORAD ── */}
      <div className="suite-card">
        <div className="suite-card-title">🧴 ШКАЛА SCORAD — ТЯЖЕСТЬ АТОПИЧЕСКОГО ДЕРМАТИТА</div>
        <p className="allergy-hint">SCORAD = A×0.2 + B×0.7 + C</p>
        <div className="suite-grid">
          <div className="suite-field">
            <label>A — Площадь поражения (0–100 %)</label>
            <input className="suite-input" type="number" min="0" max="100"
              value={area} onChange={e => setArea(Math.min(100, Math.max(0, +e.target.value || 0)))} />
          </div>
          <div className="suite-field">
            <label>B — Интенсивность (0–18)</label>
            <input className="suite-input" type="number" min="0" max="18"
              value={intensity} onChange={e => setIntensity(Math.min(18, Math.max(0, +e.target.value || 0)))} />
          </div>
          <div className="suite-field">
            <label>C — Зуд + нарушение сна (0–20)</label>
            <input className="suite-input" type="number" min="0" max="20"
              value={subjective} onChange={e => setSubjective(Math.min(20, Math.max(0, +e.target.value || 0)))} />
          </div>
        </div>
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">SCORAD</div>
            <div className="suite-score-big">{scorad}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={`suite-risk-badge ${res.badge}`}>{res.label}</span>
            <p className="suite-advice">{res.advice}</p>
          </div>
        </div>
      </div>

      {/* ── Антигистаминные ── */}
      <div className="suite-card">
        <div className="suite-card-title">💊 АНТИГИСТАМИННЫЕ ПРЕПАРАТЫ</div>
        <div className="allergy-gina-list">
          {AGP.map(a => (
            <div key={a.gen} className="allergy-gina-step">
              <div className="allergy-gina-badge" style={{ marginBottom: 6 }}>{a.gen}</div>
              <div className="allergy-gina-preferred">{a.drugs}</div>
              <div className="allergy-gina-alt">{a.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
