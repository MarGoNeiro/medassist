import './suites.css'

const GLAUCOMA_STAGES = [
  {
    stage: 'I — Начальная',
    badge: 'badge-green',
    field: 'Сужение поля зрения не более 10° от центра (в носовой половине)',
    iop: '≤ 21 мм рт.ст.',
    tactics: 'Местные гипотензивные (простагландины / β-блокаторы). Наблюдение каждые 3–6 мес.',
  },
  {
    stage: 'II — Развитая',
    badge: 'badge-yellow',
    field: 'Сужение поля зрения от 10° до 15° от центра хотя бы в одном меридиане',
    iop: '≤ 18 мм рт.ст.',
    tactics: 'Комбинация капель. Рассмотреть лазерную трабекулопластику (SLT).',
  },
  {
    stage: 'III — Далеко зашедшая',
    badge: 'badge-yellow',
    field: 'Поле зрения сужено до 15° и менее от центра; сохранён центральный участок',
    iop: '≤ 15 мм рт.ст.',
    tactics: 'Максимальная местная терапия или хирургия (трабекулэктомия).',
  },
  {
    stage: 'IV — Терминальная',
    badge: 'badge-red',
    field: 'Поле зрения отсутствует или сохранён «трубчатый» остаток; острота ≤ 0.02',
    iop: '≤ 12 мм рт.ст.',
    tactics: 'Хирургическое лечение. Обезболивание при болевом синдроме. Паллиатив.',
  },
]

const DR_STAGES = [
  {
    stage: 'НДР',
    full: 'Нет диабетической ретинопатии',
    badge: 'badge-green',
    signs: 'Изменений глазного дна нет',
    tactics: 'Офтальмоскопия 1 р/год. Контроль гликемии и АД.',
  },
  {
    stage: 'НПДР лёгкая',
    full: 'Непролиферативная — лёгкая',
    badge: 'badge-green',
    signs: 'Единичные микроаневризмы',
    tactics: 'Офтальмоскопия каждые 9–12 мес. Компенсация СД.',
  },
  {
    stage: 'НПДР умеренная',
    full: 'Непролиферативная — умеренная',
    badge: 'badge-yellow',
    signs: 'Геморрагии, твёрдые экссудаты, ватообразные очаги',
    tactics: 'Офтальмоскопия каждые 6 мес. При ДМО — анти-VEGF или лазер.',
  },
  {
    stage: 'НПДР тяжёлая',
    full: 'Непролиферативная — тяжёлая',
    badge: 'badge-yellow',
    signs: 'Правило «4-2-1»: геморрагии во всех 4 квадрантах / венозные чётки в 2 / ИРМА в 1',
    tactics: 'Офтальмоскопия каждые 3–4 мес. Рассмотреть превентивную панретинальную лазеркоагуляцию.',
  },
  {
    stage: 'ПДР',
    full: 'Пролиферативная',
    badge: 'badge-red',
    signs: 'Неоваскуляризация диска / сетчатки, преретинальные кровоизлияния, тракционная отслойка',
    tactics: 'Панретинальная лазеркоагуляция + анти-VEGF. При гемофтальме / отслойке — витрэктомия.',
  },
]

export default function OphthalmologySuite() {
  return (
    <div className="suite">
      <div className="nephr-two-col">

        {/* Глаукома */}
        <div className="suite-card">
          <div className="suite-card-title">👁 Стадии глаукомы (КР МЗ РФ) — норма ВГД: 10–21 мм рт.ст.</div>
          {GLAUCOMA_STAGES.map((g, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < GLAUCOMA_STAGES.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{g.stage}</span>
                <span className={`suite-risk-badge ${g.badge}`} style={{ fontSize: 10, padding: '2px 8px' }}>ВГД {g.iop}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 3, lineHeight: 1.4 }}>{g.field}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}><strong>Тактика:</strong> {g.tactics}</div>
            </div>
          ))}
        </div>

        {/* Диабетическая ретинопатия */}
        <div className="suite-card">
          <div className="suite-card-title">🩸 Диабетическая ретинопатия — классификация и тактика</div>
          {DR_STAGES.map((d, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < DR_STAGES.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{d.stage}</span>
                <span className={`suite-risk-badge ${d.badge}`} style={{ fontSize: 10, padding: '2px 8px' }}>{d.full}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 3, lineHeight: 1.4 }}>{d.signs}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}><strong>Тактика:</strong> {d.tactics}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
