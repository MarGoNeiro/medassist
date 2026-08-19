import { useState } from 'react'
import './suites.css'

const AUDIT_Q = [
  { q: 'Как часто вы употребляете алкоголь?',                                opts: ['0 — Никогда', '1 — Раз в месяц и реже', '2 — 2–4 раза в месяц', '3 — 2–3 раза в нед.', '4 — 4+ раз в нед.'],         scores: [0,1,2,3,4] },
  { q: 'Сколько стандартных доз алкоголя вы выпиваете за раз?',              opts: ['0 — 1–2 дозы', '1 — 3–4 дозы', '2 — 5–6 доз', '3 — 7–9 доз', '4 — 10 и более'],                                    scores: [0,1,2,3,4] },
  { q: 'Как часто выпиваете 6 и более доз за раз?',                          opts: ['0 — Никогда', '1 — Реже раза в мес.', '2 — Раз в мес.', '3 — Раз в нед.', '4 — Ежедневно'],                         scores: [0,1,2,3,4] },
  { q: 'Как часто не могли остановиться после начала выпивки?',              opts: ['0 — Никогда', '1 — Реже раза в мес.', '2 — Раз в мес.', '3 — Раз в нед.', '4 — Ежедневно'],                         scores: [0,1,2,3,4] },
  { q: 'Как часто из-за алкоголя не выполняли обязательства?',              opts: ['0 — Никогда', '1 — Реже раза в мес.', '2 — Раз в мес.', '3 — Раз в нед.', '4 — Ежедневно'],                         scores: [0,1,2,3,4] },
  { q: 'Как часто нужен алкоголь утром после обильного возлияния?',         opts: ['0 — Никогда', '1 — Реже раза в мес.', '2 — Раз в мес.', '3 — Раз в нед.', '4 — Ежедневно'],                         scores: [0,1,2,3,4] },
  { q: 'Как часто испытывали чувство вины после выпивки?',                  opts: ['0 — Никогда', '1 — Реже раза в мес.', '2 — Раз в мес.', '3 — Раз в нед.', '4 — Ежедневно'],                         scores: [0,1,2,3,4] },
  { q: 'Как часто не могли вспомнить, что было накануне?',                  opts: ['0 — Никогда', '1 — Реже раза в мес.', '2 — Раз в мес.', '3 — Раз в нед.', '4 — Ежедневно'],                         scores: [0,1,2,3,4] },
  { q: 'Получали травмы или причиняли вред другим в связи с алкоголем?',    opts: ['0 — Нет', '2 — Да, но не за последний год', '4 — Да, за последний год'],                                            scores: [0,2,4] },
  { q: 'Рекомендовал ли врач или специалист снизить потребление алкоголя?', opts: ['0 — Нет', '2 — Да, но не за последний год', '4 — Да, за последний год'],                                            scores: [0,2,4] },
]

const CAGE_Q = [
  'Чувствовали ли вы необходимость сократить потребление алкоголя?',
  'Раздражало ли вас, когда окружающие критиковали ваше употребление?',
  'Испытывали ли вы чувство вины в связи с употреблением алкоголя?',
  'Употребляли ли вы алкоголь утром («рюмка с утра») для снятия похмелья?',
]

const FAGER_Q = [
  { q: 'Как скоро после пробуждения вы закуриваете?',              opts: ['3 — В течение 5 мин', '2 — 6–30 мин', '1 — 31–60 мин', '0 — Более 60 мин'], scores: [3,2,1,0] },
  { q: 'Трудно ли воздержаться от курения в запрещённых местах?',  opts: ['1 — Да', '0 — Нет'],                                                          scores: [1,0] },
  { q: 'От какой сигареты труднее всего отказаться?',               opts: ['1 — От первой утренней', '0 — От любой другой'],                              scores: [1,0] },
  { q: 'Сколько сигарет в день вы выкуриваете?',                   opts: ['0 — 10 и менее', '1 — 11–20', '2 — 21–30', '3 — 31+'],                        scores: [0,1,2,3] },
  { q: 'Курите ли чаще в первой половине дня?',                    opts: ['1 — Да', '0 — Нет'],                                                          scores: [1,0] },
  { q: 'Курите ли, если больны и вынуждены лежать в постели?',     opts: ['1 — Да', '0 — Нет'],                                                          scores: [1,0] },
]

function auditCat(s) {
  if (s <= 7)  return { label: 'Безопасное употребление',   badge: 'badge-green',  advice: 'Информирование о безопасных нормах.' }
  if (s <= 15) return { label: 'Рискованное употребление',  badge: 'badge-yellow', advice: 'Краткое консультирование, мотивационное интервью.' }
  if (s <= 19) return { label: 'Вредное употребление',      badge: 'badge-red',    advice: 'Структурированное вмешательство. Наблюдение нарколога.' }
  return             { label: 'Зависимость вероятна',       badge: 'badge-red',    advice: 'Направление на лечение. Детоксикация по показаниям.' }
}

function cageCat(s) {
  if (s === 0) return { label: 'Нет признаков зависимости', badge: 'badge-green',  advice: 'Плановый скрининг при следующем визите.' }
  if (s === 1) return { label: 'Возможная зависимость',     badge: 'badge-yellow', advice: 'Дополнительный расспрос. Провести AUDIT.' }
  return             { label: 'Вероятная зависимость',      badge: 'badge-red',    advice: 'Направление к наркологу. Детоксикация по показаниям.' }
}

function fagerCat(s) {
  if (s <= 2)  return { label: 'Очень слабая зависимость', badge: 'badge-green',  advice: 'НЗТ не обязательна. Поведенческая поддержка.' }
  if (s <= 4)  return { label: 'Слабая зависимость',       badge: 'badge-green',  advice: 'Поведенческая поддержка. НЗТ опционально.' }
  if (s === 5) return { label: 'Средняя зависимость',      badge: 'badge-yellow', advice: 'НЗТ (пластырь / жевательная резинка). Варениклин.' }
  if (s <= 7)  return { label: 'Высокая зависимость',      badge: 'badge-red',    advice: 'Варениклин или комбинация НЗТ. Психологическая поддержка.' }
  return             { label: 'Очень высокая зависимость', badge: 'badge-red',    advice: 'Варениклин + НЗТ. Длительное сопровождение.' }
}

export default function NarcologySuite() {
  const [tab,   setTab]   = useState('audit')
  const [audit, setAudit] = useState(AUDIT_Q.map(() => 0))
  const [cage,  setCage]  = useState(Array(4).fill(-1))
  const [fager, setFager] = useState(FAGER_Q.map(() => 0))

  const auditScore = AUDIT_Q.reduce((sum, q, i) => sum + q.scores[audit[i]], 0)
  const cageScore  = cage.filter(v => v === 1).length
  const fagerScore = FAGER_Q.reduce((sum, q, i) => sum + q.scores[fager[i]], 0)

  const ac = auditCat(auditScore)
  const cc = cageCat(cageScore)
  const fc = fagerCat(fagerScore)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FFF7ED' }}>🧪</div>
        <div>
          <h2>Рабочий кабинет нарколога</h2>
          <p>AUDIT (алкоголь), CAGE, Тест Фагерстрёма (никотин)</p>
        </div>
      </div>

      <div className="suite-card" style={{ padding: '6px' }}>
        <div className="suite-gender-row">
          <button className={`suite-gender-btn ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>AUDIT</button>
          <button className={`suite-gender-btn ${tab === 'cage'  ? 'active' : ''}`} onClick={() => setTab('cage')}>CAGE</button>
          <button className={`suite-gender-btn ${tab === 'fager' ? 'active' : ''}`} onClick={() => setTab('fager')}>Фагерстрём</button>
        </div>
      </div>

      {tab === 'audit' && (
        <div className="suite-card">
          <div className="suite-card-title">🍺 AUDIT — скрининг употребления алкоголя (за последние 12 мес.)</div>
          <div className="suite-form-2col">
            {AUDIT_Q.map((q, qi) => (
              <div key={qi} className="suite-field" style={{ marginBottom: 10 }}>
                <label>{qi + 1}. {q.q}</label>
                <select className="suite-select" value={audit[qi]}
                  onChange={e => { const a = [...audit]; a[qi] = parseInt(e.target.value); setAudit(a) }}>
                  {q.opts.map((opt, oi) => <option key={oi} value={oi}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="suite-result-banner">
            <div>
              <div className="suite-score-label">AUDIT</div>
              <div className="suite-score-big" style={{ color: auditScore >= 16 ? '#F87171' : auditScore >= 8 ? '#FBBF24' : '#34D399' }}>{auditScore}</div>
            </div>
            <div style={{ textAlign: 'right', flex: 1 }}>
              <span className={`suite-risk-badge ${ac.badge}`}>{ac.label}</span>
              <div className="suite-advice">{ac.advice}</div>
            </div>
          </div>
          <button className="suite-reset-btn" style={{ marginTop: 8 }} onClick={() => setAudit(AUDIT_Q.map(() => 0))}>Сбросить</button>
        </div>
      )}

      {tab === 'cage' && (
        <div className="suite-card">
          <div className="suite-card-title">🔍 CAGE — экспресс-скрининг алкогольной зависимости</div>
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            4 вопроса — ответьте «Да» или «Нет»
          </p>
          {CAGE_Q.map((q, qi) => (
            <div key={qi} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: qi < 3 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>{qi + 1}. {q}</span>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button className={`suite-gender-btn ${cage[qi] === 1 ? 'active' : ''}`} style={{ minWidth: 52 }}
                  onClick={() => { const a = [...cage]; a[qi] = 1; setCage(a) }}>Да</button>
                <button className={`suite-gender-btn ${cage[qi] === 0 ? 'active' : ''}`} style={{ minWidth: 52 }}
                  onClick={() => { const a = [...cage]; a[qi] = 0; setCage(a) }}>Нет</button>
              </div>
            </div>
          ))}
          <div className="suite-result-banner" style={{ marginTop: 12 }}>
            <div>
              <div className="suite-score-label">CAGE</div>
              <div className="suite-score-big" style={{ color: cageScore >= 2 ? '#F87171' : cageScore === 1 ? '#FBBF24' : '#34D399' }}>{cageScore} / 4</div>
            </div>
            <div style={{ textAlign: 'right', flex: 1 }}>
              <span className={`suite-risk-badge ${cc.badge}`}>{cc.label}</span>
              <div className="suite-advice">{cc.advice}</div>
            </div>
          </div>
          <button className="suite-reset-btn" style={{ marginTop: 8 }} onClick={() => setCage(Array(4).fill(-1))}>Сбросить</button>
        </div>
      )}

      {tab === 'fager' && (
        <div className="suite-card">
          <div className="suite-card-title">🚬 Тест Фагерстрёма — степень никотиновой зависимости</div>
          <div className="suite-form-2col">
            {FAGER_Q.map((q, qi) => (
              <div key={qi} className="suite-field" style={{ marginBottom: 10 }}>
                <label>{qi + 1}. {q.q}</label>
                <select className="suite-select" value={fager[qi]}
                  onChange={e => { const a = [...fager]; a[qi] = parseInt(e.target.value); setFager(a) }}>
                  {q.opts.map((opt, oi) => <option key={oi} value={oi}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="suite-result-banner">
            <div>
              <div className="suite-score-label">Фагерстрём</div>
              <div className="suite-score-big" style={{ color: fagerScore >= 6 ? '#F87171' : fagerScore >= 3 ? '#FBBF24' : '#34D399' }}>{fagerScore} / 10</div>
            </div>
            <div style={{ textAlign: 'right', flex: 1 }}>
              <span className={`suite-risk-badge ${fc.badge}`}>{fc.label}</span>
              <div className="suite-advice">{fc.advice}</div>
            </div>
          </div>
          <button className="suite-reset-btn" style={{ marginTop: 8 }} onClick={() => setFager(FAGER_Q.map(() => 0))}>Сбросить</button>
        </div>
      )}
    </div>
  )
}
