/**
 * Скачивает официальный МКБ-10 от Минздрава (через GitHub ak4nv/mkb10)
 * и генерирует src/data/icd10.js в нужном формате
 *
 * Запуск: node scripts/build-icd10.mjs
 */

import { createWriteStream, readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dir = dirname(fileURLToPath(import.meta.url))
const OUT_JS  = join(__dir, '../src/data/icd10.js')
const TMP_CSV = join(__dir, '../scripts/_mkb10_tmp.csv')

const CSV_URL = 'https://raw.githubusercontent.com/ak4nv/mkb10/master/resources/1.2.643.5.1.13.13.11.1005_2.27.csv'

// ─── 1. Download ────────────────────────────────────────────────────────────
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    https.get(url, res => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', reject)
  })
}

// ─── 2. Parse CSV ────────────────────────────────────────────────────────────
function parseCSV(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)
  const headers = lines[0].split(';').map(h => h.replace(/"/g, ''))
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(';').map(c => c.replace(/"/g, '').trim())
    const row = {}
    headers.forEach((h, idx) => { row[h] = cols[idx] || '' })
    rows.push(row)
  }
  return rows
}

// ─── 3. Build icd10 array ────────────────────────────────────────────────────
function isRange(code) { return /^[A-Z]\d{2}-[A-Z]\d{2}$/.test(code) }
function isChapter(code) { return /^[IVX]+$/.test(code) }
function isCode(code) { return /^[A-Z]\d{2}(\.\d)?$/.test(code) }

function build(rows) {
  // index by ID for parent lookup
  const byId = {}
  rows.forEach(r => { byId[r.ID] = r })

  // For each actual leaf code find its block ancestor
  const result = []

  rows.forEach(row => {
    if (row.ACTUAL !== '1') return
    const code = row.MKB_CODE
    if (!isCode(code)) return

    // Walk up to find nearest range parent (block)
    let blockCode = ''
    let blockTitle = ''
    let pid = row.ID_PARENT
    while (pid && byId[pid]) {
      const parent = byId[pid]
      if (isRange(parent.MKB_CODE)) {
        blockCode  = parent.MKB_CODE
        blockTitle = toTitleCase(parent.MKB_NAME)
        break
      }
      pid = parent.ID_PARENT
    }

    result.push({
      code,
      title: toTitleCase(row.MKB_NAME),
      block: blockCode,
      blockTitle,
    })
  })

  // Sort: chapter letter first, then numeric part, then subcodes
  result.sort((a, b) => {
    const al = a.code.charCodeAt(0), bl = b.code.charCodeAt(0)
    if (al !== bl) return al - bl
    const an = parseFloat(a.code.slice(1)), bn = parseFloat(b.code.slice(1))
    return an - bn
  })

  return result
}

function toTitleCase(str) {
  if (!str) return ''
  // Keep all-caps as-is only for very short strings (abbreviations);
  // otherwise lowercase everything and capitalise first letter.
  const s = str.trim()
  if (s.length <= 4 && s === s.toUpperCase()) return s
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

// ─── 4. Write JS ─────────────────────────────────────────────────────────────
function writeJS(entries) {
  const lines = entries.map(e =>
    `  { code: ${JSON.stringify(e.code)}, title: ${JSON.stringify(e.title)}, block: ${JSON.stringify(e.block)}, blockTitle: ${JSON.stringify(e.blockTitle)} },`
  )
  const content = `// Auto-generated from МКБ-10 (Минздрав РФ). DO NOT EDIT MANUALLY.\n// Source: https://github.com/ak4nv/mkb10\nexport const icd10 = [\n${lines.join('\n')}\n]\n`
  writeFileSync(OUT_JS, content, 'utf8')
  console.log(`✓ Записано ${entries.length} кодов → ${OUT_JS}`)
}

// ─── main ─────────────────────────────────────────────────────────────────────
console.log('⬇  Скачиваю МКБ-10 CSV...')
await download(CSV_URL, TMP_CSV)
console.log('✓ CSV скачан')

const raw = readFileSync(TMP_CSV, 'utf8')
const rows = parseCSV(raw)
console.log(`✓ Разобрано строк: ${rows.length}`)

const entries = build(rows)
console.log(`✓ Кодов для записи: ${entries.length}`)

writeJS(entries)

// clean up temp file
import { unlinkSync } from 'fs'
try { unlinkSync(TMP_CSV) } catch {}
console.log('✓ Временный файл удалён')
