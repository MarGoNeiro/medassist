import { useState, useEffect } from 'react'
import './suites.css'

const vaccineSchedule = [
  { age: 'В первые 24 ч',  vaccine: 'Гепатит B (V1)',                          note: 'Профилактика гепатита B' },
  { age: '3–7 дней',       vaccine: 'БЦЖ-М',                                   note: 'Профилактика туберкулёза' },
  { age: '1 месяц',        vaccine: 'Гепатит B (V2)',                           note: 'Вторая доза' },
  { age: '2 месяца',       vaccine: 'Пневмококк (V1), Ротавирус (V1)',          note: 'Пневмония, менингит; ротавирусный гастроэнтерит' },
  { age: '3 месяца',       vaccine: 'АКДС (V1), ИПВ (V1), Хиб (V1), Ротавирус (V2)', note: 'Коклюш, дифтерия, столбняк, полиомиелит, Haemophilus influenzae b' },
  { age: '4,5 месяца',     vaccine: 'АКДС (V2), ИПВ (V2), Хиб (V2), Пневмококк (V2), Ротавирус (V3)', note: 'Повторные дозы' },
  { age: '6 месяцев',      vaccine: 'АКДС (V3), ОПВ (V1), Гепатит B (V3), Хиб (V3)', note: 'Третья вакцинация' },
  { age: '12 месяцев',     vaccine: 'ККП (V1), Ветряная оспа (V1)',             note: 'Корь, краснуха, паротит; ветрянка' },
  { age: '15 месяцев',     vaccine: 'Пневмококк (R1)',                          note: 'Ревакцинация' },
  { age: '18 месяцев',     vaccine: 'АКДС (R1), ОПВ (R1), Хиб (R1)',           note: 'Первая ревакцинация' },
  { age: '20 месяцев',     vaccine: 'ОПВ (R2)',                                 note: 'Вторая ревакцинация полиомиелит' },
  { age: '6 лет',          vaccine: 'ККП (R2)',                                 note: 'Ревакцинация корь, краснуха, паротит' },
  { age: '6–7 лет',        vaccine: 'АДС-М (R2)',                              note: 'Ревакцинация дифтерия, столбняк' },
  { age: '14 лет',         vaccine: 'АДС-М (R3), ОПВ (R3)',                    note: 'Третья ревакцинация' },
  { age: 'Взрослые',       vaccine: 'АДС-М каждые 10 лет, Грипп ежегодно',    note: 'Поддерживающий иммунитет' },
]

// Westley croup score criteria
const WESTLEY = [
  {
    id: 'stridor',
    label: 'Стридор',
    opts: [
      { v: 0, l: 'Отсутствует' },
      { v: 1, l: 'При беспокойстве' },
      { v: 2, l: 'В покое' },
    ],
  },
  {
    id: 'retractions',
    label: 'Втяжение межрёберных промежутков',
    opts: [
      { v: 0, l: 'Отсутствует' },
      { v: 1, l: 'Лёгкое' },
      { v: 2, l: 'Умеренное' },
      { v: 3, l: 'Тяжёлое' },
    ],
  },
  {
    id: 'air',
    label: 'Проведение воздуха',
    opts: [
      { v: 0, l: 'Нормальное' },
      { v: 1, l: 'Снижено' },
      { v: 2, l: 'Резко снижено' },
    ],
  },
  {
    id: 'cyanosis',
    label: 'Цианоз',
    opts: [
      { v: 0, l: 'Отсутствует' },
      { v: 4, l: 'При беспокойстве' },
      { v: 5, l: 'В покое' },
    ],
  },
  {
    id: 'consciousness',
    label: 'Уровень сознания',
    opts: [
      { v: 0, l: 'Норма, в сознании' },
      { v: 5, l: 'Нарушено / дезориентация' },
    ],
  },
]

function westleyResult(score) {
  if (score <= 2) return { label: 'Лёгкий круп',    badge: 'badge-green',  advice: 'Дексаметазон 0.15 мг/кг однократно внутрь. Наблюдение в амбулаторных условиях.' }
  if (score <= 7) return { label: 'Средний круп',   badge: 'badge-yellow', advice: 'Дексаметазон 0.6 мг/кг в/м. Будесонид 2 мг ингаляционно. Наблюдение в стационаре.' }
  return               { label: 'Тяжёлый круп',    badge: 'badge-red',    advice: 'Госпитализация. Адреналин 1 мг/мл (1:1000) ингаляционно 0.5 мл/кг. О₂. Дексаметазон 0.6 мг/кг в/в.' }
}

// WHO 2006 growth reference (P10, P50, P90) — approximate
const CENTILES = {
  boy: [
    { age: 'Новорождённый', w10: 2.9, w50: 3.3, w90: 3.9, h10: 47.5, h50: 49.9, h90: 52.3 },
    { age: '1 месяц',       w10: 3.9, w50: 4.5, w90: 5.2, h10: 52.0, h50: 54.7, h90: 57.4 },
    { age: '3 месяца',      w10: 5.3, w50: 6.4, w90: 7.5, h10: 59.4, h50: 62.0, h90: 64.6 },
    { age: '6 месяцев',     w10: 6.9, w50: 7.9, w90: 9.2, h10: 65.1, h50: 67.6, h90: 70.2 },
    { age: '9 месяцев',     w10: 7.9, w50: 9.2, w90:10.5, h10: 69.7, h50: 72.3, h90: 75.0 },
    { age: '1 год',         w10: 8.6, w50: 9.6, w90:11.1, h10: 73.1, h50: 75.7, h90: 78.6 },
    { age: '2 года',        w10:10.5, w50:12.2, w90:14.1, h10: 83.5, h50: 87.8, h90: 91.9 },
    { age: '3 года',        w10:12.1, w50:14.3, w90:16.8, h10: 91.2, h50: 96.1, h90:100.8 },
    { age: '5 лет',         w10:15.3, w50:18.3, w90:22.0, h10:104.0, h50:110.0, h90:116.0 },
    { age: '7 лет',         w10:19.1, w50:23.3, w90:29.2, h10:116.0, h50:121.7, h90:127.7 },
    { age: '10 лет',        w10:25.1, w50:32.5, w90:43.5, h10:130.0, h50:137.8, h90:145.6 },
    { age: '12 лет',        w10:31.0, w50:40.5, w90:54.5, h10:140.2, h50:148.8, h90:157.8 },
    { age: '15 лет',        w10:46.0, w50:56.7, w90:70.5, h10:161.0, h50:170.1, h90:178.5 },
  ],
  girl: [
    { age: 'Новорождённый', w10: 2.8, w50: 3.2, w90: 3.7, h10: 46.8, h50: 49.1, h90: 51.7 },
    { age: '1 месяц',       w10: 3.6, w50: 4.2, w90: 4.9, h10: 50.9, h50: 53.7, h90: 56.4 },
    { age: '3 месяца',      w10: 4.8, w50: 5.8, w90: 7.0, h10: 57.4, h50: 60.2, h90: 63.1 },
    { age: '6 месяцев',     w10: 6.2, w50: 7.3, w90: 8.5, h10: 63.3, h50: 65.7, h90: 68.4 },
    { age: '9 месяцев',     w10: 7.2, w50: 8.5, w90: 9.9, h10: 67.7, h50: 70.1, h90: 72.8 },
    { age: '1 год',         w10: 7.7, w50: 9.0, w90:10.5, h10: 71.0, h50: 74.0, h90: 77.0 },
    { age: '2 года',        w10: 9.7, w50:11.5, w90:13.5, h10: 81.6, h50: 86.4, h90: 90.9 },
    { age: '3 года',        w10:11.1, w50:13.9, w90:17.0, h10: 89.8, h50: 95.1, h90:100.1 },
    { age: '5 лет',         w10:14.8, w50:18.2, w90:22.8, h10:102.5, h50:109.4, h90:115.9 },
    { age: '7 лет',         w10:18.9, w50:23.3, w90:30.7, h10:114.0, h50:120.0, h90:126.4 },
    { age: '10 лет',        w10:25.6, w50:34.7, w90:48.3, h10:127.0, h50:138.6, h90:149.1 },
    { age: '12 лет',        w10:33.0, w50:43.0, w90:59.5, h10:140.0, h50:152.3, h90:162.0 },
    { age: '15 лет',        w10:43.0, w50:55.5, w90:72.0, h10:152.0, h50:163.8, h90:172.0 },
  ],
}

export default function PediatricSuite() {
  const [drugName, setDrugName]       = useState('')
  const [weight, setWeight]           = useState(12)
  const [height, setHeight]           = useState(86)
  const [desiredDose, setDesiredDose] = useState(15)
  const [frequency, setFrequency]     = useState(3)
  const [suspStrength, setSuspStrength] = useState(120)
  const [suspVolume, setSuspVolume]   = useState(5)
  const [bsa, setBsa]                 = useState(0)
  const [dailyDose, setDailyDose]     = useState(0)
  const [singleDose, setSingleDose]   = useState(0)
  const [singleMl, setSingleMl]       = useState(0)

  const [westley, setWestley] = useState({ stridor: 0, retractions: 0, air: 0, cyanosis: 0, consciousness: 0 })
  const [isBoy, setIsBoy]     = useState(true)

  useEffect(() => {
    if (weight > 0 && height > 0) setBsa(parseFloat(Math.sqrt((height * weight) / 3600).toFixed(2)))
    const daily = weight * desiredDose
    setDailyDose(parseFloat(daily.toFixed(1)))
    const single = daily / (frequency || 1)
    setSingleDose(parseFloat(single.toFixed(1)))
    if (suspStrength > 0) setSingleMl(parseFloat((single * (suspVolume / suspStrength)).toFixed(2)))
  }, [weight, height, desiredDose, frequency, suspStrength, suspVolume])

  const westleyScore = Object.values(westley).reduce((a, b) => a + b, 0)
  const westleyRes   = westleyResult(westleyScore)
  const centileData  = isBoy ? CENTILES.boy : CENTILES.girl

  return (
    <div className="suite">

      <div className="nephr-two-col">

      {/* Дозатор */}
      <div className="suite-card">
        <div className="suite-card-title">🧮 Педиатрический дозатор & BSA</div>
        <div className="suite-field" style={{ marginBottom: 10 }}>
          <label>Название препарата (для заметок)</label>
          <input className="suite-input" type="text" placeholder="Напр.: Амоксициллин"
            value={drugName} onChange={e => setDrugName(e.target.value)} />
        </div>
        <div className="suite-grid">
          <div className="suite-field">
            <label>Вес ребёнка (кг)</label>
            <input className="suite-input" type="number" step="0.1" min="0.1"
              value={weight} onChange={e => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0))} />
          </div>
          <div className="suite-field">
            <label>Рост ребёнка (см)</label>
            <input className="suite-input" type="number" min="1"
              value={height} onChange={e => setHeight(Math.max(1, parseInt(e.target.value) || 0))} />
          </div>
          <div className="suite-field">
            <label>Целевая доза (мг / кг / сут)</label>
            <input className="suite-input" type="number" step="0.5" min="0"
              value={desiredDose} onChange={e => setDesiredDose(Math.max(0, parseFloat(e.target.value) || 0))} />
          </div>
          <div className="suite-field">
            <label>Кратность (раз в сутки)</label>
            <select className="suite-select" value={frequency} onChange={e => setFrequency(parseInt(e.target.value) || 1)}>
              <option value={1}>1 раз (каждые 24 ч)</option>
              <option value={2}>2 раза (каждые 12 ч)</option>
              <option value={3}>3 раза (каждые 8 ч)</option>
              <option value={4}>4 раза (каждые 6 ч)</option>
            </select>
          </div>
        </div>
        <div className="suite-subsection" style={{ marginTop: 14, background: '#FFF1F2' }}>
          <div className="suite-subsection-title">🧃 Расчёт суспензии (напр. 120 мг / 5 мл)</div>
          <div className="suite-grid">
            <div className="suite-field">
              <label>Количество мг в упаковке</label>
              <input className="suite-input" type="number" min="1" placeholder="120"
                value={suspStrength} onChange={e => setSuspStrength(Math.max(1, parseInt(e.target.value) || 0))} />
            </div>
            <div className="suite-field">
              <label>На сколько мл (объём флакона)</label>
              <input className="suite-input" type="number" min="1" placeholder="5"
                value={suspVolume} onChange={e => setSuspVolume(Math.max(1, parseInt(e.target.value) || 0))} />
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#9F1239', marginTop: 6, lineHeight: 1.4 }}>
            Амоксициллин 250 мг/5 мл → введите 250 и 5. Нурофен 100 мг/5 мл → 100 и 5.
          </p>
        </div>
        <div style={{ marginTop: 14, borderTop: '3px solid #22C55E' }}>
          {drugName && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Препарат</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#FBBF24' }}>{drugName}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>BSA (Мостеллер)</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{bsa > 0 ? `${bsa} м²` : '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Суточная доза</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{dailyDose} мг/сут</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Разовая доза</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#34D399' }}>{singleDose} мг</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Объём суспензии</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#F472B6' }}>{singleMl > 0 ? `${singleMl} мл` : '—'}</span>
          </div>
        </div>
      </div>

        {/* Шкала Вестли */}
        <div className="suite-card">
          <div className="suite-card-title">🌬 Шкала Вестли — тяжесть крупа (острый ларинготрахеит)</div>
          {WESTLEY.map(f => (
            <div key={f.id} className="suite-field" style={{ marginBottom: 10 }}>
              <label>{f.label}</label>
              <select className="suite-select" value={westley[f.id]}
                onChange={e => setWestley(prev => ({ ...prev, [f.id]: parseInt(e.target.value) }))}>
                {f.opts.map(o => <option key={o.v} value={o.v}>{o.l} (+{o.v})</option>)}
              </select>
            </div>
          ))}
          <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 4 }}>
            <div style={{ textAlign: 'right' }}>
              <div className="suite-score-big" style={{ color: '#60A5FA' }}>{westleyScore}</div>
            </div>
            <div>
              <span className={`suite-risk-badge ${westleyRes.badge}`} style={{ fontSize: 11, padding: '3px 10px' }}>{westleyRes.label}</span>
              <div className="suite-advice" style={{ fontSize: 13 }}>{westleyRes.advice}</div>
            </div>
          </div>
        </div>

      </div>{/* nephr-two-col */}

      {/* Центили — полная ширина */}
      <div className="suite-card">
        <div className="suite-card-title">📏 Центили роста и веса (ВОЗ 2006) — P10 / P50 / P90</div>
        <div className="suite-gender-row" style={{ marginBottom: 12 }}>
          <button className={`suite-gender-btn ${isBoy ? 'active' : ''}`}  onClick={() => setIsBoy(true)}>Мальчики</button>
          <button className={`suite-gender-btn ${!isBoy ? 'active' : ''}`} onClick={() => setIsBoy(false)}>Девочки</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="suite-table">
            <thead>
              <tr>
                <th>Возраст</th>
                <th>Вес (кг) P10–P50–P90</th>
                <th>Рост (см) P10–P50–P90</th>
              </tr>
            </thead>
            <tbody>
              {centileData.map((r, i) => (
                <tr key={i}>
                  <td className="col-time">{r.age}</td>
                  <td>{r.w10} – {r.w50} – {r.w90}</td>
                  <td>{r.h10} – {r.h50} – {r.h90}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Календарь вакцинации */}
      <div className="suite-card">
        <div className="suite-card-title">📅 Национальный календарь вакцинации РФ</div>
        <table className="suite-table">
          <thead>
            <tr><th>Срок</th><th>Вакцина</th><th>Мишень</th></tr>
          </thead>
          <tbody>
            {vaccineSchedule.map((row, i) => (
              <tr key={i}>
                <td className="col-time">{row.age}</td>
                <td className="col-drug">{row.vaccine}</td>
                <td className="col-note">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
