## 配当日和（haitobiyori.com）作業ルール

### 基本スタック
- Astro + GitHub + Cloudflare Pages
- 記事はsrc/content/blog/配下に.mdxで作成

### frontmatterルール
- title / pubDate / description / category / heroImage を必ず設定
- tagsは書かない
- slugは英語で設定

### カテゴリ
- dividend：高配当株・配当投資
- start：投資の始め方
- money：お金の管理
- mindset：投資マインド・公務員

### ヒーロー画像ルール
- サイズ：1200×630px
- テキスト左右余白：150px以上（必ず守ること・120pxでは切れる）
- 右下に小さく「配当日和」

### カラーコーディング
- ティール：銘柄分析
- インディゴ：マインド・市場解説
- エメラルド：iDeCo・積立・初心者
- ブルー：NISA・証券口座
- グリーン：目標計算・シミュレーション
- オレンジブラウン：警告・失敗・見直し
- レッド：楽天系
- スカイブルー：仕組み化・自動化

### 記事本文ルール
- 保有銘柄は冒頭に「📝 開示」を記載
- 未保有銘柄は「参考情報として」と明記
- 配当利回り基準は税引前3.75%・税引後約3%で統一
- アフィリリンクはtarget="_blank" rel="nofollow noreferrer"を必ず設定
- 本文冒頭にタイトルと同じ見出しを入れない（frontmatterと重複するため）

### 作業完了時
git add → git commit -m "メッセージ" → git push
（この順番を必ず守ること）
