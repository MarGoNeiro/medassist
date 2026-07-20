import './Subscription.css'

function CheckIcon({ muted }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted ? '#94A3B8' : '#2563EB'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
      <path d="M5 20h14"/>
    </svg>
  )
}

export default function Subscription({ onBack }) {
  return (
    <div className="page sub-page">
      <div className="sub-hero">
        <button className="sub-back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div className="sub-hero-icon">
          <CrownIcon />
        </div>
        <h1 className="sub-hero-title">MedAssist Pro</h1>
        <p className="sub-hero-desc">Профессиональный инструмент для врача — всё нужное под рукой на приёме</p>
      </div>

      <div className="page-content sub-content">

        <div className="sub-tier sub-tier-free">
          <div className="sub-tier-row">
            <span className="sub-tier-name">Бесплатно</span>
            <span className="sub-tier-price sub-tier-price-free">0 ₽</span>
          </div>
          <ul className="sub-feature-list">
            <li><CheckIcon muted /><span>МКБ-10 — полный справочник кодов</span></li>
            <li><CheckIcon muted /><span>Клинические рекомендации МЗ РФ</span></li>
          </ul>
        </div>

        <div className="sub-tier sub-tier-pro">
          <div className="sub-pro-badge">Pro</div>
          <div className="sub-tier-row">
            <span className="sub-tier-name sub-tier-name-pro">Подписка</span>
            <div className="sub-price-block">
              <span className="sub-price-amount">1 300 ₽</span>
              <span className="sub-price-period">/мес</span>
            </div>
          </div>
          <p className="sub-includes-label">Всё из бесплатного, плюс:</p>
          <ul className="sub-feature-list">
            <li><CheckIcon /><span>Кабинет врача под вашу специальность</span></li>
            <li><CheckIcon /><span>База препаратов — 823 МНН с дозировками</span></li>
            <li><CheckIcon /><span>Взаимодействия лекарств — 912 пар</span></li>
            <li><CheckIcon /><span>Все клинические калькуляторы</span></li>
            <li><CheckIcon /><span>Избранное — сохраняйте нужное</span></li>
          </ul>
        </div>

        <button className="sub-cta-btn" disabled>
          Оплата появится совсем скоро
        </button>
        <p className="sub-note">
          Сейчас приложение работает в режиме открытого тестирования — все функции доступны бесплатно
        </p>
      </div>
    </div>
  )
}
