# Contact Apply Ready

状態: `PENDING_VALUE`。連絡先実値は未指定のため、推測・反映していない。

## 変更allowlist

| 種別 | 対象 | 現在 | 実値受領後 |
|---|---|---|---|
| route | `v2-web/src/app/contact/page.tsx` | 「現在、お問い合わせ窓口を準備しています。」 | 指定されたmailまたはform CTAへ置換 |
| related routes | Privacy / Terms / Disclaimer | route存在 | Contact遷移と文言整合だけ確認 |
| regression | release gate / route smoke | placeholder許容 | placeholder不存在、CTA href、外部リンク属性をassert |

## 必要な入力

- 公開用の連絡方法（専用メールまたはフォームURL）
- 表示名
- 公開範囲
- 外部フォームの場合は運営主体とPrivacy文面への影響

## QA

375px/desktopで折返し、CTA tap、遷移先、戻る操作、Privacy/Terms/Disclaimerからの到達、秘密値・個人メールの露出がないことを確認する。

上記以外のroute、DB、Auth、Production環境は変更対象外。
