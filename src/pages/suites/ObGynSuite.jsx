import { useState } from 'react'
import './suites.css'

const APGAR_CRITERIA = [
  {
    id: 'appearance',
    label: 'Цвет кожи',
    opts: ['Синий / бледный', 'Тело розовое, конечности синие', 'Розовый (весь)'],
  },
  {
    id: 'pulse',
    label: 'ЧСС',
    opts: ['Отсутствует', '< 100 уд/мин', '≥ 100 уд/мин'],
  },
  {
    id: 'grimace',
    label: 'Рефлексы',
    opts: ['Нет реакции', 'Гримаса', 'Кашель / чиханье / крик'],
  },
  {
    id: 'activity',
    label: 'Тонус',
    opts: ['Вялый, атония', 'Снижен, сгибание конечностей', 'Активные движения'],
  },
  {
    id: 'respiration',
    label: 'Дыхание',
    opts: ['Отсутствует', 'Нерегулярное / слабый крик', 'Регулярное / громкий крик'],
  },
]

function apgarResult(score) {
  if (score >= 7) return { label: 'Норма',                      badge: 'badge-green',  advice: 'Состояние удовлетворительное. Стандартный уход.' }
  if (score >= 4) return { label: 'Лёгкая / умеренная асфиксия', badge: 'badge-yellow', advice: 'Тактильная стимуляция. Санация ДП. О₂ через маску. Повторная оценка через 5 мин.' }
  return                 { label: 'Тяжёлая асфиксия',           badge: 'badge-red',    advice: 'Немедленная реанимация: ИВЛ маска/интубация. Компрессии при ЧСС < 60 уд/мин.' }
}

const BISHOP_FIELDS = [
  {
    id: 'dilation', label: 'Раскрытие зева',
    opts: [{ v: 0, l: 'Закрыт (0)' }, { v: 1, l: '1–2 см (1)' }, { v: 2, l: '3–4 см (2)' }, { v: 3, l: '≥ 5 см (3)' }]
  },
  {
    id: 'effacement', label: 'Сглаживание шейки',
    opts: [{ v: 0, l: '0–30% (0)' }, { v: 1, l: '40–50% (1)' }, { v: 2, l: '60–70% (2)' }, { v: 3, l: '≥ 80% (3)' }]
  },
  {
    id: 'station', label: 'Предлежащая часть',
    opts: [{ v: 0, l: '-3 (0)' }, { v: 1, l: '-2 (1)' }, { v: 2, l: '-1/0 (2)' }, { v: 3, l: '+1/+2 (3)' }]
  },
  {
    id: 'consistency', label: 'Консистенция шейки',
    opts: [{ v: 0, l: 'Плотная (0)' }, { v: 1, l: 'Средняя (1)' }, { v: 2, l: 'Мягкая (2)' }]
  },
  {
    id: 'position', label: 'Положение шейки',
    opts: [{ v: 0, l: 'Кзади (0)' }, { v: 1, l: 'По центру (1)' }, { v: 2, l: 'Кпереди (2)' }]
  },
]

function bishopResult(total) {
  if (total <= 5) return { label: 'Шейка незрелая', badge: 'badge-red',    advice: 'Показана подготовка шейки матки (простагландины, мизопростол, механические методы).' }
  if (total <= 8) return { label: 'Шейка созревает', badge: 'badge-yellow', advice: 'Возможна амниотомия + окситоцин при благоприятных условиях.' }
  return               { label: 'Шейка зрелая',    badge: 'badge-green',  advice: 'Шейка готова к родовозбуждению. Прогноз благоприятный.' }
}

const screenings = [
  { title: 'I скрининг: 11–13+6 нед.', desc: 'УЗИ (ТВП, КТР, ЧСС), биохимия (PAPP-A, β-ХГЧ). Расчёт риска ХА.' },
  { title: 'II скрининг: 18–21 нед.',  desc: 'Фетометрия, анатомия плода, плацента, амниотическая жидкость, шейка матки.' },
  { title: 'ОГТТ: 24–28 нед.',         desc: 'Скрининг гестационного диабета. 75 г глюкозы перорально.' },
  { title: 'III скрининг: 32–34 нед.', desc: 'Допплерометрия, оценка ФПК, предлежание, КТГ при показаниях.' },
]

const CONTRA_METHODS = [
  { id: 'coc',     label: 'КОК (комбинированные)' },
  { id: 'pop',     label: 'Прогестин-монопилюля (мини-пили)' },
  { id: 'lng_iud', label: 'Левоноргестрел-ВМС (Мирена)' },
  { id: 'cu_iud',  label: 'Медная ВМС' },
  { id: 'implant', label: 'Имплант (этоногестрел)' },
  { id: 'dmpa',    label: 'Инъекция ДМПА (Депо-Провера)' },
]

const CONTRA_DATA = {
  smoke_u35:      { label: 'Курение, возраст < 35 лет',                           note: 'КОК допустимы с мониторингом. Настоятельно рекомендовать отказ от курения.',                                                        rates: { coc:2, pop:1, lng_iud:1, cu_iud:1, implant:1, dmpa:1 } },
  smoke_o35_lt15: { label: 'Курение < 15 сиг/день, возраст ≥ 35 лет',            note: 'Риски ССО перевешивают пользу КОК. Предпочтительны безэстрогенные методы.',                                                         rates: { coc:3, pop:1, lng_iud:1, cu_iud:1, implant:1, dmpa:1 } },
  smoke_o35_ge15: { label: 'Курение ≥ 15 сиг/день, возраст ≥ 35 лет',            note: 'КОК абсолютно противопоказаны. Высокий риск ИМ, инсульта и тромбоза.',                                                             rates: { coc:4, pop:1, lng_iud:1, cu_iud:1, implant:1, dmpa:1 } },
  endometriosis:  { label: 'Эндометриоз',                                         note: 'КОК и прогестины снижают боль и прогрессирование. Медная ВМС может усиливать дисменорею.',                                        rates: { coc:1, pop:1, lng_iud:1, cu_iud:2, implant:1, dmpa:1 } },
  fibroids:       { label: 'Миома матки (без деформации полости)',                 note: 'При деформации полости матки ВМС устанавливать с осторожностью (кат. 3). КОК снижают менорагию.',                                  rates: { coc:1, pop:1, lng_iud:2, cu_iud:2, implant:1, dmpa:1 } },
  migraine_no:    { label: 'Мигрень без ауры',                                    note: 'КОК допустимы. При появлении ауры на фоне приёма — немедленная отмена.',                                                           rates: { coc:2, pop:1, lng_iud:1, cu_iud:1, implant:1, dmpa:2 } },
  migraine_aura:  { label: 'Мигрень с аурой',                                     note: 'КОК абсолютно противопоказаны: 4–8-кратный рост риска ишемического инсульта.',                                                    rates: { coc:4, pop:2, lng_iud:2, cu_iud:1, implant:2, dmpa:2 } },
  htn_mild:       { label: 'АГ контролируемая (140–159 / 90–99 мм рт.ст.)',       note: 'Эстрогены повышают АД. Предпочтительны безэстрогенные методы.',                                                                    rates: { coc:3, pop:1, lng_iud:1, cu_iud:1, implant:1, dmpa:2 } },
  htn_severe:     { label: 'АГ тяжёлая (≥ 160 / ≥ 100 мм рт.ст.)',               note: 'КОК противопоказаны. Медная ВМС — оптимальный выбор.',                                                                             rates: { coc:4, pop:2, lng_iud:2, cu_iud:1, implant:2, dmpa:3 } },
  dm_no_vasc:     { label: 'СД без сосудистых осложнений',                        note: 'Эстрогены/прогестины незначительно влияют на гликемию при компенсации. Медная ВМС — без ограничений.',                            rates: { coc:2, pop:2, lng_iud:2, cu_iud:1, implant:2, dmpa:2 } },
  dm_vasc:        { label: 'СД с нефро- / ретино- / нейропатией',                 note: 'Эстрогенсодержащие методы значительно ухудшают микроциркуляцию. Медная ВМС предпочтительна.',                                    rates: { coc:3, pop:3, lng_iud:2, cu_iud:1, implant:2, dmpa:3 } },
  dvt_history:    { label: 'ТГВ / ТЭЛА в анамнезе (не на антикоагулянтах)',        note: 'КОК значительно повышают риск повторного тромбоза. Медная ВМС — оптимальный выбор.',                                             rates: { coc:4, pop:2, lng_iud:2, cu_iud:1, implant:2, dmpa:2 } },
  bf_lt6w:        { label: 'Грудное вскармливание < 6 недель',                    note: 'Эстрогены подавляют лактацию. Все методы требуют осторожности в первые 6 недель после родов.',                                    rates: { coc:4, pop:2, lng_iud:2, cu_iud:2, implant:2, dmpa:2 } },
  bf_6w_6m:       { label: 'Грудное вскармливание 6 нед – 6 мес',                 note: 'Прогестины и ВМС предпочтительны. КОК снижают объём и длительность лактации.',                                                   rates: { coc:3, pop:1, lng_iud:1, cu_iud:1, implant:1, dmpa:1 } },
  bf_gt6m:        { label: 'Грудное вскармливание > 6 месяцев',                   note: 'Лактация установлена, КОК допустимы с осторожностью. Прогестины — предпочтительны.',                                             rates: { coc:2, pop:1, lng_iud:1, cu_iud:1, implant:1, dmpa:1 } },
  obesity_30:     { label: 'Ожирение ИМТ 30–34.9',                                note: 'Ожирение само по себе — кат. 2 для КОК. При сочетании с АГ или СД — пересмотреть.',                                             rates: { coc:2, pop:1, lng_iud:1, cu_iud:1, implant:1, dmpa:1 } },
  obesity_35:     { label: 'Ожирение ИМТ ≥ 35',                                   note: 'FSRH расценивает как кат. 3 из-за повышенного риска ВТЭ. КОК — с тщательной оценкой рисков.',                                   rates: { coc:2, pop:1, lng_iud:1, cu_iud:1, implant:1, dmpa:1 } },
  adolescent:     { label: 'Подростки (менархе — 18 лет)',                         note: 'ДМПА нежелательна: снижает МПК в период формирования костей. ВМС — кат. 2 (нерожавшие, технические трудности).',                rates: { coc:1, pop:1, lng_iud:2, cu_iud:2, implant:1, dmpa:2 } },
  perimenopause:  { label: 'Перименопауза (≥ 40 лет, без других факторов риска)', note: 'Левоноргестрел-ВМС — оптимальна: контрацепция + коррекция менорагии. КОК допустимы у здоровых некурящих до 50 лет.',             rates: { coc:2, pop:1, lng_iud:1, cu_iud:1, implant:1, dmpa:2 } },
}

const CAT_STYLE = {
  1: { bg: '#DCFCE7', color: '#15803D', text: 'Кат. 1 — без ограничений' },
  2: { bg: '#FEF9C3', color: '#92400E', text: 'Кат. 2 — польза > риск' },
  3: { bg: '#FFEDD5', color: '#9A3412', text: 'Кат. 3 — риск > польза' },
  4: { bg: '#FEE2E2', color: '#B91C1C', text: 'Кат. 4 — противопоказано' },
}

function calcEDD(lmpStr) {
  if (!lmpStr) return null
  const lmp = new Date(lmpStr)
  if (isNaN(lmp)) return null
  const edd = new Date(lmp)
  edd.setDate(edd.getDate() + 280)
  return edd
}

function calcGA(lmpStr) {
  if (!lmpStr) return null
  const lmp = new Date(lmpStr)
  const now = new Date()
  const diff = now - lmp
  if (diff < 0) return null
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  return { weeks: Math.floor(totalDays / 7), days: totalDays % 7 }
}

function formatDate(d) {
  if (!d) return '—'
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function ObGynSuite() {
  const [lmp, setLmp]           = useState('')
  const [bishop, setBishop]     = useState({ dilation: 0, effacement: 0, station: 0, consistency: 0, position: 0 })
  const [situation, setSituation] = useState('')
  const [apgar1, setApgar1]     = useState({ appearance: 2, pulse: 2, grimace: 2, activity: 2, respiration: 2 })
  const [apgar5, setApgar5]     = useState({ appearance: 2, pulse: 2, grimace: 2, activity: 2, respiration: 2 })

  const score1 = Object.values(apgar1).reduce((a, b) => a + b, 0)
  const score5 = Object.values(apgar5).reduce((a, b) => a + b, 0)
  const res1   = apgarResult(score1)
  const res5   = apgarResult(score5)

  const edd = calcEDD(lmp)
  const ga  = calcGA(lmp)
  const bishopTotal = Object.values(bishop).reduce((a, b) => a + b, 0)
  const bRes = bishopResult(bishopTotal)

  return (
    <div className="suite">

      {/* ПДР — одна строка во всю ширину, 3 равные колонки */}
      <div className="suite-card" style={{ marginBottom: 12 }}>
        <div className="suite-card-title">📅 Предполагаемая дата родов (ПДР)</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 6 }}>Дата последней менструации</div>
            <input type="date" className="suite-input" value={lmp}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setLmp(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 6 }}>ПДР (Негеле)</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#C084FC' }}>{edd ? formatDate(edd) : '—'}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 6 }}>Срок беременности</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{ga ? `${ga.weeks} нед. ${ga.days} дн.` : '—'}</div>
          </div>
        </div>
      </div>

      {/* Скрининги | Шкала Бишопа */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', marginBottom: 12 }}>

        <div className="suite-card" style={{ flex: 2, marginBottom: 0 }}>
          <div className="suite-card-title">🗓 Обязательные скрининги при беременности</div>
          {screenings.map((s, i) => (
            <div key={i} className="suite-screening-item">
              <div className="suite-screening-dot" style={{ background: '#C084FC' }} />
              <div>
                <div className="suite-screening-title">{s.title}</div>
                <div className="suite-screening-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="suite-card" style={{ flex: 3, marginBottom: 0 }}>
          <div className="suite-card-title">🔢 Шкала Бишопа — зрелость шейки матки</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Левая колонка: 3 поля */}
            <div style={{ flex: 1 }}>
              {BISHOP_FIELDS.slice(0, 3).map(f => (
                <div key={f.id} className="suite-field" style={{ marginBottom: 10 }}>
                  <label>{f.label}</label>
                  <select className="suite-select" value={bishop[f.id]}
                    onChange={e => setBishop(prev => ({ ...prev, [f.id]: parseInt(e.target.value) }))}>
                    {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {/* Правая колонка: 2 поля + результат */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {BISHOP_FIELDS.slice(3).map(f => (
                <div key={f.id} className="suite-field" style={{ marginBottom: 10 }}>
                  <label>{f.label}</label>
                  <select className="suite-select" value={bishop[f.id]}
                    onChange={e => setBishop(prev => ({ ...prev, [f.id]: parseInt(e.target.value) }))}>
                    {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              ))}
              <div className="suite-result-banner" style={{ marginTop: 'auto', justifyContent: 'space-between' }}>
                <div className="suite-score-big" style={{ color: '#C084FC' }}>{bishopTotal}</div>
                <div style={{ textAlign: 'right', flex: 1, marginLeft: 12 }}>
                  <span className={`suite-risk-badge ${bRes.badge}`}>{bRes.label}</span>
                  <div className="suite-advice">{bRes.advice}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Contraceptive selector */}
      <div className="suite-card">
        <div className="suite-card-title">💊 Подбор контрацепции по ситуации (WHO MEC)</div>
        <div className="suite-field">
          <label>Клиническая ситуация / заболевание</label>
          <select className="suite-select" value={situation} onChange={e => setSituation(e.target.value)}>
            <option value="">— Выберите ситуацию —</option>
            <optgroup label="Курение">
              <option value="smoke_u35">Курение, возраст &lt; 35 лет</option>
              <option value="smoke_o35_lt15">Курение &lt; 15 сиг/день, ≥ 35 лет</option>
              <option value="smoke_o35_ge15">Курение ≥ 15 сиг/день, ≥ 35 лет</option>
            </optgroup>
            <optgroup label="Гинекологические заболевания">
              <option value="endometriosis">Эндометриоз</option>
              <option value="fibroids">Миома матки</option>
            </optgroup>
            <optgroup label="Неврологические">
              <option value="migraine_no">Мигрень без ауры</option>
              <option value="migraine_aura">Мигрень с аурой</option>
            </optgroup>
            <optgroup label="Сердечно-сосудистые">
              <option value="htn_mild">АГ контролируемая (140–159 / 90–99)</option>
              <option value="htn_severe">АГ тяжёлая (≥ 160 / ≥ 100)</option>
              <option value="dvt_history">ТГВ / ТЭЛА в анамнезе</option>
            </optgroup>
            <optgroup label="Эндокринные">
              <option value="dm_no_vasc">СД без сосудистых осложнений</option>
              <option value="dm_vasc">СД с нефро- / ретино- / нейропатией</option>
              <option value="obesity_30">Ожирение ИМТ 30–34.9</option>
              <option value="obesity_35">Ожирение ИМТ ≥ 35</option>
            </optgroup>
            <optgroup label="Лактация">
              <option value="bf_lt6w">Грудное вскармливание &lt; 6 недель</option>
              <option value="bf_6w_6m">Грудное вскармливание 6 нед – 6 мес</option>
              <option value="bf_gt6m">Грудное вскармливание &gt; 6 месяцев</option>
            </optgroup>
            <optgroup label="Возраст">
              <option value="adolescent">Подростки (менархе — 18 лет)</option>
              <option value="perimenopause">Перименопауза (≥ 40 лет)</option>
            </optgroup>
          </select>
        </div>

        {situation && (() => {
          const d = CONTRA_DATA[situation]
          return (
            <>
              <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', margin: '8px 0 12px', lineHeight: 1.5 }}>
                {d.note}
              </p>
              <div>
                {CONTRA_METHODS.map((m, i) => {
                  const cat = d.rates[m.id]
                  const s = CAT_STYLE[cat]
                  return (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < CONTRA_METHODS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                      <span style={{ fontSize: 19, color: 'var(--color-text)' }}>{m.label}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, padding: '4px 14px', borderRadius: 20, background: s.bg, color: s.color, flexShrink: 0, marginLeft: 12 }}>{s.text}</span>
                    </div>
                  )
                })}
              </div>
              <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', marginTop: 12, lineHeight: 1.6 }}>
                Источник: WHO Medical Eligibility Criteria for Contraceptive Use, 5th ed. (2015). Кат. 1 — без ограничений · 2 — польза &gt; риск · 3 — риск &gt; польза · 4 — противопоказано.
              </p>
            </>
          )
        })()}
      </div>


      {/* Шкала Апгар */}
      <div className="suite-card">
        <div className="suite-card-title">👶 Шкала Апгар</div>
        <div className="apgar-two-col">
          {[
            { key: 'a1', label: '1 минута',  state: apgar1, set: setApgar1, score: score1, res: res1 },
            { key: 'a5', label: '5 минут',   state: apgar5, set: setApgar5, score: score5, res: res5 },
          ].map(({ key, label, state, set, score, res }) => {
            const col = res.badge === 'badge-green' ? '#34D399' : res.badge === 'badge-red' ? '#F87171' : '#FBBF24'
            return (
              <div key={key} className="apgar-col">
                <div className="apgar-col-title">{label}</div>
                {APGAR_CRITERIA.map(c => (
                  <div key={c.id} className="apgar-row">
                    <div className="apgar-row-label">{c.label}</div>
                    <div className="apgar-row-hint">{c.opts[state[c.id]]}</div>
                    <div className="apgar-btns">
                      {[0, 1, 2].map(v => (
                        <button key={v}
                          className={`apgar-btn ${state[c.id] === v ? 'active' : ''}`}
                          onClick={() => set(prev => ({ ...prev, [c.id]: v }))}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="suite-result-banner" style={{ marginTop: 12 }}>
                  <div className="suite-score-big" style={{ color: col }}>{score}</div>
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <span className={`suite-risk-badge ${res.badge}`}>{res.label}</span>
                    <div className="suite-advice" style={{ marginTop: 4 }}>{res.advice}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
