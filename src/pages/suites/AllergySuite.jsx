import { useState } from 'react'
import './suites.css'

const ANAPH_STEPS = [
  { num: 1, color: '#DC2626', text: 'Адреналин 0.3–0.5 мг в/м (бедро, середина)', sub: 'Дети: 0.01 мг/кг, макс 0.5 мг. Повторить через 5–15 мин при необходимости.' },
  { num: 2, color: '#D97706', text: 'Положение: лёжа, ноги приподняты', sub: 'Потеря сознания — восстановительное положение. Рвота — на боку. Одышка — полусидя.' },
  { num: 3, color: '#2563EB', text: 'Вызвать СМП. Мониторинг АД, ЧСС, SpO₂', sub: 'Венозный доступ. Оксигенотерапия при SpO₂ < 92%. При остановке — СЛР.' },
  { num: 4, color: '#7C3AED', text: 'ГКС: дексаметазон 8 мг или МП 125 мг в/в', sub: 'Дополнительно к адреналину — для предотвращения второй волны (через 4–12 ч).' },
  { num: 5, color: '#065F46', text: 'АГП I поколения: хлоропирамин 20 мг в/м', sub: 'Вспомогательная терапия после адреналина. Не заменяет адреналин!' },
]

const ACT_QUESTIONS = [
  {
    q: 'Как часто астма мешала обычной деятельности за последние 4 недели?',
    opts: ['Всё время', 'Очень часто', 'Иногда', 'Редко', 'Никогда'],
  },
  {
    q: 'Как часто была одышка за последние 4 недели?',
    opts: ['> 1 раза в день', '1 раз в день', '3–6 раз в неделю', '1–2 раза в неделю', 'Ни разу'],
  },
  {
    q: 'Как часто симптомы будили вас ночью или рано утром?',
    opts: ['≥ 4 ночей в нед.', '2–3 ночи в нед.', '1 раз в нед.', '1–2 раза за 4 нед.', 'Ни разу'],
  },
  {
    q: 'Как часто использовали ингалятор-бронхолитик (КДБА)?',
    opts: ['≥ 3 раз в день', '1–2 раза в день', '2–3 раза в нед.', '≤ 1 раза в нед.', 'Ни разу'],
  },
  {
    q: 'Как вы оцениваете контроль астмы за последние 4 недели?',
    opts: ['Не контролировалась', 'Плохо', 'В некоторой степени', 'Хорошо', 'Полностью'],
  },
]

function actResult(score) {
  if (score === 25) return { label: 'Полный контроль',   badge: 'badge-green',  advice: 'Поддерживающая терапия без изменений.' }
  if (score >= 20)  return { label: 'Хороший контроль',  badge: 'badge-green',  advice: 'Контроль достигнут. Рассмотреть снижение ступени через 3 мес.' }
  if (score >= 16)  return { label: 'Частичный контроль',badge: 'badge-yellow', advice: 'Проверить технику ингаляции и приверженность. Обсудить повышение ступени.' }
  return                   { label: 'Не контролируется', badge: 'badge-red',    advice: 'Повышение ступени терапии. Исключить триггеры. Направление к специалисту.' }
}

function pefResult(pct) {
  if (pct >= 80) return { zone: 'Зелёная зона', badge: 'badge-green',  advice: 'Контроль достигнут. Продолжить текущую терапию.' }
  if (pct >= 50) return { zone: 'Жёлтая зона',  badge: 'badge-yellow', advice: 'Осторожно. Использовать КДБА, при сохранении > 24 ч — обратиться к врачу.' }
  return                { zone: 'Красная зона',  badge: 'badge-red',    advice: 'Немедленно КДБА, ГКС. Обратиться за медицинской помощью.' }
}

function uas7Result(score) {
  if (score <= 6)  return { label: 'Контроль / ремиссия', badge: 'badge-green',  advice: 'Отличный ответ. Возможна попытка снижения дозы АГП.' }
  if (score <= 15) return { label: 'Лёгкая крапивница',   badge: 'badge-yellow', advice: 'АГП II поколения в стандартной дозе.' }
  if (score <= 27) return { label: 'Умеренная',            badge: 'badge-yellow', advice: 'АГП II поколения × 4 дозы (off-label). При неэффективности — омализумаб.' }
  return                  { label: 'Тяжёлая крапивница',   badge: 'badge-red',    advice: 'Омализумаб 300 мг п/к каждые 4 нед. или иммуносупрессия.' }
}

const GINA_STEPS = [
  { step: 1, note: 'симптомы < 2 раз/мес', preferred: 'ИКС/формотерол низкие дозы по требованию', alt: 'КДБА по требованию (только при очень редких, кратких симптомах)' },
  { step: 2, note: '> 2 раз/мес, не ежедневно', preferred: 'Низкие дозы ИКС ежедневно + КДБА по требованию', alt: 'ИКС/формотерол по требованию или ИКС + АЛТР' },
  { step: 3, note: 'большинство дней, ночные ≥1/нед', preferred: 'Низкие дозы ИКС/ДДБА (фиксированная комбинация)', alt: 'Средние дозы ИКС или низкие ИКС + АЛТР' },
  { step: 4, note: 'неконтролируемая на ст. 3', preferred: 'Средние/высокие дозы ИКС/ДДБА', alt: '+ Тиотропий (спирива-респимат) или + АЛТР' },
  { step: 5, note: 'тяжёлая рефрактерная', preferred: 'Высокие ИКС/ДДБА + фенотипирование', alt: 'Омализумаб (анти-IgE), меполизумаб/бенрализумаб (анти-ИЛ-5), дупилумаб' },
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
  const [actScores,  setActScores]  = useState([5, 5, 5, 5, 5])
  const [pefCurrent, setPefCurrent] = useState(400)
  const [pefBest,    setPefBest]    = useState(500)
  const [uas7Raw,    setUas7Raw]    = useState(4)

  const scorad   = parseFloat((area * 0.2 + intensity * 0.7 + subjective).toFixed(1))
  const res      = scoradResult(scorad)
  const actTotal = actScores.reduce((a, b) => a + b, 0)
  const actRes   = actResult(actTotal)
  const pefPct   = pefBest > 0 ? Math.round((pefCurrent / pefBest) * 100) : 0
  const pefRes   = pefResult(pefPct)
  const uas7     = Math.min(42, Math.max(0, parseInt(uas7Raw) || 0))
  const uas7Res  = uas7Result(uas7)

  return (
    <div className="suite">

      {/* ── Анафилаксия + GINA рядом на десктопе ── */}
      <div className="allergy-two-col">
        <div className="suite-card allergy-col-card">
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

        <div className="suite-card allergy-col-card">
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
      </div>

      {/* ── ACT ── */}
      <div className="suite-card">
        <div className="suite-card-title">✅ ACT — ТЕСТ КОНТРОЛЯ АСТМЫ (последние 4 недели)</div>
        <div className="act-questions">
          {ACT_QUESTIONS.map((q, qi) => (
            <div key={qi} className="act-question">
              <div className="act-q-text">{qi + 1}. {q.q}</div>
              <div className="act-opts">
                {q.opts.map((opt, oi) => (
                  <button key={oi}
                    className={`act-opt-btn ${actScores[qi] === oi + 1 ? 'active' : ''}`}
                    onClick={() => setActScores(prev => prev.map((v, i) => i === qi ? oi + 1 : v))}>
                    <span className="act-opt-label">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="suite-result-banner scorad-result" style={{ marginTop: 14 }}>
          <div className="scorad-score">
            <div className="suite-score-label">ACT</div>
            <div className="suite-score-big" style={{ color: actRes.badge === 'badge-green' ? '#34D399' : actRes.badge === 'badge-red' ? '#F87171' : '#FBBF24' }}>{actTotal}</div>
          </div>
          <div className="scorad-verdict">
            <span className={`suite-risk-badge ${actRes.badge}`}>{actRes.label}</span>
            <p className="suite-advice">{actRes.advice}</p>
          </div>
        </div>
      </div>

      {/* ── Пикфлоуметрия + UAS7 ── */}
      <div className="allergy-pef-uas-row">
        <div className="suite-card">
          <div className="suite-card-title">💨 ПИКФЛОУМЕТРИЯ (ПСВ)</div>
          <div className="suite-grid">
            <div className="suite-field">
              <label>Текущий ПСВ (л/мин)</label>
              <input className="suite-input" type="number" value={pefCurrent}
                onChange={e => setPefCurrent(Math.max(0, parseInt(e.target.value) || 0))} />
            </div>
            <div className="suite-field">
              <label>Лучший ПСВ (л/мин)</label>
              <input className="suite-input" type="number" value={pefBest}
                onChange={e => setPefBest(Math.max(1, parseInt(e.target.value) || 1))} />
            </div>
          </div>
          <div className="allergy-compact-result">
            <span className="allergy-compact-pct" style={{ color: pefRes.badge === 'badge-green' ? '#34D399' : pefRes.badge === 'badge-red' ? '#F87171' : '#FBBF24' }}>{pefPct}%</span>
            <span className={`suite-risk-badge ${pefRes.badge}`}>{pefRes.zone}</span>
            <span className="allergy-compact-advice">{pefRes.advice}</span>
          </div>
        </div>

        <div className="suite-card">
          <div className="suite-card-title">🌿 UAS7 — КОНТРОЛЬ КРАПИВНИЦЫ (0–42)</div>
          <div className="suite-field">
            <label>Сумма за 7 дней (волдыри 0–3 + зуд 0–3 ежедневно)</label>
            <input className="suite-input" type="number" min="0" max="42" value={uas7Raw}
              onChange={e => setUas7Raw(e.target.value)}
              onBlur={() => setUas7Raw(String(Math.min(42, Math.max(0, parseInt(uas7Raw) || 0))))} />
          </div>
          <div className="allergy-uas-hint">
            Волдыри: 0=нет · 1=&lt;20 · 2=20–50 · 3=&gt;50. Зуд: 0=нет · 1=лёгкий · 2=умеренный · 3=сильный.
          </div>
          <div className="allergy-compact-result">
            <span className={`suite-risk-badge ${uas7Res.badge}`}>{uas7Res.label}</span>
            <span className="allergy-compact-advice">{uas7Res.advice}</span>
          </div>
        </div>
      </div>

      {/* ── SCORAD ── */}
      <div className="suite-card allergy-scorad-card">
        <div className="suite-card-title">🧴 ШКАЛА SCORAD — ТЯЖЕСТЬ АТОПИЧЕСКОГО ДЕРМАТИТА</div>
        <p className="allergy-hint">SCORAD = A×0.2 + B×0.7 + C</p>
        <div className="suite-grid scorad-grid">
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
        <div className="suite-result-banner scorad-result">
          <div className="scorad-score">
            <div className="suite-score-label">SCORAD</div>
            <div className="suite-score-big">{scorad}</div>
          </div>
          <div className="scorad-verdict">
            <span className={`suite-risk-badge ${res.badge}`}>{res.label}</span>
            <p className="suite-advice">{res.advice}</p>
          </div>
        </div>
      </div>

    </div>
  )
}
