import { useState } from 'react'
import './suites.css'

function anemiaResult(hb, gender) {
  const normMin = gender === 'male' ? 130 : 120
  const mildMin = gender === 'male' ? 120 : 110
  if (hb >= normMin) return { label: 'Норма',           badge: 'badge-green',  advice: 'Анемии нет. Контрольный ОАК при клинических показаниях.' }
  if (hb >= mildMin) return { label: 'Лёгкая анемия',   badge: 'badge-yellow', advice: 'Выяснить причину: ферритин, B12, фолат, ретикулоциты, мазок крови.' }
  if (hb >= 80)      return { label: 'Умеренная анемия', badge: 'badge-yellow', advice: 'Верификация причины. Коррекция дефицита. Контроль через 4 нед.' }
  return                    { label: 'Тяжёлая анемия',   badge: 'badge-red',    advice: 'Госпитализация. Трансфузия при Hb < 70–80 г/л + нестабильная гемодинамика.' }
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

export default function HematologySuite() {
  const [hb, setHb] = useState(110)
  const [gender, setGender] = useState('female')
  const [dvt, setDvt] = useState({ pain: false, warmth: false, homans: false, ddimer: false, us: false })

  const res = anemiaResult(hb, gender)
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
        <div className="suite-grid">
          <div className="suite-field">
            <label>Гемоглобин (г/л)</label>
            <input
              className="suite-input"
              type="number"
              min="20"
              max="200"
              value={hb}
              onChange={e => setHb(Math.max(20, Math.min(200, parseInt(e.target.value) || 20)))}
            />
          </div>
          <div className="suite-field">
            <label>Пол</label>
            <div className="suite-gender-row" style={{ marginTop: 5 }}>
              <button
                className={`suite-gender-btn ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}
              >Женский</button>
              <button
                className={`suite-gender-btn ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}
              >Мужской</button>
            </div>
          </div>
        </div>
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">Hb</div>
            <div className="suite-score-big" style={{ color: res.badge === 'badge-green' ? '#34D399' : res.badge === 'badge-red' ? '#F87171' : '#FBBF24' }}>
              {hb} г/л
            </div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${res.badge}`}>{res.label}</span>
            <div className="suite-advice">{res.advice}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--color-bg)', borderRadius: 8 }}>
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <strong>Норма:</strong> ж ≥ 120, м ≥ 130 г/л &nbsp;·&nbsp;
            <strong>Лёгкая:</strong> ж 110–119, м 120–129 &nbsp;·&nbsp;
            <strong>Умеренная:</strong> 80–109 &nbsp;·&nbsp;
            <strong>Тяжёлая:</strong> &lt; 80 г/л
          </p>
        </div>
      </div>

      {/* Anticoagulants */}
      <div className="suite-card">
        <div className="suite-card-title">💊 Пероральные антикоагулянты</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ANTICOAGS.map((a, i) => (
            <div key={i} style={{ padding: '8px 10px', background: 'var(--color-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 2 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text)', marginBottom: 2 }}>{a.dose}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>📌 {a.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DVT signs */}
      <div className="suite-card">
        <div className="suite-card-title">⚠️ Признаки ТГВ</div>
        {DVT_SIGNS.map(f => (
          <button
            key={f.id}
            className="suite-toggle-row"
            onClick={() => setDvt(prev => ({ ...prev, [f.id]: !prev[f.id] }))}
          >
            <span className="suite-toggle-label">{f.label}</span>
            <div className={`suite-toggle ${dvt[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
        ))}
        <div className="suite-result-banner" style={{ marginTop: 10 }}>
          <div>
            <div className="suite-score-label">Признаков</div>
            <div className="suite-score-big" style={{ color: dvtCount >= 2 ? '#F87171' : dvtCount === 1 ? '#FBBF24' : '#34D399' }}>
              {dvtCount} / 5
            </div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
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
  )
}
