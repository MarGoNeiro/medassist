import { useState } from 'react'
import './suites.css'

const GCS_EYES    = [{ v:4,l:'Самопроизвольное' },{ v:3,l:'На голос' },{ v:2,l:'На боль' },{ v:1,l:'Отсутствует' }]
const GCS_VERBAL  = [{ v:5,l:'Ориентирован' },{ v:4,l:'Спутанный' },{ v:3,l:'Слова' },{ v:2,l:'Звуки' },{ v:1,l:'Отсутствует' }]
const GCS_MOTOR   = [{ v:6,l:'Выполняет команды' },{ v:5,l:'Локализует боль' },{ v:4,l:'Отдёргивает' },{ v:3,l:'Патол. сгибание' },{ v:2,l:'Патол. разгибание' },{ v:1,l:'Отсутствует' }]

function gcsLevel(total) {
  if (total >= 13) return { label: 'Лёгкое нарушение',    badge: 'badge-yellow' }
  if (total >= 9)  return { label: 'Умеренное нарушение', badge: 'badge-yellow' }
  return                  { label: 'Тяжёлая кома',        badge: 'badge-red' }
}

const ASA = [
  { grade: 'ASA I',   desc: 'Здоровый, без заболеваний',                             example: 'Плановая операция у молодого пациента' },
  { grade: 'ASA II',  desc: 'Лёгкое системное заболевание без функц. ограничений',   example: 'АГ компенс., ожирение ИМТ 30–40, курение' },
  { grade: 'ASA III', desc: 'Тяжёлое заб-е с функциональными ограничениями',         example: 'ХСН NYHA III, ХОБЛ, диализ, онко, ИМТ > 40' },
  { grade: 'ASA IV',  desc: 'Угрожающее жизни тяжёлое заболевание',                 example: 'Острый ИМ/ИИ < 3 мес., сепсис, ПОН' },
  { grade: 'ASA V',   desc: 'Без операции не выживет (24 ч)',                        example: 'Разрыв АА, ишемия кишечника, ЧМТ с ВЧГ' },
  { grade: 'ASA VI',  desc: 'Смерть мозга – донация органов',                       example: '' },
]

const MALLAMPATI = [
  { grade: 'I',   vis: 'Мягкое нёбо, зев, фаукальные дуги, язычок', risk: 'Лёгкая' },
  { grade: 'II',  vis: 'Мягкое нёбо, зев, часть язычка',             risk: 'Умеренная' },
  { grade: 'III', vis: 'Мягкое нёбо, основание язычка',              risk: 'Трудная' },
  { grade: 'IV',  vis: 'Только твёрдое нёбо',                        risk: 'Очень трудная' },
]

export default function AnesthesiologySuite() {
  const [eyes,   setEyes]   = useState(4)
  const [verbal, setVerbal] = useState(5)
  const [motor,  setMotor]  = useState(6)

  const gcsTotal = eyes + verbal + motor
  const gcsLvl   = gcsLevel(gcsTotal)

  return (
    <div className="suite">

      {/* GCS */}
      <div className="suite-card">
        <div className="suite-card-title">🧠 Шкала комы Глазго (GCS)</div>
        <div className="suite-grid gcs-grid">
          <div className="suite-field">
            <label>Открывание глаз (E)</label>
            <select className="suite-select" value={eyes} onChange={e => setEyes(parseInt(e.target.value))}>
              {GCS_EYES.map(o => <option key={o.v} value={o.v}>{o.v} – {o.l}</option>)}
            </select>
          </div>
          <div className="suite-field">
            <label>Речевой ответ (V)</label>
            <select className="suite-select" value={verbal} onChange={e => setVerbal(parseInt(e.target.value))}>
              {GCS_VERBAL.map(o => <option key={o.v} value={o.v}>{o.v} – {o.l}</option>)}
            </select>
          </div>
          <div className="suite-field">
            <label>Двигательный ответ (M)</label>
            <select className="suite-select" value={motor} onChange={e => setMotor(parseInt(e.target.value))}>
              {GCS_MOTOR.map(o => <option key={o.v} value={o.v}>{o.v} – {o.l}</option>)}
            </select>
          </div>
        </div>
        <div className="suite-result-banner scorad-result">
          <div className="scorad-score">
            <div className="suite-score-label">ШКГ (E{eyes} V{verbal} M{motor})</div>
            <div className="suite-score-big" style={{ color: '#34D399' }}>{gcsTotal}</div>
          </div>
          <div className="scorad-verdict">
            <span className={`suite-risk-badge ${gcsLvl.badge}`}>{gcsLvl.label}</span>
            <div className="suite-advice">
              {gcsTotal <= 8 ? 'Показана интубация трахеи / защита дыхательных путей' : gcsTotal <= 12 ? 'Тщательный мониторинг. Риск аспирации.' : 'Пациент в сознании, стандартный мониторинг.'}
            </div>
          </div>
        </div>
      </div>

      {/* ASA + Mallampati рядом на десктопе */}
      <div className="anesthesia-two-col">
        <div className="suite-card">
          <div className="suite-card-title">🏷️ Классификация ASA – физический статус</div>
          <div className="asa-list">
            {ASA.map((a, i) => (
              <div key={i} className={`asa-row${i === ASA.length - 1 ? ' asa-row-last' : ''}`}>
                <span className="asa-grade">{a.grade}</span>
                <div>
                  <div className="asa-desc">{a.desc}</div>
                  {a.example && <div className="asa-example">{a.example}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="suite-card anesthesia-mallampati-card">
          <div className="suite-card-title">👄 Маллампати – прогноз трудной интубации</div>
          <p className="anesthesia-hint">
            Пациент сидит, рот широко открыт, язык максимально высунут, фонация отсутствует.
          </p>
          <div className="mallampati-list">
            <div className="mallampati-head">
              <span>Класс</span><span>Видимые структуры</span><span>Риск</span>
            </div>
            {MALLAMPATI.map((m, i) => (
              <div key={i} className="mallampati-row">
                <span className="mallampati-cls">Класс {m.grade}</span>
                <span className="mallampati-vis">{m.vis}</span>
                <span className="mallampati-risk">{m.risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
