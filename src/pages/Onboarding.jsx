import { useState } from 'react'
import './Onboarding.css'

const SPECIALTIES = [
  'Акушер',
  'Аллерголог-иммунолог',
  'Анестезиолог-реаниматолог',
  'Врач скорой помощи',
  'Гастроэнтеролог',
  'Гематолог',
  'Гинеколог',
  'Дерматолог',
  'Диетолог / Нутрициолог',
  'Инфекционист',
  'Кардиолог',
  'Нарколог',
  'Нефролог',
  'Невролог',
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
  'Хирург (сосудистый)',
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
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h1 className="onboarding-title">MedAssist</h1>
        <p className="onboarding-subtitle">Справочник врача в кармане</p>
      </div>

      <div className="onboarding-bottom">
        <p className="onboarding-question">Ваша специальность</p>
        <p className="onboarding-hint">Калькуляторы и материалы будут подобраны под вашу специализацию</p>

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
