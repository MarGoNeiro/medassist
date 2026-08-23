import { useState } from 'react'
import './suites.css'

function anemiaResult(hb, gender) {
  const normMin = gender === 'male' ? 130 : 120
  const mildMin = gender === 'male' ? 120 : 110
  if (hb >= normMin) return { label: 'Норма',            badge: 'badge-green',  advice: 'Анемии нет. Контрольный ОАК при клинических показаниях.' }
  if (hb >= mildMin) return { label: 'Лёгкая анемия',    badge: 'badge-yellow', advice: 'Выяснить причину: ферритин, B12, фолат, ретикулоциты, мазок крови.' }
  if (hb >= 80)      return { label: 'Умеренная анемия',  badge: 'badge-yellow', advice: 'Верификация причины. Коррекция дефицита. Контроль через 4 нед.' }
  return                    { label: 'Тяжёлая анемия',    badge: 'badge-red',    advice: 'Госпитализация. Трансфузия при Hb < 70–80 г/л + нестабильная гемодинамика.' }
}

function mcvResult(mcv) {
  if (mcv < 80)  return { type: 'Микроцитарная',  badge: 'badge-yellow', causes: 'ЖДА, талассемия, сидеробластная анемия' }
  if (mcv <= 100) return { type: 'Нормоцитарная',  badge: 'badge-yellow', causes: 'АХЗ, гемолиз, острая кровопотеря, апластическая' }
  return                 { type: 'Макроцитарная',  badge: 'badge-yellow', causes: 'Дефицит B12/фолата, гипотиреоз, болезни печени' }
}

function ferritinResult(ferritin) {
  if (ferritin < 12)  return { status: 'Дефицит железа',  badge: 'badge-red',    note: 'Запасы железа истощены. Назначить препараты железа.' }
  if (ferritin < 30)  return { status: 'На нижней границе', badge: 'badge-yellow', note: 'Возможный дефицит, особенно при воспалении.' }
  if (ferritin > 150) return { status: 'Повышен',           badge: 'badge-yellow', note: 'Острофазовый белок. Исключить воспаление, гемохроматоз.' }
  return                     { status: 'Норма',              badge: 'badge-green',  note: 'Запасы железа в норме.' }
}

function combinedDx(hb, gender, mcv, ferritin) {
  const normMin = gender === 'male' ? 130 : 120
  if (hb >= normMin) return null
  if (mcv < 80) {
    if (ferritin !== null && ferritin < 30)
      return { dx: 'ЖДА — железодефицитная анемия', plan: 'Препараты железа перорально. Искать источник кровопотери. Контроль Hb через 4 нед.' }
    if (ferritin !== null && ferritin >= 30)
      return { dx: 'Талассемия / сидеробластная анемия', plan: 'Электрофорез Hb. Мазок крови. Генетическая консультация.' }
    return { dx: 'Микроцитарная анемия', plan: 'Уточнить: ферритин, электрофорез Hb, мазок крови.' }
  }
  if (mcv <= 100) {
    if (ferritin !== null && ferritin < 30)
      return { dx: 'Ранняя ЖДА или смешанная анемия', plan: 'Препараты железа. Исключить дефицит B12. Контроль MCV через 4 нед.' }
    if (ferritin !== null && ferritin > 100)
      return { dx: 'Анемия хронических заболеваний (АХЗ)', plan: 'Лечение основного заболевания. СРБ, ОАК в динамике.' }
    return { dx: 'Нормоцитарная анемия', plan: 'Ретикулоциты, ЛДГ, билирубин, гаптоглобин. Исключить гемолиз.' }
  }
  return { dx: 'Дефицит B12 / фолиевой кислоты', plan: 'Витамин B12 и фолат в крови. Гомоцистеин. Заместительная терапия.' }
}

const ANTICOAGS = [
  { name: 'Апиксабан (Эликвис)',      dose: '5 мг × 2/сут',          note: 'ТЭЛА/ТГВ: 10 мг × 2 × 7 дней → 5 мг × 2' },
  { name: 'Ривароксабан (Ксарелто)',  dose: '20 мг × 1/сут с едой',  note: 'ТЭЛА/ТГВ: 15 мг × 2 × 21 день → 20 мг × 1' },
  { name: 'Дабигатран (Прадакса)',    dose: '150 мг × 2/сут',         note: 'Только после парентер. антикоагуляции ≥ 5–10 дней' },
  { name: 'Варфарин',                 dose: 'МНО 2.0–3.0',            note: 'При противопоказаниях к ПОАК или мех. клапанах' },
]

const DVT_SIGNS = [
  { id: 'pain',   label: 'Боль, отёк, покраснение голени' },
  { id: 'warmth', label: 'Локальная гипертермия по ходу вены' },
  { id: 'homans', label: 'Симптом Хоманса (боль при тыльном сгибании стопы)' },
  { id: 'ddimer', label: 'D-димер > 500 нг/мл (FEU)' },
  { id: 'us',     label: 'УЗТДС: несжимаемость вены / дефект наполнения' },
]

const HB_NORMS = [
  { label: 'Норма',     val: 'ж ≥ 120 · м ≥ 130', badge: 'badge-green' },
  { label: 'Лёгкая',   val: 'ж 110–119 · м 120–129', badge: 'badge-yellow' },
  { label: 'Умеренная',val: '80–109 г/л', badge: 'badge-yellow' },
  { label: 'Тяжёлая',  val: '< 80 г/л', badge: 'badge-red' },
]

export default function HematologySuite() {
  const [hbRaw,       setHbRaw]       = useState('110')
  const [mcvRaw,      setMcvRaw]      = useState('')
  const [ferritinRaw, setFerritinRaw] = useState('')
  const [gender,      setGender]      = useState('female')
  const [dvt, setDvt] = useState({ pain: false, warmth: false, homans: false, ddimer: false, us: false })

  const hb       = Math.max(20, Math.min(200, parseInt(hbRaw) || 110))
  const mcv      = mcvRaw !== '' ? Math.max(50, Math.min(150, parseInt(mcvRaw) || 85)) : null
  const ferritin = ferritinRaw !== '' ? Math.max(0, parseFloat(ferritinRaw) || 0) : null

  const res      = anemiaResult(hb, gender)
  const mcvRes   = mcv !== null ? mcvResult(mcv) : null
  const ferrRes  = ferritin !== null ? ferritinResult(ferritin) : null
  const combined = mcv !== null ? combinedDx(hb, gender, mcv, ferritin) : null
  const hbColor  = res.badge === 'badge-green' ? '#34D399' : res.badge === 'badge-red' ? '#F87171' : '#FBBF24'

  const dvtCount = Object.values(dvt).filter(Boolean).length

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FFF1F2' }}>🩸</div>
        <div>
          <h2>Рабочий кабинет гематолога</h2>
          <p>Анемия (ВОЗ), антикоагулянты, признаки ТГВ</p>
        </div>
      </div>

      {/* Anemia */}
      <div className="suite-card">
        <div className="suite-card-title">🩺 Степень анемии (ВОЗ)</div>

        {/* Строка 1: четыре поля включая Пол */}
        <div className="suite-grid hemato-anemia-grid">
          <div className="suite-field">
            <label>Гемоглобин (г/л)</label>
            <input className="suite-input" type="number" value={hbRaw}
              onChange={e => setHbRaw(e.target.value)}
              onBlur={() => setHbRaw(String(Math.max(20, Math.min(200, parseInt(hbRaw) || 110))))} />
          </div>
          <div className="suite-field">
            <label>MCV (фл)</label>
            <input className="suite-input" type="number" placeholder="80–100"
              value={mcvRaw}
              onChange={e => setMcvRaw(e.target.value)}
              onBlur={() => mcvRaw !== '' && setMcvRaw(String(Math.max(50, Math.min(150, parseInt(mcvRaw) || 85))))} />
          </div>
          <div className="suite-field">
            <label>Ферритин (мкг/л)</label>
            <input className="suite-input" type="number" placeholder="12–150"
              value={ferritinRaw}
              onChange={e => setFerritinRaw(e.target.value)}
              onBlur={() => ferritinRaw !== '' && setFerritinRaw(String(Math.max(0, parseFloat(ferritinRaw) || 0)))} />
          </div>
          <div className="suite-field">
            <label>Пол</label>
            <div className="suite-gender-row">
              <button className={`suite-gender-btn ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}>Женский</button>
              <button className={`suite-gender-btn ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}>Мужской</button>
            </div>
          </div>
        </div>

        {/* Строка 2: результат | интерпретация */}
        <div className="hemato-anemia-bottom">
          <div className="hemato-anemia-left">
            <div className="suite-result-banner scorad-result hemato-hb-result">
              <div className="scorad-score">
                <div className="suite-score-label">Hb</div>
                <div className="suite-score-big" style={{ color: hbColor }}>{hb} г/л</div>
              </div>
              <div className="scorad-verdict">
                <span className={`suite-risk-badge ${res.badge}`}>{res.label}</span>
                <div className="suite-advice">{res.advice}</div>
              </div>
            </div>
          </div>

          <div className="hemato-right-panel">
            {mcvRes && (
              <div className="hemato-interp-item">
                <div className="hemato-interp-label">Морфотип</div>
                <span className={`suite-risk-badge ${mcvRes.badge}`}>{mcvRes.type}</span>
                <div className="hemato-interp-sub">{mcvRes.causes}</div>
              </div>
            )}
            {ferrRes && (
              <div className="hemato-interp-item">
                <div className="hemato-interp-label">Ферритин</div>
                <span className={`suite-risk-badge ${ferrRes.badge}`}>{ferrRes.status}</span>
                <div className="hemato-interp-sub">{ferrRes.note}</div>
              </div>
            )}
            {combined && (
              <div className="hemato-interp-item">
                <div className="hemato-interp-label">Вероятный диагноз</div>
                <div className="hemato-interp-dx-name">{combined.dx}</div>
                <div className="hemato-interp-sub">{combined.plan}</div>
              </div>
            )}
            {!mcvRes && !ferrRes && (
              <div className="hemato-norms">
                {HB_NORMS.map((n, i) => (
                  <div key={i} className={`hemato-norm-item ${n.badge}`}>
                    <div className="hemato-norm-label">{n.label}</div>
                    <div className="hemato-norm-val">{n.val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hemato-two-col">
        {/* Anticoagulants */}
        <div className="suite-card">
          <div className="suite-card-title">💊 Пероральные антикоагулянты</div>
          <div className="anticoag-list">
            {ANTICOAGS.map((a, i) => (
              <div key={i} className="anticoag-item">
                <div className="anticoag-name">{a.name}</div>
                <div className="anticoag-dose">{a.dose}</div>
                <div className="anticoag-note">📌 {a.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DVT signs */}
        <div className="suite-card">
          <div className="suite-card-title">⚠️ Признаки ТГВ</div>
          {DVT_SIGNS.map(f => (
            <button key={f.id} className="suite-toggle-row"
              onClick={() => setDvt(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
              <span className="suite-toggle-label">{f.label}</span>
              <div className={`suite-toggle ${dvt[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
            </button>
          ))}
          <div className="suite-result-banner scorad-result" style={{ marginTop: 10 }}>
            <div className="scorad-score">
              <div className="suite-score-label">Признаков</div>
              <div className="suite-score-big" style={{ color: dvtCount >= 2 ? '#F87171' : dvtCount === 1 ? '#FBBF24' : '#34D399' }}>
                {dvtCount} / 5
              </div>
            </div>
            <div className="scorad-verdict">
              {dvtCount >= 2
                ? <><span className="suite-risk-badge badge-red">ТГВ вероятен</span><div className="suite-advice">УЗТДС вен нижних конечностей срочно. D-димер.</div></>
                : dvtCount === 1
                ? <><span className="suite-risk-badge badge-yellow">Под наблюдением</span><div className="suite-advice">D-димер. При повышении — УЗТДС.</div></>
                : <><span className="suite-risk-badge badge-green">ТГВ маловероятен</span><div className="suite-advice">Признаков нет. Дифференциальный диагноз.</div></>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
