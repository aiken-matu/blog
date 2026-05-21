/**
 * オリエンタルランドPER記事ヒーロー画像
 * 左右余白 150px 以上を保証するため、行ごとにフォントサイズを個別設定
 * 出力先: public/images/olc-per-valuation-2026.png
 */
import sharp from 'sharp';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/images');

function escXML(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── teal プリセット ──────────────────────────────────────────────────────────
const C = {
  grad1: '#F0FDFA',
  grad2: '#99F6E4',
  bar: '#14B8A6',
  tagColor: '#0F766E',
  titleColor: '#134E4A',
};

// ── レイアウト定数 ───────────────────────────────────────────────────────────
// 使用可能幅：1200 - 150*2 = 900px（150px余白を保証）
const W = 1200, H = 630;
const MARGIN = 150;        // 左右余白
const CX = W / 2;         // 中央X

// タグ
const tags = ['オリエンタルランド', 'PER分析', '株主優待'];
const tagW = 190, tagGap = 12, tagH = 36;
const totalTagW = tags.length * tagW + (tags.length - 1) * tagGap;
const tagStartX = (W - totalTagW) / 2;
const tagsEl = tags.map((t, i) => {
  const tx = tagStartX + i * (tagW + tagGap);
  return `<rect x="${tx}" y="100" width="${tagW}" height="${tagH}" rx="18" fill="${C.tagColor}"/>
  <text x="${tx + tagW / 2}" y="118" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="17" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${escXML(t)}</text>`;
}).join('\n  ');

// メインテキスト行1：「オリエンタルランドのPERは適正？」
// 使用可能幅900px / 約14文字 → font-size 56 (約784px) で余裕あり
const line1 = 'オリエンタルランドのPERは適正？';
const line1Size = 56;
const line1Y = 295;

// メインテキスト行2：「株主優待込みで今が買い時か考えてみた」
// 使用可能幅900px / 18文字 → font-size 42 (約756px) で安全
const line2 = '株主優待込みで今が買い時か考えてみた';
const line2Size = 42;
const line2Y = 385;

// フィーチャーバー（下部）
const features = ['PER推移', 'EPS成長', '株主優待価値'];
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
  <!-- 左アクセントバー -->
  <rect x="0" y="0" width="10" height="${H}" fill="${C.bar}"/>
  <!-- 装飾円 -->
  <circle cx="1080" cy="80" r="200" fill="rgba(0,0,0,0.02)"/>
  <circle cx="1150" cy="550" r="120" fill="rgba(0,0,0,0.02)"/>
  <!-- ブログ名（左上） -->
  <text x="36" y="52" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="22" font-weight="700" fill="${C.titleColor}" opacity="0.45" letter-spacing="3">配当日和</text>
  <!-- タグ -->
  ${tagsEl}
  <!-- メインテキスト行1 -->
  <text x="${CX}" y="${line1Y}" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="${line1Size}" font-weight="900" fill="${C.titleColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="-1">${escXML(line1)}</text>
  <!-- メインテキスト行2 -->
  <text x="${CX}" y="${line2Y}" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="${line2Size}" font-weight="700" fill="${C.titleColor}" opacity="0.80" text-anchor="middle" dominant-baseline="middle" letter-spacing="-0.5">${escXML(line2)}</text>
  <!-- 区切り線 -->
  <line x1="80" y1="510" x2="1120" y2="510" stroke="rgba(0,0,0,0.10)" stroke-width="1"/>
  <!-- フィーチャーバー -->
  ${featuresEl}
  <!-- 右下「配当日和」 -->
  <text x="${W - 36}" y="${H - 24}" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="18" font-weight="700" fill="${C.titleColor}" opacity="0.35" text-anchor="end">配当日和</text>
</svg>`;

const outPath = resolve(OUT, 'olc-per-valuation-2026.png');
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log('✅ Generated: public/images/olc-per-valuation-2026.png');
console.log(`   行1「${line1}」: font-size ${line1Size} → 推定幅 ~${Math.round(line1.length * line1Size * 0.9)}px (余白 ${Math.round((W - line1.length * line1Size * 0.9) / 2)}px)`);
console.log(`   行2「${line2}」: font-size ${line2Size} → 推定幅 ~${Math.round(line2.length * line2Size * 0.95)}px (余白 ${Math.round((W - line2.length * line2Size * 0.95) / 2)}px)`);
