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
        <ellipse cx="34" cy="70" rx="6" ry="6.8" fill="#000"/>
        <ellipse cx="66" cy="70" rx="6" ry="6.8" fill="#000"/>
        <ellipse cx="50" cy="77" rx="4.2" ry="3.2" fill="#000"/>
      </mask>
      <g fill="${color}" mask="url(#cut)">
        <ellipse cx="34" cy="28" rx="10" ry="25" transform="rotate(-9 34 52)"/>
        <ellipse cx="66" cy="28" rx="10" ry="25" transform="rotate(9 66 52)"/>
        <path d="M50 38 C74 38 93 51 94 69 C95 87 75 97 50 97 C25 97 5 87 6 69 C7 51 26 38 50 38Z"/>
      </g>`
  }
  return `
    <defs>
      <linearGradient id="fur" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.45" stop-color="#fff"/><stop offset="1" stop-color="#ffe9f0"/>
      </linearGradient>
      <linearGradient id="ear" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffc4d4"/><stop offset="1" stop-color="#ff9fba"/>
      </linearGradient>
    </defs>
    <g stroke="#cf9db0" stroke-width="2.2" fill="url(#fur)">
      <ellipse cx="34" cy="28" rx="10" ry="25" transform="rotate(-9 34 52)"/>
      <ellipse cx="66" cy="28" rx="10" ry="25" transform="rotate(9 66 52)"/>
    </g>
    <ellipse cx="34" cy="30" rx="5" ry="17" fill="url(#ear)" transform="rotate(-9 34 52)"/>
    <ellipse cx="66" cy="30" rx="5" ry="17" fill="url(#ear)" transform="rotate(9 66 52)"/>
    <path d="M50 38 C74 38 93 51 94 69 C95 87 75 97 50 97 C25 97 5 87 6 69 C7 51 26 38 50 38Z"
      fill="url(#fur)" stroke="#cf9db0" stroke-width="2.2"/>
    <path d="M44.5 39 Q46.5 33 49.5 37.8 Q51.5 31.5 54 37.5 Q56.3 34 56.5 39"
      fill="url(#fur)" stroke="#cf9db0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="21" cy="80" rx="7.8" ry="4.8" fill="#ffaec4"/>
    <ellipse cx="79" cy="80" rx="7.8" ry="4.8" fill="#ffaec4"/>
    <ellipse cx="34" cy="70" rx="5.3" ry="6.1" fill="#4f3644"/>
    <ellipse cx="66" cy="70" rx="5.3" ry="6.1" fill="#4f3644"/>
    <circle cx="32.2" cy="67.7" r="2.1" fill="#fff"/>
    <circle cx="64.2" cy="67.7" r="2.1" fill="#fff"/>
    <circle cx="36" cy="72" r="0.9" fill="#fff"/>
    <circle cx="68" cy="72" r="0.9" fill="#fff"/>
    <path d="M46.6 74 Q50 72.2 53.4 74 Q52.9 77.4 50 78.3 Q47.1 77.4 46.6 74Z" fill="#ff7fa3"/>
    <path d="M44.2 80 Q47.1 84.2 50 80 Q52.9 84.2 55.8 80" fill="none" stroke="#4f3644"
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
    <g transform="translate(187 185) scale(6.5)">${bunnyHead()}</g>
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
