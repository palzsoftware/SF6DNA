# 新⑮ All Character Move Coverage — 2026-10-02

STATUS = BLOCKED_BY_PUBLICATION_AND_PREVIEW_ACCESS
RELEASE_STATUS = NO-GO
RC_FREEZE = DO_NOT_PROCEED
BASE_SHA = 69a3f958cbabdcc995cd8a3ef4cc0eb936aafc41

旧⑮ Freeze作業は安全停止。Remote writeなし。未コミット5文書は別directoryに保持し、このBatchのcommit対象外。Fresh HEADはBaseと一致。

## Fresh read-only inventory

31公開playableキャラ。DB全体2065 moves / 2065 frames。archived13技を除いた2052技。必須5カテゴリ1939技（通常627、unique178、target_combo34、必殺850、投げ74、SA176）。drive82 / taunt31は必須カテゴリに混ぜない。

Public Move = 0。全active技がdraft。既存evidence gateを満たすdraftは全カテゴリ701、必須カテゴリ661。statusを変更していないためPublic UIの公開技0。Preview fallbackは120技、DB required ID一致120、不足1819。この件数はfallback inventory照合であり、live DOM PASSの代用ではない。

共通Adapterは認可済みRemote→公開Gateを満たすDB→Preview-only fallbackへ解決順序を修正。Remoteが空の場合もfixtureへすり替えない。通常Previewはdraft DBを読む権限を持たない。全31展開完了とは扱わない。

|Character|DB|Normal|Unique|Target combo|Special|Throw|SA|Other|Classic|Current frame|Public|Fixture|Required ready draft|Status|
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
|ryu|57|18|5|2|27|2|3|0|57|57|0|57|0|GATED|
|luke|50|18|4|4|19|2|3|0|50|50|0|1|0|GATED|
|jamie|93|18|20|0|49|2|4|0|93|93|0|0|93|GATED|
|chun-li|68|19|16|0|25|3|5|0|68|68|0|0|68|GATED|
|guile|70|18|12|0|31|4|5|0|70|70|0|0|70|GATED|
|kimberly|76|18|12|0|38|2|6|0|76|76|0|0|76|GATED|
|juri|46|19|4|1|16|3|3|0|46|46|0|0|0|GATED|
|ken|59|19|4|2|29|2|3|0|59|59|0|0|0|GATED|
|blanka|91|19|12|0|44|3|5|8|91|91|0|0|83|GATED|
|dhalsim|88|18|14|0|37|3|8|8|88|88|0|0|80|GATED|
|e-honda|70|19|7|0|30|2|4|8|70|70|0|0|62|GATED|
|dee-jay|105|18|14|0|29|2|34|8|105|105|0|0|97|GATED|
|manon|49|18|3|4|18|2|4|0|49|49|0|3|0|GATED|
|marisa|53|22|4|0|21|2|4|0|53|53|0|0|0|GATED|
|jp|59|18|4|4|26|3|4|0|59|59|0|59|0|GATED|
|zangief|47|22|8|0|11|2|4|0|47|47|0|0|0|GATED|
|lily|47|18|4|1|18|2|4|0|47|47|0|0|0|GATED|
|cammy|53|18|3|2|22|3|5|0|53|53|0|0|0|GATED|
|rashid|54|18|8|1|20|3|4|0|54|54|0|0|0|GATED|
|aki|52|20|1|2|23|2|4|0|52|52|0|0|0|GATED|
|ed|49|18|3|3|19|2|4|0|49|49|0|0|0|GATED|
|akuma|61|18|5|0|29|3|6|0|61|61|0|0|0|GATED|
|m-bison|47|18|3|2|18|2|4|0|47|47|0|0|0|GATED|
|terry|53|20|0|6|21|2|4|0|53|53|0|0|0|GATED|
|mai|95|23|2|0|46|3|8|13|95|95|0|0|8|GATED|
|elena|86|31|2|0|32|2|5|14|86|86|0|0|2|GATED|
|sagat|69|26|0|0|24|2|8|9|69|69|0|0|0|GATED|
|c-viper|72|21|2|0|32|2|4|11|72|72|0|0|5|GATED|
|alex|76|26|0|0|30|3|5|12|76|76|0|0|0|GATED|
|ingrid|72|26|0|0|26|2|8|10|72|72|0|0|0|GATED|
|yasmine|85|25|2|0|40|2|4|12|85|85|0|0|17|GATED|

## Exact required DB ID reconciliation

All below are draft/public-gated. `fixture` means present in existing Preview fallback, not published. `gated` means absent there. No row is synthesized, merged or silently discarded by the new resolver. IDs are evidence only; not imported into app fixtures.

|Character|Move ID|Slug|Name|Category|Preview fallback|
|---|---|---|---|---|---|
|ryu|ad5f57f5-f156-4d20-8f0a-f4da4772831d|ryu-standing-lp|立ち弱P（ジャブ）|normal|fixture|
|ryu|631c8d80-2000-4756-be30-bb1ffbe52060|ryu-standing-lk|立ち弱K（ローキック）|normal|fixture|
|ryu|b33dd19c-add5-4420-8856-163fab932249|ryu-standing-mp|立ち中P（鉤突き）|normal|fixture|
|ryu|7ac63edd-7d49-4a1a-9a2f-09ad04dc7d0d|ryu-standing-mk|立ち中K（横蹴り）|normal|fixture|
|ryu|2ca379aa-216c-4bae-829d-50b8c273b7d7|ryu-standing-hp|立ち強P（正拳突き）|normal|fixture|
|ryu|b2362378-1411-45ae-a0f0-014e898042e0|ryu-standing-hk|立ち強K（後ろ回し蹴り）|normal|fixture|
|ryu|b52d8627-51e8-46f2-84b9-021d41d34c9c|ryu-crouching-lp|しゃがみ弱P（ジャブ）|normal|fixture|
|ryu|e12c05a0-4a5f-43fd-84a1-c258ca99f18f|ryu-crouching-lk|しゃがみ弱K（キック）|normal|fixture|
|ryu|e1ab790a-51d5-4461-b496-6fdc8f50a703|ryu-crouching-mp|しゃがみ中P（ストレート）|normal|fixture|
|ryu|46093af4-c66f-4941-94a6-939a0730f7d5|ryu-crouching-mk|しゃがみ中K（くるぶしキック）|normal|fixture|
|ryu|477ec830-0cbf-4400-950a-d6fce904306a|ryu-crouching-hp|しゃがみ強P（突き上げアッパー）|normal|fixture|
|ryu|06cb478c-ed44-47f7-99ec-1a2dbe45e8b5|ryu-crouching-hk|しゃがみ強K（回転足払い）|normal|fixture|
|ryu|034b09a8-7a59-4aff-a35d-90a022094914|ryu-jump-lp|ジャンプ弱P（肘落とし）|normal|fixture|
|ryu|199c77e5-2064-4090-8f9b-4226af92a68d|ryu-jump-lk|ジャンプ弱K（ひざ蹴り）|normal|fixture|
|ryu|389b1337-3b9b-4ea6-9d90-14383797c6b4|ryu-jump-mp|ジャンプ中P（すくい突き）|normal|fixture|
|ryu|51da4eb2-83d2-4afe-981d-cdcd52582424|ryu-jump-mk|ジャンプ中K（飛び蹴り）|normal|fixture|
|ryu|ec64fb71-06c8-4603-9aa5-b74f40f2df06|ryu-jump-hp|ジャンプ強P（ストレート）|normal|fixture|
|ryu|f0b5f99f-692a-4706-8f68-40bb4e4f0015|ryu-jump-hk|ジャンプ強K（跳び前蹴り）|normal|fixture|
|ryu|1bc5bdf1-5471-4f09-ab27-093482bf5954|ryu-collarbone-breaker|鎖骨割り|unique|fixture|
|ryu|e0df5bcc-6bf7-4f08-9d8d-311ea95ed89f|ryu-solar-plexus-strike|鳩尾砕き|unique|fixture|
|ryu|01f701c5-e0b5-402d-94b3-d8166c686370|ryu-back-hp|後ろ強P（Short Uppercut）|unique|fixture|
|ryu|3ecf9a07-5539-4a4a-81fd-ab90b9fc3b61|ryu-back-hk|後ろ強K（Axe Kick）|unique|fixture|
|ryu|7be699d6-7021-450a-823f-235eb9513561|ryu-forward-hk|前強K（Whirlwind Kick）|unique|fixture|
|ryu|3c25e9b9-0031-42b4-a9ef-c68ca1907f9c|ryu-target-hp-hk|強P→強K ターゲットコンボ|target_combo|fixture|
|ryu|3605c1b6-1f6b-42a3-981d-6ce606d760b4|ryu-fuwa-triple-strike|中P→弱K→強K（Fuwa Triple Strike）|target_combo|fixture|
|ryu|f1ca42ab-4cd4-414c-9b06-b70f5a3e8b43|ryu-l-hadoken|弱 波動拳|special|fixture|
|ryu|99caf881-5986-41a8-bb7f-9282a7409cad|ryu-m-hadoken|中 波動拳|special|fixture|
|ryu|3922bb25-41b4-4ce9-bfb2-e0678d0a5c8e|ryu-h-hadoken|強 波動拳|special|fixture|
|ryu|e1307e32-ef9f-4b5e-8a9f-b64863bf9303|ryu-denjin-hadoken|[電刃錬気] 波動拳|special|fixture|
|ryu|cd656302-682f-41ea-9ea3-4dd48e121764|ryu-od-hadoken|OD 波動拳|special|fixture|
|ryu|5593524d-b9d7-4203-8ec3-15b483ed23dc|ryu-denjin-od-hadoken|[電刃錬気] OD 波動拳|special|fixture|
|ryu|2e127af1-553f-477c-81ce-c4027213b237|ryu-l-shoryuken|弱 昇龍拳|special|fixture|
|ryu|ba18efcc-5215-49f9-94b0-bab116f79f43|ryu-m-shoryuken|中 昇龍拳|special|fixture|
|ryu|5e4a8e85-0eac-4c86-a343-b69c17ce9fec|ryu-h-shoryuken|強 昇龍拳|special|fixture|
|ryu|d525aa87-9b71-44a0-a0b2-77e152dd23a8|ryu-od-shoryuken|OD 昇龍拳|special|fixture|
|ryu|6e6d7e31-71b6-499c-b53a-a8725267879c|ryu-l-tatsumaki|弱 竜巻旋風脚|special|fixture|
|ryu|f45ed8ef-efc2-45fe-af69-6af95691af3c|ryu-m-tatsumaki|中 竜巻旋風脚|special|fixture|
|ryu|7f7f8816-f6ac-40ef-9f3b-bc8c64d9666c|ryu-h-tatsumaki|強 竜巻旋風脚|special|fixture|
|ryu|1b2cae35-53bd-4334-9e29-c1be501d0567|ryu-od-tatsumaki|OD 竜巻旋風脚|special|fixture|
|ryu|12b670e7-d91b-4590-beee-a414726f7c23|ryu-l-high-blade-kick|弱 上段足刀蹴り|special|fixture|
|ryu|ca18582a-dc15-4ad5-9eb3-86b2b269b2b0|ryu-m-high-blade-kick|中 上段足刀蹴り|special|fixture|
|ryu|46ac6533-8a93-4783-8c70-7c466e27cfe5|ryu-h-high-blade-kick|強 上段足刀蹴り|special|fixture|
|ryu|1aefba80-f15b-4bf2-b96c-a06155070371|ryu-od-high-blade-kick|OD 上段足刀蹴り|special|fixture|
|ryu|3dd9e618-062b-483b-bc45-d2819c97030b|ryu-l-hashogeki|弱 波掌撃|special|fixture|
|ryu|ed402fb3-798e-4b66-9d94-5098a28369a1|ryu-m-hashogeki|中 波掌撃|special|fixture|
|ryu|41ad35a2-c41d-4b51-ab6c-4e2a37a526b5|ryu-h-hashogeki|強 波掌撃|special|fixture|
|ryu|ec9b330f-ae5e-457b-993e-8c60ea0afabd|ryu-od-hashogeki|OD 波掌撃|special|fixture|
|ryu|db46db6f-26dd-4638-8397-d235750929b9|ryu-denjin-charge|電刃錬気|special|fixture|
|ryu|5a55599e-800f-4831-886c-345d1e88a9ef|ryu-denjin-hashogeki|[電刃錬気] 波掌撃|special|fixture|
|ryu|2a83a1ca-a458-4e02-a496-40ff278964c2|ryu-denjin-od-hashogeki|[電刃錬気] OD 波掌撃|special|fixture|
|ryu|af1a30a4-7bf1-49eb-bd60-76b10861c470|ryu-sa1-shinku-hadoken|SA1 真空波動拳|super|fixture|
|ryu|522dafee-8e8a-4a86-8e02-e26d17137507|ryu-sa2-shin-hashogeki|SA2 真・波掌撃|super|fixture|
|ryu|560625d9-16b9-484e-883d-6ace0adeb39c|ryu-sa3-shin-shoryuken|SA3 真・昇龍拳|super|fixture|
|ryu|ed764818-867d-4188-b9fa-71bbd7cfb0b8|ryu-aerial-tatsumaki|空中竜巻旋風脚|special|fixture|
|ryu|271fc7f0-8035-4945-8b68-40e43ab42725|ryu-od-aerial-tatsumaki|OD 空中竜巻旋風脚|special|fixture|
|ryu|252287ef-f49c-4347-ace6-76dce143ef59|ryu-forward-throw|前投げ|throw|fixture|
|ryu|b0e5f2a6-29fd-4aa0-98ed-05b9b248343a|ryu-back-throw|後ろ投げ|throw|fixture|
|luke|beb7d320-94fb-4e21-93ca-7defe9570f50|luke-standing-lp|立ち弱P|normal|gated|
|luke|b09359b8-9a9b-4fce-a1e6-5ed2a1bc1afe|luke-standing-lk|立ち弱K|normal|gated|
|luke|548d97af-d316-4a12-9574-e08b9dad159a|luke-standing-mp|立ち中P|normal|gated|
|luke|82fb24e6-a9e4-4f76-9686-450d0ff43143|luke-standing-mk|立ち中K|normal|gated|
|luke|97651c5b-50de-45b3-851d-4e6157c22192|luke-standing-hp|立ち強P|normal|gated|
|luke|0dd61560-79e9-4220-89a7-3044bc01b630|luke-standing-hk|立ち強K|normal|gated|
|luke|40d7e3a8-5e6c-49b1-9e88-3cdb830f8ce0|luke-crouching-lp|しゃがみ弱P|normal|gated|
|luke|3ead79b6-43a0-4376-8ccb-04e068be8df7|luke-crouching-lk|しゃがみ弱K|normal|gated|
|luke|d21b0a0c-4d1a-4ccf-9a0f-585246d91395|luke-crouching-mp|しゃがみ中P|normal|gated|
|luke|2666b0fc-64f1-405c-afbe-382431e1df9b|luke-crouching-mk|しゃがみ中K|normal|gated|
|luke|2efffb76-d9f8-44e2-830a-16ee127f96cc|luke-crouching-hp|しゃがみ強P|normal|gated|
|luke|9f9e639b-a942-40a2-ad23-33fa36e1ac06|luke-crouching-hk|しゃがみ強K|normal|gated|
|luke|00fb09ee-aba9-4dc7-8115-29b46bd67dad|luke-jump-lp|ジャンプ弱P|normal|gated|
|luke|31807b8f-99c8-446f-a2db-5200ae2fae69|luke-jump-lk|ジャンプ弱K|normal|gated|
|luke|48c184ed-390f-454f-9de8-75df3887fc13|luke-jump-mp|ジャンプ中P|normal|gated|
|luke|779533b9-24da-421b-ac57-bb8c3d5700b9|luke-jump-mk|ジャンプ中K|normal|gated|
|luke|229b7150-2d1c-46ae-87cf-c2dfa413d588|luke-jump-hp|ジャンプ強P|normal|gated|
|luke|5a9a9a77-2943-428c-8eb0-8729e26ed0bc|luke-jump-hk|ジャンプ強K|normal|gated|
|luke|f415ffa3-f701-4586-8e02-e30596c119e9|luke-rawhide|ローハイド|unique|gated|
|luke|4383dae4-bdac-418f-9a11-e4632eb25696|luke-suppressor|サプレッサー|unique|gated|
|luke|938179e9-b0e1-4b22-8adb-d61bcb84ae86|luke-outlaw-kick|アウトローキック|unique|gated|
|luke|1e553e7b-1abf-47eb-8864-c46d2f8cfa58|luke-forward-hp|前強P|unique|gated|
|luke|4f16469c-504c-4290-a5c7-6b685169b8c3|luke-forward-hp-hp|前強P・強P|target_combo|gated|
|luke|42cfd8d8-a47b-4d89-8fd6-95e758b07e0d|luke-triple-impact|トリプルインパクト|target_combo|gated|
|luke|aab86b9c-f501-4928-8818-114f5fc0574a|luke-nose-breaker|ノーズブレイカー|target_combo|fixture|
|luke|a6088794-0ed1-4ee9-9d4a-ee4cbe159e37|luke-snapback-combo|スナップバックコンボ|target_combo|gated|
|luke|e5c37a22-9ba1-409b-bc2a-52b4839c8e6f|luke-sand-blast-l|弱 サンドブラスト|special|gated|
|luke|e881de87-5e45-4e0f-bda5-668c28d2b76a|luke-sand-blast-m|中 サンドブラスト|special|gated|
|luke|fb68e4ad-4c0a-4bc1-bd8c-c79244c78d78|luke-sand-blast-h|強 サンドブラスト|special|gated|
|luke|0466a4f1-0e3c-4352-8f61-0f1874663e99|luke-sand-blast-od|OD サンドブラスト|special|gated|
|luke|423f6d80-072c-4dd1-863d-5b8e0061a37d|luke-fatal-shot|フェイタルショット|special|gated|
|luke|53070580-449c-4fcb-b6f5-bb97de387ba1|luke-flash-knuckle-l|弱 フラッシュナックル|special|gated|
|luke|8668e8a5-945a-437c-a833-f265d837d0bc|luke-flash-knuckle-m|中 フラッシュナックル|special|gated|
|luke|4b6fa7c0-c85c-4d4f-aca4-b54b29599818|luke-flash-knuckle-h|強 フラッシュナックル|special|gated|
|luke|9616dccc-5222-420c-97c7-512fe6ebad17|luke-flash-knuckle-od|OD フラッシュナックル|special|gated|
|luke|6afa6076-dff0-4ca5-b00d-acbf1a6f74e0|luke-ddt|DDT（投げ）|special|gated|
|luke|5d28a0ed-7abe-4c1b-8cc4-bcb208d55626|luke-aerial-flash-knuckle|エアリアルフラッシュナックル|special|gated|
|luke|29ba87ce-14a6-40b2-84aa-936228092b66|luke-avenger|アベンジャー|special|gated|
|luke|c9027806-a085-4461-a802-592e907e9a46|luke-no-chaser|ノーチェイサー|special|gated|
|luke|b2aaf0e6-82b4-49eb-8690-96450cfb7d1e|luke-impaler|インペイラー|special|gated|
|luke|ee3a7178-324f-4238-9e0d-b3735dfc9beb|luke-rising-uppercut-l|弱 ライジングアッパー|special|gated|
|luke|249ae616-7fd2-422e-80a3-65bb64b80a17|luke-rising-uppercut-m|中 ライジングアッパー|special|gated|
|luke|c647ddae-2f4f-440d-ab84-8c44b5ba9188|luke-rising-uppercut-h|強 ライジングアッパー|special|gated|
|luke|3176f9a4-9586-49cc-9dd6-8a444e2cd1ae|luke-rising-uppercut-od|OD ライジングアッパー|special|gated|
|luke|4743c57a-35e7-404f-82e2-79a0854b12f6|luke-slam-dunk|スラムダンク|special|gated|
|luke|9e34282d-9da4-43fb-a47c-dfdd72eda6ee|luke-sa1-vulcan-blast|SA1 バルカンブラスト|super|gated|
|luke|a1931623-d8f1-47e4-9f18-ef4fde632b4b|luke-sa2-eraser|SA2 イレイザー|super|gated|
|luke|03dc215b-fe91-445b-9089-9a9d090ac1a0|luke-sa3-pale-rider|SA3 ペイルライダー|super|gated|
|luke|dc4d041c-4259-4636-8142-d2f329b7d77b|luke-forward-throw|前投げ|throw|gated|
|luke|c40c1f4a-5753-486d-a902-e017ae79de78|luke-back-throw|後ろ投げ|throw|gated|
|jamie|7da53e0f-2570-496e-8c47-3b57fd5a90c1|jamie-standing-lp|立ち弱P（杯打）|normal|gated|
|jamie|da6ccd2f-8299-4ec1-bf92-c3473685557c|jamie-standing-lk|立ち弱K（頂奏）|normal|gated|
|jamie|a8c00acf-3e29-4f8a-98b9-419d8f635a94|jamie-standing-mp|立ち中P（背束拳）|normal|gated|
|jamie|720eb2bf-9bf5-4bf9-8722-1cdc5ab3dcf6|jamie-standing-mk|立ち中K（瞬歩脚）|normal|gated|
|jamie|4fb6762e-7ea7-4f02-8017-1f84d748bd36|jamie-standing-hp|立ち強P（連發拳）|normal|gated|
|jamie|183019ce-f164-4619-b634-3192d008013b|jamie-standing-hk|立ち強K（魔霞弧）|normal|gated|
|jamie|27200595-9a87-4cef-b118-9e88a547cba9|jamie-crouching-lp|しゃがみ弱P（杯打）|normal|gated|
|jamie|66ced612-794a-4e70-b51b-60d1c6e2b797|jamie-crouching-lk|しゃがみ弱K（先歩）|normal|gated|
|jamie|d5352500-9043-48d0-94db-5617accb858a|jamie-crouching-mp|しゃがみ中P（透骨拳）|normal|gated|
|jamie|197e9bb6-7011-4e45-862c-1613362a4548|jamie-crouching-mk|しゃがみ中K（膝降蹴）|normal|gated|
|jamie|fab716b9-6740-4669-9805-5bdfbbbd5e36|jamie-crouching-hp|しゃがみ強P（月穿）|normal|gated|
|jamie|826ca5b3-f64e-4022-a7ad-afe0000b6a62|jamie-crouching-hk|しゃがみ強K（始廻）|normal|gated|
|jamie|e3b0f48c-12d1-445c-8164-00ddc2300265|jamie-jump-lp|ジャンプ弱P（裏肘落）|normal|gated|
|jamie|6b798ab0-f058-4cca-8f49-6e10a5b1d8ea|jamie-jump-lk|ジャンプ弱K（麓刺）|normal|gated|
|jamie|2ace90e1-ddf1-446b-b239-7abdb8c04e3d|jamie-jump-mp|ジャンプ中P（雲掴）|normal|gated|
|jamie|5310fceb-d9e6-4e78-b695-7ee2a8464a62|jamie-jump-mk|ジャンプ中K（飛燕腿）|normal|gated|
|jamie|95492209-1432-4bde-9e89-b4286885c384|jamie-jump-hp|ジャンプ強P（鞭槌打）|normal|gated|
|jamie|d895641f-3033-4950-82e9-2f3eff071cbd|jamie-jump-hk|ジャンプ強K（連空腿）|normal|gated|
|jamie|b4cdaafd-615b-4a96-a615-2204c2928ece|jamie-tensei-kick|天晴脚|unique|gated|
|jamie|5784ac07-095a-4aa7-9ff3-56c0d9f5a767|jamie-phantom-sway-2|幻酔舞（2段目）|unique|gated|
|jamie|ef0ac821-3719-428f-976f-dce9b299453f|jamie-frame-021|幻酔舞（3段目）|unique|gated|
|jamie|f6d9a6c3-7b08-4120-b583-45d44a1dc0cd|jamie-frame-022|落星脚|unique|gated|
|jamie|5c2f017c-696c-44eb-b51a-290fd7689eca|jamie-frame-023|仙姑肘|unique|gated|
|jamie|36525340-b2f4-4174-aa3a-1d3344ef3a72|jamie-frame-024|旋影脚|unique|gated|
|jamie|f26f2513-191c-4990-bb59-27a3adb4ffe6|jamie-frame-025|鋭鍾打（1段目）|unique|gated|
|jamie|d8ab173e-e544-47d2-a48d-9edf8485caa1|jamie-frame-026|鋭鍾打（2段目）|unique|gated|
|jamie|e4683af2-100b-4048-be76-f973359e2cee|jamie-frame-027|鋭鍾打（3段目）|unique|gated|
|jamie|a5c9ecb4-3250-4f4f-8f0f-ae97b84a2236|jamie-frame-028|円月脚（1段目）|unique|gated|
|jamie|a0cad6db-9665-4401-ad74-707443c8e9f8|jamie-frame-029|円月脚（2段目）|unique|gated|
|jamie|1d42c55b-0dbe-44e1-aeaf-3f47f5d7d897|jamie-frame-030|円月脚（3段目）|unique|gated|
|jamie|efd0fe5c-0479-40c6-9dc7-e21b957e6d46|jamie-frame-031|酩酊襲（1段目）|unique|gated|
|jamie|fa88b001-1bde-4c67-9bc9-f3f472ba24fb|jamie-frame-032|酩酊襲（2段目）|unique|gated|
|jamie|ac2a2b6b-2587-45ed-9659-d70a0500c194|jamie-frame-033|酩酊襲（3段目）|unique|gated|
|jamie|0502bb55-cd67-4b9b-b964-e36c64640c76|jamie-frame-034|乱酔旋（1段目）|unique|gated|
|jamie|badf2c88-8b03-4a9d-bf5b-3623090ab005|jamie-frame-035|乱酔旋（2段目）|unique|gated|
|jamie|fb988464-1db7-481e-84ca-9b27a848845d|jamie-frame-036|乱酔旋（3段目/即派生）|unique|gated|
|jamie|7efd3e6d-5b75-4607-8f5d-bd0308ef6748|jamie-frame-037|乱酔旋（3段目/ディレイ派生）|unique|gated|
|jamie|62a9d028-e70a-401f-adc0-d4d131819f01|jamie-frame-038|乱酔旋（3段目/大幅ディレイ派生）|unique|gated|
|jamie|799268da-a1f2-4bb5-b016-6ea3035d2015|jamie-frame-039|魔身|special|gated|
|jamie|3b533de1-ae1a-420f-8f15-4af4722a171d|jamie-frame-040|弱 流酔拳（1段目）|special|gated|
|jamie|c4b68e7e-6984-4038-9947-4ed1cdcea1bc|jamie-frame-041|[酔いレベル4]弱 流酔拳（1段目）|special|gated|
|jamie|019bdfff-32b7-482c-8f8b-5732f94e1d11|jamie-frame-042|中 流酔拳（1段目）|special|gated|
|jamie|0b0016b3-2d95-4406-994b-a44332288da2|jamie-frame-043|[酔いレベル4]中 流酔拳（1段目）|special|gated|
|jamie|79b53785-4920-454d-a19d-fcb4a1c92484|jamie-frame-044|強 流酔拳（1段目）|special|gated|
|jamie|67678625-588d-48cf-b6a3-560abbd7c6fd|jamie-frame-045|[酔いレベル4]強 流酔拳（1段目）|special|gated|
|jamie|5bc11a28-bfb5-42a3-8cea-c0de5c6e9a6d|jamie-frame-046|OD 流酔拳（1段目）|special|gated|
|jamie|0a5e3f53-114e-42f3-b28c-9b349050b122|jamie-frame-047|[酔いレベル4]OD 流酔拳（1段目）|special|gated|
|jamie|82aa9cb3-b818-4fc4-834d-4a6ba9b24c73|jamie-frame-048|弱 流酔拳（2段目）|special|gated|
|jamie|b8a34856-9333-4ac3-96b6-50ceef7b37b3|jamie-frame-049|中 流酔拳（2段目）|special|gated|
|jamie|2aaa9d63-4550-4d71-bf6c-4c5df87a5b1f|jamie-frame-050|強 流酔拳（2段目）|special|gated|
|jamie|151a64be-a0a3-4d33-a365-4d9d0003573d|jamie-frame-051|[酔いレベル4]流酔拳（2段目）|special|gated|
|jamie|73aad740-5832-4cc5-885c-ab205eefdf33|jamie-frame-052|OD 流酔拳（2段目）|special|gated|
|jamie|76324203-2729-43eb-a88b-96e685c866dd|jamie-frame-053|[酔いレベル4]OD 流酔拳（2段目）|special|gated|
|jamie|cb48acfa-e4ee-4333-b56f-7eead5f5dfc7|jamie-frame-054|弱 流酔拳（3段目）|special|gated|
|jamie|81a15c63-d2a8-42c1-bc71-0fa1e65161e4|jamie-frame-055|中 流酔拳（3段目）|special|gated|
|jamie|8ae7fe45-3c72-436e-9e85-b5882cf087f6|jamie-frame-056|強 流酔拳（3段目）|special|gated|
|jamie|aa3eb346-3223-4c5a-a656-38f4415a6dd6|jamie-frame-057|[酔いレベル4]流酔拳（3段目）|special|gated|
|jamie|1ced196c-8e15-4790-9550-1cd910dcd95b|jamie-frame-058|OD 流酔拳（3段目）|special|gated|
|jamie|92e71da8-94a6-4662-8c4f-5186717232f8|jamie-frame-059|[酔いレベル4]OD 流酔拳（3段目）|special|gated|
|jamie|a9302ed3-1ae5-4be5-87c9-50593f9d087b|jamie-frame-060|弱 流酔脚（2段目）|special|gated|
|jamie|44dacea9-4ab9-4822-a1a1-2b99ada589d4|jamie-frame-061|中 流酔脚（2段目）|special|gated|
|jamie|07143e70-6be6-4482-b460-de2d188d9972|jamie-frame-062|強 流酔脚（2段目）|special|gated|
|jamie|4d7c0cbb-2175-4842-a649-eca5509926b0|jamie-frame-063|OD 流酔脚（2段目）|special|gated|
|jamie|8e8fb3e1-1ea3-45f3-a45e-676501283480|jamie-frame-064|弱 流酔脚（3段目）|special|gated|
|jamie|b709189a-a67d-4159-b4ac-372347bcf630|jamie-frame-065|中 流酔脚（3段目）|special|gated|
|jamie|86dc76eb-8e1b-414c-b96f-5e9eb0917e03|jamie-frame-066|強 流酔脚（3段目）|special|gated|
|jamie|a11294ed-d6ed-4e31-bd2f-5c9d48e8f042|jamie-frame-067|OD 流酔脚（3段目）|special|gated|
|jamie|1e5f905e-a6a5-43f1-8cd1-bf37f259db74|jamie-frame-068|弱 酔疾歩|special|gated|
|jamie|72e3f075-1c90-4950-b2e4-dc6526b7c319|jamie-frame-069|中 酔疾歩|special|gated|
|jamie|69fe67f1-3464-4ad7-a599-b1db4b78a4b0|jamie-frame-070|強 酔疾歩|special|gated|
|jamie|84186a7c-5e38-42d8-9d4c-8372b1f83a8e|jamie-frame-071|OD 酔疾歩|special|gated|
|jamie|35eaf7e4-dd6e-43a7-afa4-aa207971a336|jamie-frame-072|弱 張弓腿|special|gated|
|jamie|f118f5a2-8d4c-4622-bcf6-fcd3ea915709|jamie-frame-073|中 張弓腿|special|gated|
|jamie|34d6227b-d156-4929-842e-ff1a034f3424|jamie-frame-074|強 張弓腿|special|gated|
|jamie|c2316766-56c8-4381-893f-0341e3a91c83|jamie-frame-075|OD 張弓腿|special|gated|
|jamie|d38b6a9d-6ad9-43ba-bf10-8b97275d3a4b|jamie-frame-076|弱 無影蹴|special|gated|
|jamie|e8c4c6d3-c300-47ae-b94e-5051826ecf29|jamie-frame-077|中 無影蹴|special|gated|
|jamie|69a093f4-92da-44a6-a659-ac11f1ee2f4a|jamie-frame-078|強 無影蹴|special|gated|
|jamie|56e9221a-75ee-4a4a-8295-2c23cd60ce38|jamie-frame-079|OD 無影蹴|special|gated|
|jamie|463834e8-201b-4a0c-a3b7-dc0257089c46|jamie-frame-080|弱 爆廻|special|gated|
|jamie|af159fff-39b2-4255-9c59-748e66e56203|jamie-frame-081|中 爆廻|special|gated|
|jamie|299f160e-cafb-43b6-9619-35f1dd864f6d|jamie-frame-082|強 爆廻|special|gated|
|jamie|f0e84925-ec36-42dd-8fca-75c7e87712ef|jamie-frame-083|OD 爆廻|special|gated|
|jamie|7bc4a79d-75dd-4a7a-95fe-ed02c344b8b9|jamie-frame-084|点辰|special|gated|
|jamie|47f2b44d-7d51-49f0-866e-6a2e1b5648ff|jamie-frame-085|OD 点辰|special|gated|
|jamie|0c0fadbb-c919-414e-8989-4d8646a189b2|jamie-frame-086|疾歩仙掌|special|gated|
|jamie|b4eb57f6-68e4-4332-8966-6ef9b0a500bb|jamie-frame-087|OD 疾歩仙掌|special|gated|
|jamie|e395af47-aedc-467e-b4cb-2aa5c112c348|jamie-frame-088|SA1 武麗禽|super|gated|
|jamie|99b9dbf0-5322-4397-bd1f-976a60965a2d|jamie-frame-089|SA2 絶唱魔身|super|gated|
|jamie|96b29319-40fe-4f5b-8d8c-cf923cae7dc2|jamie-frame-090|SA3 月牙叉炮|super|gated|
|jamie|634d738b-026c-4414-9e20-303468bd83bc|jamie-frame-091|CA 月牙叉炮|super|gated|
|jamie|21a4b863-0c4b-4dae-8300-a6c09765f380|jamie-frame-092|背剪手|throw|gated|
|jamie|a55bf301-744e-4439-966c-a26065fe9983|jamie-frame-093|転輪衝|throw|gated|
|chun-li|e8627cc1-85c3-4fae-a9ef-784311e4ce8d|chun-li-standing-lp|立ち弱P（手突）|normal|gated|
|chun-li|1d9a313e-8b88-445e-b8cd-896165c27123|chun-li-standing-lk|立ち弱K（斧刃脚）|normal|gated|
|chun-li|393af232-0ab0-40c0-86dc-096819601e19|chun-li-standing-mp|立ち中P（頸穿刀）|normal|gated|
|chun-li|64f4a965-b6ba-4df0-9e20-c7dc9b1db299|chun-li-standing-mk|立ち中K（外擺脚）|normal|gated|
|chun-li|b1d5ec50-b033-43f4-b034-eb8ccbe7c4b2|chun-li-standing-hp|立ち強P（顎狙突拳）|normal|gated|
|chun-li|1abb4304-2025-4fd0-867e-bb42c1223945|chun-li-standing-hk|立ち強K（前周脚）|normal|gated|
|chun-li|6ad4630c-772b-4a95-b58b-a9538d5ea0e3|chun-li-crouching-lp|しゃがみ弱P（尖打）|normal|gated|
|chun-li|73f3ddfa-144b-45fa-8ecf-6f447186af20|chun-li-crouching-lk|しゃがみ弱K（前掃腿）|normal|gated|
|chun-li|eeda3e0e-f3e0-461f-a0c2-786bc22ca7c4|chun-li-crouching-mp|しゃがみ中P（丹頂拳）|normal|gated|
|chun-li|0bcdfe25-fd6d-44f2-9022-ec61223039d5|chun-li-crouching-mk|しゃがみ中K（後掃旋腿）|normal|gated|
|chun-li|99211c78-82ab-49ba-b508-e020d0c057a2|chun-li-crouching-hp|しゃがみ強P（孔雀掌）|normal|gated|
|chun-li|9970b2ed-0620-4f0c-802c-7f3aa70ef085|chun-li-crouching-hk|しゃがみ強K（元伝暗殺蹴）|normal|gated|
|chun-li|5fc475ca-207b-49f2-9489-7c16d4aad5db|chun-li-jump-lp|ジャンプ弱P（鶴嘴拳）|normal|gated|
|chun-li|71252786-a5ad-45b4-92f9-bbf0b879f5cb|chun-li-jump-lk|ジャンプ弱K（鶴脚打）|normal|gated|
|chun-li|86f4031d-8472-4ac2-8425-725e925bec5c|chun-li-jump-mp|ジャンプ中P（落昇旋）|normal|gated|
|chun-li|24182c23-c657-4ea8-b722-90a1e8ba3ac5|chun-li-jump-mk|ジャンプ中K（飛翔脚）|normal|gated|
|chun-li|4f9ca18b-c107-40b6-be86-38582a638e68|chun-li-jump-hp|ジャンプ強P（鷹嘴拳）|normal|gated|
|chun-li|b99276eb-6300-4769-9ae5-7552ea21c134|chun-li-jump-hk|ジャンプ強K（鷹翔脚）|normal|gated|
|chun-li|8ced9bfd-a69f-413a-bc27-e582fd1ef4e0|chun-li-frame-019|垂直ジャンプ強K（鶴翼脚）|normal|gated|
|chun-li|2f291a3a-d379-43b6-a234-8556e09e4807|chun-li-frame-020|追突拳|unique|gated|
|chun-li|5c254fcf-742b-4943-bdb8-1ab6ae4252f5|chun-li-frame-021|発勁|unique|gated|
|chun-li|79ad4b40-7310-4a64-b95d-747e29ad2d98|chun-li-frame-022|水蓮掌|unique|gated|
|chun-li|be037c8d-e9ce-45f1-8a0b-5494d83782f0|chun-li-frame-023|翼旋脚|unique|gated|
|chun-li|4709702f-164e-4dcb-b1a4-c7b553014a83|chun-li-frame-024|鶴脚落|unique|gated|
|chun-li|89db0d36-7b4b-49ba-a0bd-7a31f38da407|chun-li-frame-025|鷹爪脚（1段目）|unique|gated|
|chun-li|17afcb64-90cc-464b-bb9b-37530e74aa01|chun-li-frame-026|鷹爪脚（2段目）|unique|gated|
|chun-li|39e0489f-53c9-4849-ac1f-219e126cb6af|chun-li-frame-027|鷹爪脚（3段目）|unique|gated|
|chun-li|c061710c-e6ad-4638-86dc-90dd3161adda|chun-li-frame-028|鷹嘴連拳|unique|gated|
|chun-li|61e12281-6b2b-4931-9163-dc77d196321f|chun-li-frame-029|行雲流水|unique|gated|
|chun-li|52ca0735-edcb-499d-a86c-087ff92d17e4|chun-li-frame-030|蘭華|unique|gated|
|chun-li|fd169d58-eb76-4351-98f7-d9a7ab5a4315|chun-li-frame-031|這蛇突|unique|gated|
|chun-li|d8cacb41-0dd4-4885-8c66-c8cee9ed1203|chun-li-frame-032|蓮掌|unique|gated|
|chun-li|ad39b1e8-9c40-4a62-86ab-fdbbbfa87538|chun-li-frame-033|前突|unique|gated|
|chun-li|173b6fc5-0334-4549-84c8-f6bfaba51a1e|chun-li-frame-034|仙風|unique|gated|
|chun-li|9a9c2466-c6f3-4657-ac3a-56a00788660a|chun-li-frame-035|天空脚|unique|gated|
|chun-li|8b0cdb1e-7700-4d9e-8500-d1b4fd6ecb03|chun-li-frame-036|弱 気功拳|special|gated|
|chun-li|a909b9fc-6ecc-451d-89f3-10b412db7274|chun-li-frame-037|中 気功拳|special|gated|
|chun-li|9ff85b4b-dea0-4bcd-8494-b3fb91e33da5|chun-li-frame-038|強 気功拳|special|gated|
|chun-li|56ce157e-4f2b-4d29-bbbe-8479944e556c|chun-li-frame-039|OD 気功拳|special|gated|
|chun-li|e978ab6b-689f-45ec-9ee7-dcdb7b2c7944|chun-li-frame-040|弱 百裂脚|special|gated|
|chun-li|67766141-a64b-4992-94f9-254fea18d9d0|chun-li-frame-041|中 百裂脚|special|gated|
|chun-li|ea7c4150-6273-4330-8537-7b4660380306|chun-li-frame-042|強 百裂脚|special|gated|
|chun-li|768b50d3-4e24-45ae-8b2d-4913bf12fd8e|chun-li-frame-043|OD 百裂脚|special|gated|
|chun-li|70690fc1-0236-4be5-946e-db8c0a3e47d5|chun-li-frame-044|百裂連脚|special|gated|
|chun-li|3b3fcce0-ee7a-4b34-8069-05bf3be3fba1|chun-li-frame-045|弱 空中百裂脚|special|gated|
|chun-li|5ec2d77a-ba11-4a4c-b970-bc3aea2859b9|chun-li-frame-046|中 空中百裂脚|special|gated|
|chun-li|25e37a56-bce0-4392-be4d-dadf28734203|chun-li-frame-047|強 空中百裂脚|special|gated|
|chun-li|fc7a9212-57ab-4c0e-bc42-d06bbeb0af86|chun-li-frame-048|OD 空中百裂脚|special|gated|
|chun-li|06a21273-49a1-463f-acb8-00bada1968ff|chun-li-frame-049|弱 スピニングバードキック|special|gated|
|chun-li|3d3d4362-3ed8-464f-a2ac-4fa43aafff06|chun-li-frame-050|中 スピニングバードキック|special|gated|
|chun-li|8fa46e96-6a3d-4add-bcd7-2076aad1f28a|chun-li-frame-051|強 スピニングバードキック|special|gated|
|chun-li|8b60879a-34a4-4aec-91a1-242bbb4d14a2|chun-li-frame-052|OD スピニングバードキック|special|gated|
|chun-li|9a528eee-a921-4512-ada2-06e4fe173309|chun-li-frame-053|弱 覇山蹴|special|gated|
|chun-li|9fee4ec6-b602-4def-9138-323955d2b84c|chun-li-frame-054|中 覇山蹴|special|gated|
|chun-li|cdad9998-0647-4a0b-a6f1-0c5d471205cc|chun-li-frame-055|強 覇山蹴|special|gated|
|chun-li|0b69ef83-7dd3-45d2-b1b2-8ad4fe64afd2|chun-li-frame-056|OD 覇山蹴|special|gated|
|chun-li|b57d054e-699b-49fc-9c1a-b2d847982a70|chun-li-frame-057|弱 天昇脚|special|gated|
|chun-li|8bc1525c-e5a5-476a-9f7a-a8b4b6952296|chun-li-frame-058|中 天昇脚|special|gated|
|chun-li|75516fe6-7e94-4d92-ba10-ecbd8fe1207a|chun-li-frame-059|強 天昇脚|special|gated|
|chun-li|b3ca5889-5aeb-4302-9d2d-7fe2fa9b4c67|chun-li-frame-060|OD 天昇脚|special|gated|
|chun-li|fa887b11-c8d8-400e-b124-3c25cd0f26ad|chun-li-frame-061|SA1 気功掌|super|gated|
|chun-li|172b1493-a2b6-4ea5-a53a-a05ea5e09650|chun-li-frame-062|SA1 空中気功掌|super|gated|
|chun-li|39e0a24d-465d-4c91-821f-1f5f9c9ef455|chun-li-frame-063|SA2 鳳翼扇|super|gated|
|chun-li|80c4ce4d-cb16-43d7-9018-521fa1198972|chun-li-frame-064|SA3 蒼天乱華|super|gated|
|chun-li|b3d58f88-f945-42ed-af7d-755714b20832|chun-li-frame-065|CA 蒼天乱華|super|gated|
|chun-li|6b5687c5-02d7-4214-8df6-30587b3e6cd1|chun-li-frame-066|虎襲倒|throw|gated|
|chun-li|9bc191ba-9467-4532-aaa9-1df05fecab11|chun-li-frame-067|太極扇|throw|gated|
|chun-li|fd80aded-a75d-4608-a275-82303a0d49bd|chun-li-frame-068|龍星落|throw|gated|
|guile|54825ebd-956d-423f-8d56-545945ee5264|guile-standing-lp|立ち弱P （ジャブ）|normal|gated|
|guile|1d15814f-fa50-4bff-b32c-cecbda3ad37e|guile-standing-lk|立ち弱K （ムエタイキック）|normal|gated|
|guile|5204df41-a931-4575-bff0-3f6d9bdc7f4c|guile-standing-mp|立ち中P （フック）|normal|gated|
|guile|0b18ff54-42ac-4aaf-ae99-5e4badee39ab|guile-standing-mk|立ち中K （トラースキック）|normal|gated|
|guile|fc57e736-cdfc-4326-9961-901f63d7904d|guile-standing-hp|立ち強P （サイクロンフック）|normal|gated|
|guile|6e4dc541-1a4e-4dbb-bdf9-375e60a720a8|guile-standing-hk|立ち強K （ヘビースタブキック）|normal|gated|
|guile|1cd2dd5a-d632-4f1e-a128-c814c002846d|guile-crouching-lp|しゃがみ弱P （ジャブ）|normal|gated|
|guile|f4adb986-f821-472a-9e0c-c1945f957c91|guile-crouching-lk|しゃがみ弱K （キック）|normal|gated|
|guile|6694999b-3d3b-4f69-9f1d-d419c46a5651|guile-crouching-mp|しゃがみ中P （ストレート）|normal|gated|
|guile|f1504cab-28b2-4d6c-ae4e-6338acb17041|guile-crouching-mk|しゃがみ中K （スライドスイープ）|normal|gated|
|guile|e2de7a85-52d4-4f97-b814-ed5e68687628|guile-crouching-hp|しゃがみ強P （リフトアッパー）|normal|gated|
|guile|c687eca2-108d-46a8-aee5-e32beb47e7c9|guile-crouching-hk|しゃがみ強K （ドラゴンスイープ）|normal|gated|
|guile|de67e7d0-be9a-4696-89dd-1ec2cfcebd66|guile-jump-lp|ジャンプ弱P （ジャンプパンチ）|normal|gated|
|guile|2f49252a-2e1f-4e01-8537-2d5f44ea1acd|guile-jump-lk|ジャンプ弱K （ジャンピングニーアタック）|normal|gated|
|guile|8153e082-daca-4e51-ae51-61e705150be3|guile-jump-mp|ジャンプ中P （ジャンプストレート）|normal|gated|
|guile|6e8b1005-078d-48a0-b18b-998ac9cfcbf4|guile-jump-mk|ジャンプ中K （ガイルキック）|normal|gated|
|guile|61dfcdd2-d807-4ee4-8c60-ce890cd4fee5|guile-jump-hp|ジャンプ強P （ジャンプチョップ）|normal|gated|
|guile|fc2abf30-f6d7-4bf8-9d79-aef1a7e17c2b|guile-jump-hk|ジャンプ強K （アンチラウンドキック）|normal|gated|
|guile|ae967ade-1e0f-4c68-9629-dee2cf9b6a9c|guile-frame-019|フルブレットマグナム|unique|gated|
|guile|d630ea05-174c-48f2-b653-8500dd8890c2|guile-frame-020|バーンストレート|unique|gated|
|guile|f4e7dcb5-1d19-4af5-a15c-89fe32e9bbdc|guile-frame-021|スピニングバックナックル|unique|gated|
|guile|c7f58c93-34da-4c9d-9b5d-f2721c5f346e|guile-frame-022|ニーバズーカ|unique|gated|
|guile|38c00b79-1916-4713-be8e-afd2f2a3e3ea|guile-frame-023|ローリングソバット|unique|gated|
|guile|5fdc1648-ad0c-46fb-8ed1-2024ab7c3299|guile-frame-024|ローリングソバット|unique|gated|
|guile|e6e317ae-3c15-427f-b4fc-e045af8926ba|guile-frame-025|リバーススピンキック|unique|gated|
|guile|b1f22c32-f7aa-498c-a741-ebeff785a9ee|guile-frame-026|ガイルハイキック|unique|gated|
|guile|349656c2-30af-4e8f-a03c-e34d31031341|guile-frame-027|リコイルキャノン|unique|gated|
|guile|a8c33edf-0fac-4fb4-b3b5-3c5a23c4547c|guile-frame-028|ダブルバレット|unique|gated|
|guile|1f63b071-26b8-4159-ba3d-18f16513de9f|guile-frame-029|ドレイクファング|unique|gated|
|guile|f9d3b89c-db5f-4c1f-af75-059f23ab2082|guile-frame-030|ファントムカッター|unique|gated|
|guile|4c009090-13ed-46c3-9751-5c7eded76507|guile-frame-031|弱 ソニックブーム|special|gated|
|guile|9f95c9ef-c12a-46c6-808b-5a9faf9c9f44|guile-frame-032|【ジャスト】 弱 ソニックブーム|special|gated|
|guile|2dabcaff-0024-4c40-8ff6-0399e3eb6e5d|guile-frame-033|中 ソニックブーム|special|gated|
|guile|8c89a3fd-d6f7-4390-9c20-ed4e0d44c91e|guile-frame-034|【ジャスト】 中 ソニックブーム|special|gated|
|guile|03f728d7-47d8-452b-bd67-61cd925bde33|guile-frame-035|強 ソニックブーム|special|gated|
|guile|a91413b5-6e55-498d-b010-e6d0b2bf24a5|guile-frame-036|【ジャスト】 強 ソニックブーム|special|gated|
|guile|9887a4fc-5935-4d09-9504-a326f6d3640e|guile-frame-037|OD ソニックブーム|special|gated|
|guile|cbc187f2-53f7-4075-a555-f51bd443bddf|guile-frame-038|弱 サマーソルトキック|special|gated|
|guile|691fc93c-afe9-4390-ae5e-aa8a49de482d|guile-frame-039|【ジャスト】 弱 サマーソルトキック|special|gated|
|guile|64c6f070-1497-4852-bc19-18c051a346c2|guile-frame-040|中 サマーソルトキック|special|gated|
|guile|83ad9057-9361-4de0-93f5-f3e3353105ac|guile-frame-041|【ジャスト】 中 サマーソルトキック|special|gated|
|guile|e9f02f89-e447-4d3d-95ba-a7062d5587b3|guile-frame-042|強 サマーソルトキック|special|gated|
|guile|40c95b20-76f0-4056-ae56-fee47784f3a9|guile-frame-043|【ジャスト】 強 サマーソルトキック|special|gated|
|guile|94e9ef6b-c696-4c51-baef-f49af33bf7f2|guile-frame-044|OD サマーソルトキック|special|gated|
|guile|89e18dc9-6db0-4e6e-a45d-519b0fdaa637|guile-frame-045|弱 ソニックブレイド|special|gated|
|guile|f9e2220a-b22e-43bd-99ea-42821c0d7356|guile-frame-046|中 ソニックブレイド|special|gated|
|guile|4c7b48f0-96a7-47eb-a600-1c2f6c26eb13|guile-frame-047|強 ソニックブレイド|special|gated|
|guile|302938a5-54f8-4d9e-8fed-f66b2b660118|guile-frame-048|OD 弱 ソニックブレイド|special|gated|
|guile|feb68d91-3737-4e4f-bcbd-2db7cb578918|guile-frame-049|OD 中 ソニックブレイド|special|gated|
|guile|e59fdd50-65ac-4fad-a808-8fbfc6ddb30d|guile-frame-050|OD 強 ソニックブレイド|special|gated|
|guile|fc35dd7b-6e42-40e9-abb0-2c0ca7204ff4|guile-frame-051|弱 ソニッククロス|special|gated|
|guile|443bd3e9-752c-4892-8ab8-03611d5bebcd|guile-frame-052|【ジャスト】弱 ソニッククロス|special|gated|
|guile|241b05ea-6c27-421e-b319-b180254fe22c|guile-frame-053|中 ソニッククロス|special|gated|
|guile|4fcd5dbf-d7e5-4f21-90c0-beccf9c9c1ff|guile-frame-054|【ジャスト】中 ソニッククロス|special|gated|
|guile|e5e2834c-719e-49d0-9825-960016c2420c|guile-frame-055|強 ソニッククロス|special|gated|
|guile|c0e4ec44-f717-459b-bca7-a217f5526c27|guile-frame-056|【ジャスト】強 ソニッククロス|special|gated|
|guile|5221d873-9622-4b06-8c4e-8a7a4b1f4e66|guile-frame-057|OD ソニッククロス１|special|gated|
|guile|391b8749-da29-4f20-8200-890f70630fe4|guile-frame-058|OD ソニッククロス２|special|gated|
|guile|d7f9d9d8-be24-4aad-ae5e-1b80cb97796f|guile-frame-059|ソニックブレイク （単発）|special|gated|
|guile|6381b41d-61db-4e15-8f44-b506ac5182be|guile-frame-060|ソニックブレイク （派生）|special|gated|
|guile|f1c04eaf-50f1-47b5-b5df-8bf4bc99e05f|guile-frame-061|OD ソニックブレイク|special|gated|
|guile|7fef2076-927c-4f5c-a765-a155350ee8b6|guile-frame-062|SA1 ソニックハリケーン （上）|super|gated|
|guile|68472c76-2eb3-4fdb-83e9-9e55fef5b76e|guile-frame-063|SA1 ソニックハリケーン （横）|super|gated|
|guile|1d634ae8-f10b-4791-9ee5-4ebd401872d4|guile-frame-064|SA2 ソリッドパンチャー|super|gated|
|guile|6d2fde80-170a-494f-b597-63272da2dd1f|guile-frame-065|SA3 クロスファイアサマーソルト|super|gated|
|guile|d02dfb2e-74a8-409f-b220-3efb3d18772a|guile-frame-066|CA クロスファイアサマーソルト|super|gated|
|guile|815bf11c-4392-4df2-93f6-646e6f6e776b|guile-frame-067|ドラゴンスープレックス|throw|gated|
|guile|f5980889-233a-4ed9-819d-594703955bf2|guile-frame-068|ジュードースルー|throw|gated|
|guile|cafad44f-9cf0-4b50-9e47-48d038deefda|guile-frame-069|フライングメイヤー|throw|gated|
|guile|b41c4eb5-c444-4159-b985-e63fe60a10ed|guile-frame-070|フライングバスタードロップ|throw|gated|
|kimberly|a33df303-ebf6-438b-be62-be5b8691ef37|kimberly-standing-lp|立ち弱P（裏拳）|normal|gated|
|kimberly|605041a7-b14a-40df-b75d-6146328f440b|kimberly-standing-lk|立ち弱K（抜刀蹴）|normal|gated|
|kimberly|fabb99ac-9c91-41cd-b684-218f23d70dc1|kimberly-standing-mp|立ち中P（胴突き）|normal|gated|
|kimberly|1b98b621-ccb0-4166-a648-90a36c2946d4|kimberly-standing-mk|立ち中K（刹那蹴り）|normal|gated|
|kimberly|d1dceb60-9f98-43a2-8c86-07be7992eb10|kimberly-standing-hp|立ち強P（旋回手刀）|normal|gated|
|kimberly|27f91611-cdfb-4097-ab75-40e98f30a0fb|kimberly-standing-hk|立ち強K（旋風蹴り）|normal|gated|
|kimberly|45a8e57a-d830-48b2-819e-8374be5f27b2|kimberly-crouching-lp|しゃがみ弱P（裏拳）|normal|gated|
|kimberly|3adca60a-db7a-414f-bf43-4283b667f26e|kimberly-crouching-lk|しゃがみ弱K（連撃蹴）|normal|gated|
|kimberly|4edb65fb-afac-4169-ae96-eb57449742e1|kimberly-crouching-mp|しゃがみ中P（水平手刀）|normal|gated|
|kimberly|a3a16df6-c655-4dd2-ab22-096ade3828b6|kimberly-crouching-mk|しゃがみ中K（脛割り）|normal|gated|
|kimberly|fdda12de-202b-4052-9c48-a264b45ecbb8|kimberly-crouching-hp|しゃがみ強P（肘打ち）|normal|gated|
|kimberly|cd6d4988-9ea8-4498-a5b1-33ceaea77a75|kimberly-crouching-hk|しゃがみ強K（水面蹴り）|normal|gated|
|kimberly|4ac80d7f-840f-4f8a-bc92-09bb18877f34|kimberly-frame-013|ジャンプ弱P（空平手）|normal|gated|
|kimberly|5381cbfd-c2ff-4adf-8f0f-a4b3da2d2a4b|kimberly-frame-014|ジャンプ弱K（跳び膝）|normal|gated|
|kimberly|5f164e6c-9f9b-4fde-ae41-123878488eef|kimberly-frame-015|ジャンプ中P（空裏拳）|normal|gated|
|kimberly|ef4adca8-d007-45d8-ac18-5abb7c67d231|kimberly-frame-016|ジャンプ中K（会心脚）|normal|gated|
|kimberly|101ed893-5f2b-46c9-b952-1ef9e3c3bc21|kimberly-frame-017|ジャンプ強P（空肘打ち）|normal|gated|
|kimberly|8ec8eb18-dc34-48b2-81ac-457b3f66b0da|kimberly-frame-018|ジャンプ強K（旋回蹴り）|normal|gated|
|kimberly|2700f15b-3747-421d-a94d-b8611a9c0758|kimberly-frame-019|水切り蹴り|unique|gated|
|kimberly|9cb9f81b-da33-49bd-80aa-6251fb1eafa0|kimberly-frame-020|風車|unique|gated|
|kimberly|7cb0de6b-0b0b-4dfe-bc6c-0d99bca881a4|kimberly-frame-021|飛箭蹴|unique|gated|
|kimberly|34f3683e-d7fb-4965-a1b0-20f5d8d87ac5|kimberly-frame-022|矢来越え|unique|gated|
|kimberly|3ada19ee-592c-4fed-a23a-f415c6afea7e|kimberly-frame-023|肘落とし|unique|gated|
|kimberly|3f6a6eb5-b9fe-4d92-83ad-567dc4ccc4cc|kimberly-frame-024|武神虎連牙|unique|gated|
|kimberly|8a91770c-7bff-4fe5-bafc-075d175d0f24|kimberly-frame-025|武神天架拳（2段目）|unique|gated|
|kimberly|1b94e89a-3ecf-44bf-a386-8f8c823cc52c|kimberly-frame-026|武神天架拳（3段目）|unique|gated|
|kimberly|77961bdf-49d2-459b-bed1-f945abda8292|kimberly-frame-027|武神天架拳（4段目）|unique|gated|
|kimberly|8b1a0a65-9840-4a07-b785-dd9e120331b1|kimberly-frame-028|武神獄鎖拳（3段目）|unique|gated|
|kimberly|c27fc472-b956-46f4-b93f-7a05b4b14df9|kimberly-frame-029|武神獄鎖拳（4段目）|unique|gated|
|kimberly|12120087-78d0-43bf-8272-c924255b04fe|kimberly-frame-030|武神獄鎖投げ|unique|gated|
|kimberly|b8d37824-f105-4b3d-9b6a-6953a9b3cfa7|kimberly-frame-031|弱 武神旋風脚|special|gated|
|kimberly|7af1795b-62dd-4544-83d1-a321d28345d1|kimberly-frame-032|中 武神旋風脚|special|gated|
|kimberly|674819e2-23fb-4579-84c8-8d6aedbb319d|kimberly-frame-033|強 武神旋風脚|special|gated|
|kimberly|8474bc48-410d-422e-98d7-8cab99b9c3e6|kimberly-frame-034|OD 武神旋風脚|special|gated|
|kimberly|cb7a0dac-3c05-47db-a32e-2a0551b7d20b|kimberly-frame-035|空中武神旋風脚|special|gated|
|kimberly|fc64cbd4-0202-40ee-b936-97baad4592ca|kimberly-frame-036|OD 空中武神旋風脚|special|gated|
|kimberly|c724f0ae-dffb-4afc-9ea3-e315b81c0d5d|kimberly-frame-037|疾駆け|special|gated|
|kimberly|88033ae3-3e0d-47b3-ae03-272023880ca6|kimberly-frame-038|OD 疾駆け|special|gated|
|kimberly|60a09c4f-d5e4-436a-9b27-f454edd44359|kimberly-frame-039|急停止|special|gated|
|kimberly|ad87f835-3557-4069-a387-f3fff79f1734|kimberly-frame-040|OD 急停止|special|gated|
|kimberly|965a8ec6-46ec-407c-8418-2520ecdb6eed|kimberly-frame-041|胴刎ね|special|gated|
|kimberly|5cd7c3d3-df99-435e-b8b2-0754a7a26e97|kimberly-frame-042|OD 胴刎ね|special|gated|
|kimberly|bd469470-3f81-4412-902f-09922d376196|kimberly-frame-043|影すくい|special|gated|
|kimberly|e7688ace-f44a-4e7d-b579-ce72f1df54cb|kimberly-frame-044|OD 影すくい|special|gated|
|kimberly|434b2cc0-a157-456c-911a-4d77c42e2ae4|kimberly-frame-045|首狩り|special|gated|
|kimberly|5e8d161a-51ca-4991-a6ce-313bdb134723|kimberly-frame-046|OD 首狩り|special|gated|
|kimberly|cbb4223a-a290-4946-bb5a-021010e68923|kimberly-frame-047|弧空|special|gated|
|kimberly|0bc64602-0d02-4049-907b-4df7d2b96542|kimberly-frame-048|OD 弧空|special|gated|
|kimberly|9a085f69-cdf5-4375-be46-cce6f6569056|kimberly-frame-049|武神イズナ落とし|special|gated|
|kimberly|cba8b8fc-9a17-4eb3-aa86-94d1c4cccf5b|kimberly-frame-050|OD 武神イズナ落とし|special|gated|
|kimberly|b6511fdb-a5c1-40ff-a5d1-9f457636dcdd|kimberly-frame-051|武神鉾刃脚|special|gated|
|kimberly|6db3544a-df12-4be9-b585-ddf1652ab880|kimberly-frame-052|OD 武神鉾刃脚|special|gated|
|kimberly|64885448-37ed-4e4d-86e3-6ba61c672202|kimberly-frame-053|弱 流転一文字|special|gated|
|kimberly|2ea98501-ef65-4a1c-8e02-91250859825e|kimberly-frame-054|中 流転一文字|special|gated|
|kimberly|f8320cbf-d12f-40c3-af5e-3306a6a8660f|kimberly-frame-055|強 流転一文字|special|gated|
|kimberly|34df6046-c6c8-4eae-b368-dd38847fc25f|kimberly-frame-056|OD 流転一文字|special|gated|
|kimberly|e297937e-6a0b-4ee6-80c5-d468ad554632|kimberly-frame-057|彩隠形|special|gated|
|kimberly|b6ef3b5e-6e5f-4372-b782-81016cf80d48|kimberly-frame-058|OD 彩隠形|special|gated|
|kimberly|dca425fc-d8c6-4395-8fc1-fed18e7d54d4|kimberly-frame-059|召雷細工|special|gated|
|kimberly|f6a3ade1-5b2b-44c5-9a78-9c5f32ac136e|kimberly-frame-060|OD 召雷細工|special|gated|
|kimberly|c226c305-4d85-421d-8461-ceb46e619dda|kimberly-frame-061|弱 細工手裏剣|special|gated|
|kimberly|93a9c0ac-552d-4b29-8a88-86a5e9a29689|kimberly-frame-062|中 細工手裏剣|special|gated|
|kimberly|fbe7eb9f-ec4d-436a-8f8c-0b38b0e7760a|kimberly-frame-063|強 細工手裏剣|special|gated|
|kimberly|8f23066e-ec2d-41d6-aa5f-8dcd892c9025|kimberly-frame-064|弱 乱れ細工手裏剣|special|gated|
|kimberly|8a25ea74-8b68-43d4-873e-1a117d51104a|kimberly-frame-065|中 乱れ細工手裏剣|special|gated|
|kimberly|f21d57c9-88e5-41b3-919e-f14db0df3519|kimberly-frame-066|強 乱れ細工手裏剣|special|gated|
|kimberly|6d2ef0ae-1812-40d8-9bd6-4ac5e5677572|kimberly-frame-067|荒鵺捻り|special|gated|
|kimberly|e93af4aa-3c38-44a9-8cba-8ced80a54fb9|kimberly-frame-068|OD 荒鵺捻り|special|gated|
|kimberly|6d62007b-10b1-4044-a12f-81c130faf380|kimberly-frame-069|SA1 武神乱拍子|super|gated|
|kimberly|8b3c2aa5-1b0a-4a57-a17b-45ad3967e295|kimberly-frame-070|SA1 武神乱拍子・雷譜|super|gated|
|kimberly|f9e44256-9c24-4b19-a4d9-85ea9b0df28b|kimberly-frame-071|SA2 武神天翔亢竜|super|gated|
|kimberly|183a7882-7c0a-4e06-8131-4edc78fa7d32|kimberly-frame-072|SA2 空中武神天翔亢竜|super|gated|
|kimberly|647d632d-ac43-4b1e-bb46-71486b21cb34|kimberly-frame-073|SA3 武神顕現神楽|super|gated|
|kimberly|a0eb1293-54bf-4b21-924a-4ba507fbcd53|kimberly-frame-074|CA 武神顕現神楽|super|gated|
|kimberly|f34fea41-3cef-42d1-9b59-318d3d58dd8b|kimberly-frame-075|縄掛背負い|throw|gated|
|kimberly|3f3aefa2-b47e-49bb-85eb-82d5f4e2588c|kimberly-frame-076|鍾打巴|throw|gated|
|juri|67327dc0-faeb-419b-ab35-0a006ca1fc21|juri-standing-lp|立ち弱P|normal|gated|
|juri|6805e9b9-a136-4b38-b91a-9a8b9854afa3|juri-standing-mp|立ち中P|normal|gated|
|juri|bb2f57bb-6a4b-4c81-ab6c-1315ea7433f3|juri-standing-hp|立ち強P|normal|gated|
|juri|31e7f452-d59f-4ff8-9c6e-6e4b0d4839b6|juri-standing-lk|立ち弱K|normal|gated|
|juri|0f570ab6-a5d5-469d-9a18-fea8f85b3962|juri-standing-mk|立ち中K|normal|gated|
|juri|6eec0561-3a94-44e2-83f5-7f7b408cc3f9|juri-standing-hk|立ち強K|normal|gated|
|juri|d0b3f714-9b4b-45fa-a223-dcf772f3c1d4|juri-crouching-lp|しゃがみ弱P|normal|gated|
|juri|e0df78eb-f4eb-4b61-b5ff-c8c194ded0b2|juri-crouching-mp|しゃがみ中P|normal|gated|
|juri|5e48fac3-fa32-4536-8e2d-bf0570cb98cb|juri-crouching-hp|しゃがみ強P|normal|gated|
|juri|2b16c519-2cc7-4164-8f26-8cf28eeb4c42|juri-crouching-lk|しゃがみ弱K|normal|gated|
|juri|501c9852-448b-434a-96fc-f9227225f89c|juri-crouching-mk|しゃがみ中K|normal|gated|
|juri|8c772908-c117-4985-aa01-02f9e357525e|juri-crouching-hk|しゃがみ強K|normal|gated|
|juri|b5c35158-2c77-4e40-ab38-5ed3e5ecee04|juri-forward-mp|前中P|unique|gated|
|juri|7a1df939-a2fb-4ae2-aaf9-cd3c54406db8|juri-forward-mk|前中K|unique|gated|
|juri|14cc7865-3cbb-4cd7-9cf8-fd5625d15b90|juri-forward-hp|前強P（Renko Kicks）|unique|gated|
|juri|7722f444-553d-4a47-93ea-e92f66baeb5e|juri-back-hk|後ろ強K（Korenzan）|unique|gated|
|juri|f617d69b-8a4a-440c-b8ad-8e0fc53ba614|juri-target-mp-bhp-hp|中P→後ろ強P→強P|target_combo|gated|
|juri|c3c885f1-6446-441b-97cb-bb4ff28021ff|juri-jump-lp|ジャンプ弱P|normal|gated|
|juri|be322e27-dde3-48e7-8080-9261e7a98ba0|juri-jump-mp|ジャンプ中P|normal|gated|
|juri|87b089e4-becb-4768-b5dd-96f736e0981d|juri-jump-hp|ジャンプ強P|normal|gated|
|juri|f5e75dfd-4b1b-4030-a5e0-06b58df5e0cd|juri-jump-lk|ジャンプ弱K|normal|gated|
|juri|1ee8ba21-5b52-4f70-a342-e49959242e5d|juri-jump-mk|ジャンプ中K|normal|gated|
|juri|10ca8307-afd5-4742-a064-3406619c3b96|juri-jump-hk|ジャンプ強K|normal|gated|
|juri|ce47d469-55ed-4743-b467-dc62a689b5b0|juri-neutral-jump-hk|垂直ジャンプ強K|normal|gated|
|juri|5a98da7b-3c31-4889-af24-22a93f74080b|juri-fuhajin-l|弱 風破刃|special|gated|
|juri|c0222f7b-ade2-40b3-9306-1c73c9e3cc5a|juri-fuhajin-m|中 風破刃|special|gated|
|juri|cbc368ca-d0f3-4777-ae9d-cbeeaf937a1f|juri-fuhajin-h|強 風破刃|special|gated|
|juri|7c61f024-fca7-4e40-a278-c69bacfe4c6e|juri-fuhajin-od|OD 風破刃|special|gated|
|juri|010a1ad9-e796-4af1-a1a7-2f8d17c7c3fb|juri-saihasho|歳破衝|special|gated|
|juri|453d3d43-4df0-4281-a38f-4c2b5151fb81|juri-ankensatsu|暗剣殺|special|gated|
|juri|8b775baf-27e9-47cc-a3c3-9d21ae396d88|juri-go-ohsatsu|五黄殺|special|gated|
|juri|221d7c73-57cc-4a5f-b94d-aa444ff9d222|juri-saihasho-od|OD 歳破衝|special|gated|
|juri|4f7d14e2-ed50-4525-aac6-dff1f24c073d|juri-ankensatsu-od|OD 暗剣殺|special|gated|
|juri|8b14f12a-30f6-4092-a564-abc65dd214fc|juri-go-ohsatsu-od|OD 五黄殺|special|gated|
|juri|1e7d1cc0-8118-4c5a-8b43-94f585c2a83e|juri-tensenrin-l|弱 天穿輪|special|gated|
|juri|9f311585-00ac-4e7c-83fc-08a04f4f9f8d|juri-tensenrin-m|中 天穿輪|special|gated|
|juri|1201daae-e1b8-47aa-88d9-19be3fb4f80b|juri-tensenrin-h|強 天穿輪|special|gated|
|juri|3e607e52-090d-4c0b-96ec-d3bf99fd7c8b|juri-tensenrin-od|OD 天穿輪|special|gated|
|juri|ba59597e-b3b2-4932-ac71-c57a5c8d43c9|juri-shikusen|疾空閃|special|gated|
|juri|d8b0f1e0-9608-4189-8118-b4bf13274f10|juri-shikusen-od|OD 疾空閃|special|gated|
|juri|a0b600a3-0b0c-432d-8a6a-75bba7af99cb|juri-sa1|SA1 Sakkai Fuhazan|super|gated|
|juri|953af9d9-ad43-430d-9ea2-ffa332436fbe|juri-sa2|SA2 風水エンジン|super|gated|
|juri|d93fe029-deff-4d33-9a36-edf219cb92d5|juri-sa3|SA3 Kaisen Dankai Raku|super|gated|
|juri|6d1e92da-67bf-49ea-8630-7c333d1199e9|juri-forward-throw|前投げ|throw|gated|
|juri|5cc1893e-1ad5-41cd-bd06-6688b060508e|juri-back-throw|後ろ投げ|throw|gated|
|juri|f1f7bdc0-5abb-4dcd-9a18-6ed7ebcacabd|juri-air-throw|空中投げ|throw|gated|
|ken|0d079eeb-5fa6-40f0-a6d6-42c4abde4653|ken-standing-lp|立ち弱P|normal|gated|
|ken|a262468d-d351-4fe3-95f9-1b8ce5f97749|ken-standing-mp|立ち中P|normal|gated|
|ken|d0d02467-4e2e-483f-b9b4-54347ad88642|ken-standing-hp|立ち強P|normal|gated|
|ken|91fed226-09c8-4bf2-a082-be9d5490366f|ken-standing-lk|立ち弱K|normal|gated|
|ken|432a788a-2374-4108-b7a1-42fac75edcf9|ken-standing-mk|立ち中K|normal|gated|
|ken|be0ff01f-d21c-4b58-8763-fc5d24618ada|ken-standing-hk|立ち強K|normal|gated|
|ken|c19fb166-6fe5-4bef-b046-32d90312b827|ken-crouching-lp|しゃがみ弱P|normal|gated|
|ken|272f1707-9bad-4301-adbe-4538e2da0bf0|ken-crouching-mp|しゃがみ中P|normal|gated|
|ken|e2d7691f-7e96-4337-9690-f6bbdee4b00d|ken-crouching-hp|しゃがみ強P|normal|gated|
|ken|c02c7a22-c800-4a29-9b0d-e4dad5b62230|ken-crouching-lk|しゃがみ弱K|normal|gated|
|ken|7d58e80b-b800-48ff-8a9b-ad6bb92e3e4a|ken-crouching-mk|しゃがみ中K|normal|gated|
|ken|cdde3afe-40c5-40b3-8883-294a19aa35ff|ken-crouching-hk|しゃがみ強K|normal|gated|
|ken|7d2cac0c-e80b-43dd-a4df-15e6a3b71db5|ken-quick-dash|奮迅脚|unique|gated|
|ken|4bf7f7ff-9512-48c3-bd21-95e21535e073|ken-quick-dash-stop|奮迅脚・急停止|unique|gated|
|ken|280e8428-087e-4cac-8d7e-434989eda118|ken-quick-dash-thunder-kick|奮迅脚派生（Thunder Kick）|unique|gated|
|ken|0075125f-a9c4-4274-b3d1-588ceea35617|ken-quick-dash-forward-kick|奮迅脚・前蹴り|unique|gated|
|ken|73805d67-6c3e-4ab6-84bb-c3f214011f77|ken-target-mp-hp|中P→強P|target_combo|gated|
|ken|97b9e6f8-ce78-4e9b-9310-3206e2aed9ff|ken-target-mk-mk-hk|中K→中K→強K|target_combo|gated|
|ken|cce77dbc-8964-4c57-987c-1a1760647abd|ken-jump-lp|ジャンプ弱P|normal|gated|
|ken|26d989a7-ac25-4bb9-80fd-42c2642cd2b9|ken-jump-mp|ジャンプ中P|normal|gated|
|ken|8afdd432-ff11-4508-acba-d0fdc05d510c|ken-jump-hp|ジャンプ強P|normal|gated|
|ken|4487e49b-4891-45d2-8f6a-e72d15ea9649|ken-jump-lk|ジャンプ弱K|normal|gated|
|ken|f1553986-dddc-4333-8b69-4606e6ecca49|ken-jump-mk|ジャンプ中K|normal|gated|
|ken|d2525123-fae1-4342-9ea2-c31a211530fd|ken-jump-hk|ジャンプ強K|normal|gated|
|ken|ea6f8d3f-3fdd-4d0f-a5d8-46d1dc2d8013|ken-neutral-jump-hk|垂直ジャンプ強K|normal|gated|
|ken|da463a86-012e-489c-83c2-4d9c788ec522|ken-hadoken-l|弱 波動拳|special|gated|
|ken|a387256a-dac1-411f-9d33-3a0e9c1b6ab2|ken-hadoken-m|中 波動拳|special|gated|
|ken|7e7854bb-b559-456f-bb38-4eaf4ab8f317|ken-hadoken-h|強 波動拳|special|gated|
|ken|fd90ad37-4df3-4385-a480-70458d20e24b|ken-hadoken-od|OD 波動拳|special|gated|
|ken|339114d8-31e2-4760-9a65-cf4c9e289616|ken-shoryuken-l|弱 昇龍拳|special|gated|
|ken|bc92ba83-9725-464b-8358-aff0977879c7|ken-shoryuken-m|中 昇龍拳|special|gated|
|ken|be01ed12-ba8a-457b-9954-a996223e4426|ken-shoryuken-h|強 昇龍拳|special|gated|
|ken|6876468e-a58f-49ec-8141-ebac16b9a162|ken-shoryuken-od|OD 昇龍拳|special|gated|
|ken|8005546e-eee1-413b-9acc-c76e783f6660|ken-shoryuken-quick-dash|奮迅昇龍拳|special|gated|
|ken|7e3c88e5-1626-4546-950f-7a7b1a3edcac|ken-tatsu-l|弱 竜巻旋風脚|special|gated|
|ken|e59ca6b7-22fc-40f4-94a2-e8a52bd02ade|ken-tatsu-m|中 竜巻旋風脚|special|gated|
|ken|69c0324c-b2d1-4d19-873f-e147d82c79ab|ken-tatsu-h|強 竜巻旋風脚|special|gated|
|ken|41217421-641d-40ab-89b6-e683ab04fcce|ken-tatsu-od|OD 竜巻旋風脚|special|gated|
|ken|63e3c941-3368-42fd-9228-bb01ab9258ae|ken-tatsu-quick-dash|奮迅竜巻旋風脚|special|gated|
|ken|f6171332-63ad-40d3-8fb7-8c4fe6fa6218|ken-air-tatsu|空中竜巻旋風脚|special|gated|
|ken|bacc9cc1-aff3-4b61-841d-fb313a77e3d5|ken-air-tatsu-od|OD 空中竜巻旋風脚|special|gated|
|ken|2471b3a9-56a9-4e1c-80d0-3cfd73d4513e|ken-dragonlash-l|弱 龍尾脚|special|gated|
|ken|3ca5b57a-0acb-4a5b-9f4f-512baa076a2d|ken-dragonlash-m|中 龍尾脚|special|gated|
|ken|f767adcd-c716-46c3-a1f5-819390fde640|ken-dragonlash-h|強 龍尾脚|special|gated|
|ken|2ae7c845-f576-49f2-b81a-9e556485a9ba|ken-dragonlash-od|OD 龍尾脚|special|gated|
|ken|ec656dda-486b-4d70-89b2-c7e2c8935fa6|ken-dragonlash-quick-dash|奮迅龍尾脚|special|gated|
|ken|5cb7c595-a3ad-4cf1-a9a1-6c319279c6cc|ken-jinrai-l|弱 迅雷脚|special|gated|
|ken|3586bd08-a3f6-401e-9d49-0915b711dcbc|ken-jinrai-m|中 迅雷脚|special|gated|
|ken|c2a9f794-1729-4a80-ae69-80eedea265a4|ken-jinrai-h|強 迅雷脚|special|gated|
|ken|7369f84d-cbee-48a6-9fb9-cf83805d36b0|ken-jinrai-od|OD 迅雷脚|special|gated|
|ken|250fd7eb-821d-41ba-b01d-bfd018dc7dd0|ken-jinrai-l-follow|迅雷脚・弱派生|special|gated|
|ken|02fb7dd2-41dc-4c9e-ac60-9dba818f1779|ken-jinrai-m-follow|迅雷脚・中派生|special|gated|
|ken|08c0ef1b-86af-4f11-981b-e8cdb5bf3e3b|ken-jinrai-h-follow|迅雷脚・強派生|special|gated|
|ken|b22c5f0f-371f-49a5-b27d-7ab8940edae0|ken-jinrai-od-third|OD迅雷脚・追加派生|special|gated|
|ken|7c35987c-b8f2-461d-a406-c8d4cede0e4d|ken-sa1|SA1 Dragonlash Flame|super|gated|
|ken|7ec44688-4e77-48bb-8b9f-0731b6eed185|ken-sa2|SA2 疾風迅雷脚|super|gated|
|ken|87998cdc-9b82-4b36-9582-3e144fe7b107|ken-sa3|SA3 神龍烈破|super|gated|
|ken|0b963e9d-0a9d-4d32-83f8-38187e4fc12e|ken-forward-throw|前投げ|throw|gated|
|ken|37dfc815-fab3-4be0-a0d3-c83db2f4c3b1|ken-back-throw|後ろ投げ|throw|gated|
|blanka|0782677e-13fe-4fa7-8a6f-737560021c9f|blanka-standing-lp|立ち弱P （ベアアタック）|normal|gated|
|blanka|436d19df-d493-4075-9648-03f5d997c978|blanka-standing-lk|立ち弱K （ビーストキック）|normal|gated|
|blanka|cce269fb-e1d7-40a3-9c1e-974a24edb27f|blanka-standing-mp|立ち中P （ビーストチョップ）|normal|gated|
|blanka|52a69de9-cb10-47f2-bdde-0fccd072b6cc|blanka-standing-mk|立ち中K （ブラッディーテイル）|normal|gated|
|blanka|34ada1ae-9b64-4be6-b7ac-aee1ee940114|blanka-standing-hp|立ち強P （ジャングルアーチ）|normal|gated|
|blanka|4ae97cc8-9a2f-4c84-b016-940275b3fed1|blanka-standing-hk|立ち強K （ワイルドダンス）|normal|gated|
|blanka|9060fd79-caf5-4e8f-9432-38c821065b02|blanka-crouching-lp|しゃがみ弱P （キャットクロー）|normal|gated|
|blanka|47e869ad-c789-469c-a708-9cea9af0a248|blanka-crouching-lk|しゃがみ弱K （ジャングルトラップ）|normal|gated|
|blanka|f1b968cf-f795-441e-8973-5d0f0b5143f0|blanka-crouching-mp|しゃがみ中P （ベアクロー）|normal|gated|
|blanka|bdfbb2f7-1267-42fb-b907-e9fade14d506|blanka-crouching-mk|しゃがみ中K （ビーストステップ）|normal|gated|
|blanka|f9c2459a-39a2-4eb9-a050-cea1dae13546|blanka-crouching-hp|しゃがみ強P （スネークアッパー）|normal|gated|
|blanka|1ac72681-6aa7-44ea-8693-8fc28005dfe1|blanka-crouching-hk|しゃがみ強K （ビーストテイル）|normal|gated|
|blanka|3ae030e0-1daa-4016-86fc-baf177f9dbe2|blanka-jump-lp|ジャンプ弱P （パンサークロー）|normal|gated|
|blanka|26d3ac7d-b340-4d33-bab0-718f9d4e7ac0|blanka-jump-lk|ジャンプ弱K （フライングヴァイパー）|normal|gated|
|blanka|040687f1-eb85-4a6e-9997-83dfddc8387c|blanka-jump-mp|ジャンプ中P （フィストドロップ）|normal|gated|
|blanka|fc2d5631-c2c1-4b62-b9db-f81c4fd8c5d0|blanka-jump-mk|ジャンプ中K （ワイルドヒール）|normal|gated|
|blanka|9b3e02d5-69bf-4ce8-a5cf-6973033a263d|blanka-jump-hp|ジャンプ強P （サバイバルクロー）|normal|gated|
|blanka|b2328f87-fed4-4399-8829-6c71513c6606|blanka-jump-hk|ジャンプ強K （サバイバルキック）|normal|gated|
|blanka|1f71334e-800a-42c4-a403-d8d8fd869e8a|blanka-neutral-jump-hp|垂直ジャンプ強P （サバイバルクロー (垂直)）|normal|gated|
|blanka|27788e50-4fac-49ae-9990-977e73a3768d|blanka-rock-crusher|ロッククラッシュ|unique|gated|
|blanka|b8cf4e4f-a751-4123-b6f9-a9dba542d3e4|blanka-double-knee-bombs|ダブルニーボンバー|unique|gated|
|blanka|d38a6341-8f3d-45f3-b968-bf8216aeb125|blanka-wild-edge|ワイルドエッジ|unique|gated|
|blanka|a47a2a05-3ef4-4d7d-a219-cb0060506daf|blanka-wild-nail|ワイルドネイル|unique|gated|
|blanka|356e80a5-c3fc-47ec-9941-0b8a20bffa4f|blanka-amazon-river-run|アマゾンリバーラン|unique|gated|
|blanka|a56cdd07-fc2f-4db3-b0d7-ce61681d18f0|blanka-capcom-frame-025|フィアーダウン|unique|gated|
|blanka|173874b0-711d-4488-9e0c-d435b892dd1f|blanka-capcom-frame-026|ワイルドリフト|unique|gated|
|blanka|1b6c55e6-ff78-47e7-8ad2-5b9dd2fcbae9|blanka-capcom-frame-027|レイドジャンプ|unique|gated|
|blanka|74d45937-d537-4b26-b647-7c6e9e1794ef|blanka-capcom-frame-028|サプライズフォワード|unique|gated|
|blanka|aecbfb5f-ee4f-4c6a-98a4-134bc15d0b71|blanka-capcom-frame-029|サプライズバック|unique|gated|
|blanka|7f789ff6-ca6a-4567-acb9-e89634bbfae9|blanka-electric-thunder|エレクトリックサンダー|special|gated|
|blanka|e9fa9fbf-40bb-4c6c-afde-168e8f9c1b77|blanka-capcom-frame-031|【ライトニングビースト】 エレクトリックサンダー|special|gated|
|blanka|47ddc7a4-b196-42dc-ae1d-792b60f59fe2|blanka-electric-thunder-od|OD エレクトリックサンダー|special|gated|
|blanka|3c803b4c-e143-492b-a9da-00a764a7fab3|blanka-capcom-frame-033|【ライトニングビースト】OD エレクトリックサンダー|special|gated|
|blanka|adc14f50-3d19-494b-af2c-9c77b3aca7de|blanka-rolling-l|弱 ローリングアタック|special|gated|
|blanka|fbafe22c-3e4b-4a83-9d56-65d35b84bfad|blanka-capcom-frame-035|【ライトニングビースト】 弱 ローリングアタック|special|gated|
|blanka|7e6426db-209c-4087-8b1d-6d4e4ff4d071|blanka-rolling-m|中 ローリングアタック|special|gated|
|blanka|5115533c-48f6-46ab-8f43-c91456a056cd|blanka-capcom-frame-037|【ライトニングビースト】 中 ローリングアタック|special|gated|
|blanka|982669d5-cb30-4e54-80a6-5344fc46a810|blanka-rolling-h|強 ローリングアタック|special|gated|
|blanka|ed75de09-a738-49c1-ada2-4e6a92dd122d|blanka-capcom-frame-039|【ライトニングビースト】 強 ローリングアタック|special|gated|
|blanka|548eccc7-698a-4dbf-b596-0f539756bc34|blanka-rolling-od|OD ローリングアタック|special|gated|
|blanka|76a18559-a562-4428-8ccb-7b0db23878c0|blanka-capcom-frame-041|【ライトニングビースト】 OD ローリングアタック|special|gated|
|blanka|db472b93-f43d-4dfa-8f6f-b837c8e1e335|blanka-vertical-l|弱 バーチカルローリング|special|gated|
|blanka|375850fc-f5a3-4cf5-9374-c15e010325ed|blanka-capcom-frame-043|【ライトニングビースト】 弱 バーチカルローリング|special|gated|
|blanka|48293a29-728d-4f69-a332-8413ec651582|blanka-vertical-m|中 バーチカルローリング|special|gated|
|blanka|4eb93f84-2b26-4c13-941d-93f22f8432d5|blanka-capcom-frame-045|【ライトニングビースト】 中 バーチカルローリング|special|gated|
|blanka|a830d93f-7b06-4d47-b5ee-f00aac1620f9|blanka-vertical-h|強 バーチカルローリング|special|gated|
|blanka|d37a3915-ba2d-4459-9c07-be5f7922212a|blanka-capcom-frame-047|【ライトニングビースト】 強 バーチカルローリング|special|gated|
|blanka|e40fcfc2-0402-4a50-b9ab-dddf07ed11a8|blanka-vertical-od|OD バーチカルローリング|special|gated|
|blanka|26a8e2d6-b3b7-4073-a3c6-5ad96f0443f5|blanka-capcom-frame-049|【ライトニングビースト】 OD バーチカルローリング|special|gated|
|blanka|e1443d10-dccd-4d08-a200-14d0749caef3|blanka-backstep-l|弱 バックステップローリング|special|gated|
|blanka|dc36418c-c8bf-47b8-a38a-b18906c4da8c|blanka-capcom-frame-051|【ライトニングビースト】 弱 バックステップローリング|special|gated|
|blanka|0fd4a0c6-4de8-4451-856d-b6a759f2e154|blanka-backstep-m|中 バックステップローリング|special|gated|
|blanka|29716b4f-ac53-49ba-b622-83578dba656a|blanka-capcom-frame-053|【ライトニングビースト】 中 バックステップローリング|special|gated|
|blanka|20ba239a-698c-43e3-99a6-1e5877196b1a|blanka-backstep-h|強 バックステップローリング|special|gated|
|blanka|6f5ca510-e755-4374-a3cb-62fcbcca614d|blanka-capcom-frame-055|【ライトニングビースト】 強 バックステップローリング|special|gated|
|blanka|e7bf4a22-5799-4f95-a2aa-9aae866f3b7d|blanka-backstep-od|OD バックステップローリング|special|gated|
|blanka|e55ae08d-7544-4840-ac84-dba27039b87b|blanka-capcom-frame-057|【ライトニングビースト】 OD バックステップローリング|special|gated|
|blanka|d174c7e0-e631-4207-900d-03aaa63ce1db|blanka-air-rolling|弱 エリアルローリング|special|gated|
|blanka|546e20dd-3c53-4ba7-b23b-0e8ec51439b8|blanka-capcom-frame-059|【ライトニングビースト】 弱 エリアルローリング|special|gated|
|blanka|1b9b1946-b557-44fb-8826-d2d1622e5e0d|blanka-capcom-frame-060|中 エリアルローリング|special|gated|
|blanka|71d43070-0b11-4a7d-9755-91cc302ce47d|blanka-capcom-frame-061|【ライトニングビースト】 中 エリアルローリング|special|gated|
|blanka|33e58140-48a5-453e-a9a4-535bc6d3cc18|blanka-capcom-frame-062|強 エリアルローリング|special|gated|
|blanka|68679da9-8f16-418b-8079-e81d465b82ee|blanka-capcom-frame-063|【ライトニングビースト】 強 エリアルローリング|special|gated|
|blanka|357470d2-3863-4987-8771-b89e3c582ce9|blanka-air-rolling-od|OD エリアルローリング|special|gated|
|blanka|52d3711f-7e87-4323-b57f-b38e52fc1e0a|blanka-capcom-frame-065|【ライトニングビースト】 OD エリアルローリング|special|gated|
|blanka|fa5e4269-6a41-4d3e-b719-d87e268e871d|blanka-wild-hunt-l|弱 ワイルドハント|special|gated|
|blanka|acaeb0fd-8461-4f24-b72d-ceb9db8a655d|blanka-wild-hunt-m|中 ワイルドハント|special|gated|
|blanka|f607e0b6-2b61-498f-bba0-a4e1ac1550d6|blanka-wild-hunt-h|強 ワイルドハント|special|gated|
|blanka|18d2bee8-0233-4ac0-967c-a9bdb370c64c|blanka-wild-hunt-od|OD ワイルドハント|special|gated|
|blanka|09fbdf70-6920-4387-bb5b-cf9de1b681e8|blanka-chan-bomb|ブランカちゃん爆弾|special|gated|
|blanka|714b8de7-9430-4eac-967a-649545f4957f|blanka-capcom-frame-071|ブランカちゃん爆弾（射出）|special|gated|
|blanka|c4716f62-791b-4452-8bd1-3e48f1fd668c|blanka-capcom-frame-072|OD ブランカちゃん爆弾（射出）|special|gated|
|blanka|6c011d0e-53e7-44e1-bb2d-836c1c97b24e|blanka-rolling-cannon|ローリングキャノン|special|gated|
|blanka|84d5aca6-ed49-42b3-9ff0-9bdf80f46358|blanka-sa1|SA1 シャウトオブアース|super|gated|
|blanka|414ff01e-0f93-40d1-9e1d-6f3fff1d45a7|blanka-capcom-frame-075|【ライトニングビースト】 SA1 シャウトオブアース|super|gated|
|blanka|46cc493a-facd-40dd-ad34-74cd7005acc4|blanka-sa2|SA2 ライトニングビースト|super|gated|
|blanka|ef240125-3e56-4450-b2e1-7088eac48e4d|blanka-sa3|SA3 グランドシェイブキャノンボール|super|gated|
|blanka|b775fdba-99d6-48eb-a7a2-f9138445f54e|blanka-ca|CA グランドシェイブキャノンボール|super|gated|
|blanka|39349618-5bd9-4434-90b5-a5f681f33ede|blanka-forward-throw|ワイルドファング|throw|gated|
|blanka|eeab0c5f-2d4f-4b71-8062-8b7626f734ab|blanka-back-throw|ジャングルフリップ|throw|gated|
|blanka|1dc7c2cf-1f8b-4e58-bd89-964e2ed41411|blanka-capcom-frame-081|ワイルドバイツ|throw|gated|
|blanka|5b878f4d-f6e7-4a7b-9373-b07193be0f5b|blanka-capcom-frame-082|前方ステップ|unique|gated|
|blanka|da025585-53da-4463-a9b9-7170df202667|blanka-capcom-frame-083|後方ステップ|unique|gated|
|dhalsim|e6c1e823-a39a-4f22-ab24-aba9f3a18e3a|dhalsim-standing-lp|立ち弱P（手刀チョップ）|normal|gated|
|dhalsim|46b1a80f-dc4d-4228-b58c-f71a32ef3556|dhalsim-standing-lk|立ち弱K（合掌フロントローキック）|normal|gated|
|dhalsim|5d50a7ab-795c-4ea1-ad4e-284c46db5007|dhalsim-standing-mp|立ち中P（ズームストレート）|normal|gated|
|dhalsim|6febf941-e0ac-410c-99c4-4ba568bbde55|dhalsim-standing-mk|立ち中K（合掌ズームローキック）|normal|gated|
|dhalsim|b8ab97c1-cbaa-4f19-8257-e4c450244d32|dhalsim-standing-hp|立ち強P（ダブルズームパンチ）|normal|gated|
|dhalsim|7f341b53-849c-4c3e-bbaa-02445b9fca8d|dhalsim-standing-hk|立ち強K（合掌ズームスピンキック）|normal|gated|
|dhalsim|96b6eb7d-c918-4c84-b863-8987ad529637|dhalsim-crouching-lp|しゃがみ弱P（手刀水平チョップ）|normal|gated|
|dhalsim|570e1311-4625-4563-82ce-443ac60d25a5|dhalsim-crouching-lk|しゃがみ弱K（スライディング）|normal|gated|
|dhalsim|37d941ed-1390-4e2a-a61f-56d91ac5b117|dhalsim-crouching-mp|しゃがみ中P（しゃがみズームパンチ）|normal|gated|
|dhalsim|f6396ecf-598e-419e-9303-71c53cfb4738|dhalsim-crouching-mk|しゃがみ中K（ヨガスライディング）|normal|gated|
|dhalsim|f3ef21f8-b1a7-4d91-bf43-2145bb6f83d0|dhalsim-crouching-hp|しゃがみ強P（ダブルヨガパンチ）|normal|gated|
|dhalsim|7ab03e6f-a949-4953-b7f0-3e76828b6645|dhalsim-crouching-hk|しゃがみ強K（ロングスライディング）|normal|gated|
|dhalsim|c9cfc2ca-5e15-484d-819d-250d76d23b6c|dhalsim-jump-lp|ジャンプ弱P（ジャンプ掌底）|normal|gated|
|dhalsim|6aa58f08-34cb-44a1-9553-abfa59ee3503|dhalsim-jump-lk|ジャンプ弱K（ジャンプヨガ前蹴り）|normal|gated|
|dhalsim|ed6d3e34-5a79-4bc3-80df-ed571fd5a8b8|dhalsim-jump-mp|ジャンプ中P（ジャンプズームサイドパンチ）|normal|gated|
|dhalsim|1af59f00-98c1-461e-a15b-8f76e4f61217|dhalsim-jump-mk|ジャンプ中K（合掌ジャンプアンダーキック）|normal|gated|
|dhalsim|824741ed-cbb4-4085-873f-d40df42337cf|dhalsim-jump-hp|ジャンプ強P（合掌ハンマー）|normal|gated|
|dhalsim|0b6a35ba-373b-42b9-8ec0-fa4f38698641|dhalsim-jump-hk|ジャンプ強K（ジャンプズームハイキック）|normal|gated|
|dhalsim|989a0a3a-dffd-44fb-9574-350c8f065ada|dhalsim-yoga-uppercut|ヨガアッパー|unique|gated|
|dhalsim|76f2594a-308b-4cc8-9d3a-fc090be7a465|dhalsim-yoga-lance|ヨガランス|unique|gated|
|dhalsim|01d57738-2130-43f8-a8a0-50744ac8edc8|dhalsim-nirvana-punch|涅槃パンチ|unique|gated|
|dhalsim|9ad23337-ca90-45b7-ad55-8caecece4d1c|dhalsim-agile-kick|アジャイルキック|unique|gated|
|dhalsim|e9864582-d60f-45f3-8027-f6869d23dea9|dhalsim-divine-kick|合掌キック|unique|gated|
|dhalsim|09da6238-4b5f-498b-bcb0-139f078d86c4|dhalsim-thrust-kick|スラストキック|unique|gated|
|dhalsim|430fb878-b65d-4360-8245-54fdd9e4b5f6|dhalsim-yoga-mountain|ヨガマウンテン|unique|gated|
|dhalsim|6169739b-8fa6-4818-bf95-90ac95e0bce0|dhalsim-karma-kick|因果キック|unique|gated|
|dhalsim|28cddd9b-7abc-4125-b7a9-eb7a15d40fa5|dhalsim-yoga-mummy|ドリル頭突き|unique|gated|
|dhalsim|4e125e65-9f18-45d0-8b83-471b0170267c|dhalsim-drill-kick|弱 ドリルキック|unique|gated|
|dhalsim|78d5b69e-a7f9-4cce-a4bc-89c1d50e1c72|dhalsim-capcom-frame-029|中 ドリルキック|unique|gated|
|dhalsim|8b0bcb30-8a92-4dbe-ae43-c923e3155e67|dhalsim-capcom-frame-030|強 ドリルキック|unique|gated|
|dhalsim|bc492907-e534-4534-8929-eed2d0ab8571|dhalsim-yoga-fire|弱 ヨガファイア|special|gated|
|dhalsim|13390230-0f8a-4f5a-a110-6998c102112c|dhalsim-capcom-frame-033|弱 ヨガファイア（ホールド）|special|gated|
|dhalsim|60a91e83-1be7-494a-a92a-12680b04ed7e|dhalsim-capcom-frame-034|中 ヨガファイア|special|gated|
|dhalsim|4d95edd8-d851-40c6-824c-10e363610ab6|dhalsim-capcom-frame-035|中 ヨガファイア（ホールド）|special|gated|
|dhalsim|258abf5c-b889-4582-b347-b5ffef0317cd|dhalsim-capcom-frame-036|強 ヨガファイア|special|gated|
|dhalsim|2bfc6951-7e83-4189-b217-e8dafa928b7b|dhalsim-capcom-frame-037|強 ヨガファイア（ホールド）|special|gated|
|dhalsim|61dbd23e-7f20-4f71-810e-95cb31cc0f23|dhalsim-yoga-fire-od|OD 弱 ヨガファイア|special|gated|
|dhalsim|c6033575-132f-4d41-a6cd-4edd807446d2|dhalsim-capcom-frame-039|OD 中 ヨガファイア|special|gated|
|dhalsim|c1cb6c6a-e4d6-40fc-b704-0f5172600174|dhalsim-capcom-frame-040|OD 強 ヨガファイア|special|gated|
|dhalsim|07f0f420-4bad-4f06-a4ae-9cc5a9f5ab23|dhalsim-yoga-arch|弱 ヨガアーチ|special|gated|
|dhalsim|7e6e3f55-e96a-469e-a0db-5f51c68b5eae|dhalsim-capcom-frame-042|中 ヨガアーチ|special|gated|
|dhalsim|5ec48254-6a44-4ab2-b018-452d6cb0337b|dhalsim-capcom-frame-043|強 ヨガアーチ|special|gated|
|dhalsim|2a764ff7-4961-4891-97db-d96fbe5fd1a1|dhalsim-yoga-arch-od|OD 弱 ヨガアーチ|special|gated|
|dhalsim|6a777a0d-97bd-435e-bf61-c832a031112c|dhalsim-capcom-frame-045|OD 中 ヨガアーチ|special|gated|
|dhalsim|a7b7a811-affb-4f8c-94b1-84796f1552f3|dhalsim-capcom-frame-046|OD 強 ヨガアーチ|special|gated|
|dhalsim|71c7f611-0b9a-4d82-a42c-ad89facabe9c|dhalsim-yoga-flame-l|弱 ヨガフレイム|special|gated|
|dhalsim|a3810256-fa9f-4b71-9bd6-c32247155c8d|dhalsim-yoga-flame-m|中 ヨガフレイム|special|gated|
|dhalsim|dfc1b4b7-1113-4326-8c95-5105b3f6d1c7|dhalsim-yoga-flame-h|強 ヨガフレイム|special|gated|
|dhalsim|793c9ae5-dee7-4289-9ac8-3bc8897d55da|dhalsim-yoga-flame-od|OD ヨガフレイム|special|gated|
|dhalsim|701d4ed3-9c19-465d-9c15-038655ea632d|dhalsim-yoga-blast-l|弱 ヨガブラスト|special|gated|
|dhalsim|75579d6f-c1f4-40ab-8445-b643e32a7d0c|dhalsim-yoga-blast-m|中 ヨガブラスト|special|gated|
|dhalsim|e9b48897-eda2-485e-b79c-6a64b8e800db|dhalsim-yoga-blast-h|強 ヨガブラスト|special|gated|
|dhalsim|87b4cc6c-2287-4495-8623-6120a2d66c6f|dhalsim-yoga-blast-od|OD ヨガブラスト|special|gated|
|dhalsim|dd77df63-0221-4c46-8768-a0a81b108524|dhalsim-yoga-comet|弱 ヨガコメット|special|gated|
|dhalsim|c12a4683-e5fa-4fdd-945b-3e587a1aa158|dhalsim-capcom-frame-056|中 ヨガコメット|special|gated|
|dhalsim|37922781-5a5e-441d-adfe-3637609f78b1|dhalsim-capcom-frame-057|強 ヨガコメット|special|gated|
|dhalsim|9733b299-b1c2-4ca7-888b-4c5cf4c61105|dhalsim-yoga-comet-od|OD ヨガコメット|special|gated|
|dhalsim|86214164-dd87-4f41-a325-5e217251199e|dhalsim-yoga-float|ヨガフロート（その場）|special|gated|
|dhalsim|74c5e2cb-1058-4e46-9cff-bad782d425be|dhalsim-capcom-frame-060|ヨガフロート（前方）|special|gated|
|dhalsim|1d8d27d8-01e9-4c92-af23-67d564d9cef7|dhalsim-capcom-frame-061|空中ヨガフロート|special|gated|
|dhalsim|5a0df114-d300-4fae-b768-611a72836440|dhalsim-yoga-teleport|P ヨガテレポート（前方）|special|gated|
|dhalsim|93b78193-d185-4578-9f3e-f91bba52bb50|dhalsim-capcom-frame-063|K ヨガテレポート（前方）|special|gated|
|dhalsim|d29a6b51-cf11-4f25-9925-07906e807ee4|dhalsim-capcom-frame-064|P 空中ヨガテレポート（前方）|special|gated|
|dhalsim|df4c97a6-f2d2-4bda-8fab-66a8745928cc|dhalsim-capcom-frame-065|K 空中ヨガテレポート（前方）|special|gated|
|dhalsim|b130fd01-3bd1-40a3-be52-7772886411e8|dhalsim-capcom-frame-066|ヨガテレポート（後方）|special|gated|
|dhalsim|6ccdcffd-89fb-47d5-becf-b62dc711cba7|dhalsim-capcom-frame-067|P 空中ヨガテレポート（後方）|special|gated|
|dhalsim|acbfd880-c7d0-4843-b61d-e37bef2a6d40|dhalsim-capcom-frame-068|K 空中ヨガテレポート（後方）|special|gated|
|dhalsim|27166fa0-3dfa-4c7e-adcd-3658d8d068a1|dhalsim-sa1|SA1 弱 ヨガインフェルノ|super|gated|
|dhalsim|5a3d48d4-50ca-4ae8-839c-daae8e378aa1|dhalsim-capcom-frame-070|SA1 中 ヨガインフェルノ|super|gated|
|dhalsim|b53a4420-bffa-4164-9224-7c5f30ff16fe|dhalsim-capcom-frame-071|SA1 強 ヨガインフェルノ|super|gated|
|dhalsim|9dfa14b1-f690-4ee3-9676-6664b392ec77|dhalsim-sa2|SA2 ヨガサンバースト（Lv1）|super|gated|
|dhalsim|048eec3e-c6ea-4b0a-b97e-cdff5ef2f469|dhalsim-capcom-frame-073|SA2 ヨガサンバースト（Lv2）|super|gated|
|dhalsim|fb5dbe18-c93b-44bc-b0f3-de514def8c60|dhalsim-capcom-frame-074|SA2 ヨガサンバースト（Lv3）|super|gated|
|dhalsim|21cd74ca-6e78-447e-bb98-fd3d75e80bd2|dhalsim-sa3|SA3 ヨガマーシレス|super|gated|
|dhalsim|4074ad62-f29f-4757-b7c2-99d511e21783|dhalsim-ca|CA ヨガマーシレス|super|gated|
|dhalsim|9752070d-0d30-4c46-a24d-4c537a3ddb7b|dhalsim-forward-throw|ヨガスマッシュ|throw|gated|
|dhalsim|c2521186-291d-41f1-a0c9-f2ea5cb8fe2e|dhalsim-back-throw|ヨガスルー|throw|gated|
|dhalsim|c70b28e3-644d-4297-8478-6510d952d49e|dhalsim-capcom-frame-079|ヨガスプラッシュ|throw|gated|
|dhalsim|51530b14-bfe3-4255-91f1-5d709a320eac|dhalsim-capcom-frame-080|前方ステップ|unique|gated|
|dhalsim|8f9ede3c-6a0c-4ebb-8ff2-42548e0d6ec2|dhalsim-capcom-frame-081|後方ステップ|unique|gated|
|e-honda|a2377a9b-eaba-4317-b4b3-5f42b8c92a5f|e-honda-standing-lp|立ち弱P（張り手）|normal|gated|
|e-honda|8ec9a463-e609-4946-8315-6e11d5a6d709|e-honda-standing-lk|立ち弱K（けたぐり）|normal|gated|
|e-honda|8ce5ae50-67f1-49dd-a6c3-9f33064b0e89|e-honda-standing-mp|立ち中P（突っ張り）|normal|gated|
|e-honda|9c22c713-aead-43bc-ad73-6f73147c501a|e-honda-standing-mk|立ち中K（四股蹴り）|normal|gated|
|e-honda|0a3652f8-71fe-44cf-8b97-bc522d8fbc52|e-honda-standing-hp|立ち強P（ごっつぁんチョップ）|normal|gated|
|e-honda|ed775473-5629-4300-8280-1527ba680c3b|e-honda-standing-hk|立ち強K（丸太蹴り）|normal|gated|
|e-honda|870bbf2b-01ae-4216-b02a-a24639eb691d|e-honda-crouching-lp|しゃがみ弱P（しゃがみ張り手）|normal|gated|
|e-honda|afced83f-5ece-415d-a4db-04335d14f303|e-honda-crouching-lk|しゃがみ弱K（向こうずねキック）|normal|gated|
|e-honda|e5b4a3d2-e1c9-4bcd-92b3-bd9536bbbc63|e-honda-crouching-mp|しゃがみ中P（しゃがみ突っ張り）|normal|gated|
|e-honda|611fee82-a88e-426e-951d-fc96dce8237a|e-honda-crouching-mk|しゃがみ中K（掛け足）|normal|gated|
|e-honda|4ecf6b87-1cd1-44aa-8498-d4bde0650163|e-honda-crouching-hp|しゃがみ強P（スーパー出足払い）|normal|gated|
|e-honda|bceb16de-9e1e-4f2c-9ae3-1a1167e03d94|e-honda-crouching-hk|しゃがみ強K（土俵払い）|normal|gated|
|e-honda|c41aa523-ad17-43b2-858d-024ce62a270a|e-honda-jump-lp|ジャンプ弱P（ジャンプ突き手）|normal|gated|
|e-honda|d0dbdc65-03cd-4752-84ba-9502ffa0a3f7|e-honda-jump-lk|ジャンプ弱K（百貫落とし）|normal|gated|
|e-honda|13d8afd8-0d3c-4e0b-8e6f-f96c5d54fe83|e-honda-jump-mp|ジャンプ中P（ジャンプチョップ）|normal|gated|
|e-honda|421d8ba7-45e8-4a97-a48b-72105957b25f|e-honda-jump-mk|ジャンプ中K（わらじ蹴り）|normal|gated|
|e-honda|04ca30b1-afdc-461b-8271-349e6a822de9|e-honda-jump-hp|ジャンプ強P（ジャンプ張り手）|normal|gated|
|e-honda|0ef4ec45-b564-4153-a8f4-3bcfb3a4a54c|e-honda-jump-hk|ジャンプ強K（跳び丸太蹴り）|normal|gated|
|e-honda|932ca604-2349-473e-aa31-9bb59a3c69ee|e-honda-neutral-jump-hp|垂直ジャンプ強P（大熊手）|normal|gated|
|e-honda|68b5d9df-9b36-4c5b-b75f-55d1def9d716|e-honda-forward-hk|払い蹴り|unique|gated|
|e-honda|909d4bb0-1825-42d6-b48f-1308ef1543e6|e-honda-power-stomp|力足|unique|gated|
|e-honda|e2545791-7e98-48cc-9e97-a18f78513a17|e-honda-jump-down-mk|フライングスモウプレス|unique|gated|
|e-honda|9b159f2b-9aae-4a5d-8812-b1374ba3b28b|e-honda-tc-lp-mp|連ね張り手|unique|gated|
|e-honda|b2b92961-9401-477e-8d25-871a9f1f4767|e-honda-tc-mp-stomp|地鎮|unique|gated|
|e-honda|7145f149-c0d8-45e3-a48b-fd84e0609faa|e-honda-hhs-l|弱 百裂張り手|special|gated|
|e-honda|6046d59e-8cba-4f67-9f2f-d344e0392204|e-honda-capcom-frame-026|[肩屋入り]弱 百裂張り手|special|gated|
|e-honda|9ba15351-05f5-481a-925f-647f061a291c|e-honda-hhs-m|中 百裂張り手|special|gated|
|e-honda|5ae96b4f-b46a-4cd5-88ab-be0f0fb7ca22|e-honda-capcom-frame-028|[肩屋入り]中 百裂張り手|special|gated|
|e-honda|621f25d8-c0e1-47f1-bd48-1194b4fb7399|e-honda-hhs-h|強 百裂張り手|special|gated|
|e-honda|c68e0ae6-2f07-4c64-8fa2-f2527eb0b32a|e-honda-capcom-frame-030|[肩屋入り]強 百裂張り手|special|gated|
|e-honda|780dd2de-21f4-464c-973f-6393215eaa7c|e-honda-hhs-od|OD 百裂張り手|special|gated|
|e-honda|4165c674-e07a-4848-a990-77555f2fc68e|e-honda-capcom-frame-032|[肩屋入り]OD 百裂張り手|special|gated|
|e-honda|453822b2-1215-47c8-ae7a-4211b7a1e37d|e-honda-headbutt-l|弱 スーパー頭突き|special|gated|
|e-honda|62f97a3b-3706-4e4f-82f4-2f91c58bdfb2|e-honda-headbutt-m|中 スーパー頭突き|special|gated|
|e-honda|f2875f94-2aa3-4403-bb18-22b1a0458aa4|e-honda-headbutt-h|強 スーパー頭突き|special|gated|
|e-honda|9a6640ab-8b12-4128-8369-ca415254fd7b|e-honda-headbutt-od|OD スーパー頭突き|special|gated|
|e-honda|d542dbae-aefc-4d1d-8055-c47f1820e019|e-honda-smash-l|弱 スーパー百貫落とし|special|gated|
|e-honda|0d5b6fc5-ea0d-490f-a084-5485682dd0b5|e-honda-smash-m|中 スーパー百貫落とし|special|gated|
|e-honda|8a395c2c-05c6-4f39-9333-cbeaad9c607e|e-honda-smash-h|強 スーパー百貫落とし|special|gated|
|e-honda|bfa2b33e-e36e-4ca0-a7ba-3a3346e52f7b|e-honda-smash-od|OD スーパー百貫落とし|special|gated|
|e-honda|0643f73e-f4a9-4cc6-bc73-2c907fa1113c|e-honda-oicho-l|弱 大銀杏投げ|special|gated|
|e-honda|843494eb-c51b-441a-aa6a-e5ffa13ae975|e-honda-oicho-m|中 大銀杏投げ|special|gated|
|e-honda|bdd88a74-6cd2-47b7-859c-906ad60f3c7d|e-honda-oicho-h|強 大銀杏投げ|special|gated|
|e-honda|9d96fccd-787e-450a-87ae-44016fd9f74c|e-honda-oicho-od|OD 大銀杏投げ|special|gated|
|e-honda|78d7e1fb-4715-4e25-af6b-93e321c6bf8f|e-honda-sumo-dash|相撲ステップ|special|gated|
|e-honda|45ff83bf-7d74-403b-88b2-c7cd585fbf56|e-honda-sumo-dash-od|OD 相撲ステップ|special|gated|
|e-honda|8d62220b-09e0-4e15-b1fc-e4a02c84686e|e-honda-capcom-frame-047|鉄砲（１段目）|special|gated|
|e-honda|f84c8fff-8f43-4ffe-a83a-8145ddd6edf9|e-honda-triple-slap|鉄砲（２段目）|special|gated|
|e-honda|947d31db-4465-488e-b623-42e9ec28a066|e-honda-capcom-frame-049|OD 鉄砲（１段目）|special|gated|
|e-honda|7162c243-5c52-41ba-81a4-455900e6cc99|e-honda-triple-slap-od|OD 鉄砲（２段目）|special|gated|
|e-honda|a5deec18-9dad-4b6f-ae6d-73027291211f|e-honda-taiho|大砲|special|gated|
|e-honda|676a3f3a-ef71-4e64-b692-e38dbbe8c399|e-honda-taiho-od|OD 大砲|special|gated|
|e-honda|99183e88-29cf-4f81-97f9-9b50b93bb649|e-honda-neko-damashi|猫だまし|special|gated|
|e-honda|7a391155-29e3-4e61-8463-349399343d54|e-honda-sumo-spirit|肩屋入り|special|gated|
|e-honda|cfd0b1b8-cd38-4b2f-8511-e710827a9841|e-honda-sa1|SA1 発揮爆砕|super|gated|
|e-honda|329ff594-7654-4374-abaf-c6bb4ea6f259|e-honda-sa2|SA2 スーパー鬼無双|super|gated|
|e-honda|e7cbe7a0-f67f-4a13-bb22-70198d4e9210|e-honda-sa3|SA3 千秋楽|super|gated|
|e-honda|cbaacfbb-8a5e-4083-a8e3-b764fa6ed9b2|e-honda-ca|CA 千秋楽|super|gated|
|e-honda|b3591ffd-6a68-49cc-92ff-b60cb8a0d62e|e-honda-forward-throw|さば折り|throw|gated|
|e-honda|df343417-cd07-4dcc-8d71-c682ea6d2a5e|e-honda-back-throw|俵投げ|throw|gated|
|e-honda|31e4e2ba-9028-415d-b513-11572253dbef|e-honda-capcom-frame-061|前方ステップ|unique|gated|
|e-honda|544cc8fd-1062-48ff-aea7-1b48d0122c6d|e-honda-capcom-frame-062|後方ステップ|unique|gated|
|dee-jay|36de8f7a-a910-4315-8507-77174da08fef|dee-jay-standing-lp|立ち弱P （ジャブ）|normal|gated|
|dee-jay|7debb114-baa2-4cbc-91b7-952b3d2ec571|dee-jay-standing-lk|立ち弱K （ローキック）|normal|gated|
|dee-jay|a37ee100-dbdd-41f9-94a7-e1cc975d98c1|dee-jay-standing-mp|立ち中P （フロントフック）|normal|gated|
|dee-jay|54a83ad9-53e4-4f7b-ae16-8e827ebbbb2c|dee-jay-standing-mk|立ち中K （ミドルキック）|normal|gated|
|dee-jay|ebdd3009-fee4-4e55-87f1-b26439728dde|dee-jay-standing-hp|立ち強P （ブラストアッパー）|normal|gated|
|dee-jay|02fff13d-238d-4072-af8d-da1f75e1654c|dee-jay-standing-hk|立ち強K （マキシマムキック）|normal|gated|
|dee-jay|57beb616-7d69-45dd-972e-226521ec86e7|dee-jay-crouching-lp|しゃがみ弱P （アンダージャブ）|normal|gated|
|dee-jay|594eaec7-0b10-49a4-b975-faab51565605|dee-jay-crouching-lk|しゃがみ弱K （アンダーウィップ）|normal|gated|
|dee-jay|e0e9439e-1ded-4732-b34a-f669df106a59|dee-jay-crouching-mp|しゃがみ中P （レッグクラッシュエルボー）|normal|gated|
|dee-jay|b60102f5-af5c-492a-bca6-0c0277bf69b7|dee-jay-crouching-mk|しゃがみ中K （グランドスクラッチ）|normal|gated|
|dee-jay|516288aa-46c3-433c-b5ff-b72972e5baa8|dee-jay-crouching-hp|しゃがみ強P （バーストフック）|normal|gated|
|dee-jay|e1052f7b-e246-4ca4-9e35-88a3eb86f96b|dee-jay-crouching-hk|しゃがみ強K （スライディングヒールアッパー）|normal|gated|
|dee-jay|c23de894-0516-4edd-9b97-5b14e536cd32|dee-jay-jump-lp|ジャンプ弱P （ファンクストレート）|normal|gated|
|dee-jay|efd4a014-1971-4185-84e4-43168d2dc991|dee-jay-jump-lk|ジャンプ弱K （ファンクウィップ）|normal|gated|
|dee-jay|0f8ed5f9-a022-4246-9eef-36b077a1441d|dee-jay-jump-mp|ジャンプ中P （ファンクアッパー）|normal|gated|
|dee-jay|dc32dc03-29b1-4507-95cd-53e49ff1d5fa|dee-jay-jump-mk|ジャンプ中K （フライングムエタイキック）|normal|gated|
|dee-jay|83273f07-dab4-4632-bbce-975f2c9ff506|dee-jay-jump-hp|ジャンプ強P （ファンクバウンド）|normal|gated|
|dee-jay|c6b4199e-1e8e-421a-8826-d091f8028c61|dee-jay-jump-hk|ジャンプ強K （フライングカリビアンソバット）|normal|gated|
|dee-jay|ec176c91-b69d-4988-86f3-579ca6b1f5b4|dee-jay-jump-down-lk|ニーショット|unique|gated|
|dee-jay|9f3d308c-c982-49e0-9f7f-b270378c7e0f|dee-jay-sunrise-heel|サンライズヒール|unique|gated|
|dee-jay|e6977b57-168b-4876-833c-b0629b37532d|dee-jay-back-hk|フェイスブレイカー|unique|gated|
|dee-jay|8d8f6e98-e904-4b4c-9e09-b7e0d213c359|dee-jay-capcom-frame-022|3ビートコンボ （2段目）|unique|gated|
|dee-jay|69ee97b1-bad9-4fb7-a4ca-61579fbe35ba|dee-jay-threebeat|3ビートコンボ （3段目）|unique|gated|
|dee-jay|2a930171-4677-4be3-9901-a88dc30b0a08|dee-jay-capcom-frame-024|ディージェイスペシャル （2段目）|unique|gated|
|dee-jay|def2c3bc-6abb-4ac0-a8ea-7ff55ec4e2fe|dee-jay-mp-hp-hk|ディージェイスペシャル （3段目）|unique|gated|
|dee-jay|4f58dac2-713f-405f-b801-25b650ed8342|dee-jay-capcom-frame-026|ファンキーダンス （2段目）|unique|gated|
|dee-jay|cb0f151e-5a2c-48a4-a31c-435d3994ee06|dee-jay-capcom-frame-027|ファンキーダンス （3段目）|unique|gated|
|dee-jay|3c831bed-9a12-49a5-bd29-6b9d282a35e3|dee-jay-funky-dance|ファンキーダンス・フェイク|unique|gated|
|dee-jay|d051fd45-5f0f-42da-b15c-49eca2bf8dcd|dee-jay-capcom-frame-029|フライングパーティー|unique|gated|
|dee-jay|155af88f-6cb8-40c1-b585-ebfdfb7d2ad3|dee-jay-speedy-maracas|マラカスビート|unique|gated|
|dee-jay|373ec31c-6d7d-414e-a3e2-39d1e1c17e0d|dee-jay-air-slasher-l|弱 エアスラッシャー|special|gated|
|dee-jay|048c78d4-2da9-461b-86ff-fb6b96a66f0b|dee-jay-air-slasher-m|中 エアスラッシャー|special|gated|
|dee-jay|01a68cd2-ff35-4104-9ac6-9ed44641fdb1|dee-jay-air-slasher-h|強 エアスラッシャー|special|gated|
|dee-jay|1d7f9f79-bff7-4c9b-8645-54e95b310d24|dee-jay-air-slasher-od|OD エアスラッシャー|special|gated|
|dee-jay|993e3a92-4ca7-43b1-84f6-3da503d34b89|dee-jay-capcom-frame-035|OD エアスラッシャー （射出)|special|gated|
|dee-jay|3f8211e6-9fdc-45ba-9558-bd5908199ec4|dee-jay-jackknife-l|弱 ジャックナイフマキシマム|special|gated|
|dee-jay|fe965804-a210-4d77-93a3-295f3d7910b0|dee-jay-jackknife-m|中 ジャックナイフマキシマム|special|gated|
|dee-jay|bc0d5768-33c4-44e4-a841-1c92751c77d8|dee-jay-jackknife-h|強 ジャックナイフマキシマム|special|gated|
|dee-jay|bc019a33-449a-4662-aaa6-d86d0a766a1c|dee-jay-jackknife-od|OD ジャックナイフマキシマム|special|gated|
|dee-jay|49f0d4ea-618e-4ce9-94f3-8e6db0b9f7b7|dee-jay-sobat-l|フェイクロールステップ|special|gated|
|dee-jay|033a5787-d194-4a0f-b05d-6686f04601fe|dee-jay-sobat-m|クイックローリングソバット|special|gated|
|dee-jay|0f1c3e4a-ce03-4f74-8950-5b4c92c4bb68|dee-jay-sobat-h|ダブルローリングソバット|special|gated|
|dee-jay|d2b2199c-f28b-4270-a8e1-e7ba02b621b2|dee-jay-sobat-od|OD ダブルローリングソバット|special|gated|
|dee-jay|6a35dfc9-4303-420b-ad28-6295c8abe713|dee-jay-mgu-l|弱 マシンガンアッパー|special|gated|
|dee-jay|1d7e7bdf-87a6-48f4-b57b-ae5e4a39441e|dee-jay-mgu-m|中 マシンガンアッパー|special|gated|
|dee-jay|6244edb0-12f3-4323-93bb-d3dbd65994d7|dee-jay-mgu-h|強 マシンガンアッパー|special|gated|
|dee-jay|978c3660-a958-4dd9-87a6-c1c4620d9b8d|dee-jay-mgu-od|OD マシンガンアッパー|special|gated|
|dee-jay|cb65cb89-a54c-4847-aee3-6de1ea6131c6|dee-jay-jus-cool|ジョスクール|special|gated|
|dee-jay|42d6e0ba-a3ca-4c52-8a9d-cdff56722889|dee-jay-jus-cool-od|OD ジョスクール|special|gated|
|dee-jay|86a9ab72-14a9-4e31-ba16-a06ef4f35753|dee-jay-jc-lk|ファンキースライサー|special|gated|
|dee-jay|fdc9dc61-f84b-4a8b-9d75-cebc313e486c|dee-jay-jc-lk-od|OD ファンキースライサー|special|gated|
|dee-jay|18e6ec99-6da6-443f-8f48-d9bdc633b9ee|dee-jay-jc-mk|ワニングムーン|special|gated|
|dee-jay|e8820828-a3d0-421b-a5cd-f8a82179c893|dee-jay-jc-mk-od|OD ワニングムーン|special|gated|
|dee-jay|444208d8-6ae6-4e2a-83e3-45271bbf0e83|dee-jay-jc-hk|マキシマムストライク|special|gated|
|dee-jay|df6adee2-e9b5-476d-b3a0-ccec33e56ac3|dee-jay-jc-hk-od|OD マキシマムストライク|special|gated|
|dee-jay|a6c2fe5a-3708-4852-a006-a81964e63106|dee-jay-jc-dash|ジャグリンステップ|special|gated|
|dee-jay|2d1e8e24-0795-486b-97ab-7e1b92a18724|dee-jay-jc-dash-od|OD ジャグリンステップ|special|gated|
|dee-jay|7ccdd714-f92b-4519-8294-d0c74b2880bc|dee-jay-jc-backdash|ジャグリンスウェイ|special|gated|
|dee-jay|02cfea2b-ffef-4597-a02e-1ce45681924f|dee-jay-jc-backdash-od|OD ジャグリンスウェイ|special|gated|
|dee-jay|71e6690e-c671-4261-8357-5897427db6b2|dee-jay-sa1|SA1 グレイテストソバット|super|gated|
|dee-jay|d69c4e42-be17-41d0-bd47-361bbb7e5c48|dee-jay-sa2-l|SA2 サンライズフェスティバル・ライト|super|gated|
|dee-jay|6fa2d13c-5bc5-4dbd-972e-55a87bffe076|dee-jay-capcom-frame-062|SA2 サンライズフェスティバル・ライト （2段目）|super|gated|
|dee-jay|31da6036-e2ce-460a-bb31-61973bb5c2c1|dee-jay-capcom-frame-063|SA2 サンライズフェスティバル・ライト （3段目）|super|gated|
|dee-jay|dc38ff4b-74ec-413d-a9ae-f02075fae67c|dee-jay-capcom-frame-064|SA2 サンライズフェスティバル・ライト （4段目）|super|gated|
|dee-jay|9f701a1e-3205-4d9d-b3ed-203bbadc692c|dee-jay-capcom-frame-065|SA2 サンライズフェスティバル・ライト （5段目）|super|gated|
|dee-jay|f4cee08c-57ca-49d5-b504-49a058a07c1a|dee-jay-capcom-frame-066|SA2 サンライズフェスティバル・ライト （6段目）|super|gated|
|dee-jay|7b84810e-b64a-490a-9544-b3e5ad56e18a|dee-jay-capcom-frame-067|SA2 サンライズフェスティバル・ライト （7段目）|super|gated|
|dee-jay|ec8badb1-f76c-40df-aef5-0cdecc697567|dee-jay-sa2-m|SA2 サンライズフェスティバル・マーベラス|super|gated|
|dee-jay|931db92d-9f20-4825-99b3-09fe272e4e9f|dee-jay-capcom-frame-069|SA2 サンライズフェスティバル・マーベラス （2段目）|super|gated|
|dee-jay|a19af3ac-f82d-4e44-883f-169753de1ae7|dee-jay-capcom-frame-070|SA2 サンライズフェスティバル・マーベラス （3段目）|super|gated|
|dee-jay|ddec27c3-0c33-451f-b8fd-fee41dd151ed|dee-jay-capcom-frame-071|SA2 サンライズフェスティバル・マーベラス （4段目）|super|gated|
|dee-jay|04b34d3d-8fc8-41b5-a641-91e15af7eec9|dee-jay-capcom-frame-072|SA2 サンライズフェスティバル・マーベラス （5段目）|super|gated|
|dee-jay|442bb744-3d02-4420-85af-0e2418addfd1|dee-jay-capcom-frame-073|SA2 サンライズフェスティバル・マーベラス （6段目）|super|gated|
|dee-jay|23c7fa26-6be5-4265-9cf5-9fa755d7dc49|dee-jay-capcom-frame-074|SA2 サンライズフェスティバル・マーベラス （7段目）|super|gated|
|dee-jay|54f8dd59-6fed-42e9-8450-3057a8328280|dee-jay-sa2-h|SA2 サンライズフェスティバル・マキシマム|super|gated|
|dee-jay|aa24b69c-fad0-4afd-9a10-75d127dc0016|dee-jay-capcom-frame-076|SA2 サンライズフェスティバル・マキシマム （2段目）|super|gated|
|dee-jay|c6cfbf15-e944-4832-b34f-447992e4349d|dee-jay-capcom-frame-077|SA2 サンライズフェスティバル・マキシマム （3段目）|super|gated|
|dee-jay|e6c4f92c-6225-49cd-8300-2ba2c4d5261d|dee-jay-capcom-frame-078|SA2 サンライズフェスティバル・マキシマム （4段目）|super|gated|
|dee-jay|009dbeb4-0f84-45ea-a48b-1c6fefa8276f|dee-jay-capcom-frame-079|SA2 サンライズフェスティバル・マキシマム （5段目）|super|gated|
|dee-jay|49e5833a-a1e7-4933-91c5-a5aa696578d1|dee-jay-capcom-frame-080|SA2 サンライズフェスティバル・マキシマム （6段目）|super|gated|
|dee-jay|a2ce8de3-a0ca-4dd7-ab28-d675bb88c037|dee-jay-capcom-frame-081|SA2 サンライズフェスティバル・マキシマム （7段目）|super|gated|
|dee-jay|b2804ff3-6b1a-426e-b22f-f1e76a65fa30|dee-jay-capcom-frame-082|SA2 クライマックスブロー （マーベラス）|super|gated|
|dee-jay|1cd1f765-83a1-484f-b376-d4ba0dad6dde|dee-jay-capcom-frame-083|SA2 クライマックスブロー （マキシマム）|super|gated|
|dee-jay|3e80f796-5731-4850-afd2-a9ab7d1ba626|dee-jay-capcom-frame-084|SA2 アンコールビート （マーベラス）|super|gated|
|dee-jay|874e8382-2786-404c-8f46-e60ebb137773|dee-jay-capcom-frame-085|SA2 アンコールビート （マキシマム）|super|gated|
|dee-jay|4f198d4d-255c-4144-b0b5-46024644cd77|dee-jay-capcom-frame-086|（失敗版） SA2 サンライズフェスティバル （2段目）|super|gated|
|dee-jay|7518dac6-a1e4-4cf4-bad8-9a83f5773c1b|dee-jay-capcom-frame-087|（失敗版） SA2 サンライズフェスティバル （3段目）|super|gated|
|dee-jay|fa9e0930-eec9-4e6c-8e3a-25fa4c3f8df0|dee-jay-capcom-frame-088|（失敗版） SA2 サンライズフェスティバル （4段目）|super|gated|
|dee-jay|9df53a6c-295c-486c-abb1-e12dd93df036|dee-jay-capcom-frame-089|（失敗版） SA2 サンライズフェスティバル （5段目）|super|gated|
|dee-jay|713483f8-b6bf-4160-8ba9-a1abe3a0e5a5|dee-jay-capcom-frame-090|（失敗版） SA2 サンライズフェスティバル （6段目）|super|gated|
|dee-jay|70f30fa3-7f7c-4c95-b5a7-53c4c51aaa6e|dee-jay-capcom-frame-091|（失敗版） SA2 サンライズフェスティバル （7段目）|super|gated|
|dee-jay|e52bdd7f-b29f-43ba-83cc-e9f139b4b809|dee-jay-sa3|SA3 サタデーナイト|super|gated|
|dee-jay|88ef0949-2a51-4923-90e2-5a77f1501844|dee-jay-ca|CA サタデーナイト|super|gated|
|dee-jay|f6538624-3bad-4968-a1b3-1292f9d96311|dee-jay-forward-throw|スタンプ・ザ・ビート|throw|gated|
|dee-jay|e8b09fbd-4b14-49a8-a1b7-52067f87409b|dee-jay-back-throw|フリップスルー|throw|gated|
|dee-jay|c19eaa3a-aa16-4e44-9428-ff6e69f7d051|dee-jay-capcom-frame-096|前方ステップ|unique|gated|
|dee-jay|40ee2c2c-00cb-43af-a311-bd194e69c283|dee-jay-capcom-frame-097|後方ステップ|unique|gated|
|manon|23ddbf0e-4f6d-43d1-bc7d-69243454a4bb|manon-standing-lp|立ち弱P|normal|gated|
|manon|a30bb77f-b445-45d8-9553-69f9f95d4c7f|manon-standing-mp|立ち中P|normal|gated|
|manon|a2ab637e-c864-42d6-a7ae-4bd8817a95dd|manon-standing-hp|立ち強P|normal|gated|
|manon|a581ec10-1e15-42d2-ba9b-18f968c65f39|manon-standing-lk|立ち弱K|normal|gated|
|manon|0e2b2802-d460-4eaa-bc76-c4da80e6bb29|manon-standing-mk|立ち中K|normal|gated|
|manon|f0a39044-5d2c-4a5f-82df-9c16820eebdf|manon-standing-hk|立ち強K|normal|gated|
|manon|22224768-644f-49c1-94d2-6baedc745506|manon-crouching-lp|しゃがみ弱P|normal|gated|
|manon|f90b1411-94f7-4d79-b46f-b56961d0dd18|manon-crouching-mp|しゃがみ中P|normal|gated|
|manon|c2637f0c-c297-4bcb-94f4-1a560575226e|manon-crouching-hp|しゃがみ強P|normal|gated|
|manon|80ba147b-0531-4fc0-9b86-da220ab7a52b|manon-crouching-lk|しゃがみ弱K|normal|gated|
|manon|95906801-2718-41e8-a7ff-1e519604881c|manon-crouching-mk|しゃがみ中K|normal|gated|
|manon|4d0d1ebf-0226-487b-a19a-109d7efaa506|manon-crouching-hk|しゃがみ強K|normal|gated|
|manon|701cd562-2e2b-4b05-afdb-e9a162b076ce|manon-back-mk|後ろ中K|unique|gated|
|manon|44b0a3f1-968d-48e7-8162-8c03e994e443|manon-reverence|レベランス|unique|gated|
|manon|469e1ffd-bc8b-466e-8858-9cc9f83efeb9|manon-tomoe-derriere|トモエ・デリエール|unique|gated|
|manon|1a11e706-08e7-4a29-a656-84ac942d5a18|manon-a-terre|ア・テール|target_combo|fixture|
|manon|ee465bb0-22b4-41d2-9b26-a2fa733c3d06|manon-en-haut|アン・オー|target_combo|fixture|
|manon|20ab47b8-49bd-4bc0-b54e-ae8cb55aa7b2|manon-temps-lie-hp|タン・リエ（HP > HP）|target_combo|fixture|
|manon|77d4237a-58c0-46aa-b136-2125e9ee96a6|manon-temps-lie-2hp|タン・リエ（2HP > HP）|target_combo|gated|
|manon|e833739b-e7f2-43af-9e30-8b8d57513a15|manon-jump-lp|ジャンプ弱P|normal|gated|
|manon|a921d7b3-84e2-4cb5-998c-e28063671f5d|manon-jump-mp|ジャンプ中P|normal|gated|
|manon|1b7f9b40-80d2-472f-b954-be1619adb7c7|manon-jump-hp|ジャンプ強P|normal|gated|
|manon|4181126f-96c6-4856-96f7-cea78f874c41|manon-jump-lk|ジャンプ弱K|normal|gated|
|manon|b6d91c3a-0516-428f-9b80-14720578e991|manon-jump-mk|ジャンプ中K|normal|gated|
|manon|de77ddfe-d9e0-48c6-9776-7585a70193ac|manon-jump-hk|ジャンプ強K|normal|gated|
|manon|47d8e1cb-af05-4495-994d-cdf7f83675da|manon-manege-l|弱 マネージュ・ドレ|special|gated|
|manon|1c8375a6-7858-40ad-8ca3-aa265f2da682|manon-manege-m|中 マネージュ・ドレ|special|gated|
|manon|7508a273-cd0f-43ae-85f1-e16dc8f9b850|manon-manege-h|強 マネージュ・ドレ|special|gated|
|manon|ddc87d1a-7319-4f33-836d-1f1d49e31e79|manon-manege-od|OD マネージュ・ドレ|special|gated|
|manon|a517d65e-66a7-48ed-bbcc-7fd5be704c28|manon-rond-point-l|弱 ロン・ポワン|special|gated|
|manon|c2ee71d5-9294-43c2-9f9a-c1cba60a080c|manon-rond-point-m|中 ロン・ポワン|special|gated|
|manon|dbde2cbc-e04d-4c39-8847-4eaf65282637|manon-rond-point-h|強 ロン・ポワン|special|gated|
|manon|e33ab912-790e-4cc3-b532-1518cf8bdf7b|manon-rond-point-od|OD ロン・ポワン|special|gated|
|manon|f21d0878-5c98-45f9-995c-1488b784d044|manon-degage-l|弱 デガジェ|special|gated|
|manon|61da79b8-44e4-4102-8fd8-b8567c34b055|manon-degage-m|中 デガジェ|special|gated|
|manon|f284f407-cbb4-4300-a615-9a11af7178df|manon-degage-h|強 デガジェ|special|gated|
|manon|9de1ac97-fc73-4ae2-9271-64174f9b1c27|manon-degage-od|OD デガジェ|special|gated|
|manon|cb2b113e-e4dc-42a7-928b-b309cc78ec75|manon-renverse-l|弱 ランヴェルセ|special|gated|
|manon|a39eee5c-5732-4d6e-afb7-623e1ca7fb17|manon-renverse-m|中 ランヴェルセ|special|gated|
|manon|ec082d29-a7db-4164-9ba7-a9c73a5c9be5|manon-renverse-h|強 ランヴェルセ|special|gated|
|manon|2a72c52e-206d-4c2c-b564-705305fd9d1c|manon-renverse-od|OD ランヴェルセ|special|gated|
|manon|453697c0-bbee-4cd4-bb25-dc0fa55d688c|manon-grand-fouette|グラン・フェッテ|special|gated|
|manon|1ee03250-5022-4db8-ab9c-f08af76c1a4b|manon-grand-fouette-od|OD グラン・フェッテ|special|gated|
|manon|d7961e55-c6ed-443d-a3fa-e53fdc54fd26|manon-sa1|SA1 アラベスク|super|gated|
|manon|3e16e56f-1b3d-43ad-a321-ef70e876a8e0|manon-sa2|SA2 エトワール|super|gated|
|manon|061b7386-762e-467c-9b9d-09470f92a27d|manon-sa3|SA3 パ・ド・ドゥ|super|gated|
|manon|1d2d8c87-2a79-44c4-a3e3-263a7e00f9a4|manon-ca|CA パ・ド・ドゥ|super|gated|
|manon|e9d7d8e0-0ead-44cc-9c9f-4137ecb3aae4|manon-forward-throw|前投げ|throw|gated|
|manon|55b92472-63bf-4775-baf8-ee65ee4b1b60|manon-back-throw|後ろ投げ|throw|gated|
|marisa|0a0ee763-62ed-47a1-b118-8d3aa3069043|marisa-standing-lp|立ち弱P|normal|gated|
|marisa|e481d5e5-c92e-4123-8b4f-15712e49d122|marisa-standing-lk|立ち弱K|normal|gated|
|marisa|8da451d3-fce6-47af-99c2-bb7dfe30c4bc|marisa-standing-mp|立ち中P|normal|gated|
|marisa|dc37b5d4-ea8f-438d-bdcd-525c9c79ac54|marisa-standing-mk|立ち中K|normal|gated|
|marisa|49b3abad-1656-4da4-8ac5-bb08a6f0120f|marisa-standing-hp|立ち強P|normal|gated|
|marisa|d2a9ee6d-9154-449e-bd1e-59c3541cfb1e|marisa-standing-hp-charged|立ち強P（ホールド）|normal|gated|
|marisa|9a7758e3-61b0-43f4-95fe-c266142a5928|marisa-standing-hk|立ち強K|normal|gated|
|marisa|5d51d98d-1c65-42ac-bfbf-88a6d3acc0f9|marisa-standing-hk-charged|立ち強K（ホールド）|normal|gated|
|marisa|07ed2cc2-7120-4cd8-9717-ab94b69ef335|marisa-crouching-lp|しゃがみ弱P|normal|gated|
|marisa|ccc15440-1a93-47d3-b418-0c19ffaa9ac9|marisa-crouching-lk|しゃがみ弱K|normal|gated|
|marisa|4bdc72e5-bd38-4a84-bf76-77eeb11a22fa|marisa-crouching-mp|しゃがみ中P|normal|gated|
|marisa|51efb115-6a2f-4dab-979c-e122bba684b3|marisa-crouching-mk|しゃがみ中K|normal|gated|
|marisa|d9e2ffbc-e5f9-4ef3-88a9-304c2cb11113|marisa-crouching-hp|しゃがみ強P|normal|gated|
|marisa|f7baabab-6ba6-4502-a5cd-d40f6ef8af15|marisa-crouching-hp-charged|しゃがみ強P（ホールド）|normal|gated|
|marisa|6884aee0-ea97-470d-9bb7-7d7337a9815f|marisa-crouching-hk|しゃがみ強K|normal|gated|
|marisa|9af93d94-e6d3-4ff4-8fd6-52900942192f|marisa-crouching-hk-charged|しゃがみ強K（ホールド）|normal|gated|
|marisa|af90da9b-b6e2-4ce8-a1cc-4ec156f3b2e2|marisa-jump-lp|ジャンプ弱P|normal|gated|
|marisa|0fb71af6-f90c-4e8f-900a-86e4b1e27ae2|marisa-jump-lk|ジャンプ弱K|normal|gated|
|marisa|4b1a0068-0a3f-47ae-a6e7-25203715422a|marisa-jump-mp|ジャンプ中P|normal|gated|
|marisa|8b09cf50-8806-480a-ad0f-f84d8ecda4b0|marisa-jump-mk|ジャンプ中K|normal|gated|
|marisa|f7a86d2f-1e98-4e54-9a74-7a066e144ab2|marisa-forward-mp|前中P|unique|gated|
|marisa|a0d8ffde-c03a-4132-9182-35cfa18c384a|marisa-back-hp|後ろ強P|unique|gated|
|marisa|50e0ba77-5871-45d0-b2c2-6cc3377bca12|marisa-malleus-breaker|マレウスブレイカー|unique|gated|
|marisa|af1d4cda-8efa-4486-8538-58ffa69f3d6b|marisa-jump-hp|ジャンプ強P|normal|gated|
|marisa|008eb6cd-42d9-4890-93e6-4c9989226aa2|marisa-jump-hk|ジャンプ強K|normal|gated|
|marisa|bbeef1e8-9287-453d-bc4f-d115974a9331|marisa-caelum-arc|カエルムアーク|unique|gated|
|marisa|11b61a58-9052-4a0d-9afb-fa07a34e97a8|marisa-gladius-l|弱 グラディウス|special|gated|
|marisa|b7eadec4-8fd6-4a2c-8bec-7e850cce87a5|marisa-gladius-m|中 グラディウス|special|gated|
|marisa|836eefa3-c5c3-4b9c-bdbf-c10d8d4955c8|marisa-gladius-h|強 グラディウス|special|gated|
|marisa|e9ce6c9c-9cf2-4e01-b562-957f93bf9244|marisa-gladius-od|OD グラディウス|special|gated|
|marisa|98d29190-1a77-4567-a7f7-95659013c566|marisa-dimachaerus-l|弱 ディマカイルス|special|gated|
|marisa|07d94252-18d9-46b4-a466-7b949a899564|marisa-dimachaerus-m|中 ディマカイルス|special|gated|
|marisa|abf6ef9d-b60c-41ca-98ed-86fdbb4a05bb|marisa-dimachaerus-h|強 ディマカイルス|special|gated|
|marisa|9217a5dc-508e-4f69-a4ee-7ef8ea4cc947|marisa-dimachaerus-od|OD ディマカイルス|special|gated|
|marisa|5a668792-db6c-40cb-a688-0831f0b4cd36|marisa-phalanx-l|弱 ファランクス|special|gated|
|marisa|6b7b0036-ebfa-4321-88a4-20f5f4a8a234|marisa-phalanx-m|中 ファランクス|special|gated|
|marisa|2c260a98-659f-4f5d-99be-937bbead788e|marisa-phalanx-h|強 ファランクス|special|gated|
|marisa|6055f004-87c8-4693-a2ae-4bbb05bc007a|marisa-phalanx-od|OD ファランクス|special|gated|
|marisa|3ee9366f-f7dd-455b-be30-b32cff494759|marisa-quadriga-l|弱 クアドリガ|special|gated|
|marisa|aa6c3d5d-ecea-4d7a-bbfb-55842c2495d8|marisa-quadriga-m|中 クアドリガ|special|gated|
|marisa|eec39fbf-0e15-4910-93db-bb00358f13cc|marisa-quadriga-h|強 クアドリガ|special|gated|
|marisa|0d5b60c4-22a5-4806-9c05-4dfec9991fb8|marisa-quadriga-od|OD クアドリガ|special|gated|
|marisa|670780a3-5cf4-4b2f-8005-47093baac13d|marisa-scutum|スクトゥム|special|gated|
|marisa|f66f9d3e-fefd-41f5-83ef-8096ff841e23|marisa-scutum-od|OD スクトゥム|special|gated|
|marisa|4a95f844-02b5-4424-ad10-807efc6c2e5f|marisa-tonitrus|スクトゥム > トニトルス|special|gated|
|marisa|4c61549d-6bd2-47c7-b10a-4f06b4b6cc5f|marisa-procella|スクトゥム > プロケッラ|special|gated|
|marisa|1fc056f3-e4bb-4e38-a1f5-17ea3e58238b|marisa-enfold|スクトゥム > エンフォルド|special|gated|
|marisa|e563c895-a1c9-4bdf-b272-bd67571b9005|marisa-sa1|SA1 マリーザジャベリン|super|gated|
|marisa|cd89ca29-9d94-4bb5-8485-1cd1ef1b2f08|marisa-sa2|SA2 メテオリティス|super|gated|
|marisa|f9981edd-a6d9-436b-baef-f8546d865ebb|marisa-sa3|SA3 アポロウーサ|super|gated|
|marisa|fd10b2f0-9eae-4bd5-b435-745cc1f7417b|marisa-ca|CA アポロウーサ|super|gated|
|marisa|3eb3f810-dc04-40dd-82a6-dcad8a5eb0c1|marisa-forward-throw|前投げ|throw|gated|
|marisa|3d782d80-90d2-4dac-a551-7d1440154270|marisa-back-throw|後ろ投げ|throw|gated|
|jp|b558b854-1a5b-41a3-89ec-b119abc475ae|jp-standing-lp|立ち弱P（ノーシ）|normal|fixture|
|jp|45d7ef0d-2f7c-415d-b433-1e04ad9fe09b|jp-standing-lk|立ち弱K（ニージニイ・ウダール）|normal|fixture|
|jp|e4ed90d9-23bf-4089-978a-4f2061e3b94a|jp-standing-mp|立ち中P（シュトゥールム）|normal|fixture|
|jp|94ad1cb7-1464-432d-b7ee-34e0171541b0|jp-standing-mk|立ち中K（ウームヌィ・ウダール）|normal|fixture|
|jp|45863f7d-e112-42d8-ab88-d33839b4873a|jp-standing-hp|立ち強P（キンターヴル）|normal|fixture|
|jp|9e959d30-059e-404b-ab0e-279ec4c5a54a|jp-standing-hk|立ち強K（オボロートニ）|normal|fixture|
|jp|7c4584fd-fdb5-4fb9-84a2-472c3c03febe|jp-crouching-lp|しゃがみ弱P（ブィストルイ・ウダール）|normal|fixture|
|jp|5a596631-df8f-450b-b735-ae4b9ca14390|jp-crouching-lk|しゃがみ弱K（リョーフキー・ウダール）|normal|fixture|
|jp|0afd12fb-5c7a-4799-b222-21daa7ca18f3|jp-crouching-mp|しゃがみ中P（ズミヤー）|normal|fixture|
|jp|92ecb272-1cbd-46f0-95f2-ad4d21506e99|jp-crouching-mk|しゃがみ中K（ズローバ）|normal|fixture|
|jp|33b785cd-b4e9-4232-be5c-aca9ccef7b0a|jp-crouching-hp|しゃがみ強P（マリートヴァ）|normal|fixture|
|jp|5fad21d1-bb82-4a22-bf29-f125688d3cb9|jp-crouching-hk|しゃがみ強K（ジョーキル）|normal|fixture|
|jp|610e39c3-8fef-4a72-b85b-15c3a8fedd71|jp-guillotine|ギリオチーナ|unique|fixture|
|jp|290c6317-4a8a-4241-84cb-fc6774db1a98|jp-shalosti|シャーロスチ|unique|fixture|
|jp|00306fb8-0213-4c10-af70-df4286431957|jp-back-mp|後ろ中P / Back + Medium Punch|unique|fixture|
|jp|3ed94fcd-3820-4ad6-91ea-7405360afac0|jp-forward-hk|前強K（Bylina）|unique|fixture|
|jp|00edfdc1-cf06-4b8c-b836-a213a7028cf6|jp-jump-lp|ジャンプ弱P（ルイースイ）|normal|fixture|
|jp|6cb6065e-9c33-47d1-af2c-00e4b3871182|jp-jump-lk|ジャンプ弱K（ヴァローナ）|normal|fixture|
|jp|fb460c24-5453-48e4-bc72-dc3dffcfc81c|jp-grom-strelka|グローム・ストレルカ|target_combo|fixture|
|jp|0cc4dbc5-1dfc-4225-b050-a6ad29b92c0e|jp-zilant|ジラント|target_combo|fixture|
|jp|3baf3077-05b0-4360-b548-ee16b68f8a37|jp-jump-mp|ジャンプ中P（ローシャッチ）|normal|fixture|
|jp|1e3cc0be-14ef-4c39-9392-d8b88196fc46|jp-zilant-mid|ジラント・ミドル|target_combo|fixture|
|jp|ce1e365b-8572-44a2-8767-0bce9f20054b|jp-jump-mk|ジャンプ中K（コンダ）|normal|fixture|
|jp|0b5841d6-8c3d-4da9-af74-0d4e9c2e389c|jp-zilant-low|ジラント・ロー|target_combo|fixture|
|jp|88b7028e-f54a-4b51-a75a-670ccfce75dc|jp-jump-hp|ジャンプ強P（イディナローク）|normal|fixture|
|jp|ac58d193-6639-4fe4-921c-fb69f7a85908|jp-triglav-l|弱 トリグラフ / Triglav|special|fixture|
|jp|61797d46-a331-4638-ba60-3dc3ea0cfd16|jp-jump-hk|ジャンプ強K（ジャール・プチーツァ）|normal|fixture|
|jp|7e400c75-ee2f-491c-a063-c70d1c73d5ff|jp-triglav-m|中 トリグラフ / Triglav|special|fixture|
|jp|c6bcbf1d-e8ea-40f3-ae9e-c341ececf18d|jp-triglav-h|強 トリグラフ / Triglav|special|fixture|
|jp|c31fe91a-5449-49c7-b264-97dccae0908f|jp-triglav-od-l|OD 弱 トリグラフ / Triglav|special|fixture|
|jp|14090a4d-132e-4d55-8d8d-4669444dba8f|jp-triglav-od-m|OD 中 トリグラフ / Triglav|special|fixture|
|jp|6f77b24f-8671-4370-bd3a-f8e0e7c7028e|jp-triglav-od-h|OD 強 トリグラフ / Triglav|special|fixture|
|jp|34287e66-c123-4cba-8c97-7bb0bd5a90b6|jp-stribog-l|弱 ストリボーグ / Stribog|special|fixture|
|jp|acef0697-16a0-49eb-b289-4df09a1843e7|jp-stribog-m|中 ストリボーグ / Stribog|special|fixture|
|jp|43f19305-48cc-4928-b355-b07daf382c00|jp-stribog-h|強 ストリボーグ / Stribog|special|fixture|
|jp|b8329b05-de0d-46dd-8688-e44231540c80|jp-stribog-od|OD ストリボーグ / Stribog|special|fixture|
|jp|f0766896-f8e9-45eb-a769-0762d98a2714|jp-departure-l|弱 ヴィーハト / Departure|special|fixture|
|jp|732536be-f8e8-4701-9871-991075ed5c8a|jp-departure-m|中 ヴィーハト / Departure|special|fixture|
|jp|50c13c49-015c-423a-880e-9c4663ad34d9|jp-departure-h|強 ヴィーハト / Departure|special|fixture|
|jp|9ec80073-a3d7-4d24-9437-8a21dc112c68|jp-departure-od-l|OD 弱 ヴィーハト / Departure|special|fixture|
|jp|40e948eb-d634-4dc8-8b3a-43aef82df522|jp-departure-od-m|OD 中 ヴィーハト / Departure|special|fixture|
|jp|c9f1220a-5353-4da4-803e-02b71563cf85|jp-departure-od-h|OD 強 ヴィーハト / Departure|special|fixture|
|jp|6fbfed6b-7805-4277-b216-60503d4cee88|jp-departure-window|ヴィーハト・アクノ / Departure > Window|special|fixture|
|jp|a6b9d663-b9b3-494b-8d43-7aed196be8f4|jp-departure-shadow|ヴィーハト・チェーニ / Departure > Shadow|special|fixture|
|jp|51680ee1-db0b-4906-80da-93ba82dde6f1|jp-amnesia|アムネジア / Amnesia|special|fixture|
|jp|f262b667-3ec4-4b75-a7f1-df1748df2ba3|jp-amnesia-od|OD アムネジア / Amnesia|special|fixture|
|jp|06f4575b-6654-459f-bf7b-2357dcf71478|jp-torbalan-l|弱 トルバラン / Torbalan|special|fixture|
|jp|0b13852f-0f76-4787-b794-1ef8257fa5fe|jp-torbalan-m|中 トルバラン / Torbalan|special|fixture|
|jp|cd0255a1-bf6f-4b92-ad4e-1b2d5905983c|jp-torbalan-h|強 トルバラン / Torbalan|special|fixture|
|jp|852ac443-78e0-4c00-a43e-5196d33aba36|jp-torbalan-od|OD トルバラン / Torbalan|special|fixture|
|jp|a7bb98cd-731c-485c-ab95-78de6cf5448e|jp-embrace|エンブレイス / Embrace|special|fixture|
|jp|e87c51f7-a2e9-44b1-8061-d823351b42d5|jp-embrace-od|OD エンブレイス / Embrace|special|fixture|
|jp|7817f9e6-8542-4da1-be01-c6bd24294f22|jp-sa1|チェルノボーグ / Chornobog（SA1）|super|fixture|
|jp|85762bb5-b5ae-4a88-b4ee-55112037774e|jp-sa2|ラヴーシュカ / Lovushka（SA2）|super|fixture|
|jp|1845d4b9-4bac-4e4e-b6fd-3b57accfa973|jp-sa3|ザプリェット / Interdiction（SA3）|super|fixture|
|jp|2472fe66-f312-4a5d-9c7c-25e0fa2515d7|jp-ca|ザプリェット / Interdiction（CA）|super|fixture|
|jp|94a12a74-68c3-41d2-9fb5-7684451741b5|jp-forward-throw|前投げ|throw|fixture|
|jp|a63b4bd9-535b-4893-a55e-42d105ad9f8b|jp-back-throw|後ろ投げ|throw|fixture|
|jp|8fdddc58-2331-4ceb-baec-cd8289c30bb5|jp-tornado|トルネード / Tornado|throw|fixture|
|zangief|bb3ef38f-80b6-4859-b45a-3e5e161bf47d|zangief-standing-lp|立ち弱P|normal|gated|
|zangief|99fb6d15-984b-4a5e-9769-d090c0e2db21|zangief-standing-lp-rapid|立ち弱P（連打キャンセル版）|normal|gated|
|zangief|c5461be8-2131-4ab4-93cb-f33ce62b4abb|zangief-standing-lk|立ち弱K|normal|gated|
|zangief|65d09147-c7e2-4118-a327-812b7aee734c|zangief-standing-mp|立ち中P|normal|gated|
|zangief|ff7232e2-08d6-4e11-937d-267012e2bfb6|zangief-standing-mk|立ち中K|normal|gated|
|zangief|97f29df8-fc86-4644-bdfc-6b8a4b7d5cbd|zangief-standing-hp|立ち強P|normal|gated|
|zangief|69221b02-e8c8-4f6b-9705-cd7d6adc577a|zangief-standing-hp-charged|立ち強P（ホールド）|normal|gated|
|zangief|282a7574-4278-4991-96b8-aace72061e14|zangief-standing-hk|立ち強K|normal|gated|
|zangief|78f4195c-362c-47db-87fa-4368e14c8e1a|zangief-crouching-lp|しゃがみ弱P|normal|gated|
|zangief|4990d250-0915-4ecc-99a2-d53f2d679b1b|zangief-crouching-lp-rapid|しゃがみ弱P（連打キャンセル版）|normal|gated|
|zangief|5174a94f-0f1e-4401-91f8-79b38bac474b|zangief-crouching-lk|しゃがみ弱K|normal|gated|
|zangief|8dcd6126-66d9-4a5f-96ff-97375f0c06aa|zangief-crouching-lk-rapid|しゃがみ弱K（連打キャンセル版）|normal|gated|
|zangief|eeea022d-c2c8-4806-b098-9ac01ac64768|zangief-crouching-mp|しゃがみ中P|normal|gated|
|zangief|0eb8fc53-158b-4b05-a749-1f18edee59fe|zangief-crouching-mk|しゃがみ中K|normal|gated|
|zangief|ee8ba451-ed5e-4393-960b-d97117872093|zangief-crouching-hp|しゃがみ強P|normal|gated|
|zangief|bb752526-d05a-42bc-bdd1-f73213ad600b|zangief-crouching-hk|しゃがみ強K|normal|gated|
|zangief|e8255860-cfad-4d52-b565-2b93285b5d35|zangief-jump-lp|ジャンプ弱P|normal|gated|
|zangief|c14f9dc6-0bf8-4bfd-a851-597b6c2ea538|zangief-jump-lk|ジャンプ弱K|normal|gated|
|zangief|62d308f8-1d29-4e0f-9b43-936bfd951583|zangief-jump-mp|ジャンプ中P|normal|gated|
|zangief|7c3aa976-8051-46a7-bc51-484cc42a09cd|zangief-jump-mk|ジャンプ中K|normal|gated|
|zangief|87266be2-2f2d-46e3-9be4-82e6205ba22a|zangief-forward-mp|ヘルスタブ|unique|gated|
|zangief|35687da1-7e42-4f95-8291-997afe2a87d4|zangief-knee-hammer|ニーバット|unique|gated|
|zangief|a2d40675-a0c3-48c0-a4fd-404dba335d57|zangief-headbutt|ヘッドバット|unique|gated|
|zangief|d9586bd9-7772-4848-ae3c-07678e098dce|zangief-cyclone-wheel|サイクロンニールキック|unique|gated|
|zangief|a906b77a-fac7-4af5-b504-6703c9c326fb|zangief-dropkick|スメタナドロップキック|unique|gated|
|zangief|1476cf16-7efd-4570-8d43-32ce58ac52f4|zangief-power-stomps|ストンピング|unique|gated|
|zangief|d947a02d-bc33-4488-88e6-d3c47ded3cdf|zangief-jump-hp|ジャンプ強P|normal|gated|
|zangief|cdc01926-65fc-48d3-936e-ec17651e24ce|zangief-jump-hk|ジャンプ強K|normal|gated|
|zangief|bf6c5e62-ea0c-4a56-a50f-86b0315639e0|zangief-jump-down-hp|フライングボディプレス|unique|gated|
|zangief|2ebe76b8-1ebb-4858-8768-506d735f6950|zangief-flying-headbutt|フライングヘッドバット|unique|gated|
|zangief|dcaa6b8e-a890-4fc1-8cd0-5b0eda3fc46e|zangief-lariat|ダブルラリアット|special|gated|
|zangief|607a609a-965c-47f3-8bf9-1d85f46fef7d|zangief-lariat-od|OD ダブルラリアット|special|gated|
|zangief|b66ea408-f849-471c-9c83-6752ac418f97|zangief-spd-l|弱 スクリューパイルドライバー|special|gated|
|zangief|da70ca46-5657-4c92-b64f-a5d183868d2c|zangief-spd-m|中 スクリューパイルドライバー|special|gated|
|zangief|5e58e436-e252-4954-9376-ee931ac2274f|zangief-spd-h|強 スクリューパイルドライバー|special|gated|
|zangief|289e792a-b1df-465c-9a70-625738990b50|zangief-spd-od|OD スクリューパイルドライバー|special|gated|
|zangief|581d6f69-8903-42e9-9cab-95516dc08c62|zangief-borscht|ボルシチダイナマイト|special|gated|
|zangief|24fc2e5a-1a00-4483-8038-a699a7910f5a|zangief-borscht-od|OD ボルシチダイナマイト|special|gated|
|zangief|68528506-5339-4057-86bd-0516bc7b0471|zangief-suplex|ロシアンスープレックス / シベリアンエクスプレス|special|gated|
|zangief|affd4f00-0ad5-4471-a887-2fafde1f6ba2|zangief-suplex-od|OD ロシアンスープレックス / シベリアンエクスプレス|special|gated|
|zangief|bfb8b0aa-7e06-413c-9060-3d1ae5d1ddf0|zangief-tundra-storm|ツンドラストーム|special|gated|
|zangief|97e3e20a-2e9c-42fb-a469-db1ffad3461f|zangief-sa1|SA1 エリアルロシアンスラム|super|gated|
|zangief|556f01e9-26c5-44fe-a040-6a9df119224b|zangief-sa2|SA2 サイクロンラリアット|super|gated|
|zangief|07544f32-f3c5-4664-9769-2c6b6a51fbec|zangief-sa3|SA3 ボリショイストームバスター|super|gated|
|zangief|329420bc-a269-4ab5-a252-f1ee48c76224|zangief-ca|CA ボリショイストームバスター|super|gated|
|zangief|6710753b-e2a8-4912-8c71-b4aa83fc9b46|zangief-forward-throw|前投げ|throw|gated|
|zangief|32d6df45-6fb9-44f0-b1b4-ce65096c3ad4|zangief-back-throw|後ろ投げ|throw|gated|
|lily|47688cef-f3bf-45f6-b4bf-83bec7695c18|lily-standing-lp|立ち弱P|normal|gated|
|lily|6a0a575f-4548-4adf-ac32-d043cc15dfbf|lily-standing-lk|立ち弱K|normal|gated|
|lily|f4c2b403-675b-48ef-a04a-78d2382ca631|lily-standing-mp|立ち中P|normal|gated|
|lily|48125962-89d1-4fbe-88f0-a29b4b4173ba|lily-standing-mk|立ち中K|normal|gated|
|lily|0cf0c983-503b-437c-81d9-0d3c5ce2c243|lily-standing-hp|立ち強P|normal|gated|
|lily|2e7b4bbc-a9da-47a2-86b0-7987ad5b69a3|lily-standing-hk|立ち強K|normal|gated|
|lily|a59a7028-d1e4-46de-8c39-445ab2793bc2|lily-crouching-lp|しゃがみ弱P|normal|gated|
|lily|a7dca108-10d6-4d01-b2c8-987a2a543d19|lily-crouching-lk|しゃがみ弱K|normal|gated|
|lily|562bdd63-69d2-45af-a846-1575e7ed6164|lily-crouching-mp|しゃがみ中P|normal|gated|
|lily|99d40d81-1aee-4194-99df-27a556359da1|lily-crouching-mk|しゃがみ中K|normal|gated|
|lily|7c920824-53ef-4ed5-95da-a744eb17a49c|lily-crouching-hp|しゃがみ強P|normal|gated|
|lily|b9d5b6ee-30ba-4dd8-a005-618a2fb5573d|lily-crouching-hk|しゃがみ強K|normal|gated|
|lily|db1dc9a6-a40d-4a67-a9f2-23cfc5da9cb6|lily-jump-lp|ジャンプ弱P|normal|gated|
|lily|c019e770-945f-49ba-90cc-6f27cdd7cc49|lily-jump-lk|ジャンプ弱K|normal|gated|
|lily|9e0e16a5-893b-4afc-8768-b809085f2b3c|lily-jump-mp|ジャンプ中P|normal|gated|
|lily|9b0d90ef-57d6-44bf-b3e4-979fbe61d341|lily-jump-mk|ジャンプ中K|normal|gated|
|lily|d0e0be38-756e-4649-8b42-ab710f43c81d|lily-jump-hp|ジャンプ強P|normal|gated|
|lily|506d86ff-9851-4d4a-97f7-f5445ae0a5df|lily-ridge-thrust|スラストリッジ|unique|gated|
|lily|a722c0d0-c726-44f7-880c-0506f31bb6ca|lily-horn-breaker|ホーンブレイク|unique|gated|
|lily|b1197eb5-0af7-4da8-bf0a-f9af1a7094b1|lily-forward-hp|前強P|unique|gated|
|lily|8b413672-a9a4-4b33-a4d0-c71fc2bbd7bb|lily-desert-storm|デザートストーム|target_combo|gated|
|lily|0290a978-c728-46e4-a8f7-b493f68df73c|lily-jump-hk|ジャンプ強K|normal|gated|
|lily|b8f6c01b-75fe-447b-993e-53883d70c86c|lily-great-spin|グレートスピン|unique|gated|
|lily|d563587e-1e97-4039-9a78-2bab79f78d58|lily-condor-wind-l|弱 コンドルウィンド|special|gated|
|lily|05bab123-00a7-41b0-889f-53e4527153ef|lily-condor-wind-m|中 コンドルウィンド|special|gated|
|lily|00757623-de90-4d2e-ae90-da9a682a357d|lily-condor-wind-h|強 コンドルウィンド|special|gated|
|lily|2efc8988-c256-4213-8198-1191e8ef8928|lily-condor-wind-od|OD コンドルウィンド|special|gated|
|lily|a79cee14-f203-4edd-b652-ce84a8ed3101|lily-condor-spire-l|弱 コンドルスパイア|special|gated|
|lily|2a8f3b75-dc9e-4b74-bc99-453d89e393de|lily-condor-spire-m|中 コンドルスパイア|special|gated|
|lily|9dbe5691-feb2-4ca7-9d7c-5540866135bf|lily-condor-spire-h|強 コンドルスパイア|special|gated|
|lily|b7e85880-5a68-4d91-a643-c906bdf4b226|lily-condor-spire-od|OD コンドルスパイア|special|gated|
|lily|fe1878ca-0f87-4caa-8a08-52586006a3b4|lily-tomahawk-l|弱 トマホークバスター|special|gated|
|lily|491be84d-faa8-4ecc-9a4f-4b4e8faa3c5b|lily-tomahawk-m|中 トマホークバスター|special|gated|
|lily|564965af-494f-4926-9ffb-542c60e0d5bb|lily-tomahawk-h|強 トマホークバスター|special|gated|
|lily|d9a2e1cb-6fb0-4d81-85d8-b052b0eced6d|lily-tomahawk-od|OD トマホークバスター|special|gated|
|lily|d9dc6a43-1108-4cc6-b910-a57dd875db7f|lily-condor-dive|コンドルダイブ|special|gated|
|lily|3d24b9fa-acd9-40c7-ab2d-c6072387bf4e|lily-condor-dive-od|OD コンドルダイブ|special|gated|
|lily|204a2e48-71e3-4180-b42e-8ec5c8bd1ed7|lily-typhoon-l|弱 メキシカンタイフーン|special|gated|
|lily|c58e0a88-2a82-4f7f-a8d9-60b2b406f395|lily-typhoon-m|中 メキシカンタイフーン|special|gated|
|lily|00098e8f-ce4d-45cf-a785-f3238be5e859|lily-typhoon-h|強 メキシカンタイフーン|special|gated|
|lily|f37f3b86-5ba5-4ccf-831b-f0ebcc4cae2d|lily-typhoon-od|OD メキシカンタイフーン|special|gated|
|lily|c0d1f90a-71dc-4cd6-97a5-e9b300369320|lily-sa1|SA1 ブリージングホーク|super|gated|
|lily|b6c4e084-c653-42b8-94b8-c0a5dd115702|lily-sa2|SA2 サンダーバード|super|gated|
|lily|32d1cd8d-b7a2-4def-8074-667ee62e8536|lily-sa3|SA3 レイジングタイフーン|super|gated|
|lily|d443d973-0462-458f-a25e-3b51759ebfd2|lily-ca|CA レイジングタイフーン|super|gated|
|lily|a903733b-bfea-4ae3-bb7a-a2ab1f8db7bc|lily-forward-throw|前投げ|throw|gated|
|lily|3efe3247-d69b-499e-aaed-b81b421b7b5e|lily-back-throw|後ろ投げ|throw|gated|
|cammy|087a4701-4c9c-4d72-aba7-6653466bb2bc|cammy-standing-lp|立ち弱P|normal|gated|
|cammy|f778ea31-4d34-4adc-adb0-713d01bffd51|cammy-standing-lk|立ち弱K|normal|gated|
|cammy|108b54e6-0bc5-4418-b42d-a8ff0c3c8f73|cammy-standing-mp|立ち中P|normal|gated|
|cammy|f9b6bfa2-1c71-40f4-b77b-d075013b84be|cammy-standing-mk|立ち中K|normal|gated|
|cammy|e0fc3a4b-6aa8-4b6f-accc-ce98a46e1faa|cammy-standing-hp|立ち強P|normal|gated|
|cammy|20e18c1b-7943-48b6-a2a3-cc6fe2f4d0d7|cammy-standing-hk|立ち強K|normal|gated|
|cammy|5e4a4363-f1ee-43d6-bec9-caed4d1c6d26|cammy-crouching-lp|しゃがみ弱P|normal|gated|
|cammy|a4b70351-6955-4bd8-857f-40414c293776|cammy-crouching-lk|しゃがみ弱K|normal|gated|
|cammy|ceade123-4db9-4071-abfb-d0ba645b587f|cammy-crouching-mp|しゃがみ中P|normal|gated|
|cammy|cae4b758-62cc-4115-a067-706e84ff59fd|cammy-crouching-mk|しゃがみ中K|normal|gated|
|cammy|48162de8-8d3f-4449-afd5-cec46bcf1078|cammy-crouching-hp|しゃがみ強P|normal|gated|
|cammy|8cefd04a-ac28-44aa-b841-4ceed029513d|cammy-crouching-hk|しゃがみ強K|normal|gated|
|cammy|4cbf54f3-dcb6-4cae-be0b-53d2da935a6f|cammy-jump-lp|ジャンプ弱P|normal|gated|
|cammy|6060d323-fa4e-4b00-845f-131524b49f6d|cammy-jump-lk|ジャンプ弱K|normal|gated|
|cammy|bf6e9444-04e0-42bb-8bd0-529fd8cb7858|cammy-jump-mp|ジャンプ中P|normal|gated|
|cammy|4dd98dcb-5860-4283-8152-31ef60d7a057|cammy-jump-mk|ジャンプ中K|normal|gated|
|cammy|3f29b3ca-9e60-4469-b102-07091159ce98|cammy-jump-hp|ジャンプ強P|normal|gated|
|cammy|9c176e07-df77-49eb-a10f-86f0d248694c|cammy-jump-hk|ジャンプ強K|normal|gated|
|cammy|00785f4b-7d74-438a-ab56-be2b670a5a3f|cammy-lift-uppercut|リフトアッパー|unique|gated|
|cammy|35fa1349-e2c3-47d7-9aa2-e3a714c3e748|cammy-delayed-ripper|ディレイリーパー|unique|gated|
|cammy|5df39884-a7fd-4c62-8463-33b417c0ce2d|cammy-back-hk|4強K|unique|gated|
|cammy|f4475688-1cb6-4d3a-b8a2-67af5f0d0e28|cammy-lift-combination|リフトコンビネーション|target_combo|gated|
|cammy|0d8d69be-af5f-4af6-8467-bb409688c5a8|cammy-swing-combination|スイングコンビネーション|target_combo|gated|
|cammy|87b8fb8d-fb42-47ab-888a-3cef95bed816|cammy-spiral-l|弱スパイラルアロー|special|gated|
|cammy|b59dd7ce-b8fa-4d16-b242-5a65e23681fb|cammy-spiral-m|中スパイラルアロー|special|gated|
|cammy|b5d594f6-2302-4b9b-8d8d-4deedc32697e|cammy-spiral-h|強スパイラルアロー|special|gated|
|cammy|354b338e-970f-460a-9e32-3d9e2199f96f|cammy-spiral-h-hold|ホールド強スパイラルアロー|special|gated|
|cammy|d4eaa3bd-9caa-4bd6-a135-09f0ea3c5813|cammy-spiral-od|ODスパイラルアロー|special|gated|
|cammy|ce06088f-6db6-4cf8-abe2-e524d0c05787|cammy-spike-l|弱キャノンスパイク|special|gated|
|cammy|74868b87-648f-4adb-b624-d3749991b031|cammy-spike-m|中キャノンスパイク|special|gated|
|cammy|bf240fb8-69c0-4e92-a450-4e4f1bfb3f3d|cammy-spike-h|強キャノンスパイク|special|gated|
|cammy|282aff55-6ba1-421d-b83c-dece6699d450|cammy-spike-h-hold|ホールド強キャノンスパイク|special|gated|
|cammy|3b480694-4948-443a-8a08-c3db8691bcf0|cammy-spike-od|ODキャノンスパイク|special|gated|
|cammy|2507fb57-cbd0-4755-b06f-38134b36ce82|cammy-knuckle-l|弱アクセルスピンナックル|special|gated|
|cammy|48996237-b1cc-4a71-8376-c83fbb075e3a|cammy-knuckle-m|中アクセルスピンナックル|special|gated|
|cammy|8e97a311-869b-4bac-9452-7d922591b4a8|cammy-knuckle-h|強アクセルスピンナックル|special|gated|
|cammy|a7a85481-b314-4e21-ba23-11b261a41335|cammy-knuckle-od|ODアクセルスピンナックル|special|gated|
|cammy|80bee02a-249d-4230-9640-bb29964c1434|cammy-cannon-strike|キャノンストライク|special|gated|
|cammy|6dd6a2a0-d98b-4b2f-82d3-115d34e7ae1e|cammy-cannon-strike-od|ODキャノンストライク|special|gated|
|cammy|61721245-946e-4951-9035-a59e0922d101|cammy-hooligan-slicer|フーリガンコンビネーション＞レイザーエッジスライサー|special|gated|
|cammy|db190382-371c-4b77-9134-7cf125ac8bb0|cammy-hooligan-slicer-od|ODフーリガン＞レイザーエッジスライサー|special|gated|
|cammy|84a3ca4b-ab3c-4034-bbeb-e1bcba8775cc|cammy-hooligan-strike|フーリガン＞キャノンストライク|special|gated|
|cammy|7c8eb8b0-fb38-4e7d-a5cd-648448f931b4|cammy-hooligan-reverse|フーリガン＞リバースエッジ|special|gated|
|cammy|5e300bea-0365-4a60-b820-f42679cd2c7e|cammy-hooligan-throw|フーリガン＞フェイタルレッグツイスター|special|gated|
|cammy|18521e87-1e5f-40d7-8ed5-20760e94c8ee|cammy-hooligan-silent|フーリガン＞サイレントステップ|special|gated|
|cammy|6e3fe94c-78fe-4993-99d9-1cc050510fc9|cammy-sa1|スピンドライブスマッシャー|super|gated|
|cammy|b71563a1-1e76-426e-846a-efe566eb419f|cammy-sa2|キラービースピン|super|gated|
|cammy|13a0114b-6cb3-4079-ae51-d51fa15b20ee|cammy-sa2-air|エアキラービースピン|super|gated|
|cammy|d6b92f12-9c33-48e7-9220-f75922701a3e|cammy-sa3|デルタレッドアサルト|super|gated|
|cammy|71d63a3e-9f39-41fa-b44e-14c42a6bde23|cammy-ca|デルタレッドアサルト（CA）|super|gated|
|cammy|00398ea1-7adc-44eb-8edc-321538bec402|cammy-forward-throw|前投げ|throw|gated|
|cammy|5003bab7-95fe-405f-960b-f1af0fa4151b|cammy-back-throw|後ろ投げ|throw|gated|
|cammy|2e4348f3-6108-41bc-a0ff-3cac35362291|cammy-air-throw|空中投げ|throw|gated|
|rashid|3ebe138a-f24d-4696-995f-5cb6451d037a|rashid-standing-lp|立ち弱P|normal|gated|
|rashid|b4516e12-a45f-47da-bce5-23fa71cf697e|rashid-standing-lk|立ち弱K|normal|gated|
|rashid|7252c75a-2123-4170-a542-1b21911c43ec|rashid-standing-mp|立ち中P|normal|gated|
|rashid|00ddec54-466d-4653-ae84-2f0d148fbf25|rashid-standing-mk|立ち中K|normal|gated|
|rashid|43355763-5313-4141-9de1-f8781f0639df|rashid-standing-hp|立ち強P|normal|gated|
|rashid|0ff95150-dd6d-425b-aafd-01c14ade4ed5|rashid-standing-hk|立ち強K|normal|gated|
|rashid|b459f906-d710-4305-ba06-76effc05a122|rashid-crouching-lp|しゃがみ弱P|normal|gated|
|rashid|0ef71f00-7096-4b97-b00a-c89c475d12b9|rashid-crouching-lk|しゃがみ弱K|normal|gated|
|rashid|b3d37c80-b3a9-4ba6-896f-73b95da5aee1|rashid-crouching-mp|しゃがみ中P|normal|gated|
|rashid|8659ff28-3220-4b5c-9cf3-0fbe338f5447|rashid-crouching-mk|しゃがみ中K|normal|gated|
|rashid|1b689c0d-f1d1-41a0-b2e5-ef32b1ce40c3|rashid-crouching-hp|しゃがみ強P|normal|gated|
|rashid|e8afff26-8248-4f84-80a8-5befd9bdccc9|rashid-crouching-hk|しゃがみ強K|normal|gated|
|rashid|9d9f4f43-8e2e-4265-ae16-a327357e001e|rashid-jump-lp|ジャンプ弱P|normal|gated|
|rashid|af4a3e5d-e550-4e1f-9b77-0f9b8040de93|rashid-jump-lk|ジャンプ弱K|normal|gated|
|rashid|d3d1c380-8ba4-4244-8ac5-57a5fab0b5c3|rashid-jump-mp|ジャンプ中P|normal|gated|
|rashid|a277674a-e207-425d-8f63-48d8c7a2882f|rashid-jump-mk|ジャンプ中K|normal|gated|
|rashid|b687a0aa-1c7a-4bed-8eda-4dc14b9ce951|rashid-jump-hp|ジャンプ強P|normal|gated|
|rashid|634dfdac-eb2c-4f55-9ee8-57a4a748d6f6|rashid-jump-hk|ジャンプ強K|normal|gated|
|rashid|de27f855-6232-4098-bf00-d718e26ceb7e|rashid-run|ラン|unique|gated|
|rashid|8cc71489-4897-48cf-b77e-e4ba87ac6843|rashid-backup|バックアップ|unique|gated|
|rashid|ac08f4e5-d61d-4455-81cf-78044483eeec|rashid-tempest-moon|テンペストムーン|unique|gated|
|rashid|daa36e5b-1e69-4950-9ad3-884c96f97b84|rashid-flapping-spin|フラッピングスピン|unique|gated|
|rashid|c3456374-88d8-425e-9227-34890583d2df|rashid-break-assault|ブレイクアサルト|unique|gated|
|rashid|a46571ba-1e14-45e1-9441-3a98b5ac4db3|rashid-crescent-kick|クレセントキック|unique|gated|
|rashid|bbb5a868-6323-476f-b782-6bca034959ff|rashid-side-flip|サイドフリップ|unique|gated|
|rashid|4f6cfd73-f0f6-4042-bb5b-769c11b4dd93|rashid-front-flip|フロントフリップ|unique|gated|
|rashid|de7eb545-550e-4acb-a16a-f9d10e0a7c18|rashid-rising-kick|ライジングキック|target_combo|gated|
|rashid|fa221c4d-c9b5-45dc-a9ba-8f97c39c77fe|rashid-spinning-mixer-l|弱スピニングミキサー|special|gated|
|rashid|9cf342db-df03-4ca4-8784-95862d8beb5b|rashid-spinning-mixer-m|中スピニングミキサー|special|gated|
|rashid|f5d14482-3cfd-402c-8218-d4e56b3d41b1|rashid-spinning-mixer-h|強スピニングミキサー|special|gated|
|rashid|86626a4b-1d07-42fe-bba5-20484654b14d|rashid-spinning-mixer-od|ODスピニングミキサー|special|gated|
|rashid|32fadd68-b3b8-441b-a714-0654a5d79ed9|rashid-eagle-spike-l|弱イーグルスパイク|special|gated|
|rashid|3ab2ac67-fa8f-4ccd-bee1-dc4e0bec45b2|rashid-eagle-spike-m|中イーグルスパイク|special|gated|
|rashid|b4065448-f993-46cb-85fe-b765647c2ce0|rashid-eagle-spike-h|強イーグルスパイク|special|gated|
|rashid|5bf6c6c0-defe-4990-99a3-cc725a757fa2|rashid-eagle-spike-od|ODイーグルスパイク|special|gated|
|rashid|e51dd2a6-7cdf-45a3-b5a9-61e6e3ff99b3|rashid-whirlwind-shot|ワールウインド・ショット|special|gated|
|rashid|d1be1e82-9053-47bd-8151-7d5685e77674|rashid-arabian-cyclone-l|弱アラビアンサイクロン|special|gated|
|rashid|c784a575-3056-451f-bb91-29bc9d22c467|rashid-arabian-cyclone-m|中アラビアンサイクロン|special|gated|
|rashid|ac645307-8547-4842-ac04-0dcfce948526|rashid-arabian-cyclone-h|強アラビアンサイクロン|special|gated|
|rashid|babc0054-e8a2-4cc6-9f45-3d6edf02fe7e|rashid-arabian-cyclone-od|ODアラビアンサイクロン|special|gated|
|rashid|40c5c26a-bcd7-4df0-8ff6-952dbec9b6c5|rashid-wing-stroke|ウイング・ストローク|special|gated|
|rashid|7e1b3557-f159-4bac-b373-dbe05a25f5fa|rashid-rolling-assault|ローリング・アサルト|special|gated|
|rashid|d2ff8a2b-fff2-435e-bee9-b2ce37e4a5f3|rashid-nail-assault|ネイル・アサルト|special|gated|
|rashid|dc601d7e-3b68-489f-8cba-26af3dd27576|rashid-arabian-skyhigh-l|弱アラビアン・スカイハイ|special|gated|
|rashid|0e176630-093f-45da-b14d-89aedc0351dd|rashid-arabian-skyhigh-m|中アラビアン・スカイハイ|special|gated|
|rashid|199d95f3-0448-47ad-8755-907025ec73b6|rashid-arabian-skyhigh-h|強アラビアン・スカイハイ|special|gated|
|rashid|a2c35da5-202c-47b5-ac09-1183910eddde|rashid-arabian-skyhigh-od|ODアラビアン・スカイハイ|special|gated|
|rashid|94467707-05fc-4ade-bdcd-12e9679fc4be|rashid-sa1|スーパー・ラシード・キック|super|gated|
|rashid|65f8a26b-8db1-461c-8155-fe2654d0ef93|rashid-sa2|イウサール|super|gated|
|rashid|fce51be8-e862-490e-b57e-7affd1ced909|rashid-sa3|アルタイル|super|gated|
|rashid|913b8ba5-30e6-4cd7-8f9f-0cd79b2734dd|rashid-ca|アルタイル（CA）|super|gated|
|rashid|f5f54109-2d7e-407c-88fb-2d131ac0c6a3|rashid-forward-throw|前投げ|throw|gated|
|rashid|0c0a3ca4-6f2d-4636-af55-75e756d16ba3|rashid-back-throw|後ろ投げ|throw|gated|
|rashid|bb451c18-e404-420c-9330-b425eb613dea|rashid-air-throw|空中投げ|throw|gated|
|aki|1b11679c-d907-4fb9-a86e-8d99826918bc|aki-standing-lp|立ち弱P|normal|gated|
|aki|775e55e3-604d-4e30-add8-bf39d4c88147|aki-standing-lk|立ち弱K|normal|gated|
|aki|5a03895b-2682-46df-96ab-f2b2c2af18f6|aki-standing-mp|立ち中P|normal|gated|
|aki|6a5467b6-67a0-4849-b726-32f5c1cf9fc7|aki-standing-mk|立ち中K|normal|gated|
|aki|7880c49a-8781-49de-9a9c-bdb91da08c75|aki-standing-hp|立ち強P|normal|gated|
|aki|9113703b-57f3-4f23-a0c3-a4670040cfb1|aki-standing-hk|立ち強K|normal|gated|
|aki|a7fbfb43-6e9c-4f8b-b49c-87a360958503|aki-crouching-lp|しゃがみ弱P|normal|gated|
|aki|8c192d72-4284-4974-935d-1131a55781bf|aki-crouching-lk|しゃがみ弱K|normal|gated|
|aki|18128e14-c202-4c76-953e-59b5f893d6d9|aki-crouching-mp|しゃがみ中P|normal|gated|
|aki|aed1a694-0fc0-44f8-88fe-d01d619cbb23|aki-crouching-mk|しゃがみ中K|normal|gated|
|aki|4c11df06-07d8-4e8c-a965-5c3fa41496fb|aki-crouching-hp|しゃがみ強P|normal|gated|
|aki|296fe617-8abc-4df9-a23c-e00d6ea08faa|aki-crouching-hk|しゃがみ強K|normal|gated|
|aki|5f9ea511-7dec-40bf-ab39-31d6eb4190e9|aki-jump-lp|ジャンプ弱P|normal|gated|
|aki|c5b3f30f-6d75-4ff5-a73d-2310856de401|aki-jump-lk|ジャンプ弱K|normal|gated|
|aki|88a66202-ea61-4f19-a337-1e0952935b36|aki-jump-mp|ジャンプ中P|normal|gated|
|aki|389dc6e2-eb99-4077-b93f-379bdac1edce|aki-jump-mk|ジャンプ中K|normal|gated|
|aki|add403d6-41fe-4395-b9b9-8d9f24e20e96|aki-jump-hp|ジャンプ強P|normal|gated|
|aki|ea563fe3-90d2-4816-b9da-6310611ab084|aki-jump-hk|ジャンプ強K|normal|gated|
|aki|a87a45ad-a06b-4278-9e8a-93e412757dff|aki-pu-lao|蒲牢|normal|gated|
|aki|ab7f38c4-0c8e-447f-9818-6cee3f4971b5|aki-chi-wen|螭吻|normal|gated|
|aki|a2331c9b-1ccd-43bf-b2a4-f0a488b180a3|aki-qiu-niu|囚牛|unique|gated|
|aki|56666d6a-a902-483b-bbef-0a1a61e01c8b|aki-hun-dun|混沌|target_combo|gated|
|aki|75ae8e69-d41e-4994-ac4a-ed7cb5db84f1|aki-qiong-qi|窮奇|target_combo|gated|
|aki|f2fb51ac-71f1-468c-b738-0ec90afcdd55|aki-nightshade-pulse|紫煙砲|special|gated|
|aki|f7647e16-b9bb-43dc-a47f-5b8b6861214a|aki-nightshade-pulse-od|OD紫煙砲|special|gated|
|aki|157f84f0-05f4-472d-bd2a-516dd3b000e0|aki-nightshade-chaser|紫煙追|special|gated|
|aki|c30e99ec-73cb-43dd-bcde-995a51182697|aki-nightshade-chaser-burst|紫煙追（爆破）|special|gated|
|aki|faba51b0-9add-444e-82a4-d382e70a440d|aki-nightshade-chaser-od|OD紫煙追|special|gated|
|aki|5ad21670-2e9a-44e3-8e35-b3eb76173713|aki-orchid-spring|紫泡泉|special|gated|
|aki|255a6469-e7cb-4e02-b3e6-f34640a957e9|aki-orchid-wreath|紫泡撒|special|gated|
|aki|000f336c-1a94-407f-bb7f-d4f600cb6783|aki-serpent-lash-l|弱蛇連咬|special|gated|
|aki|0418fe70-8aa3-49df-9d73-2bbb8f63e147|aki-serpent-lash-m|中蛇連咬|special|gated|
|aki|c7dace22-90ba-468c-a009-eb773452822f|aki-serpent-lash-h|強蛇連咬|special|gated|
|aki|1082b832-6a17-4e5f-a536-f18ee089fa43|aki-serpent-lash-od|OD蛇連咬|special|gated|
|aki|add3bf91-944a-4c88-99af-7b033b12f602|aki-cruel-fate-l|弱凶襲突|special|gated|
|aki|6d02c3e6-590f-42be-8412-03933b1744ec|aki-cruel-fate-m|中凶襲突|special|gated|
|aki|c1299f62-10af-4c36-aecd-772a89522ce3|aki-cruel-fate-h|強凶襲突|special|gated|
|aki|d1a6b219-50a6-4123-85b1-c661c6314c3c|aki-cruel-fate-od|OD凶襲突|special|gated|
|aki|41c2cf57-937b-4984-8def-033f2cdc52b0|aki-snake-step-l|弱蛇軽功|special|gated|
|aki|fb83abe8-2b71-40cc-9b56-7ae12c48d490|aki-snake-step-m|中蛇軽功|special|gated|
|aki|3f8da7a4-682c-479e-a1b6-47c453e3e6a1|aki-snake-step-h|強蛇軽功|special|gated|
|aki|20ab4271-c79d-442a-934a-73035f8c98a0|aki-snake-step-od|OD蛇軽功|special|gated|
|aki|6378f5d0-4700-4cce-90c0-5e8c96352fe8|aki-sinister-slide|悪鬼蛇行|special|gated|
|aki|793ace8a-d4ac-411f-a0ec-f5618d54530d|aki-venomous-fang|猛毒牙|special|gated|
|aki|fa75b9de-4ce2-4987-a7b0-e098e162b129|aki-heel-strike|蛇尾脚|special|gated|
|aki|dcd74045-c552-4b2a-bc4b-227deeaf9742|aki-entrapment|雁字搦|special|gated|
|aki|0258b69f-8689-4303-a9d4-41e0f5101589|aki-sa1|死屍累々|super|gated|
|aki|88e5f03e-aae5-453f-9b00-79d2bdd334f0|aki-sa2|紫煙烈爪|super|gated|
|aki|eb5d5c47-4c89-4eaa-a361-26c79941f26f|aki-sa3|睚眦|super|gated|
|aki|fc3bf2b4-031b-4a7f-8149-ec91c34c26a5|aki-ca|睚眦（CA）|super|gated|
|aki|9862cfc2-b16b-48a6-9f2c-a4f698abff92|aki-forward-throw|前投げ|throw|gated|
|aki|61b21c00-8448-4264-ae8b-50bbcebb7c91|aki-back-throw|後ろ投げ|throw|gated|
|ed|1be7b0e7-2897-4af2-b35a-18aaaae5a5ba|ed-standing-lp|立ち弱P|normal|gated|
|ed|bbb06c03-9ebd-4467-9e51-7357b14b4177|ed-standing-lk|立ち弱K|normal|gated|
|ed|7089d3ef-f00b-45bd-b55e-2fb8032b96ea|ed-standing-mp|立ち中P|normal|gated|
|ed|ced3d8f1-f9a2-4391-9200-1e36f5a02b2d|ed-standing-mk|立ち中K|normal|gated|
|ed|f3a031ca-1ef2-453a-aed9-03182fb5e301|ed-standing-hp|立ち強P|normal|gated|
|ed|29565224-5de9-4d1f-819b-555c8dc50441|ed-standing-hk|立ち強K|normal|gated|
|ed|f029a29b-a1a4-4bd5-a46a-c67fb0c976dd|ed-crouching-lp|しゃがみ弱P|normal|gated|
|ed|0ee50858-3450-4277-bea4-dfa96a94e50d|ed-crouching-lk|しゃがみ弱K|normal|gated|
|ed|91ad05a5-294a-4c92-b9be-35b307565944|ed-crouching-mp|しゃがみ中P|normal|gated|
|ed|887468ff-91cd-4c80-b1ae-7fe5b011d790|ed-psycho-flicker-od|ODサイコフリッカー|special|gated|
|ed|871c15e8-b6e4-4636-b6b5-158803001e6f|ed-crouching-mk|しゃがみ中K|normal|gated|
|ed|79250547-4ce6-4a4a-a4d5-0f39e1cb38d3|ed-crouching-hp|しゃがみ強P|normal|gated|
|ed|63170ff9-b80c-4082-b774-66a10acb5498|ed-crouching-hk|しゃがみ強K|normal|gated|
|ed|8b1fbe0c-461e-459f-9e51-aad6833afd46|ed-jump-lp|ジャンプ弱P|normal|gated|
|ed|bb38c8c9-c5d3-41b3-a800-10a6e53344be|ed-jump-lk|ジャンプ弱K|normal|gated|
|ed|b009be13-ba4b-4075-916b-d5ca5cb0ed4b|ed-jump-mp|ジャンプ中P|normal|gated|
|ed|f4e388a0-7616-48b6-9b97-266ced50ebb0|ed-jump-mk|ジャンプ中K|normal|gated|
|ed|62bb74b1-ab83-414d-9e83-fb21f539399c|ed-jump-hp|ジャンプ強P|normal|gated|
|ed|fe1009d4-44e0-4702-950b-0d5ebf69862f|ed-jump-hk|ジャンプ強K|normal|gated|
|ed|bf258f77-218f-4cf9-ab54-9de59bb304c9|ed-psycho-knuckle-lv1|サイコナックル Lv1|unique|gated|
|ed|21d8647a-8a35-4e13-b21c-6d0af396bd99|ed-psycho-knuckle-lv2|サイコナックル Lv2|unique|gated|
|ed|43c8455c-3bd1-4843-a836-f03e013a49d7|ed-cobra-punch|コブラパンチ|unique|gated|
|ed|b3103a67-2ffb-44eb-bb46-d098e85e571a|ed-flicker-combination|フリッカーコンビネーション|target_combo|gated|
|ed|e3c8cc1d-3891-4812-910b-cc27ccfa9a9b|ed-body-blow-combination|ボディブローコンビネーション|target_combo|gated|
|ed|96b61c92-9208-422d-b230-b3f4f550c67e|ed-hitman-combination|ヒットマンコンビネーション|target_combo|gated|
|ed|8fa46e7c-be53-4d83-8500-44c9de7ca6da|ed-psycho-spark|サイコスパーク|special|gated|
|ed|ea3f3886-3a2b-4ee4-8c6d-7b8fb93e9076|ed-psycho-spark-od|ODサイコスパーク|special|gated|
|ed|58505a48-3761-43ea-bf98-cf91f4e02148|ed-psycho-shoot|サイコシュート|special|gated|
|ed|dd3ca890-ef8a-4067-868f-ae93b330543f|ed-psycho-shoot-od|ODサイコシュート|special|gated|
|ed|6440734c-a3fa-45e0-a5de-50c93ec470b6|ed-psycho-upper-l|弱サイコアッパー|special|gated|
|ed|31996c83-5434-4c79-908f-75f65886877b|ed-psycho-upper-m|中サイコアッパー|special|gated|
|ed|621c4239-32eb-4b00-a075-0f9c15389675|ed-psycho-upper-h|強サイコアッパー|special|gated|
|ed|029f8661-b765-4faf-bff2-230a9f27f685|ed-psycho-upper-od|ODサイコアッパー|special|gated|
|ed|bac9265b-c97a-4b9b-b081-b67eb119743c|ed-psycho-blitz-l|弱サイコブリッツ|special|gated|
|ed|c49df832-9544-4ef2-8f68-f6e5973a0e31|ed-psycho-blitz-m|中サイコブリッツ|special|gated|
|ed|e3cc2a7a-d7f2-4512-b1f2-ff3f660260ed|ed-psycho-blitz-h|強サイコブリッツ|special|gated|
|ed|0a896d13-4937-4300-af00-3dd1e2548c1a|ed-psycho-blitz-od|ODサイコブリッツ|special|gated|
|ed|e6e924d2-2dd3-4bc2-80ed-aec6f175383c|ed-psycho-flicker-l|弱サイコフリッカー|special|gated|
|ed|b7613ec3-5661-4e6a-bcf0-34ea5635b896|ed-psycho-flicker-m|中サイコフリッカー|special|gated|
|ed|93f83e6d-9f9c-43fc-aaaf-70f954d44dcc|ed-psycho-flicker-h|強サイコフリッカー|special|gated|
|ed|1f8944c8-bcab-4f26-816b-7face5ac90d4|ed-kill-rush|キルラッシュ|special|gated|
|ed|f25b82cb-2852-412c-b1e8-f51077fdd61d|ed-kill-switch-break|キルスイッチ・ブレイク|special|gated|
|ed|901f1949-bbe8-450e-965c-6ff1c40fa324|ed-kill-switch-chaser|キルスイッチ・チェイサー|special|gated|
|ed|f4be6bb0-6175-4415-9e9b-5e02718a2f92|ed-sa1|サイコストーム|super|gated|
|ed|010bd4fc-f9b5-45ab-af1b-37d5d2da891c|ed-sa2|サイコキャノン|super|gated|
|ed|9ff3530a-72d4-414f-86f3-a7291e0d349f|ed-sa3|サイコチェンバー|super|gated|
|ed|15eb88c6-97e9-4362-bd45-d2e02387e663|ed-ca|サイコチェンバー（CA）|super|gated|
|ed|bdc8a84c-243a-4d97-80fd-6d96fa2698a6|ed-forward-throw|前投げ|throw|gated|
|ed|4b143800-5803-4bcb-b2f7-0b3939146dc4|ed-back-throw|後ろ投げ|throw|gated|
|akuma|9776ad46-81f4-480b-8cbc-c6d2507dd041|akuma-standing-lp|立ち弱P|normal|gated|
|akuma|3b98f0d9-a549-445e-8009-548de2d18569|akuma-standing-lk|立ち弱K|normal|gated|
|akuma|946e201d-443f-42fc-ace6-485647936bb5|akuma-standing-mp|立ち中P|normal|gated|
|akuma|55f69a8a-11cc-4445-9363-b427b6f1b8f2|akuma-standing-mk|立ち中K|normal|gated|
|akuma|0935ef23-577e-4440-8a2b-041fa30c8151|akuma-standing-hp|立ち強P|normal|gated|
|akuma|ce9264f4-2b25-4cf1-b18c-5481c9fcf6b1|akuma-standing-hk|立ち強K|normal|gated|
|akuma|8ed97e52-13e7-4662-90f7-b38dc27121ed|akuma-crouching-lp|しゃがみ弱P|normal|gated|
|akuma|f5c84a83-2507-4ce0-8266-08bc0052cd8b|akuma-crouching-lk|しゃがみ弱K|normal|gated|
|akuma|fd0cf9f2-1d64-49d8-95cf-b706398eb295|akuma-crouching-mp|しゃがみ中P|normal|gated|
|akuma|362926bb-6d90-4147-a71a-22b8cfbde680|akuma-crouching-mk|しゃがみ中K|normal|gated|
|akuma|179062b4-5359-449b-8ddf-01c2a22fb153|akuma-crouching-hp|しゃがみ強P|normal|gated|
|akuma|191fbb0d-54dd-4ab1-ac02-a60aeadd7f40|akuma-crouching-hk|しゃがみ強K|normal|gated|
|akuma|042db52d-5484-4097-b2a9-df47b8d96889|akuma-jump-lp|ジャンプ弱P|normal|gated|
|akuma|256b4f38-7a75-437f-89b5-b187eb576f0e|akuma-jump-lk|ジャンプ弱K|normal|gated|
|akuma|921f1862-981a-42d2-9c9a-17a423221c78|akuma-jump-mp|ジャンプ中P|normal|gated|
|akuma|7c2add4a-6967-4f3f-b1c8-719a61a608e7|akuma-jump-mk|ジャンプ中K|normal|gated|
|akuma|e04c5b9a-2c16-4b39-86ce-28f30f24fb31|akuma-jump-hp|ジャンプ強P|normal|gated|
|akuma|b2b9c27e-2aec-47cb-b7e2-a918e0186932|akuma-jump-hk|ジャンプ強K|normal|gated|
|akuma|5851d6cc-4a86-4b8e-9460-778f26af2ef9|akuma-skull-splitter|頭蓋破殺|unique|gated|
|akuma|16bba1f1-0f0d-4c36-872b-5f5985756ce3|akuma-resso-snap-kick|裂槍脚|unique|gated|
|akuma|752f9cfb-4992-44d7-94fa-1d18bcb223db|akuma-rago-high-kick|羅豪脚|unique|gated|
|akuma|cd158bd7-7e4c-45da-9a44-2faa9e3633f8|akuma-forward-hp|6強P|unique|gated|
|akuma|86460772-32a6-449e-b696-cf308eb20c98|akuma-tenmaku|天魔空刃脚|unique|gated|
|akuma|5808d5ef-4abb-443e-86a6-31ea7ed83b91|akuma-gou-hadoken-l|弱豪波動拳|special|gated|
|akuma|11e260da-3978-4c5d-9e1c-963770000246|akuma-gou-hadoken-m|中豪波動拳|special|gated|
|akuma|80b7025d-c89b-44f5-9847-21a1e31b2769|akuma-gou-hadoken-h|強豪波動拳|special|gated|
|akuma|51f6e665-17b1-4caa-b3b8-abfd97d4d787|akuma-gou-hadoken-od|OD豪波動拳|special|gated|
|akuma|883800f7-16a1-4db7-8300-0891db54362e|akuma-gou-shoryu-l|弱豪昇龍拳|special|gated|
|akuma|a511faed-1ae1-40ec-bab5-30fc8c0d77ea|akuma-gou-shoryu-m|中豪昇龍拳|special|gated|
|akuma|238fd74b-2cfe-44f8-8514-889bb8fa3ad7|akuma-gou-shoryu-h|強豪昇龍拳|special|gated|
|akuma|a7be8cdd-0e58-4804-adc3-a3e7235df60f|akuma-gou-shoryu-od|OD豪昇龍拳|special|gated|
|akuma|9740a707-802d-4c17-a452-77d948aa4165|akuma-tatsu-l|弱竜巻斬空脚|special|gated|
|akuma|7acdbd27-e087-403b-9d13-43683f066c3e|akuma-tatsu-m|中竜巻斬空脚|special|gated|
|akuma|d715027d-4941-4fab-bb96-efd6482898e1|akuma-tatsu-h|強竜巻斬空脚|special|gated|
|akuma|18b61e05-3245-4101-9234-747a9431cd7c|akuma-tatsu-od|OD竜巻斬空脚|special|gated|
|akuma|a44c6608-1e01-40f7-b05b-5ea899b42c8d|akuma-air-tatsu|空中竜巻斬空脚|special|gated|
|akuma|2191ffb5-985d-4502-998f-0548be4f5786|akuma-demon-raid|百鬼襲|special|gated|
|akuma|8625fab0-c8f6-4549-af2d-2ca926d96309|akuma-demon-palm|百鬼豪衝|special|gated|
|akuma|66a16ebe-1a3a-4ac7-9ccc-5b967a39d221|akuma-demon-blade|百鬼豪刃|special|gated|
|akuma|b8f5bcf7-18a7-46e7-afa6-f5c055e7bbb7|akuma-sa1|滅殺豪波動|super|gated|
|akuma|69a0d966-a9fe-4479-8f73-7c78e5e4cc23|akuma-tenma-gozanku|天魔豪斬空|super|gated|
|akuma|323e23ac-7e74-4dd4-8a8f-181daa174221|akuma-sa2|崩天劫火|super|gated|
|akuma|05cf88f7-41f8-40f6-8f83-cdbb0ca95d31|akuma-sa3|禍坏|super|gated|
|akuma|99aaab11-8fa7-4af6-b4eb-daed3cdaf0eb|akuma-ca|禍坏（CA）|super|gated|
|akuma|0977d5cb-329c-4829-969a-da3bc7954cf5|akuma-raging-demon|瞬獄殺|super|gated|
|akuma|131d987f-722c-4e08-8852-d6b81302d1ab|akuma-forward-throw|前投げ|throw|gated|
|akuma|0d0bf082-34ab-4cc1-a26b-6a227d6f0f31|akuma-back-throw|後ろ投げ|throw|gated|
|akuma|1eb0895a-7a85-4f94-a2f8-f70509bf9b12|akuma-zanku-hadoken|斬空波動拳|special|gated|
|akuma|b70ea6e7-7429-4802-aacb-efcfdd7ba62f|akuma-zanku-hadoken-od|OD斬空波動拳|special|gated|
|akuma|ffe7b417-928a-4ec8-a618-94e092c01a02|akuma-air-tatsu-od|OD空中竜巻斬空脚|special|gated|
|akuma|cff38b55-0e9d-4eb0-9985-0c7a1d91129e|akuma-demon-raid-od|OD百鬼襲|special|gated|
|akuma|2ba11fb4-4e19-4d72-8b71-87778d097c9d|akuma-demon-swoop|百鬼潜影|special|gated|
|akuma|8722d216-dfc8-4f81-baf8-ec6c26a54abc|akuma-demon-low-slash|百鬼豪斬|special|gated|
|akuma|cdcb128c-113d-4657-aa2e-b6153969c2ab|akuma-demon-gou-zanku|百鬼豪斬空|special|gated|
|akuma|09fd5956-dda3-492b-a0e8-3ae06f2c35e6|akuma-demon-gou-rasen|百鬼豪螺旋|special|gated|
|akuma|7381e9e3-1f6a-4846-8658-f3526750da51|akuma-adamant-flame-l|弱金剛灼火|special|gated|
|akuma|789c5644-c97f-4f51-b406-eea0d3d13ad1|akuma-adamant-flame-m|中金剛灼火|special|gated|
|akuma|e7f0e25f-ffa0-4cd0-969b-89c30c12f912|akuma-adamant-flame-h|強金剛灼火|special|gated|
|akuma|fbc6b3d1-45a8-4f14-9ae4-6883e9a0e804|akuma-adamant-flame-od|OD金剛灼火|special|gated|
|akuma|642de152-1642-42e5-87bc-8df6e002d4d6|akuma-ashura-senku|阿修羅閃空|special|gated|
|akuma|bf19018c-f842-4627-8e5b-8535fceb836a|akuma-oboro-throw|朧|throw|gated|
|m-bison|6544558c-024a-4504-b36c-11887ecc52d5|m-bison-standing-lp|立ち弱P|normal|gated|
|m-bison|5108cffa-507a-490f-ade0-097d5fedb023|m-bison-standing-lk|立ち弱K|normal|gated|
|m-bison|823a6d63-aef7-46c7-ad54-c961630cb692|m-bison-standing-mp|立ち中P|normal|gated|
|m-bison|25689873-937f-4724-ad9d-2c8dd55fa794|m-bison-standing-mk|立ち中K|normal|gated|
|m-bison|ffa725b6-b958-41b6-9cb5-b9fcc5331d97|m-bison-standing-hp|立ち強P|normal|gated|
|m-bison|8bf5c0eb-0ada-4578-9a7a-95c21670c0ff|m-bison-standing-hk|立ち強K|normal|gated|
|m-bison|5cd98003-d486-40a6-8640-999a1b7714c8|m-bison-crouching-lp|しゃがみ弱P|normal|gated|
|m-bison|af71d7be-ed9c-4baf-816a-ced471305369|m-bison-crouching-lk|しゃがみ弱K|normal|gated|
|m-bison|ef1bccbb-f2aa-41f5-bbe9-7b2bd501a7f8|m-bison-head-press-od|ODヘッドプレス|special|gated|
|m-bison|55696c1b-8fa5-4ebb-9332-21292b6fc02a|m-bison-crouching-mp|しゃがみ中P|normal|gated|
|m-bison|3650688e-300c-4846-9b2f-2b9c59cc50b7|m-bison-skull-diver|サマーソルト・スカルダイバー|special|gated|
|m-bison|b96ff6c3-1824-49a1-b908-48dd9bb48810|m-bison-crouching-mk|しゃがみ中K|normal|gated|
|m-bison|51fc51dc-9d49-446c-9593-1f7b0504fb47|m-bison-crouching-hp|しゃがみ強P|normal|gated|
|m-bison|6f14be7e-c55f-4abb-a795-be18d766991c|m-bison-crouching-hk|しゃがみ強K|normal|gated|
|m-bison|ffc46504-0632-4b6e-ac49-5d799425d179|m-bison-jump-lp|ジャンプ弱P|normal|gated|
|m-bison|fd6994d7-9b39-442b-80fa-88eeaf147f93|m-bison-jump-lk|ジャンプ弱K|normal|gated|
|m-bison|849683cc-dc9a-46f6-b33a-16a15ec9aa13|m-bison-jump-mp|ジャンプ中P|normal|gated|
|m-bison|86f77e43-38bc-47e6-8781-2ec32010d60f|m-bison-jump-mk|ジャンプ中K|normal|gated|
|m-bison|68dc311a-e131-4e22-9a14-2536452298a2|m-bison-jump-hp|ジャンプ強P|normal|gated|
|m-bison|62338ed3-a07e-4767-a3c4-fa27579545a4|m-bison-jump-hk|ジャンプ強K|normal|gated|
|m-bison|06f6772d-c72a-4204-a21f-86a1c39c7785|m-bison-psycho-hammer|サイコハンマー|unique|gated|
|m-bison|3fd9568c-2f2c-4832-89db-8ee137f5e070|m-bison-evil-knee|イビルニー|unique|gated|
|m-bison|6febf370-0000-42e1-811a-bee83f2c248a|m-bison-hover-kick|ホバーキック|unique|gated|
|m-bison|cf27b61b-2a87-482a-ab89-6353b06bb5db|m-bison-shadow-hammer|シャドウハンマー|target_combo|gated|
|m-bison|fda154bc-d27a-4763-92e7-1f93c15f971e|m-bison-shadow-spear|シャドウスピア|target_combo|gated|
|m-bison|3e0db2d0-b2f3-40b7-8bcc-8912a315e398|m-bison-psycho-crusher-l|弱サイコクラッシャー|special|gated|
|m-bison|c2720255-9359-433f-8d10-86b888c31037|m-bison-psycho-crusher-m|中サイコクラッシャー|special|gated|
|m-bison|d25205a7-8dab-45e4-9f64-a829470f222d|m-bison-psycho-crusher-h|強サイコクラッシャー|special|gated|
|m-bison|cc7127a5-3dc3-45b4-ba53-ccf7a81a6572|m-bison-psycho-crusher-od|ODサイコクラッシャー|special|gated|
|m-bison|10052ee8-75dc-4201-9bb0-17c04cbf6025|m-bison-double-knee-l|弱ダブルニープレス|special|gated|
|m-bison|e0432fac-9d08-49ac-8314-6b094fec9eb2|m-bison-double-knee-m|中ダブルニープレス|special|gated|
|m-bison|fcb5f9cf-db38-4230-87dc-3b4312d0cc92|m-bison-double-knee-h|強ダブルニープレス|special|gated|
|m-bison|819951f6-3153-40da-97b8-4377c064ea68|m-bison-double-knee-od|ODダブルニープレス|special|gated|
|m-bison|0e0a450a-c755-499a-b295-bb2dd9fb861e|m-bison-backfist-l|弱バックフィストコンボ|special|gated|
|m-bison|c9bf8dcf-1dd8-4555-beea-299ead31b37e|m-bison-backfist-m|中バックフィストコンボ|special|gated|
|m-bison|f7d9014b-5cad-4add-a2cc-8b5e3f7f2ca8|m-bison-backfist-h|強バックフィストコンボ|special|gated|
|m-bison|b5f873c7-850c-47af-93b2-c235577fc43c|m-bison-backfist-od|ODバックフィストコンボ|special|gated|
|m-bison|e008aab9-83d9-4651-a751-baa6eb4ff5a0|m-bison-shadow-rise|シャドウライズ|special|gated|
|m-bison|0f5b1b32-dd83-4fcc-b38b-63b219a2585d|m-bison-head-press|ヘッドプレス|special|gated|
|m-bison|c2acaa79-eeef-4639-a37a-145fd9c1a134|m-bison-devil-reverse|デビルリバース|special|gated|
|m-bison|d5925df3-8858-4dea-ab51-a761da97624b|m-bison-devil-reverse-od|ODデビルリバース|special|gated|
|m-bison|c0b714e7-924a-4ec5-9bd3-e3d8eaa65484|m-bison-sa1|ニープレスナイトメア|super|gated|
|m-bison|b97162b5-eba5-4147-b4e9-6168e67fd7be|m-bison-sa2|サイコパニッシャー|super|gated|
|m-bison|cbcab1b6-75cc-4b86-932c-8a190812e623|m-bison-sa3|アンリミテッドサイコクラッシャー|super|gated|
|m-bison|4b65d125-b5dc-4a1b-916b-f2d3e0914350|m-bison-ca|アンリミテッドサイコクラッシャー（CA）|super|gated|
|m-bison|c7d2d956-6cb6-4b50-9958-37e3345b907c|m-bison-forward-throw|前投げ|throw|gated|
|m-bison|4a25d3d8-585e-4b52-bec2-ca7ee2888210|m-bison-back-throw|後ろ投げ|throw|gated|
|terry|3282e211-5c99-4d0b-a6bf-6e487c3b91b9|terry-standing-lp|立ち弱P|normal|gated|
|terry|119758cd-b526-4ba2-bdf1-9f6b9460c56f|terry-standing-lk|立ち弱K|normal|gated|
|terry|78294e57-b7fe-4023-903f-62b6cd4392bd|terry-standing-mp|立ち中P|normal|gated|
|terry|8a7d747b-5373-4ee7-965f-67fd4e08e01e|terry-standing-mk|立ち中K|normal|gated|
|terry|9b64f2ea-0cba-43d7-98fb-0dee13ffcda9|terry-standing-hp|立ち強P|normal|gated|
|terry|ad986d67-c68e-4671-b22e-69b3385b11ae|terry-standing-hk|立ち強K|normal|gated|
|terry|b974f59f-b625-4188-91de-5c573c1bcc2e|terry-crouching-lp|しゃがみ弱P|normal|gated|
|terry|cee5a655-806c-4b20-8266-e4cd467b3bce|terry-crouching-lk|しゃがみ弱K|normal|gated|
|terry|850d653e-51e4-406e-9a32-420ad09e7ef2|terry-quick-burn-l|弱クイックバーン|special|gated|
|terry|c49c61ff-d013-47be-83f1-d9eab3dd2df9|terry-crouching-mp|しゃがみ中P|normal|gated|
|terry|0459a697-071e-49f9-a203-120441648d22|terry-quick-burn-od|ODクイックバーン|special|gated|
|terry|14702465-d5f5-44cd-8848-338de1426ce1|terry-crouching-mk|しゃがみ中K|normal|gated|
|terry|ba6e696c-80f2-4f22-be2d-66042011f432|terry-crouching-hp|しゃがみ強P|normal|gated|
|terry|b6dd3ebf-80dc-40af-b69a-cbb8b8fb8935|terry-crouching-hk|しゃがみ強K|normal|gated|
|terry|fc8dba88-8de7-4656-b6ac-6198538940d6|terry-jump-lp|ジャンプ弱P|normal|gated|
|terry|59cfffe0-2b84-4020-ac71-61dd3746e7e4|terry-jump-lk|ジャンプ弱K|normal|gated|
|terry|08d6e0a3-298d-463a-b406-df8db280b17e|terry-jump-mp|ジャンプ中P|normal|gated|
|terry|9c1eebcf-2c81-44c8-86a2-d701afcc1284|terry-jump-mk|ジャンプ中K|normal|gated|
|terry|e43326d2-278e-461b-994d-14205ba9687c|terry-jump-hp|ジャンプ強P|normal|gated|
|terry|08f65128-4b48-4a17-b73f-fc039f7664dc|terry-jump-hk|ジャンプ強K|normal|gated|
|terry|34e678af-4277-4e6d-869a-483f73f93416|terry-hammer-punch|ハンマーパンチ|normal|gated|
|terry|f0b380fa-6ddd-488c-adf0-1db4b1d7b6d4|terry-power-drive|パワードライブ|normal|gated|
|terry|ed082d1e-0859-4473-ade6-a007105f7b7d|terry-power-shoot|パワーシュート|target_combo|gated|
|terry|8884e700-85de-4019-89d6-a3270b0a4026|terry-power-dunk-tc|パワーダンク|target_combo|gated|
|terry|a5f4ab80-ee51-478c-b755-b194b7e81cb6|terry-passing-sway|パッシングスウェー|target_combo|gated|
|terry|f0ae8fc6-fb7d-4eac-98d5-bd30542a90cd|terry-passing-sway-lariat|パッシングスウェー＞ジャンピングラリアット|target_combo|gated|
|terry|9f5a8d0c-9cb5-4b92-8e3b-1bcff4c29c8e|terry-passing-sway-knee|パッシングスウェー＞ジャンピングニー|target_combo|gated|
|terry|563d6042-ecce-48c0-9e28-90056a509e5b|terry-fire-kick|ファイヤーキック|target_combo|gated|
|terry|77115c40-9327-4d01-905c-ade6640b41b7|terry-power-wave-l|弱パワーウェイブ|special|gated|
|terry|5d6ce0dd-31e3-4f44-8ce4-45424fbbc86d|terry-power-wave-m|中パワーウェイブ|special|gated|
|terry|9ef9c617-af65-417a-8637-b239ebadb818|terry-round-wave-h|強ラウンドウェイブ|special|gated|
|terry|62651720-45a7-4d2b-ac4d-8a723ff1b3ce|terry-round-wave-od|ODラウンドウェイブ|special|gated|
|terry|7299be56-d518-4794-a111-2e0608615b76|terry-burn-knuckle-m|中バーンナックル|special|gated|
|terry|09cdfa8f-b62d-41f8-b2ac-ef7488c9bd1c|terry-burn-knuckle-h|強バーンナックル|special|gated|
|terry|ee5354a6-15f6-48ad-ae18-4b7da6c9423c|terry-burn-knuckle-od|ODバーンナックル|special|gated|
|terry|4fb976b2-3ab2-4586-a3b7-610f9ce3faa6|terry-crack-shoot-l|弱クラックシュート|special|gated|
|terry|d44ccb19-614d-4ee6-9f50-263b93271d28|terry-crack-shoot-m|中クラックシュート|special|gated|
|terry|d5d208ff-bfae-440f-9d47-c2236543ebb4|terry-crack-shoot-h|強クラックシュート|special|gated|
|terry|ab1d9137-f56e-4055-9113-6980c39d7386|terry-crack-shoot-od|ODクラックシュート|special|gated|
|terry|8f186d65-1026-4806-b232-8bb1914471f1|terry-rising-tackle-l|弱ライジングタックル|special|gated|
|terry|e19b086b-c4ca-4162-acdc-4572fa4fa173|terry-rising-tackle-m|中ライジングタックル|special|gated|
|terry|a278ec2e-546e-467a-9c88-cdd85ef6aadb|terry-rising-tackle-h|強ライジングタックル|special|gated|
|terry|8a73a65b-99dd-447b-99cd-c85d3741d711|terry-rising-tackle-od|ODライジングタックル|special|gated|
|terry|11e5667b-aece-434e-87af-8725413ce7f4|terry-power-charge-l|弱パワーチャージ|special|gated|
|terry|beca6874-e2c1-4761-89d8-31d00e871ada|terry-power-charge-m|中パワーチャージ|special|gated|
|terry|4bb58091-85b9-4dc4-8a1c-eca25085c1b7|terry-power-charge-h|強パワーチャージ|special|gated|
|terry|c65414e9-b51d-4dc2-a5a8-64ca1bcb201a|terry-power-charge-od|ODパワーチャージ|special|gated|
|terry|427a1f73-626c-4394-8eee-01b252a8c005|terry-sa1|バスターウルフ|super|gated|
|terry|97ba8ecf-cac1-4dbe-8ac2-92118bbc7f34|terry-sa2|パワーゲイザー|super|gated|
|terry|f5e14a1b-ade5-48b1-8bd8-37cad87bb8d0|terry-sa3|ライジングファング|super|gated|
|terry|43b7c674-ae0d-48cd-8cdc-61098b7ce4ca|terry-ca|ライジングファング（CA）|super|gated|
|terry|83045762-537a-4ac0-91f4-ff7e6a5094a0|terry-forward-throw|前投げ|throw|gated|
|terry|c5b400be-6611-41cb-8fd8-ba4ba5c69960|terry-back-throw|後ろ投げ|throw|gated|
|mai|90941f06-5027-454c-81bb-d0e63d862d60|mai-shiranui-ryuu-enbu-ada-zakura-214214p|SA3 不知火流・炎舞仇桜|super|gated|
|mai|22f4f8af-d7a2-49a4-af3e-3e4815003d3a|mai-shiranui-ryuu-enbu-ada-zakura-ca-214214p|CA 不知火流・炎舞仇桜|super|gated|
|mai|a1433e3c-2463-434f-bc73-b7bb37cbfe15|mai-ryuuenbu-214hp|強 龍炎舞|special|gated|
|mai|5bfa1b80-d214-4066-9328-87354142ce08|mai-ryuuenbu-flame-214hp|[強化版]強 龍炎舞|special|gated|
|mai|ea9af208-f4f2-4637-b78d-aa52ca53c3ec|mai-ryuuenbu-214lp|弱 龍炎舞|special|gated|
|mai|fd6a2d51-686d-4271-8054-f5013996f7a9|mai-ryuuenbu-flame-214lp|[強化版]弱 龍炎舞|special|gated|
|mai|4eb2fb8b-4bc7-438e-acea-e040152b4910|mai-ryuuenbu-214mp|中 龍炎舞|special|gated|
|mai|effe2cef-e943-4b22-8826-a175b7b47250|mai-ryuuenbu-flame-214mp|[強化版]中 龍炎舞|special|gated|
|mai|870ce756-5677-4db4-84f4-70353b9f015b|mai-ryuuenbu-214pp|OD 龍炎舞|special|gated|
|mai|d4e58ad5-da60-4a4d-baea-006dd40b49ea|mai-ryuuenbu-flame-214pp|[強化版]OD 龍炎舞|special|gated|
|mai|0d8b787f-05d6-4b99-b5ac-f58cc071fae6|mai-chou-hissatsu-shinobi-bachi-236236k|SA2 超必殺忍蜂|super|gated|
|mai|10e9e8aa-439d-4afd-b229-bcaa72caee66|mai-chou-hissatsu-shinobi-bachi-flame-236236k|[強化版]SA2 超必殺忍蜂|super|gated|
|mai|1e085854-0f9f-4a2e-8ebb-5d801af83fee|mai-kagerou-no-mai-236236p|SA1 陽炎の舞|super|gated|
|mai|42fdc185-4aa1-4234-ba81-3169dce48cbc|mai-kagerou-no-mai-flame-236236p|[強化版]SA1 陽炎の舞|super|gated|
|mai|4e935bdf-a3ba-4cbd-b375-2cd3f3754222|mai-hissatsu-shinobi-bachi-236hk|強 必殺忍蜂|special|gated|
|mai|4c5114d4-b091-4953-a66b-3492c3c7aba7|mai-hissatsu-shinobi-bachi-flame-236hk|[強化版]強 必殺忍蜂|special|gated|
|mai|10dcc221-233d-42bc-99aa-8706d7e1283a|mai-kachousen-236hp|強 花蝶扇|special|gated|
|mai|a89daa00-59bb-4e97-bdee-8777baae8923|mai-kachousen-flame-236hp|[強化版]強 花蝶扇|special|gated|
|mai|e9f91496-79de-420d-b144-8f81e54c8079|mai-hissatsu-shinobi-bachi-236kk|OD 必殺忍蜂|special|gated|
|mai|ff2aeb51-9c84-4409-ada8-09083329826c|mai-hissatsu-shinobi-bachi-flame-236kk|[強化版]OD 必殺忍蜂|special|gated|
|mai|4368337b-faaa-4a61-bf5e-de753a1672ad|mai-hissatsu-shinobi-bachi-236lk|弱 必殺忍蜂|special|gated|
|mai|2ee03507-15cc-49ad-9391-d7dcd050eea1|mai-hissatsu-shinobi-bachi-flame-236lk|[強化版]弱 必殺忍蜂|special|gated|
|mai|59f4a69e-972b-4a2e-a525-4685c62f4312|mai-kachousen-236lp|弱 花蝶扇|special|gated|
|mai|30ffa854-0001-41d1-bfb1-809d7483b9a0|mai-kachousen-flame-236lp|[強化版]弱 花蝶扇|special|gated|
|mai|579f6039-66a5-4b78-858a-fc9f53534ee7|mai-hissatsu-shinobi-bachi-236mk|中 必殺忍蜂|special|gated|
|mai|ca182cfe-9100-43cd-90b3-b6aff2e27a4a|mai-hissatsu-shinobi-bachi-flame-236mk|[強化版]中 必殺忍蜂|special|gated|
|mai|47d6dfe7-4242-4d43-a961-b7695a030e48|mai-kachousen-236mp|中 花蝶扇|special|gated|
|mai|f9c3b0fa-760c-4e7f-ba79-5f83ba5aca06|mai-kachousen-flame-236mp|[強化版]中 花蝶扇|special|gated|
|mai|452adbd1-a514-4306-8924-ded4748130d2|mai-kachousen-236pp|OD 花蝶扇|special|gated|
|mai|21dc9ace-04ee-4766-8b5b-a8cac9db4915|mai-kachousen-flame-236pp|[強化版]OD 花蝶扇|special|gated|
|mai|03601c2d-0d4b-4c7d-be09-46c8bccd5448|mai-kachousen-flame-hold-236-pp|[強化版]OD 花蝶扇（ホールド）|special|gated|
|mai|98a28cf7-2575-41e3-88e5-ef939df6f3b5|mai-kachousen-hold-236-pp|OD 花蝶扇（ホールド）|special|gated|
|mai|65d63ab3-e0c2-4e73-a26d-289f89c4f1bd|mai-midare-kachousen-236-pp-6p|乱れ花蝶扇|special|gated|
|mai|25170cee-b17f-4b2e-9018-b06e4b40f3d1|mai-midare-kachousen-flame-236-pp-6p|[強化版]乱れ花蝶扇|special|gated|
|mai|0bed7ebe-1004-4a61-8eca-fa1cd10b92d2|mai-kachousen-flame-hold-236-lp|[強化版]弱 花蝶扇（ホールド）|special|gated|
|mai|7da2699f-52ed-4475-a1f6-2347a7f0a1d7|mai-kachousen-hold-236-lp|弱 花蝶扇（ホールド）|special|gated|
|mai|62c81d2f-2c47-4a87-bc5a-2fdbd0bb3627|mai-sori-geri-2hk|反り蹴り|normal|gated|
|mai|55531a5d-ba9c-44c2-af06-cb2363570932|mai-crouching-heavy-punch-2hp|しゃがみ強P（回転扇打）|normal|gated|
|mai|2a58235d-299a-4618-8ea4-c230f3302cac|mai-crouching-light-kick-2lk|しゃがみ弱K（摺り蹴り）|normal|gated|
|mai|799cbf62-e5b0-48d3-8546-1358987c7359|mai-crouching-light-punch-2lp|しゃがみ弱P（龍尾髪）|normal|gated|
|mai|95730c67-addc-4642-a20a-5945ef11ed44|mai-crouching-medium-kick-2mk|しゃがみ中K（捌き蹴り）|normal|gated|
|mai|0e0a9837-cbe4-4f29-aa63-f6b88a786bcf|mai-crouching-medium-punch-2mp|しゃがみ中P（背面ひじ打ち）|normal|gated|
|mai|c59b75c7-e1f2-46be-b8df-11e3299cfafa|mai-hoshi-kujaku-1-4hk|星孔雀（1段目）|normal|gated|
|mai|af3b83e5-f64d-4521-95e7-1b74b0bd65b6|mai-hoshi-kujaku-2-4hk-hk|星孔雀（2段目）|normal|gated|
|mai|64233f0e-dc53-488f-a1e9-1f622523d2db|mai-fuusha-kuzushi-4lplk|風車崩し|throw|gated|
|mai|c87f5c0a-5c24-4461-9113-6b416fababfa|mai-standing-heavy-kick-5hk|立ち強K（背面蹴り）|normal|gated|
|mai|6c114c87-785f-4b90-a830-1431f9aed5a5|mai-standing-heavy-punch-5hp|立ち強P（大扇打）|normal|gated|
|mai|c36cb84d-b266-455d-96a9-836c93ac05ef|mai-standing-light-kick-5lk|立ち弱K（飛燕脚）|normal|gated|
|mai|ff4be576-a5ac-4d8a-a03d-f2d59cc85529|mai-hien-ren-kyaku-1-5lk-lk|飛燕連脚（2段目）|normal|gated|
|mai|f3fc4f71-7de2-4f23-9a7c-5b98c41124b7|mai-hien-ren-kyaku-2-5lk-lk-lk|飛燕連脚（3段目）|normal|gated|
|mai|c4813437-7ccf-4598-8723-6970a608688e|mai-standing-light-punch-5lp|立ち弱P（扇打）|normal|gated|
|mai|c8456bde-c38f-45c7-9ec4-72f56146010e|mai-standing-medium-kick-5mk|立ち中K（舞蹴撃）|normal|gated|
|mai|d6aef7a2-f24b-41f9-b594-e94a8d2e147f|mai-standing-medium-punch-5mp|立ち中P|normal|gated|
|mai|1060f3f7-058e-4be2-8714-3f0e1795e554|mai-hishou-ryuuenjin-623hk|強 飛翔龍炎陣|special|gated|
|mai|70f76978-8e89-4042-8cab-c9e24d1d8243|mai-hishou-ryuuenjin-flame-623hk|[強化版]強 飛翔龍炎陣|special|gated|
|mai|099baed1-255e-4fec-b9d0-75f87e24e641|mai-hishou-ryuuenjin-623kk|OD 飛翔龍炎陣|special|gated|
|mai|f960e717-25c7-44da-ac0b-2f7aa866f88c|mai-hishou-ryuuenjin-flame-623kk|[強化版]OD 飛翔龍炎陣|special|gated|
|mai|c64c6dad-c13f-4ba7-bd9f-9cab33f6b85f|mai-hishou-ryuuenjin-623lk|弱 飛翔龍炎陣|special|gated|
|mai|254fd65b-d6d6-486d-922e-17c2dbe1d887|mai-hishou-ryuuenjin-flame-623lk|[強化版]弱 飛翔龍炎陣|special|gated|
|mai|65f00a1a-fea9-4c04-bad2-85c0fc7c3563|mai-hishou-ryuuenjin-623mk|中 飛翔龍炎陣|special|gated|
|mai|dc665b65-f046-48c7-bc4f-fe9bb7a380bf|mai-hishou-ryuuenjin-flame-623mk|[強化版]中 飛翔龍炎陣|special|gated|
|mai|00b0a428-c1e2-4765-a7f8-36445be32cfa|mai-senkotsu-uchi-6mp|扇骨打ち|normal|gated|
|mai|b2593844-99eb-4711-8f16-641062458c51|mai-musasabi-no-mai-j-214p|ムササビの舞|special|gated|
|mai|ed62ecda-34f3-43c3-b2fc-4b9bf8a08065|mai-musasabi-no-mai-j-214pp|OD ムササビの舞|special|gated|
|mai|18670ca7-c6c3-414e-8449-776b5585b10c|mai-musasabi-no-mai-flame-j-214pp|[強化版]OD ムササビの舞|special|gated|
|mai|beb82132-a72c-4d8b-8b22-bd88143767b4|mai-musasabi-no-mai-flame-j-214p|[強化版]ムササビの舞|special|gated|
|mai|d6c70d59-2a08-45ff-8677-578b09b520c1|mai-air-chou-hissatsu-shinobi-bachi-j-236236k|SA2 空中超必殺忍蜂|super|gated|
|mai|d8c75cd4-688b-4524-8f84-a233f459c643|mai-air-chou-hissatsu-shinobi-bachi-flame-j-236236k|[強化版]SA2 空中超必殺忍蜂|super|gated|
|mai|0a6ba915-5360-40b0-b37e-31e2df09e568|mai-jumping-heavy-kick-j-hk|ジャンプ強K（隼蹴撃）|normal|gated|
|mai|1e35ff30-76f3-44a3-a5a7-ec74ca790f70|mai-jumping-heavy-punch-j-hp|ジャンプ強P（刃扇天翔刺し）|normal|gated|
|mai|71f95882-1eb5-4a41-9023-8565dd9189a5|mai-jumping-light-kick-j-lk|ジャンプ弱K（翔脚）|normal|gated|
|mai|722ea2f7-7922-4a01-a41d-9aa990abae2a|mai-jumping-light-punch-j-lp|ジャンプ弱P（翔扇打）|normal|gated|
|mai|e589aae2-b6ef-4ab6-8523-2a9e6af24e5f|mai-yume-zakura-j-lplk|夢桜|throw|gated|
|mai|0da28746-384f-4894-a50c-5f8c4de07aa2|mai-jumping-medium-kick-j-mk|ジャンプ中K（前蹴り）|normal|gated|
|mai|2c04ce27-7982-40e1-9149-c8067306bfcc|mai-jumping-medium-punch-j-mp|ジャンプ中P（天仰扇）|normal|gated|
|mai|7313c119-d754-4136-8774-06ce55ec9560|mai-shiranui-gourin-lplk|不知火剛臨|throw|gated|
|mai|22b9fd52-c51b-4604-8fa0-117b720bc0c4|mai-kachousen-hold-236-mp|中 花蝶扇（ホールド）|special|gated|
|mai|56c99e61-d814-42ea-af96-c30f04aedd2c|mai-kachousen-flame-hold-236-mp|[強化版]中 花蝶扇（ホールド）|special|gated|
|mai|70c44168-ecb6-4954-a2c2-8e235bfff5cd|mai-kachousen-hold-236-hp|強 花蝶扇（ホールド）|special|gated|
|mai|c6489cd0-e842-452d-abf0-4bc27a85622f|mai-kachousen-flame-hold-236-hp|[強化版]強 花蝶扇（ホールド）|special|gated|
|mai|5f981ef0-e793-41f6-a8eb-c3f4d6e25fe6|mai-forward-step-66|前方ステップ|unique|gated|
|mai|c3c98b8c-819e-47bf-9fea-fa79032f230e|mai-back-step-44|後方ステップ|unique|gated|
|elena|65b2045a-a03f-46db-ab0a-65f433377da5|elena-song-of-the-grasslands-214214k|SA3 グラスランドソング|super|gated|
|elena|2eb66583-f555-4123-b233-cc9a864246ac|elena-song-of-the-grasslands-ca-214214k|CA グラスランドソング|super|gated|
|elena|fbe394c7-3820-491f-a365-50769eca14ac|elena-spinning-scythe-214hk|強スピンサイズ|special|gated|
|elena|eb39b4bf-47fd-4405-b2d0-66045e8c61b1|elena-moon-glider-214hp|ムーングライド|special|gated|
|elena|a04fe8b5-007c-4731-a5bb-0a8e2161d9ce|elena-spinning-scythe-214kk|OD スピンサイズ|special|gated|
|elena|5d2ffa11-e0fd-4c81-ba40-06e24e8d3d2e|elena-spinning-scythe-214lk|弱 スピンサイズ|special|gated|
|elena|ad10bccc-42ea-41b3-9745-d6c1f5e2f8d1|elena-moon-glider-214lp|弱 ムーングライド（1段目）|special|gated|
|elena|68fb4360-a536-4ada-9759-a4b78bbce0ae|elena-spinning-scythe-214mk|中 スピンサイズ|special|gated|
|elena|1ccbe0bd-8d08-418d-b498-72cc842fc211|elena-moon-glider-214mp|ムーングライド|special|gated|
|elena|341bde0b-7471-4c28-85ee-b7ebb09ff371|elena-moon-glider-214pp|OD ムーングライド（1段目）|special|gated|
|elena|9916c7aa-9882-4e13-9c62-b839c1346ff7|elena-moon-glider-follow-up-214pp-6p|OD ムーングライド（2段目）|special|gated|
|elena|375ab2d8-4862-424a-a736-fcc6df15205b|elena-moon-glider-follow-up-214p-6p|ムーングライド（2段目）|special|gated|
|elena|f7fa0d87-9ffe-44cf-b263-c3e01893c205|elena-meteor-volley-236236k|SA1 ミーティアボレー|super|gated|
|elena|2f989ac3-a346-4ec7-ad57-7f4190741f79|elena-revival-dance-236236p|SA2リヴァイブダンス|super|gated|
|elena|c17fd4da-fcaa-42c9-ba3e-89ac1ad128f4|elena-revival-dance-healing-236236p-2|リヴァイブダンス（回復）|super|gated|
|elena|8ddf7123-8e88-475f-a0a0-56853b050f04|elena-rhino-horn-236hk|強 ライノホーン|special|gated|
|elena|e7008dc1-c61b-440e-bd0a-c25dd2416988|elena-lynx-song-236hp|強 リンクシング|special|gated|
|elena|261aebad-45a9-4fe5-88dd-8a419c988b43|elena-rhino-horn-236kk|OD ライノホーン|special|gated|
|elena|4c80247d-5c92-4c0f-828d-b71be622f735|elena-rhino-horn-236lk|弱 ライノホーン|special|gated|
|elena|61398b6e-3e45-4ac8-8350-545f06d3ac47|elena-lynx-song-236lp|弱 リンクシング|special|gated|
|elena|ac7bab5a-33b7-41e1-bb63-d7930a9ae0e4|elena-rhino-horn-236mk|中 ライノホーン|special|gated|
|elena|a2203168-0b8c-44b9-9493-1b75e1f275d6|elena-lynx-song-236mp|中 リンクシング|special|gated|
|elena|f5490cd6-dd8a-4050-9e98-82320951a393|elena-lynx-song-236pp|ODリンクシング|special|gated|
|elena|a38cfb8b-3a44-4172-b9b1-5b502d2e53f7|elena-mallet-smash-236pp-6hk-or-236p-6p-6hk|[強化版]マレットスマッシュ|special|gated|
|elena|e277e18c-cd7f-46eb-86a4-bf5af6e48623|elena-leopard-snap-236pp-6lk-or-236p-6p-6lk|[強化版]レオパードスナップ|special|gated|
|elena|41aea858-3bf1-42ba-aea2-1c7a76f2379b|elena-harvest-circle-236pp-6mk-or-236p-6p-6mk|[強化版]ハーベストサークル|special|gated|
|elena|ddc55cad-6882-4625-8927-805c4551509b|elena-lynx-whirl-236pp-6p|OD リンクスワール|special|gated|
|elena|dd5b1500-b646-4716-9c1b-c5cc0fb191f3|elena-mallet-smash-236p-6hk|マレットスマッシュ|special|gated|
|elena|02a62e54-a6ea-4222-b6b0-bc5fe71e6652|elena-lynx-whirl-236p-6hp|強 リンクスワール|special|gated|
|elena|c3f1573f-eedb-4925-bc2d-a91d3a587670|elena-leopard-snap-236p-6lk|レオパードスナップ|special|gated|
|elena|8460e337-f30b-4c31-9057-cf9afaf56eb9|elena-lynx-whirl-236p-6lp|弱 リンクスワール|special|gated|
|elena|dcc6d646-7c0e-4668-a6b2-50111a9c01c3|elena-harvest-circle-236p-6mk|ハーベストサークル|special|gated|
|elena|26fd9989-85d3-482b-bcf2-44f173193997|elena-lynx-whirl-236p-6mp|中 リンクスワール|special|gated|
|elena|a872dc1e-f5ce-4a68-a083-9b1674b983bf|elena-root-breaker-2hk|ルートブレイク|normal|gated|
|elena|c9401f16-e65c-4d8f-a193-bdd40eca23f2|elena-crouching-heavy-punch-2hp|しゃがみ強P（アカシアブランチ）|normal|gated|
|elena|7833a723-0962-4962-a1bc-e77ee624c1c5|elena-crouching-light-kick-2lk|しゃがみ弱K（リトルラップ）|normal|gated|
|elena|97ee42d4-321f-456c-87df-e5b488b880ef|elena-crouching-light-punch-2lp|しゃがみ弱P（クラウチングフロント）|normal|gated|
|elena|fa6d9e96-c1e6-47ab-902f-efb78ae9cf84|elena-crouching-medium-kick-2mk|しゃがみ中K（サーフェスキック）|normal|gated|
|elena|9fbf348a-5c2b-40b6-85a6-f485478ac2ca|elena-fluttering-lark-2mk-hk|ラークフラッター（2段目）|normal|gated|
|elena|a741a091-7c7d-418a-8d1a-9b3e9a5e17ff|elena-crouching-medium-punch-2mp|しゃがみ中P（リングカッター）|normal|gated|
|elena|e2b6b864-e958-4810-b193-f0ef6b04fe0f|elena-slide-3hk|スライディング|normal|gated|
|elena|98c709d8-f4a7-4264-8d03-8cef4758cfb0|elena-round-arch-4hk|ラウンドアーチ|normal|gated|
|elena|029c9fbe-9ec0-4142-83cc-7aa456943c38|elena-leg-lift-throw-4lplk|レッグリフトスルー|throw|gated|
|elena|b90072af-d85b-4cbe-a240-036ab7742891|elena-standing-heavy-kick-5hk|立ち強K|normal|gated|
|elena|d8290194-9d3d-4499-be63-9c4a0be06763|elena-standing-heavy-punch-5hp|立ち強P（ラウンドホップ）|normal|gated|
|elena|c6aa3b3e-09fe-49fa-b430-7998a00df1b3|elena-turning-tail-5hp-hp|ターニングテイル（2段目）|normal|gated|
|elena|5f521773-71c7-4a90-a67e-33af09381e69|elena-standing-light-kick-5lk|立ち弱K（スタンドロー）|normal|gated|
|elena|abc19582-3e56-44db-9415-a9e7e0251a27|elena-standing-light-punch-5lp|立ち弱P|normal|gated|
|elena|223ad40c-6c36-41fc-9e6f-d5ca2d496e60|elena-standing-medium-kick-5mk|立ち中K（スプルースベンド）|normal|gated|
|elena|bc49a04f-1a72-40e1-a846-b7b5a83f277c|elena-hind-kick-5mk-hk|ハインドキック（2段目）|normal|gated|
|elena|886714a1-4920-4be1-b103-ab3847911ca5|elena-standing-medium-punch-5mp|立ち中P（ブレイズパーチ）|normal|gated|
|elena|0ec23819-7110-4a97-b064-6938125d7f84|elena-starling-beak-5mp-mp|スターリングビーク（2段目）|normal|gated|
|elena|02c0e90b-cde9-46fb-81f2-5994ee3c5a73|elena-scratch-wheel-623hk|強 スクラッチホイール|special|gated|
|elena|6e0b8aa1-fccd-44e4-aac5-b2313b959f94|elena-scratch-wheel-623kk|OD スクラッチホイール|special|gated|
|elena|f3753764-5baa-4c63-a10a-7b6fe9424f4a|elena-scratch-wheel-623lk|弱 スクラッチホイール|special|gated|
|elena|ccb40731-8cfa-46de-86a7-e06afc3b6b54|elena-scratch-wheel-623mk|中 スクラッチホイール|special|gated|
|elena|df4cbbca-0424-4e64-906c-d8bbd066af31|elena-trunk-slap-1-6hp|トランクスラップ（1段目）|normal|gated|
|elena|1f35c804-2eab-482e-8159-faaa612a2a67|elena-trunk-slap-2-6hp-hp|トランクスラップ（2段目）|normal|gated|
|elena|4c808394-2c01-4481-9d5f-3fd5cd855f81|elena-trunk-slap-3-6hp-hp-hp|トランクスラップ（3段目）|normal|gated|
|elena|8967a443-c5e5-4dc7-8544-eac7eaefc263|elena-handstand-whip-1-6mk|ハンドスタンドウィップ（1段目）|normal|gated|
|elena|048f1407-8a52-4261-b515-4d19187e9e7b|elena-handstand-whip-2-6mk-mk|ハンドスタンドウィップ（2段目）|normal|gated|
|elena|3e2fd952-26b8-4942-85fb-651512e650ba|elena-jumping-heavy-kick-j-hk|ジャンプ強K（オーバーヘッドキック）|normal|gated|
|elena|6800af4c-4cb0-4746-9d38-d5018258239b|elena-jumping-heavy-punch-j-hp|ジャンプ強P（ハイソバット）|normal|gated|
|elena|03636a7c-3511-43a3-ac8f-f44441b3f97d|elena-jumping-light-kick-j-lk|ジャンプ弱K（ジャンプキック）|normal|gated|
|elena|b8d2ab8e-c245-4fbd-8518-9d332befb15f|elena-jumping-light-punch-j-lp|ジャンプ弱P（ニーアタック）|normal|gated|
|elena|047cd83f-8110-424d-9069-8e1886b46aef|elena-soaring-raid-j-lp-j-mk|ソアーレイド|normal|gated|
|elena|d26c2adf-536b-4e81-9e75-7e49fefefa7d|elena-jumping-medium-kick-j-mk|ジャンプ中K（ロージャベリン）|normal|gated|
|elena|34ad9991-74c8-4819-a88d-0c1204cd4573|elena-jumping-medium-punch-j-mp|ジャンプ中P（クレストフラップ）|normal|gated|
|elena|3814450b-c6eb-496e-afa0-50ad1e39d0ad|elena-raptor-range-j-mp-j-hp|ラプターレンジ|normal|gated|
|elena|402f9dee-ca5b-4ddb-8a69-c76f150caff5|elena-leg-tackle-lplk|レッグスタック|throw|gated|
|elena|16fe033a-0d3d-4270-8706-3b29a6d1d139|elena-forward-step-66|前方ステップ|unique|gated|
|elena|d9d7d368-3583-4535-9d64-ac6872e0758d|elena-back-step-44|後方ステップ|unique|gated|
|sagat|ee10d430-3404-4acc-868c-9733ceefb6b9|sagat-savage-tiger-214214k|サベージタイガー|super|gated|
|sagat|5d5b68a2-68ae-4083-85d7-a928c8e6b495|sagat-savage-tiger-stomp-br-oki-214214k-2|サベージタイガースタンプ|super|gated|
|sagat|93e64c1f-c1b2-409d-93e0-e6da471b0b8e|sagat-savage-tiger-pendulum-br-side-switch-214214k-4|サベージタイガーペンデュラム|super|gated|
|sagat|35e63821-7384-4b81-8ec6-18f728f88ac3|sagat-savage-tiger-raid-br-damage-214214k-5|サベージタイガーレイド|super|gated|
|sagat|85849d3a-12f9-4f1e-9177-920460342b0d|sagat-savage-tiger-zenith-br-launcher-214214k-6|サベージタイガーゼニス|super|gated|
|sagat|1ffae614-098c-465a-a2c7-7944d57800f6|sagat-tiger-nexus-214hk|タイガーネクサス|special|gated|
|sagat|7965380d-dbe7-4ff6-b747-87b7708c38a9|sagat-tiger-nexus-214kk|タイガーネクサス|special|gated|
|sagat|d72a2eba-6a3e-4e0f-8bcc-96c148357d13|sagat-nova-tiger-214kk-6hk|タイガーノヴァ|special|gated|
|sagat|e49aa0bc-fea3-4618-806a-4096f4fd3b56|sagat-mighty-tiger-214kk-6lk|タイガーマイト|special|gated|
|sagat|e2da3a09-5904-4ebf-8355-967b4c814fca|sagat-greedy-tiger-214kk-6mk|タイガーグリード|special|gated|
|sagat|89790402-97e4-4ffb-900c-357f2a8978b8|sagat-nova-tiger-214k-6hk|タイガーノヴァ|special|gated|
|sagat|2eb50331-ac42-40e4-ae0b-693f148ef844|sagat-mighty-tiger-214k-6lk|タイガーマイト|special|gated|
|sagat|1e826784-d57a-4c4a-9dbe-855978d54a99|sagat-greedy-tiger-214k-6mk|タイガーグリード|special|gated|
|sagat|733b2825-ba9f-42a6-b563-e8edb7b96815|sagat-tiger-nexus-214lk|タイガーネクサス|special|gated|
|sagat|a6059d53-b985-4dcd-85bd-d8430b33f8bf|sagat-tiger-nexus-214mk|タイガーネクサス|special|gated|
|sagat|1288b242-aeaa-475d-ba3d-07e53b4d1b2c|sagat-tiger-vanquisher-236236k|タイガーヴァンキッシュ|super|gated|
|sagat|f38a62a7-09db-4a94-9d2b-0b8422680d44|sagat-tiger-vanquisher-ca-236236k|タイガーヴァンキッシュ（CA）|super|gated|
|sagat|40875f29-b3fa-4f6e-9ad6-a8d69cd2c2cf|sagat-tiger-cannon-236236p|タイガーキャノン|super|gated|
|sagat|1c6a8286-4ea0-454b-8fa6-03902af6fd73|sagat-tiger-knee-crush-236hk|タイガーニークラッシュ|special|gated|
|sagat|8191ea60-a364-46b8-af7a-48e5c796a226|sagat-high-tiger-shot-236hp|タイガーショット|special|gated|
|sagat|5fab46b1-9288-406b-ad2d-a26aba0a8dd3|sagat-tiger-knee-crush-236kk|タイガーニークラッシュ|special|gated|
|sagat|76deda71-a355-4b5c-a0c5-fc41d1cd8d98|sagat-tiger-knee-crush-236lk|タイガーニークラッシュ|special|gated|
|sagat|bdc4b7b4-5fd3-4c2c-9e3e-cd7d200add22|sagat-low-tiger-shot-236lp|グランドタイガーショット|special|gated|
|sagat|b5b68ad9-2961-46b5-a1b1-748391d7e3ba|sagat-low-tiger-shot-236lpmp-or-236lphp|グランドタイガーショット|special|gated|
|sagat|86e06c95-6bbe-4ad4-842a-b22e46cdbc13|sagat-tiger-knee-crush-236mk|タイガーニークラッシュ|special|gated|
|sagat|1c662b91-d7e2-4642-8505-bbec0dad0176|sagat-high-tiger-shot-236mp|タイガーショット|special|gated|
|sagat|fdd1def1-6703-48c2-9c0f-d6bf382fdf4d|sagat-high-tiger-shot-236mphp|タイガーショット|special|gated|
|sagat|dae8c392-b9cc-4a2d-96fb-752e7d3e0e85|sagat-tiger-kick-2hk|タイガーキック|normal|gated|
|sagat|1122e5ca-33ab-48f3-839a-db11a92df23c|sagat-crouching-heavy-punch-2hp|しゃがみ強P|normal|gated|
|sagat|1fb18471-9519-48c4-a54a-47fece316b9d|sagat-crouching-light-kick-2lk|しゃがみ弱K|normal|gated|
|sagat|631788a5-6005-40b1-9173-eaa1668986c6|sagat-crouching-light-punch-2lp|しゃがみ弱P|normal|gated|
|sagat|a6da1642-2c37-4a21-96a8-d5df30bbeb35|sagat-crouching-medium-kick-2mk|しゃがみ中K|normal|gated|
|sagat|7670ef08-4cb0-4bea-adca-ef9bd51c2cba|sagat-crouching-medium-punch-2mp|しゃがみ中P|normal|gated|
|sagat|44025b46-7c90-4946-8732-a2bfcd4d91ca|sagat-tiger-rise-2mp-hk|タイガーライズ|normal|gated|
|sagat|41856c71-04c5-4358-a13c-95ec2d0f2ccf|sagat-tiger-slash-2mp-hp|タイガースラッシュ|normal|gated|
|sagat|6e81e836-5b6e-49b6-9e63-e7eb7895d622|sagat-tiger-monolith-4hp|タイガーモノリス|normal|gated|
|sagat|bda71928-a789-41ae-b774-b391699d1d53|sagat-tiger-carry-4lplk|タイガーキャリー|throw|gated|
|sagat|14be0a8f-f528-4c4f-84db-f4d5eb19e7f9|sagat-standing-heavy-kick-5hk|立ち強K|normal|gated|
|sagat|e4fe4542-2341-41c0-bf33-c12587764b40|sagat-standing-heavy-punch-5hp|立ち強P|normal|gated|
|sagat|fde534cd-5f83-44f5-8904-bc4621185740|sagat-tiger-sting-5hp-hk|タイガースティング|normal|gated|
|sagat|cb40fb77-ad4e-4c87-b356-559401001528|sagat-standing-light-kick-5lk|立ち弱K|normal|gated|
|sagat|757453f1-253e-4d42-bed1-1347b68af148|sagat-standing-light-punch-5lp|立ち弱P|normal|gated|
|sagat|4a6edef5-5184-45df-b332-4146fb16e9e2|sagat-standing-medium-kick-5mk|立ち中K|normal|gated|
|sagat|83a016d1-13cd-4b74-913a-7a38c7790d96|sagat-middle-step-kick-5mk-hk|ステップミドルキック|normal|gated|
|sagat|0d0c933c-45e4-4064-8ab8-533839b0bfc3|sagat-standing-medium-punch-5mp|立ち中P|normal|gated|
|sagat|3ce7e264-3236-45aa-ad20-5b574a4e60f3|sagat-tiger-uppercut-623hp|タイガーアッパーカット|special|gated|
|sagat|7485228b-fee0-4930-af0d-e4d69bc3947b|sagat-tiger-uppercut-hold-623-hp|強 タイガーアッパーカット（ホールド）|special|gated|
|sagat|cf6c7a7b-d2c0-443c-8419-47ea312ab61c|sagat-tiger-uppercut-623lp|タイガーアッパーカット|special|gated|
|sagat|31d8df84-a2fd-42a4-b706-5a2d0d0bf664|sagat-tiger-uppercut-623mp|タイガーアッパーカット|special|gated|
|sagat|d877e908-2212-4549-aefd-c6a437fd19c4|sagat-tiger-uppercut-623pp|タイガーアッパーカット|special|gated|
|sagat|80fb142f-e718-4351-8b6b-a6a6223d154e|sagat-high-step-kick-6hk|ステップハイキック|normal|gated|
|sagat|20bc0d65-d8c0-47fa-947f-9f1e0e0ad2e0|sagat-low-step-kick-6lk|ステップローキック|normal|gated|
|sagat|5c2e6303-f4a9-4a02-95d9-20028ad10f0f|sagat-tiger-heavy-elbow-6mp|タイガーヘビーエルボー|normal|gated|
|sagat|b4493b55-f441-4b45-af15-1c88cf599e88|sagat-jumping-heavy-kick-j-hk|ジャンプ強K|normal|gated|
|sagat|a96dc8ea-2f1b-4fae-917e-7f9566745116|sagat-jumping-heavy-punch-j-hp|ジャンプ強P|normal|gated|
|sagat|e652b451-8724-4ada-b51d-6abcd1f7f340|sagat-jumping-light-kick-j-lk|ジャンプ弱K|normal|gated|
|sagat|a7931a35-5e71-41c3-a02c-29b0e9cda8a9|sagat-jumping-light-punch-j-lp|ジャンプ弱P|normal|gated|
|sagat|e27fde8a-f1f6-4127-a3a2-3e95daa81d34|sagat-jumping-medium-kick-j-mk|ジャンプ中K|normal|gated|
|sagat|95d6f194-a3eb-43dc-96b4-54e0563d2173|sagat-jumping-medium-punch-j-mp|ジャンプ中P|normal|gated|
|sagat|aaf6d3df-7ecd-4a73-aa58-85aeed417565|sagat-tiger-hang-lplk|タイガーハング|throw|gated|
|c-viper|233040e0-3d41-4a5b-8417-02fad0150b27|c-viper-hard-luck-rejector-214214k|SA3 アンラックリジェクター|super|gated|
|c-viper|7c08292e-4913-4e2c-8f53-c77f66df12f1|c-viper-hard-luck-rejector-ca-214214k|CA アンラックリジェクター|super|gated|
|c-viper|9001ec69-8aa2-4dc6-96b2-e29bfb12a99d|c-viper-mission-complete-214214p|SA2 ミッションオーバー|super|gated|
|c-viper|e4ffd9f9-782f-4409-ad16-9f31e8b59f9c|c-viper-thunder-dash-214hp|強 サンダースラップ|special|gated|
|c-viper|6eb936a0-b8db-48cd-84f1-6536b140ad79|c-viper-tracer-combination-214hp-6pp|強 トレースコンビネーション|special|gated|
|c-viper|91de3adc-9dd9-4466-85fe-fb91dcceae2c|c-viper-focus-force-lv-1-214k|セービングフォース(Lv1)|special|gated|
|c-viper|693063de-3497-496e-96ab-61127a34a89d|c-viper-focus-force-lv-1-214kk|OD セービングフォース(Lv1)|special|gated|
|c-viper|570742cf-d489-4e82-8f84-bb9073942d67|c-viper-focus-force-lv-3-214-kk|OD セービングフォース(Lv3)|special|gated|
|c-viper|5c268a9a-b2b3-4bce-89e4-85086de94f0f|c-viper-focus-force-lv-2-214-kk|OD セービングフォース(Lv2)|special|gated|
|c-viper|26c08ccb-4685-43b3-96c0-358fc6c6544d|c-viper-focus-force-lv-3-214-k|セービングフォース(Lv3)|special|gated|
|c-viper|c882978d-8618-4caa-926c-c11941d8e6c0|c-viper-focus-force-lv-2-214-k|セービングフォース(Lv2)|special|gated|
|c-viper|c95a618c-3fa1-49a5-98b0-24205b0ad6d3|c-viper-thunder-dash-214lp|弱 サンダースラップ|special|gated|
|c-viper|d20065fb-fc6c-4778-ad4c-6b1fe7842e7d|c-viper-tracer-combination-214lp-6pp|弱 トレースコンビネーション|special|gated|
|c-viper|3b48c919-c0a6-4813-9f8b-b78c3c32473a|c-viper-thunder-dash-214mp|中 サンダースラップ|special|gated|
|c-viper|4d792bd5-fe17-4ab3-b069-45ef18432585|c-viper-tracer-combination-214mp-6pp|中 トレースコンビネーション|special|gated|
|c-viper|3263e1a6-dfdc-4f8d-a319-d1586b355d19|c-viper-thunder-dash-214pp|OD サンダースラップ|special|gated|
|c-viper|914e1504-a559-445c-888b-b90bd2d85ad0|c-viper-thunder-dash-feint-214p-k|[サンダースラップ]フェイント|special|gated|
|c-viper|ed13ddb1-b91d-4ba7-9c93-51c39b480f1d|c-viper-limit-decoupler-236236k|SA1 バウンサーステップ|super|gated|
|c-viper|e13cc8ca-b55f-497e-be2d-8e08a9d5e0f2|c-viper-burning-kick-236hk|強 バーニングキック|special|gated|
|c-viper|a2cbe042-5f17-4eab-bd89-053015e7dbc0|c-viper-burning-kick-236kk|OD バーニングキック|special|gated|
|c-viper|d7d78cb5-6102-4b80-a95f-4db1a06610ba|c-viper-double-burn-236k-kk|ダブルバーン|special|gated|
|c-viper|52b9126f-7ce3-42e1-b86a-22f24cdaa84c|c-viper-knuckled-pursuit-236k-pp|チェイスナックル|special|gated|
|c-viper|20fc5c08-b8e6-4ede-af55-e93d29cdb142|c-viper-burning-kick-236lk|弱 バーニングキック|special|gated|
|c-viper|cf6b4480-3edc-4894-83eb-77c4bf92cf30|c-viper-burning-kick-236mk|中 バーニングキック|special|gated|
|c-viper|b06f72f3-28fa-4dd4-b2a6-030be3822722|c-viper-viper-kick-2hk|ヴァイパースイープ|normal|gated|
|c-viper|0b1cad3d-defb-4594-a4ae-aeec77d2b054|c-viper-crouching-heavy-punch-2hp|しゃがみ強P（ヴァイパースライサー）|normal|gated|
|c-viper|8c6ebc68-98f3-4659-88eb-5e8b24a9260d|c-viper-crouching-light-kick-2lk|しゃがみ弱K（クラウチングヒールキック）|normal|gated|
|c-viper|95db82ab-3f5f-4349-a86e-d787d58b0b79|c-viper-crouching-light-punch-2lp|しゃがみ弱P（ジャブ）|normal|gated|
|c-viper|dfbce958-316b-4b40-845d-9993e9efba69|c-viper-crouching-medium-kick-2mk|しゃがみ中K（グランドキック）|normal|gated|
|c-viper|429891a9-c3d4-4664-b714-f73d7eacc9d5|c-viper-crouching-medium-punch-2mp|しゃがみ中P（ヴァイパーブロー）|normal|gated|
|c-viper|39b5b08b-13b6-480e-91e7-44b997748277|c-viper-high-jump-forward-2-9|ハイジャンプ（前方）|special|gated|
|c-viper|58a97045-a46a-4692-839c-f72d31a05a0e|c-viper-thunder-cradle-4lplk|サンダークレイドル|throw|gated|
|c-viper|bd181bb3-8825-40e5-bfb7-6fefb961f18d|c-viper-standing-heavy-kick-5hk|立ち強K|normal|gated|
|c-viper|6c8f802e-4441-4adf-83d3-7eda3110ed00|c-viper-standing-heavy-punch-5hp|立ち強P（トマホークチョップ）|normal|gated|
|c-viper|cbb520c8-c3bc-4010-b2b5-9198d0119d98|c-viper-standing-light-kick-5lk|立ち弱K（ヒールキック）|normal|gated|
|c-viper|7cf378d5-fb58-4990-9ae2-264add8f83b7|c-viper-standing-light-punch-5lp|立ち弱P（スナップナックル）|normal|gated|
|c-viper|ec3336dc-4117-460a-a918-66dce99731dc|c-viper-standing-medium-kick-5mk|立ち中K（フロントキック）|normal|gated|
|c-viper|3434bc4c-6132-4e8d-87b3-dd86357fbebc|c-viper-standing-medium-punch-5mp|立ち中P|normal|gated|
|c-viper|ec94e62e-8487-4332-a58c-48414d5baacf|c-viper-seismic-hammer-l|弱 セイスモハンマー|special|gated|
|c-viper|499d8978-28f0-41d9-868b-1951493abf6f|c-viper-seismic-hammer-od|OD セイスモハンマー|special|gated|
|c-viper|93188acc-38c2-42cc-86d1-7a6cdabb17d8|c-viper-seismic-hammer-feint-623p-k|[セイスモハンマー]フェイント|special|gated|
|c-viper|03851aac-fb3f-4a1f-bfa8-1cc6517f5b3a|c-viper-double-kick-6hk|ダブルキック|normal|gated|
|c-viper|20f61a5d-30d9-448b-8c5a-1e679efd72a2|c-viper-viper-elbow-6mp|ヴァイパーエルボー|normal|gated|
|c-viper|e2e8ddfd-0d71-44a0-9e3b-d3a80bf7c2eb|c-viper-neutral-jump-heavy-kick-8hk|垂直ジャンプ強K（エアリアルジャベリン）|normal|gated|
|c-viper|567ec703-c202-40d3-bace-673eb09405c9|c-viper-aerial-burning-kick-j-236hk|強 空中バーニングキック|special|gated|
|c-viper|ec0a776e-0d24-4bbe-b5d5-971adc588aa6|c-viper-aerial-burning-kick-j-236kk|OD 空中バーニングキック|special|gated|
|c-viper|66d6ca13-2041-4cf8-88f1-b28676a55abd|c-viper-aerial-burning-kick-j-236lk|弱 空中バーニングキック|special|gated|
|c-viper|79fcbf24-c709-473b-ad46-25a45f43b76c|c-viper-aerial-burning-kick-j-236mk|中 空中バーニングキック|special|gated|
|c-viper|0894f523-66f8-45de-966d-d7fec4c97be3|c-viper-jumping-heavy-kick-j-hk|ジャンプ強K（エアリアルクラッシュニー）|normal|gated|
|c-viper|01afbb21-1c1f-4ac7-82ee-48c50654668c|c-viper-jumping-heavy-punch-j-hp|ジャンプ強P（エアリアルハンマー）|normal|gated|
|c-viper|8fc36ad0-ee77-492d-8965-11067f4a2eff|c-viper-jumping-light-kick-j-lk|ジャンプ弱K（エアリアルプレスキック）|normal|gated|
|c-viper|2d75ffb0-1bac-405b-a149-8e7f28e3f0f3|c-viper-jumping-light-punch-j-lp|ジャンプ弱P（エアリアルエルボー）|normal|gated|
|c-viper|f0125277-c547-4549-aedb-d2be9fa3bf8f|c-viper-jumping-medium-kick-j-mk|ジャンプ中K（エアリアルトーキック）|normal|gated|
|c-viper|a9376105-7a20-46d0-b259-0a2d05f8ec7f|c-viper-jumping-medium-punch-j-mp|ジャンプ中P（エアリアルヴァイパーブロー）|normal|gated|
|c-viper|524cbb71-a557-47bf-8e72-1c2a90927182|c-viper-high-impulse-lplk|オーバーインパルス|throw|gated|
|c-viper|757c3e8f-a447-4fd0-811f-737fe5d2a534|c-viper-seismic-hammer-m|中 セイスモハンマー|special|gated|
|c-viper|519d3246-7d81-42a6-88cc-2340b6e0d946|c-viper-seismic-hammer-h|強 セイスモハンマー|special|gated|
|c-viper|5fdba88e-ceae-4d2e-9df7-b66b5fe60dcd|c-viper-high-jump-vertical-2-8|ハイジャンプ（垂直）|special|gated|
|c-viper|f0ddeeeb-503a-404e-9b4b-89f4d38fd873|c-viper-focus-force-forward-step-66|[セービングフォース]前方ステップ|special|gated|
|c-viper|493cb95f-ca38-4ca2-bc65-3b708e81e4e4|c-viper-forward-step-66|前方ステップ|unique|gated|
|c-viper|a0841ad5-a95c-43f8-81d4-46842fa7eba6|c-viper-back-step-44|後方ステップ|unique|gated|
|alex|fd27f911-987b-4ba0-b727-e73301ffeb69|alex-sledgecross-hammer-214214p|スレッジクロスハンマー|super|gated|
|alex|86136a6f-495e-4ecb-b34e-c0c66aab81c1|alex-raging-spear-236236k|レイジングスピアー|super|gated|
|alex|9e860acc-4183-42c6-8071-28a50656d749|alex-the-final-prison-236236p|ファイナルキャプチュード|super|gated|
|alex|9c0ca2ef-2b05-4832-b9d0-667400e56919|alex-the-final-prison-ca-236236p|ファイナルキャプチュード（CA）|super|gated|
|alex|198b2771-cd99-415b-9181-643335438cfb|alex-flash-chop-236hp|フラッシュチョップ|special|gated|
|alex|60fe5e26-346d-4244-bb8d-8d66cb939b47|alex-flash-axe-236lp|フラッシュアックス|special|gated|
|alex|fd9176ef-2810-46e8-ada0-6f5bca4e5b40|alex-flash-axe-236mp|フラッシュアックス|special|gated|
|alex|df42445a-7291-48a3-98a6-0b7bea16b05c|alex-flash-chop-236pp|フラッシュチョップ|special|gated|
|alex|f49ec8eb-db39-4fc4-903a-eee03177a81c|alex-roundhouse-kick-2hk|足払い（ラウンドキック）|normal|gated|
|alex|722822a4-42cd-474f-809b-981acd8d6151|alex-crouching-heavy-punch-2hp|しゃがみ強P|normal|gated|
|alex|4a767cab-a099-4066-98b1-5b004bc28c1c|alex-crouching-light-kick-2lk|しゃがみ弱K|normal|gated|
|alex|b73d481c-b66b-42e9-9030-6c9ee11d9336|alex-twisted-drop-2lk-2hk|ツイステッドドロップ|normal|gated|
|alex|4e02716a-415f-4866-9055-c5869ebefebe|alex-crouching-light-punch-2lp|しゃがみ弱P|normal|gated|
|alex|6532d41e-6d5e-406c-8040-6a5b8af429d2|alex-illegal-knees-2lplk|イリーガルニー|throw|gated|
|alex|e647cf99-9518-4a09-a260-fbec66e090ed|alex-crouching-medium-kick-2mk|しゃがみ中K|normal|gated|
|alex|2b4abc16-695d-4e0d-a503-df2819624a2a|alex-crouching-medium-punch-2mp|しゃがみ中P|normal|gated|
|alex|8c40a2bd-8778-4ddd-991b-d0cda1925665|alex-prowler-stance-2pp|ブレイカー・スタンス|special|gated|
|alex|46bc5d76-8274-4235-be2b-5c09e1035dff|alex-dangerous-armbar-br-spiral-ddt-2pp-2lplk|デンジャラスアームバー（スパイラルDDT）|special|gated|
|alex|cde1ae13-ff8c-46ed-898a-9b6cb9dbfef9|alex-low-retreat-2pp-4|ステップアウト|special|gated|
|alex|ea2c911c-7bc1-4d56-a43b-44fae109c7ad|alex-low-rush-2pp-6|ステップイン|special|gated|
|alex|c4a1e985-e97a-4521-a40e-a100be2d1150|alex-slashing-elbow-2pp-6p|スラッシュエルボー|special|gated|
|alex|7b009800-5747-4b7d-a2c1-7163f1826d48|alex-exit-prowler-stance-2pp-8|ブレイカー・スタンス解除|special|gated|
|alex|11cb8084-9168-443d-a745-01b2cc63cde4|alex-sweep-combination-1-br-flying-suplex-2pp-hk|スイープコンビネーション1|special|gated|
|alex|9efc0fc8-d2b8-430a-8a1e-0f96ddabbaeb|alex-sweep-combination-2-br-flying-suplex-2pp-hk-hk|スイープコンビネーション2|special|gated|
|alex|f6924ab4-3295-4729-a3ca-efdaee104dae|alex-heavy-lariat-2pp-hp|ヘビーラリアット|special|gated|
|alex|be41531a-a64a-4fd3-880d-4b724a06b62c|alex-heavy-lariat-hold-2pp-hp|ヘビーラリアット（ホールド）|special|gated|
|alex|506b622b-765d-43c4-8111-321848d0fb0d|alex-tactical-hop-2pp-lk|タクティカルリープ|special|gated|
|alex|e9c32aa7-f4de-4fad-93ef-2ef2ce81b646|alex-palm-jab-2pp-lp|パームコンタクト|special|gated|
|alex|4298e722-af4f-4f5d-95aa-511c5612044d|alex-hyper-takedown-br-death-valley-bomb-2pp-lplk|ハイパーテイクダウン（デスバレーボム）|special|gated|
|alex|7ec8deb6-fab6-4f6d-9c9c-a26cdb74df43|alex-air-stampede-2pp-mk|エアスタンピート|special|gated|
|alex|f333f69c-b7fa-4cc7-a96f-14696fc9f16f|alex-shoulder-launcher-br-falling-moon-2pp-mp|ショルダーランチャー（ムーンフォール）|special|gated|
|alex|f312a35c-8737-45fc-a731-3c07ecda80d3|alex-guillotine-hammer-4lplk|ギロチンハンマー|throw|gated|
|alex|71900c8b-9822-4bd4-991d-510ffea50306|alex-oblique-stomp-4mk|オブリークスタンプ|normal|gated|
|alex|96f8e0b4-0df3-42f1-b698-9e325616b5b2|alex-collapsing-driver-4mk-backturn|コラプシングドライバー|normal|gated|
|alex|159999da-db98-44ff-b5bd-e6c6687e02ac|alex-standing-heavy-kick-5hk|立ち強K|normal|gated|
|alex|32b42551-6729-4d36-92a2-c54f76f098f0|alex-standing-heavy-kick-hold-5-hk|立ち強K（ホールド）|normal|gated|
|alex|d72274a8-0aad-475d-a176-dcee5068a8ec|alex-standing-heavy-punch-5hp|立ち強P|normal|gated|
|alex|f1171ce3-0b61-4af3-9906-43af129b39c4|alex-standing-heavy-punch-hold-5-hp|立ち強P（ホールド）|normal|gated|
|alex|24ad3665-2bb5-4c37-8089-b07386e38983|alex-standing-light-kick-5lk|立ち弱K|normal|gated|
|alex|90e1bd5d-0305-4ba0-b56f-8553db6d7f72|alex-standing-light-punch-5lp|立ち弱P|normal|gated|
|alex|f6486eb1-7501-461d-8893-e52e46961a80|alex-standing-medium-kick-5mk|立ち中K|normal|gated|
|alex|1ac8c98d-1504-4f70-985a-581e3f185003|alex-standing-medium-punch-5mp|立ち中P|normal|gated|
|alex|72002e54-4e8a-4f0b-9e65-0131a7103581|alex-palm-strikes-5mp-hp|パームストライク|normal|gated|
|alex|5c35ac75-3556-47be-86e0-a772d49af0f1|alex-aerial-knee-smash-623hk|エアニースマッシュ|special|gated|
|alex|3073d9fd-49df-451d-9c8c-93a51bf34e40|alex-aerial-knee-smash-623kk|エアニースマッシュ|special|gated|
|alex|9b8e20f3-1bef-48e4-ae7f-8aa3dc16aeb3|alex-aerial-knee-smash-623lk|エアニースマッシュ|special|gated|
|alex|c6b7057f-1029-427f-b5be-7c6b899eda2d|alex-aerial-knee-smash-623mk|エアニースマッシュ|special|gated|
|alex|a9c526e6-55e2-400e-943a-30dbd838497e|alex-power-bomb-63214hp|パワーボム|special|gated|
|alex|a62a7836-7c5b-4e47-a4e9-61dbfa2f082a|alex-power-bomb-63214lp|パワーボム|special|gated|
|alex|9168f1d7-f1db-4052-9671-ce8d7af1f787|alex-power-bomb-63214mp|パワーボム|special|gated|
|alex|6cda610f-fab6-4960-bf8c-95a85af896a8|alex-power-bomb-63214pp|パワーボム|special|gated|
|alex|fed2bcf4-7765-4414-a749-34bd33b51aa1|alex-od-hyper-bomb-63214pp-6-backturn|ハイパーボム|special|gated|
|alex|32d9fde6-3c18-4bec-a93e-09a7dbdd6cd6|alex-power-drop-63214pp-backturn|パワードロップ|special|gated|
|alex|a89e15c4-dc2b-4c32-9cae-f3552d77d202|alex-power-drop-63214p-backturn|パワードロップ|special|gated|
|alex|9b99c569-c6d8-407a-8c2a-fe018577ef22|alex-chop-6mp|チョップ|normal|gated|
|alex|52ca8101-2dbc-4b9b-8f4a-a595333b7aeb|alex-flying-cross-chop-j-2hp|フライングクロスチョップ|normal|gated|
|alex|fa2e772a-edf7-4bc6-91b5-a268233449ca|alex-jumping-heavy-kick-j-hk|ジャンプ強K|normal|gated|
|alex|a9d9c4e7-283b-4752-b4e0-479d0f1918c0|alex-jumping-heavy-punch-j-hp|ジャンプ強P|normal|gated|
|alex|e23d9ea0-95fa-413d-a422-522925408935|alex-jumping-light-kick-j-lk|ジャンプ弱K|normal|gated|
|alex|48afacd7-cf3c-4abe-9aef-dfb65cead3f4|alex-jumping-light-punch-j-lp|ジャンプ弱P|normal|gated|
|alex|3ee78b99-47b1-4000-a31a-bf83fb0d1b96|alex-jumping-medium-kick-j-mk|ジャンプ中K|normal|gated|
|alex|dcaea7bc-4cc8-414f-8a01-6cfae24f14e7|alex-jumping-medium-punch-j-mp|ジャンプ中P|normal|gated|
|alex|1330719f-f6a7-43c0-8b6b-65d4e72ac6d3|alex-arm-lock-lplk|アームロック|throw|gated|
|alex|e7b534dd-8d0c-4200-ba60-e79ae126020a|alex-omega-wing-buster-pp-sa2|オメガウィングバスター|super|gated|
|ingrid|4ef25e1d-afed-41ef-8d11-54f917b32b9d|ingrid-order-of-the-sun-0-stock-214214p-0-stock|SA2 サンオーダー（Lv1）|super|gated|
|ingrid|6413aa87-0e47-49d2-93ef-bc94a010179e|ingrid-order-of-the-sun-1-stock-214214-p-1-stock|SA2 サンオーダー（Lv2）|super|gated|
|ingrid|b6bc235a-79d2-46f3-ba3e-92d958bf1868|ingrid-order-of-the-sun-2-stock-214214-p-2-stock|SA2 サンオーダー（Lv3）|super|gated|
|ingrid|35a10956-10d9-4c94-8379-275caf1b533f|ingrid-sun-flare-1-stock-214hp-1-stock|サンフレア（1ストック）|special|gated|
|ingrid|376c51c9-6d64-455f-a71b-96adc1d4a80e|ingrid-sun-flare-2-stock-214hp-2-stock|サンフレア（2ストック）|special|gated|
|ingrid|686f0058-9334-4c85-833d-8dbc2973ad97|ingrid-sun-flare-214lp-hold-ok|サンフレア|special|gated|
|ingrid|1ad5ddd7-9079-40df-be00-c12204e91d6d|ingrid-sun-flare-214mp|サンフレア|special|gated|
|ingrid|7c84e192-aaee-4916-ad7f-529ea882770d|ingrid-sun-flare-214pp|サンフレア|special|gated|
|ingrid|630e8d36-b192-4cf5-b0fb-e63fd41dc204|ingrid-sun-flare-1-stock-214pp-1-stock|サンフレア（1ストック）|special|gated|
|ingrid|17fa5c91-b8df-4886-8354-bd48401225d1|ingrid-sun-flare-2-stock-214pp-2-stock|サンフレア（2ストック）|special|gated|
|ingrid|05920cf1-13ec-4bec-b9fc-3a4df4590f85|ingrid-sun-veil-22k|サンヴェール|special|gated|
|ingrid|17006beb-bc73-46df-aca4-40059e85ff70|ingrid-sun-veil-22kk|サンヴェール|special|gated|
|ingrid|10016add-2efb-44cc-a5b4-444d610e24a5|ingrid-shining-sun-0-stock-236236k-0-stock|SA1 サンシャイン（Lv1）|super|gated|
|ingrid|69f4a36e-028e-4dc0-ac4f-bad477196210|ingrid-shining-sun-1-stock-236236-k-1-stock|SA1 サンシャイン（Lv2）|super|gated|
|ingrid|f40ca33c-4063-45f3-b39e-a415c0092eb7|ingrid-shining-sun-2-stock-236236-k-2-stock|SA1 サンシャイン（Lv3）|super|gated|
|ingrid|61514fdd-4707-4b13-bbff-5197ee9c43d0|ingrid-cosmic-ray-236236p|SA3 コズミックレイ|super|gated|
|ingrid|8e74d393-d33c-46df-ba61-ebe1d19b8696|ingrid-cosmic-ray-ca-236236p|CA コズミックレイ|super|gated|
|ingrid|666e7042-3c1b-4179-babe-b7cb67896272|ingrid-sun-rise-236hk|サンライズ|special|gated|
|ingrid|106c2942-c3ec-48ca-b673-51e7d0fa932a|ingrid-sun-shot-236hp|サンシュート|special|gated|
|ingrid|a9e69d63-6089-4b37-84da-b82130315be0|ingrid-sun-rise-236kk|サンライズ|special|gated|
|ingrid|193c7170-ee4d-4781-829c-0a77ed7c81b2|ingrid-sun-rise-236lk|サンライズ|special|gated|
|ingrid|f3264dc7-cead-4fbd-a48b-2fc550b41446|ingrid-sun-shot-236lp|サンシュート|special|gated|
|ingrid|896bcfc7-5f28-420f-9edb-0290359b43f1|ingrid-sun-rise-236mk|サンライズ|special|gated|
|ingrid|48860f55-2304-4e43-9b31-54fe0ab34fbf|ingrid-sun-shot-236mp|サンシュート|special|gated|
|ingrid|b0f3a8f8-8307-4b70-90fa-9ca58bd1d559|ingrid-orbital-kick-2hk|オービタルキック|normal|gated|
|ingrid|090b6c76-7d7a-4fac-9b5d-480783eb142c|ingrid-crouching-heavy-punch-2hp|しゃがみ強P|normal|gated|
|ingrid|32d66e08-81e4-4074-8e7d-2a3de73295c0|ingrid-vanishing-sun-down-2kkk|サンバニッシュ（上方）|special|gated|
|ingrid|085b713f-2fa2-4ad3-b5fc-9b181801dc07|ingrid-crouching-light-kick-2lk|しゃがみ弱K|normal|gated|
|ingrid|c46008e0-e4d0-4ea6-9361-f64397569f51|ingrid-crouching-light-punch-2lp|しゃがみ弱P|normal|gated|
|ingrid|a0605fb6-b60f-4ba0-be1e-c39610de1cb3|ingrid-crouching-medium-kick-2mk|しゃがみ中K|normal|gated|
|ingrid|1bbc8a7b-7dab-4156-890f-c59158f9f96c|ingrid-crouching-medium-punch-2mp|しゃがみ中P|normal|gated|
|ingrid|8b6b34bf-96c7-44a9-aa4f-bb2c6347d48a|ingrid-luminous-uppercut-1-4hp|ルミナスアッパー1|normal|gated|
|ingrid|a7ac77d0-e9a6-4a0b-8ac4-7bcaa62efb89|ingrid-luminous-uppercut-2-4hp-hp|ルミナスアッパー2|normal|gated|
|ingrid|5dbaff2a-f404-471b-ade9-603e3220f500|ingrid-vanishing-sun-back-4kkk|サンバニッシュ（後方）|special|gated|
|ingrid|e13e81a4-55ee-4080-a156-f088c56df4b8|ingrid-gravity-drop-4lplk|グラビティドロップ|throw|gated|
|ingrid|fbc62d82-9ce7-4d18-9820-9cacdb10dee9|ingrid-glowing-touch-1-4mk|グロータッチ1|normal|gated|
|ingrid|f0b734d1-b0a9-45c5-a580-58919e942afe|ingrid-glowing-touch-2-4mk-hp|グロータッチ2|normal|gated|
|ingrid|f467c51d-f893-418b-850b-2bec448a3439|ingrid-standing-heavy-kick-5hk|立ち強K|normal|gated|
|ingrid|41172dc1-d44c-4ba7-97d2-d95cd9dcbfe4|ingrid-standing-heavy-punch-5hp|立ち強P|normal|gated|
|ingrid|1161be83-5832-44a1-afef-d23fcfd9732d|ingrid-standing-light-kick-5lk|立ち弱K|normal|gated|
|ingrid|3ec12cfd-c155-4eb6-90d9-65092aaf37db|ingrid-standing-light-punch-5lp|立ち弱P|normal|gated|
|ingrid|6734fcd5-29c3-4064-8679-956460208ba0|ingrid-standing-medium-kick-5mk|立ち中K|normal|gated|
|ingrid|3dd49984-4b15-4f9e-9634-2b55cad264ea|ingrid-standing-medium-punch-5mp|立ち中P|normal|gated|
|ingrid|69bbedb3-a847-4a83-bbb5-f41a26e818ce|ingrid-pretty-heel-kick-5mp-mk|プリティヒールキック|normal|gated|
|ingrid|6d7499cb-08b8-494c-a655-667925c97d04|ingrid-halo-flight-6hp|ヘイローステップ|normal|gated|
|ingrid|a001d08a-cfad-4749-a340-1e410f1e847e|ingrid-vanishing-sun-forward-6kkk|サンバニッシュ（前方）|special|gated|
|ingrid|15593710-4688-4533-b66d-40f3d37a1435|ingrid-sun-bright-6mp|サンブライト|normal|gated|
|ingrid|076d1989-9455-4c47-a440-f481b7e6bfeb|ingrid-solar-burst-1-stock-j-214hp-1-stock|ソーラーフレア（1ストック）|special|gated|
|ingrid|378d69bb-6f99-453f-988f-57dbbc83e9f2|ingrid-solar-burst-2-stock-j-214hp-2-stock|ソーラーフレア（2ストック）|special|gated|
|ingrid|2c31c0cb-4d0f-48b8-8bbe-fef4bff88c34|ingrid-solar-burst-j-214lp|ソーラーフレア|special|gated|
|ingrid|4ce0a704-d05a-41a5-9973-f1d30ca5b118|ingrid-solar-burst-j-214mp|ソーラーフレア|special|gated|
|ingrid|44bec95a-fd1f-40bb-8b97-091b21b4fa74|ingrid-solar-burst-j-214pp|ソーラーフレア|special|gated|
|ingrid|a9f2303e-ff13-40bb-9089-d907a8b7efe6|ingrid-solar-burst-1-stock-j-214pp-1-stock|ソーラーフレア（1ストック）|special|gated|
|ingrid|044ab472-3a6c-4777-a0fe-530c3dd182f8|ingrid-solar-burst-2-stock-j-214pp-2-stock|ソーラーフレア（2ストック）|special|gated|
|ingrid|59d6f7e0-928a-43bb-bcf0-ce90c8f69463|ingrid-jumping-heavy-kick-j-hk|ジャンプ強K|normal|gated|
|ingrid|3658815c-407c-4aa2-a068-f8f80ea685fd|ingrid-satellite-leap-j-hk-j-hk|サテライトリープ|normal|gated|
|ingrid|78a246c6-7c64-4143-aeb4-dd0e68ef7720|ingrid-jumping-heavy-punch-j-hp|ジャンプ強P|normal|gated|
|ingrid|37be78a6-8061-49a5-8e19-9b00a5244ed9|ingrid-jumping-light-kick-j-lk|ジャンプ弱K|normal|gated|
|ingrid|46862ac1-c8f8-4aaf-95d3-4c22cf7379bb|ingrid-jumping-light-punch-j-lp|ジャンプ弱P|normal|gated|
|ingrid|473156b0-0500-4d8b-8960-21f725345e39|ingrid-jumping-medium-kick-j-mk|ジャンプ中K|normal|gated|
|ingrid|7a7e74ff-40b3-4008-aeda-0515ea8656ed|ingrid-jumping-medium-punch-j-mp|ジャンプ中P|normal|gated|
|ingrid|aafb7458-4fb7-4cc8-acf8-d637ffbac022|ingrid-strange-knuckle-lplk|ストレンジナックル|throw|gated|
|yasmine|8ecba6ae-0914-473a-a91b-9619dc3b7ad6|yasmine-nakatagong-lakas-214214p|SA2 ナカタゴン・ラカス|super|gated|
|yasmine|720e4c8e-a93c-457e-b1c8-6ec230947b61|yasmine-linya-ng-liwanag-214214p-4kk|リニャ・ン・リワナグ|special|gated|
|yasmine|fcc23bd3-7104-4cb5-8421-000a2a5e6db7|yasmine-talim-ng-hangin-214hp|強 タリム・ン・ハンギン|special|gated|
|yasmine|48628cf4-d99e-420b-907e-16435f3650fe|yasmine-talim-ng-hangin-214lp|弱 タリム・ン・ハンギン|special|gated|
|yasmine|b075f9f1-5c86-43bd-b391-c6d8857d7ddb|yasmine-talim-ng-hangin-214mp|中 タリム・ン・ハンギン|special|gated|
|yasmine|46bc481b-23be-4394-9781-cd11b77d52bd|yasmine-talim-ng-hangin-214pp|OD タリム・ン・ハンギン|special|gated|
|yasmine|596a4a42-ce50-4c51-a367-0c12f83ce83a|yasmine-pangil-sa-likuran-22lp|弱 パンギル・サ・リクラン|special|gated|
|yasmine|b7a7c5dc-0703-4239-9df4-e62559f5a8e5|yasmine-pangil-sa-likuran-22lpmp|OD 弱 パンギル・サ・リクラン|special|gated|
|yasmine|1c09f2c2-5300-4355-b988-3756a2c8c5dd|yasmine-hiwa-ng-kalangitan-236236k|SA1 ヒワン・ン・カラヒタン|super|gated|
|yasmine|9e92c699-6f60-4553-b1db-322bbdcb32e0|yasmine-pamumukadkad-ng-sampaguita-236236p|SA3 パムムカドカッド・ン・サンパギータ|super|gated|
|yasmine|b55d287e-ca8e-46bd-bf81-db53775b8294|yasmine-pamumukadkad-ng-sampaguita-ca-236236p|CA パムムカドカッド・ン・サンパギータ|super|gated|
|yasmine|368baecb-d1cc-4164-923b-a7512ad7cf55|yasmine-daloy-ng-tubig-236hp|強 ダロイ・ン・トゥビグ|special|gated|
|yasmine|88e637c4-1c01-4b41-b1e4-8d0443cbf8a6|yasmine-alon-236hp-6p|強 アロン（1段目）|special|gated|
|yasmine|21410a7b-74b6-40da-8639-7ae894a98e35|yasmine-alon-bayani-236hp-6p|[強化版]強 アロン（2段目）|special|gated|
|yasmine|063766f0-b20c-4f6d-bd7f-80cae0f692f7|yasmine-mukha-ng-langit-236lk|弱 ムカ・ン・ランギット|special|gated|
|yasmine|d3e482ae-ea0c-4643-92d9-9ec0a4727702|yasmine-mukha-ng-langit-236kk|OD ムカ・ン・ランギット|special|gated|
|yasmine|0ac54e2d-a6af-4ab1-8e54-bfea51f851a4|yasmine-kulog-236kk-k-or-236k-kk|OD クロッグ|special|gated|
|yasmine|6038b360-5979-4a12-a69f-7b2cbc35edd4|yasmine-ulan-236kk-p-or-236k-pp|OD ウラン|special|gated|
|yasmine|f10077f2-758d-43a5-b0ff-d6a801a17762|yasmine-kulog-236k-k|クロッグ|special|gated|
|yasmine|5223be98-b774-44f3-93c6-f525e9bcd293|yasmine-ulan-236k-p|ウラン|special|gated|
|yasmine|8416a1f7-69c0-4cc6-8c94-62e5d599ce1f|yasmine-daloy-ng-tubig-236lp|弱 ダロイ・ン・トゥビグ|special|gated|
|yasmine|6d0eac80-e601-47e0-bbde-5177918119c7|yasmine-alon-236lp-6p|弱 アロン（1段目）|special|gated|
|yasmine|77e1c548-9ad0-4224-abee-8d3beab0840a|yasmine-alon-bayani-236lp-6p|[強化版]弱 アロン（2段目）|special|gated|
|yasmine|5844bf2f-b0b1-4fc0-a357-5fba2447c274|yasmine-daloy-ng-tubig-236mp|中 ダロイ・ン・トゥビグ|special|gated|
|yasmine|94df5acf-0ac9-4ec7-b05e-f270b6820620|yasmine-alon-236mp-6p|中 アロン（1段目）|special|gated|
|yasmine|8dcbfc4d-c704-4397-bffa-791e12496d45|yasmine-alon-bayani-236mp-6p|[強化版]中 アロン（2段目）|special|gated|
|yasmine|adcc4f11-0d51-41b5-9b6b-2ad04b63ac46|yasmine-daloy-ng-tubig-236pp|OD ダロイ・ン・トゥビグ|special|gated|
|yasmine|3485b1cd-dfdf-40d6-9125-42c8ebda906a|yasmine-alon-236pp-6p|OD アロン（1段目）|special|gated|
|yasmine|67ba636f-2fb0-4356-b49d-6031c96a44a1|yasmine-alon-bayani-236pp-6p|[強化版]OD アロン（2段目）|special|gated|
|yasmine|d66223a6-df43-4ce9-801b-dbc83cf21bf1|yasmine-gunting-na-pabagsak-2hk|グンティング・ナ・パバサ|normal|gated|
|yasmine|495aa9a0-c9b0-4484-b845-856a538832e4|yasmine-crouching-heavy-punch-2hp|しゃがみ強P（マミミツィン）|normal|gated|
|yasmine|dcda78cf-a5be-4d31-9fed-d18bcf34e9ac|yasmine-crouching-light-kick-2lk|しゃがみ弱K（マガアン・ナ・シパ）|normal|gated|
|yasmine|bcdb1926-b1a6-4a85-b8d0-25dcf464fd87|yasmine-crouching-light-punch-2lp|しゃがみ弱P（マビリサング・パグラスラス）|normal|gated|
|yasmine|44237752-18cd-4aa7-8e78-9670a78a6e2e|yasmine-crouching-medium-kick-2mk|しゃがみ中K（パンドゥログ・ナン・ルロッド）|normal|gated|
|yasmine|3ca23e5c-4ae7-4047-b8fb-9b72af2c62c1|yasmine-kumbinasyong-pampabagsak-2mk-hk|コンビナション・パムパバッグサ|normal|gated|
|yasmine|03a3c78f-d49e-4dff-9857-08856fd40b25|yasmine-crouching-medium-punch-2mp|しゃがみ中P（カルモット）|normal|gated|
|yasmine|62dd7d64-e7b7-48f4-a2d7-58ed81feb84d|yasmine-walis-na-pabagsak-4hk|ワリス・ナ・パバグサ|normal|gated|
|yasmine|4301622d-102a-40e1-b583-2b02db739e54|yasmine-hila-kamay-4lplk|ヒラ・カマイ|throw|gated|
|yasmine|72e48438-5de6-43cb-b421-41a5105dd213|yasmine-standing-heavy-kick-5hk|立ち強K（トゥマタロン・ナ・シパ）|normal|gated|
|yasmine|de5b585d-28cd-4be8-b495-2611b995ef2f|yasmine-standing-heavy-punch-5hp|立ち強P（トリップレング・パグラスラス）|normal|gated|
|yasmine|77b8c07a-0085-40ab-bae7-ad37aadd44ce|yasmine-standing-light-kick-5lk|立ち弱K（マババング・シパ）|normal|gated|
|yasmine|42bfb7b6-2511-48e4-b50e-7045fc676ba9|yasmine-standing-light-punch-5lp|立ち弱P（マガアン・ナ・パグラスラス）|normal|gated|
|yasmine|c7bb118a-d199-4e59-bc32-e1b6d34de8c8|yasmine-kidlat-na-hiwa-5lp-lp|キドラット・ナ・ヒワ|normal|gated|
|yasmine|329ee255-394a-49be-9ecb-e9fb2b982370|yasmine-standing-medium-kick-5mk|立ち中K|normal|gated|
|yasmine|13f79a86-bf36-4f35-b39b-84af16365872|yasmine-sunod-sunod-na-sipa-1-5mk-mk|スノスノッド・ナ・シパ（1段目）|normal|gated|
|yasmine|b255814b-57aa-4668-a729-ab6c35b61c35|yasmine-sunod-sunod-na-sipa-2-5mk-mk-hk|スノスノッド・ナ・シパ（2段目）|normal|gated|
|yasmine|6b816c73-20c6-4590-8389-2bd0db98b251|yasmine-standing-medium-punch-5mp|立ち中P（パバリック・バリック ・ナ・パグラスラス）|normal|gated|
|yasmine|e1b79767-8628-4a4a-b36d-570655e8c039|yasmine-tatlong-hiwa-5mp-mp|タッロング・ヒワ|normal|gated|
|yasmine|104a6f55-f256-4521-9190-15e6daf741ea|yasmine-lipad-ng-agila-623hk|強 リパ・ン・アギラ|special|gated|
|yasmine|b79816b6-b16f-47f7-8cbf-32221c3914e6|yasmine-lipad-ng-agila-623kk|OD リパ・ン・アギラ|special|gated|
|yasmine|802cddff-6b17-4069-9fbb-520d81a10914|yasmine-lipad-ng-agila-623lk|弱 リパ・ン・アギラ|special|gated|
|yasmine|a2be59a6-469a-4501-a18d-515c58849bd4|yasmine-lipad-ng-agila-623mk|中 リパ・ン・アギラ|special|gated|
|yasmine|de33eadd-d757-4794-a2bb-ad809acf4247|yasmine-hiwang-pababa-6mp|ヒワン・パババ|normal|gated|
|yasmine|c030fb18-aa67-4ec7-923e-a54179286219|yasmine-jumping-heavy-kick-j-hk|ジャンプ強K（パンヒンパパウィド・ナ・マラカス・ナ・シパ）|normal|gated|
|yasmine|84d5d088-b584-42e0-a20b-5627d457eb00|yasmine-jumping-heavy-punch-j-hp|ジャンプ強P（ナママロング・マガ・パクパク）|normal|gated|
|yasmine|d58cda82-9f2a-4cc7-b421-7ab696cbbd32|yasmine-jumping-light-kick-j-lk|ジャンプ弱K（パンヒンパパウィド・ナ・シパ・ガミット・アング・トゥホッド）|normal|gated|
|yasmine|7949413b-1ea3-41cd-83be-250b5759aca1|yasmine-jumping-light-punch-j-lp|ジャンプ弱P（マガアン・ナ・パンヒンパパウィド・パグラスラス）|normal|gated|
|yasmine|697468cc-a9d2-4531-b974-b919aec0fc12|yasmine-jumping-medium-kick-j-mk|ジャンプ中K（パンヒンパパウィド・ナ・シパ・サ・ハラップ）|normal|gated|
|yasmine|3e76ed52-4ebe-4bcd-a44d-2a60960c5e55|yasmine-jumping-medium-punch-j-mp|ジャンプ中P（パビログ・ナ・パグラスラス）|normal|gated|
|yasmine|f7faa5a2-62a0-4c72-abf3-91c16631a7c2|yasmine-pigil-ulo-lplk|ピギル・ウロ|throw|gated|
|yasmine|b425b72b-4769-4e8b-81ce-25d5b630de86|yasmine-alon-2-236lp-6p-p|弱 アロン（2段目）|special|gated|
|yasmine|1aa99f82-81aa-4cac-8532-d5a0aa2a0f7e|yasmine-alon-2-236mp-6p-p|中 アロン（2段目）|special|gated|
|yasmine|b17cb130-2e18-4789-8645-3c979a3c5f4f|yasmine-alon-2-236hp-6p-p|強 アロン（2段目）|special|gated|
|yasmine|4a6a8134-98c7-4fe2-817c-8131b54cbbc4|yasmine-alon-2-236pp-6p-p|OD アロン（2段目）|special|gated|
|yasmine|c709a4cc-37ca-4950-8496-1d7630044604|yasmine-alon-2-od-bayani-sa2|[ナカタゴン・ラカス中][強化版]OD アロン（2段目）|special|gated|
|yasmine|90ef6e3e-33a6-4407-935a-f9843b7d6b17|yasmine-mukha-ng-langit-236mk|中 ムカ・ン・ランギット|special|gated|
|yasmine|9d541ca6-b232-4a72-9d74-23efdff833a4|yasmine-mukha-ng-langit-236hk|強 ムカ・ン・ランギット|special|gated|
|yasmine|d8540548-4ab4-49d0-adb8-42644a1d0eb3|yasmine-pangil-sa-likuran-22mp|中 パンギル・サ・リクラン|special|gated|
|yasmine|0396eb74-6549-41c5-a59f-332b92284393|yasmine-pangil-sa-likuran-22hp|強 パンギル・サ・リクラン|special|gated|
|yasmine|5386935e-aba2-4eb9-9da4-438334bdb845|yasmine-pangil-sa-likuran-22lphp|OD 中 パンギル・サ・リクラン|special|gated|
|yasmine|b923d388-06b0-43fe-9121-fd073404692a|yasmine-pangil-sa-likuran-22mphp|OD 強 パンギル・サ・リクラン|special|gated|
|yasmine|723e292b-7d41-47c1-85ab-b549b32d7742|yasmine-forward-step-66|前方ステップ|unique|gated|
|yasmine|da883fa5-c9ef-4a75-b8cc-3bfb26879ee9|yasmine-back-step-44|後方ステップ|unique|gated|
