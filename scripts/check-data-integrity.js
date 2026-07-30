#!/usr/bin/env node

// ==========================================
// データ整合性チェックスクリプト
// ==========================================
//
// 何をするスクリプトか:
//   1. character-data.js が参照している選手ID(pros/streamers/vtubers/youtubers)が、
//      実際の選手データファイル(pro.js/streamer.js/vtuber.js/youtuber.js)に
//      存在するかどうかをチェックする(=参照切れの検出)
//   2. 選手データファイル内で、同じIDが誤って2回定義されていないかをチェックする
//      (=ID重複の検出)
//
// 実行方法:
//   node scripts/check-data-integrity.js
//
// 注意:
//   これは開発時に手動で実行するNode.js用のチェックツールです。
//   ブラウザ上で動くサイト本体のコード(assets/js配下)は一切変更されず、
//   サイトの動作にも影響しません。
//
// なぜ正規表現でチェックしているか:
//   character-data.js / pro.js 等は <script> タグで読み込む前提の
//   素のJavaScriptファイル(module.exportsが無い)であり、Node.jsから
//   そのままrequireできません。厳密なパーサーを使う方法もありますが、
//   このプロジェクトの規模ではオーバースペックなため、
//   構造が安定している「id:"xxx"」という書き方を頼りに、
//   正規表現でシンプルに解析しています。
//
// ==========================================

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const JS_DIR = path.join(ROOT, "assets", "js");

function readFile(fileName) {
    return fs.readFileSync(path.join(JS_DIR, fileName), "utf-8");
}

// ===== 1. 選手データファイルからIDを抽出する =====
// 戻り値: { uniqueIds: Set, duplicates: [id, ...] }
function extractPlayerIds(text) {

    const matches = [...text.matchAll(/\bid:\s*"([a-zA-Z0-9_]+)"/g)].map(m => m[1]);

    const seen = new Set();
    const duplicates = [];

    matches.forEach(id => {
        if (seen.has(id)) {
            duplicates.push(id);
        } else {
            seen.add(id);
        }
    });

    return { uniqueIds: seen, duplicates };
}

// ===== 2. character-data.js を「キャラクター単位」に分割する =====
// トップレベルのキャラクターキー(例: "    ryu: {")を見つけ、
// その直後(数行以内)に同じ名前の id:"ryu" があるものだけを
// 「本物のキャラクター境界」として扱う。
// (character-data.js 内には matchups 等、他キャラのidを参照する
//  ネストしたオブジェクトも存在するため、単純な id: 検索だけでは
//  誤検出するための対策)
function findCharacterBoundaries(text) {

    const lines = text.split("\n");
    const boundaries = [];

    const topLevelKeyPattern = /^\s{0,4}([a-zA-Z0-9_]+):\s*\{\s*$/;

    for (let i = 0; i < lines.length; i++) {

        const m = lines[i].match(topLevelKeyPattern);
        if (!m) continue;

        const key = m[1];

        // 直後15行以内に、同じ名前の id:"key" があるかを確認する
        const lookahead = lines.slice(i, i + 15).join("\n");
        const idPattern = new RegExp(`\\bid:\\s*"${key}"`);

        if (idPattern.test(lookahead)) {
            boundaries.push({ line: i + 1, characterId: key });
        }

    }

    return boundaries;

}

// ===== 3. 各キャラクターブロック内の選手参照を抽出する =====
function extractPlayerReferences(text, boundaries) {

    const lines = text.split("\n");
    const references = []; // { characterId, field, referencedId, lineNumber }

    const fields = ["pros", "streamers", "vtubers", "youtubers"];

    boundaries.forEach((boundary, index) => {

        const startLine = boundary.line;
        const endLine = (index + 1 < boundaries.length) ? boundaries[index + 1].line : lines.length;

        const blockText = lines.slice(startLine - 1, endLine - 1).join("\n");

        fields.forEach(field => {

            const pattern = new RegExp(`\\b${field}\\s*:\\s*\\[([^\\]]*)\\]`, "g");
            let match;

            while ((match = pattern.exec(blockText)) !== null) {

                const ids = [...match[1].matchAll(/"([a-zA-Z0-9_]+)"/g)].map(m => m[1]);

                ids.forEach(id => {
                    references.push({
                        characterId: boundary.characterId,
                        field,
                        referencedId: id
                    });
                });

            }

        });

    });

    return references;

}

// ===== メイン処理 =====
function main() {

    console.log("SF6DNA データ整合性チェック\n");

    // ---- 選手データファイルの読み込みとID重複チェック ----
    const files = ["pro.js", "streamer.js", "vtuber.js", "youtuber.js"];
    const allPlayerIds = new Set();
    let hasDuplicates = false;

    console.log("[1] 選手データファイル内のID重複チェック");

    files.forEach(fileName => {

        const text = readFile(fileName);
        const { uniqueIds, duplicates } = extractPlayerIds(text);

        uniqueIds.forEach(id => allPlayerIds.add(id));

        if (duplicates.length > 0) {
            hasDuplicates = true;
            console.log(`  ✗ ${fileName}: 重複ID -> ${duplicates.join(", ")}`);
        } else {
            console.log(`  ✓ ${fileName}: 重複なし(${uniqueIds.size}件)`);
        }

    });

    // ---- character-data.js の参照切れチェック ----
    console.log("\n[2] character-data.js の選手参照チェック");

    const charText = readFile("character-data.js");
    const boundaries = findCharacterBoundaries(charText);
    const references = extractPlayerReferences(charText, boundaries);

    const brokenReferences = references.filter(ref => !allPlayerIds.has(ref.referencedId));

    if (brokenReferences.length === 0) {
        console.log("  ✓ 参照切れなし");
    } else {
        console.log(`  ✗ 参照切れ: ${brokenReferences.length}件`);
        brokenReferences.forEach(ref => {
            console.log(`    - ${ref.characterId} (${ref.field}) -> "${ref.referencedId}"`);
        });
    }

    // ---- サマリー ----
    console.log("\n[結果]");
    console.log(`  検出したキャラクター数: ${boundaries.length}`);
    console.log(`  登録済み選手ID数: ${allPlayerIds.size}`);
    console.log(`  参照切れ: ${brokenReferences.length}件`);
    console.log(`  ID重複: ${hasDuplicates ? "あり" : "なし"}`);

    if (brokenReferences.length > 0 || hasDuplicates) {
        console.log("\n詳細は docs/DATA_ISSUES.md を参照してください。");
        process.exitCode = 1; // 将来CIに組み込む場合を見越して、問題があれば終了コードを1にする
    }

}

main();
