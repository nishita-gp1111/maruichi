# 中華そば専門店 まるいち

所沢の中華そば専門店「まるいち」のウェブサイトです。

公開URL：<https://nishita-gp1111.github.io/maruichi/>

## ページ構成

- トップ
- まるいちの味
- お品書き
- まるいちの風景
- 店舗案内

## ローカルで確認

Node.js 22以上を使用します。追加パッケージのインストールは不要です。

```sh
npm run build
npm test
npm run dev
```

<http://localhost:3022/maruichi/> で開きます。公開サイトと同じ `/maruichi/` 配下で確認できます。

## 更新と公開

ページの内容は `scripts/build.mjs`、スタイルと動作は `dist/assets/site.css`・`dist/assets/site.js` にあります。写真は `dist/assets/` に保存しています。

`main` ブランチへプッシュすると、GitHub Actionsがビルド・検証後、`dist/` の内容をGitHub Pagesへ公開します。GitHubの Settings → Pages → Build and deployment → Source は **GitHub Actions** に設定します。

リポジトリのルートやREADMEではなく、`dist/index.html` がサイトのトップとして配信されます。

写真・文章の無断転載はご遠慮ください。
