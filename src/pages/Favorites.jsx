import { useState } from 'react'
import { getFavorites, toggleFavorite } from '../utils/favorites'
import './Favorites.css'

const typeConfig = {
  drug: { label: 'Препарат', color: '#2563EB', bg: '#EFF6FF' },
  icd:  { label: 'МКБ-10',   color: '#7C3AED', bg: '#F5F3FF' },
  calc: { label: 'Шкала',    color: '#059669', bg: '#ECFDF5' },
}

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100
  if (m100 >= 11 && m100 <= 19) return `${n} ${many}`
  if (m10 === 1) return `${n} ${one}`
  if (m10 >= 2 && m10 <= 4) return `${n} ${few}`
  return `${n} ${many}`
}

export default function Favorites({ onNavigate }) {
  const [favs, setFavs] = useState(getFavorites)

  function remove(id, e) {
    e.stopPropagation()
    toggleFavorite({ id })
    setFavs(getFavorites())
  }

  return (
    <div className="page">
      <div className="page-header"><h1>Избранное</h1></div>

      {favs.length === 0 ? (
        <div className="fav-empty">
          <div className="fav-empty-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p className="fav-empty-title">Пока ничего нет</p>
          <p className="fav-empty-sub">Нажмите на закладку в карточке препарата, кода МКБ или калькулятора — и она появится здесь</p>
        </div>
      ) : (
        <div className="page-content">
          <div className="fav-list">
            {favs.map(fav => {
              const cfg = typeConfig[fav.type] || typeConfig.drug
              return (
                <button key={fav.id} className="fav-item" onClick={() => onNavigate(fav.section, fav.itemId)}>
                  <span className="fav-badge" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <div className="fav-body">
                    <div className="fav-title">{fav.title}</div>
                    {fav.subtitle && <div className="fav-subtitle">{fav.subtitle}</div>}
                  </div>
                  <button className="fav-remove" onClick={e => remove(fav.id, e)} aria-label="Удалить">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </button>
              )
            })}
          </div>
          <p className="fav-count">{plural(favs.length, 'элемент', 'элемента', 'элементов')}</p>
        </div>
      )}
    </div>
  )
}
