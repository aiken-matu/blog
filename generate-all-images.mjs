import sharp from '/Users/aikennagano/blog/node_modules/sharp/lib/index.js';
import { resolve } from 'path';

const OUT = '/Users/aikennagano/blog/src/assets';

function escXML(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildSVG({ grad1, grad2, bar, tagColor, titleColor, tags, title, subtitle, features }) {
  const lines = title;
  const lineHeight = 76;
  // テキスト全体をカード中央寄りに配置（旧: 220-240 → 新: 330-345）
  const titleStartY = subtitle
    ? 330 - ((lines.length - 1) * lineHeight) / 2
    : 345 - ((lines.length - 1) * lineHeight) / 2;

  const titleLines = lines.map((l, i) =>
    `<text x="600" y="${titleStartY + i * lineHeight}" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="68" font-weight="900" fill="${titleColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="-1">${escXML(l)}</text>`
  ).join('\n    ');

  // サブタイトルの間隔を76+6=82px→54pxに縮小してタイトルとの一体感を高める
  const subtitleEl = subtitle
    ? `<text x="600" y="${titleStartY + (lines.length - 1) * lineHeight + 54}" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="28" font-weight="500" fill="${titleColor}" opacity="0.68" text-anchor="middle" dominant-baseline="middle">${escXML(subtitle)}</text>`
    : '';

  const tagW = 170, tagGap = 14, tagH = 36;
  const totalTagW = tags.length * tagW + (tags.length - 1) * tagGap;
  const tagStartX = (1200 - totalTagW) / 2;
  const tagsEl = tags.map((t, i) => {
    const tx = tagStartX + i * (tagW + tagGap);
    return `<rect x="${tx}" y="100" width="${tagW}" height="${tagH}" rx="18" fill="${tagColor}"/>
    <text x="${tx + tagW/2}" y="118" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="17" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${escXML(t)}</text>`;
  }).join('\n    ');

  const featCount = features.length;
  const featW  = featCount >= 4 ? 210 : 220;
  const featGap2 = featCount >= 4 ?  16 :  24;
  const totalFeatW = featCount * featW + (featCount - 1) * featGap2;
  const featStartX = (1200 - totalFeatW) / 2;
  const featuresEl = features.map((f, i) => {
    const fx = featStartX + i * (featW + featGap2);
    return `<rect x="${fx}" y="540" width="${featW}" height="44" rx="8" fill="rgba(0,0,0,0.07)"/>
    <text x="${fx + featW/2}" y="562" font-family="'Noto Sans JP','Hiragino Kaku Gothic Pro',sans-serif" font-size="18" font-weight="600" fill="${titleColor}" opacity="0.80" text-anchor="middle" dominant-baseline="middle">${escXML(f)}</text>`;
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

async function gen(filename, opts) {
  const svg = buildSVG(opts);
  await sharp(Buffer.from(svg)).png().toFile(resolve(OUT, filename));
  console.log(`✅ ${filename}`);
}

// ── Pastel color presets ─────────────────────────────────────────────────────
// grad1=Tailwind-100（淡い起点）, grad2=Tailwind-300（鮮やかな終点）で彩度アップ
// bar=Tailwind-500で視認性を確保
const P = {
  blue:          { grad1:'#DBEAFE', grad2:'#93C5FD', bar:'#3B82F6', tagColor:'#1D4ED8', titleColor:'#1E3A8A' },
  blueTeal:      { grad1:'#DBEAFE', grad2:'#99F6E4', bar:'#14B8A6', tagColor:'#0F766E', titleColor:'#1E3A8A' },
  sky:           { grad1:'#E0F2FE', grad2:'#7DD3FC', bar:'#0EA5E9', tagColor:'#0369A1', titleColor:'#0C4A6E' },
  emerald:       { grad1:'#ECFDF5', grad2:'#6EE7B7', bar:'#10B981', tagColor:'#047857', titleColor:'#064E3B' },
  green:         { grad1:'#F0FDF4', grad2:'#BBF7D0', bar:'#22C55E', tagColor:'#15803D', titleColor:'#14532D' },
  teal:          { grad1:'#F0FDFA', grad2:'#99F6E4', bar:'#14B8A6', tagColor:'#0F766E', titleColor:'#134E4A' },
  indigo:        { grad1:'#EEF2FF', grad2:'#C7D2FE', bar:'#6366F1', tagColor:'#4338CA', titleColor:'#312E81' },
  indigoEmerald: { grad1:'#EEF2FF', grad2:'#A7F3D0', bar:'#6366F1', tagColor:'#4338CA', titleColor:'#312E81' },
  purple:        { grad1:'#FAF5FF', grad2:'#DDD6FE', bar:'#A855F7', tagColor:'#7E22CE', titleColor:'#4C1D95' },
  fuchsia:       { grad1:'#FDF4FF', grad2:'#F5D0FE', bar:'#D946EF', tagColor:'#A21CAF', titleColor:'#701A75' },
  amber:         { grad1:'#FFFBEB', grad2:'#FDE68A', bar:'#F59E0B', tagColor:'#B45309', titleColor:'#78350F' },
  red:           { grad1:'#FFF1F2', grad2:'#FECDD3', bar:'#F43F5E', tagColor:'#BE123C', titleColor:'#881337' },
  orangeBrown:   { grad1:'#FFF7ED', grad2:'#FED7AA', bar:'#F97316', tagColor:'#C2410C', titleColor:'#7C2D12' },
  slate:         { grad1:'#F1F5F9', grad2:'#CBD5E1', bar:'#64748B', tagColor:'#334155', titleColor:'#0F172A' },
};

// ── Image definitions (全33枚) ──────────────────────────────────────────────

const images = [

  // ── BLUE ────────────────────────────────────────────────────────────────
  { file: 'how-to-buy-high-dividend-stocks-with-nisa.png', ...P.blue,
    tags: ['NISA', '高配当株', '投資入門'],
    title: ['NISAで高配当株を', '買う方法'],
    subtitle: '成長投資枠を活かして配当金を非課税で受け取る',
    features: ['非課税メリット', '成長投資枠', '分散投資'] },

  { file: 'how-to-open-brokerage-account-sbi-rakuten.png', ...P.blue,
    tags: ['証券口座', 'SBI証券', '楽天証券'],
    title: ['証券口座の開き方', '【SBI・楽天比較】'],
    subtitle: null,
    features: ['口座開設手順', '単元未満株', 'NISA対応'] },

  { file: 'high-dividend-stock-selection.png', ...P.blue,
    tags: ['銘柄選定', '高配当株', '投資基準'],
    title: ['高配当株の銘柄選定'],
    subtitle: '愛せる企業に出会うために',
    features: ['利回り3%以上', 'EPS長期安定', '長期保有前提'] },

  { file: 'civil-servant-investor-asset-overview.png', ...P.blue,
    tags: ['公務員', '資産形成', '全体戦略'],
    title: ['公務員投資家の', '資産形成全体像'],
    subtitle: '3つの役割と1つの公式',
    features: ['iDeCo', 'NISA', '高配当株'] },

  { file: 'sbi-securities-account-open.png', ...P.blue,
    tags: ['SBI証券', '口座開設', '高配当株'],
    title: ['SBI証券で口座を', '開設した理由'],
    subtitle: '高配当株投資を始めたい公務員の選び方',
    features: ['単元未満株', 'S株無料', 'NISA口座'] },

  { file: 'nisa-dividend-road.png', ...P.blue,
    tags: ['NISA', '高配当株', '配当金'],
    title: ['資産は増えているのに', '生活が豊かにならない'],
    subtitle: '高配当株投資で年90万円の配当金を得るまで',
    features: ['2年半の記録', '税引後90万円', '正直な話'] },

  // ── BLUE × TEAL ─────────────────────────────────────────────────────────
  { file: 'dividend-stock-first-step.png', ...P.blueTeal,
    tags: ['高配当株', '投資入門', '始め方'],
    title: ['インデックス投資だけでは', '物足りなくなったら'],
    subtitle: '高配当株投資の始め方',
    features: ['最初の1株', 'セクター分散', '銘柄選定'] },

  { file: 'index-fund-start-guide.png', ...P.blueTeal,
    tags: ['積立投資', 'NISA', '投資入門'],
    title: ['「今すぐ始めていい」', '積立投資を始めるのに', 'いいタイミングはない'],
    subtitle: null,
    features: ['タイミング不要', '暴落はチャンス', '今日設定する'] },

  { file: 'portfolio-design.png', ...P.blueTeal,
    tags: ['ポートフォリオ', 'セクター分散', '高配当株'],
    title: ['100銘柄以上持つ理由'],
    subtitle: 'お気に入り銘柄なんてない、それが分散投資の本質',
    features: ['100銘柄以上保有', '30業種以上に分散', '安定配当の設計'] },

  // ── SKY BLUE ─────────────────────────────────────────────────────────────
  { file: 'civil-servant-salary-investing.png', ...P.sky,
    tags: ['公務員', '給料管理', '仕組み化'],
    title: ['公務員の給料と', '投資の組み合わせ方'],
    subtitle: '仕組み化でほったらかし',
    features: ['自動化設計', '積立ルール', 'ほったらかし投資'] },

  { file: 'dneobank-sbi-review.png', ...P.sky,
    tags: ['dNEOBANK', 'SBI証券', '仕組み化'],
    title: ['dNEOBANKを', 'SBI証券と一緒に使う理由'],
    subtitle: '公務員の資産管理術',
    features: ['自動入金設定', '目的別口座', 'スマホATM'] },

  // ── EMERALD ──────────────────────────────────────────────────────────────
  { file: 'how-to-start-monthly-investing-10000-yen.png', ...P.emerald,
    tags: ['積立投資', 'インデックス', '少額投資'],
    title: ['月1万円から', '始める積立投資'],
    subtitle: '続けることが、一番の戦略',
    features: ['自動積立', '複利効果', '長期投資'] },

  { file: 'ideco-started.png', ...P.emerald,
    tags: ['iDeCo', '老後資金', '節税'],
    title: ['iDeCoを始めた話'],
    subtitle: '老後に開けるお楽しみボックス',
    features: ['所得控除', '60歳受取', '公務員向け'] },

  { file: 'ideco-performance-report.png', ...P.emerald,
    tags: ['iDeCo', '運用実績', '老後資金'],
    title: ['iDeCo運用実績を公開'],
    subtitle: '8年間で投資額が2倍以上になった話',
    features: ['累計+149万円', '利回り19.29%', '8年間の記録'] },

  { file: 'investment-fund-creation.png', ...P.emerald,
    tags: ['家計見直し', '投資資金', '保険・通信費'],
    title: ['月6万円の投資資金を', '作った方法'],
    subtitle: '保険と通信費を見直すだけでいい',
    features: ['保険解約', '格安SIM乗換え', '年間80万円の原資'] },

  { file: 'matsui-ideco-guide.png', ...P.emerald,
    tags: ['松井証券', 'iDeCo', '公務員'],
    title: ['松井証券iDeCoの特徴', '公務員におすすめの理由'],
    subtitle: '手数料0円・40種類・ポイント還元',
    features: ['運営管理費0円', '40種類の商品', 'ポイント還元'] },

  // ── GREEN ────────────────────────────────────────────────────────────────
  { file: 'how-much-capital-for-dividend-life.png', ...P.green,
    tags: ['配当金生活', 'FIRE', '資産計算'],
    title: ['いくら種銭があれば', '配当金生活できる？'],
    subtitle: '具体的な計算で逆算する',
    features: ['利回り4%目安', '必要元本を計算', '配当再投資'] },

  // ── TEAL ─────────────────────────────────────────────────────────────────
  { file: 'what-is-sector-diversification-for-dividend-investing.png', ...P.teal,
    tags: ['セクター分散', '高配当株', 'リスク管理'],
    title: ['セクター分散とは？'],
    subtitle: '高配当株投資で失敗しないための考え方',
    features: ['業種分散', 'ディフェンシブ重視', 'リスク軽減'] },

  { file: 'civil-servant-retirement-pension.png', ...P.teal,
    tags: ['公務員', '老後', '年金'],
    title: ['公務員は老後安泰？'],
    subtitle: '私が60歳で年金をもらうと決めた理由',
    features: ['年金の選択', '老後資金計算', '早期受取の判断'] },

  // ── INDIGO ───────────────────────────────────────────────────────────────
  { file: 'why-i-started-investing.png', ...P.indigo,
    tags: ['公務員', '投資のきっかけ', '資産形成'],
    title: ['なぜ公務員の私が', '投資を始めたか'],
    subtitle: '安定の中にあった、静かな不安',
    features: ['安定収入', '副収入の必要性', '不安の正体'] },

  { file: 'mental-health-for-investing.png', ...P.indigo,
    tags: ['投資メンタル', '長期投資', '心理管理'],
    title: ['投資を続ける', 'メンタルの保ち方'],
    subtitle: '暴落に揺れない、自分なりの軸の作り方',
    features: ['暴落対策', '継続力', '感情コントロール'] },

  { file: 'value-based-spending-mindset.png', ...P.indigo,
    tags: ['マネーマインド', '支出管理', '価値観'],
    title: ['投資で変わった', 'お金の使い方'],
    subtitle: '価値で選ぶ思考とは',
    features: ['無駄遣いが減る', '価値基準の変化', '豊かさの再定義'] },

  // ── INDIGO × EMERALD ─────────────────────────────────────────────────────
  { file: 'ideco-vs-nisa-koumuin.png', ...P.indigoEmerald,
    tags: ['iDeCo', 'NISA', '公務員'],
    title: ['iDeCo vs NISA'],
    subtitle: '公務員はどちらを先にやるべきか',
    features: ['節税効果の比較', '公務員の正解', '順番の考え方'] },

  // ── PURPLE ───────────────────────────────────────────────────────────────
  { file: 'to-my-past-self-who-feared-investing.png', ...P.purple,
    tags: ['投資入門', '投資の怖さ', 'マインド'],
    title: ['投資が怖いと', '思っていた', 'あの頃の私へ'],
    subtitle: null,
    features: ['最初の一歩', '少額から始める', '継続が力'] },

  { file: 'money-mindset-changed-investing.png', ...P.purple,
    tags: ['マネーマインド', '物欲', '価値観の変化'],
    title: ['投資で変わった', 'お金の使い方'],
    subtitle: '物欲が消えた理由',
    features: ['物欲の変化', '満足感の正体', '豊かな暮らし'] },

  // ── FUCHSIA ──────────────────────────────────────────────────────────────
  { file: 'family-investment-talk.png', ...P.fuchsia,
    tags: ['家族', '家計管理', '投資コミュニケーション'],
    title: ['家族に投資の話、', 'していますか？'],
    subtitle: '信頼で回る家計の作り方',
    features: ['夫婦で共有', '信頼関係', '家計の仕組み化'] },

  // ── AMBER ────────────────────────────────────────────────────────────────
  { file: 'growing-dividend-stocks-appeal.png', ...P.amber,
    tags: ['増配株', '高配当株', '長期投資'],
    title: ['増配株の魅力'],
    subtitle: '高配当株は今の利回り、増配株は未来の利回り',
    features: ['連続増配', '複利効果', '10年後の利回り'] },

  { file: 'smbc-gold-nl-100man.png', ...P.amber,
    tags: ['三井住友ゴールドNL', '100万円修行', 'クレカ'],
    title: ['三井住友ゴールドNL', '100万円修行の記録'],
    subtitle: '固定費集約で年会費永年無料を達成する方法',
    features: ['固定費集約', '年会費0円', '10,000ポイント'] },

  { file: 'smbc-gold-nl-10000points.png', ...P.amber,
    tags: ['三井住友ゴールドNL', 'ポイント', 'クレカ活用'],
    title: ['毎年10,000ポイント', '確実にもらう方法'],
    subtitle: '三井住友ゴールドカードNL・公務員の場合',
    features: ['100万円達成', '年会費永年無料', '固定費で自然達成'] },

  // ── RED ──────────────────────────────────────────────────────────────────
  { file: 'rakuten-card-diamond.png', ...P.red,
    tags: ['楽天カード', 'ポイント', 'クレカ活用'],
    title: ['楽天カードを', '使い続ける理由'],
    subtitle: '通算62万ポイント獲得・公務員の実体験',
    features: ['還元率1%', 'ダイヤモンド会員', 'ポイント活用'] },

  { file: 'rakuten-bank-guide.png', ...P.red,
    tags: ['楽天銀行', '仕組み化', '資産形成'],
    title: ['楽天銀行を給与受取口座に', 'した理由'],
    subtitle: '投資と生活費が自動で回る仕組みの作り方',
    features: ['マネーブリッジ', '給与受取口座', 'ほったらかし投資'] },

  // ── ORANGE BROWN ─────────────────────────────────────────────────────────
  { file: 'insurance-review-guide.png', ...P.orangeBrown,
    tags: ['保険見直し', '貯蓄型保険', '投資資金'],
    title: ['貯蓄型保険を解約した話'],
    subtitle: '担当者に言われた3つの呪縛を乗り越えるまで',
    features: ['解約の手順', '3つの呪縛を解く', '月5万円が浮いた'] },

  // ── SLATE ────────────────────────────────────────────────────────────────
  { file: 'no-panic-sell-corona-shock.png', ...P.slate,
    tags: ['コロナショック', '暴落対応', 'メンタル'],
    title: ['コロナショックで', '狼狽売りしなかった', '理由'],
    subtitle: null,
    features: ['暴落耐性', '長期視点', '配当継続'] },

  // ── TEAL（銘柄分析：NTT決算チェックポイント）─────────────────────────────
  { file: 'ntt-earnings-checklist.png', ...P.teal,
    tags: ['銘柄分析', 'NTT', '決算'],
    title: ['【銘柄分析】NTT', '決算で何を見るべき？', '初心者向けチェックポイント'],
    subtitle: null,
    features: ['利益の伸び', '事業の中身', '配当の継続性', '財務リスク'] },

  // ── SITE TOP PAGE OGP ────────────────────────────────────────────────────
  { file: 'og-site.png', ...P.blue,
    tags: ['公務員投資家', '高配当株', '資産形成'],
    title: ['配当日和'],
    subtitle: 'お金も私も働く、公務員の小さな自由計画',
    features: ['高配当株', 'iDeCo・NISA', '家計改善', '長期投資'] },

];

// ── Run ──────────────────────────────────────────────────────────────────────
for (const img of images) {
  await gen(img.file, img);
}
console.log(`\n🎉 全${images.length}枚の生成完了`);
