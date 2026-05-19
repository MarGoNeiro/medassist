import { useState } from 'react'
import { icd10 } from '../data/icd10'
import Fuse from 'fuse.js'

const fuse = new Fuse(icd10, { keys: ['code', 'title'], threshold: 0.3 })

function addRecent(item) {
  const recent = JSON.parse(localStorage.getItem('recent') || '[]')
  const filtered = recent.filter(r => !(r.section === 'icd' && r.id === item.code))
  filtered.unshift({ section: 'icd', id: item.code, label: `${item.code} ${item.title}` })
  localStorage.setItem('recent', JSON.stringify(filtered.slice(0, 10)))
}

function CodeCard({ item, onBack }) {
  const [copied, setCopied] = useState(false)
  const children = icd10.filter(i => i.code !== item.code && i.code.startsWith(item.code.split('.')[0]) && i.code.includes('.'))

  function copy() {
    navigator.clipboard?.writeText(item.code)
    if (navigator.vibrate) navigator.vibrate(30)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function share() {
    const text = `${item.code} — ${item.title}`
    if (navigator.share) navigator.share({ text }).catch(() => {})
    else copy()
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1>МКБ-10</h1>
      </div>
      <div className="page-content">
        <div className="code-card">
          <div className="code-big">{item.code}</div>
          <div className="code-title">{item.title}</div>
          <div className="code-block-label">{item.blockTitle} · {item.block}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={copy}>
            {copied ? '✓ Скопировано' : 'Скопировать код'}
          </button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={share}>Поделиться</button>
        </div>
        {children.length > 0 && (
          <>
            <p className="section-title" style={{ marginTop: 0 }}>Подкоды</p>
            <div className="list-block">
              {children.map((c, i) => (
                <div key={c.code} className="list-item"
                  style={{ borderRadius: i === 0 ? '12px 12px 0 0' : i === children.length - 1 ? '0 0 12px 12px' : 0 }}>
                  <div className="list-item-content">
                    <div className="list-item-title" style={{ fontFamily: 'monospace', fontSize: 15 }}>{c.code}</div>
                    <div className="list-item-subtitle" style={{ whiteSpace: 'normal' }}>{c.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ICD10() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  if (selected) return <CodeCard item={selected} onBack={() => setSelected(null)} />

  const recentCodes = JSON.parse(localStorage.getItem('recent') || '[]').filter(r => r.section === 'icd').slice(0, 5)

  const results = query.length >= 2
    ? fuse.search(query).map(r => r.item)
    : icd10.slice(0, 30)

  function select(item) { addRecent(item); setSelected(item) }

  return (
    <div className="page">
      <div className="page-header"><h1>МКБ-10</h1></div>
      <div className="page-content">
        <div className="search-bar">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Код или название болезни..." />
          {query && <button onClick={() => setQuery('')} style={{ color: 'var(--color-text-secondary)', fontSize: 18 }}>×</button>}
        </div>
        {recentCodes.length > 0 && !query && (
          <div className="recent-chips">
            {recentCodes.map(r => (
              <button key={r.id} className="recent-chip" onClick={() => { const item = icd10.find(i => i.code === r.id); if (item) select(item) }}>
                {r.id}
              </button>
            ))}
          </div>
        )}
        <div className="list-block">
          {results.map((item, i) => (
            <button key={item.code} className="list-item" onClick={() => select(item)}
              style={{ borderRadius: i === 0 ? '12px 12px 0 0' : i === results.length - 1 ? '0 0 12px 12px' : 0 }}>
              <div className="list-item-content">
                <div className="list-item-title" style={{ fontFamily: 'monospace' }}>{item.code}</div>
                <div className="list-item-subtitle" style={{ whiteSpace: 'normal' }}>{item.title}</div>
              </div>
              <svg className="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
