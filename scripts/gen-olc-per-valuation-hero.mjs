/**
 * オリエンタルランドPER記事ヒーロー画像
 * generate-all-images.mjs の buildSVG / P.teal をそのまま使用
 */
import sharp from 'sharp';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/assets');

function escXML(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSVG({ grad1, grad2, bar, tagColor, titleColor, tags, title, subtitle, features }) {
  const lines = title;
  const lineHeight = 76;
  const titleStartY = subtitle
    ? 330 - ((lines.length - 1) * lineHeight) / 2
    : 345 - ((lines.length - 1) * lineHeight) / 2;

  const titleLines = lines.map((l, i) =>
    `<text x="600" y="${titleStartY + i * lineHeight}" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="68" font-weight="900" fill="${titleColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="-1">${escXML(l)}</text>`
  ).join('\n    ');

  const subtitleEl = subtitle
    ? `<text x="600" y="${titleStartY + (lines.length - 1) * lineHeight + 54}" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="28" font-weight="500" fill="${titleColor}" opacity="0.68" text-anchor="middle" dominant-baseline="middle">${escXML(subtitle)}</text>`
    : '';

  const tagW = 170, tagGap = 14, tagH = 36;
  const totalTagW = tags.length * tagW + (tags.length - 1) * tagGap;
  const tagStartX = (1200 - totalTagW) / 2;
  const tagsEl = tags.map((t, i) => {
    const tx = tagStartX + i * (tagW + tagGap);
    return `<rect x="${tx}" y="100" width="${tagW}" height="${tagH}" rx="18" fill="${tagColor}"/>
    <text x="${tx + tagW / 2}" y="118" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="17" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${escXML(t)}</text>`;
  }).join('\n    ');

  const featCount = features.length;
  const featW  = featCount >= 4 ? 210 : 220;
  const featGap2 = featCount >= 4 ?  16 :  24;
  const totalFeatW = featCount * featW + (featCount - 1) * featGap2;
  const featStartX = (1200 - totalFeatW) / 2;
  const featuresEl = features.map((f, i) => {
    const fx = featStartX + i * (featW + featGap2);
    return `<rect x="${fx}" y="540" width="${featW}" height="44" rx="8" fill="rgba(0,0,0,0.07)"/>
    <text x="${fx + featW / 2}" y="562" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="18" font-weight="600" fill="${titleColor}" opacity="0.80" text-anchor="middle" dominant-baseline="middle">${escXML(f)}</text>`;
  }).join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${grad1}"/>
      <stop offset="100%" style="stop-color:${grad2}"/>
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(0,0,0,0.00)"/>
      <stop offset="100%" style="stop-color:rgba(0,0,0,0.06)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#overlay)"/>
  <rect x="0" y="0" width="10" height="630" fill="${bar}"/>
  <circle cx="1080" cy="80" r="200" fill="rgba(0,0,0,0.02)"/>
  <circle cx="1150" cy="550" r="120" fill="rgba(0,0,0,0.02)"/>
  <text x="36" y="52" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="22" font-weight="700" fill="${titleColor}" opacity="0.45" letter-spacing="3">配当日和</text>
  ${tagsEl}
  ${titleLines}
  ${subtitleEl}
  <line x1="80" y1="510" x2="1120" y2="510" stroke="rgba(0,0,0,0.10)" stroke-width="1"/>
  ${featuresEl}
</svg>`;
}

// ── teal プリセット（generate-all-images.mjs と完全同一） ──────────────────────
const P_teal = {
  grad1: '#F0FDFA',
  grad2: '#99F6E4',
  bar: '#14B8A6',
  tagColor: '#0F766E',
  titleColor: '#134E4A',
};

// ── オリエンタルランドPER記事のパラメーター ───────────────────────────────────
const opts = {
  ...P_teal,
  tags: ['オリエンタルランド', 'PER分析', '株主優待'],
  title: [
    'オリエンタルランドのPERは適正？',
    '株主優待込みで今が買い時か考えてみた',
  ],
  subtitle: null,
  features: ['PER推移', 'EPS成長', '株主優待価値'],
};

const outPath = resolve(OUT, 'olc-per-valuation-2026.png');
const svg = buildSVG(opts);
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log('✅ Generated: olc-per-valuation-2026.png');
