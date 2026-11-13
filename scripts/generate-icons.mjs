// Draws the bunny app icon and tray icons as SVG and renders them to PNG.
// Run with: npm run icons
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Bunny head on a 100x100 canvas. `flat` gives a one-colour silhouette. */
function bunnyHead({ flat = false, color = '#000' } = {}) {
  if (flat) {
    // Face details are cut out so the silhouette still reads as a bunny.
    return `
      <mask id="cut">
        <rect width="100" height="100" fill="#fff"/>
        <circle cx="38" cy="66" r="5" fill="#000"/>
        <circle cx="62" cy="66" r="5" fill="#000"/>
        <ellipse cx="50" cy="75" rx="4" ry="3" fill="#000"/>
      </mask>
      <g fill="${color}" mask="url(#cut)">
        <ellipse cx="35" cy="28" rx="10" ry="25" transform="rotate(-8 35 50)"/>
        <ellipse cx="65" cy="28" rx="10" ry="25" transform="rotate(8 65 50)"/>
        <ellipse cx="50" cy="67" rx="37" ry="29"/>
      </g>`
  }
  return `
    <g stroke="#e3bfcc" stroke-width="2.5" fill="#fff">
      <ellipse cx="35" cy="28" rx="10" ry="25" transform="rotate(-8 35 50)"/>
      <ellipse cx="65" cy="28" rx="10" ry="25" transform="rotate(8 65 50)"/>
    </g>
    <ellipse cx="35" cy="30" rx="4.8" ry="17" fill="#ffb3c7" transform="rotate(-8 35 50)"/>
    <ellipse cx="65" cy="30" rx="4.8" ry="17" fill="#ffb3c7" transform="rotate(8 65 50)"/>
    <ellipse cx="50" cy="67" rx="37" ry="29" fill="#fff" stroke="#e3bfcc" stroke-width="2.5"/>
    <ellipse cx="26" cy="75" rx="7" ry="4.3" fill="#ff9dba"/>
    <ellipse cx="74" cy="75" rx="7" ry="4.3" fill="#ff9dba"/>
    <circle cx="37" cy="65" r="4.3" fill="#5d4452"/>
    <circle cx="63" cy="65" r="4.3" fill="#5d4452"/>
    <circle cx="35.6" cy="63.5" r="1.5" fill="#fff"/>
    <circle cx="61.6" cy="63.5" r="1.5" fill="#fff"/>
    <path d="M47 70.500 Q50 69 53 70.500 Q52.500 73.800 50 74.600 Q47.500 73.800 47 70.500Z" fill="#ff8fae"/>
    <path d="M45 76.500 Q47.500 80 50 76.500 Q52.500 80 55 76.5" fill="none" stroke="#5d4452"
      stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`
}

const appIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe3ec"/>
      <stop offset="1" stop-color="#ffc2d4"/>
    </linearGradient>
    <pattern id="dots" width="120" height="120" patternUnits="userSpaceOnUse">
      <circle cx="30" cy="30" r="13" fill="#fff" opacity="0.5"/>
      <circle cx="90" cy="90" r="13" fill="#fff" opacity="0.5"/>
    </pattern>
    <clipPath id="tile"><rect x="64" y="64" width="896" height="896" rx="210"/></clipPath>
  </defs>
  <g clip-path="url(#tile)">
    <rect x="64" y="64" width="896" height="896" fill="url(#bg)"/>
    <rect x="64" y="64" width="896" height="896" fill="url(#dots)"/>
    <circle cx="512" cy="560" r="330" fill="#fff" opacity="0.45"/>
    <g transform="translate(187 170) scale(6.5)">${bunnyHead()}</g>
  </g>
  <rect x="72" y="72" width="880" height="880" rx="202" fill="none" stroke="#fff" stroke-width="16" opacity="0.85"/>
</svg>`

const trayColor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -2 108 108">${bunnyHead()}</svg>`
const trayTemplate = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -2 108 108">${bunnyHead({ flat: true })}</svg>`

async function render(svg, size, file) {
  const path = join(root, file)
  await mkdir(dirname(path), { recursive: true })
  await sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toFile(path)
  console.log(`  ${file} (${size}px)`)
}

console.log('Drawing bunnies...')
await writeFile(join(root, 'resources/icon.svg'), appIcon.trim() + '\n')
// electron-builder turns build/icon.png into the .icns and .ico for installers.
await render(appIcon, 1024, 'build/icon.png')
await render(appIcon, 256, 'resources/icon.png')
// Windows and Linux tray: full-colour bunny.
await render(trayColor, 16, 'resources/tray.png')
await render(trayColor, 32, 'resources/tray@2x.png')
// macOS menu bar: a black "template" image the system tints itself.
await render(trayTemplate, 18, 'resources/trayTemplate.png')
await render(trayTemplate, 36, 'resources/trayTemplate@2x.png')
