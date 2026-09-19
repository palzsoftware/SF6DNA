# AI Coach Response Quality Contract

## 自然な日本語

- 内部enum、raw identifier、開発者向け表現を表示しない。
- 曖昧なSource CTA、過度な「使用」の反復、180文字超の単文を検出する。
- 公開用語はドライブラッシュ、ドライブインパクト、ドライブゲージ、ジャストパリィ、パニッシュカウンター、カウンターヒット、バーンアウト、スーパーアーツ、ドライブリバーサル、クラシック、モダンを使用する。
- 意味を変える言い換えは行わない。

## Fail-closed validation

- 未検証Evidenceの「検証済み」表現を拒否。
- stale Patchに注意文がなければ拒否。
- Source競合時の確定表現を拒否。
- AI推定を本人発言として表示した場合は拒否。
- 未知Evidence ID、Source URL/Patch改変、内部enum、raw identifierを拒否。
