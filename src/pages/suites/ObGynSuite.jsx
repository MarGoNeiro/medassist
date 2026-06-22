import { useState } from 'react'
import './suites.css'

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
  const [lmp, setLmp]       = useState('')
  const [bishop, setBishop] = useState({ dilation: 0, effacement: 0, station: 0, consistency: 0, position: 0 })

  const edd = calcEDD(lmp)
  const ga  = calcGA(lmp)
  const bishopTotal = Object.values(bishop).reduce((a, b) => a + b, 0)
  const bRes = bishopResult(bishopTotal)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FDF4FF' }}>🤰</div>
        <div>
          <h2>Рабочий кабинет акушера-гинеколога</h2>
          <p>ПДР, срок беременности, шкала Бишопа, скрининги</p>
        </div>
      </div>

      {/* PDR */}
      <div className="suite-card">
        <div className="suite-card-title">📅 Предполагаемая дата родов (ПДР)</div>
        <div className="suite-field">
          <label>Дата последней менструации (ПМ)</label>
          <input type="date" className="suite-input" value={lmp}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setLmp(e.target.value)} />
        </div>
        <div className="suite-date-result">
          <div className="suite-date-box dark">
            <div className="suite-date-box-label">ПДР (Негеле)</div>
            <div className="suite-date-box-value">{edd ? formatDate(edd) : '—'}</div>
          </div>
          <div className="suite-date-box">
            <div className="suite-date-box-label">Срок беременности</div>
            <div className="suite-date-box-value">
              {ga ? `${ga.weeks} нед. ${ga.days} дн.` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Bishop */}
      <div className="suite-card">
        <div className="suite-card-title">🔢 Шкала Бишопа — зрелость шейки матки</div>
        {BISHOP_FIELDS.map(f => (
          <div key={f.id} className="suite-field" style={{ marginBottom: 10 }}>
            <label>{f.label}</label>
            <select className="suite-select"
              value={bishop[f.id]}
              onChange={e => setBishop(prev => ({ ...prev, [f.id]: parseInt(e.target.value) }))}>
              {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
        ))}
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">Баллы Бишопа</div>
            <div className="suite-score-big" style={{ color: '#C084FC' }}>{bishopTotal}</div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${bRes.badge}`}>{bRes.label}</span>
            <div className="suite-advice">{bRes.advice}</div>
          </div>
        </div>
      </div>

      {/* Screening schedule */}
      <div className="suite-card">
        <div className="suite-card-title">🗓 Обязательные скрининги при беременности</div>
        <div>
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
      </div>
    </div>
  )
}
