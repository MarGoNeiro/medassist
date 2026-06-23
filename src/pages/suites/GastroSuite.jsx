import { useState } from 'react'
import './suites.css'

const CP_FIELDS = [
  {
    id: 'ascites',      label: 'Асцит',
    opts: [{ v:1,l:'Нет [1]' }, { v:2,l:'Умеренный [2]' }, { v:3,l:'Напряжённый [3]' }]
  },
  {
    id: 'bili',         label: 'Билирубин',
    opts: [{ v:1,l:'< 34 мкмоль/л [1]' }, { v:2,l:'34–51 мкмоль/л [2]' }, { v:3,l:'> 51 мкмоль/л [3]' }]
  },
  {
    id: 'albumin',      label: 'Альбумин',
    opts: [{ v:1,l:'> 35 г/л [1]' }, { v:2,l:'28–35 г/л [2]' }, { v:3,l:'< 28 г/л [3]' }]
  },
  {
    id: 'pt',           label: 'Увеличение ПВ / МНО',
    opts: [{ v:1,l:'< 4 с / < 1.7 [1]' }, { v:2,l:'4–6 с / 1.7–2.3 [2]' }, { v:3,l:'> 6 с / > 2.3 [3]' }]
  },
  {
    id: 'encephalo',    label: 'Энцефалопатия',
    opts: [{ v:1,l:'Нет [1]' }, { v:2,l:'I–II степень [2]' }, { v:3,l:'III–IV степень [3]' }]
  },
]

function cpResult(score) {
  if (score <= 6)  return { cls: 'A', label: 'Child-Pugh A — компенсирован', badge: 'badge-green',  advice: '1-летняя выживаемость ≈ 100%. Плановые вмешательства возможны.' }
  if (score <= 9)  return { cls: 'B', label: 'Child-Pugh B — субкомпенсирован', badge: 'badge-yellow', advice: '1-летняя выживаемость ≈ 80%. Оценка на трансплантацию.' }
  return                 { cls: 'C', label: 'Child-Pugh C — декомпенсирован', badge: 'badge-red',    advice: '1-летняя выживаемость ≈ 45%. Приоритет для трансплантации. MELD.' }
}

const BLATCHFORD_HIGHRISK = [
  'Гемоглобин < 120 г/л (ж) / < 130 г/л (м)',
  'Мочевина > 6.5 ммоль/л',
  'ЧСС ≥ 100 уд/мин',
  'АД сист. < 90 мм рт.ст.',
  'Меленa',
  'Синкоп',
  'Заболевание печени в анамнезе',
  'ХСН в анамнезе',
]

const ROME_IV = [
  { dx: 'СРК', criteria: 'Боль в животе ≥ 1 р/нед × 3 мес. + ≥ 2: связь со стулом, изм. частоты или формы стула' },
  { dx: 'ГЭРБ',    criteria: 'Изжога / регургитация ≥ 2 р/нед. ± эзофагит при ЭГДС. Отвечает на ИПП' },
  { dx: 'Функц. запор', criteria: 'Натуживание / ком / твёрдый стул / неполное опорожнение / < 3 стулов в нед. ≥ 25% дефекаций' },
  { dx: 'Функц. диспепсия', criteria: 'Постпрандиальная тяжесть, раннее насыщение, эпигастр. боль / жжение. ЭГДС: норма' },
]

export default function GastroSuite() {
  const [cp, setCp] = useState({ ascites:1, bili:1, albumin:1, pt:1, encephalo:1 })

  const cpScore = Object.values(cp).reduce((a,b)=>a+b,0)
  const cpRes   = cpResult(cpScore)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FFF7ED' }}>🫄</div>
        <div>
          <h2>Рабочий кабинет гастроэнтеролога</h2>
          <p>Child-Pugh (цирроз), Blatchford (ЖКК), Рим IV (ФРЖ)</p>
        </div>
      </div>

      {/* Child-Pugh */}
      <div className="suite-card">
        <div className="suite-card-title">🫁 Child-Pugh — тяжесть цирроза печени</div>
        {CP_FIELDS.map(f => (
          <div key={f.id} className="suite-field" style={{ marginBottom: 10 }}>
            <label>{f.label}</label>
            <select className="suite-select" value={cp[f.id]}
              onChange={e => setCp(prev => ({ ...prev, [f.id]: parseInt(e.target.value) }))}>
              {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
        ))}
        <div className="suite-result-banner">
          <div>
            <div className="suite-score-label">Класс / Сумма</div>
            <div className="suite-score-big" style={{ color: '#FB923C' }}>{cpRes.cls} · {cpScore}</div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <span className={`suite-risk-badge ${cpRes.badge}`}>{cpRes.label.split(' — ')[1]}</span>
            <div className="suite-advice">{cpRes.advice}</div>
          </div>
        </div>
      </div>

      {/* Blatchford */}
      <div className="suite-card">
        <div className="suite-card-title">🩸 Критерии высокого риска ЖКК (Blatchford)</div>
        <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
          Любой из перечисленных признаков требует экстренной ЭГДС и госпитализации:
        </p>
        {BLATCHFORD_HIGHRISK.map((item, i) => (
          <div key={i} className="suite-screening-item">
            <div className="suite-screening-dot" style={{ background: '#F87171' }} />
            <div className="suite-screening-desc" style={{ fontSize: 12, color: 'var(--color-text)' }}>{item}</div>
          </div>
        ))}
      </div>

      {/* Rome IV quick reference */}
      <div className="suite-card">
        <div className="suite-card-title">📋 Рим IV — диагностические критерии (кратко)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ROME_IV.map((r, i) => (
            <div key={i} style={{ paddingBottom: 10, borderBottom: i < ROME_IV.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 3 }}>{r.dx}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>{r.criteria}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
