/**
 * ジャックス記事用ヒーロー画像（オレンジブラウン）
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, '../src/assets/jacks-dividend-cut-risk-2026.png');

const W = 1200;
const H = 630;

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const fontFamily = "Hiragino Sans, 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Noto Sans CJK JP', sans-serif";

// テキスト行
const mainLine  = 'ジャックス（8584）は減配する？';
const subLine   = '配当維持できるか2026年決算から考える';
const tags      = 'ジャックス・減配リスク・配当分析';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">

  <!-- 背景：ウォームクリーム -->
  <rect width="${W}" height="${H}" fill="#FFF7ED"/>

  <!-- 右下デコレーション：薄い円 -->
  <circle cx="1080" cy="500" r="260" fill="#FED7AA" opacity="0.35"/>
  <circle cx="1150" cy="580" r="160" fill="#FDBA74" opacity="0.25"/>

  <!-- 左上：薄い円 -->
  <circle cx="80" cy="80" r="120" fill="#FED7AA" opacity="0.2"/>

  <!-- 下部アクセントバー -->
  <rect x="0" y="${H - 18}" width="${W}" height="18" fill="#FDE68A"/>
  <rect x="0" y="${H - 20}" width="${W}" height="2" fill="#F59E0B"/>

  <!-- 左上：配当日和 ロゴ -->
  <text
    x="56" y="72"
    font-family="${fontFamily}"
    font-size="28" fill="#F59E0B" font-weight="700"
    letter-spacing="2">配当日和</text>

  <!-- 区切り線 -->
  <rect x="56" y="86" width="96" height="2" fill="#FCD34D"/>

  <!-- メインタイトル -->
  <text
    x="${W / 2}" y="248"
    font-family="${fontFamily}"
    font-size="62" fill="#92400E"
    text-anchor="middle" font-weight="700"
    >${escapeXml(mainLine)}</text>

  <!-- サブタイトル -->
  <text
    x="${W / 2}" y="340"
    font-family="${fontFamily}"
    font-size="36" fill="#B45309"
    text-anchor="middle" font-weight="600"
    >${escapeXml(subLine)}</text>

  <!-- 区切り線（中央） -->
  <rect x="400" y="380" width="400" height="2" fill="#FCD34D"/>

  <!-- タグ -->
  <text
    x="${W / 2}" y="428"
    font-family="${fontFamily}"
    font-size="26" fill="#D97706"
    text-anchor="middle" font-weight="500"
    >${escapeXml(tags)}</text>

</svg>`;

const svgBuffer = Buffer.from(svg);
await sharp(svgBuffer).png().toFile(OUTPUT);
console.log('✓ Generated:', OUTPUT);
