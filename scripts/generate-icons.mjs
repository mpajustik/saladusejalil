// Skript ikoonide genereerimiseks SVG → PNG
// Kasutab: node scripts/generate-icons.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const iconsDir = join(root, 'public', 'icons')

mkdirSync(iconsDir, { recursive: true })

// Kontrolli kas sharp on olemas
try {
  const sharp = (await import('sharp')).default
  const svgContent = readFileSync(join(iconsDir, 'icon.svg'))

  await sharp(svgContent).resize(192, 192).png().toFile(join(iconsDir, 'icon-192.png'))
  await sharp(svgContent).resize(512, 512).png().toFile(join(iconsDir, 'icon-512.png'))
  await sharp(svgContent).resize(512, 512).png().toFile(join(iconsDir, 'icon-maskable.png'))

  console.log('✓ Ikoonid genereeritud: icon-192.png, icon-512.png, icon-maskable.png')
} catch {
  console.log('sharp pole installeeritud. Installi: npm install --save-dev sharp')
  console.log('Siis käivita: node scripts/generate-icons.mjs')
  console.log('')
  console.log('Alternatiiv: kasuta veebiteenust nagu https://realfavicongenerator.net')
  console.log('ja lae alla ikoonid kausta public/icons/')
}
