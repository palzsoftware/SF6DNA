export const CONTACT_CATEGORIES = [
  "不具合報告",
  "データ修正依頼",
  "機能要望",
  "プレイヤー・動画情報の修正",
  "権利・プライバシー",
  "その他",
] as const;

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];

export type ContactPayload = {
  category: string;
  message: string;
  email: string;
  targetUrl?: string;
  website?: string;
};

export type ContactValidationResult =
  | { ok: true; value: { category: ContactCategory; message: string; email: string; targetUrl: string | null } }
  | { ok: false; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload(payload: ContactPayload): ContactValidationResult {
  if (payload.website?.trim()) return { ok: false, message: "送信できませんでした。" };
  if (!CONTACT_CATEGORIES.includes(payload.category as ContactCategory)) {
    return { ok: false, message: "お問い合わせの種類を選んでください。" };
  }

  const message = payload.message.trim();
  const email = payload.email.trim();
  const targetUrl = payload.targetUrl?.trim() ?? "";

  if (message.length < 10 || message.length > 4000) {
    return { ok: false, message: "内容は10文字以上、4000文字以内で入力してください。" };
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { ok: false, message: "返信先メールアドレスを正しく入力してください。" };
  }
  if (targetUrl) {
    try {
      const parsed = new URL(targetUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("unsupported protocol");
    } catch {
      return { ok: false, message: "対象URLは http:// または https:// から入力してください。" };
    }
  }

  return { ok: true, value: { category: payload.category as ContactCategory, message, email, targetUrl: targetUrl || null } };
}
