# Weekend Device QA Pack — Updated

## 1. Character

Ryu/JPを先に確認後、31キャラ。375pxとdesktopでHero、概要、技、コンボ、セットプレイ、連携・対策、動画、Source CTA、文字切れ、横overflow。JPで「地面からの攻撃」「空中に置く技」が表示されず、具体的技名になっていること。

## 2. Player

`/players`で名前/alias/team/character/category検索、category/character複数選択、group間AND、chip解除、全clear、0件、detail、Player↔Character。Kakeru/如月れんはDB未反映のため対象外。ランクは未連携表示が正しい。

## 3. Video / Account / Daily

Video filter/sort/favorite/watched/share/external。Guestと認証済みのDiagnosis→Daily、login、save、reload、history、logout。Members/private/deletedは公開導線に出さない。

## 4. Game Verification / GIF / Release

29 claims / 8 sessionsとGeneric 85は既存Runbookの条件を維持。GIFはRyu/JP packageを使用。Contact、Privacy/Terms、canonical、Auth redirect、Preview smokeを最後に確認。Kakeru/如月れん、DB candidate、Production反映は今回QA範囲外。
