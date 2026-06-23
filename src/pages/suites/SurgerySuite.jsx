import { useState } from 'react'
import './suites.css'

const ALVARADO_FIELDS = [
  { id: 'm', label: 'Смещение боли в правую подвздошную область', pts: 1 },
  { id: 'a', label: 'Анорексия',                                   pts: 1 },
  { id: 'n', label: 'Тошнота / рвота',                             pts: 1 },
  { id: 't', label: 'Болезненность в правой подвздошной области',  pts: 2, bold: true },
  { id: 'r', label: 'Симптом отдачи (Щёткина-Блюмберга)',          pts: 1 },
  { id: 'e', label: 'Температура тела > 37.3°C',                   pts: 1 },
  { id: 'l', label: 'Лейкоцитоз > 10 × 10⁹/л',                   pts: 2, bold: true },
  { id: 's', label: 'Сдвиг лейкоформулы влево',                    pts: 1 },
]

function alvaradoRes(score) {
  if (score <= 4) return { label: 'Аппендицит маловероятен', badge: 'badge-green',  advice: 'Наблюдение, динамический осмотр через 4–6 ч.' }
  if (score <= 6) return { label: 'Возможный аппендицит',    badge: 'badge-yellow', advice: 'КТ / УЗИ + хирургическое наблюдение. Не отпускать!' }
  if (score <= 8) return { label: 'Вероятный аппендицит',    badge: 'badge-red',    advice: 'Хирургическая консультация. Показана операция без промедления.' }
  return               { label: 'Очень вероятный аппендицит', badge: 'badge-red',   advice: 'Экстренная операция! Высокий риск перфорации.' }
}

const WOUND_CLASSES = [
  { cls: 'Класс I',    name: 'Чистые раны',                    desc: 'Плановые, без воспаления, не затрагивают ЖКТ/дыхательный/мочеполовой тракт. ИО 1–2%.', color: '#34D399' },
  { cls: 'Класс II',   name: 'Чисто-контаминированные',        desc: 'ЖКТ/дыхательный тракт без значимого заражения. ИО 5–15%.', color: '#FBBF24' },
  { cls: 'Класс III',  name: 'Контаминированные',              desc: 'Свежие открытые случайные раны, утечка кишечного содержимого, воспаление без гноя. ИО 15–30%.', color: '#FB923C' },
  { cls: 'Класс IV',   name: 'Грязные / инфицированные',       desc: 'Старые травматические раны, гнойные процессы, перфорация полых органов. ИО 30–40%.', color: '#F87171' },
]

const RANSON_ENTRY = [
  'Возраст > 55 лет',
  'Лейкоциты > 16 × 10⁹/л',
  'Глюкоза > 11 ммоль/л',
  'ЛДГ > 350 МЕ/л',
  'АСТ > 250 МЕ/л',
]
const RANSON_48H = [
  'Снижение гематокрита > 10%',
  'Рост мочевины крови > 1.8 ммоль/л',
  'Кальций < 2 ммоль/л',
  'PaO₂ < 60 мм рт.ст.',
  'Дефицит оснований > 4 мэкв/л',
  'Задержка жидкости > 6 л за 48 ч',
]

function ransonRes(score) {
  if (score < 3)  return { label: 'Лёгкий панкреатит',        badge: 'badge-green',  note: 'Летальность < 5%' }
  if (score <= 4) return { label: 'Умеренный панкреатит',     badge: 'badge-yellow', note: 'Летальность 10–15%' }
  return               { label: 'Тяжёлый панкреатит',        badge: 'badge-red',    note: 'Летальность > 40%, ОРИТ' }
}

export default function SurgerySuite() {
  const [alv, setAlv]   = useState(Object.fromEntries(ALVARADO_FIELDS.map(f => [f.id, false])))
  const [ran, setRan]   = useState({ entry: Array(5).fill(false), h48: Array(6).fill(false) })

  const alvScore = ALVARADO_FIELDS.reduce((s, f) => s + (alv[f.id] ? f.pts : 0), 0)
  const alvRes   = alvaradoRes(alvScore)

  const ranScore = ran.entry.filter(Boolean).length + ran.h48.filter(Boolean).length
  const ranRes   = ransonRes(ranScore)

  function toggleRan(group, idx) {
    setRan(prev => {
      const arr = [...prev[group]]
      arr[idx] = !arr[idx]
      return { ...prev, [group]: arr }
    })
  }

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#F0FFF4' }}>✂️</div>
        <div>
          <h2>Рабочий кабинет хирурга</h2>
          <p>Шкала Альварадо (аппендицит), классификация ран, критерии Рэнсона (панкреатит)</p>
        </div>
      </div>

      {/* Alvarado */}
      <div className="suite-card">
        <div className="suite-card-title">
          <span>🎯 Шкала Альварадо — острый аппендицит</span>
          <button className="suite-reset-btn" onClick={() => setAlv(Object.fromEntries(ALVARADO_FIELDS.map(f => [f.id, false])))}>Сбросить</button>
        </div>
        {ALVARADO_FIELDS.map(f => (
          <button key={f.id} className="suite-toggle-row" onClick={() => setAlv(prev => ({ ...prev, [f.id]: !prev[f.id] }))}>
            <span className="suite-toggle-label" style={{ fontWeight: f.bold ? 700 : 400 }}>
              {f.label} <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>[+{f.pts}]</span>
            </span>
            <div className={`suite-toggle ${alv[f.id] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
        ))}
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">Альварадо</div>
            <div className="suite-score-big" style={{ color: '#FB923C' }}>{alvScore} / 10</div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${alvRes.badge}`}>{alvRes.label}</span>
            <div className="suite-advice">{alvRes.advice}</div>
          </div>
        </div>
      </div>

      {/* Wound classification */}
      <div className="suite-card">
        <div className="suite-card-title">🩹 Классификация операционных ран (CDC)</div>
        {WOUND_CLASSES.map((w, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < WOUND_CLASSES.length - 1 ? '1px solid var(--color-border)' : 'none', alignItems: 'flex-start' }}>
            <span style={{ fontWeight: 800, fontSize: 11, color: w.color, minWidth: 64, flexShrink: 0 }}>{w.cls}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)', marginBottom: 2 }}>{w.name}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{w.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Ranson */}
      <div className="suite-card">
        <div className="suite-card-title">🔥 Критерии Рэнсона — тяжесть панкреатита</div>
        <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>При поступлении</div>
        {RANSON_ENTRY.map((label, idx) => (
          <button key={idx} className="suite-toggle-row" onClick={() => toggleRan('entry', idx)}>
            <span className="suite-toggle-label">{label}</span>
            <div className={`suite-toggle ${ran.entry[idx] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
        ))}
        <div style={{ margin: '12px 0 8px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Через 48 часов</div>
        {RANSON_48H.map((label, idx) => (
          <button key={idx} className="suite-toggle-row" onClick={() => toggleRan('h48', idx)}>
            <span className="suite-toggle-label">{label}</span>
            <div className={`suite-toggle ${ran.h48[idx] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
          </button>
        ))}
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">Рэнсон</div>
            <div className="suite-score-big" style={{ color: '#FB923C' }}>{ranScore} / 11</div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${ranRes.badge}`}>{ranRes.label}</span>
            <div className="suite-advice">{ranRes.note}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
