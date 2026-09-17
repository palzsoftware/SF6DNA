import type { DevicePreviewBundle } from "@/lib/device-preview";

// Preview-only snapshot generated from the Fresh JP DB review on 2026-09-17.
// It is used only when the protected Preview RPC is unavailable; it never changes publication status.
export const jpMoveReviewFixture: DevicePreviewBundle["moves"] = [
  {
    "id": "b558b854-1a5b-41a3-89ec-b119abc475ae",
    "slug": "jp-standing-lp",
    "name": "立ち弱P（ノーシ）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "6",
      "onBlock": "-2",
      "damage": 300,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "b558b854-1a5b-41a3-89ec-b119abc475ae",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5LP"
      },
      {
        "moveId": "b558b854-1a5b-41a3-89ec-b119abc475ae",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "弱攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "L"
      }
    ]
  },
  {
    "id": "45d7ef0d-2f7c-415d-b433-1e04ad9fe09b",
    "slug": "jp-standing-lk",
    "name": "立ち弱K（ニージニイ・ウダール）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "5",
      "onBlock": "-2",
      "damage": 300,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "45d7ef0d-2f7c-415d-b433-1e04ad9fe09b",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5LK"
      }
    ]
  },
  {
    "id": "e4ed90d9-23bf-4089-978a-4f2061e3b94a",
    "slug": "jp-standing-mp",
    "name": "立ち中P（シュトゥールム）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "12",
      "onBlock": "-6",
      "damage": 700,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "e4ed90d9-23bf-4089-978a-4f2061e3b94a",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5MP"
      },
      {
        "moveId": "e4ed90d9-23bf-4089-978a-4f2061e3b94a",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "M"
      }
    ]
  },
  {
    "id": "94ad1cb7-1464-432d-b7ee-34e0171541b0",
    "slug": "jp-standing-mk",
    "name": "立ち中K（ウームヌィ・ウダール）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "8",
      "onBlock": "-3",
      "damage": 600,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "94ad1cb7-1464-432d-b7ee-34e0171541b0",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "中K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5MK"
      },
      {
        "moveId": "94ad1cb7-1464-432d-b7ee-34e0171541b0",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "アシスト + 中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "A+M"
      }
    ]
  },
  {
    "id": "45863f7d-e112-42d8-ab88-d33839b4873a",
    "slug": "jp-standing-hp",
    "name": "立ち強P（キンターヴル）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "12",
      "onBlock": "-3",
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "45863f7d-e112-42d8-ab88-d33839b4873a",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5HP"
      },
      {
        "moveId": "45863f7d-e112-42d8-ab88-d33839b4873a",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "アシスト + 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "A+H"
      }
    ]
  },
  {
    "id": "9e959d30-059e-404b-ab0e-279ec4c5a54a",
    "slug": "jp-standing-hk",
    "name": "立ち強K（オボロートニ）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "12",
      "onBlock": "+2",
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "9e959d30-059e-404b-ab0e-279ec4c5a54a",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5HK"
      },
      {
        "moveId": "9e959d30-059e-404b-ab0e-279ec4c5a54a",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "H"
      }
    ]
  },
  {
    "id": "7c4584fd-fdb5-4fb9-84a2-472c3c03febe",
    "slug": "jp-crouching-lp",
    "name": "しゃがみ弱P（ブィストルイ・ウダール）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "4",
      "onBlock": "-1",
      "damage": 300,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "7c4584fd-fdb5-4fb9-84a2-472c3c03febe",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2LP"
      },
      {
        "moveId": "7c4584fd-fdb5-4fb9-84a2-472c3c03febe",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + 弱攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2L"
      }
    ]
  },
  {
    "id": "5a596631-df8f-450b-b735-ae4b9ca14390",
    "slug": "jp-crouching-lk",
    "name": "しゃがみ弱K（リョーフキー・ウダール）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "6",
      "onBlock": "-2",
      "damage": 200,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "5a596631-df8f-450b-b735-ae4b9ca14390",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2LK"
      },
      {
        "moveId": "5a596631-df8f-450b-b735-ae4b9ca14390",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "アシスト + 弱攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "A+L"
      }
    ]
  },
  {
    "id": "0afd12fb-5c7a-4799-b222-21daa7ca18f3",
    "slug": "jp-crouching-mp",
    "name": "しゃがみ中P（ズミヤー）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "7",
      "onBlock": "-2",
      "damage": 600,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "0afd12fb-5c7a-4799-b222-21daa7ca18f3",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2MP"
      },
      {
        "moveId": "0afd12fb-5c7a-4799-b222-21daa7ca18f3",
        "scheme": "modern",
        "sortOrder": 7,
        "commandText": "↓ + 中攻撃",
        "conditionText": "CAPCOM official Modern frame-table row; checked 2026-08-28.",
        "buttonNotation": "2+M",
        "numericNotation": "2M"
      }
    ]
  },
  {
    "id": "92ecb272-1cbd-46f0-95f2-ad4d21506e99",
    "slug": "jp-crouching-mk",
    "name": "しゃがみ中K（ズローバ）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "9",
      "onBlock": "-3",
      "damage": 700,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "92ecb272-1cbd-46f0-95f2-ad4d21506e99",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 中K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2MK"
      },
      {
        "moveId": "92ecb272-1cbd-46f0-95f2-ad4d21506e99",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + 中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2M"
      }
    ]
  },
  {
    "id": "33b785cd-b4e9-4232-be5c-aca9ccef7b0a",
    "slug": "jp-crouching-hp",
    "name": "しゃがみ強P（マリートヴァ）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "9",
      "onBlock": "-6",
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "33b785cd-b4e9-4232-be5c-aca9ccef7b0a",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2HP"
      },
      {
        "moveId": "33b785cd-b4e9-4232-be5c-aca9ccef7b0a",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2H"
      }
    ]
  },
  {
    "id": "5fad21d1-bb82-4a22-bf29-f125688d3cb9",
    "slug": "jp-crouching-hk",
    "name": "しゃがみ強K（ジョーキル）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "10",
      "onBlock": "-6",
      "damage": 900,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "5fad21d1-bb82-4a22-bf29-f125688d3cb9",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2HK"
      }
    ]
  },
  {
    "id": "610e39c3-8fef-4a72-b85b-15c3a8fedd71",
    "slug": "jp-guillotine",
    "name": "ギリオチーナ",
    "moveType": "unique",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "22",
      "onBlock": "-3",
      "damage": 700,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "610e39c3-8fef-4a72-b85b-15c3a8fedd71",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "→ + 中K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "6MK"
      },
      {
        "moveId": "610e39c3-8fef-4a72-b85b-15c3a8fedd71",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "→ + 中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "6M"
      }
    ]
  },
  {
    "id": "290c6317-4a8a-4241-84cb-fc6774db1a98",
    "slug": "jp-shalosti",
    "name": "シャーロスチ",
    "moveType": "unique",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "16",
      "onBlock": "-14",
      "damage": 900,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "290c6317-4a8a-4241-84cb-fc6774db1a98",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "→ + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "6HP"
      },
      {
        "moveId": "290c6317-4a8a-4241-84cb-fc6774db1a98",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↘ + 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "3H"
      }
    ]
  },
  {
    "id": "00306fb8-0213-4c10-af70-df4286431957",
    "slug": "jp-back-mp",
    "name": "後ろ中P / Back + Medium Punch",
    "moveType": "unique",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "8",
      "onBlock": "-1",
      "damage": 500,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "00306fb8-0213-4c10-af70-df4286431957",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "← + 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "4MP"
      },
      {
        "moveId": "00306fb8-0213-4c10-af70-df4286431957",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "← + 中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "4M"
      }
    ]
  },
  {
    "id": "00edfdc1-cf06-4b8c-b836-a213a7028cf6",
    "slug": "jp-jump-lp",
    "name": "ジャンプ弱P（ルイースイ）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "5",
      "onBlock": null,
      "damage": 300,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "00edfdc1-cf06-4b8c-b836-a213a7028cf6",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.LP"
      },
      {
        "moveId": "00edfdc1-cf06-4b8c-b836-a213a7028cf6",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で 弱攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.L"
      }
    ]
  },
  {
    "id": "3ed94fcd-3820-4ad6-91ea-7405360afac0",
    "slug": "jp-forward-hk",
    "name": "前強K（Bylina）",
    "moveType": "unique",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "11",
      "onBlock": "-5",
      "damage": 900,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "3ed94fcd-3820-4ad6-91ea-7405360afac0",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "→ + 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "6HK"
      },
      {
        "moveId": "3ed94fcd-3820-4ad6-91ea-7405360afac0",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "→ + 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "6H"
      }
    ]
  },
  {
    "id": "fb460c24-5453-48e4-bc72-dc3dffcfc81c",
    "slug": "jp-grom-strelka",
    "name": "グローム・ストレルカ",
    "moveType": "target_combo",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "8,10",
      "onBlock": "-1,-6",
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "fb460c24-5453-48e4-bc72-dc3dffcfc81c",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "← + 中P > 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "4MP~MP"
      },
      {
        "moveId": "fb460c24-5453-48e4-bc72-dc3dffcfc81c",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "← + 中攻撃 > 中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "4M~M"
      }
    ]
  },
  {
    "id": "6cb6065e-9c33-47d1-af2c-00e4b3871182",
    "slug": "jp-jump-lk",
    "name": "ジャンプ弱K（ヴァローナ）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "6",
      "onBlock": null,
      "damage": 300,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "6cb6065e-9c33-47d1-af2c-00e4b3871182",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.LK"
      },
      {
        "moveId": "6cb6065e-9c33-47d1-af2c-00e4b3871182",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で アシスト + 弱攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.A+L"
      }
    ]
  },
  {
    "id": "3baf3077-05b0-4360-b548-ee16b68f8a37",
    "slug": "jp-jump-mp",
    "name": "ジャンプ中P（ローシャッチ）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "12",
      "onBlock": null,
      "damage": 700,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "3baf3077-05b0-4360-b548-ee16b68f8a37",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.MP"
      },
      {
        "moveId": "3baf3077-05b0-4360-b548-ee16b68f8a37",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で アシスト + 中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.A+M"
      }
    ]
  },
  {
    "id": "0cc4dbc5-1dfc-4225-b050-a6ad29b92c0e",
    "slug": "jp-zilant",
    "name": "ジラント",
    "moveType": "target_combo",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "20",
      "onBlock": "-3",
      "damage": 500,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "0cc4dbc5-1dfc-4225-b050-a6ad29b92c0e",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "強K > 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "HK~HP"
      },
      {
        "moveId": "0cc4dbc5-1dfc-4225-b050-a6ad29b92c0e",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "強攻撃 > 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "H~H"
      }
    ]
  },
  {
    "id": "ce1e365b-8572-44a2-8767-0bce9f20054b",
    "slug": "jp-jump-mk",
    "name": "ジャンプ中K（コンダ）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "7",
      "onBlock": null,
      "damage": 600,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "ce1e365b-8572-44a2-8767-0bce9f20054b",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）中K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.MK"
      },
      {
        "moveId": "ce1e365b-8572-44a2-8767-0bce9f20054b",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で 中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.M"
      }
    ]
  },
  {
    "id": "1e3cc0be-14ef-4c39-9392-d8b88196fc46",
    "slug": "jp-zilant-mid",
    "name": "ジラント・ミドル",
    "moveType": "target_combo",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "21",
      "onBlock": "-4",
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "1e3cc0be-14ef-4c39-9392-d8b88196fc46",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "強K > 強P > 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "HK~HP~HP"
      },
      {
        "moveId": "1e3cc0be-14ef-4c39-9392-d8b88196fc46",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "強攻撃 > 強攻撃 > 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "H~H~H"
      }
    ]
  },
  {
    "id": "88b7028e-f54a-4b51-a75a-670ccfce75dc",
    "slug": "jp-jump-hp",
    "name": "ジャンプ強P（イディナローク）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "9",
      "onBlock": null,
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "88b7028e-f54a-4b51-a75a-670ccfce75dc",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.HP"
      },
      {
        "moveId": "88b7028e-f54a-4b51-a75a-670ccfce75dc",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で アシスト + 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.A+H"
      }
    ]
  },
  {
    "id": "0b5841d6-8c3d-4da9-af74-0d4e9c2e389c",
    "slug": "jp-zilant-low",
    "name": "ジラント・ロー",
    "moveType": "target_combo",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "21",
      "onBlock": "-4",
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "0b5841d6-8c3d-4da9-af74-0d4e9c2e389c",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "強K > 強P > 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "HK~HP~HK"
      },
      {
        "moveId": "0b5841d6-8c3d-4da9-af74-0d4e9c2e389c",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "強攻撃 > 強攻撃 > ← + 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "H~H~4H"
      }
    ]
  },
  {
    "id": "61797d46-a331-4638-ba60-3dc3ea0cfd16",
    "slug": "jp-jump-hk",
    "name": "ジャンプ強K（ジャール・プチーツァ）",
    "moveType": "normal",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "11",
      "onBlock": null,
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "61797d46-a331-4638-ba60-3dc3ea0cfd16",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.HK"
      },
      {
        "moveId": "61797d46-a331-4638-ba60-3dc3ea0cfd16",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.H"
      }
    ]
  },
  {
    "id": "ac58d193-6639-4fe4-921c-fb69f7a85908",
    "slug": "jp-triglav-l",
    "name": "弱 トリグラフ / Triglav",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "22",
      "onBlock": "-2",
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "ac58d193-6639-4fe4-921c-fb69f7a85908",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↓ + 弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22LP"
      },
      {
        "moveId": "ac58d193-6639-4fe4-921c-fb69f7a85908",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↓ + 弱攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22L"
      }
    ]
  },
  {
    "id": "7e400c75-ee2f-491c-a063-c70d1c73d5ff",
    "slug": "jp-triglav-m",
    "name": "中 トリグラフ / Triglav",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "22",
      "onBlock": "-2",
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "7e400c75-ee2f-491c-a063-c70d1c73d5ff",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↓ + 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22MP"
      },
      {
        "moveId": "7e400c75-ee2f-491c-a063-c70d1c73d5ff",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + 必殺技",
        "conditionText": "モダン簡易入力。手動入力は↓↓+中攻撃",
        "buttonNotation": null,
        "numericNotation": "2SP"
      }
    ]
  },
  {
    "id": "c6bcbf1d-e8ea-40f3-ae9e-c341ececf18d",
    "slug": "jp-triglav-h",
    "name": "強 トリグラフ / Triglav",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "22",
      "onBlock": "-2",
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "c6bcbf1d-e8ea-40f3-ae9e-c341ececf18d",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↓ + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22HP"
      },
      {
        "moveId": "c6bcbf1d-e8ea-40f3-ae9e-c341ececf18d",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↓ + 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22H"
      }
    ]
  },
  {
    "id": "c31fe91a-5449-49c7-b264-97dccae0908f",
    "slug": "jp-triglav-od-l",
    "name": "OD 弱 トリグラフ / Triglav",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "20",
      "onBlock": "+3",
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "c31fe91a-5449-49c7-b264-97dccae0908f",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↓ + 弱P+中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22LPMP"
      },
      {
        "moveId": "c31fe91a-5449-49c7-b264-97dccae0908f",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↙ + アシスト + 必殺技",
        "conditionText": "手動入力は↓↓+弱攻撃+中攻撃",
        "buttonNotation": null,
        "numericNotation": "1A+SP"
      }
    ]
  },
  {
    "id": "14090a4d-132e-4d55-8d8d-4669444dba8f",
    "slug": "jp-triglav-od-m",
    "name": "OD 中 トリグラフ / Triglav",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "20",
      "onBlock": "+3",
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "14090a4d-132e-4d55-8d8d-4669444dba8f",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↓ + 弱P+強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22LPHP"
      },
      {
        "moveId": "14090a4d-132e-4d55-8d8d-4669444dba8f",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + アシスト + 必殺技",
        "conditionText": "手動入力は↓↓+弱攻撃+強攻撃",
        "buttonNotation": null,
        "numericNotation": "2A+SP"
      }
    ]
  },
  {
    "id": "6f77b24f-8671-4370-bd3a-f8e0e7c7028e",
    "slug": "jp-triglav-od-h",
    "name": "OD 強 トリグラフ / Triglav",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "20",
      "onBlock": "+3",
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "6f77b24f-8671-4370-bd3a-f8e0e7c7028e",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↓ + 中P+強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22MPHP"
      },
      {
        "moveId": "6f77b24f-8671-4370-bd3a-f8e0e7c7028e",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↘ + アシスト + 必殺技",
        "conditionText": "手動入力は↓↓+中攻撃+強攻撃",
        "buttonNotation": null,
        "numericNotation": "3A+SP"
      }
    ]
  },
  {
    "id": "34287e66-c123-4cba-8c97-7bb0bd5a90b6",
    "slug": "jp-stribog-l",
    "name": "弱 ストリボーグ / Stribog",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "16",
      "onBlock": "-10",
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "34287e66-c123-4cba-8c97-7bb0bd5a90b6",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236LP"
      },
      {
        "moveId": "34287e66-c123-4cba-8c97-7bb0bd5a90b6",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "必殺技",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "SP"
      }
    ]
  },
  {
    "id": "acef0697-16a0-49eb-b289-4df09a1843e7",
    "slug": "jp-stribog-m",
    "name": "中 ストリボーグ / Stribog",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "20",
      "onBlock": "-8",
      "damage": 1200,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "acef0697-16a0-49eb-b289-4df09a1843e7",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236MP"
      }
    ]
  },
  {
    "id": "43f19305-48cc-4928-b355-b07daf382c00",
    "slug": "jp-stribog-h",
    "name": "強 ストリボーグ / Stribog",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "28",
      "onBlock": "+4",
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "43f19305-48cc-4928-b355-b07daf382c00",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236HP"
      }
    ]
  },
  {
    "id": "b8329b05-de0d-46dd-8688-e44231540c80",
    "slug": "jp-stribog-od",
    "name": "OD ストリボーグ / Stribog",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "19",
      "onBlock": "+2",
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "b8329b05-de0d-46dd-8688-e44231540c80",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + PP",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236PP"
      },
      {
        "moveId": "b8329b05-de0d-46dd-8688-e44231540c80",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "アシスト + 必殺技",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "A+SP"
      }
    ]
  },
  {
    "id": "f0766896-f8e9-45eb-a769-0762d98a2714",
    "slug": "jp-departure-l",
    "name": "弱 ヴィーハト / Departure",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "150",
      "onBlock": null,
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "f0766896-f8e9-45eb-a769-0762d98a2714",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214LP"
      },
      {
        "moveId": "f0766896-f8e9-45eb-a769-0762d98a2714",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 弱攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214L"
      }
    ]
  },
  {
    "id": "732536be-f8e8-4701-9871-991075ed5c8a",
    "slug": "jp-departure-m",
    "name": "中 ヴィーハト / Departure",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "150",
      "onBlock": null,
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "732536be-f8e8-4701-9871-991075ed5c8a",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214MP"
      },
      {
        "moveId": "732536be-f8e8-4701-9871-991075ed5c8a",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214M"
      }
    ]
  },
  {
    "id": "50c13c49-015c-423a-880e-9c4663ad34d9",
    "slug": "jp-departure-h",
    "name": "強 ヴィーハト / Departure",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "150",
      "onBlock": null,
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "50c13c49-015c-423a-880e-9c4663ad34d9",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214HP"
      },
      {
        "moveId": "50c13c49-015c-423a-880e-9c4663ad34d9",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214H"
      }
    ]
  },
  {
    "id": "9ec80073-a3d7-4d24-9437-8a21dc112c68",
    "slug": "jp-departure-od-l",
    "name": "OD 弱 ヴィーハト / Departure",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "110",
      "onBlock": null,
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "9ec80073-a3d7-4d24-9437-8a21dc112c68",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 弱P+中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214LPMP"
      },
      {
        "moveId": "9ec80073-a3d7-4d24-9437-8a21dc112c68",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 弱攻撃+中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214L+M"
      }
    ]
  },
  {
    "id": "40e948eb-d634-4dc8-8b3a-43aef82df522",
    "slug": "jp-departure-od-m",
    "name": "OD 中 ヴィーハト / Departure",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "110",
      "onBlock": null,
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "40e948eb-d634-4dc8-8b3a-43aef82df522",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 弱P+強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214LPHP"
      },
      {
        "moveId": "40e948eb-d634-4dc8-8b3a-43aef82df522",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 弱攻撃+強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214L+H"
      }
    ]
  },
  {
    "id": "c9f1220a-5353-4da4-803e-02b71563cf85",
    "slug": "jp-departure-od-h",
    "name": "OD 強 ヴィーハト / Departure",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "110",
      "onBlock": null,
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "c9f1220a-5353-4da4-803e-02b71563cf85",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 中P+強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214MPHP"
      },
      {
        "moveId": "c9f1220a-5353-4da4-803e-02b71563cf85",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 中攻撃+強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214M+H"
      }
    ]
  },
  {
    "id": "6fbfed6b-7805-4277-b216-60503d4cee88",
    "slug": "jp-departure-window",
    "name": "ヴィーハト・アクノ / Departure > Window",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "44",
      "onBlock": "0",
      "damage": null,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "6fbfed6b-7805-4277-b216-60503d4cee88",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "ヴィーハト後 ↓↙← + 弱P/中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214P>214LP/MP"
      },
      {
        "moveId": "6fbfed6b-7805-4277-b216-60503d4cee88",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "ヴィーハト設置中に ↓↙← + 弱攻撃 または 中攻撃",
        "conditionText": "ヴィーハト設置中",
        "buttonNotation": null,
        "numericNotation": "214L/M"
      }
    ]
  },
  {
    "id": "a6b9d663-b9b3-494b-8d43-7aed196be8f4",
    "slug": "jp-departure-shadow",
    "name": "ヴィーハト・チェーニ / Departure > Shadow",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": null,
      "onBlock": null,
      "damage": 0,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "a6b9d663-b9b3-494b-8d43-7aed196be8f4",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "ヴィーハト後 ↓↙← + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214P>214HP"
      },
      {
        "moveId": "a6b9d663-b9b3-494b-8d43-7aed196be8f4",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "ヴィーハト設置中に ↓↙← + 強攻撃",
        "conditionText": "ヴィーハト設置中",
        "buttonNotation": null,
        "numericNotation": "214H"
      }
    ]
  },
  {
    "id": "51680ee1-db0b-4906-80da-93ba82dde6f1",
    "slug": "jp-amnesia",
    "name": "アムネジア / Amnesia",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "3",
      "onBlock": null,
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "51680ee1-db0b-4906-80da-93ba82dde6f1",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ ↓ + K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22K"
      },
      {
        "moveId": "51680ee1-db0b-4906-80da-93ba82dde6f1",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "→ + 必殺技",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "6SP"
      }
    ]
  },
  {
    "id": "f262b667-3ec4-4b75-a7f1-df1748df2ba3",
    "slug": "jp-amnesia-od",
    "name": "OD アムネジア / Amnesia",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "1",
      "onBlock": null,
      "damage": 1200,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "f262b667-3ec4-4b75-a7f1-df1748df2ba3",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ ↓ + KK",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22KK"
      },
      {
        "moveId": "f262b667-3ec4-4b75-a7f1-df1748df2ba3",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "→ + アシスト + 必殺技",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "6A+SP"
      }
    ]
  },
  {
    "id": "06f4575b-6654-459f-bf7b-2357dcf71478",
    "slug": "jp-torbalan-l",
    "name": "弱 トルバラン / Torbalan",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "22",
      "onBlock": "-6",
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "06f4575b-6654-459f-bf7b-2357dcf71478",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236LK"
      },
      {
        "moveId": "06f4575b-6654-459f-bf7b-2357dcf71478",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↘→ + 弱攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236L"
      }
    ]
  },
  {
    "id": "0b13852f-0f76-4787-b794-1ef8257fa5fe",
    "slug": "jp-torbalan-m",
    "name": "中 トルバラン / Torbalan",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "26",
      "onBlock": "-8",
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "0b13852f-0f76-4787-b794-1ef8257fa5fe",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 中K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236MK"
      },
      {
        "moveId": "0b13852f-0f76-4787-b794-1ef8257fa5fe",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↘→ + 中攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236M"
      }
    ]
  },
  {
    "id": "cd0255a1-bf6f-4b92-ad4e-1b2d5905983c",
    "slug": "jp-torbalan-h",
    "name": "強 トルバラン / Torbalan",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "26",
      "onBlock": "-8",
      "damage": 1000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "cd0255a1-bf6f-4b92-ad4e-1b2d5905983c",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236HK"
      },
      {
        "moveId": "cd0255a1-bf6f-4b92-ad4e-1b2d5905983c",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↘→ + 強攻撃",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236H"
      }
    ]
  },
  {
    "id": "852ac443-78e0-4c00-a43e-5196d33aba36",
    "slug": "jp-torbalan-od",
    "name": "OD トルバラン / Torbalan",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "22",
      "onBlock": "+25",
      "damage": 800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "852ac443-78e0-4c00-a43e-5196d33aba36",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + KK",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236KK"
      },
      {
        "moveId": "852ac443-78e0-4c00-a43e-5196d33aba36",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↘→ + 攻撃ボタン2つ",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236XX"
      }
    ]
  },
  {
    "id": "a7bb98cd-731c-485c-ab95-78de6cf5448e",
    "slug": "jp-embrace",
    "name": "エンブレイス / Embrace",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "26",
      "onBlock": null,
      "damage": 1800,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "a7bb98cd-731c-485c-ab95-78de6cf5448e",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214K"
      },
      {
        "moveId": "a7bb98cd-731c-485c-ab95-78de6cf5448e",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "← + 必殺技",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "4SP"
      }
    ]
  },
  {
    "id": "e87c51f7-a2e9-44b1-8061-d823351b42d5",
    "slug": "jp-embrace-od",
    "name": "OD エンブレイス / Embrace",
    "moveType": "special",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "26",
      "onBlock": null,
      "damage": 2600,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "e87c51f7-a2e9-44b1-8061-d823351b42d5",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + KK",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214KK"
      },
      {
        "moveId": "e87c51f7-a2e9-44b1-8061-d823351b42d5",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "← + アシスト + 必殺技",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "4A+SP"
      }
    ]
  },
  {
    "id": "7817f9e6-8542-4da1-be01-c6bd24294f22",
    "slug": "jp-sa1",
    "name": "チェルノボーグ / Chornobog（SA1）",
    "moveType": "super",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "8",
      "onBlock": "-33",
      "damage": 2000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "7817f9e6-8542-4da1-be01-c6bd24294f22",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ ↓↘→ + P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236236P"
      },
      {
        "moveId": "7817f9e6-8542-4da1-be01-c6bd24294f22",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "必殺技 + 強攻撃",
        "conditionText": "SA1。→+SP+Hでも可",
        "buttonNotation": null,
        "numericNotation": "SP+H"
      }
    ]
  },
  {
    "id": "85762bb5-b5ae-4a88-b4ee-55112037774e",
    "slug": "jp-sa2",
    "name": "ラヴーシュカ / Lovushka（SA2）",
    "moveType": "super",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "29",
      "onBlock": "**",
      "damage": 2000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "85762bb5-b5ae-4a88-b4ee-55112037774e",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← ↓↙← + P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214214P"
      },
      {
        "moveId": "85762bb5-b5ae-4a88-b4ee-55112037774e",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "← + 必殺技 + 強攻撃",
        "conditionText": "SA2",
        "buttonNotation": null,
        "numericNotation": "4SP+H"
      }
    ]
  },
  {
    "id": "1845d4b9-4bac-4e4e-b6fd-3b57accfa973",
    "slug": "jp-sa3",
    "name": "ザプリェット / Interdiction（SA3）",
    "moveType": "super",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "18",
      "onBlock": "-50",
      "damage": 4000,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "1845d4b9-4bac-4e4e-b6fd-3b57accfa973",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ ↓↘→ + K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236236K"
      },
      {
        "moveId": "1845d4b9-4bac-4e4e-b6fd-3b57accfa973",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + 必殺技 + 強攻撃",
        "conditionText": "SA3",
        "buttonNotation": null,
        "numericNotation": "2SP+H"
      }
    ]
  },
  {
    "id": "2472fe66-f312-4a5d-9c7c-25e0fa2515d7",
    "slug": "jp-ca",
    "name": "ザプリェット / Interdiction（CA）",
    "moveType": "super",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "18",
      "onBlock": "-50",
      "damage": 4500,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "2472fe66-f312-4a5d-9c7c-25e0fa2515d7",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ ↓↘→ + K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236236K"
      },
      {
        "moveId": "2472fe66-f312-4a5d-9c7c-25e0fa2515d7",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + 必殺技 + 強攻撃",
        "conditionText": "体力25%以下でCA",
        "buttonNotation": null,
        "numericNotation": "2SP+H"
      }
    ]
  },
  {
    "id": "94a12a74-68c3-41d2-9fb5-7684451741b5",
    "slug": "jp-forward-throw",
    "name": "前投げ",
    "moveType": "throw",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "5",
      "onBlock": null,
      "damage": 1200,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "94a12a74-68c3-41d2-9fb5-7684451741b5",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "近距離で →/N + 弱P+弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": null
      },
      {
        "moveId": "94a12a74-68c3-41d2-9fb5-7684451741b5",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "弱攻撃 + 中攻撃",
        "conditionText": "近距離",
        "buttonNotation": null,
        "numericNotation": "L+M"
      }
    ]
  },
  {
    "id": "a63b4bd9-535b-4893-a55e-42d105ad9f8b",
    "slug": "jp-back-throw",
    "name": "後ろ投げ",
    "moveType": "throw",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "5",
      "onBlock": null,
      "damage": 1200,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "a63b4bd9-535b-4893-a55e-42d105ad9f8b",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "近距離で ← + 弱P+弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": null
      },
      {
        "moveId": "a63b4bd9-535b-4893-a55e-42d105ad9f8b",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "← + 弱攻撃 + 中攻撃",
        "conditionText": "近距離",
        "buttonNotation": null,
        "numericNotation": "4L+M"
      }
    ]
  },
  {
    "id": "8fdddc58-2331-4ceb-baec-cd8289c30bb5",
    "slug": "jp-tornado",
    "name": "トルネード / Tornado",
    "moveType": "throw",
    "usageSummary": null,
    "status": "draft",
    "frame": {
      "startup": "5",
      "onBlock": null,
      "damage": 1200,
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "8fdddc58-2331-4ceb-baec-cd8289c30bb5",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "空中・近距離で 弱P+弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.LP+LK"
      },
      {
        "moveId": "8fdddc58-2331-4ceb-baec-cd8289c30bb5",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で 弱攻撃 + 中攻撃",
        "conditionText": "空中・近距離",
        "buttonNotation": null,
        "numericNotation": "j.L+M"
      }
    ]
  }
];
