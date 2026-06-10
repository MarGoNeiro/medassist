import './Home.css'

const specialtyNames = {
  'Терапевт / ВОП': 'Терапевт',
  'Педиатр': 'Педиатр',
  'Кардиолог': 'Кардиолог',
  'Невролог': 'Невролог',
  'Хирург': 'Хирург',
  'Гинеколог': 'Гинеколог',
  'Эндокринолог': 'Эндокринолог',
  'Гастроэнтеролог': 'Гастроэнтеролог',
  'Пульмонолог': 'Пульмонолог',
  'Нефролог': 'Нефролог',
  'Уролог': 'Уролог',
  'Офтальмолог': 'Офтальмолог',
  'Оториноларинголог (ЛОР)': 'Оториноларинголог',
  'Дерматолог': 'Дерматолог',
  'Психиатр': 'Психиатр',
  'Онколог': 'Онколог',
  'Ревматолог': 'Ревматолог',
  'Инфекционист': 'Инфекционист',
  'Анестезиолог-реаниматолог': 'Анестезиолог',
  'Хирург (сосудистый)': 'Хирург',
  'Травматолог-ортопед': 'Травматолог',
  'Акушер': 'Акушер',
  'Аллерголог-иммунолог': 'Аллерголог',
  'Гематолог': 'Гематолог',
  'Диетолог / Нутрициолог': 'Диетолог',
  'Физиотерапевт': 'Физиотерапевт',
  'Врач скорой помощи': 'Врач СМП',
  'Семейный врач': 'Семейный врач',
  'Фтизиатр': 'Фтизиатр',
  'Нарколог': 'Нарколог',
  'Психотерапевт': 'Психотерапевт',
  'Стоматолог': 'Стоматолог',
}

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Доброе утро,'
  if (h >= 12 && h < 17) return 'Добрый день,'
  if (h >= 17 && h < 22) return 'Добрый вечер,'
  return 'Доброй ночи,'
}

function ArrowIcon() {
  return (
    <svg className="tile-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}

export default function Home({ onNavigate, specialty, onChangeSpecialty }) {
  const recentStr = localStorage.getItem('recent') || '[]'
  const recent = JSON.parse(recentStr).slice(0, 5)
  const specialtyLabel = specialtyNames[specialty] || 'Доктор'

  return (
    <div className="page">
      {/* Hero header */}
      <div className="home-hero">
        <div className="home-greeting">
          <p className="greeting">{getGreeting()}</p>
          <h1 className="greeting-name">{specialtyLabel}</h1>
        </div>
        <button className="settings-btn" onClick={onChangeSpecialty} aria-label="Сменить специальность">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>

      {/* Tiles grid */}
      <div className="home-tiles">
        <button className="tile tile-blue" onClick={() => onNavigate('drugs')}>
          <div className="tile-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
              <path d="m8.5 8.5 7 7"/>
            </svg>
          </div>
          <div className="tile-body">
            <div className="tile-name">Препараты</div>
            <div className="tile-desc">78 МНН · ЖНВЛП</div>
          </div>
        </button>

        <button className="tile tile-green" onClick={() => onNavigate('calc')}>
          <div className="tile-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="20" x="4" y="2" rx="2"/>
              <line x1="8" x2="16" y1="6" y2="6"/>
              <line x1="16" x2="16" y1="14" y2="18"/>
              <path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/>
              <path d="M12 14h.01"/><path d="M8 14h.01"/>
              <path d="M12 18h.01"/><path d="M8 18h.01"/>
            </svg>
          </div>
          <div className="tile-body">
            <div className="tile-name">Калькуляторы</div>
            <div className="tile-desc">8 клинических шкал</div>
          </div>
        </button>

        <button className="tile tile-purple tile-wide" onClick={() => onNavigate('icd')}>
          <div className="tile-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" x2="21" y1="6" y2="6"/>
              <line x1="8" x2="21" y1="12" y2="12"/>
              <line x1="8" x2="21" y1="18" y2="18"/>
              <line x1="3" x2="3.01" y1="6" y2="6"/>
              <line x1="3" x2="3.01" y1="12" y2="12"/>
              <line x1="3" x2="3.01" y1="18" y2="18"/>
            </svg>
          </div>
          <div className="tile-body">
            <div className="tile-name">МКБ-10</div>
            <div className="tile-desc">Поиск кодов диагнозов</div>
          </div>
          <ArrowIcon />
        </button>
      </div>

      {/* Recent */}
      {recent.length > 0 && (
        <div className="page-content">
          <p className="section-title">Недавние</p>
          <div className="recent-list">
            {recent.map((item, i) => (
              <button key={i} className="recent-item" onClick={() => onNavigate(item.section, item.id)}>
                <span className={`recent-dot dot-${item.section}`} />
                <span className="recent-label">{item.label}</span>
                <svg className="recent-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
