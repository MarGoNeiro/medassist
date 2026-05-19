import { useState } from 'react'
import './Onboarding.css'

const ALL_SPECIALTIES = [
  'Терапевт / ВОП',
  'Педиатр',
  'Кардиолог',
  'Невролог',
  'Хирург',
  'Гинеколог',
  'Эндокринолог',
  'Гастроэнтеролог',
  'Пульмонолог',
  'Нефролог',
  'Уролог',
  'Офтальмолог',
  'Оториноларинголог (ЛОР)',
  'Дерматолог',
  'Психиатр',
  'Онколог',
  'Ревматолог',
  'Инфекционист',
  'Анестезиолог-реаниматолог',
  'Хирург (сосудистый)',
  'Травматолог-ортопед',
  'Акушер',
  'Аллерголог-иммунолог',
  'Гематолог',
  'Диетолог / Нутрициолог',
  'Физиотерапевт',
  'Врач скорой помощи',
  'Семейный врач',
  'Фтизиатр',
  'Нарколог',
  'Психотерапевт',
  'Стоматолог',
]

const QUICK = ['Терапевт / ВОП', 'Педиатр', 'Кардиолог', 'Невролог', 'Хирург', 'Диетолог / Нутрициолог']

export default function Onboarding({ onDone, canBack, onBack }) {
  const [showAll, setShowAll] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = query.length >= 1
    ? ALL_SPECIALTIES.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : ALL_SPECIALTIES

  return (
    <div className="onboarding">
      <div className="onboarding-top">
        {canBack && (
          <button className="ob-back" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        )}
        <div className="onboarding-logo">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h1 className="onboarding-title">MedAssist</h1>
        <p className="onboarding-subtitle">Выберите специальность для персонализации</p>
      </div>

      <div className="onboarding-bottom">
        {!showAll ? (
          <>
            <p className="onboarding-question">Ваша специальность?</p>
            <div className="specialty-grid">
              {QUICK.map(s => (
                <button key={s} className="specialty-btn" onClick={() => onDone(s)}>
                  <span className="spec-label">{s}</span>
                </button>
              ))}
            </div>
            <button className="show-all-btn" onClick={() => setShowAll(true)}>
              Показать все специальности →
            </button>
          </>
        ) : (
          <>
            <p className="onboarding-question">Все специальности</p>
            <div className="search-bar" style={{ marginBottom: 12 }}>
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Найти специальность..."
                autoFocus
              />
            </div>
            <div className="spec-full-list">
              {filtered.map((s, i) => (
                <button key={s} className="spec-full-item" onClick={() => onDone(s)}
                  style={{ borderRadius: i === 0 ? '12px 12px 0 0' : i === filtered.length - 1 ? '0 0 12px 12px' : 0 }}>
                  {s}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              ))}
            </div>
            <button className="show-all-btn" style={{ marginTop: 12 }} onClick={() => setShowAll(false)}>
              ← Назад к быстрому выбору
            </button>
          </>
        )}
        <p className="onboarding-note">Можно изменить в любой момент через настройки</p>
      </div>
    </div>
  )
}
