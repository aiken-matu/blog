/**
 * Hero image generator for 配当日和
 * Design: 1200×630px, #EBF5FF background, centered title in dark blue
 * Usage: node scripts/generate-hero-images.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, '../src/assets');
const CONTENT_DIR = path.join(__dirname, '../src/content/blog');

// 画像生成対象記事：タイトルを見やすく2〜3行に手動分割
const articles = [
  {
    md: 'iDeCoを始めた話——老後に開けるお楽しみボックス.md',
    png: 'ideco-started.png',
    lines: ['iDeCoを始めた話', '老後に開けるお楽しみボックス'],
  },
  {
    md: 'いくら種銭があれば配当金生活できる？具体的な計算.md',
    png: 'how-much-capital-for-dividend-life.png',
    lines: ['いくら種銭があれば', '配当金生活できる？　具体的な計算'],
  },
  {
    md: 'コロナショックで狼狽売りしなかった理由.md',
    png: 'no-panic-sell-corona-shock.png',
    lines: ['コロナショックで', '狼狽売りしなかった理由'],
  },
  {
    md: '公務員の給料と投資の組み合わせ方——仕組み化でほったらかし.md',
    png: 'civil-servant-salary-investing.png',
    lines: ['公務員の給料と投資の組み合わせ方', '仕組み化でほったらかし'],
  },
  {
    md: '公務員は老後安泰？それでも私が60歳で年金をもらうと決めた理由.md',
    png: 'civil-servant-retirement-pension.png',
    lines: ['公務員は老後安泰？', 'それでも私が60歳で', '年金をもらうと決めた理由'],
  },
  {
    md: '公務員投資家の資産形成全体像——3つの役割と1つの公式.md',
    png: 'civil-servant-investor-asset-overview.png',
    lines: ['公務員投資家の資産形成全体像', '3つの役割と1つの公式'],
  },
  {
    md: '増配株の魅力——高配当株は今の利回り、増配株は未来の利回り.md',
    png: 'growing-dividend-stocks-appeal.png',
    lines: ['増配株の魅力', '高配当株は今の利回り、増配株は未来の利回り'],
  },
  {
    md: '家族に投資の話、していますか？信頼で回る家計の作り方.md',
    png: 'family-investment-talk.png',
    lines: ['家族に投資の話、していますか？', '信頼で回る家計の作り方'],
  },
  {
    md: '投資で変わったお金の使い方——物欲が消えた理由.md',
    png: 'money-mindset-changed-investing.png',
    lines: ['投資で変わったお金の使い方', '物欲が消えた理由'],
  },
  {
    md: '投資で変わったお金の使い方｜無駄遣いが減る「価値で選ぶ思考」とは.md',
    png: 'value-based-spending-mindset.png',
    lines: ['投資で変わったお金の使い方', '無駄遣いが減る「価値で選ぶ思考」とは'],
  },
  {
    md: '投資を続けるメンタルの保ち方.md',
    png: 'mental-health-for-investing.png',
    lines: ['投資を続けるメンタルの保ち方'],
  },
  {
    md: '高配当株の銘柄選定——愛せる企業に出会うために.md',
    png: 'high-dividend-stock-selection.png',
    lines: ['高配当株の銘柄選定', '愛せる企業に出会うために'],
  },
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 最長行の文字数からフォントサイズとラインハイトを決定
 * 日本語1文字 ≈ fontSize px幅として計算（1200px中1000px使用想定）
 */
function calcSize(lines) {
  // 全角換算で文字数を計算（ASCII文字は0.5扱い）
  const effectiveLen = (str) =>
    [...str].reduce((acc, ch) => acc + (ch.charCodeAt(0) > 255 ? 1 : 0.5), 0);
  const maxLen = Math.max(...lines.map(effectiveLen));

  if (maxLen <= 13) return { fontSize: 64, lineHeight: 92 };
  if (maxLen <= 17) return { fontSize: 56, lineHeight: 82 };
  if (maxLen <= 21) return { fontSize: 48, lineHeight: 70 };
  return { fontSize: 42, lineHeight: 62 };
}

function createSvg(lines) {
  const W = 1200;
  const H = 630;
  const { fontSize, lineHeight } = calcSize(lines);
  const n = lines.length;

  // テキストブロックの垂直中央寄せ
  // firstY = ベースライン位置（上から何px）
  const blockHeight = (n - 1) * lineHeight + fontSize;
  const firstY = Math.round((H - blockHeight) / 2 + fontSize * 0.82);

  const fontFamily =
    "Hiragino Sans, 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Noto Sans CJK JP', sans-serif";

  const tspans = lines
    .map(
      (line, i) =>
        `<tspan x="${W / 2}" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join('\n      ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">

  <!-- 背景 -->
  <rect width="${W}" height="${H}" fill="#EBF5FF"/>

  <!-- 下部アクセントバー -->
  <rect x="0" y="${H - 18}" width="${W}" height="18" fill="#DBEAFE"/>
  <rect x="0" y="${H - 20}" width="${W}" height="2" fill="#93C5FD"/>

  <!-- 左上：配当日和 -->
  <text
    x="56" y="72"
    font-family="${fontFamily}"
    font-size="28" fill="#93C5FD" font-weight="700"
    letter-spacing="2">配当日和</text>

  <!-- 区切り線 -->
  <rect x="56" y="86" width="96" height="2" fill="#BFDBFE"/>

  <!-- 記事タイトル（中央） -->
  <text
    x="${W / 2}" y="${firstY}"
    font-family="${fontFamily}"
    font-size="${fontSize}" fill="#1D4ED8"
    text-anchor="middle" font-weight="700">
    ${tspans}
  </text>

</svg>`;
}

async function generateAll() {
  let ok = 0;
  let skip = 0;

  for (const article of articles) {
    const outputPath = path.join(ASSETS_DIR, article.png);
    const mdPath = path.join(CONTENT_DIR, article.md);

    // PNG 生成
    const svgBuffer = Buffer.from(createSvg(article.lines));
    await sharp(svgBuffer).png().toFile(outputPath);
    console.log(`✓ Generated: ${article.png}`);

    // frontmatter に heroImage を追加
    let content = fs.readFileSync(mdPath, 'utf-8');
    const pngRef = `../../assets/${article.png}`;

    if (content.includes('heroImage:')) {
      console.log(`  (heroImage already set, skipping md update)`);
      skip++;
    } else {
      // description: の行の直後に挿入
      content = content.replace(
        /^(description:.*)/m,
        `$1\nheroImage: '${pngRef}'`
      );
      fs.writeFileSync(mdPath, content);
      console.log(`  → heroImage set: ${pngRef}`);
      ok++;
    }
  }

  console.log(`\n✅ 完了: ${articles.length}枚生成 / ${ok}件のmdファイル更新 / ${skip}件はスキップ`);
}

generateAll().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
