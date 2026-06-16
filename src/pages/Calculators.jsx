import { useState } from 'react'
import { calculators, specialties } from '../data/calculators'
import BookmarkBtn from '../components/BookmarkBtn'

function ChevronRight() {
  return <svg className="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}

function addRecent(calc) {
  const recent = JSON.parse(localStorage.getItem('recent') || '[]')
  const filtered = recent.filter(r => !(r.section === 'calc' && r.id === calc.id))
  filtered.unshift({ section: 'calc', id: calc.id, label: calc.name })
  localStorage.setItem('recent', JSON.stringify(filtered.slice(0, 10)))
}

const colorMap = { success: '#16A34A', warning: '#D97706', danger: '#DC2626' }
const bgMap = { success: '#DCFCE7', warning: '#FEF9C3', danger: '#FEE2E2' }

function CalcView({ calc, onBack }) {
  const initValues = {}
  calc.fields.forEach(f => { initValues[f.id] = f.type === 'toggle' ? false : f.type === 'select' ? 0 : '' })
  const [values, setValues] = useState(initValues)

  function getScore() {
    if (calc.calculate) return calc.calculate(values)
    let s = 0
    calc.fields.forEach(f => {
      if (f.type === 'toggle' && values[f.id]) s += f.points
      if (f.type === 'select') s += f.points?.[values[f.id]] ?? 0
    })
    return s
  }

  const score = getScore()
  const result = score !== null ? calc.interpret(score) : null

  function setValue(id, val) { setValues(prev => ({ ...prev, [id]: val })) }

  function shareResult() {
    if (!result) return
    const text = `${calc.name}: ${typeof score === 'number' ? score + ' баллов — ' : ''}${result.risk}\n${result.next}\n\nMedAssist`
    if (navigator.share) navigator.share({ text }).catch(() => {})
    else { navigator.clipboard?.writeText(text); if (navigator.vibrate) navigator.vibrate(30) }
  }

  function copyResult() {
    if (!result) return
    const text = `${calc.name}: ${typeof score === 'number' ? score + ' — ' : ''}${result.risk}`
    navigator.clipboard?.writeText(text)
    if (navigator.vibrate) navigator.vibrate(30)
  }

  const hasNumbers = calc.fields.some(f => f.type === 'number')
  const allFilled = !hasNumbers || calc.fields.filter(f => f.type === 'number').every(f => values[f.id])

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 17 }}>{calc.name}</h1>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{calc.description}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="calc-fields">
          {calc.fields.map(field => (
            <div key={field.id} className="calc-field">
              {field.type === 'toggle' && (
                <button
                  className={`toggle-row ${values[field.id] ? 'active' : ''}`}
                  onClick={() => setValue(field.id, !values[field.id])}
                >
                  <span className="toggle-label">{field.label}</span>
                  <div className={`toggle-switch ${values[field.id] ? 'on' : ''}`}>
                    <div className="toggle-thumb" />
                  </div>
                </button>
              )}
              {field.type === 'number' && (
                <div className="number-field">
                  <label>{field.label}</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder={field.placeholder}
                    value={values[field.id]}
                    onChange={e => setValue(field.id, e.target.value)}
                  />
                </div>
              )}
              {field.type === 'select' && (
                <div className="select-field">
                  <label>{field.label}</label>
                  <div className="select-options">
                    {field.options.map((opt, idx) => (
                      <button
                        key={idx}
                        className={`select-opt ${values[field.id] === idx ? 'active' : ''}`}
                        onClick={() => setValue(field.id, idx)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {result && allFilled && (
          <div className="result-block" style={{ background: bgMap[result.color], borderLeft: `4px solid ${colorMap[result.color]}` }}>
            <div className="result-score" style={{ color: colorMap[result.color] }}>
              {typeof score === 'number' && !calc.calculate && <span className="score-number">{score}</span>}
              <span className="score-label">{result.risk}</span>
            </div>
            <p className="result-next">{result.next}</p>
            <p className="result-source">{calc.source}</p>
            <div className="result-actions">
              <button className="btn-secondary" style={{ flex: 1 }} onClick={copyResult}>Скопировать</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={shareResult}>Поделиться</button>
              <BookmarkBtn
                id={`calc_${calc.id}`}
                type="calc"
                title={calc.name}
                subtitle={result.risk}
                section="calc"
                itemId={calc.id}
              />
            </div>
          </div>
        )}

        {hasNumbers && !allFilled && (
          <div className="result-placeholder">Заполните числовые поля для расчёта</div>
        )}
      </div>
    </div>
  )
}

export default function Calculators() {
  const [specialty, setSpecialty] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  if (selected) return <CalcView calc={selected} onBack={() => setSelected(null)} />

  let list = specialty === 'all' ? calculators : calculators.filter(c => c.specialty.includes(specialty))
  if (query.length >= 2) list = list.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()))

  function select(calc) { addRecent(calc); setSelected(calc) }

  return (
    <div className="page">
      <div className="section-hero section-hero--calc">
        <p className="section-hero-label">Инструменты</p>
        <h1 className="section-hero-title">Калькуляторы</h1>
      </div>
      <div className="page-content">
        <div className="search-bar">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Найти шкалу..." />
        </div>
        <div className="spec-scroll">
          {specialties.map(s => (
            <button key={s.id} className={`filter-btn ${specialty === s.id ? 'active' : ''}`} onClick={() => setSpecialty(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className="list-block" style={{ marginTop: 16 }}>
          {list.map((calc, i) => (
            <button key={calc.id} className="list-item" onClick={() => select(calc)}
              style={{ borderRadius: i === 0 ? '12px 12px 0 0' : i === list.length - 1 ? '0 0 12px 12px' : 0 }}>
              <div className="list-item-content">
                <div className="list-item-title">{calc.name}</div>
                <div className="list-item-subtitle">{calc.description}</div>
              </div>
              <ChevronRight />
            </button>
          ))}
        </div>
        {list.length === 0 && <div className="empty-state"><p>Ничего не найдено</p></div>}
      </div>
    </div>
  )
}
