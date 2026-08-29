import { ImageResponse } from "next/og";

export const alt = "SF6DNA — Street Fighter 6総合プラットフォーム";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 86px",
          background: "linear-gradient(135deg, #0d1117 0%, #161b22 55%, #23170f 100%)",
          color: "#f0f6fc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 34 }}>
          <div
            style={{
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #ff6b00",
              color: "#ff6b00",
              fontSize: 42,
              fontWeight: 900,
            }}
          >
            6
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 4 }}>SF6DNA</div>
        </div>
        <div style={{ fontSize: 70, lineHeight: 1.08, fontWeight: 900, letterSpacing: -3 }}>
          SF6で困ったら、SF6DNA
        </div>
        <div style={{ marginTop: 28, maxWidth: 950, color: "#b7c0cb", fontSize: 30, lineHeight: 1.4 }}>
          診断・キャラクター情報・攻略・プレイヤー情報・上達支援を1つにつなぐStreet Fighter 6総合プラットフォーム
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 42, fontSize: 22, fontWeight: 700 }}>
          <span style={{ color: "#ff6b00" }}>DIAGNOSIS</span>
          <span style={{ color: "#3ad6ff" }}>CHARACTERS</span>
          <span style={{ color: "#a78bfa" }}>PLAYERS</span>
          <span style={{ color: "#38d996" }}>IMPROVEMENT</span>
        </div>
      </div>
    ),
    size
  );
}
