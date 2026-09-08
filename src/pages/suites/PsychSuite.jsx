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

const PCPTSD = [
  'Кошмарные сны или навязчивые воспоминания о пережитом травматическом событии',
  'Попытки избежать мыслей о событии или ситуаций, напоминающих о нём',
  'Постоянная настороженность, повышенная пугливость или тревожность',
  'Ощущение оцепенения, отстранённость, потеря интереса к привычному',
  'Чувство вины или неспособность испытывать положительные эмоции',
]

function pcptsdResult(score) {
  if (score < 3) return { label: 'ПТСР маловероятен', badge: 'badge-green',  advice: 'Наблюдение. Повторить при появлении новых симптомов.' }
  return              { label: 'Вероятное ПТСР',     badge: 'badge-red',    advice: 'Направление к психиатру / психотерапевту. Полная диагностика по DSM-5 / МКБ-11.' }
}

const ALTMAN = [
  { q: 'Настроение',           opts: ['Норма', 'Немного приподнятое', 'Заметно приподнятое', 'Эйфоричное', 'Экстремально эйфоричное'] },
  { q: 'Уверенность в себе',   opts: ['Норма', 'Немного повышена', 'Заметно повышена', 'Грандиозность', 'Бредовые идеи величия'] },
  { q: 'Потребность во сне',   opts: ['Норма', 'Немного снижена', 'Снижена', 'Мало сна, хорошо себя чувствует', 'Практически не спит'] },
  { q: 'Речь',                 opts: ['Норма', 'Чуть активнее', 'Явно более активная', 'Трудно перебить', 'Не умолкает'] },
  { q: 'Активность / энергия', opts: ['Норма', 'Немного повышена', 'Заметно повышена', 'Выраженная', 'Неуправляемая'] },
]

function altmanResult(score) {
  if (score <= 5)  return { label: 'Мания маловероятна',    badge: 'badge-green',  advice: 'Клинически значимой мании не выявлено.' }
  if (score <= 10) return { label: 'Вероятная гипомания',   badge: 'badge-yellow', advice: 'Наблюдение. Оценка в контексте БАР. Возможна нормотимическая терапия.' }
  return                  { label: 'Вероятная мания',       badge: 'badge-red',    advice: 'Направление к психиатру. Нормотимики (вальпроат, литий). Исключить психоз.' }
}

const PSYCH_TITLE = {
  'Психотерапевт': 'психотерапевта',
  'Нарколог':      'нарколога',
}

export default function PsychSuite({ specialty }) {
  const titleSuffix = PSYCH_TITLE[specialty] || 'психиатра'
  const [phq, setPhq]     = useState(Array(9).fill(0))
  const [gad, setGad]     = useState(Array(7).fill(0))
  const [pc, setPc]       = useState(Array(5).fill(false))
  const [altman, setAltman] = useState(Array(5).fill(0))
  const [tab, setTab]     = useState('phq')

  const phqScore    = phq.reduce((a, b) => a + b, 0)
  const gadScore    = gad.reduce((a, b) => a + b, 0)
  const pcScore     = pc.filter(Boolean).length
  const altmanScore = altman.reduce((a, b) => a + b, 0)
  const phqCat      = phq9Category(phqScore)
  const gadCat      = gad7Category(gadScore)
  const pcRes       = pcptsdResult(pcScore)
  const altmanRes   = altmanResult(altmanScore)

  return (
    <div className="suite">

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
            <div style={{}}>
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

      {/* PC-PTSD-5 + Альтмана */}
      <div className="nephr-two-col">

        <div className="suite-card">
          <div className="suite-card-title">🔴 PC-PTSD-5 — скрининг ПТСР (за последний месяц)</div>
          {PCPTSD.map((q, i) => (
            <button key={i} className={`suite-toggle-row ${pc[i] ? 'active' : ''}`}
              onClick={() => { const a = [...pc]; a[i] = !a[i]; setPc(a) }}>
              <span className="suite-toggle-label">{q}</span>
              <div className={`suite-toggle ${pc[i] ? 'on' : ''}`}><div className="suite-toggle-thumb" /></div>
            </button>
          ))}
          <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div className="suite-score-big" style={{ color: pcScore >= 3 ? '#F87171' : '#34D399' }}>{pcScore}</div>
            </div>
            <div>
              <span className={`suite-risk-badge ${pcRes.badge}`} style={{ fontSize: 11, padding: '3px 10px' }}>{pcRes.label}</span>
              <div className="suite-advice" style={{ fontSize: 13 }}>{pcRes.advice}</div>
            </div>
          </div>
        </div>

        <div className="suite-card">
          <div className="suite-card-title">🔆 Шкала Альтмана — самооценка мании / гипомании</div>
          {ALTMAN.map((item, i) => (
            <div key={i} className="suite-field" style={{ marginBottom: 10 }}>
              <label>{item.q}</label>
              <select className="suite-select" value={altman[i]}
                onChange={e => { const a = [...altman]; a[i] = parseInt(e.target.value); setAltman(a) }}>
                {item.opts.map((o, v) => <option key={v} value={v}>{v} — {o}</option>)}
              </select>
            </div>
          ))}
          <div className="suite-result-banner" style={{ background: 'none', borderRadius: 0, padding: '12px 0 0 0', marginTop: 4 }}>
            <div style={{ textAlign: 'right' }}>
              <div className="suite-score-big" style={{ color: altmanScore >= 6 ? '#F87171' : '#34D399' }}>{altmanScore}</div>
            </div>
            <div>
              <span className={`suite-risk-badge ${altmanRes.badge}`} style={{ fontSize: 11, padding: '3px 10px' }}>{altmanRes.label}</span>
              <div className="suite-advice" style={{ fontSize: 13 }}>{altmanRes.advice}</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
