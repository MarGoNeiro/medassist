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

        <h1 className="onboarding-title">Медицинский ассистент</h1>
        <p className="onboarding-subtitle">Справочник врача в кармане</p>

        <svg className="ob-ecg" viewBox="0 0 600 80" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M0,48 L18,48 C24,48 28,36 33,36 C38,36 42,48 50,48 L58,48 L61,54 L65,5 L69,60 L74,48 L88,48 C94,48 102,28 113,28 C124,28 131,48 140,48 L190,48 C196,48 200,36 205,36 C210,36 214,48 222,48 L230,48 L233,54 L237,5 L241,60 L246,48 L260,48 C266,48 274,28 285,28 C296,28 303,48 312,48 L362,48 C368,48 372,36 377,36 C382,36 386,48 394,48 L402,48 L405,54 L409,5 L413,60 L418,48 L432,48 C438,48 446,28 457,28 C468,28 475,48 484,48 L600,48"
            stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <svg className="ob-wave" viewBox="0 0 390 48" preserveAspectRatio="none" aria-hidden="true">
          <path className="ob-wave-fill" d="M0,4 C80,48 220,0 390,32 L390,48 L0,48 Z"/>
        </svg>
      </div>

      <div className="onboarding-bottom">
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
