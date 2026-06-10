export function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]')
}

export function isFavorite(id) {
  return getFavorites().some(f => f.id === id)
}

export function toggleFavorite(item) {
  const favs = getFavorites()
  const idx = favs.findIndex(f => f.id === item.id)
  if (idx >= 0) {
    favs.splice(idx, 1)
    localStorage.setItem('favorites', JSON.stringify(favs))
    return false
  }
  favs.unshift({ ...item, savedAt: Date.now() })
  localStorage.setItem('favorites', JSON.stringify(favs))
  return true
}
