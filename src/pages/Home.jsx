import './Home.css'

const specialtyNames = {
  'Терапевт / ВОП': 'терапевт',
  'Педиатр': 'педиатр',
  'Кардиолог': 'кардиолог',
  'Невролог': 'невролог',
  'Хирург': 'хирург',
  'Гинеколог': 'гинеколог',
  'Эндокринолог': 'эндокринолог',
  'Гастроэнтеролог': 'гастроэнтеролог',
  'Пульмонолог': 'пульмонолог',
  'Нефролог': 'нефролог',
  'Уролог': 'уролог',
  'Офтальмолог': 'офтальмолог',
  'Оториноларинголог (ЛОР)': 'лор-врач',
  'Дерматолог': 'дерматолог',
  'Психиатр': 'психиатр',
  'Онколог': 'онколог',
  'Ревматолог': 'ревматолог',
  'Инфекционист': 'инфекционист',
  'Анестезиолог-реаниматолог': 'анестезиолог',
  'Хирург (сосудистый)': 'хирург',
  'Травматолог-ортопед': 'травматолог',
  'Акушер': 'акушер',
  'Аллерголог-иммунолог': 'аллерголог',
  'Гематолог': 'гематолог',
  'Диетолог / Нутрициолог': 'диетолог',
  'Физиотерапевт': 'физиотерапевт',
  'Врач скорой помощи': 'врач СМП',
  'Семейный врач': 'семейный врач',
  'Фтизиатр': 'фтизиатр',
  'Нарколог': 'нарколог',
  'Психотерапевт': 'психотерапевт',
  'Стоматолог': 'стоматолог',
}

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Доброе утро'
  if (h >= 12 && h < 17) return 'Добрый день'
  if (h >= 17 && h < 22) return 'Добрый вечер'
  return 'Доброй ночи'
}

export default function Home({ onNavigate, specialty, onChangeSpecialty }) {
  const recentStr = localStorage.getItem('recent') || '[]'
  const recent = JSON.parse(recentStr).slice(0, 3)
  const specialtyLabel = specialtyNames[specialty] || 'доктор'

  return (
    <div className="page">
      <div className="home-header">
        <div>
          <p className="greeting">{getGreeting()},</p>
          <h1 className="greeting-name">{specialtyLabel}</h1>
        </div>
        <button className="settings-btn" onClick={onChangeSpecialty} title="Сменить специальность">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
          </svg>
        </button>
      </div>

      <div className="page-content">
        <div className="home-tiles">
          <button className="tile tile-blue" onClick={() => onNavigate('drugs')}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
            <span>Препараты</span>
            <small>Дозы, взаимодействия, ЖНВЛП</small>
          </button>
          <button className="tile tile-green" onClick={() => onNavigate('calc')}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
            <span>Калькуляторы</span>
            <small>8 клинических шкал</small>
          </button>
          <button className="tile tile-purple" onClick={() => onNavigate('icd')}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
            <span>МКБ-10</span>
            <small>Поиск кодов диагнозов</small>
          </button>
        </div>

        {recent.length > 0 && (
          <>
            <p className="section-title">Недавние</p>
            <div className="recent-list">
              {recent.map((item, i) => (
                <button
                  key={i}
                  className="recent-item"
                  onClick={() => onNavigate(item.section, item.id)}
                >
                  <span className={`recent-dot dot-${item.section}`} />
                  <span className="recent-label">{item.label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
