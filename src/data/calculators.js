export const calculators = [
  {
    id: 'cha2ds2',
    name: 'CHA₂DS₂-VASc',
    description: 'Риск тромбоэмболии при фибрилляции предсердий',
    specialty: ['cardiology'],
    fields: [
      { id: 'chf', label: 'ХСН или дисфункция ЛЖ', type: 'toggle', points: 1 },
      { id: 'hypertension', label: 'Артериальная гипертензия', type: 'toggle', points: 1 },
      { id: 'age75', label: 'Возраст ≥75 лет', type: 'toggle', points: 2 },
      { id: 'diabetes', label: 'Сахарный диабет', type: 'toggle', points: 1 },
      { id: 'stroke', label: 'Инсульт/ТИА в анамнезе', type: 'toggle', points: 2 },
      { id: 'vascular', label: 'Сосудистые заболевания (ИМ, атеросклероз)', type: 'toggle', points: 1 },
      { id: 'age65', label: 'Возраст 65–74 года', type: 'toggle', points: 1 },
      { id: 'female', label: 'Женский пол', type: 'toggle', points: 1 },
    ],
    interpret: (score) => {
      if (score === 0) return { risk: 'Низкий', color: 'success', next: 'Антикоагулянты не показаны. Ежегодная переоценка.' }
      if (score === 1) return { risk: 'Умеренный', color: 'warning', next: 'Рассмотреть антикоагулянт (особенно у мужчин). Оценить риск кровотечений по HAS-BLED.' }
      return { risk: 'Высокий', color: 'danger', next: 'Антикоагулянтная терапия показана (ПОАК или варфарин). Оценить HAS-BLED.' }
    },
    source: 'Клинические рекомендации ВНОК/РКО по ФП, 2023',
  },
  {
    id: 'hasbled',
    name: 'HAS-BLED',
    description: 'Риск кровотечения на фоне антикоагулянтной терапии',
    specialty: ['cardiology'],
    fields: [
      { id: 'hypertension', label: 'Неконтролируемая АГ (АДс >160 мм рт.ст.)', type: 'toggle', points: 1 },
      { id: 'renal', label: 'Нарушение функции почек (диализ, трансплантация, креатинин >200 мкмоль/л)', type: 'toggle', points: 1 },
      { id: 'liver', label: 'Нарушение функции печени (цирроз, билирубин >2N, АСТ/АЛТ >3N)', type: 'toggle', points: 1 },
      { id: 'stroke', label: 'Инсульт в анамнезе', type: 'toggle', points: 1 },
      { id: 'bleeding', label: 'Кровотечение в анамнезе или предрасположенность', type: 'toggle', points: 1 },
      { id: 'labile', label: 'Лабильное МНО (нестабильный контроль, МНО в целевом диапазоне <60%)', type: 'toggle', points: 1 },
      { id: 'elderly', label: 'Возраст >65 лет', type: 'toggle', points: 1 },
      { id: 'drugs', label: 'Приём НПВС или антиагрегантов', type: 'toggle', points: 1 },
      { id: 'alcohol', label: 'Злоупотребление алкоголем (≥8 доз/нед)', type: 'toggle', points: 1 },
    ],
    interpret: (score) => {
      if (score <= 2) return { risk: 'Низкий', color: 'success', next: 'Антикоагуляция безопасна. Не является причиной отказа от терапии.' }
      if (score === 3) return { risk: 'Умеренный', color: 'warning', next: 'Осторожность. Устранить модифицируемые факторы риска. Частый мониторинг.' }
      return { risk: 'Высокий', color: 'danger', next: 'Высокий риск. Устранить все модифицируемые факторы. Не является абсолютным противопоказанием к антикоагуляции.' }
    },
    source: 'Klok FA et al., Chest 2010. Адаптировано для РФ.',
  },
  {
    id: 'wells_pe',
    name: 'Wells PE',
    description: 'Вероятность тромбоэмболии лёгочной артерии',
    specialty: ['pulmonology', 'emergency'],
    fields: [
      { id: 'dvt_signs', label: 'Клинические признаки ТГВ', type: 'toggle', points: 3 },
      { id: 'pe_likely', label: 'ТЭЛА более вероятна, чем альтернативный диагноз', type: 'toggle', points: 3 },
      { id: 'hr', label: 'ЧСС >100 уд/мин', type: 'toggle', points: 1.5 },
      { id: 'immobile', label: 'Иммобилизация ≥3 дней или операция в течение 4 нед', type: 'toggle', points: 1.5 },
      { id: 'dvt_pe_history', label: 'ТГВ или ТЭЛА в анамнезе', type: 'toggle', points: 1.5 },
      { id: 'hemoptysis', label: 'Кровохарканье', type: 'toggle', points: 1 },
      { id: 'malignancy', label: 'Онкологическое заболевание (активное или лечение в течение 6 мес)', type: 'toggle', points: 1 },
    ],
    interpret: (score) => {
      if (score < 2) return { risk: 'Низкая вероятность', color: 'success', next: 'D-димер. Если отрицательный — ТЭЛА исключена.' }
      if (score <= 6) return { risk: 'Умеренная вероятность', color: 'warning', next: 'D-димер. При положительном — КТ-ангиопульмонография.' }
      return { risk: 'Высокая вероятность', color: 'danger', next: 'КТ-ангиопульмонография без промедления. Начать антикоагуляцию.' }
    },
    source: 'Wells PS et al., Ann Intern Med 2001.',
  },
  {
    id: 'curb65',
    name: 'CURB-65',
    description: 'Тяжесть внебольничной пневмонии',
    specialty: ['pulmonology', 'therapy'],
    fields: [
      { id: 'confusion', label: 'Нарушение сознания (новое)', type: 'toggle', points: 1 },
      { id: 'urea', label: 'Мочевина >7 ммоль/л', type: 'toggle', points: 1 },
      { id: 'rr', label: 'ЧДД ≥30/мин', type: 'toggle', points: 1 },
      { id: 'bp', label: 'АДс <90 или АДд ≤60 мм рт.ст.', type: 'toggle', points: 1 },
      { id: 'age65', label: 'Возраст ≥65 лет', type: 'toggle', points: 1 },
    ],
    interpret: (score) => {
      if (score <= 1) return { risk: 'Лёгкая (летальность ~1–2%)', color: 'success', next: 'Амбулаторное лечение.' }
      if (score === 2) return { risk: 'Средняя (летальность ~9%)', color: 'warning', next: 'Рассмотреть госпитализацию.' }
      return { risk: 'Тяжёлая (летальность ~22%)', color: 'danger', next: 'Госпитализация. При счёте 4–5 — ОРИТ.' }
    },
    source: 'Клинические рекомендации РРО по пневмонии, 2023.',
  },
  {
    id: 'ckd_epi',
    name: 'СКФ по CKD-EPI',
    description: 'Скорость клубочковой фильтрации (функция почек)',
    specialty: ['nephrology', 'therapy'],
    fields: [
      { id: 'creatinine', label: 'Креатинин (мкмоль/л)', type: 'number', placeholder: '80' },
      { id: 'age', label: 'Возраст (лет)', type: 'number', placeholder: '45' },
      { id: 'female', label: 'Женский пол', type: 'toggle', points: 0 },
    ],
    calculate: (values) => {
      const cr = parseFloat(values.creatinine)
      const age = parseFloat(values.age)
      const isFemale = values.female
      if (!cr || !age) return null
      const crMg = cr / 88.4
      const kappa = isFemale ? 0.7 : 0.9
      const alpha = isFemale ? -0.241 : -0.302
      const crRatio = crMg / kappa
      const minPart = Math.min(crRatio, 1)
      const maxPart = Math.max(crRatio, 1)
      let gfr = 142 * Math.pow(minPart, alpha) * Math.pow(maxPart, -1.200) * Math.pow(0.9938, age)
      if (isFemale) gfr *= 1.012
      return Math.round(gfr)
    },
    interpret: (score) => {
      if (score >= 90) return { risk: 'G1 — норма или высокая', color: 'success', next: 'СКФ в норме. Контроль по показаниям.' }
      if (score >= 60) return { risk: 'G2 — незначительное снижение', color: 'success', next: 'Незначительное снижение СКФ. Коррекция факторов риска.' }
      if (score >= 45) return { risk: 'G3a — умеренное снижение', color: 'warning', next: 'ХБП G3a. Нефролог. Коррекция доз препаратов.' }
      if (score >= 30) return { risk: 'G3b — умеренно тяжёлое снижение', color: 'warning', next: 'ХБП G3b. Нефролог обязателен. Избегать нефротоксичных препаратов.' }
      if (score >= 15) return { risk: 'G4 — тяжёлое снижение', color: 'danger', next: 'ХБП G4. Подготовка к заместительной почечной терапии.' }
      return { risk: 'G5 — почечная недостаточность', color: 'danger', next: 'ХБП G5. Диализ или трансплантация почки.' }
    },
    source: 'Levey AS et al., Ann Intern Med 2009. Формула CKD-EPI 2021.',
  },
  {
    id: 'bmi',
    name: 'ИМТ и ожирение',
    description: 'Индекс массы тела по российским критериям',
    specialty: ['therapy', 'endocrinology'],
    fields: [
      { id: 'weight', label: 'Вес (кг)', type: 'number', placeholder: '75' },
      { id: 'height', label: 'Рост (см)', type: 'number', placeholder: '170' },
    ],
    calculate: (values) => {
      const w = parseFloat(values.weight)
      const h = parseFloat(values.height)
      if (!w || !h) return null
      return Math.round((w / Math.pow(h / 100, 2)) * 10) / 10
    },
    interpret: (score) => {
      if (score < 18.5) return { risk: `ИМТ ${score} — Дефицит массы тела`, color: 'warning', next: 'Оценить питательный статус. Исключить органическую патологию.' }
      if (score < 25) return { risk: `ИМТ ${score} — Норма`, color: 'success', next: 'Нормальная масса тела. Профилактические рекомендации.' }
      if (score < 30) return { risk: `ИМТ ${score} — Избыточная масса тела`, color: 'warning', next: 'Снижение веса на 5–10%. Диета, физическая активность.' }
      if (score < 35) return { risk: `ИМТ ${score} — Ожирение I степени`, color: 'danger', next: 'Лечение ожирения. ИМТ-цель <25. Оценить МС, АГ, СД2.' }
      if (score < 40) return { risk: `ИМТ ${score} — Ожирение II степени`, color: 'danger', next: 'Интенсивное лечение. Рассмотреть фармакотерапию.' }
      return { risk: `ИМТ ${score} — Ожирение III степени (морбидное)`, color: 'danger', next: 'Рассмотреть бариатрическую хирургию. Мультидисциплинарная команда.' }
    },
    source: 'ВОЗ 2000. Клинические рекомендации МЗ РФ по ожирению, 2020.',
  },
  {
    id: 'nihss',
    name: 'NIHSS',
    description: 'Тяжесть инсульта (неврологический дефицит)',
    specialty: ['neurology', 'emergency'],
    fields: [
      { id: 'consciousness', label: 'Уровень сознания (0–3)', type: 'select', options: ['0 — Ясное', '1 — Оглушение', '2 — Сопор', '3 — Кома'], points: [0,1,2,3] },
      { id: 'gaze', label: 'Взор (0–2)', type: 'select', options: ['0 — Норма', '1 — Частичный паралич', '2 — Полный паралич'], points: [0,1,2] },
      { id: 'visual', label: 'Поля зрения (0–3)', type: 'select', options: ['0 — Норма', '1 — Частичная гемианопсия', '2 — Полная гемианопсия', '3 — Двусторонняя'], points: [0,1,2,3] },
      { id: 'facial', label: 'Парез лица (0–3)', type: 'select', options: ['0 — Норма', '1 — Лёгкий', '2 — Частичный', '3 — Полный'], points: [0,1,2,3] },
      { id: 'arm_left', label: 'Двигательная функция руки (левая) (0–4)', type: 'select', options: ['0 — Норма', '1 — Снижение', '2 — Антигравитационное', '3 — Нет антигравитации', '4 — Плегия'], points: [0,1,2,3,4] },
      { id: 'arm_right', label: 'Двигательная функция руки (правая) (0–4)', type: 'select', options: ['0 — Норма', '1 — Снижение', '2 — Антигравитационное', '3 — Нет антигравитации', '4 — Плегия'], points: [0,1,2,3,4] },
      { id: 'leg_left', label: 'Двигательная функция ноги (левая) (0–4)', type: 'select', options: ['0 — Норма', '1 — Снижение', '2 — Антигравитационное', '3 — Нет антигравитации', '4 — Плегия'], points: [0,1,2,3,4] },
      { id: 'leg_right', label: 'Двигательная функция ноги (правая) (0–4)', type: 'select', options: ['0 — Норма', '1 — Снижение', '2 — Антигравитационное', '3 — Нет антигравитации', '4 — Плегия'], points: [0,1,2,3,4] },
      { id: 'ataxia', label: 'Атаксия (0–2)', type: 'select', options: ['0 — Нет', '1 — В одной конечности', '2 — В двух'], points: [0,1,2] },
      { id: 'sensory', label: 'Чувствительность (0–2)', type: 'select', options: ['0 — Норма', '1 — Лёгкая потеря', '2 — Тяжёлая потеря'], points: [0,1,2] },
      { id: 'speech', label: 'Лучшая речь (0–3)', type: 'select', options: ['0 — Норма', '1 — Лёгкая афазия', '2 — Тяжёлая афазия', '3 — Мутизм/глобальная'], points: [0,1,2,3] },
      { id: 'dysarthria', label: 'Дизартрия (0–2)', type: 'select', options: ['0 — Норма', '1 — Лёгкая', '2 — Тяжёлая'], points: [0,1,2] },
      { id: 'neglect', label: 'Угасание/игнорирование (0–2)', type: 'select', options: ['0 — Норма', '1 — Частичное', '2 — Полное'], points: [0,1,2] },
    ],
    interpret: (score) => {
      if (score === 0) return { risk: '0 — Нет симптомов', color: 'success', next: 'Неврологического дефицита нет.' }
      if (score <= 4) return { risk: `${score} — Малый инсульт`, color: 'success', next: 'Ранняя реабилитация. Оценить возможность ТЛТ.' }
      if (score <= 15) return { risk: `${score} — Средней тяжести`, color: 'warning', next: 'Инсультный блок. Рассмотреть ТЛТ или механическую тромбэктомию.' }
      if (score <= 20) return { risk: `${score} — Тяжёлый`, color: 'danger', next: 'ОНМК. Реанимация. Механическая тромбэктомия при показаниях.' }
      return { risk: `${score} — Очень тяжёлый`, color: 'danger', next: 'Критическое состояние. ОРИТ. Интенсивная терапия.' }
    },
    source: 'NIH Stroke Scale. Клинические рекомендации МЗ РФ по ОНМК, 2023.',
  },
  {
    id: 'glasgow',
    name: 'Шкала Глазго (GCS)',
    description: 'Уровень сознания',
    specialty: ['emergency', 'neurology'],
    fields: [
      { id: 'eyes', label: 'Открывание глаз', type: 'select', options: ['1 — Нет', '2 — На боль', '3 — На голос', '4 — Спонтанное'], points: [1,2,3,4] },
      { id: 'verbal', label: 'Речевая реакция', type: 'select', options: ['1 — Нет', '2 — Звуки', '3 — Слова', '4 — Спутанная речь', '5 — Ориентирован'], points: [1,2,3,4,5] },
      { id: 'motor', label: 'Двигательная реакция', type: 'select', options: ['1 — Нет', '2 — Разгибание (децеребрация)', '3 — Сгибание (декортикация)', '4 — Отдёргивание', '5 — Локализация боли', '6 — Выполняет команды'], points: [1,2,3,4,5,6] },
    ],
    interpret: (score) => {
      if (score >= 13) return { risk: `${score}/15 — Лёгкое нарушение`, color: 'success', next: 'Лёгкое нарушение сознания.' }
      if (score >= 9) return { risk: `${score}/15 — Умеренное нарушение`, color: 'warning', next: 'Оглушение/сопор. Мониторинг. Готовность к интубации.' }
      if (score >= 6) return { risk: `${score}/15 — Тяжёлое нарушение`, color: 'danger', next: 'Сопор/кома. Интубация при GCS ≤8.' }
      return { risk: `${score}/15 — Кома`, color: 'danger', next: 'Глубокая кома. Интубация. ОРИТ.' }
    },
    source: 'Teasdale G, Jennett B, Lancet 1974.',
  },
]

export const specialties = [
  { id: 'all', label: 'Все' },
  { id: 'therapy', label: 'Терапия' },
  { id: 'cardiology', label: 'Кардиология' },
  { id: 'neurology', label: 'Неврология' },
  { id: 'pulmonology', label: 'Пульмонология' },
  { id: 'nephrology', label: 'Нефрология' },
  { id: 'emergency', label: 'Ургентная' },
  { id: 'endocrinology', label: 'Эндокринология' },
]
