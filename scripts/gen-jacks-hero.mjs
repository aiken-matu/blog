/**
 * ジャックス減配リスク記事用ヒーロー画像
 * generate-all-images.mjs と同じデザインシステム（orangeBrown）を使用
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

// orangeBrown プリセット（generate-all-images.mjs と同一値）
const colors = {
  grad1:      '#FFF7ED',
  grad2:      '#FED7AA',
  bar:        '#F97316',
  tagColor:   '#C2410C',
  titleColor: '#7C2D12',
};

// ── レイアウト定数 ────────────────────────────────────────────
const W = 1200;
const H = 630;
const MARGIN = 100;         // 左右最小余白
const CENTER_X = W / 2;
const FONT = "'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif";

// タイトル（2行・短縮版）
const titleLines = [
  'ジャックスは減配する？',
  '配当維持を2026年決算から検証',
];

// 文字幅の概算（全角=1.0, 半角ASCII=0.5）
function estimateWidth(str, fontSize) {
  return [...str].reduce((acc, ch) => {
    return acc + (ch.charCodeAt(0) > 255 ? 1.0 : 0.5);
  }, 0) * fontSize;
}

// 各行が MARGIN 内に収まる最大フォントサイズを計算
function safeFontSize(lines, maxSize = 68, minSize = 36) {
  const available = W - MARGIN * 2;
  for (let fs = maxSize; fs >= minSize; fs -= 2) {
    const fits = lines.every(l => estimateWidth(l, fs) <= available);
    if (fits) return fs;
  }
  return minSize;
}

const titleFontSize = safeFontSize(titleLines, 68, 36);
const titleLineHeight = Math.round(titleFontSize * 1.25);

// タイトルブロックの縦中央位置
const titleBlockH = (titleLines.length - 1) * titleLineHeight + titleFontSize;
// 全体の中心より少し上（サブタイトル分の余白を考慮）
const titleStartY = 290 - titleBlockH / 2 + titleFontSize * 0.82;

const titleLinesEl = titleLines
  .map(
    (l, i) =>
      `<text x="${CENTER_X}" y="${titleStartY + i * titleLineHeight}" font-family="${FONT}" font-size="${titleFontSize}" font-weight="900" fill="${colors.titleColor}" text-anchor="middle" dominant-baseline="auto" letter-spacing="-1">${escXML(l)}</text>`
  )
  .join('\n  ');

// サブタイトル
const subtitle = '配当性向89.5%・減配シミュレーション';
const subtitleY = titleStartY + (titleLines.length - 1) * titleLineHeight + 54;
const subtitleEl = `<text x="${CENTER_X}" y="${subtitleY}" font-family="${FONT}" font-size="26" font-weight="500" fill="${colors.titleColor}" opacity="0.68" text-anchor="middle" dominant-baseline="auto">${escXML(subtitle)}</text>`;

// タグ（上部）
const tags = ['ジャックス', '減配', '高配当株'];
const tagW = 180, tagGap = 14, tagH = 36;
const totalTagW = tags.length * tagW + (tags.length - 1) * tagGap;
const tagStartX = (W - totalTagW) / 2;
const tagsEl = tags
  .map((t, i) => {
    const tx = tagStartX + i * (tagW + tagGap);
    return `<rect x="${tx}" y="100" width="${tagW}" height="${tagH}" rx="18" fill="${colors.tagColor}"/>
  <text x="${tx + tagW / 2}" y="118" font-family="${FONT}" font-size="17" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${escXML(t)}</text>`;
  })
  .join('\n  ');

// 下部フィーチャーバー
const features = ['2026年3月期決算', '配当性向89.5%', '減配シミュレーション'];
const featW = 220, featGap = 24;
const totalFeatW = features.length * featW + (features.length - 1) * featGap;
const featStartX = (W - totalFeatW) / 2;
const featuresEl = features
  .map((f, i) => {
    const fx = featStartX + i * (featW + featGap);
    return `<rect x="${fx}" y="540" width="${featW}" height="44" rx="8" fill="rgba(0,0,0,0.07)"/>
  <text x="${fx + featW / 2}" y="562" font-family="${FONT}" font-size="18" font-weight="600" fill="${colors.titleColor}" opacity="0.80" text-anchor="middle" dominant-baseline="middle">${escXML(f)}</text>`;
  })
  .join('\n  ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.grad1}"/>
      <stop offset="100%" style="stop-color:${colors.grad2}"/>
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(0,0,0,0.00)"/>
      <stop offset="100%" style="stop-color:rgba(0,0,0,0.06)"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#overlay)"/>
  <!-- 左端アクセントバー -->
  <rect x="0" y="0" width="10" height="${H}" fill="${colors.bar}"/>
  <!-- デコレーション円 -->
  <circle cx="1080" cy="80" r="200" fill="rgba(0,0,0,0.02)"/>
  <circle cx="1150" cy="550" r="120" fill="rgba(0,0,0,0.02)"/>
  <!-- 配当日和 ロゴ -->
  <text x="36" y="52" font-family="${FONT}" font-size="22" font-weight="700" fill="${colors.titleColor}" opacity="0.45" letter-spacing="3">配当日和</text>
  <!-- タグ -->
  ${tagsEl}
  <!-- タイトル（2行） -->
  ${titleLinesEl}
  <!-- サブタイトル -->
  ${subtitleEl}
  <!-- 区切り線 -->
  <line x1="${MARGIN}" y1="510" x2="${W - MARGIN}" y2="510" stroke="rgba(0,0,0,0.10)" stroke-width="1"/>
  <!-- フィーチャー -->
  ${featuresEl}
</svg>`;

const outPath = resolve(OUT, 'jacks-dividend-cut-risk-2026.png');
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`✅ Generated: jacks-dividend-cut-risk-2026.png`);
console.log(`   タイトルフォントサイズ: ${titleFontSize}px`);
console.log(`   行1の推定幅: ${Math.round(estimateWidth(titleLines[0], titleFontSize))}px`);
console.log(`   行2の推定幅: ${Math.round(estimateWidth(titleLines[1], titleFontSize))}px`);
console.log(`   使用可能幅（余白${MARGIN}px）: ${W - MARGIN * 2}px`);
