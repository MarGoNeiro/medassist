import { useState, Fragment } from 'react'
import './suites.css'

function calcEGFR(creatinine, age, isFemale) {
  if (!creatinine || creatinine <= 0 || !age || age <= 0) return null
  const k     = isFemale ? 0.7 : 0.9
  const alpha = isFemale ? -0.241 : -0.302
  const sc    = creatinine / k
  const base  = sc <= 1 ? Math.pow(sc, alpha) : Math.pow(sc, -1.200)
  let gfr     = 142 * base * Math.pow(0.9938, age)
  if (isFemale) gfr *= 1.012
  return Math.round(gfr)
}

function ckdStage(gfr) {
  if (gfr === null) return null
  if (gfr >= 90)   return { g: 'G1',  label: 'Норма/высокая',            badge: 'badge-green',  note: 'Только при наличии маркёров ХБП' }
  if (gfr >= 60)   return { g: 'G2',  label: 'Незначительно снижена',    badge: 'badge-green',  note: 'Только при наличии маркёров ХБП' }
  if (gfr >= 45)   return { g: 'G3a', label: 'Умеренно снижена',         badge: 'badge-yellow', note: 'Нефропротекция; отменить нефротоксичные' }
  if (gfr >= 30)   return { g: 'G3b', label: 'Значительно снижена',      badge: 'badge-yellow', note: 'Коррекция доз; кардиориск' }
  if (gfr >= 15)   return { g: 'G4',  label: 'Тяжёлое снижение',         badge: 'badge-red',    note: 'Подготовка к ЗПТ' }
  return                  { g: 'G5',  label: 'Почечная недостаточность',  badge: 'badge-red',    note: 'Диализ / трансплантация' }
}

const ALBUMINURIA = [
  { a: 'A1', label: '< 30 мг/г',    note: 'Норма или незначительная', color: '#34D399' },
  { a: 'A2', label: '30–300 мг/г',  note: 'Умеренная',                color: '#FBBF24' },
  { a: 'A3', label: '> 300 мг/г',   note: 'Высокая/очень высокая',    color: '#F87171' },
]

// KDIGO 2012 risk grid: 1=низкий 2=умеренный 3=высокий 4=очень высокий
const KDIGO_RISK = {
  G1:  [1, 2, 3],
  G2:  [1, 2, 3],
  G3a: [2, 3, 4],
  G3b: [3, 4, 4],
  G4:  [4, 4, 4],
  G5:  [4, 4, 4],
}
const KDIGO_G_ROWS = [
  { g: 'G1',  gfr: '≥90' },
  { g: 'G2',  gfr: '60–89' },
  { g: 'G3a', gfr: '45–59' },
  { g: 'G3b', gfr: '30–44' },
  { g: 'G4',  gfr: '15–29' },
  { g: 'G5',  gfr: '<15' },
]
const RISK_STYLE = [
  null,
  { bg: '#DCFCE7', color: '#166534', label: 'Низкий' },
  { bg: '#FEF9C3', color: '#854D0E', label: 'Умеренный' },
  { bg: '#FFEDD5', color: '#9A3412', label: 'Высокий' },
  { bg: '#FEE2E2', color: '#991B1B', label: 'Очень выс.' },
]

const DOSE_ADJUST = [
  { drug: 'Метформин',         g45: '½ дозы или отмена',        g30: 'Отменить' },
  { drug: 'ИАПФ / БРА',        g45: 'Продолжить, контроль K⁺',  g30: 'С осторожностью' },
  { drug: 'Дигоксин',          g45: 'Снизить дозу',              g30: 'Избегать' },
  { drug: 'НПВС',              g45: 'Избегать',                   g30: 'Противопоказаны' },
  { drug: 'Спиронолактон',     g45: 'С осторожностью',           g30: 'Противопоказан' },
  { drug: 'Фуросемид',         g45: 'Стандарт (↑ дозу)',         g30: '↑ дозу, петлевые' },
  { drug: 'Амоксициллин',      g45: 'Стандарт',                  g30: 'Снизить на 50%' },
  { drug: 'Ципрофлоксацин',    g45: 'Стандарт',                  g30: '250–500 мг × 1/сут' },
  { drug: 'Азитромицин',       g45: 'Стандарт',                  g30: 'С осторожностью' },
  { drug: 'Кларитромицин',     g45: 'Стандарт',                  g30: 'Снизить на 50%' },
  { drug: 'Гентамицин',        g45: 'ТДМ обязателен',            g30: 'Противопоказан' },
  { drug: 'Алопуринол',        g45: 'Снизить дозу',              g30: 'Макс 50–100 мг/сут' },
  { drug: 'Варфарин',          g45: 'МНО-контроль чаще',         g30: 'МНО-контроль, осторожно' },
  { drug: 'НМГ (Эноксапарин)', g45: 'Анти-Xa мониторинг',        g30: 'НФГ предпочтительнее' },
  { drug: 'Трамадол',          g45: 'Снизить дозу',              g30: 'Избегать' },
  { drug: 'Габапентин',        g45: 'Снизить дозу',              g30: 'Макс 300 мг/сут' },
  { drug: 'Аторвастатин',      g45: 'Стандарт',                  g30: 'Стандарт (умеренно)' },
  { drug: 'Клопидогрел',       g45: 'Стандарт',                  g30: 'Стандарт' },
]

const MBD_TARGETS = [
  { stage: 'G3a–G3b', ca: '2.1–2.5', p: '0.87–1.45', pth: '35–70' },
  { stage: 'G4',      ca: '2.1–2.5', p: '0.87–1.49', pth: '70–110' },
  { stage: 'G5 / Д',  ca: '2.1–2.37', p: '1.13–1.78', pth: '150–300' },
]

const HK_LEVELS = [
  { range: '< 5.5',   label: 'Норма',     badge: 'badge-green',  action: 'Наблюдение. При риске — ограничение К⁺ в диете.' },
  { range: '5.5–6.0', label: 'Лёгкая',   badge: 'badge-yellow', action: 'Пересмотреть ИАПФ/БРА/MКА. Диета. Тиазиды или петлевые диуретики.' },
  { range: '6.0–7.0', label: 'Умеренная',badge: 'badge-yellow', action: 'ЭКГ. Патиромер или SZC (натрий циркониум цикросиликат). При G5 — рассмотреть диализ.' },
  { range: '> 7.0',   label: 'Тяжёлая',  badge: 'badge-red',    action: 'ЭКГ-мониторинг. Кальция глюконат 10% в/в. ГИК-смесь (10 ед инсулина + 40 г глюкозы). Срочный диализ.' },
]

const NS_CRITERIA = [
  { label: 'Протеинурия',      val: '> 3.5 г/сут (или ≥ 3500 мг/г по ПКС)' },
  { label: 'Гипоальбуминемия', val: 'Альбумин < 30 г/л (сыворотка)' },
  { label: 'Отёки',            val: 'Периферические; при тяжёлом — анасарка' },
  { label: 'Гиперлипидемия',   val: 'ХС > 5.2 ммоль/л, ↑ ЛПНП, ↑ ТГ' },
]

export default function NephrologySuite() {
  const [creat,    setCreat]  = useState(100)
  const [age,      setAge]    = useState(55)
  const [isFemale, setFemale] = useState(false)

  const gfrMdl = calcEGFR(creat / 88.4, age, isFemale)
  const stage  = ckdStage(gfrMdl)

  return (
    <div className="suite">

      {/* Альбуминурия */}
      <div className="suite-card">
        <div className="suite-card-title">🔬 Категории альбуминурии</div>
        {ALBUMINURIA.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < ALBUMINURIA.length - 1 ? '1px solid var(--color-border)' : 'none', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: a.color, fontSize: 13, minWidth: 28 }}>{a.a}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', minWidth: 80 }}>{a.label}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{a.note}</span>
          </div>
        ))}
      </div>

      {/* KDIGO матрица + CKD-EPI бок о бок */}
      <div className="nephr-two-col">
        <div className="suite-card">
          <div className="suite-card-title">📊 KDIGO — риск прогрессии ХБП</div>
          <div className="nephr-kdigo-grid">
            <div className="nephr-kdigo-corner" />
            {['A1', 'A2', 'A3'].map(a => (
              <div key={a} className="nephr-kdigo-head">{a}</div>
            ))}
            {KDIGO_G_ROWS.map(({ g, gfr }) => (
              <Fragment key={g}>
                <div className="nephr-kdigo-row-label">
                  <span className="nephr-kdigo-g">{g}</span>
                  <span className="nephr-kdigo-gfr">{gfr}</span>
                </div>
                {KDIGO_RISK[g].map((risk, ci) => {
                  const s = RISK_STYLE[risk]
                  return (
                    <div key={ci} className="nephr-kdigo-cell"
                      style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>

        <div className="suite-card">
          <div className="suite-card-title">🧪 СКФ по CKD-EPI 2021 (без расовой поправки)</div>
          <div className="suite-grid">
            <div className="suite-field">
              <label>Креатинин (мкмоль/л)</label>
              <input className="suite-input" type="number" value={creat}
                onChange={e => setCreat(Math.max(1, parseInt(e.target.value) || 0))} />
            </div>
            <div className="suite-field">
              <label>Возраст (лет)</label>
              <input className="suite-input" type="number" value={age}
                onChange={e => setAge(Math.max(1, parseInt(e.target.value) || 0))} />
            </div>
          </div>
          <div className="suite-gender-row" style={{ marginTop: 10 }}>
            <button className={`suite-gender-btn ${!isFemale ? 'active' : ''}`} onClick={() => setFemale(false)}>Мужской</button>
            <button className={`suite-gender-btn ${isFemale ? 'active' : ''}`}  onClick={() => setFemale(true)}>Женский</button>
          </div>
          {stage && (
            <div className="suite-dark-box" style={{ marginTop: 14 }}>
              <div className="suite-dark-row">
                <span className="suite-dark-label">рСКФ (CKD-EPI)</span>
                <span className="suite-dark-value accent-green">{gfrMdl} мл/мин/1.73 м²</span>
              </div>
              <div className="suite-dark-row">
                <span className="suite-dark-label">Стадия ХБП</span>
                <span className="suite-dark-value">{stage.g}</span>
              </div>
              <div className="suite-dark-row">
                <span className="suite-dark-label">{stage.label}</span>
                <span className={`suite-risk-badge ${stage.badge}`} style={{ fontSize: 10 }}>
                  {stage.badge === 'badge-green' ? 'Низкий' : stage.badge === 'badge-yellow' ? 'Умеренный' : 'Высокий'}
                </span>
              </div>
              <div className="suite-dark-row">
                <span className="suite-dark-label">Тактика</span>
                <span className="suite-dark-label" style={{ textAlign: 'right', maxWidth: 180 }}>{stage.note}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Коррекция доз — расширенная */}
      <div className="suite-card">
        <div className="suite-card-title">💊 Коррекция доз при ХБП (шпаргалка)</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="suite-table">
            <thead>
              <tr><th>Препарат</th><th>G3a–G3b (рСКФ 30–60)</th><th>G4–G5 (рСКФ {'<'}30)</th></tr>
            </thead>
            <tbody>
              {DOSE_ADJUST.map((r, i) => (
                <tr key={i}>
                  <td className="col-time">{r.drug}</td>
                  <td className="col-drug">{r.g45}</td>
                  <td className="col-note">{r.g30}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Нефротический синдром + Гиперкалиемия */}
      <div className="nephr-two-col">
        <div className="suite-card">
          <div className="suite-card-title">🫧 Нефротический синдром</div>
          {NS_CRITERIA.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '7px 0', borderBottom: i < NS_CRITERIA.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 600 }}>{c.label}</span>
              <span style={{ fontSize: 13, color: 'var(--color-text)', fontWeight: 600 }}>{c.val}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            <strong>Первичные:</strong> ФСГС, нефропатия минимальных изменений, мембранозная.<br />
            <strong>Вторичные:</strong> СД, амилоидоз (АА/AL), СКВ, паранеопластический.
          </div>
        </div>

        <div className="suite-card">
          <div className="suite-card-title">⚠️ Гиперкалиемия (K⁺, ммоль/л)</div>
          {HK_LEVELS.map((h, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: i < HK_LEVELS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-text)', minWidth: 58 }}>{h.range}</span>
                <span className={`suite-risk-badge ${h.badge}`}>{h.label}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{h.action}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ХБП-МКН + Целевое АД */}
      <div className="nephr-two-col">
        <div className="suite-card">
          <div className="suite-card-title">🦴 ХБП-МКН — целевые показатели</div>
          <table className="suite-table">
            <thead>
              <tr><th>Стадия</th><th>Ca (ммоль/л)</th><th>P (ммоль/л)</th><th>ПТГ (пг/мл)</th></tr>
            </thead>
            <tbody>
              {MBD_TARGETS.map((r, i) => (
                <tr key={i}>
                  <td className="col-time">{r.stage}</td>
                  <td>{r.ca}</td>
                  <td>{r.p}</td>
                  <td>{r.pth}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Коррекция: витамин D (кальцитриол/парикальцитол), фосфат-биндеры, цинакалцет (при G5Д).
          </div>
        </div>

        <div className="suite-card">
          <div className="suite-card-title">💉 Целевое АД при ХБП (KDIGO 2024)</div>
          <div className="nephr-bp-card">
            <div className="nephr-bp-target">
              {'<'} 120 <span className="nephr-bp-unit">мм рт.ст. сист.</span>
            </div>
            <div className="nephr-bp-list">
              <div className="nephr-bp-row"><strong>С протеинурией:</strong> {'<'} 120/80</div>
              <div className="nephr-bp-row"><strong>Без протеинурии:</strong> {'<'} 130/80</div>
              <div className="nephr-bp-row"><strong>СД-нефропатия:</strong> {'<'} 130/80</div>
              <div className="nephr-bp-row"><strong>Пожилые ({'>'} 75 л):</strong> индивидуально, ≥ 110 сист.</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              <strong>Препараты выбора:</strong> ИАПФ или БРА — нефропротекция + снижение протеинурии. Не комбинировать.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
