/**
 * イオン株下落理由記事ヒーロー画像
 * OrangeBrown プリセット、左右余白 150px 以上を保証
 * 出力先: public/images/ および src/assets/
 */
import sharp from 'sharp';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function escXML(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── orangeBrown プリセット ──────────────────────────────────────────────────
const C = {
  grad1: '#FFF7ED',
  grad2: '#FED7AA',
  bar: '#F97316',
  tagColor: '#C2410C',
  titleColor: '#7C2D12',
};

const W = 1200, H = 630;
const CX = W / 2;

// タグ
const tags = ['イオン', '株価下落', '高配当株'];
const tagW = 170, tagGap = 14, tagH = 36;
const totalTagW = tags.length * tagW + (tags.length - 1) * tagGap;
const tagStartX = (W - totalTagW) / 2;
const tagsEl = tags.map((t, i) => {
  const tx = tagStartX + i * (tagW + tagGap);
  return `<rect x="${tx}" y="100" width="${tagW}" height="${tagH}" rx="18" fill="${C.tagColor}"/>
  <text x="${tx + tagW / 2}" y="118" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="17" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${escXML(t)}</text>`;
}).join('\n  ');

// 行1「イオン株はなぜ下落？」= 10文字 → font-size 72 で推定幅 ~720px（余白 240px）
const line1 = 'イオン株はなぜ下落？';
const line1Size = 72;
const line1Y = 300;

// 行2「過去最高益でも株価が下がる本当の理由」= 19文字 → font-size 40 で推定幅 ~760px（余白 220px）
const line2 = '過去最高益でも株価が下がる本当の理由';
const line2Size = 40;
const line2Y = 395;

// フィーチャーバー
const features = ['PER分析', '有利子負債', 'オーナーズカード'];
const featW = 220, featGap = 24;
const totalFeatW = features.length * featW + (features.length - 1) * featGap;
const featStartX = (W - totalFeatW) / 2;
const featuresEl = features.map((f, i) => {
  const fx = featStartX + i * (featW + featGap);
  return `<rect x="${fx}" y="540" width="${featW}" height="44" rx="8" fill="rgba(0,0,0,0.07)"/>
  <text x="${fx + featW / 2}" y="562" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="18" font-weight="600" fill="${C.titleColor}" opacity="0.80" text-anchor="middle" dominant-baseline="middle">${escXML(f)}</text>`;
}).join('\n  ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${C.grad1}"/>
      <stop offset="100%" style="stop-color:${C.grad2}"/>
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(0,0,0,0.00)"/>
      <stop offset="100%" style="stop-color:rgba(0,0,0,0.06)"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#overlay)"/>
  <rect x="0" y="0" width="10" height="${H}" fill="${C.bar}"/>
  <circle cx="1080" cy="80" r="200" fill="rgba(0,0,0,0.02)"/>
  <circle cx="1150" cy="550" r="120" fill="rgba(0,0,0,0.02)"/>
  <text x="36" y="52" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="22" font-weight="700" fill="${C.titleColor}" opacity="0.45" letter-spacing="3">配当日和</text>
  ${tagsEl}
  <text x="${CX}" y="${line1Y}" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="${line1Size}" font-weight="900" fill="${C.titleColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="-1">${escXML(line1)}</text>
  <text x="${CX}" y="${line2Y}" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="${line2Size}" font-weight="700" fill="${C.titleColor}" opacity="0.80" text-anchor="middle" dominant-baseline="middle" letter-spacing="-0.5">${escXML(line2)}</text>
  <line x1="80" y1="510" x2="1120" y2="510" stroke="rgba(0,0,0,0.10)" stroke-width="1"/>
  ${featuresEl}
  <text x="${W - 36}" y="${H - 24}" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="18" font-weight="700" fill="${C.titleColor}" opacity="0.35" text-anchor="end">配当日和</text>
</svg>`;

const filename = 'aeon-stock-fall-reasons-2026.png';
await sharp(Buffer.from(svg)).png().toFile(resolve(ROOT, 'public/images', filename));
await sharp(Buffer.from(svg)).png().toFile(resolve(ROOT, 'src/assets', filename));
console.log(`✅ Generated: ${filename}`);
console.log(`   行1「${line1}」: font-size ${line1Size} → 推定余白 ~${Math.round((W - line1.length * line1Size) / 2)}px`);
console.log(`   行2「${line2}」: font-size ${line2Size} → 推定余白 ~${Math.round((W - line2.length * line2Size) / 2)}px`);
