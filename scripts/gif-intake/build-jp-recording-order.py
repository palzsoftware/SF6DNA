#!/usr/bin/env python3
"""JP設置技の録画順序(ユーザー提供情報)を根拠情報として記録する。読み取り専用・新規ファイルのみ。
録画順序は『候補を絞る根拠』であり、技IDや公開承認を確定するものではない(status は常に ORDER_EVIDENCE_ONLY)。
出力: scripts/gif-intake/jp-recording-order-20261116.json"""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
FIX = {m["slug"]: m for m in json.load(open(ROOT / "v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json"))["characters"]["jp"]["moves"]}
OFF = json.load(open(ROOT / "v2-web/src/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json"))
def off(i):
    r = OFF[f"jp:web:{i}"]; r = r.get("raw", r); return {"officialRecord": i, "technicalName": r.get("name"), "officialCommand": r.get("command")}
def ids(*slugs): return [{"slug": s, "moveId": FIX[s]["id"]} for s in slugs]

SEG = [
 dict(seq=1, label="弱設置", candidates=ids("jp-departure-l"), official=off("310"), existingGifs=["9_37-jp-light-departure.gif"], overlap="EXISTING_GIF_CANDIDATE_UNVERIFIED", production="NOT_NEEDED_IF_CONFIRMED", notes=["公式技術名 214LP_set(設置)と一致する語彙"]),
 dict(seq=2, label="中設置", candidates=ids("jp-departure-m"), official=off("311"), existingGifs=["9_38-jp-medium-departure.gif"], overlap="EXISTING_GIF_CANDIDATE_UNVERIFIED", production="NOT_NEEDED_IF_CONFIRMED", notes=[]),
 dict(seq=3, label="強設置", candidates=ids("jp-departure-h"), official=off("312"), existingGifs=["9_39-jp-heavy-departure.gif"], overlap="EXISTING_GIF_CANDIDATE_UNVERIFIED", production="NOT_NEEDED_IF_CONFIRMED", notes=[]),
 dict(seq=4, label="OD設置", candidates=ids("jp-departure-od-l", "jp-departure-od-m", "jp-departure-od-h"), official=[off("313"), off("314"), off("315")],
      existingGifs=["jp-od-departure-lp-mp.gif", "jp-od-departure-lp-hp.gif", "jp-od-departure-mp-hp.gif"], overlap="COUNT_MISMATCH_1_SEGMENT_VS_3_GIFS", production="HOLD_UNTIL_CLARIFIED",
      notes=["録画順序のOD設置は1区間だが、公式・公開用データのOD ヴィーハトは3系統(弱+中/弱+強/中+強)で、既存GIFも3本", "1区間のOD設置がどのボタン対か、または3本が別の録画区間由来かは不明(推測しない)"]),
 dict(seq=5, label="弱ワープ", candidates=ids("jp-departure-window"), official=off("316"), existingGifs=["9_43-jp-departure-window.gif"], overlap="SHARED_GIF_FOR_SEGMENTS_5_6", production="UNKNOWN_WHICH_STRENGTH_IS_COVERED",
      notes=["公式技術名 214LP_warp(ワープ)と一致する語彙。公式は弱P・中Pを1レコード(LPorMP)で扱い、公開用データも1技ID", "既存GIF 9_43 は1本のみで、弱・中どちらの録画か不明(推測しない)"]),
 dict(seq=6, label="中ワープ", candidates=ids("jp-departure-window"), official=off("316"), existingGifs=["9_43-jp-departure-window.gif"], overlap="SHARED_GIF_FOR_SEGMENTS_5_6", production="UNKNOWN_WHICH_STRENGTH_IS_COVERED",
      notes=["弱ワープと同じ技ID候補。技IDは1つなので、強度別の別GIFにする場合は技データ側の判断が必要(今回は変更しない)"]),
 dict(seq=7, label="強起動", candidates=ids("jp-departure-shadow"), official=off("317"), existingGifs=["9_44-jp-departure-shadow.gif"], overlap="EXISTING_GIF_CANDIDATE_UNVERIFIED", production="NOT_NEEDED_IF_CONFIRMED",
      notes=["公式技術名 214HP_bomb(起爆)。ユーザーの『起動』は公式の技術名上は『起爆』に当たる可能性があるが、同一と断定しない"]),
 dict(seq=8, label="OD起動", candidates=[], official=None, existingGifs=[], overlap="NO_GIF_NO_MOVE_ID", production="HOLD_NO_MOVE_ID",
      notes=["公式一覧・公開用データに『OD版のヴィーハト・チェーニ(起爆)』に当たる技は無い(317はHPのみ)。技IDを作らない"]),
]
EXTRA = [
 dict(seq=None, label="通常技からのキャンセルワープ", candidates=[], official=None, existingGifs=[], overlap="NO_GIF_NO_MOVE_ID", production="HOLD_NO_MOVE_ID",
      notes=["単独のワープ(seq 5/6)とは別物として扱う", "公式の通常技注記は『ヴィーハト・チェーニのみキャンセル可能』で、通常技→ワープのキャンセルは公式一覧から確認できない(撮影内容と矛盾する可能性。未確認)", "どの通常技からのキャンセルかの情報なし"]),
 dict(seq=None, label="通常技からのキャンセル起爆", candidates=[], official=None, existingGifs=[], overlap="NO_GIF_NO_MOVE_ID", production="HOLD_NO_MOVE_ID",
      notes=["単独の起動/起爆(seq 7/8)とは別物として扱う", "公式の通常技注記(5MP/5HK/2LK/2MK)は『ヴィーハト・チェーニのみキャンセル可能』で、候補は存在する", "どの通常技からか、元素材のどの区間かは未確認"]),
]
# GIF同士のフレーム重複(frame-overlap.py の結果)。同じ動作は別テイクでも似るので、同一録画の証明ではなく『手がかり』
OV = json.load(open(ROOT / "scripts/gif-intake/jp-frame-overlap-20261116.json"))["pairs"]
def ov(a, b):
    p = next(x for x in OV if x["a"] == a and x["inB"] == b); return {"fractionOfAFramesFoundInB": p["fractionOfAFramesFoundInB"], "longestMatchedRun": p["longestMatchedRun"]}
def hits(a, others): return {o: ov(a, o) for o in others}
SETS = ["9_37-jp-light-departure.gif", "9_38-jp-medium-departure.gif", "9_39-jp-heavy-departure.gif"]
ODS = ["jp-od-departure-lp-mp.gif", "jp-od-departure-lp-hp.gif", "jp-od-departure-mp-hp.gif"]
by = {s["label"]: s for s in SEG}
od_pairs = {f"{a} vs {b}": ov(a, b) for a in ODS for b in ODS if a < b}
by["OD設置"]["frameEvidence"] = {"betweenOdGifs": od_pairs, "interpretation": "3本は互いにほぼフレームを共有しない(重複は静止姿勢程度)。同一区間の重複切り出しではない。ただし『別撮影』か『1録画内の連続した別区間』かはフレームだけでは判別できない"}
w = hits("9_43-jp-departure-window.gif", SETS + ODS + ["9_44-jp-departure-shadow.gif"])
for k in ("弱ワープ", "中ワープ"):
    by[k]["frameEvidence"] = {"9_43_vs_others": w, "interpretation": "9_43の序盤は中設置(9_38)と同じ動作のフレームを含み、弱設置・強設置・OD設置のGIFとは一致しない。9_43は中ヴィーハト設置の動作を含むと見られる(同一録画かは判別できない)"}
by["弱ワープ"]["frameSupport"] = "NOT_SUPPORTED_BY_FRAME_EVIDENCE"; by["中ワープ"]["frameSupport"] = "SUPPORTED_BY_FRAME_EVIDENCE"
by["弱ワープ"]["production"] = "LIKELY_MISSING_UNCONFIRMED"; by["中ワープ"]["production"] = "NOT_NEEDED_IF_CONFIRMED"
by["強起動"]["frameEvidence"] = {"9_44_vs_others": hits("9_44-jp-departure-shadow.gif", SETS + ODS + ["9_43-jp-departure-window.gif"]), "interpretation": "9_44は既存の設置GIF・OD GIF・9_43のいずれともフレームを共有しない。設置から起爆までの由来は不明"}
# キャンセル系: 映像の種類を分けて管理する。元動画が未取得のため全て SOURCE_VIDEO_UNAVAILABLE(キャンセル成立と断定しない)
CANCEL_CLASSES = ["通常技からの連係として撮影された映像", "技のキャンセルが成立している映像", "通常技の硬直終了後に行動している映像", "元動画未取得のため判断できない映像"]
for c in EXTRA:
    c["videoClassification"] = {"classes": CANCEL_CLASSES, "assigned": CANCEL_CLASSES[3], "reason": "元動画(Drive上の旧動画)を取得できておらず、使用した通常技・キャンセル成立の有無を映像で確認できない。連続動作=キャンセル成立とは扱わない"}
for s in SEG + EXTRA: s["status"] = "ORDER_EVIDENCE_ONLY"; s["moveIdConfirmedByOrder"] = False; s["approval"] = "NOT_APPROVED"
out = {"generated": "2026-11-16", "source": "ユーザー本人の提供情報(録画順序と撮影済み動作)。撮影順序は『候補を絞る根拠』であり、技ID・公開承認の確定には使わない",
       "sourceVideoAccess": "JPの元動画はDriveコネクタの10MB制限と取得経路がなく未取得。区間ごとの内容・GIFとの重複はバイト/映像では比較できていない",
       "gifProductionThisRound": 0, "frameOverlapSource": "scripts/gif-intake/jp-frame-overlap-20261116.json", "segments": SEG, "cancelSegments": EXTRA}
(ROOT / "scripts/gif-intake/jp-recording-order-20261116.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print({s["label"]: (s["overlap"], s["production"]) for s in SEG + EXTRA})
