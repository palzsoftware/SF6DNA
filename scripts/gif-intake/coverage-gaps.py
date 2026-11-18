#!/usr/bin/env python3
"""キャラクター別に『技単位』の素材カバレッジを集計する共通ツール(読み取り専用)。
カバー判定: 既存MP4あり / GIFの接続候補あり(CONNECTABLE) / 別名対応表で素材が対応(静的一致・要映像確認)。
元動画の区間単位の未制作抽出は、元動画を取得できないためできない。ここでは『技データに対して素材が無い技』を挙げる。"""
import json, collections
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]; D = ROOT / "v2-web/src/data"; G = ROOT / "scripts/gif-intake"
FIX = json.load(open(D / "ALL_CHARACTER_RELEASE_FIXTURE_20261004.json"))["characters"]
REP = json.load(open(G / "gif-intake-report-20261116.json"))["records"]
JP22 = json.load(open(G / "jp-alias-verification-20261116.json"))["rows"]
B2 = json.load(open(G / "move-aliases-batch2-20261116.json"))["rows"]
TARGET = {"special", "super", "throw", "target_combo", "unique"}  # 必殺技・SA・投げ・派生・固有技(通常技は対象外)
out = {}
for ch in ("jp", "luke", "manon"):
    cov = collections.defaultdict(set)
    for r in REP:
        if r["character"] != ch or not r.get("moveSlug"): continue
        if r["connectionClass"] == "MP4_KEPT": cov[r["moveSlug"]].add("MP4")
        elif r["connectionClass"] == "CONNECTABLE_CANDIDATE": cov[r["moveSlug"]].add("GIF_CANDIDATE")
    # 接続候補のManifest(キャラ別): ここに載る素材は技IDが決まっている(未承認・capture_received)
    for f in (D / "gif-intake").glob(f"SF6DNA_VER1_{ch.upper()}_GIF_MANIFEST_CANDIDATE_*.json"):
        for c in json.load(open(f)).get("clips", []):
            if c.get("move_slug"): cov[c["move_slug"]].add("GIF_CANDIDATE")
    # 承認済みMP4(Manifest由来)
    for f in D.glob("SF6DNA_VER1_*_MEDIA_MANIFEST_*.json"):
        for c in (json.load(open(f)).get("clips") or []):
            if c.get("media_type") == "mp4" and c.get("move_slug"): cov[c["move_slug"]].add("MP4")
    if ch == "jp":
        for a in JP22: cov[a["moveSlug"]].add("GIF_ALIAS_" + a["status"])
    for a in B2:
        if a["character"] == ch: cov[a["moveSlug"]].add("GIF_ALIAS_" + a["status"])
    moves = [m for m in FIX[ch]["moves"] if m["moveType"] in TARGET]
    for m in moves:
        if m.get("media"): cov[m["slug"]].add("MP4")
    gaps = [dict(slug=m["slug"], name=m["name"], moveType=m["moveType"]) for m in moves if not cov.get(m["slug"])]
    out[ch] = dict(targetMoves=len(moves), covered=len(moves) - len(gaps), gaps=gaps, gapCount=len(gaps))
(G / "coverage-gaps-20261116.json").write_text(json.dumps(dict(generated="2026-11-16", scope="special/super/throw/target_combo/unique", note="技単位の集計。通常技・共通システムは対象外。素材があることは映像QA・承認を意味しない", perCharacter=out), ensure_ascii=False, indent=1), encoding="utf-8")
for ch, v in out.items(): print(ch, v["targetMoves"], v["covered"], v["gapCount"], [g["slug"] for g in v["gaps"]])
