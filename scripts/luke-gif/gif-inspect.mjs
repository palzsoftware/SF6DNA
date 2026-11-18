// GIF構造の検査(外部ライブラリなし)。
// 目的: 「ファイルがGIFとして壊れていないか」「アニメーションか」「ループ設定があるか」を
// バイト列から直接確認する。映像の中身(技と一致するか)は判定できないので、目視確認は別工程。
import { createHash } from 'node:crypto';

export function sha256Hex(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

/**
 * GIFのバイト列を検査する。
 * 戻り値: { ok, errors[], width, height, frames, durationMs, loopCount, hasTrailer, zeroDelayFrames }
 *  - loopCount: null=ループ拡張なし(1回だけ再生) / 0=無限ループ / n=n回
 */
export function inspectGif(buf) {
  const r = { ok: false, errors: [], width: 0, height: 0, frames: 0, durationMs: 0, loopCount: null, hasTrailer: false, zeroDelayFrames: 0 };
  if (!Buffer.isBuffer(buf) || buf.length < 13) { r.errors.push('NOT_GIF: too short'); return r; }
  const sig = buf.subarray(0, 6).toString('latin1');
  if (sig !== 'GIF87a' && sig !== 'GIF89a') { r.errors.push(`NOT_GIF: bad signature ${JSON.stringify(sig)}`); return r; }

  r.width = buf.readUInt16LE(6);
  r.height = buf.readUInt16LE(8);
  const lsdFlags = buf[10];
  let pos = 13;
  if (lsdFlags & 0x80) pos += 3 * (1 << ((lsdFlags & 0x07) + 1));
  if (pos > buf.length) { r.errors.push('INVALID_GIF: truncated global color table'); return r; }

  // サブブロック列(長さ1バイト+データ、長さ0で終了)を読み飛ばす
  const skipSubBlocks = (p) => {
    while (true) {
      if (p >= buf.length) return -1;
      const len = buf[p];
      if (len === 0) return p + 1;
      p += 1 + len;
    }
  };

  let pendingDelayCs = null;
  while (pos < buf.length) {
    const marker = buf[pos];
    if (marker === 0x3b) { r.hasTrailer = true; pos += 1; break; }
    if (marker === 0x21) { // 拡張ブロック
      const label = buf[pos + 1];
      if (label === 0xf9) { // Graphic Control Extension: ここに表示時間(1/100秒)がある
        if (buf[pos + 2] !== 4 || pos + 7 > buf.length) { r.errors.push('INVALID_GIF: bad graphic control extension'); return r; }
        pendingDelayCs = buf.readUInt16LE(pos + 4);
      } else if (label === 0xff && buf[pos + 2] === 11 && buf.subarray(pos + 3, pos + 14).toString('latin1') === 'NETSCAPE2.0') {
        if (buf[pos + 14] === 3 && buf[pos + 15] === 1) r.loopCount = buf.readUInt16LE(pos + 16);
      }
      // ラベルの直後(pos+2)がサブブロック列の先頭
      const next = skipSubBlocks(pos + 2);
      if (next < 0) { r.errors.push('INVALID_GIF: truncated extension'); return r; }
      pos = next;
      continue;
    }
    if (marker === 0x2c) { // 画像(=1フレーム)
      if (pos + 10 > buf.length) { r.errors.push('INVALID_GIF: truncated image descriptor'); return r; }
      const imgFlags = buf[pos + 9];
      let p = pos + 10;
      if (imgFlags & 0x80) p += 3 * (1 << ((imgFlags & 0x07) + 1));
      p += 1; // LZW最小コードサイズ
      if (p > buf.length) { r.errors.push('INVALID_GIF: truncated image data'); return r; }
      const next = skipSubBlocks(p);
      if (next < 0) { r.errors.push('INVALID_GIF: truncated image data'); return r; }
      r.frames += 1;
      let cs = pendingDelayCs ?? 0;
      if (cs === 0) r.zeroDelayFrames += 1;
      if (cs <= 1) cs = 10; // 多くのブラウザは0〜1を0.1秒として扱う
      r.durationMs += cs * 10;
      pendingDelayCs = null;
      pos = next;
      continue;
    }
    r.errors.push(`INVALID_GIF: unexpected byte 0x${marker.toString(16)} at ${pos}`);
    return r;
  }
  if (!r.hasTrailer) r.errors.push('INVALID_GIF: missing trailer (file may be cut off)');
  if (r.frames === 0) r.errors.push('INVALID_GIF: no frames');
  r.ok = r.errors.length === 0;
  return r;
}
