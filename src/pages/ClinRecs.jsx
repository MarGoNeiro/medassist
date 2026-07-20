import { useState, useMemo } from 'react'
import crData from '../data/cr_data.json'
import BookmarkBtn from '../components/BookmarkBtn'
import './ClinRecs.css'

const FORM_URL = import.meta.env.VITE_FEEDBACK_FORM_URL

function reportError(subject) {
  if (!FORM_URL) return
  const url = `${FORM_URL}?usp=pp_url&entry.2126400850=` + encodeURIComponent(subject)
  window.open(url, '_blank', 'noopener')
}

function addCrRecent(r) {
  const recent = JSON.parse(localStorage.getItem('recent') || '[]')
  const filtered = recent.filter(x => !(x.section === 'cr' && x.id === r.id))
  filtered.unshift({ section: 'cr', id: r.id, label: r.name, ts: Date.now() })
  localStorage.setItem('recent', JSON.stringify(filtered.slice(0, 10)))
}

function stemWord(word) {
  return word.length > 5 ? word.slice(0, 5) : word
}

function matchesQuery(text, q) {
  const words = q.split(/\s+/).filter(Boolean)
  return words.every(word => text.includes(stemWord(word)))
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
    </svg>
  )
}

function YaIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7.5"/><path d="m20 20-3.5-3.5"/>
    </svg>
  )
}

function openUrl(url) {
  // Passing a features string (3rd arg) to window.open makes browsers
  // treat it as a popup request, which iOS and some Android browsers block.
  // Using only target='_blank' with no features string is the reliable path.
  window.open(url, '_blank')
}

const AGE_FILTERS = [
  { key: 'all',   label: 'Все' },
  { key: 'adult', label: 'Взрослые' },
  { key: 'child', label: 'Дети' },
]

// Сортируем один раз при загрузке
const sortedData = [...crData].sort((a, b) => {
  const na = (a.name || '').replace(/^[«"№\s]+/, '')
  const nb = (b.name || '').replace(/^[«"№\s]+/, '')
  return na.localeCompare(nb, 'ru', { sensitivity: 'base' })
})

const PAGE_SIZE = 100

function CrItemRow({ r, pinned }) {
  function handleOpen(url) {
    addCrRecent(r)
    openUrl(url)
  }

  return (
    <div className={`cr-item${pinned ? ' cr-item-pinned' : ''}`}>
      <div className="cr-item-top">
        <div className="cr-item-name">{r.name}</div>
        <BookmarkBtn
          id={`cr_${r.id}`}
          type="cr"
          title={r.name}
          subtitle={r.mkb.slice(0, 2).join(', ')}
          section="cr"
          itemId={r.id}
        />
      </div>
      <div className="cr-item-footer">
        <div className="cr-mkb-chips">
          {r.mkb.slice(0, 4).map(code => (
            <span key={code} className="cr-mkb-chip">{code}</span>
          ))}
          {r.mkb.length > 4 && (
            <span className="cr-mkb-chip cr-mkb-more">+{r.mkb.length - 4}</span>
          )}
        </div>
        {r.age && (
          <span className={`cr-age-badge ${r.age === 'Дети' ? 'cr-age-child' : r.age === 'Взрослые, дети' ? 'cr-age-both' : 'cr-age-adult'}`}>
            {r.age}
          </span>
        )}
        <div className="cr-link-btns">
          <button
            className="cr-ya-btn"
            onClick={() => handleOpen(`https://yandex.ru/search/?text=${encodeURIComponent('клинические рекомендации ' + r.name)}`)}
            title="Найти в Яндексе"
          >
            <YaIcon />
            <span>Яндекс</span>
          </button>
          <button
            className="cr-ya-btn cr-mz-btn"
            onClick={() => handleOpen(`https://cr.minzdrav.gov.ru/recomend/${r.id.replace(/_\d+$/, '')}`)}
            title="Открыть на сайте Минздрава"
          >
            <ExternalIcon />
            <span>Минздрав</span>
          </button>
        </div>
      </div>
      {FORM_URL && (
        <button className="report-error-btn" onClick={() => reportError(r.name)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          Нашли ошибку в данных?
        </button>
      )}
    </div>
  )
}

export default function ClinRecs({ initialId }) {
  const [query, setQuery] = useState('')
  const [ageFilter, setAgeFilter] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [pinnedDismissed, setPinnedDismissed] = useState(false)

  const pinnedRecord = initialId && !pinnedDismissed
    ? crData.find(r => r.id === initialId) ?? null
    : null

  const results = useMemo(() => {
    setVisibleCount(PAGE_SIZE)
    const q = query.trim().toLowerCase()
    return sortedData.filter(r => {
      if (ageFilter === 'adult' && r.age === 'Дети') return false
      if (ageFilter === 'child' && r.age === 'Взрослые') return false
      if (!q) return true
      const nameMatch = r.name ? matchesQuery(r.name.toLowerCase(), q) : false
      const mkbMatch = Array.isArray(r.mkb) && r.mkb.some(code => code && matchesQuery(code.toLowerCase(), q))
      return nameMatch || mkbMatch
    })
  }, [query, ageFilter])

  const shown = results.slice(0, visibleCount)
  const hasMore = visibleCount < results.length

  const countLabel = query || ageFilter !== 'all'
    ? `Найдено: ${results.length}`
    : `${crData.length} рекомендаций`

  return (
    <div className="page">
      <div className="section-hero section-hero--cr">
        <p className="section-hero-label">Минздрав РФ</p>
        <h1 className="section-hero-title">Клинические рекомендации</h1>
        <div className="icd-hero-search">
          <SearchIcon />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Название или код МКБ..."
            className="icd-hero-input"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          )}
        </div>
      </div>

      <div className="cr-filter-row">
        {AGE_FILTERS.map(f => (
          <button
            key={f.key}
            className={`cr-chip ${ageFilter === f.key ? 'cr-chip-active' : ''}`}
            onClick={() => setAgeFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {pinnedRecord && (
        <div className="cr-pinned-wrap">
          <div className="cr-pinned-header">
            <span className="cr-pinned-label">Из поиска</span>
            <button className="cr-pinned-close" onClick={() => setPinnedDismissed(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <CrItemRow r={pinnedRecord} pinned />
        </div>
      )}

      <div className="page-content">
        <p className="section-title">{countLabel}</p>

        <div className="list-block">
          {shown.length === 0 ? (
            <div className="cr-empty">Ничего не найдено</div>
          ) : (
            shown.map(r => <CrItemRow key={r.id} r={r} />)
          )}
        </div>

        {hasMore && (
          <button className="cr-load-more" onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
            Загрузить ещё 100
            <span className="cr-load-more-count">показано {shown.length} из {results.length}</span>
          </button>
        )}
      </div>
    </div>
  )
}
