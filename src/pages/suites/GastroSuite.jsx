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

function LiverIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M23.2157 10.0607C22.5621 11.0012 22.112 11.962 21.8034 12.8418C21.446 13.8608 21.2754 14.777 21.1939 15.4417C21.153 15.7748 21.1342 16.047 21.1257 16.2402C21.1214 16.3368 21.1197 16.4139 21.1192 16.4692C21.1189 16.4969 21.1189 16.5191 21.1189 16.5356L21.1191 16.556L21.1192 16.563L21.1193 16.5656L21.1193 16.5667C21.1193 16.5667 21.1193 16.5677 22.1191 16.5479C23.1189 16.528 23.1189 16.5288 23.1189 16.5288L23.1189 16.5255L23.1189 16.5227L23.1191 16.4903C23.1194 16.4562 23.1205 16.4015 23.1238 16.3282C23.1302 16.1815 23.1451 15.9615 23.179 15.6853C23.247 15.1312 23.3904 14.3599 23.6907 13.5039C24.0603 12.4502 24.6632 11.2773 25.6539 10.2157C27.9787 10.4791 28.8525 11.0046 29.5758 11.4395C30.2149 11.8238 30.7364 12.1374 32.0374 12.1374C33.3805 12.1374 35.2609 11.7362 37.1413 11.335C39.9619 10.7332 42.7825 10.1315 43.7898 10.8837C45.4687 12.1374 40.432 21.3314 35.3952 21.3314C32.8027 21.3314 31.2481 23.1899 29.7392 24.9937C28.3166 26.6944 26.9347 28.3464 24.762 28.3464C22.6699 28.3464 21.311 29.0047 20 29.7061V23.0479C20 22.6526 20.195 22.2841 20.5335 21.9879C20.8909 21.6752 21.2902 21.5479 21.5 21.5479V19.5479C20.7098 19.5479 19.8591 19.9205 19.2165 20.4828C18.5727 21.0461 18.0298 21.8962 18.0012 22.9597H12.9072C10.5179 22.9597 7.65082 24.0112 10.5179 26.1135C12.5977 27.6385 16.186 26.4249 18 25.6433V30.707C17.0781 31.0885 16.0352 31.3613 14.6885 31.3613C12.8526 31.3613 12.2458 32.8297 11.6009 34.3903C10.8697 36.1599 10.0895 38.0479 7.41312 38.0479C2.37634 38.0479 3.61914 22.5479 6.61916 16.5479C9.61919 10.5479 13.7245 10.0479 22.1192 10.0479C22.5059 10.0479 22.8709 10.0523 23.2157 10.0607Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M18 40.0479V30.707L20 29.7061V40.0479H18Z" fill="currentColor"/>
    </svg>
  )
}

export default function GastroSuite() {
  const [cp, setCp] = useState({ ascites:1, bili:1, albumin:1, pt:1, encephalo:1 })

  const cpScore = Object.values(cp).reduce((a,b)=>a+b,0)
  const cpRes   = cpResult(cpScore)

  return (
    <div className="suite">
      <div className="suite-banner">
        <div className="suite-banner-emoji" style={{ background: '#FFF7ED', color: '#EA580C' }}><LiverIcon /></div>
        <div>
          <h2>Рабочий кабинет гастроэнтеролога</h2>
          <p>Child-Pugh (цирроз), Blatchford (ЖКК), Рим IV (ФРЖ)</p>
        </div>
      </div>

      {/* Child-Pugh */}
      <div className="suite-card">
        <div className="suite-card-title">🔬 Child-Pugh — тяжесть цирроза печени</div>
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
        <div className="suite-criteria-2col">
          {BLATCHFORD_HIGHRISK.map((item, i) => (
            <div key={i} className="suite-screening-item">
              <div className="suite-screening-dot" style={{ background: '#F87171' }} />
              <div className="suite-screening-desc" style={{ fontSize: 12, color: 'var(--color-text)' }}>{item}</div>
            </div>
          ))}
        </div>
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
