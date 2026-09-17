import type { DevicePreviewBundle } from "@/lib/device-preview";

// Preview-only snapshot generated from the Fresh Ryu DB review on 2026-09-17.
// It is used only when the protected Preview RPC is unavailable; it never changes publication status.
export const ryuMoveReviewFixture: DevicePreviewBundle["moves"] = [
  {
    "id": "ad5f57f5-f156-4d20-8f0a-f4da4772831d",
    "slug": "ryu-standing-lp",
    "name": "立ち弱P（ジャブ）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "立った状態から出す通常技です。相手との距離や技の発生を見ながら、けん制やコンボの始動に使います。",
    "usageSummaryJa": "発生が早く、近距離の割り込みやコンボの始動に向いています。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。",
    "status": "draft",
    "frame": {
      "damage": 300,
      "onBlock": "-1",
      "startup": "4",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "ad5f57f5-f156-4d20-8f0a-f4da4772831d",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5LP"
      },
      {
        "moveId": "ad5f57f5-f156-4d20-8f0a-f4da4772831d",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "弱攻撃",
        "conditionText": null,
        "buttonNotation": "L",
        "numericNotation": "L"
      }
    ]
  },
  {
    "id": "631c8d80-2000-4756-be30-bb1ffbe52060",
    "slug": "ryu-standing-lk",
    "name": "立ち弱K（ローキック）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "立った状態から出す通常技です。相手との距離や技の発生を見ながら、けん制やコンボの始動に使います。",
    "usageSummaryJa": "けん制、差し返し、コンボの始動など、間合いに合わせて使います。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。",
    "status": "draft",
    "frame": {
      "damage": 300,
      "onBlock": "-4",
      "startup": "5",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "631c8d80-2000-4756-be30-bb1ffbe52060",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5LK"
      },
      {
        "moveId": "631c8d80-2000-4756-be30-bb1ffbe52060",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "アシスト + 弱攻撃",
        "conditionText": null,
        "buttonNotation": "A+L",
        "numericNotation": "A+L"
      }
    ]
  },
  {
    "id": "b33dd19c-add5-4420-8856-163fab932249",
    "slug": "ryu-standing-mp",
    "name": "立ち中P（鉤突き）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "立った状態から出す通常技です。相手との距離や技の発生を見ながら、けん制やコンボの始動に使います。",
    "usageSummaryJa": "けん制、差し返し、コンボの始動など、間合いに合わせて使います。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。",
    "status": "draft",
    "frame": {
      "damage": 600,
      "onBlock": "-1",
      "startup": "6",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "b33dd19c-add5-4420-8856-163fab932249",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5MP"
      },
      {
        "moveId": "b33dd19c-add5-4420-8856-163fab932249",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "中攻撃",
        "conditionText": null,
        "buttonNotation": "M",
        "numericNotation": "M"
      }
    ]
  },
  {
    "id": "7ac63edd-7d49-4a1a-9a2f-09ad04dc7d0d",
    "slug": "ryu-standing-mk",
    "name": "立ち中K（横蹴り）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "立った状態から出す通常技です。相手との距離や技の発生を見ながら、けん制やコンボの始動に使います。",
    "usageSummaryJa": "けん制、差し返し、コンボの始動など、間合いに合わせて使います。",
    "status": "draft",
    "frame": {
      "damage": 700,
      "onBlock": "-4",
      "startup": "9",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "7ac63edd-7d49-4a1a-9a2f-09ad04dc7d0d",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "中K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5MK"
      }
    ]
  },
  {
    "id": "2ca379aa-216c-4bae-829d-50b8c273b7d7",
    "slug": "ryu-standing-hp",
    "name": "立ち強P（正拳突き）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "立った状態から出す通常技です。相手との距離や技の発生を見ながら、けん制やコンボの始動に使います。",
    "usageSummaryJa": "けん制、差し返し、コンボの始動など、間合いに合わせて使います。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "-2",
      "startup": "10",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "2ca379aa-216c-4bae-829d-50b8c273b7d7",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5HP"
      },
      {
        "moveId": "2ca379aa-216c-4bae-829d-50b8c273b7d7",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "強攻撃",
        "conditionText": null,
        "buttonNotation": "H",
        "numericNotation": "H"
      }
    ]
  },
  {
    "id": "b2362378-1411-45ae-a0f0-014e898042e0",
    "slug": "ryu-standing-hk",
    "name": "立ち強K（後ろ回し蹴り）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "立った状態から出す通常技です。相手との距離や技の発生を見ながら、けん制やコンボの始動に使います。",
    "usageSummaryJa": "けん制、差し返し、コンボの始動など、間合いに合わせて使います。ガードされても先に動けるため、その後も攻めを続けやすい技です。",
    "status": "draft",
    "frame": {
      "damage": 900,
      "onBlock": "+1",
      "startup": "12",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "b2362378-1411-45ae-a0f0-014e898042e0",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "5HK"
      }
    ]
  },
  {
    "id": "b52d8627-51e8-46f2-84b9-021d41d34c9c",
    "slug": "ryu-crouching-lp",
    "name": "しゃがみ弱P（ジャブ）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "しゃがんだ状態から出す通常技です。間合いや発生、キャンセルの可否を見ながら使い分けます。",
    "usageSummaryJa": "発生が早く、近距離の割り込みやコンボの始動に向いています。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。",
    "status": "draft",
    "frame": {
      "damage": 300,
      "onBlock": "-1",
      "startup": "4",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "b52d8627-51e8-46f2-84b9-021d41d34c9c",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2LP"
      }
    ]
  },
  {
    "id": "e12c05a0-4a5f-43fd-84a1-c258ca99f18f",
    "slug": "ryu-crouching-lk",
    "name": "しゃがみ弱K（キック）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "しゃがんだ状態から出す通常技です。間合いや発生、キャンセルの可否を見ながら使い分けます。",
    "usageSummaryJa": "近距離で下段を意識させたいときに使います。",
    "status": "draft",
    "frame": {
      "damage": 200,
      "onBlock": "-1",
      "startup": "5",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "e12c05a0-4a5f-43fd-84a1-c258ca99f18f",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2LK"
      },
      {
        "moveId": "e12c05a0-4a5f-43fd-84a1-c258ca99f18f",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + 弱攻撃",
        "conditionText": null,
        "buttonNotation": "2L",
        "numericNotation": "2L"
      }
    ]
  },
  {
    "id": "e1ab790a-51d5-4461-b496-6fdc8f50a703",
    "slug": "ryu-crouching-mp",
    "name": "しゃがみ中P（ストレート）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "しゃがんだ状態から出す通常技です。間合いや発生、キャンセルの可否を見ながら使い分けます。",
    "usageSummaryJa": "けん制、差し返し、コンボの始動など、間合いに合わせて使います。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。",
    "status": "draft",
    "frame": {
      "damage": 600,
      "onBlock": "0",
      "startup": "6",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "e1ab790a-51d5-4461-b496-6fdc8f50a703",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2MP"
      },
      {
        "moveId": "e1ab790a-51d5-4461-b496-6fdc8f50a703",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "アシスト + 中攻撃",
        "conditionText": null,
        "buttonNotation": "A+M",
        "numericNotation": "A+M"
      }
    ]
  },
  {
    "id": "46093af4-c66f-4941-94a6-939a0730f7d5",
    "slug": "ryu-crouching-mk",
    "name": "しゃがみ中K（くるぶしキック）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "しゃがんだ状態から出す通常技です。間合いや発生、キャンセルの可否を見ながら使い分けます。",
    "usageSummaryJa": "けん制、差し返し、コンボの始動など、間合いに合わせて使います。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。",
    "status": "draft",
    "frame": {
      "damage": 500,
      "onBlock": "-6",
      "startup": "8",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "46093af4-c66f-4941-94a6-939a0730f7d5",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 中K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2MK"
      },
      {
        "moveId": "46093af4-c66f-4941-94a6-939a0730f7d5",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + 中攻撃",
        "conditionText": null,
        "buttonNotation": "2M",
        "numericNotation": "2M"
      }
    ]
  },
  {
    "id": "477ec830-0cbf-4400-950a-d6fce904306a",
    "slug": "ryu-crouching-hp",
    "name": "しゃがみ強P（突き上げアッパー）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "しゃがんだ状態から出す通常技です。間合いや発生、キャンセルの可否を見ながら使い分けます。",
    "usageSummaryJa": "けん制、差し返し、コンボの始動など、間合いに合わせて使います。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "-7",
      "startup": "9",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "477ec830-0cbf-4400-950a-d6fce904306a",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2HP"
      },
      {
        "moveId": "477ec830-0cbf-4400-950a-d6fce904306a",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + 強攻撃",
        "conditionText": null,
        "buttonNotation": "2H",
        "numericNotation": "2H"
      }
    ]
  },
  {
    "id": "06cb478c-ed44-47f7-99ec-1a2dbe45e8b5",
    "slug": "ryu-crouching-hk",
    "name": "しゃがみ強K（回転足払い）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "しゃがんだ状態から出す通常技です。間合いや発生、キャンセルの可否を見ながら使い分けます。",
    "usageSummaryJa": "相手の立ちガードを崩し、ダウンを取るときに使います。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 900,
      "onBlock": "-12",
      "startup": "9",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "06cb478c-ed44-47f7-99ec-1a2dbe45e8b5",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓ + 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "2HK"
      },
      {
        "moveId": "06cb478c-ed44-47f7-99ec-1a2dbe45e8b5",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↘ + 強攻撃",
        "conditionText": null,
        "buttonNotation": "3H",
        "numericNotation": "3H"
      }
    ]
  },
  {
    "id": "034b09a8-7a59-4aff-a35d-90a022094914",
    "slug": "ryu-jump-lp",
    "name": "ジャンプ弱P（肘落とし）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "ジャンプ中に出す通常技です。空中から攻めるときや、空中の相手を迎え撃つときに使います。",
    "usageSummaryJa": "飛び込みや空対空で使います。",
    "status": "draft",
    "frame": {
      "damage": 300,
      "onBlock": null,
      "startup": "4",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "034b09a8-7a59-4aff-a35d-90a022094914",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.LP"
      },
      {
        "moveId": "034b09a8-7a59-4aff-a35d-90a022094914",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で 弱攻撃",
        "conditionText": null,
        "buttonNotation": "j.L",
        "numericNotation": "j.L"
      }
    ]
  },
  {
    "id": "199c77e5-2064-4090-8f9b-4226af92a68d",
    "slug": "ryu-jump-lk",
    "name": "ジャンプ弱K（ひざ蹴り）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "ジャンプ中に出す通常技です。空中から攻めるときや、空中の相手を迎え撃つときに使います。",
    "usageSummaryJa": "飛び込みや空対空で使います。",
    "status": "draft",
    "frame": {
      "damage": 300,
      "onBlock": null,
      "startup": "6",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "199c77e5-2064-4090-8f9b-4226af92a68d",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.LK"
      },
      {
        "moveId": "199c77e5-2064-4090-8f9b-4226af92a68d",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で アシスト + 弱攻撃",
        "conditionText": null,
        "buttonNotation": "j.A+L",
        "numericNotation": "j.A+L"
      }
    ]
  },
  {
    "id": "389b1337-3b9b-4ea6-9d90-14383797c6b4",
    "slug": "ryu-jump-mp",
    "name": "ジャンプ中P（すくい突き）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "ジャンプ中に出す通常技です。空中から攻めるときや、空中の相手を迎え撃つときに使います。",
    "usageSummaryJa": "飛び込みや空対空で使います。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。",
    "status": "draft",
    "frame": {
      "damage": 700,
      "onBlock": null,
      "startup": "8",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "389b1337-3b9b-4ea6-9d90-14383797c6b4",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.MP"
      },
      {
        "moveId": "389b1337-3b9b-4ea6-9d90-14383797c6b4",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で 中攻撃",
        "conditionText": null,
        "buttonNotation": "j.M",
        "numericNotation": "j.M"
      }
    ]
  },
  {
    "id": "51da4eb2-83d2-4afe-981d-cdcd52582424",
    "slug": "ryu-jump-mk",
    "name": "ジャンプ中K（飛び蹴り）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "ジャンプ中に出す通常技です。空中から攻めるときや、空中の相手を迎え撃つときに使います。",
    "usageSummaryJa": "飛び込みや空対空で使います。",
    "status": "draft",
    "frame": {
      "damage": 500,
      "onBlock": null,
      "startup": "7",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "51da4eb2-83d2-4afe-981d-cdcd52582424",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）中K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.MK"
      },
      {
        "moveId": "51da4eb2-83d2-4afe-981d-cdcd52582424",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で アシスト + 中攻撃",
        "conditionText": null,
        "buttonNotation": "j.A+M",
        "numericNotation": "j.A+M"
      }
    ]
  },
  {
    "id": "ec64fb71-06c8-4603-9aa5-b74f40f2df06",
    "slug": "ryu-jump-hp",
    "name": "ジャンプ強P（ストレート）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "ジャンプ中に出す通常技です。空中から攻めるときや、空中の相手を迎え撃つときに使います。",
    "usageSummaryJa": "飛び込みや空対空で使います。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": null,
      "startup": "9",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "ec64fb71-06c8-4603-9aa5-b74f40f2df06",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.HP"
      },
      {
        "moveId": "ec64fb71-06c8-4603-9aa5-b74f40f2df06",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で アシスト + 強攻撃",
        "conditionText": null,
        "buttonNotation": "j.A+H",
        "numericNotation": "j.A+H"
      }
    ]
  },
  {
    "id": "f0b5f99f-692a-4706-8f68-40bb4e4f0015",
    "slug": "ryu-jump-hk",
    "name": "ジャンプ強K（跳び前蹴り）",
    "moveType": "normal",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "ジャンプ中に出す通常技です。空中から攻めるときや、空中の相手を迎え撃つときに使います。",
    "usageSummaryJa": "飛び込みや空対空で使います。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": null,
      "startup": "10",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "f0b5f99f-692a-4706-8f68-40bb4e4f0015",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（ジャンプ中に）強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.HK"
      },
      {
        "moveId": "f0b5f99f-692a-4706-8f68-40bb4e4f0015",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "空中で 強攻撃",
        "conditionText": null,
        "buttonNotation": "j.H",
        "numericNotation": "j.H"
      }
    ]
  },
  {
    "id": "1bc5bdf1-5471-4f09-ab27-093482bf5954",
    "slug": "ryu-collarbone-breaker",
    "name": "鎖骨割り",
    "moveType": "unique",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "方向入力と攻撃ボタンを組み合わせて出す特殊技です。通常技とは異なる間合いや攻撃判定を持ちます。",
    "usageSummaryJa": "通常技とは違う間合いや攻撃判定を生かして、相手の動きを崩すときに使います。",
    "status": "draft",
    "frame": {
      "damage": 600,
      "onBlock": "-3",
      "startup": "20",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "1bc5bdf1-5471-4f09-ab27-093482bf5954",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "→ + 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "6MP"
      },
      {
        "moveId": "1bc5bdf1-5471-4f09-ab27-093482bf5954",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "→ + 中攻撃",
        "conditionText": null,
        "buttonNotation": "6M",
        "numericNotation": "6M"
      }
    ]
  },
  {
    "id": "e0df5bcc-6bf7-4f08-9d8d-311ea95ed89f",
    "slug": "ryu-solar-plexus-strike",
    "name": "鳩尾砕き",
    "moveType": "unique",
    "usageSummary": "Awaiting official/game verification before publication.",
    "descriptionJa": "方向入力と攻撃ボタンを組み合わせて出す特殊技です。通常技とは異なる間合いや攻撃判定を持ちます。",
    "usageSummaryJa": "通常技とは違う間合いや攻撃判定を生かして、相手の動きを崩すときに使います。ガードされても先に動けるため、その後も攻めを続けやすい技です。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "+3",
      "startup": "20",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "e0df5bcc-6bf7-4f08-9d8d-311ea95ed89f",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "→ + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "6HP"
      },
      {
        "moveId": "e0df5bcc-6bf7-4f08-9d8d-311ea95ed89f",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "アシスト + 強攻撃",
        "conditionText": null,
        "buttonNotation": "A+H",
        "numericNotation": "A+H"
      }
    ]
  },
  {
    "id": "01f701c5-e0b5-402d-94b3-d8166c686370",
    "slug": "ryu-back-hp",
    "name": "後ろ強P（Short Uppercut）",
    "moveType": "unique",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "方向入力と攻撃ボタンを組み合わせて出す特殊技です。通常技とは異なる間合いや攻撃判定を持ちます。",
    "usageSummaryJa": "通常技とは違う間合いや攻撃判定を生かして、相手の動きを崩すときに使います。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "-13",
      "startup": "7",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "01f701c5-e0b5-402d-94b3-d8166c686370",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "← + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "4HP"
      }
    ]
  },
  {
    "id": "3ecf9a07-5539-4a4a-81fd-ab90b9fc3b61",
    "slug": "ryu-back-hk",
    "name": "後ろ強K（Axe Kick）",
    "moveType": "unique",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "方向入力と攻撃ボタンを組み合わせて出す特殊技です。通常技とは異なる間合いや攻撃判定を持ちます。",
    "usageSummaryJa": "通常技とは違う間合いや攻撃判定を生かして、相手の動きを崩すときに使います。ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "-4",
      "startup": "10",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "3ecf9a07-5539-4a4a-81fd-ab90b9fc3b61",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "← + 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "4HK"
      },
      {
        "moveId": "3ecf9a07-5539-4a4a-81fd-ab90b9fc3b61",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "← + 強攻撃",
        "conditionText": null,
        "buttonNotation": "4H",
        "numericNotation": "4H"
      }
    ]
  },
  {
    "id": "7be699d6-7021-450a-823f-235eb9513561",
    "slug": "ryu-forward-hk",
    "name": "前強K（Whirlwind Kick）",
    "moveType": "unique",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "方向入力と攻撃ボタンを組み合わせて出す特殊技です。通常技とは異なる間合いや攻撃判定を持ちます。",
    "usageSummaryJa": "通常技とは違う間合いや攻撃判定を生かして、相手の動きを崩すときに使います。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "-4",
      "startup": "16",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "7be699d6-7021-450a-823f-235eb9513561",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "→ + 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "6HK"
      },
      {
        "moveId": "7be699d6-7021-450a-823f-235eb9513561",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "→ + 強攻撃",
        "conditionText": null,
        "buttonNotation": "6H",
        "numericNotation": "6H"
      }
    ]
  },
  {
    "id": "3c25e9b9-0031-42b4-a9ef-c68ca1907f9c",
    "slug": "ryu-target-hp-hk",
    "name": "強P→強K ターゲットコンボ",
    "moveType": "target_combo",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "決められた順番で通常技を入力して出す連続技です。ヒット確認やコンボのつなぎとして使います。",
    "usageSummaryJa": "最初の攻撃が当たったことを確認してから出し切ると、反撃を受ける危険を抑えられます。",
    "status": "draft",
    "frame": {
      "damage": 1800,
      "onBlock": "-2,-8",
      "startup": "10,9",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "3c25e9b9-0031-42b4-a9ef-c68ca1907f9c",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "強P → 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "HP~HK"
      },
      {
        "moveId": "3c25e9b9-0031-42b4-a9ef-c68ca1907f9c",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "強攻撃 > 強攻撃",
        "conditionText": null,
        "buttonNotation": "H~H",
        "numericNotation": "H~H"
      }
    ]
  },
  {
    "id": "3605c1b6-1f6b-42a3-981d-6ce606d760b4",
    "slug": "ryu-fuwa-triple-strike",
    "name": "中P→弱K→強K（Fuwa Triple Strike）",
    "moveType": "target_combo",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "決められた順番で通常技を入力して出す連続技です。ヒット確認やコンボのつなぎとして使います。",
    "usageSummaryJa": "最初の攻撃が当たったことを確認してから出し切ると、反撃を受ける危険を抑えられます。",
    "status": "draft",
    "frame": {
      "damage": 1800,
      "onBlock": "-1,-4,-8",
      "startup": "6,5,17",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "3605c1b6-1f6b-42a3-981d-6ce606d760b4",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "中P → 弱K → 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "MP~LK~HK"
      },
      {
        "moveId": "3605c1b6-1f6b-42a3-981d-6ce606d760b4",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "中攻撃 > 中攻撃 > 中攻撃",
        "conditionText": null,
        "buttonNotation": "M~M~M",
        "numericNotation": "M~M~M"
      }
    ]
  },
  {
    "id": "f1ca42ab-4cd4-414c-9b06-b70f5a3e8b43",
    "slug": "ryu-l-hadoken",
    "name": "弱 波動拳",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。",
    "status": "draft",
    "frame": {
      "damage": 700,
      "onBlock": "-5",
      "startup": "16",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "f1ca42ab-4cd4-414c-9b06-b70f5a3e8b43",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236LP"
      },
      {
        "moveId": "f1ca42ab-4cd4-414c-9b06-b70f5a3e8b43",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↘→ + 弱攻撃",
        "conditionText": null,
        "buttonNotation": "236L",
        "numericNotation": "236L"
      }
    ]
  },
  {
    "id": "99caf881-5986-41a8-bb7f-9282a7409cad",
    "slug": "ryu-m-hadoken",
    "name": "中 波動拳",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 700,
      "onBlock": "-7",
      "startup": "14",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "99caf881-5986-41a8-bb7f-9282a7409cad",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236MP"
      },
      {
        "moveId": "99caf881-5986-41a8-bb7f-9282a7409cad",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↘→ + 中攻撃",
        "conditionText": null,
        "buttonNotation": "236M",
        "numericNotation": "236M"
      }
    ]
  },
  {
    "id": "3922bb25-41b4-4ce9-bfb2-e0678d0a5c8e",
    "slug": "ryu-h-hadoken",
    "name": "強 波動拳",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 700,
      "onBlock": "-9",
      "startup": "12",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "3922bb25-41b4-4ce9-bfb2-e0678d0a5c8e",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236HP"
      },
      {
        "moveId": "3922bb25-41b4-4ce9-bfb2-e0678d0a5c8e",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "SP または ↓↘→ + 強攻撃",
        "conditionText": null,
        "buttonNotation": "SP / H",
        "numericNotation": "SP / 236H"
      }
    ]
  },
  {
    "id": "e1307e32-ef9f-4b5e-8a9f-b64863bf9303",
    "slug": "ryu-denjin-hadoken",
    "name": "[電刃錬気] 波動拳",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。",
    "status": "draft",
    "frame": {
      "damage": 1000,
      "onBlock": "-1",
      "startup": "12",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "e1307e32-ef9f-4b5e-8a9f-b64863bf9303",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "[電刃錬気中] ↓↘→ + P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236P"
      },
      {
        "moveId": "e1307e32-ef9f-4b5e-8a9f-b64863bf9303",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "SP または ↓↘→ + 強攻撃",
        "conditionText": "電刃錬気ストック中",
        "buttonNotation": "SP / H",
        "numericNotation": "SP / 236H"
      }
    ]
  },
  {
    "id": "cd656302-682f-41ea-9ea3-4dd48e121764",
    "slug": "ryu-od-hadoken",
    "name": "OD 波動拳",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "Dゲージを使うOD必殺技です。通常版とは発生、無敵、追撃などの性能が異なる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。",
    "status": "draft",
    "frame": {
      "damage": 1000,
      "onBlock": "-1",
      "startup": "12",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "cd656302-682f-41ea-9ea3-4dd48e121764",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + PP",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236PP"
      },
      {
        "moveId": "cd656302-682f-41ea-9ea3-4dd48e121764",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "アシスト + SP または ↓↘→ + 攻撃ボタン2つ",
        "conditionText": null,
        "buttonNotation": "A+SP / 2 buttons",
        "numericNotation": "A+SP / 236XX"
      }
    ]
  },
  {
    "id": "5593524d-b9d7-4203-8ec3-15b483ed23dc",
    "slug": "ryu-denjin-od-hadoken",
    "name": "[電刃錬気] OD 波動拳",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "Dゲージを使うOD必殺技です。通常版とは発生、無敵、追撃などの性能が異なる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。",
    "status": "draft",
    "frame": {
      "damage": 1200,
      "onBlock": "2",
      "startup": "12",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "5593524d-b9d7-4203-8ec3-15b483ed23dc",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "[電刃錬気中] ↓↘→ + PP",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236PP"
      },
      {
        "moveId": "5593524d-b9d7-4203-8ec3-15b483ed23dc",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "アシスト + SP または ↓↘→ + 攻撃ボタン2つ",
        "conditionText": "電刃錬気ストック中",
        "buttonNotation": "A+SP / 2 buttons",
        "numericNotation": "A+SP / 236XX"
      }
    ]
  },
  {
    "id": "2e127af1-553f-477c-81ce-c4027213b237",
    "slug": "ryu-l-shoryuken",
    "name": "弱 昇龍拳",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 1100,
      "onBlock": "-23",
      "startup": "5",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "2e127af1-553f-477c-81ce-c4027213b237",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "→↓↘ + 弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "623LP"
      },
      {
        "moveId": "2e127af1-553f-477c-81ce-c4027213b237",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "→↓↘ + 弱攻撃",
        "conditionText": null,
        "buttonNotation": "623L",
        "numericNotation": "623L"
      }
    ]
  },
  {
    "id": "ba18efcc-5215-49f9-94b0-bab116f79f43",
    "slug": "ryu-m-shoryuken",
    "name": "中 昇龍拳",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 1200,
      "onBlock": "-32",
      "startup": "6",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "ba18efcc-5215-49f9-94b0-bab116f79f43",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "→↓↘ + 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "623MP"
      },
      {
        "moveId": "ba18efcc-5215-49f9-94b0-bab116f79f43",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "→↓↘ + 中攻撃",
        "conditionText": null,
        "buttonNotation": "623M",
        "numericNotation": "623M"
      }
    ]
  },
  {
    "id": "5e4a8e85-0eac-4c86-a343-b69c17ce9fec",
    "slug": "ryu-h-shoryuken",
    "name": "強 昇龍拳",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 1400,
      "onBlock": "-36",
      "startup": "7",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "5e4a8e85-0eac-4c86-a343-b69c17ce9fec",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "→↓↘ + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "623HP"
      },
      {
        "moveId": "5e4a8e85-0eac-4c86-a343-b69c17ce9fec",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "→ + SP または →↓↘ + 強攻撃",
        "conditionText": null,
        "buttonNotation": "6SP / H",
        "numericNotation": "6SP / 623H"
      }
    ]
  },
  {
    "id": "d525aa87-9b71-44a0-a0b2-77e152dd23a8",
    "slug": "ryu-od-shoryuken",
    "name": "OD 昇龍拳",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "Dゲージを使うOD必殺技です。通常版とは発生、無敵、追撃などの性能が異なる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 1600,
      "onBlock": "-40",
      "startup": "6",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "d525aa87-9b71-44a0-a0b2-77e152dd23a8",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "→↓↘ + PP",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "623PP"
      },
      {
        "moveId": "d525aa87-9b71-44a0-a0b2-77e152dd23a8",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "→ + アシスト + SP または →↓↘ + 攻撃ボタン2つ",
        "conditionText": null,
        "buttonNotation": "6A+SP / 2 buttons",
        "numericNotation": "6A+SP / 623XX"
      }
    ]
  },
  {
    "id": "6e6d7e31-71b6-499c-b53a-a8725267879c",
    "slug": "ryu-l-tatsumaki",
    "name": "弱 竜巻旋風脚",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 900,
      "onBlock": "-15",
      "startup": "12",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "6e6d7e31-71b6-499c-b53a-a8725267879c",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214LK"
      }
    ]
  },
  {
    "id": "f45ed8ef-efc2-45fe-af69-6af95691af3c",
    "slug": "ryu-m-tatsumaki",
    "name": "中 竜巻旋風脚",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 1000,
      "onBlock": "-13",
      "startup": "14",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "f45ed8ef-efc2-45fe-af69-6af95691af3c",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 中K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214MK"
      },
      {
        "moveId": "f45ed8ef-efc2-45fe-af69-6af95691af3c",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "← + SP",
        "conditionText": null,
        "buttonNotation": "4SP",
        "numericNotation": "4SP"
      }
    ]
  },
  {
    "id": "7f7f8816-f6ac-40ef-9f3b-bc8c64d9666c",
    "slug": "ryu-h-tatsumaki",
    "name": "強 竜巻旋風脚",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 1200,
      "onBlock": "-13",
      "startup": "16",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "7f7f8816-f6ac-40ef-9f3b-bc8c64d9666c",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214HK"
      }
    ]
  },
  {
    "id": "1b2cae35-53bd-4334-9e29-c1be501d0567",
    "slug": "ryu-od-tatsumaki",
    "name": "OD 竜巻旋風脚",
    "moveType": "special",
    "usageSummary": "Publication blocked until official/in-game cross-check.",
    "descriptionJa": "Dゲージを使うOD必殺技です。通常版とは発生、無敵、追撃などの性能が異なる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 1000,
      "onBlock": "-14",
      "startup": "13",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "1b2cae35-53bd-4334-9e29-c1be501d0567",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + KK",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214KK"
      },
      {
        "moveId": "1b2cae35-53bd-4334-9e29-c1be501d0567",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "← + アシスト + SP",
        "conditionText": null,
        "buttonNotation": "4A+SP",
        "numericNotation": "4A+SP"
      }
    ]
  },
  {
    "id": "12b670e7-d91b-4590-beee-a414726f7c23",
    "slug": "ryu-l-high-blade-kick",
    "name": "弱 上段足刀蹴り",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 1100,
      "onBlock": "-11",
      "startup": "14",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "12b670e7-d91b-4590-beee-a414726f7c23",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236LK"
      },
      {
        "moveId": "12b670e7-d91b-4590-beee-a414726f7c23",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↙ + SP",
        "conditionText": "Year4: SP方向入力で弱版",
        "buttonNotation": "1SP",
        "numericNotation": "1SP"
      }
    ]
  },
  {
    "id": "ca18582a-dc15-4ad5-9eb3-86b2b269b2b0",
    "slug": "ryu-m-high-blade-kick",
    "name": "中 上段足刀蹴り",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 1200,
      "onBlock": "-8",
      "startup": "18",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "ca18582a-dc15-4ad5-9eb3-86b2b269b2b0",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 中K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236MK"
      },
      {
        "moveId": "ca18582a-dc15-4ad5-9eb3-86b2b269b2b0",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + SP",
        "conditionText": "Year4: SP方向入力で中版",
        "buttonNotation": "2SP",
        "numericNotation": "2SP"
      }
    ]
  },
  {
    "id": "46ac6533-8a93-4783-8c70-7c466e27cfe5",
    "slug": "ryu-h-high-blade-kick",
    "name": "強 上段足刀蹴り",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。",
    "status": "draft",
    "frame": {
      "damage": 1300,
      "onBlock": "-3",
      "startup": "27",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "46ac6533-8a93-4783-8c70-7c466e27cfe5",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + 強K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236HK"
      },
      {
        "moveId": "46ac6533-8a93-4783-8c70-7c466e27cfe5",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↘ + SP",
        "conditionText": "Year4: SP方向入力で強版",
        "buttonNotation": "3SP",
        "numericNotation": "3SP"
      }
    ]
  },
  {
    "id": "1aefba80-f15b-4bf2-b96c-a06155070371",
    "slug": "ryu-od-high-blade-kick",
    "name": "OD 上段足刀蹴り",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "-18",
      "startup": "17",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "1aefba80-f15b-4bf2-b96c-a06155070371",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→ + KK",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236KK"
      },
      {
        "moveId": "1aefba80-f15b-4bf2-b96c-a06155070371",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + アシスト + SP",
        "conditionText": null,
        "buttonNotation": "2A+SP",
        "numericNotation": "2A+SP"
      }
    ]
  },
  {
    "id": "3dd9e618-062b-483b-bc45-d2819c97030b",
    "slug": "ryu-l-hashogeki",
    "name": "弱 波掌撃",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。",
    "status": "draft",
    "frame": {
      "damage": 700,
      "onBlock": "-3",
      "startup": "12",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "3dd9e618-062b-483b-bc45-d2819c97030b",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 弱P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214LP"
      },
      {
        "moveId": "3dd9e618-062b-483b-bc45-d2819c97030b",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 弱攻撃",
        "conditionText": null,
        "buttonNotation": "214L",
        "numericNotation": "214L"
      }
    ]
  },
  {
    "id": "ed402fb3-798e-4b66-9d94-5098a28369a1",
    "slug": "ryu-m-hashogeki",
    "name": "中 波掌撃",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "-6",
      "startup": "19",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "ed402fb3-798e-4b66-9d94-5098a28369a1",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 中P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214MP"
      },
      {
        "moveId": "ed402fb3-798e-4b66-9d94-5098a28369a1",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 中攻撃",
        "conditionText": null,
        "buttonNotation": "214M",
        "numericNotation": "214M"
      }
    ]
  },
  {
    "id": "41ad35a2-c41d-4b51-ab6c-4e2a37a526b5",
    "slug": "ryu-h-hashogeki",
    "name": "強 波掌撃",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされても先に動けるため、その後も攻めを続けやすい技です。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "+2",
      "startup": "30",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "41ad35a2-c41d-4b51-ab6c-4e2a37a526b5",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214HP"
      },
      {
        "moveId": "41ad35a2-c41d-4b51-ab6c-4e2a37a526b5",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 強攻撃",
        "conditionText": null,
        "buttonNotation": "214H",
        "numericNotation": "214H"
      }
    ]
  },
  {
    "id": "ec9b330f-ae5e-457b-993e-8c60ea0afabd",
    "slug": "ryu-od-hashogeki",
    "name": "OD 波掌撃",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされても先に動けるため、その後も攻めを続けやすい技です。",
    "status": "draft",
    "frame": {
      "damage": 1100,
      "onBlock": "+3",
      "startup": "18",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "ec9b330f-ae5e-457b-993e-8c60ea0afabd",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙← + PP",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214PP"
      },
      {
        "moveId": "ec9b330f-ae5e-457b-993e-8c60ea0afabd",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 攻撃ボタン2つ",
        "conditionText": null,
        "buttonNotation": "214 + 2 buttons",
        "numericNotation": "214XX"
      }
    ]
  },
  {
    "id": "db46db6f-26dd-4638-8397-d235750929b9",
    "slug": "ryu-denjin-charge",
    "name": "電刃錬気",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。",
    "status": "draft",
    "frame": {
      "damage": null,
      "onBlock": null,
      "startup": "52",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "db46db6f-26dd-4638-8397-d235750929b9",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↓ + P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "22P"
      },
      {
        "moveId": "db46db6f-26dd-4638-8397-d235750929b9",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↓ + 攻撃ボタン",
        "conditionText": "強弱・ODなし",
        "buttonNotation": "22 + attack",
        "numericNotation": "22X"
      }
    ]
  },
  {
    "id": "5a55599e-800f-4831-886c-345d1e88a9ef",
    "slug": "ryu-denjin-hashogeki",
    "name": "[電刃錬気] 波掌撃",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされても先に動けるため、その後も攻めを続けやすい技です。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "+3",
      "startup": "20",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "5a55599e-800f-4831-886c-345d1e88a9ef",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "[電刃錬気中] ↓↙← + 強P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214HP"
      },
      {
        "moveId": "5a55599e-800f-4831-886c-345d1e88a9ef",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 強攻撃",
        "conditionText": "電刃錬気ストック中",
        "buttonNotation": "214H",
        "numericNotation": "214H"
      }
    ]
  },
  {
    "id": "2a83a1ca-a458-4e02-a496-40ff278964c2",
    "slug": "ryu-denjin-od-hashogeki",
    "name": "[電刃錬気] OD 波掌撃",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。ガードされても先に動けるため、その後も攻めを続けやすい技です。",
    "status": "draft",
    "frame": {
      "damage": 800,
      "onBlock": "+4",
      "startup": "18",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "2a83a1ca-a458-4e02-a496-40ff278964c2",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "[電刃錬気中] ↓↙← + PP",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214PP"
      },
      {
        "moveId": "2a83a1ca-a458-4e02-a496-40ff278964c2",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓↙← + 攻撃ボタン2つ",
        "conditionText": "電刃錬気ストック中",
        "buttonNotation": "214 + 2 buttons",
        "numericNotation": "214XX"
      }
    ]
  },
  {
    "id": "af1a30a4-7bf1-49eb-bd60-76b10861c470",
    "slug": "ryu-sa1-shinku-hadoken",
    "name": "SA1 真空波動拳",
    "moveType": "super",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "SAゲージを使うスーパーアーツです。コンボの締め、確定反撃、切り返しなど、技ごとの役割に合わせて使います。",
    "usageSummaryJa": "SAゲージ、ダメージ、攻撃後の状況を見て使う場面を選びます。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 2000,
      "onBlock": "-24",
      "startup": "7",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "af1a30a4-7bf1-49eb-bd60-76b10861c470",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→↓↘→ + P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236236P"
      },
      {
        "moveId": "af1a30a4-7bf1-49eb-bd60-76b10861c470",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "SP + 強攻撃 または ↓↘→↓↘→ + 弱攻撃",
        "conditionText": null,
        "buttonNotation": "SP+H / L",
        "numericNotation": "SP+H / 236236L"
      }
    ]
  },
  {
    "id": "522dafee-8e8a-4a86-8e02-e26d17137507",
    "slug": "ryu-sa2-shin-hashogeki",
    "name": "SA2 真・波掌撃",
    "moveType": "super",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "SAゲージを使うスーパーアーツです。コンボの締め、確定反撃、切り返しなど、技ごとの役割に合わせて使います。",
    "usageSummaryJa": "SAゲージ、ダメージ、攻撃後の状況を見て使う場面を選びます。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 2800,
      "onBlock": "-20",
      "startup": "12",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "522dafee-8e8a-4a86-8e02-e26d17137507",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↙←↓↙← + P",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "214214P"
      },
      {
        "moveId": "522dafee-8e8a-4a86-8e02-e26d17137507",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "← + SP + 強攻撃 または ↓↙←↓↙← + 中攻撃",
        "conditionText": "押し続けでLv2/Lv3",
        "buttonNotation": "4SP+H / M",
        "numericNotation": "4SP+H / 214214M"
      }
    ]
  },
  {
    "id": "560625d9-16b9-484e-883d-6ace0adeb39c",
    "slug": "ryu-sa3-shin-shoryuken",
    "name": "SA3 真・昇龍拳",
    "moveType": "super",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "SAゲージを使うスーパーアーツです。コンボの締め、確定反撃、切り返しなど、技ごとの役割に合わせて使います。",
    "usageSummaryJa": "SAゲージ、ダメージ、攻撃後の状況を見て使う場面を選びます。ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。",
    "status": "draft",
    "frame": {
      "damage": 4000,
      "onBlock": "-52",
      "startup": "5",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "560625d9-16b9-484e-883d-6ace0adeb39c",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "↓↘→↓↘→ + K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "236236K"
      },
      {
        "moveId": "560625d9-16b9-484e-883d-6ace0adeb39c",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "↓ + SP + 強攻撃 または ↓↘→↓↘→ + 強攻撃",
        "conditionText": "体力25%以下ではCAへ自動変化",
        "buttonNotation": "2SP+H / H",
        "numericNotation": "2SP+H / 236236H"
      }
    ]
  },
  {
    "id": "ed764818-867d-4188-b9fa-71bbd7cfb0b8",
    "slug": "ryu-aerial-tatsumaki",
    "name": "空中竜巻旋風脚",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。",
    "status": "draft",
    "frame": {
      "damage": 900,
      "onBlock": null,
      "startup": "11",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "ed764818-867d-4188-b9fa-71bbd7cfb0b8",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（前ジャンプ中）↓↙← + K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.214K"
      },
      {
        "moveId": "ed764818-867d-4188-b9fa-71bbd7cfb0b8",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "前ジャンプ中 ← + SP または ↓↙← + 攻撃",
        "conditionText": "前ジャンプ中",
        "buttonNotation": "j.4SP / attack",
        "numericNotation": "j.4SP / j.214X"
      }
    ]
  },
  {
    "id": "271fc7f0-8035-4945-8b68-40e43ab42725",
    "slug": "ryu-od-aerial-tatsumaki",
    "name": "OD 空中竜巻旋風脚",
    "moveType": "special",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。",
    "usageSummaryJa": "技の強度や相手との距離によって使いどころが変わります。",
    "status": "draft",
    "frame": {
      "damage": 1500,
      "onBlock": null,
      "startup": "11",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "271fc7f0-8035-4945-8b68-40e43ab42725",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "（前ジャンプ中）↓↙← + KK",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "j.214KK"
      },
      {
        "moveId": "271fc7f0-8035-4945-8b68-40e43ab42725",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "前ジャンプ中 ← + アシスト + SP または ↓↙← + 攻撃ボタン2つ",
        "conditionText": "前ジャンプ中",
        "buttonNotation": "j.4A+SP / 2 buttons",
        "numericNotation": "j.4A+SP / j.214XX"
      }
    ]
  },
  {
    "id": "252287ef-f49c-4347-ace6-76dce143ef59",
    "slug": "ryu-forward-throw",
    "name": "前投げ",
    "moveType": "throw",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "近距離で相手をつかむ投げ技です。打撃をガードする相手を崩すときに使います。",
    "usageSummaryJa": "打撃をガードする相手への崩しとして使います。投げ後の距離や有利時間も確認しておきましょう。",
    "status": "draft",
    "frame": {
      "damage": 1200,
      "onBlock": null,
      "startup": "5",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "252287ef-f49c-4347-ace6-76dce143ef59",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "弱P + 弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "LP+LK"
      },
      {
        "moveId": "252287ef-f49c-4347-ace6-76dce143ef59",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "近距離で 弱攻撃 + 中攻撃",
        "conditionText": "Nまたは前方向",
        "buttonNotation": "L+M",
        "numericNotation": "L+M"
      }
    ]
  },
  {
    "id": "b0e5f2a6-29fd-4aa0-98ed-05b9b248343a",
    "slug": "ryu-back-throw",
    "name": "後ろ投げ",
    "moveType": "throw",
    "usageSummary": "2026-08-03 baseline; secondary-current reference, publication gated.",
    "descriptionJa": "近距離で相手をつかむ投げ技です。打撃をガードする相手を崩すときに使います。",
    "usageSummaryJa": "打撃をガードする相手への崩しとして使います。投げ後の距離や有利時間も確認しておきましょう。",
    "status": "draft",
    "frame": {
      "damage": 1200,
      "onBlock": null,
      "startup": "5",
      "verificationStatus": "verified"
    },
    "commands": [
      {
        "moveId": "b0e5f2a6-29fd-4aa0-98ed-05b9b248343a",
        "scheme": "classic",
        "sortOrder": 0,
        "commandText": "← + 弱P + 弱K",
        "conditionText": null,
        "buttonNotation": null,
        "numericNotation": "4LP+LK"
      },
      {
        "moveId": "b0e5f2a6-29fd-4aa0-98ed-05b9b248343a",
        "scheme": "modern",
        "sortOrder": 0,
        "commandText": "近距離で ← + 弱攻撃 + 中攻撃",
        "conditionText": null,
        "buttonNotation": "4L+M",
        "numericNotation": "4L+M"
      }
    ]
  }
];

