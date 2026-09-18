# Capture / Clip File Naming

## ユーザーが渡す原本

`{character_slug}_{category}_{capture_date}_take{NN}.mp4`

例: `jp_normals_20260919_take01.mp4`、`ryu_super_arts_20260919_take02.mp4`。

## Work側の技単位ファイル

`{character_slug}_{category}_{move_slug}_{variant}_r{NN}.{ext}`

例: `ryu_specials_hadoken_light_r01.mp4`、`jp_super_arts_lavushka_sa2_r01.webp`。

## ルール

- ASCII小文字、数字、hyphen/underscoreのみ。表示名や技名の日本語はmanifestへ保持。
- `category`は定義済みenumのみ。
- `variant`は`light/medium/heavy/od/sa1/sa2/sa3/default`等、実データに存在するものだけ。
- 同名上書きをせずrevisionを増やす。
- patch/dateをmanifestに必ず持ち、ファイル名だけを検証根拠にしない。
