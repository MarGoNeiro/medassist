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

export default function Onboarding({ onDone, canBack, onBack }) {
  const [selected, setSelected] = useState('')

  return (
    <div className="onboarding">
      <div className="onboarding-top">
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
