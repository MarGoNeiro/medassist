import { useState } from 'react'
import { isFavorite, toggleFavorite } from '../utils/favorites'

export default function BookmarkBtn({ id, type, title, subtitle, section, itemId }) {
  const [saved, setSaved] = useState(() => isFavorite(id))

  function toggle(e) {
    e.stopPropagation()
    const result = toggleFavorite({ id, type, title, subtitle, section, itemId })
    setSaved(result)
    if (navigator.vibrate) navigator.vibrate(30)
  }

  return (
    <button
      className={`bookmark-btn${saved ? ' saved' : ''}`}
      onClick={toggle}
      aria-label={saved ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  )
}
