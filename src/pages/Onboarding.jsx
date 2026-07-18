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

        <svg className="ob-ecg" viewBox="0 0 375 48" preserveAspectRatio="none" fill="none" aria-hidden="true">
          {/* 3 настоящих PQRST-комплекса */}
          <path d="
            M0,24 L15,24
            C20,24 24,18 27,18 C30,18 34,24 38,24
            L43,24 L45,27 L48,4 L51,34 L56,24 L66,24
            C71,24 75,15 80,15 C85,15 88,24 92,24
            L128,24
            C133,24 137,18 140,18 C143,18 147,24 151,24
            L156,24 L158,27 L161,4 L164,34 L169,24 L179,24
            C184,24 188,15 193,15 C198,15 201,24 205,24
            L241,24
            C246,24 250,18 253,18 C256,18 260,24 264,24
            L269,24 L271,27 L274,4 L277,34 L282,24 L292,24
            C297,24 301,15 306,15 C311,15 314,24 318,24
            L375,24
          " stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
