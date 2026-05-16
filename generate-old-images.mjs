import sharp from '/Users/aikennagano/blog/node_modules/sharp/lib/index.js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const OUT = '/Users/aikennagano/blog/src/assets';

// ── SVG builder ──────────────────────────────────────────────────────────────
function buildSVG({ grad1, grad2, bar, tagColor, tags, title, subtitle, features }) {
  // Split title into lines (max ~18 chars per line for 64px)
  const lines = title;   // already an array of strings

  // Vertical centering for title block
  const lineHeight = 78;
  const titleStartY = subtitle
    ? 220 - (lines.length - 1) * lineHeight / 2 - 20
    : 240 - (lines.length - 1) * lineHeight / 2;

  const titleLines = lines.map((l, i) =>
    `<text x="600" y="${titleStartY + i * lineHeight}" font-family="'Noto Sans JP', 'Hiragino Kaku Gothic Pro', sans-serif" font-size="68" font-weight="900" fill="white" text-anchor="middle" dominant-baseline="middle" letter-spacing="-1">${escXML(l)}</text>`
  ).join('\n    ');

  const subtitleEl = subtitle
    ? `<text x="600" y="${titleStartY + lines.length * lineHeight + 8}" font-family="'Noto Sans JP', 'Hiragino Kaku Gothic Pro', sans-serif" font-size="30" font-weight="500" fill="rgba(255,255,255,0.82)" text-anchor="middle" dominant-baseline="middle">${escXML(subtitle)}</text>`
    : '';

  // Tags row (centered)
  const tagW = 170;
  const tagGap = 14;
  const tagH = 36;
  const totalTagW = tags.length * tagW + (tags.length - 1) * tagGap;
  const tagStartX = (1200 - totalTagW) / 2;
  const tagsEl = tags.map((t, i) => {
    const tx = tagStartX + i * (tagW + tagGap);
    return `<rect x="${tx}" y="100" width="${tagW}" height="${tagH}" rx="18" fill="${tagColor}" opacity="0.85"/>
    <text x="${tx + tagW/2}" y="118" font-family="'Noto Sans JP', 'Hiragino Kaku Gothic Pro', sans-serif" font-size="17" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${escXML(t)}</text>`;
  }).join('\n    ');

  // Features bottom row
  const featW = 220;
  const featGap = 24;
  const totalFeatW = features.length * featW + (features.length - 1) * featGap;
  const featStartX = (1200 - totalFeatW) / 2;
  const featuresEl = features.map((f, i) => {
    const fx = featStartX + i * (featW + featGap);
    return `<rect x="${fx}" y="540" width="${featW}" height="44" rx="8" fill="rgba(255,255,255,0.12)"/>
    <text x="${fx + featW/2}" y="562" font-family="'Noto Sans JP', 'Hiragino Kaku Gothic Pro', sans-serif" font-size="18" font-weight="600" fill="rgba(255,255,255,0.9)" text-anchor="middle" dominant-baseline="middle">${escXML(f)}</text>`;
  }).join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${grad1}"/>
      <stop offset="100%" style="stop-color:${grad2}"/>
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(0,0,0,0.08)"/>
      <stop offset="100%" style="stop-color:rgba(0,0,0,0.30)"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#overlay)"/>
  <!-- Left accent bar -->
  <rect x="0" y="0" width="10" height="630" fill="${bar}"/>
  <!-- Top right subtle circle -->
  <circle cx="1080" cy="80" r="200" fill="rgba(255,255,255,0.04)"/>
  <circle cx="1150" cy="550" r="120" fill="rgba(255,255,255,0.03)"/>
  <!-- Blog label -->
  <text x="36" y="52" font-family="'Noto Sans JP', 'Hiragino Kaku Gothic Pro', sans-serif" font-size="22" font-weight="700" fill="rgba(255,255,255,0.70)" letter-spacing="3">配当日和</text>
  <!-- Tags -->
  ${tagsEl}
  <!-- Title -->
  ${titleLines}
  <!-- Subtitle -->
  ${subtitleEl}
  <!-- Divider -->
  <line x1="80" y1="510" x2="1120" y2="510" stroke="rgba(255,255,255,0.20)" stroke-width="1"/>
  <!-- Features -->
  ${featuresEl}
</svg>`;
}

function escXML(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function gen(filename, opts) {
  const svg = buildSVG(opts);
  const buf = Buffer.from(svg);
  const outPath = resolve(OUT, filename);
  await sharp(buf).png().toFile(outPath);
  console.log(`✅ ${filename}`);
}

// ── Image definitions ────────────────────────────────────────────────────────

const images = [

  // 1. NISAで高配当株を買う方法 ── Blue: 900→800/500
  { file: 'how-to-buy-high-dividend-stocks-with-nisa.png',
    grad1: '#1E40AF', grad2: '#3B82F6', bar: '#93C5FD', tagColor: '#2563EB',
    tags: ['NISA', '高配当株', '投資入門'],
    title: ['NISAで高配当株を', '買う方法'],
    subtitle: '成長投資枠を活かして配当金を非課税で受け取る',
    features: ['非課税メリット', '成長投資枠', '分散投資'] },

  // 2. 証券口座の開き方 ── Blue: 900→800/500
  { file: 'how-to-open-brokerage-account-sbi-rakuten.png',
    grad1: '#1E40AF', grad2: '#3B82F6', bar: '#BFDBFE', tagColor: '#2563EB',
    tags: ['証券口座', 'SBI証券', '楽天証券'],
    title: ['証券口座の開き方', '【SBI・楽天比較】'],
    subtitle: null,
    features: ['口座開設手順', '単元未満株', 'NISA対応'] },

  // 3. 月1万円から始める積立投資 ── Emerald: 900→700/500
  { file: 'how-to-start-monthly-investing-10000-yen.png',
    grad1: '#047857', grad2: '#10B981', bar: '#6EE7B7', tagColor: '#059669',
    tags: ['積立投資', 'インデックス', '少額投資'],
    title: ['月1万円から', '始める積立投資'],
    subtitle: '続けることが、一番の戦略',
    features: ['自動積立', '複利効果', '長期投資'] },

  // 4. なぜ公務員の私が投資を始めたか ── Indigo: 900→800/500
  { file: 'why-i-started-investing.png',
    grad1: '#3730A3', grad2: '#6366F1', bar: '#A5B4FC', tagColor: '#4F46E5',
    tags: ['公務員', '投資のきっかけ', '資産形成'],
    title: ['なぜ公務員の私が', '投資を始めたか'],
    subtitle: '安定の中にあった、静かな不安',
    features: ['安定収入', '副収入の必要性', '不安の正体'] },

  // 5. 投資が怖いと思っていたあの頃の私へ ── Purple: 900→800/500
  { file: 'to-my-past-self-who-feared-investing.png',
    grad1: '#6D28D9', grad2: '#A855F7', bar: '#D8B4FE', tagColor: '#7C3AED',
    tags: ['投資入門', '投資の怖さ', 'マインド'],
    title: ['投資が怖いと', '思っていた', 'あの頃の私へ'],
    subtitle: null,
    features: ['最初の一歩', '少額から始める', '継続が力'] },

  // 6. セクター分散とは ── Teal: 900→700/400
  { file: 'what-is-sector-diversification-for-dividend-investing.png',
    grad1: '#0F766E', grad2: '#2DD4BF', bar: '#99F6E4', tagColor: '#0D9488',
    tags: ['セクター分散', '高配当株', 'リスク管理'],
    title: ['セクター分散とは？'],
    subtitle: '高配当株投資で失敗しないための考え方',
    features: ['業種分散', 'ディフェンシブ重視', 'リスク軽減'] },

  // 7. 投資を続けるメンタルの保ち方 ── Indigo: 950→800/500
  { file: 'mental-health-for-investing.png',
    grad1: '#3730A3', grad2: '#6366F1', bar: '#C7D2FE', tagColor: '#4F46E5',
    tags: ['投資メンタル', '長期投資', '心理管理'],
    title: ['投資を続ける', 'メンタルの保ち方'],
    subtitle: '暴落に揺れない、自分なりの軸の作り方',
    features: ['暴落対策', '継続力', '感情コントロール'] },

  // 8. 増配株の魅力 ── Amber: 900→800/400
  { file: 'growing-dividend-stocks-appeal.png',
    grad1: '#92400E', grad2: '#F59E0B', bar: '#FDE68A', tagColor: '#D97706',
    tags: ['増配株', '高配当株', '長期投資'],
    title: ['増配株の魅力'],
    subtitle: '高配当株は今の利回り、増配株は未来の利回り',
    features: ['連続増配', '複利効果', '10年後の利回り'] },

  // 9. コロナショックで狼狽売りしなかった理由 ── Navy: 極暗→900/600
  { file: 'no-panic-sell-corona-shock.png',
    grad1: '#1E3A8A', grad2: '#2563EB', bar: '#93C5FD', tagColor: '#3B82F6',
    tags: ['コロナショック', '暴落対応', 'メンタル'],
    title: ['コロナショックで', '狼狽売りしなかった', '理由'],
    subtitle: null,
    features: ['暴落耐性', '長期視点', '配当継続'] },

  // 10. iDeCoを始めた話 ── Emerald: 900→800/500
  { file: 'ideco-started.png',
    grad1: '#065F46', grad2: '#10B981', bar: '#A7F3D0', tagColor: '#059669',
    tags: ['iDeCo', '老後資金', '節税'],
    title: ['iDeCoを始めた話'],
    subtitle: '老後に開けるお楽しみボックス',
    features: ['所得控除', '60歳受取', '公務員向け'] },

  // 11. いくら種銭があれば配当金生活できる？ ── Green: 900→800/500
  { file: 'how-much-capital-for-dividend-life.png',
    grad1: '#166534', grad2: '#22C55E', bar: '#BBF7D0', tagColor: '#16A34A',
    tags: ['配当金生活', 'FIRE', '資産計算'],
    title: ['いくら種銭があれば', '配当金生活できる？'],
    subtitle: '具体的な計算で逆算する',
    features: ['利回り4%目安', '必要元本を計算', '配当再投資'] },

  // 12. 家族に投資の話 ── Fuchsia: 極暗→800/500
  { file: 'family-investment-talk.png',
    grad1: '#86198F', grad2: '#D946EF', bar: '#F0ABFC', tagColor: '#C026D3',
    tags: ['家族', '家計管理', '投資コミュニケーション'],
    title: ['家族に投資の話、', 'していますか？'],
    subtitle: '信頼で回る家計の作り方',
    features: ['夫婦で共有', '信頼関係', '家計の仕組み化'] },

  // 13. 高配当株の銘柄選定 ── Blue: 900→800/500
  { file: 'high-dividend-stock-selection.png',
    grad1: '#1E40AF', grad2: '#3B82F6', bar: '#BFDBFE', tagColor: '#2563EB',
    tags: ['銘柄選定', '高配当株', '投資基準'],
    title: ['高配当株の銘柄選定'],
    subtitle: '愛せる企業に出会うために',
    features: ['利回り3%以上', 'EPS長期安定', '長期保有前提'] },

  // 14. 公務員投資家の資産形成全体像 ── Blue: 900→800/500
  { file: 'civil-servant-investor-asset-overview.png',
    grad1: '#1E40AF', grad2: '#3B82F6', bar: '#DBEAFE', tagColor: '#2563EB',
    tags: ['公務員', '資産形成', '全体戦略'],
    title: ['公務員投資家の', '資産形成全体像'],
    subtitle: '3つの役割と1つの公式',
    features: ['iDeCo', 'NISA', '高配当株'] },

  // 15. 投資で変わったお金の使い方（価値で選ぶ思考） ── Indigo→Violet: 900→800/500
  { file: 'value-based-spending-mindset.png',
    grad1: '#3730A3', grad2: '#8B5CF6', bar: '#DDD6FE', tagColor: '#6D28D9',
    tags: ['マネーマインド', '支出管理', '価値観'],
    title: ['投資で変わった', 'お金の使い方'],
    subtitle: '価値で選ぶ思考とは',
    features: ['無駄遣いが減る', '価値基準の変化', '豊かさの再定義'] },

  // 16. 投資で変わったお金の使い方（物欲が消えた） ── Purple: 900→800/500
  { file: 'money-mindset-changed-investing.png',
    grad1: '#6D28D9', grad2: '#A855F7', bar: '#E9D5FF', tagColor: '#7C3AED',
    tags: ['マネーマインド', '物欲', '価値観の変化'],
    title: ['投資で変わった', 'お金の使い方'],
    subtitle: '物欲が消えた理由',
    features: ['物欲の変化', '満足感の正体', '豊かな暮らし'] },

  // 17. 公務員の給料と投資の組み合わせ方 ── Sky: 極暗→700/500
  { file: 'civil-servant-salary-investing.png',
    grad1: '#0369A1', grad2: '#0EA5E9', bar: '#BAE6FD', tagColor: '#0284C7',
    tags: ['公務員', '給料管理', '仕組み化'],
    title: ['公務員の給料と', '投資の組み合わせ方'],
    subtitle: '仕組み化でほったらかし',
    features: ['自動化設計', '積立ルール', 'ほったらかし投資'] },

  // 18. 公務員は老後安泰？ ── Teal: 900→700/400
  { file: 'civil-servant-retirement-pension.png',
    grad1: '#0F766E', grad2: '#2DD4BF', bar: '#CCFBF1', tagColor: '#0D9488',
    tags: ['公務員', '老後', '年金'],
    title: ['公務員は老後安泰？'],
    subtitle: '私が60歳で年金をもらうと決めた理由',
    features: ['年金の選択', '老後資金計算', '早期受取の判断'] },

];

// ── Run ──────────────────────────────────────────────────────────────────────
for (const img of images) {
  await gen(img.file, img);
}
console.log('\n🎉 全画像の生成完了');
