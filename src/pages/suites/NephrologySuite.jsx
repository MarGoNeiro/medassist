import { useState } from 'react'
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
  if (gfr >= 90)   return { g: 'G1',  label: 'Норма/высокая',         badge: 'badge-green',  note: 'Только при наличии маркёров ХБП' }
  if (gfr >= 60)   return { g: 'G2',  label: 'Незначительно снижена', badge: 'badge-green',  note: 'Только при наличии маркёров ХБП' }
  if (gfr >= 45)   return { g: 'G3a', label: 'Умеренно снижена',      badge: 'badge-yellow', note: 'Нефропротекция; отменить нефротоксичные' }
  if (gfr >= 30)   return { g: 'G3b', label: 'Значительно снижена',   badge: 'badge-yellow', note: 'Коррекция доз; кардиориск' }
  if (gfr >= 15)   return { g: 'G4',  label: 'Тяжёлое снижение',      badge: 'badge-red',    note: 'Подготовка к ЗПТ' }
  return                  { g: 'G5',  label: 'Почечная недостаточность', badge: 'badge-red',  note: 'Диализ / трансплантация' }
}

const ALBUMINURIA = [
  { a: 'A1', label: '< 30 мг/г',    note: 'Норма или незначительная', color: '#34D399' },
  { a: 'A2', label: '30–300 мг/г',  note: 'Умеренная',                color: '#FBBF24' },
  { a: 'A3', label: '> 300 мг/г',   note: 'Высокая/очень высокая',    color: '#F87171' },
]

const DOSE_ADJUST = [
  { drug: 'Метформин',   g45: '½ дозы или отмена', g30: 'Отменить' },
  { drug: 'ИАПФ / БРА',  g45: 'Продолжить, ↑ K⁺', g30: 'С осторожностью' },
  { drug: 'Дигоксин',    g45: 'Снизить дозу',      g30: 'Избегать' },
  { drug: 'НПВС',        g45: 'Избегать',           g30: 'Противопоказаны' },
  { drug: 'Амоксициллин', g45: 'Стандарт',          g30: 'Снизить на 50%' },
  { drug: 'Гентамицин',  g45: 'ТДМ',               g30: 'Противопоказан' },
]

export default function NephrologySuite() {
  const [creat,    setCreat]    = useState(100)
  const [age,      setAge]      = useState(55)
  const [isFemale, setFemale]   = useState(false)

  const gfr   = calcEGFR(creat / 1000, age, isFemale) // мкмоль/л → мг/дл: creat/88.4
  const gfrMdl = calcEGFR(creat / 88.4, age, isFemale)
  const stage  = ckdStage(gfrMdl)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#EFF6FF' }}>🫘</div>
        <div>
          <h2>Рабочий кабинет нефролога</h2>
          <p>СКФ по CKD-EPI 2021, стадии ХБП, коррекция доз при ХБП</p>
        </div>
      </div>

      {/* CKD-EPI */}
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
              <span className={`suite-risk-badge ${stage.badge}`} style={{ fontSize: 10 }}>{stage.badge === 'badge-green' ? 'Низкий' : stage.badge === 'badge-yellow' ? 'Умеренный' : 'Высокий'}</span>
            </div>
            <div className="suite-dark-row">
              <span className="suite-dark-label">Тактика</span>
              <span className="suite-dark-label" style={{ textAlign: 'right', maxWidth: 180 }}>{stage.note}</span>
            </div>
          </div>
        )}
      </div>

      {/* Albuminuria */}
      <div className="suite-card">
        <div className="suite-card-title">🔬 Категории альбуминурии (мочи)</div>
        {ALBUMINURIA.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < ALBUMINURIA.length - 1 ? '1px solid var(--color-border)' : 'none', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: a.color, fontSize: 13, minWidth: 28 }}>{a.a}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', minWidth: 80 }}>{a.label}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{a.note}</span>
          </div>
        ))}
      </div>

      {/* Dose adjustment */}
      <div className="suite-card">
        <div className="suite-card-title">💊 Коррекция доз при ХБП (шпаргалка)</div>
        <table className="suite-table">
          <thead>
            <tr><th>Препарат</th><th>G3a–G3b (30–60)</th><th>G4–G5 ({'<'}30)</th></tr>
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
  )
}
