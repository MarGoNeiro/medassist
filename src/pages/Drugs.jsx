import { useState } from 'react'
import { drugs, getInteraction } from '../data/drugs'
import Fuse from 'fuse.js'
import BookmarkBtn from '../components/BookmarkBtn'

const fuse = new Fuse(drugs, { keys: ['inn', 'brand', 'group'], threshold: 0.35 })

function ChevronRight() {
  return <svg className="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}

function ChevronDown({ open }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }}><path d="m6 9 6 6 6-6"/></svg>
}

const FORM_URL = import.meta.env.VITE_FEEDBACK_FORM_URL

function reportError(subject) {
  if (!FORM_URL) return
  const url = `${FORM_URL}?usp=pp_url&entry.2126400850=` + encodeURIComponent(subject)
  window.open(url, '_blank', 'noopener')
}

function addRecent(drug) {
  const recent = JSON.parse(localStorage.getItem('recent') || '[]')
  const filtered = recent.filter(r => !(r.section === 'drugs' && r.id === drug.id))
  filtered.unshift({ section: 'drugs', id: drug.id, label: drug.inn })
  localStorage.setItem('recent', JSON.stringify(filtered.slice(0, 10)))
}

function copyText(text) {
  navigator.clipboard?.writeText(text).catch(() => {})
  if (navigator.vibrate) navigator.vibrate(30)
}

function shareText(text) {
  if (navigator.share) {
    navigator.share({ text }).catch(() => {})
  } else {
    copyText(text)
    alert('Скопировано в буфер обмена')
  }
}

function DrugCard({ drug, onBack }) {
  const [tab, setTab] = useState('dosing')
  const [openSection, setOpenSection] = useState('adult')
  const [checkDrugs, setCheckDrugs] = useState([drug])
  const [checkQuery, setCheckQuery] = useState('')
  const [checkResults, setCheckResults] = useState([])

  const tabs = [
    { id: 'dosing', label: 'Дозировки' },
    { id: 'interactions', label: 'Взаимодействия' },
    { id: 'contraindications', label: 'Противопоказания' },
    { id: 'alternatives', label: 'Аналоги' },
  ]

  const severityConfig = {
    danger: { color: '#DC2626', bg: '#FEE2E2', icon: '🔴', label: 'Противопоказано' },
    warning: { color: '#D97706', bg: '#FEF9C3', icon: '🟡', label: 'Осторожно' },
    safe: { color: '#16A34A', bg: '#DCFCE7', icon: '🟢', label: 'Совместимо' },
  }

  function handleCheckSearch(q) {
    setCheckQuery(q)
    if (q.length < 2) { setCheckResults([]); return }
    const res = fuse.search(q).map(r => r.item).filter(d => !checkDrugs.find(cd => cd.id === d.id)).slice(0, 5)
    setCheckResults(res)
  }

  function addCheckDrug(d) {
    setCheckDrugs(prev => [...prev, d])
    setCheckQuery('')
    setCheckResults([])
  }

  function removeCheckDrug(id) {
    if (checkDrugs.length === 1) return
    setCheckDrugs(prev => prev.filter(d => d.id !== id))
  }

  const interactionPairs = []
  for (let i = 0; i < checkDrugs.length; i++) {
    for (let j = i + 1; j < checkDrugs.length; j++) {
      const inter = getInteraction(checkDrugs[i].id, checkDrugs[j].id)
      interactionPairs.push({ a: checkDrugs[i], b: checkDrugs[j], inter })
    }
  }

  const dosingLabels = { adult: 'Взрослые', renal: 'Почечная недостаточность', elderly: 'Пожилые', pregnancy: 'Беременность' }

  function shareResult() {
    const pairs = interactionPairs.map(p => {
      if (!p.inter) return `${p.a.inn} + ${p.b.inn}: совместимы`
      const cfg = severityConfig[p.inter.severity]
      return `${p.a.inn} + ${p.b.inn}: ${cfg.label}\n${p.inter.description}`
    }).join('\n\n')
    shareText(`Проверка взаимодействий\n\n${pairs}\n\nMedAssist`)
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 17 }}>{drug.inn}</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{drug.brand}</p>
        </div>
        {drug.znvlp && <span className="badge badge-green">ЖНВЛП</span>}
        <BookmarkBtn
          id={`drug_${drug.id}`}
          type="drug"
          title={drug.inn}
          subtitle={drug.group}
          section="drugs"
          itemId={drug.id}
        />
      </div>

      <div className="drug-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`drug-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="drug-disclaimer">
        Справочная информация. Дозировку и тактику лечения определяет врач индивидуально.
      </div>

      <div className="page-content">
        {tab === 'dosing' && (
          <div>
            {Object.entries(drug.dosing).map(([key, text]) => (
              <div key={key} className="accordion">
                <button className="accordion-header" onClick={() => setOpenSection(openSection === key ? '' : key)}>
                  <span>{dosingLabels[key]}</span>
                  <ChevronDown open={openSection === key} />
                </button>
                {openSection === key && <div className="accordion-body">{text}</div>}
              </div>
            ))}
          </div>
        )}

        {tab === 'interactions' && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
              Добавьте препараты для проверки совместимости
            </p>
            <div className="chip-list">
              {checkDrugs.map(d => (
                <div key={d.id} className="chip">
                  {d.inn}
                  {checkDrugs.length > 1 && (
                    <button onClick={() => removeCheckDrug(d.id)} className="chip-remove">×</button>
                  )}
                </div>
              ))}
            </div>
            <div className="search-bar" style={{ marginBottom: 8 }}>
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={checkQuery} onChange={e => handleCheckSearch(e.target.value)} placeholder="+ Добавить препарат" />
            </div>
            {checkResults.map(d => (
              <button key={d.id} className="list-item" onClick={() => addCheckDrug(d)}>
                <div className="list-item-content">
                  <div className="list-item-title">{d.inn}</div>
                  <div className="list-item-subtitle">{d.brand}</div>
                </div>
              </button>
            ))}
            {checkDrugs.length >= 2 && (
              <div style={{ marginTop: 16 }}>
                {interactionPairs.map((pair, i) => {
                  const cfg = pair.inter ? severityConfig[pair.inter.severity] : severityConfig.safe
                  return (
                    <div key={i} className="interaction-card" style={{ background: cfg.bg, borderLeft: `4px solid ${cfg.color}` }}>
                      <div className="interaction-header">
                        <span>{cfg.icon} {pair.a.inn} + {pair.b.inn}</span>
                        <span style={{ color: cfg.color, fontWeight: 600, fontSize: 13 }}>{cfg.label}</span>
                      </div>
                      {pair.inter && <p className="interaction-desc">{pair.inter.description}</p>}
                      {!pair.inter && <p className="interaction-desc">Значимых взаимодействий не обнаружено в базе.</p>}
                    </div>
                  )
                })}
                <button className="btn-primary" style={{ marginTop: 12 }} onClick={shareResult}>
                  Поделиться результатом
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'contraindications' && (
          <div>
            {drug.contraindications.map((c, i) => (
              <div key={i} className="list-item" style={{ borderRadius: i === 0 ? '12px 12px 0 0' : i === drug.contraindications.length - 1 ? '0 0 12px 12px' : 0 }}>
                <span style={{ color: '#DC2626' }}>✕</span>
                <div className="list-item-content"><div className="list-item-title" style={{ whiteSpace: 'normal' }}>{c}</div></div>
              </div>
            ))}
          </div>
        )}

        {tab === 'alternatives' && (
          <div>
            {drug.alternatives.length === 0 && <div className="empty-state"><p>Аналоги не добавлены</p></div>}
            {drug.alternatives.map((a, i) => (
              <div key={i} className="list-item" style={{ borderRadius: i === 0 ? '12px 12px 0 0' : i === drug.alternatives.length - 1 ? '0 0 12px 12px' : 0 }}>
                <div className="list-item-content"><div className="list-item-title">{a}</div></div>
              </div>
            ))}
          </div>
        )}

        {FORM_URL && (
          <button className="report-error-btn" onClick={() => reportError(drug.inn)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            Нашли ошибку в данных?
          </button>
        )}
      </div>
    </div>
  )
}

export default function Drugs({ initialId }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(() => initialId ? drugs.find(d => d.id === initialId) || null : null)

  if (selected) return <DrugCard drug={selected} onBack={() => setSelected(null)} />

  let results = query.length >= 2
    ? fuse.search(query).map(r => r.item)
    : drugs

  if (filter === 'znvlp') results = results.filter(d => d.znvlp)

  function selectDrug(drug) {
    addRecent(drug)
    setSelected(drug)
  }

  return (
    <div className="page">
      <div className="page-header"><h1>Препараты</h1></div>
      <div className="page-content">
        <div className="search-bar">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="МНН или торговое название..." />
          {query && <button onClick={() => setQuery('')} style={{ color: 'var(--color-text-secondary)', fontSize: 18 }}>×</button>}
        </div>
        <div className="filter-row">
          {['all', 'znvlp'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Все' : 'ЖНВЛП'}
            </button>
          ))}
        </div>
        {results.length === 0 && <div className="empty-state"><p>Ничего не найдено</p></div>}
        <div className="list-block">
          {results.map((drug, i) => (
            <button key={drug.id} className="list-item" onClick={() => selectDrug(drug)}
              style={{ borderRadius: i === 0 ? '12px 12px 0 0' : i === results.length - 1 ? '0 0 12px 12px' : 0 }}>
              <div className="list-item-content">
                <div className="list-item-title">{drug.inn}</div>
                <div className="list-item-subtitle">{drug.brand} · {drug.group}</div>
              </div>
              {drug.znvlp && <span className="badge badge-green" style={{ marginRight: 8 }}>ЖНВЛП</span>}
              <ChevronRight />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
