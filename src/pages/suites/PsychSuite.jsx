import { useState } from 'react'
import './suites.css'

const PHQ9 = [
  'Отсутствие интереса или удовольствия от привычных дел',
  'Подавленность, депрессия, чувство безнадёжности',
  'Нарушения сна (трудно засыпать, просыпаться или, наоборот, сплю слишком много)',
  'Чувство усталости или упадок сил',
  'Плохой аппетит или переедание',
  'Ощущение себя неудачником или чувство вины',
  'Трудности с концентрацией (чтение, ТВ, работа)',
  'Заторможенность или, наоборот, суетливость (замечают окружающие)',
  'Мысли о том, что лучше бы не было в живых, о причинении себе вреда',
]

const OPT_LABELS = ['Совсем нет', 'Несколько дней', 'Больше половины дней', 'Почти каждый день']

function phq9Category(score) {
  if (score <= 4)  return { label: 'Нет депрессии',                badge: 'badge-green',  advice: 'Мониторинг. Повторить через 2–4 нед. при жалобах.' }
  if (score <= 9)  return { label: 'Лёгкая депрессия',             badge: 'badge-yellow', advice: 'Психообразование, дневник настроения. Повторить через 2 нед.' }
  if (score <= 14) return { label: 'Умеренная депрессия',          badge: 'badge-yellow', advice: 'Психотерапия ± антидепрессанты. Наблюдение психиатра.' }
  if (score <= 19) return { label: 'Тяжёлая депрессия (умеренная)', badge: 'badge-red',    advice: 'Антидепрессанты + психотерапия. Наблюдение психиатра.' }
  return                  { label: 'Тяжёлая депрессия',            badge: 'badge-red',    advice: 'Направление к психиатру. Оценить риск суицида немедленно!' }
}

const GAD7 = [
  'Чувство нервозности, тревоги или напряжения',
  'Невозможность остановить беспокойство или взять его под контроль',
  'Чрезмерная тревога по разным поводам',
  'Трудности с расслаблением',
  'Такое возбуждение, что трудно усидеть на месте',
  'Раздражительность',
  'Чувство страха, как будто должно произойти что-то ужасное',
]

function gad7Category(score) {
  if (score <= 4)  return { label: 'Минимальная тревога', badge: 'badge-green' }
  if (score <= 9)  return { label: 'Лёгкая тревога',      badge: 'badge-yellow' }
  if (score <= 14) return { label: 'Умеренная тревога',   badge: 'badge-yellow' }
  return                  { label: 'Тяжёлая тревога',     badge: 'badge-red' }
}

const PSYCH_TITLE = {
  'Психотерапевт': 'психотерапевта',
  'Нарколог':      'нарколога',
}

export default function PsychSuite({ specialty }) {
  const titleSuffix = PSYCH_TITLE[specialty] || 'психиатра'
  const [phq, setPhq] = useState(Array(9).fill(0))
  const [gad, setGad] = useState(Array(7).fill(0))
  const [tab, setTab] = useState('phq')

  const phqScore = phq.reduce((a, b) => a + b, 0)
  const gadScore = gad.reduce((a, b) => a + b, 0)
  const phqCat   = phq9Category(phqScore)
  const gadCat   = gad7Category(gadScore)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#F5F3FF' }}>🧩</div>
        <div>
          <h2>Рабочий кабинет {titleSuffix}</h2>
          <p>PHQ-9 (депрессия), GAD-7 (тревога), шкалы самоопроса</p>
        </div>
      </div>

      {/* Tab switch */}
      <div className="suite-card" style={{ padding: '6px' }}>
        <div className="suite-gender-row">
          <button className={`suite-gender-btn ${tab === 'phq' ? 'active' : ''}`} onClick={() => setTab('phq')}>PHQ-9 (депрессия)</button>
          <button className={`suite-gender-btn ${tab === 'gad' ? 'active' : ''}`} onClick={() => setTab('gad')}>GAD-7 (тревога)</button>
        </div>
      </div>

      {tab === 'phq' && (
        <div className="suite-card">
          <div className="suite-card-title">😔 PHQ-9 — за последние 2 недели</div>
          <div className="suite-form-2col">
            {PHQ9.map((q, idx) => (
              <div key={idx} className="suite-field" style={{ marginBottom: 10 }}>
                <label>{idx + 1}. {q}</label>
                <select className="suite-select" value={phq[idx]}
                  onChange={e => { const a = [...phq]; a[idx] = parseInt(e.target.value); setPhq(a) }}>
                  {OPT_LABELS.map((l, v) => <option key={v} value={v}>{v} — {l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="suite-result-banner">
            <div>
              <div className="suite-score-label">PHQ-9 Score</div>
              <div className="suite-score-big" style={{ color: phqScore >= 10 ? '#F87171' : '#34D399' }}>{phqScore}</div>
            </div>
            <div style={{ flex: 1 }}>
              <span className={`suite-risk-badge ${phqCat.badge}`}>{phqCat.label}</span>
              <div className="suite-advice">{phqCat.advice}</div>
            </div>
          </div>
          {phq[8] > 0 && (
            <div style={{ marginTop: 10, padding: '10px 12px', background: '#FEE2E2', borderRadius: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#B91C1C', lineHeight: 1.4 }}>
                ⚠️ Пациент отметил мысли о причинении вреда себе! Необходима немедленная оценка суицидального риска.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 'gad' && (
        <div className="suite-card">
          <div className="suite-card-title">😰 GAD-7 — за последние 2 недели</div>
          <div className="suite-form-2col">
            {GAD7.map((q, idx) => (
              <div key={idx} className="suite-field" style={{ marginBottom: 10 }}>
                <label>{idx + 1}. {q}</label>
                <select className="suite-select" value={gad[idx]}
                  onChange={e => { const a = [...gad]; a[idx] = parseInt(e.target.value); setGad(a) }}>
                  {OPT_LABELS.map((l, v) => <option key={v} value={v}>{v} — {l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="suite-result-banner">
            <div>
              <div className="suite-score-label">GAD-7 Score</div>
              <div className="suite-score-big" style={{ color: gadScore >= 10 ? '#F87171' : '#34D399' }}>{gadScore}</div>
            </div>
            <span className={`suite-risk-badge ${gadCat.badge}`}>{gadCat.label}</span>
          </div>
        </div>
      )}
    </div>
  )
}
