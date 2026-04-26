# 配当日和 — haitobiyori.com

公務員投資家トニー（@haitobiyori）が運営する高配当株投資ブログ。

---

## サイト概要

| 項目 | 内容 |
|---|---|
| URL | https://haitobiyori.com |
| フレームワーク | Astro v5 |
| ホスティング | Cloudflare Workers |
| デプロイ | git push → Cloudflare 自動ビルド |
| Xアカウント | @haitobiyori（こうむいん投資家トニー） |

---

## 記事状況

- 実記事：28本
- 全記事に内部リンク設置済み（孤立記事ゼロ）
- OGP設定済み（og:image / og:image:width / og:image:height / twitter:card）
- 英語slug設定済み記事あり

---

## よく使うコマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | ローカル開発サーバー起動（localhost:4321） |
| `npm run build` | 本番用ビルド（./dist/ に出力） |
| `node generate-all-images.mjs` | 全アイキャッチ画像（34枚）を再生成 |

---

## 重要ファイル

| ファイル | 役割 |
|---|---|
| `src/content/blog/` | 記事Markdownファイル |
| `src/assets/` | アイキャッチ画像（1200×630px PNG） |
| `generate-all-images.mjs` | 画像一括生成スクリプト |
| `src/components/BaseHead.astro` | OGP・メタタグ管理 |
| `src/layouts/BlogPost.astro` | 記事ページレイアウト |
| `src/pages/index.astro` | トップページ |
| `src/pages/blog/index.astro` | 記事一覧ページ |
| `astro.config.mjs` | Astro設定（site: https://haitobiyori.com） |

---

## 残タスク（アフィリエイトURL）

以下のプレースホルダーはURLが確定次第差し替える：

| ファイル | プレースホルダー |
|---|---|
| dividend-stock-first-step.md | [LINK_SBI証券] |
| index-fund-start-guide.md | [LINK_SBI証券] [LINK_楽天証券] |
| investment-fund-creation.md | [LINK_SBI証券] |
| rakuten-bank-guide.md | [LINK_楽天銀行] |
| iDeCoとNISAどちらを先にやるべきか.md | 松井証券iDeCo アフィリエイトリンク |
