# PLAYER_IMAGES.md

プレイヤー(プロ選手・配信者・VTuber・YouTuber)の画像を追加・更新する際の手順をまとめたドキュメントです。

---

## 画像ファイルの配置場所

```
assets/images/players/{選手ID}.png
```

- ファイル名は、選手データの`id`フィールドと**完全に一致**させること(大文字小文字も含む)
- 拡張子は`.png`に統一する(既存ファイルとの一貫性のため)
- 直下の`players/`ディレクトリは、`assets/images/players/`と同内容を持つ未使用のレガシーディレクトリです。**新しい画像はここには置かず、`assets/images/players/`にのみ追加してください**(詳細は`docs/TECH_DEBT.md`を参照)

## 選手データ側の設定箇所

選手の種類によって、以下のいずれかのファイルに定義されています。

| 選手の種類 | ファイル |
|---|---|
| プロ選手 | `assets/js/pro.js` |
| 配信者(ストリーマー) | `assets/js/streamer.js` |
| VTuber | `assets/js/vtuber.js` |
| YouTuber | `assets/js/youtuber.js` |

該当する選手のオブジェクト内にある`image`フィールドに、配置したファイルのパスを設定してください。

```js
tokido:{
    id:"tokido",
    name:"ときど",
    ...
    image:"assets/images/players/tokido.png",
    ...
}
```

`image`フィールドが空文字(`""`)の場合、一覧・詳細ページでは自動的に**名前の頭文字を使ったアバター表示**にフォールバックします(コードの変更は不要です)。

## 手順まとめ

1. 画像ファイルを`{選手ID}.png`という名前にして`assets/images/players/`に配置する
2. 該当選手が定義されているファイル(pro.js / streamer.js / vtuber.js / youtuber.js)を開き、`image`フィールドに`"assets/images/players/{選手ID}.png"`を設定する
3. `pro-player.html`の詳細ページを別途持つ選手(現状6名。`assets/js/pro-player-directory.js`を参照)の場合は、そちらの`image`フィールドも同様に設定する
4. ブラウザで一覧ページ(players.html)・詳細ページ(player.html)を開き、画像が正しく表示されることを確認する

## 画像が用意できない選手について

画像が無い選手は、そのまま`image:""`のままで問題ありません。一覧・詳細どちらのページでも、名前の頭文字を使ったアバター表示に自動的に切り替わります(`related-avatar-fallback` / `avatar-fallback-img` / `pro-player-photo-fallback`)。この仕組みにより、**画像の有無に関わらずレイアウトが崩れることはありません**。

## 表示サイズについて

画像の縦横比がバラバラでも、以下のCSSにより表示サイズは自動的に統一されます(新しい画像を追加する際、個別の調整は不要です)。

| 表示箇所 | サイズ | 形状 |
|---|---|---|
| 選手一覧(players.html) | 100×100px | 円形 |
| 選手詳細(player.html) | 420×420px | 角丸正方形 |
| 診断結果のおすすめ選手(result.html) | 100×100px | 円形 |

いずれも`object-fit:cover`を使用しているため、正方形以外の画像をアップロードしても、中央部分を優先してトリミング表示されます。極端に縦長・横長な画像は、被写体が見切れる可能性があるため、可能であれば正方形に近いトリミング済み画像を用意することを推奨します。

---

## 関連ドキュメント

- [TECH_DEBT.md](./TECH_DEBT.md) — 未使用のレガシー`players/`ディレクトリについて
- [DATA_ISSUES.md](./DATA_ISSUES.md) — 選手データの参照切れの管理
