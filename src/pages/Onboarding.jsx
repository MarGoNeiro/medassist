import { useState } from 'react'
import './Onboarding.css'

const SPECIALTIES = [
  'Акушер-гинеколог',
  'Аллерголог-иммунолог',
  'Анестезиолог-реаниматолог',
  'Врач скорой помощи',
  'Гастроэнтеролог',
  'Гематолог',
  'Дерматолог',
  'Диетолог / Нутрициолог',
  'Инфекционист',
  'Кардиолог',
  'Нарколог',
  'Невролог',
  'Нефролог',
  'Онколог',
  'Оториноларинголог (ЛОР)',
  'Офтальмолог',
  'Педиатр',
  'Пульмонолог',
  'Психиатр',
  'Психотерапевт',
  'Ревматолог',
  'Семейный врач',
  'Стоматолог',
  'Терапевт / ВОП',
  'Травматолог-ортопед',
  'Уролог',
  'Физиотерапевт',
  'Фтизиатр',
  'Хирург',
  'Эндокринолог',
]

function PillIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
      <path d="m8.5 8.5 7 7"/>
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/>
      <line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/>
      <line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>
    </svg>
  )
}

function CalcIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2"/>
      <line x1="8" x2="16" y1="6" y2="6"/>
      <line x1="16" x2="16" y1="14" y2="18"/>
      <path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/>
      <path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
    </svg>
  )
}

function CRIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}

const FEATURES = [
  { icon: PillIcon, color: 'indigo', title: '823 МНН', desc: 'Дозировки, взаимодействия, альтернативы' },
  { icon: ListIcon, color: 'violet', title: 'МКБ-10', desc: 'Классификатор болезней по кодам' },
  { icon: CalcIcon, color: 'blue', title: 'Калькуляторы', desc: '8 клинических шкал риска' },
  { icon: CRIcon,   color: 'purple', title: 'КР', desc: 'Клинические рекомендации' },
]

export default function Onboarding({ onDone, canBack, onBack }) {
  const [selected, setSelected] = useState('')

  return (
    <div className="onboarding">
      <div className="onboarding-top">
        {/* фото врачей — добавь файл public/doctor-bg.jpg чтобы оно появилось */}
        <div className="ob-photo-overlay" />

        {canBack && (
          <button className="ob-back" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        )}

        <div className="onboarding-logo">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>

        <h1 className="onboarding-title">MedAssist</h1>
        <p className="onboarding-subtitle">Справочник врача в кармане</p>

        <div className="ob-features">
          <span className="ob-feature-chip">823 МНН</span>
          <span className="ob-feature-chip">МКБ-10</span>
          <span className="ob-feature-chip">Калькуляторы</span>
          <span className="ob-feature-chip">КР</span>
        </div>

        <svg className="ob-ecg" viewBox="0 0 375 48" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M0,24 L35,24 L48,8 L61,40 L74,2 L87,24 L140,24 L153,8 L166,40 L179,2 L192,24 L245,24 L258,8 L271,40 L284,2 L297,24 L375,24"
            stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <svg className="ob-wave" viewBox="0 0 390 48" preserveAspectRatio="none" aria-hidden="true">
          <path className="ob-wave-fill" d="M0,4 C80,48 220,0 390,32 L390,48 L0,48 Z"/>
        </svg>
      </div>

      <div className="onboarding-bottom">
        <p className="ob-inside-label">Что внутри</p>
        <div className="ob-feature-grid">
          {FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className={`ob-feature-card ob-feature-card--${color}`}>
              <div className="ob-fc-icon"><Icon /></div>
              <span className="ob-fc-title">{title}</span>
              <span className="ob-fc-desc">{desc}</span>
            </div>
          ))}
        </div>

        <div className="ob-divider" />

        <p className="onboarding-step-label">Шаг 1 — персонализация</p>
        <p className="onboarding-question">Ваша специальность</p>
        <p className="onboarding-hint">Подберём калькуляторы и материалы под вашу специализацию</p>

        <div className="select-wrapper">
          <select
            className="specialty-select"
            value={selected}
            onChange={e => setSelected(e.target.value)}
          >
            <option value="" disabled>Выберите специальность...</option>
            {SPECIALTIES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <svg className="select-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>

        <button
          className="ob-start-btn"
          disabled={!selected}
          onClick={() => onDone(selected)}
        >
          Начать работу
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>

        <p className="onboarding-note">Можно изменить позже через настройки</p>
      </div>
    </div>
  )
}
