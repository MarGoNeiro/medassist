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

export default function PediatricSuite() {
  const [drugName, setDrugName]     = useState('')
  const [weight, setWeight]         = useState(12)
  const [height, setHeight]         = useState(86)
  const [desiredDose, setDesiredDose] = useState(15)
  const [frequency, setFrequency]   = useState(3)
  const [suspStrength, setSuspStrength] = useState(120)
  const [suspVolume, setSuspVolume] = useState(5)

  const [bsa, setBsa]             = useState(0)
  const [dailyDose, setDailyDose] = useState(0)
  const [singleDose, setSingleDose] = useState(0)
  const [singleMl, setSingleMl]   = useState(0)

  useEffect(() => {
    if (weight > 0 && height > 0) {
      setBsa(parseFloat(Math.sqrt((height * weight) / 3600).toFixed(2)))
    }
    const daily = weight * desiredDose
    setDailyDose(parseFloat(daily.toFixed(1)))
    const single = daily / (frequency || 1)
    setSingleDose(parseFloat(single.toFixed(1)))
    if (suspStrength > 0) {
      setSingleMl(parseFloat((single * (suspVolume / suspStrength)).toFixed(2)))
    }
  }, [weight, height, desiredDose, frequency, suspStrength, suspVolume])

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FFF1F2' }}>👶</div>
        <div>
          <h2>Рабочий кабинет педиатра</h2>
          <p>Расчёт детских дозировок, индекса BSA и календарь вакцинации</p>
        </div>
      </div>

      {/* Dosing calculator */}
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

        {/* Suspension */}
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
          <p style={{ fontSize:11, color:'#9F1239', marginTop:6, lineHeight:1.4 }}>
            Амоксициллин 250 мг/5 мл → введите 250 и 5. Нурофен 100 мг/5 мл → 100 и 5.
          </p>
        </div>

        {/* Results */}
        <div className="suite-dark-box">
          {drugName && (
            <div className="suite-dark-row">
              <span className="suite-dark-label">Препарат</span>
              <span className="suite-dark-value" style={{ color:'#FBBF24' }}>{drugName}</span>
            </div>
          )}
          <div className="suite-dark-row">
            <span className="suite-dark-label">Индекс BSA (Мостеллер)</span>
            <span className="suite-dark-value">{bsa > 0 ? `${bsa} м²` : '—'}</span>
          </div>
          <div className="suite-dark-row">
            <span className="suite-dark-label">Общая суточная доза</span>
            <span className="suite-dark-value">{dailyDose} мг/сут</span>
          </div>
          <div className="suite-dark-row">
            <div className="suite-dark-label">
              Разовая расчётная доза
              <small>В сухом веществе</small>
            </div>
            <span className="suite-dark-value accent-green">{singleDose} мг</span>
          </div>
          <div className="suite-dark-row">
            <div className="suite-dark-label">
              Разовый объём суспензии
              <small>Для шприца-дозатора</small>
            </div>
            <span className="suite-dark-value accent-pink">{singleMl > 0 ? `${singleMl} мл` : '—'}</span>
          </div>
        </div>
      </div>

      {/* Vaccination calendar */}
      <div className="suite-card">
        <div className="suite-card-title">📅 Национальный календарь вакцинации РФ</div>
        <table className="suite-table">
          <thead>
            <tr>
              <th>Срок</th>
              <th>Вакцина</th>
              <th>Мишень</th>
            </tr>
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
