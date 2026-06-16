import { useState, useMemo } from 'react'
import { icd10 } from '../data/icd10'

const CYR_TO_LAT = { 'а':'a','в':'b','с':'c','е':'e','к':'k','м':'m','н':'h','о':'o','р':'p','т':'t','х':'x','А':'A','В':'B','С':'C','Е':'E','К':'K','М':'M','Н':'H','О':'O','Р':'P','Т':'T','Х':'X' }
function normQuery(q) { return q.split('').map(ch => CYR_TO_LAT[ch] ?? ch).join('') }
import { getCrossRefs } from '../data/icd10-crossrefs'
import BookmarkBtn from '../components/BookmarkBtn'

const FORM_URL = import.meta.env.VITE_FEEDBACK_FORM_URL

function reportError(subject) {
  if (!FORM_URL) return
  const url = `${FORM_URL}?usp=pp_url&entry.2126400850=` + encodeURIComponent(subject)
  window.open(url, '_blank', 'noopener')
}

function addRecent(item) {
  const recent = JSON.parse(localStorage.getItem('recent') || '[]')
  const filtered = recent.filter(r => !(r.section === 'icd' && r.id === item.code))
  filtered.unshift({ section: 'icd', id: item.code, label: `${item.code} ${item.title}` })
  localStorage.setItem('recent', JSON.stringify(filtered.slice(0, 10)))
}

// ICD-10 chapters for default navigation
const CHAPTERS = [
  { range: 'A00–B99', title: 'Инфекционные и паразитарные болезни',        letter: 'A' },
  { range: 'C00–D48', title: 'Новообразования',                             letter: 'C' },
  { range: 'D50–D89', title: 'Болезни крови и иммунитета',                 letter: 'D' },
  { range: 'E00–E90', title: 'Эндокринные болезни и нарушения питания',    letter: 'E' },
  { range: 'F00–F99', title: 'Психические расстройства',                   letter: 'F' },
  { range: 'G00–G99', title: 'Болезни нервной системы',                    letter: 'G' },
  { range: 'H00–H59', title: 'Болезни глаза',                              letter: 'H0' },
  { range: 'H60–H95', title: 'Болезни уха',                                letter: 'H6' },
  { range: 'I00–I99', title: 'Болезни системы кровообращения',             letter: 'I' },
  { range: 'J00–J99', title: 'Болезни органов дыхания',                    letter: 'J' },
  { range: 'K00–K93', title: 'Болезни органов пищеварения',                letter: 'K' },
  { range: 'L00–L99', title: 'Болезни кожи',                               letter: 'L' },
  { range: 'M00–M99', title: 'Болезни костно-мышечной системы',           letter: 'M' },
  { range: 'N00–N99', title: 'Болезни мочеполовой системы',                letter: 'N' },
  { range: 'O00–O99', title: 'Беременность, роды и послеродовой период',   letter: 'O' },
  { range: 'P00–P96', title: 'Отдельные состояния перинатального периода', letter: 'P' },
  { range: 'Q00–Q99', title: 'Врождённые аномалии и пороки развития',      letter: 'Q' },
  { range: 'R00–R99', title: 'Симптомы, признаки, отклонения',             letter: 'R' },
  { range: 'S00–T98', title: 'Травмы и отравления',                        letter: 'S' },
  { range: 'V01–Y98', title: 'Внешние причины заболеваемости',             letter: 'V' },
  { range: 'Z00–Z99', title: 'Факторы, влияющие на здоровье',              letter: 'Z' },
]

function CrossRefSection({ codes, marker, label, onNavigate }) {
  if (!codes.length) return null
  const items = codes.map(code => ({ code, entry: icd10.find(i => i.code === code) }))
  return (
    <div className="crossref-block">
      <p className="crossref-label">{label}</p>
      {items.map(({ code, entry }) => (
        <button key={code} className="crossref-row" onClick={() => entry && onNavigate(entry)}>
          <span className="crossref-marker">{marker}</span>
          <span className="crossref-code">{code}</span>
          <span className="crossref-title">{entry ? entry.title : code}</span>
          {entry && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--color-text-tertiary)' }}>
              <path d="m9 18 6-6-6-6"/>
            </svg>
          )}
        </button>
      ))}
    </div>
  )
}

function CodeCard({ item, onBack, onNavigate }) {
  const [copied, setCopied] = useState(false)
  const children = useMemo(
    () => icd10.filter(i => i.code !== item.code && i.code.startsWith(item.code.split('.')[0]) && i.code.includes('.')),
    [item.code]
  )
  const { dagRefs, astRefs } = useMemo(() => getCrossRefs(item.code), [item.code])

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

  const isDagger   = dagRefs.length > 0
  const isAsterisk = astRefs.length > 0

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1>МКБ-10</h1>
        <BookmarkBtn
          id={`icd_${item.code}`}
          type="icd"
          title={`${item.code} — ${item.title}`}
          subtitle={item.blockTitle}
          section="icd"
          itemId={item.code}
        />
      </div>
      <div className="page-content">
        <div className="code-card">
          <div className="code-big">
            {item.code}
            {isDagger   && <span className="code-symbol dagger-symbol">†</span>}
            {isAsterisk && <span className="code-symbol asterisk-symbol">*</span>}
          </div>
          <div className="code-title">{item.title}</div>
          {item.blockTitle && <div className="code-block-label">{item.blockTitle} · {item.block}</div>}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={copy}>
            {copied ? '✓ Скопировано' : 'Скопировать код'}
          </button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={share}>Поделиться</button>
        </div>

        {/* Перекрёстные ссылки */}
        {isDagger && (
          <CrossRefSection
            codes={dagRefs}
            marker="*"
            label="† Этот код — этиология. Коды проявлений:"
            onNavigate={onNavigate}
          />
        )}
        {isAsterisk && (
          <CrossRefSection
            codes={astRefs}
            marker="†"
            label="* Этот код — проявление. Коды основного заболевания:"
            onNavigate={onNavigate}
          />
        )}

        {/* Подкоды */}
        {children.length > 0 && (
          <>
            <p className="section-title" style={{ marginTop: (isDagger || isAsterisk) ? 16 : 0 }}>Подкоды</p>
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

        {FORM_URL && (
          <button className="report-error-btn" onClick={() => reportError(`${item.code} ${item.title}`)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            Нашли ошибку в данных?
          </button>
        )}
      </div>
    </div>
  )
}

// Фильтрует все коды данной главы
function getChapterCodes(chapter) {
  if (chapter.letter === 'D') {
    return icd10.filter(i => i.code.startsWith('D') && parseInt(i.code.slice(1)) >= 50)
  }
  if (chapter.letter === 'H0') {
    return icd10.filter(i => i.code.startsWith('H') && parseInt(i.code.slice(1)) <= 59)
  }
  if (chapter.letter === 'H6') {
    return icd10.filter(i => i.code.startsWith('H') && parseInt(i.code.slice(1)) >= 60)
  }
  return icd10.filter(i => i.code.startsWith(chapter.letter))
}

// Список блоков внутри главы
function ChapterView({ chapter, onBlock, onBack }) {
  const blocks = useMemo(() => {
    const all = getChapterCodes(chapter)
    const seen = new Map()
    for (const item of all) {
      if (item.block && !seen.has(item.block)) {
        seen.set(item.block, { range: item.block, title: item.blockTitle, count: 0 })
      }
      if (item.block) seen.get(item.block).count++
    }
    return [...seen.values()]
  }, [chapter])

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 style={{ fontSize: 15 }}>{chapter.range}</h1>
      </div>
      <div className="page-content">
        <p className="chapter-subtitle">{chapter.title}</p>
        <div className="list-block">
          {blocks.map((block, i) => (
            <button key={block.range} className="list-item" onClick={() => onBlock(block)}
              style={{ borderRadius: i === 0 ? '12px 12px 0 0' : i === blocks.length - 1 ? '0 0 12px 12px' : 0 }}>
              <div className="icd-chapter-code">{block.range}</div>
              <div className="list-item-content">
                <div className="list-item-title" style={{ fontSize: 13 }}>{block.title}</div>
                <div className="list-item-subtitle">{block.count} кодов</div>
              </div>
              <svg className="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Коды внутри блока
function BlockView({ block, chapter, onSelect, onBack }) {
  const [query, setQuery] = useState('')
  const codes = useMemo(() => {
    let list = getChapterCodes(chapter).filter(i => i.block === block.range)
    if (query.length >= 2) {
      const lq = normQuery(query).toLowerCase()
      list = list.filter(i => i.code.toLowerCase().includes(lq) || i.title.toLowerCase().includes(lq))
    }
    return list
  }, [block, chapter, query])

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 style={{ fontSize: 15 }}>{block.range}</h1>
      </div>
      <div className="page-content">
        <p className="chapter-subtitle">{block.title}</p>
        <div className="search-bar" style={{ marginBottom: 12 }}>
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Фильтр..." />
          {query && <button onClick={() => setQuery('')} style={{ color: 'var(--color-text-secondary)', fontSize: 18 }}>×</button>}
        </div>
        <div className="list-block">
          {codes.map((item, i) => (
            <button key={item.code} className="list-item icd-code-row" onClick={() => onSelect(item)}
              style={{ borderRadius: i === 0 ? '12px 12px 0 0' : i === codes.length - 1 ? '0 0 12px 12px' : 0,
                       paddingLeft: item.code.includes('.') ? 28 : 14 }}>
              <div className="list-item-content">
                <div className="list-item-title" style={{ fontFamily: 'monospace' }}>
                  {item.code}
                </div>
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

export default function ICD10({ initialCode }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(() => initialCode ? icd10.find(i => i.code === initialCode) || null : null)
  const [chapter, setChapter] = useState(null)
  const [block, setBlock] = useState(null)

  const recentCodes = JSON.parse(localStorage.getItem('recent') || '[]').filter(r => r.section === 'icd').slice(0, 5)

  const results = useMemo(() => {
    if (query.length < 2) return null
    const lq = normQuery(query).toLowerCase()
    return icd10.filter(i => i.code.toLowerCase().includes(lq) || i.title.toLowerCase().includes(lq)).slice(0, 60)
  }, [query])

  function openItem(item) { addRecent(item); setSelected(item) }

  if (selected) return <CodeCard item={selected} onBack={() => setSelected(null)} onNavigate={openItem} />
  if (block)   return <BlockView block={block} chapter={chapter} onSelect={openItem} onBack={() => setBlock(null)} />
  if (chapter) return <ChapterView chapter={chapter} onBlock={b => setBlock(b)} onBack={() => { setChapter(null); setBlock(null) }} />

  function select(item) { addRecent(item); setSelected(item) }

  return (
    <div className="page">
      <div className="section-hero section-hero--icd">
        <p className="section-hero-label">Справочник</p>
        <h1 className="section-hero-title">МКБ-10</h1>
        <div className="icd-hero-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Код или название болезни..."
            className="icd-hero-input"
          />
          {query && <button onClick={() => setQuery('')} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, lineHeight: 1 }}>×</button>}
        </div>
      </div>
      <div className="page-content">

        {/* Recent codes */}
        {recentCodes.length > 0 && !query && (
          <div className="recent-chips">
            {recentCodes.map(r => (
              <button key={r.id} className="recent-chip" onClick={() => { const item = icd10.find(i => i.code === r.id); if (item) select(item) }}>
                {r.id}
              </button>
            ))}
          </div>
        )}

        {/* Search results */}
        {results && (
          <div className="list-block">
            {results.length === 0 && <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Ничего не найдено</div>}
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
        )}

        {/* Chapter navigation */}
        {!query && (
          <>
            <p className="section-title">Классы МКБ-10</p>
            <div className="list-block">
              {CHAPTERS.map((ch, i) => (
                <button key={ch.range} className="list-item" onClick={() => setChapter(ch)}
                  style={{ borderRadius: i === 0 ? '12px 12px 0 0' : i === CHAPTERS.length - 1 ? '0 0 12px 12px' : 0 }}>
                  <div className="icd-chapter-code">{ch.range}</div>
                  <div className="list-item-content">
                    <div className="list-item-title" style={{ fontSize: 13, whiteSpace: 'normal' }}>{ch.title}</div>
                  </div>
                  <svg className="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
