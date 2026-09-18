# Motion Media Ingest Pipeline

状態: `READY_FOR_SOURCE_VIDEO`。ユーザーはCharacter×Categoryの元動画だけを渡し、分割・GIF化は行わない。

## 入力

- Categories: `normals`, `unique_attacks`, `specials`, `super_arts`。必要時のみ`command_normals`, `stance`, `install`, `throws`, `movement`, `character_system`。
- 推奨: 1080p/60fps、ゲーム音のみまたは無音、各技前後2–3秒静止、同じstage/camera/HUD条件。
- 所有者: `user_capture`。他者動画・CAPCOM配布素材の再利用は禁止。

## Work処理

1. 原本SHA256、codec、duration、resolution、fpsを記録。
2. 静止区間を目印にcut候補を検出し、技リストと照合。
3. cut pointを目視調整し、技単位master MP4を生成。
4. posterを生成し、GIF / Animated WebP / MP4(WebM候補)を比較。
5. loop、画質、filesize、375px、reduced-motion、lazy-load、broken/no-media fallbackを検証。
6. manifestへmove ID/slug、patch、capture日、verification状態を記録。
7. RC Previewへだけ統合し、Device QA後に公開承認候補へ進める。

## 配信形式の暫定推奨

第一候補はmuted/playsInline/loopの軽量MP4、poster付き。GIFは互換比較用、Animated WebPは容量と画質がMP4より有利な場合のみ採用候補。Pilotの実測前に固定しない。

既存`MoveMotionMedia`は`gif`または`video`を描画し、動画は`preload=none`、poster/no-media経路を持つ。DBの`move_motion_media`へ書く場合は別途明示承認が必要。
