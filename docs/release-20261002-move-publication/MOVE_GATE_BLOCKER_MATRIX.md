# SF6DNA move publication remediation — 2026-10-02

Base: `aba1746bf062ca87f8745cecd9fea5973db121cc`. DB capture: `2026-10-02T08:59:41.841144+00:00`. All database operations in this batch were SELECT only. Production unchanged. Counts are current DB evidence, not game verification.

## Fresh inventory

2065 moves; 2065 frame rows; 2052 active moves; 1939 required-category moves. 13 archived rows excluded. Current patch: `2026.08.03` / `ecff9a58-d023-43ae-9962-79d25adfc1f3`. 701 active structural/app-ready moves; 661 required. All required rows are draft. Public move count: 0.

| Category | Required count |
|---|---|
| normal | 627 |
| unique | 178 |
| target_combo | 34 |
| special | 850 |
| throw | 74 |
| super | 176 |

## Overlapping blockers

| Reason | Count |
|---|---|
| MOVE_SOURCE_MISSING | 1033 |
| COMMAND_SOURCE_MISSING | 1278 |
| CURRENT_FRAME_MISSING | 0 |
| CURRENT_FRAME_AMBIGUOUS | 0 |
| FRAME_UNVERIFIED | 1 |
| FRAME_SOURCE_MISSING | 1 |
| COMMAND_MISSING | 0 |

1278 required moves fail structural/application evidence requirements; multiple reasons may apply. Status draft is a separate blocker for all 1939.

| Character | Required | Ready | Move source missing | Command source missing | Frame unverified | Frame source missing |
|---|---|---|---|---|---|---|
| aki | 52 | 0 | 52 | 52 | 0 | 0 |
| akuma | 61 | 0 | 61 | 61 | 0 | 0 |
| alex | 64 | 0 | 64 | 64 | 1 | 1 |
| blanka | 83 | 83 | 0 | 0 | 0 | 0 |
| c-viper | 61 | 5 | 2 | 56 | 0 | 0 |
| cammy | 53 | 0 | 53 | 53 | 0 | 0 |
| chun-li | 68 | 68 | 0 | 0 | 0 | 0 |
| dee-jay | 97 | 97 | 0 | 0 | 0 | 0 |
| dhalsim | 80 | 80 | 0 | 0 | 0 | 0 |
| e-honda | 62 | 62 | 0 | 0 | 0 | 0 |
| ed | 49 | 0 | 49 | 49 | 0 | 0 |
| elena | 72 | 2 | 6 | 70 | 0 | 0 |
| guile | 70 | 70 | 0 | 0 | 0 | 0 |
| ingrid | 62 | 0 | 62 | 62 | 0 | 0 |
| jamie | 93 | 93 | 0 | 0 | 0 | 0 |
| jp | 59 | 0 | 58 | 59 | 0 | 0 |
| juri | 46 | 0 | 46 | 46 | 0 | 0 |
| ken | 59 | 0 | 59 | 59 | 0 | 0 |
| kimberly | 76 | 76 | 0 | 0 | 0 | 0 |
| lily | 47 | 0 | 47 | 47 | 0 | 0 |
| luke | 50 | 0 | 50 | 50 | 0 | 0 |
| m-bison | 47 | 0 | 47 | 47 | 0 | 0 |
| mai | 82 | 8 | 1 | 74 | 0 | 0 |
| manon | 49 | 0 | 49 | 49 | 0 | 0 |
| marisa | 53 | 0 | 53 | 53 | 0 | 0 |
| rashid | 54 | 0 | 54 | 54 | 0 | 0 |
| ryu | 57 | 0 | 57 | 57 | 0 | 0 |
| sagat | 60 | 0 | 60 | 60 | 0 | 0 |
| terry | 53 | 0 | 53 | 53 | 0 | 0 |
| yasmine | 73 | 17 | 3 | 56 | 0 | 0 |
| zangief | 47 | 0 | 47 | 47 | 0 | 0 |

## Official source reuse review shortlist

661 sources exist. Each character has an existing character-level official movelist reference below. These are **review leads only**, not approved move/command relations. Match the exact move/input to the page before proposing any relation. Same URL or character link is insufficient. Validated new relation candidates: 0. No sources or relations were inserted.

| Character | Fresh source ID | Existing relationship | Move identity gaps | Command gaps |
|---|---|---|---|---|
| aki | d3d03fd3-577a-448a-a61f-f78f5c7bcdf1 | official | 52 | 52 |
| akuma | 6a442d7d-2d1c-4ae8-8fab-ec65b5062197 | official | 61 | 61 |
| alex | 68eb562e-f179-4bbc-9808-f27269d2f97a | official | 64 | 64 |
| blanka | 8dafc85c-f01a-4f1b-8720-25f569f55b12 | official | 0 | 0 |
| c-viper | f4af7910-d894-45da-a832-16fc9dd9490d | official | 2 | 56 |
| cammy | efa7840c-39db-4160-b0f4-087e5fa5a22c | official | 53 | 53 |
| chun-li | eb0fd334-6489-4379-be56-d9a4c522d90d | official | 0 | 0 |
| dee-jay | 84e11a63-e9d7-44ec-b921-198a29f10a8a | official | 0 | 0 |
| dhalsim | 78fb954b-a69d-4d9e-a445-acbe24f3eb14 | official | 0 | 0 |
| e-honda | 2ba98eb4-83ce-4a84-8af2-a6a94938930b | official | 0 | 0 |
| ed | a452672c-9334-43af-9837-33722414df65 | official | 49 | 49 |
| elena | 7e757d3a-cc18-45bf-a192-5cb66e37f07a | official | 6 | 70 |
| guile | 5727ec18-f9d8-4eea-b00b-fb8054420d9c | official | 0 | 0 |
| ingrid | 12207158-4614-4ba1-ae5e-d83e8829fa31 | official | 62 | 62 |
| jamie | 0bf83948-b35d-4e55-a82b-6c1c23d113b3 | official | 0 | 0 |
| jp | 9da566a3-9fa1-4ff0-a833-5d96b2641529 | official | 58 | 59 |
| juri | e0d46654-b874-41bb-87c2-9abd456e3ca0 | official | 46 | 46 |
| ken | 7734438a-0a78-4c2b-86ba-1dc00db67dac | official | 59 | 59 |
| kimberly | 07f025bf-d536-40c4-9922-15081be48c7d | official | 0 | 0 |
| lily | 31c05da3-a4af-403f-b705-ea806c258aa6 | official | 47 | 47 |
| luke | b33b88ba-83af-4e7d-8a09-29670080f260 | official | 50 | 50 |
| m-bison | e431486e-ac2c-4564-bb22-88bb6453e78d | official | 47 | 47 |
| mai | dbc872b4-ea34-4b85-a9c4-781934a5e5da | official | 1 | 74 |
| manon | a801abd4-6bc3-4015-bedf-cf7c101f0ee0 | official | 49 | 49 |
| marisa | f6882a21-bd9f-4a3f-928b-386ae2d360c2 | official | 53 | 53 |
| rashid | 76283296-7455-47d4-a49d-b7d2e16efbd3 | official | 54 | 54 |
| ryu | 8bfaaeb4-8133-44fe-b0a8-f77578de5210 | official | 57 | 57 |
| sagat | 3adad088-5ab1-43cf-b810-da2c8e5c6c26 | official | 60 | 60 |
| terry | 95fb7ce5-6e3c-4077-8ecc-52e85d40f998 | official | 53 | 53 |
| yasmine | 93ba1110-3246-494c-b32d-a5fb26c81fdd | official | 3 | 56 |
| zangief | 6ebb1ff5-5549-4bcf-a7ca-a8e616dac09b | official | 47 | 47 |

## Exact non-ready required moves

| Character | Move ID | Slug | Reasons |
|---|---|---|---|
| aki | 61b21c00-8448-4264-ae8b-50bbcebb7c91 | aki-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | fc3bf2b4-031b-4a7f-8149-ec91c34c26a5 | aki-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | ab7f38c4-0c8e-447f-9818-6cee3f4971b5 | aki-chi-wen | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 296fe617-8abc-4df9-a23c-e00d6ea08faa | aki-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 4c11df06-07d8-4e8c-a965-5c3fa41496fb | aki-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 8c192d72-4284-4974-935d-1131a55781bf | aki-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | a7fbfb43-6e9c-4f8b-b49c-87a360958503 | aki-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | aed1a694-0fc0-44f8-88fe-d01d619cbb23 | aki-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 18128e14-c202-4c76-953e-59b5f893d6d9 | aki-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | c1299f62-10af-4c36-aecd-772a89522ce3 | aki-cruel-fate-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | add3bf91-944a-4c88-99af-7b033b12f602 | aki-cruel-fate-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 6d02c3e6-590f-42be-8412-03933b1744ec | aki-cruel-fate-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | d1a6b219-50a6-4123-85b1-c661c6314c3c | aki-cruel-fate-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | dcd74045-c552-4b2a-bc4b-227deeaf9742 | aki-entrapment | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 9862cfc2-b16b-48a6-9f2c-a4f698abff92 | aki-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | fa75b9de-4ce2-4987-a7b0-e098e162b129 | aki-heel-strike | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 56666d6a-a902-483b-bbef-0a1a61e01c8b | aki-hun-dun | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | ea563fe3-90d2-4816-b9da-6310611ab084 | aki-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | add403d6-41fe-4395-b9b9-8d9f24e20e96 | aki-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | c5b3f30f-6d75-4ff5-a73d-2310856de401 | aki-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 5f9ea511-7dec-40bf-ab39-31d6eb4190e9 | aki-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 389dc6e2-eb99-4077-b93f-379bdac1edce | aki-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 88a66202-ea61-4f19-a337-1e0952935b36 | aki-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 157f84f0-05f4-472d-bd2a-516dd3b000e0 | aki-nightshade-chaser | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | c30e99ec-73cb-43dd-bcde-995a51182697 | aki-nightshade-chaser-burst | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | faba51b0-9add-444e-82a4-d382e70a440d | aki-nightshade-chaser-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | f2fb51ac-71f1-468c-b738-0ec90afcdd55 | aki-nightshade-pulse | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | f7647e16-b9bb-43dc-a47f-5b8b6861214a | aki-nightshade-pulse-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 5ad21670-2e9a-44e3-8e35-b3eb76173713 | aki-orchid-spring | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 255a6469-e7cb-4e02-b3e6-f34640a957e9 | aki-orchid-wreath | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | a87a45ad-a06b-4278-9e8a-93e412757dff | aki-pu-lao | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 75ae8e69-d41e-4994-ac4a-ed7cb5db84f1 | aki-qiong-qi | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | a2331c9b-1ccd-43bf-b2a4-f0a488b180a3 | aki-qiu-niu | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 0258b69f-8689-4303-a9d4-41e0f5101589 | aki-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 88e5f03e-aae5-453f-9b00-79d2bdd334f0 | aki-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | eb5d5c47-4c89-4eaa-a361-26c79941f26f | aki-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | c7dace22-90ba-468c-a009-eb773452822f | aki-serpent-lash-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 000f336c-1a94-407f-bb7f-d4f600cb6783 | aki-serpent-lash-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 0418fe70-8aa3-49df-9d73-2bbb8f63e147 | aki-serpent-lash-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 1082b832-6a17-4e5f-a536-f18ee089fa43 | aki-serpent-lash-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 6378f5d0-4700-4cce-90c0-5e8c96352fe8 | aki-sinister-slide | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 3f8da7a4-682c-479e-a1b6-47c453e3e6a1 | aki-snake-step-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 41c2cf57-937b-4984-8def-033f2cdc52b0 | aki-snake-step-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | fb83abe8-2b71-40cc-9b56-7ae12c48d490 | aki-snake-step-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 20ab4271-c79d-442a-934a-73035f8c98a0 | aki-snake-step-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 9113703b-57f3-4f23-a0c3-a4670040cfb1 | aki-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 7880c49a-8781-49de-9a9c-bdb91da08c75 | aki-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 775e55e3-604d-4e30-add8-bf39d4c88147 | aki-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 1b11679c-d907-4fb9-a86e-8d99826918bc | aki-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 6a5467b6-67a0-4849-b726-32f5c1cf9fc7 | aki-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 5a03895b-2682-46df-96ab-f2b2c2af18f6 | aki-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| aki | 793ace8a-d4ac-411f-a0ec-f5618d54530d | aki-venomous-fang | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | e7f0e25f-ffa0-4cd0-969b-89c30c12f912 | akuma-adamant-flame-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 7381e9e3-1f6a-4846-8658-f3526750da51 | akuma-adamant-flame-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 789c5644-c97f-4f51-b406-eea0d3d13ad1 | akuma-adamant-flame-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | fbc6b3d1-45a8-4f14-9ae4-6883e9a0e804 | akuma-adamant-flame-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | a44c6608-1e01-40f7-b05b-5ea899b42c8d | akuma-air-tatsu | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | ffe7b417-928a-4ec8-a618-94e092c01a02 | akuma-air-tatsu-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 642de152-1642-42e5-87bc-8df6e002d4d6 | akuma-ashura-senku | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 0d0bf082-34ab-4cc1-a26b-6a227d6f0f31 | akuma-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 99aaab11-8fa7-4af6-b4eb-daed3cdaf0eb | akuma-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 191fbb0d-54dd-4ab1-ac02-a60aeadd7f40 | akuma-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 179062b4-5359-449b-8ddf-01c2a22fb153 | akuma-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | f5c84a83-2507-4ce0-8266-08bc0052cd8b | akuma-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 8ed97e52-13e7-4662-90f7-b38dc27121ed | akuma-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 362926bb-6d90-4147-a71a-22b8cfbde680 | akuma-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | fd0cf9f2-1d64-49d8-95cf-b706398eb295 | akuma-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 66a16ebe-1a3a-4ac7-9ccc-5b967a39d221 | akuma-demon-blade | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 09fd5956-dda3-492b-a0e8-3ae06f2c35e6 | akuma-demon-gou-rasen | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | cdcb128c-113d-4657-aa2e-b6153969c2ab | akuma-demon-gou-zanku | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 8722d216-dfc8-4f81-baf8-ec6c26a54abc | akuma-demon-low-slash | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 8625fab0-c8f6-4549-af2d-2ca926d96309 | akuma-demon-palm | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 2191ffb5-985d-4502-998f-0548be4f5786 | akuma-demon-raid | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | cff38b55-0e9d-4eb0-9985-0c7a1d91129e | akuma-demon-raid-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 2ba11fb4-4e19-4d72-8b71-87778d097c9d | akuma-demon-swoop | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | cd158bd7-7e4c-45da-9a44-2faa9e3633f8 | akuma-forward-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 131d987f-722c-4e08-8852-d6b81302d1ab | akuma-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 80b7025d-c89b-44f5-9847-21a1e31b2769 | akuma-gou-hadoken-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 5808d5ef-4abb-443e-86a6-31ea7ed83b91 | akuma-gou-hadoken-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 11e260da-3978-4c5d-9e1c-963770000246 | akuma-gou-hadoken-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 51f6e665-17b1-4caa-b3b8-abfd97d4d787 | akuma-gou-hadoken-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 238fd74b-2cfe-44f8-8514-889bb8fa3ad7 | akuma-gou-shoryu-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 883800f7-16a1-4db7-8300-0891db54362e | akuma-gou-shoryu-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | a511faed-1ae1-40ec-bab5-30fc8c0d77ea | akuma-gou-shoryu-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | a7be8cdd-0e58-4804-adc3-a3e7235df60f | akuma-gou-shoryu-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | b2b9c27e-2aec-47cb-b7e2-a918e0186932 | akuma-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | e04c5b9a-2c16-4b39-86ce-28f30f24fb31 | akuma-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 256b4f38-7a75-437f-89b5-b187eb576f0e | akuma-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 042db52d-5484-4097-b2a9-df47b8d96889 | akuma-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 7c2add4a-6967-4f3f-b1c8-719a61a608e7 | akuma-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 921f1862-981a-42d2-9c9a-17a423221c78 | akuma-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | bf19018c-f842-4627-8e5b-8535fceb836a | akuma-oboro-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 0977d5cb-329c-4829-969a-da3bc7954cf5 | akuma-raging-demon | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 752f9cfb-4992-44d7-94fa-1d18bcb223db | akuma-rago-high-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 16bba1f1-0f0d-4c36-872b-5f5985756ce3 | akuma-resso-snap-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | b8f5bcf7-18a7-46e7-afa6-f5c055e7bbb7 | akuma-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 323e23ac-7e74-4dd4-8a8f-181daa174221 | akuma-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 05cf88f7-41f8-40f6-8f83-cdbb0ca95d31 | akuma-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 5851d6cc-4a86-4b8e-9460-778f26af2ef9 | akuma-skull-splitter | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | ce9264f4-2b25-4cf1-b18c-5481c9fcf6b1 | akuma-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 0935ef23-577e-4440-8a2b-041fa30c8151 | akuma-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 3b98f0d9-a549-445e-8009-548de2d18569 | akuma-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 9776ad46-81f4-480b-8cbc-c6d2507dd041 | akuma-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 55f69a8a-11cc-4445-9363-b427b6f1b8f2 | akuma-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 946e201d-443f-42fc-ace6-485647936bb5 | akuma-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | d715027d-4941-4fab-bb96-efd6482898e1 | akuma-tatsu-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 9740a707-802d-4c17-a452-77d948aa4165 | akuma-tatsu-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 7acdbd27-e087-403b-9d13-43683f066c3e | akuma-tatsu-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 18b61e05-3245-4101-9234-747a9431cd7c | akuma-tatsu-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 69a0d966-a9fe-4479-8f73-7c78e5e4cc23 | akuma-tenma-gozanku | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 86460772-32a6-449e-b696-cf308eb20c98 | akuma-tenmaku | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | 1eb0895a-7a85-4f94-a2f8-f70509bf9b12 | akuma-zanku-hadoken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| akuma | b70ea6e7-7429-4802-aacb-efcfdd7ba62f | akuma-zanku-hadoken-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 5c35ac75-3556-47be-86e0-a772d49af0f1 | alex-aerial-knee-smash-623hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 3073d9fd-49df-451d-9c8c-93a51bf34e40 | alex-aerial-knee-smash-623kk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 9b8e20f3-1bef-48e4-ae7f-8aa3dc16aeb3 | alex-aerial-knee-smash-623lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | c6b7057f-1029-427f-b5be-7c6b899eda2d | alex-aerial-knee-smash-623mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 7ec8deb6-fab6-4f6d-9c9c-a26cdb74df43 | alex-air-stampede-2pp-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 1330719f-f6a7-43c0-8b6b-65d4e72ac6d3 | alex-arm-lock-lplk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 9b99c569-c6d8-407a-8c2a-fe018577ef22 | alex-chop-6mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 96f8e0b4-0df3-42f1-b698-9e325616b5b2 | alex-collapsing-driver-4mk-backturn | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 722822a4-42cd-474f-809b-981acd8d6151 | alex-crouching-heavy-punch-2hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 4a767cab-a099-4066-98b1-5b004bc28c1c | alex-crouching-light-kick-2lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 4e02716a-415f-4866-9055-c5869ebefebe | alex-crouching-light-punch-2lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | e647cf99-9518-4a09-a260-fbec66e090ed | alex-crouching-medium-kick-2mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 2b4abc16-695d-4e0d-a503-df2819624a2a | alex-crouching-medium-punch-2mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 46bc5d76-8274-4235-be2b-5c09e1035dff | alex-dangerous-armbar-br-spiral-ddt-2pp-2lplk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 7b009800-5747-4b7d-a2c1-7163f1826d48 | alex-exit-prowler-stance-2pp-8 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING, FRAME_UNVERIFIED, FRAME_SOURCE_MISSING |
| alex | 60fe5e26-346d-4244-bb8d-8d66cb939b47 | alex-flash-axe-236lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | fd9176ef-2810-46e8-ada0-6f5bca4e5b40 | alex-flash-axe-236mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 198b2771-cd99-415b-9181-643335438cfb | alex-flash-chop-236hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | df42445a-7291-48a3-98a6-0b7bea16b05c | alex-flash-chop-236pp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 52ca8101-2dbc-4b9b-8f4a-a595333b7aeb | alex-flying-cross-chop-j-2hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | f312a35c-8737-45fc-a731-3c07ecda80d3 | alex-guillotine-hammer-4lplk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | f6924ab4-3295-4729-a3ca-efdaee104dae | alex-heavy-lariat-2pp-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | be41531a-a64a-4fd3-880d-4b724a06b62c | alex-heavy-lariat-hold-2pp-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 4298e722-af4f-4f5d-95aa-511c5612044d | alex-hyper-takedown-br-death-valley-bomb-2pp-lplk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 6532d41e-6d5e-406c-8040-6a5b8af429d2 | alex-illegal-knees-2lplk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | fa2e772a-edf7-4bc6-91b5-a268233449ca | alex-jumping-heavy-kick-j-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | a9d9c4e7-283b-4752-b4e0-479d0f1918c0 | alex-jumping-heavy-punch-j-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | e23d9ea0-95fa-413d-a422-522925408935 | alex-jumping-light-kick-j-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 48afacd7-cf3c-4abe-9aef-dfb65cead3f4 | alex-jumping-light-punch-j-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 3ee78b99-47b1-4000-a31a-bf83fb0d1b96 | alex-jumping-medium-kick-j-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | dcaea7bc-4cc8-414f-8a01-6cfae24f14e7 | alex-jumping-medium-punch-j-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | cde1ae13-ff8c-46ed-898a-9b6cb9dbfef9 | alex-low-retreat-2pp-4 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | ea2c911c-7bc1-4d56-a43b-44fae109c7ad | alex-low-rush-2pp-6 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 71900c8b-9822-4bd4-991d-510ffea50306 | alex-oblique-stomp-4mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | fed2bcf4-7765-4414-a749-34bd33b51aa1 | alex-od-hyper-bomb-63214pp-6-backturn | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | e7b534dd-8d0c-4200-ba60-e79ae126020a | alex-omega-wing-buster-pp-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | e9c32aa7-f4de-4fad-93ef-2ef2ce81b646 | alex-palm-jab-2pp-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 72002e54-4e8a-4f0b-9e65-0131a7103581 | alex-palm-strikes-5mp-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | a9c526e6-55e2-400e-943a-30dbd838497e | alex-power-bomb-63214hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | a62a7836-7c5b-4e47-a4e9-61dbfa2f082a | alex-power-bomb-63214lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 9168f1d7-f1db-4052-9671-ce8d7af1f787 | alex-power-bomb-63214mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 6cda610f-fab6-4960-bf8c-95a85af896a8 | alex-power-bomb-63214pp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | a89e15c4-dc2b-4c32-9cae-f3552d77d202 | alex-power-drop-63214p-backturn | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 32d9fde6-3c18-4bec-a93e-09a7dbdd6cd6 | alex-power-drop-63214pp-backturn | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 8c40a2bd-8778-4ddd-991b-d0cda1925665 | alex-prowler-stance-2pp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 86136a6f-495e-4ecb-b34e-c0c66aab81c1 | alex-raging-spear-236236k | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | f49ec8eb-db39-4fc4-903a-eee03177a81c | alex-roundhouse-kick-2hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | f333f69c-b7fa-4cc7-a96f-14696fc9f16f | alex-shoulder-launcher-br-falling-moon-2pp-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | c4a1e985-e97a-4521-a40e-a100be2d1150 | alex-slashing-elbow-2pp-6p | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | fd27f911-987b-4ba0-b727-e73301ffeb69 | alex-sledgecross-hammer-214214p | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 159999da-db98-44ff-b5bd-e6c6687e02ac | alex-standing-heavy-kick-5hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 32b42551-6729-4d36-92a2-c54f76f098f0 | alex-standing-heavy-kick-hold-5-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | d72274a8-0aad-475d-a176-dcee5068a8ec | alex-standing-heavy-punch-5hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | f1171ce3-0b61-4af3-9906-43af129b39c4 | alex-standing-heavy-punch-hold-5-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 24ad3665-2bb5-4c37-8089-b07386e38983 | alex-standing-light-kick-5lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 90e1bd5d-0305-4ba0-b56f-8553db6d7f72 | alex-standing-light-punch-5lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | f6486eb1-7501-461d-8893-e52e46961a80 | alex-standing-medium-kick-5mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 1ac8c98d-1504-4f70-985a-581e3f185003 | alex-standing-medium-punch-5mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 11cb8084-9168-443d-a745-01b2cc63cde4 | alex-sweep-combination-1-br-flying-suplex-2pp-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 9efc0fc8-d2b8-430a-8a1e-0f96ddabbaeb | alex-sweep-combination-2-br-flying-suplex-2pp-hk-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 506b622b-765d-43c4-8111-321848d0fb0d | alex-tactical-hop-2pp-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 9e860acc-4183-42c6-8071-28a50656d749 | alex-the-final-prison-236236p | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | 9c0ca2ef-2b05-4832-b9d0-667400e56919 | alex-the-final-prison-ca-236236p | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| alex | b73d481c-b66b-42e9-9030-6c9ee11d9336 | alex-twisted-drop-2lk-2hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| c-viper | 567ec703-c202-40d3-bace-673eb09405c9 | c-viper-aerial-burning-kick-j-236hk | COMMAND_SOURCE_MISSING |
| c-viper | ec0a776e-0d24-4bbe-b5d5-971adc588aa6 | c-viper-aerial-burning-kick-j-236kk | COMMAND_SOURCE_MISSING |
| c-viper | 66d6ca13-2041-4cf8-88f1-b28676a55abd | c-viper-aerial-burning-kick-j-236lk | COMMAND_SOURCE_MISSING |
| c-viper | 79fcbf24-c709-473b-ad46-25a45f43b76c | c-viper-aerial-burning-kick-j-236mk | COMMAND_SOURCE_MISSING |
| c-viper | e13cc8ca-b55f-497e-be2d-8e08a9d5e0f2 | c-viper-burning-kick-236hk | COMMAND_SOURCE_MISSING |
| c-viper | a2cbe042-5f17-4eab-bd89-053015e7dbc0 | c-viper-burning-kick-236kk | COMMAND_SOURCE_MISSING |
| c-viper | 20fc5c08-b8e6-4ede-af55-e93d29cdb142 | c-viper-burning-kick-236lk | COMMAND_SOURCE_MISSING |
| c-viper | cf6b4480-3edc-4894-83eb-77c4bf92cf30 | c-viper-burning-kick-236mk | COMMAND_SOURCE_MISSING |
| c-viper | 0b1cad3d-defb-4594-a4ae-aeec77d2b054 | c-viper-crouching-heavy-punch-2hp | COMMAND_SOURCE_MISSING |
| c-viper | 8c6ebc68-98f3-4659-88eb-5e8b24a9260d | c-viper-crouching-light-kick-2lk | COMMAND_SOURCE_MISSING |
| c-viper | 95db82ab-3f5f-4349-a86e-d787d58b0b79 | c-viper-crouching-light-punch-2lp | COMMAND_SOURCE_MISSING |
| c-viper | dfbce958-316b-4b40-845d-9993e9efba69 | c-viper-crouching-medium-kick-2mk | COMMAND_SOURCE_MISSING |
| c-viper | 429891a9-c3d4-4664-b714-f73d7eacc9d5 | c-viper-crouching-medium-punch-2mp | COMMAND_SOURCE_MISSING |
| c-viper | d7d78cb5-6102-4b80-a95f-4db1a06610ba | c-viper-double-burn-236k-kk | COMMAND_SOURCE_MISSING |
| c-viper | 03851aac-fb3f-4a1f-bfa8-1cc6517f5b3a | c-viper-double-kick-6hk | COMMAND_SOURCE_MISSING |
| c-viper | 91de3adc-9dd9-4466-85fe-fb91dcceae2c | c-viper-focus-force-lv-1-214k | COMMAND_SOURCE_MISSING |
| c-viper | 693063de-3497-496e-96ab-61127a34a89d | c-viper-focus-force-lv-1-214kk | COMMAND_SOURCE_MISSING |
| c-viper | c882978d-8618-4caa-926c-c11941d8e6c0 | c-viper-focus-force-lv-2-214-k | COMMAND_SOURCE_MISSING |
| c-viper | 5c268a9a-b2b3-4bce-89e4-85086de94f0f | c-viper-focus-force-lv-2-214-kk | COMMAND_SOURCE_MISSING |
| c-viper | 26c08ccb-4685-43b3-96c0-358fc6c6544d | c-viper-focus-force-lv-3-214-k | COMMAND_SOURCE_MISSING |
| c-viper | 570742cf-d489-4e82-8f84-bb9073942d67 | c-viper-focus-force-lv-3-214-kk | COMMAND_SOURCE_MISSING |
| c-viper | 233040e0-3d41-4a5b-8417-02fad0150b27 | c-viper-hard-luck-rejector-214214k | COMMAND_SOURCE_MISSING |
| c-viper | 7c08292e-4913-4e2c-8f53-c77f66df12f1 | c-viper-hard-luck-rejector-ca-214214k | COMMAND_SOURCE_MISSING |
| c-viper | 524cbb71-a557-47bf-8e72-1c2a90927182 | c-viper-high-impulse-lplk | COMMAND_SOURCE_MISSING |
| c-viper | 0894f523-66f8-45de-966d-d7fec4c97be3 | c-viper-jumping-heavy-kick-j-hk | COMMAND_SOURCE_MISSING |
| c-viper | 01afbb21-1c1f-4ac7-82ee-48c50654668c | c-viper-jumping-heavy-punch-j-hp | COMMAND_SOURCE_MISSING |
| c-viper | 8fc36ad0-ee77-492d-8965-11067f4a2eff | c-viper-jumping-light-kick-j-lk | COMMAND_SOURCE_MISSING |
| c-viper | 2d75ffb0-1bac-405b-a149-8e7f28e3f0f3 | c-viper-jumping-light-punch-j-lp | COMMAND_SOURCE_MISSING |
| c-viper | f0125277-c547-4549-aedb-d2be9fa3bf8f | c-viper-jumping-medium-kick-j-mk | COMMAND_SOURCE_MISSING |
| c-viper | a9376105-7a20-46d0-b259-0a2d05f8ec7f | c-viper-jumping-medium-punch-j-mp | COMMAND_SOURCE_MISSING |
| c-viper | 52b9126f-7ce3-42e1-b86a-22f24cdaa84c | c-viper-knuckled-pursuit-236k-pp | COMMAND_SOURCE_MISSING |
| c-viper | ed13ddb1-b91d-4ba7-9c93-51c39b480f1d | c-viper-limit-decoupler-236236k | COMMAND_SOURCE_MISSING |
| c-viper | 9001ec69-8aa2-4dc6-96b2-e29bfb12a99d | c-viper-mission-complete-214214p | COMMAND_SOURCE_MISSING |
| c-viper | e2e8ddfd-0d71-44a0-9e3b-d3a80bf7c2eb | c-viper-neutral-jump-heavy-kick-8hk | COMMAND_SOURCE_MISSING |
| c-viper | 93188acc-38c2-42cc-86d1-7a6cdabb17d8 | c-viper-seismic-hammer-feint-623p-k | COMMAND_SOURCE_MISSING |
| c-viper | 519d3246-7d81-42a6-88cc-2340b6e0d946 | c-viper-seismic-hammer-h | COMMAND_SOURCE_MISSING |
| c-viper | ec94e62e-8487-4332-a58c-48414d5baacf | c-viper-seismic-hammer-l | COMMAND_SOURCE_MISSING |
| c-viper | 757c3e8f-a447-4fd0-811f-737fe5d2a534 | c-viper-seismic-hammer-m | COMMAND_SOURCE_MISSING |
| c-viper | 499d8978-28f0-41d9-868b-1951493abf6f | c-viper-seismic-hammer-od | COMMAND_SOURCE_MISSING |
| c-viper | bd181bb3-8825-40e5-bfb7-6fefb961f18d | c-viper-standing-heavy-kick-5hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| c-viper | 6c8f802e-4441-4adf-83d3-7eda3110ed00 | c-viper-standing-heavy-punch-5hp | COMMAND_SOURCE_MISSING |
| c-viper | cbb520c8-c3bc-4010-b2b5-9198d0119d98 | c-viper-standing-light-kick-5lk | COMMAND_SOURCE_MISSING |
| c-viper | 7cf378d5-fb58-4990-9ae2-264add8f83b7 | c-viper-standing-light-punch-5lp | COMMAND_SOURCE_MISSING |
| c-viper | ec3336dc-4117-460a-a918-66dce99731dc | c-viper-standing-medium-kick-5mk | COMMAND_SOURCE_MISSING |
| c-viper | 3434bc4c-6132-4e8d-87b3-dd86357fbebc | c-viper-standing-medium-punch-5mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| c-viper | 58a97045-a46a-4692-839c-f72d31a05a0e | c-viper-thunder-cradle-4lplk | COMMAND_SOURCE_MISSING |
| c-viper | e4ffd9f9-782f-4409-ad16-9f31e8b59f9c | c-viper-thunder-dash-214hp | COMMAND_SOURCE_MISSING |
| c-viper | c95a618c-3fa1-49a5-98b0-24205b0ad6d3 | c-viper-thunder-dash-214lp | COMMAND_SOURCE_MISSING |
| c-viper | 3b48c919-c0a6-4813-9f8b-b78c3c32473a | c-viper-thunder-dash-214mp | COMMAND_SOURCE_MISSING |
| c-viper | 3263e1a6-dfdc-4f8d-a319-d1586b355d19 | c-viper-thunder-dash-214pp | COMMAND_SOURCE_MISSING |
| c-viper | 914e1504-a559-445c-888b-b90bd2d85ad0 | c-viper-thunder-dash-feint-214p-k | COMMAND_SOURCE_MISSING |
| c-viper | 6eb936a0-b8db-48cd-84f1-6536b140ad79 | c-viper-tracer-combination-214hp-6pp | COMMAND_SOURCE_MISSING |
| c-viper | d20065fb-fc6c-4778-ad4c-6b1fe7842e7d | c-viper-tracer-combination-214lp-6pp | COMMAND_SOURCE_MISSING |
| c-viper | 4d792bd5-fe17-4ab3-b069-45ef18432585 | c-viper-tracer-combination-214mp-6pp | COMMAND_SOURCE_MISSING |
| c-viper | 20f61a5d-30d9-448b-8c5a-1e679efd72a2 | c-viper-viper-elbow-6mp | COMMAND_SOURCE_MISSING |
| c-viper | b06f72f3-28fa-4dd4-b2a6-030be3822722 | c-viper-viper-kick-2hk | COMMAND_SOURCE_MISSING |
| cammy | 2e4348f3-6108-41bc-a0ff-3cac35362291 | cammy-air-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 5df39884-a7fd-4c62-8463-33b417c0ce2d | cammy-back-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 5003bab7-95fe-405f-960b-f1af0fa4151b | cammy-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 71d63a3e-9f39-41fa-b44e-14c42a6bde23 | cammy-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 80bee02a-249d-4230-9640-bb29964c1434 | cammy-cannon-strike | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 6dd6a2a0-d98b-4b2f-82d3-115d34e7ae1e | cammy-cannon-strike-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 8cefd04a-ac28-44aa-b841-4ceed029513d | cammy-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 48162de8-8d3f-4449-afd5-cec46bcf1078 | cammy-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | a4b70351-6955-4bd8-857f-40414c293776 | cammy-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 5e4a4363-f1ee-43d6-bec9-caed4d1c6d26 | cammy-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | cae4b758-62cc-4115-a067-706e84ff59fd | cammy-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | ceade123-4db9-4071-abfb-d0ba645b587f | cammy-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 35fa1349-e2c3-47d7-9aa2-e3a714c3e748 | cammy-delayed-ripper | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 00398ea1-7adc-44eb-8edc-321538bec402 | cammy-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 7c8eb8b0-fb38-4e7d-a5cd-648448f931b4 | cammy-hooligan-reverse | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 18521e87-1e5f-40d7-8ed5-20760e94c8ee | cammy-hooligan-silent | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 61721245-946e-4951-9035-a59e0922d101 | cammy-hooligan-slicer | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | db190382-371c-4b77-9134-7cf125ac8bb0 | cammy-hooligan-slicer-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 84a3ca4b-ab3c-4034-bbeb-e1bcba8775cc | cammy-hooligan-strike | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 5e300bea-0365-4a60-b820-f42679cd2c7e | cammy-hooligan-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 9c176e07-df77-49eb-a10f-86f0d248694c | cammy-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 3f29b3ca-9e60-4469-b102-07091159ce98 | cammy-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 6060d323-fa4e-4b00-845f-131524b49f6d | cammy-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 4cbf54f3-dcb6-4cae-be0b-53d2da935a6f | cammy-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 4dd98dcb-5860-4283-8152-31ef60d7a057 | cammy-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | bf6e9444-04e0-42bb-8bd0-529fd8cb7858 | cammy-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 8e97a311-869b-4bac-9452-7d922591b4a8 | cammy-knuckle-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 2507fb57-cbd0-4755-b06f-38134b36ce82 | cammy-knuckle-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 48996237-b1cc-4a71-8376-c83fbb075e3a | cammy-knuckle-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | a7a85481-b314-4e21-ba23-11b261a41335 | cammy-knuckle-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | f4475688-1cb6-4d3a-b8a2-67af5f0d0e28 | cammy-lift-combination | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 00785f4b-7d74-438a-ab56-be2b670a5a3f | cammy-lift-uppercut | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 6e3fe94c-78fe-4993-99d9-1cc050510fc9 | cammy-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | b71563a1-1e76-426e-846a-efe566eb419f | cammy-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 13a0114b-6cb3-4079-ae51-d51fa15b20ee | cammy-sa2-air | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | d6b92f12-9c33-48e7-9220-f75922701a3e | cammy-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | bf240fb8-69c0-4e92-a450-4e4f1bfb3f3d | cammy-spike-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 282aff55-6ba1-421d-b83c-dece6699d450 | cammy-spike-h-hold | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | ce06088f-6db6-4cf8-abe2-e524d0c05787 | cammy-spike-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 74868b87-648f-4adb-b624-d3749991b031 | cammy-spike-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 3b480694-4948-443a-8a08-c3db8691bcf0 | cammy-spike-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | b5d594f6-2302-4b9b-8d8d-4deedc32697e | cammy-spiral-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 354b338e-970f-460a-9e32-3d9e2199f96f | cammy-spiral-h-hold | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 87b8fb8d-fb42-47ab-888a-3cef95bed816 | cammy-spiral-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | b59dd7ce-b8fa-4d16-b242-5a65e23681fb | cammy-spiral-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | d4eaa3bd-9caa-4bd6-a135-09f0ea3c5813 | cammy-spiral-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 20e18c1b-7943-48b6-a2a3-cc6fe2f4d0d7 | cammy-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | e0fc3a4b-6aa8-4b6f-accc-ce98a46e1faa | cammy-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | f778ea31-4d34-4adc-adb0-713d01bffd51 | cammy-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 087a4701-4c9c-4d72-aba7-6653466bb2bc | cammy-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | f9b6bfa2-1c71-40f4-b77b-d075013b84be | cammy-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 108b54e6-0bc5-4418-b42d-a8ff0c3c8f73 | cammy-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| cammy | 0d8d69be-af5f-4af6-8467-bb409688c5a8 | cammy-swing-combination | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 4b143800-5803-4bcb-b2f7-0b3939146dc4 | ed-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | e3c8cc1d-3891-4812-910b-cc27ccfa9a9b | ed-body-blow-combination | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 15eb88c6-97e9-4362-bd45-d2e02387e663 | ed-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 43c8455c-3bd1-4843-a836-f03e013a49d7 | ed-cobra-punch | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 63170ff9-b80c-4082-b774-66a10acb5498 | ed-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 79250547-4ce6-4a4a-a4d5-0f39e1cb38d3 | ed-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 0ee50858-3450-4277-bea4-dfa96a94e50d | ed-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | f029a29b-a1a4-4bd5-a46a-c67fb0c976dd | ed-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 871c15e8-b6e4-4636-b6b5-158803001e6f | ed-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 91ad05a5-294a-4c92-b9be-35b307565944 | ed-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | b3103a67-2ffb-44eb-bb46-d098e85e571a | ed-flicker-combination | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | bdc8a84c-243a-4d97-80fd-6d96fa2698a6 | ed-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 96b61c92-9208-422d-b230-b3f4f550c67e | ed-hitman-combination | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | fe1009d4-44e0-4702-950b-0d5ebf69862f | ed-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 62bb74b1-ab83-414d-9e83-fb21f539399c | ed-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | bb38c8c9-c5d3-41b3-a800-10a6e53344be | ed-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 8b1fbe0c-461e-459f-9e51-aad6833afd46 | ed-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | f4e388a0-7616-48b6-9b97-266ced50ebb0 | ed-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | b009be13-ba4b-4075-916b-d5ca5cb0ed4b | ed-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 1f8944c8-bcab-4f26-816b-7face5ac90d4 | ed-kill-rush | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | f25b82cb-2852-412c-b1e8-f51077fdd61d | ed-kill-switch-break | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 901f1949-bbe8-450e-965c-6ff1c40fa324 | ed-kill-switch-chaser | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | e3cc2a7a-d7f2-4512-b1f2-ff3f660260ed | ed-psycho-blitz-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | bac9265b-c97a-4b9b-b081-b67eb119743c | ed-psycho-blitz-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | c49df832-9544-4ef2-8f68-f6e5973a0e31 | ed-psycho-blitz-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 0a896d13-4937-4300-af00-3dd1e2548c1a | ed-psycho-blitz-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 93f83e6d-9f9c-43fc-aaaf-70f954d44dcc | ed-psycho-flicker-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | e6e924d2-2dd3-4bc2-80ed-aec6f175383c | ed-psycho-flicker-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | b7613ec3-5661-4e6a-bcf0-34ea5635b896 | ed-psycho-flicker-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 887468ff-91cd-4c80-b1ae-7fe5b011d790 | ed-psycho-flicker-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | bf258f77-218f-4cf9-ab54-9de59bb304c9 | ed-psycho-knuckle-lv1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 21d8647a-8a35-4e13-b21c-6d0af396bd99 | ed-psycho-knuckle-lv2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 58505a48-3761-43ea-bf98-cf91f4e02148 | ed-psycho-shoot | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | dd3ca890-ef8a-4067-868f-ae93b330543f | ed-psycho-shoot-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 8fa46e7c-be53-4d83-8500-44c9de7ca6da | ed-psycho-spark | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | ea3f3886-3a2b-4ee4-8c6d-7b8fb93e9076 | ed-psycho-spark-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 621c4239-32eb-4b00-a075-0f9c15389675 | ed-psycho-upper-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 6440734c-a3fa-45e0-a5de-50c93ec470b6 | ed-psycho-upper-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 31996c83-5434-4c79-908f-75f65886877b | ed-psycho-upper-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 029f8661-b765-4faf-bff2-230a9f27f685 | ed-psycho-upper-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | f4be6bb0-6175-4415-9e9b-5e02718a2f92 | ed-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 010bd4fc-f9b5-45ab-af1b-37d5d2da891c | ed-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 9ff3530a-72d4-414f-86f3-a7291e0d349f | ed-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 29565224-5de9-4d1f-819b-555c8dc50441 | ed-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | f3a031ca-1ef2-453a-aed9-03182fb5e301 | ed-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | bbb06c03-9ebd-4467-9e51-7357b14b4177 | ed-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 1be7b0e7-2897-4af2-b35a-18aaaae5a5ba | ed-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | ced3d8f1-f9a2-4391-9200-1e36f5a02b2d | ed-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ed | 7089d3ef-f00b-45bd-b55e-2fb8032b96ea | ed-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| elena | c9401f16-e65c-4d8f-a193-bdd40eca23f2 | elena-crouching-heavy-punch-2hp | COMMAND_SOURCE_MISSING |
| elena | 7833a723-0962-4962-a1bc-e77ee624c1c5 | elena-crouching-light-kick-2lk | COMMAND_SOURCE_MISSING |
| elena | 97ee42d4-321f-456c-87df-e5b488b880ef | elena-crouching-light-punch-2lp | COMMAND_SOURCE_MISSING |
| elena | fa6d9e96-c1e6-47ab-902f-efb78ae9cf84 | elena-crouching-medium-kick-2mk | COMMAND_SOURCE_MISSING |
| elena | a741a091-7c7d-418a-8d1a-9b3e9a5e17ff | elena-crouching-medium-punch-2mp | COMMAND_SOURCE_MISSING |
| elena | 9fbf348a-5c2b-40b6-85a6-f485478ac2ca | elena-fluttering-lark-2mk-hk | COMMAND_SOURCE_MISSING |
| elena | 8967a443-c5e5-4dc7-8544-eac7eaefc263 | elena-handstand-whip-1-6mk | COMMAND_SOURCE_MISSING |
| elena | 048f1407-8a52-4261-b515-4d19187e9e7b | elena-handstand-whip-2-6mk-mk | COMMAND_SOURCE_MISSING |
| elena | dcc6d646-7c0e-4668-a6b2-50111a9c01c3 | elena-harvest-circle-236p-6mk | COMMAND_SOURCE_MISSING |
| elena | 41aea858-3bf1-42ba-aea2-1c7a76f2379b | elena-harvest-circle-236pp-6mk-or-236p-6p-6mk | COMMAND_SOURCE_MISSING |
| elena | bc49a04f-1a72-40e1-a846-b7b5a83f277c | elena-hind-kick-5mk-hk | COMMAND_SOURCE_MISSING |
| elena | 3e2fd952-26b8-4942-85fb-651512e650ba | elena-jumping-heavy-kick-j-hk | COMMAND_SOURCE_MISSING |
| elena | 6800af4c-4cb0-4746-9d38-d5018258239b | elena-jumping-heavy-punch-j-hp | COMMAND_SOURCE_MISSING |
| elena | 03636a7c-3511-43a3-ac8f-f44441b3f97d | elena-jumping-light-kick-j-lk | COMMAND_SOURCE_MISSING |
| elena | b8d2ab8e-c245-4fbd-8518-9d332befb15f | elena-jumping-light-punch-j-lp | COMMAND_SOURCE_MISSING |
| elena | d26c2adf-536b-4e81-9e75-7e49fefefa7d | elena-jumping-medium-kick-j-mk | COMMAND_SOURCE_MISSING |
| elena | 34ad9991-74c8-4819-a88d-0c1204cd4573 | elena-jumping-medium-punch-j-mp | COMMAND_SOURCE_MISSING |
| elena | 029c9fbe-9ec0-4142-83cc-7aa456943c38 | elena-leg-lift-throw-4lplk | COMMAND_SOURCE_MISSING |
| elena | 402f9dee-ca5b-4ddb-8a69-c76f150caff5 | elena-leg-tackle-lplk | COMMAND_SOURCE_MISSING |
| elena | c3f1573f-eedb-4925-bc2d-a91d3a587670 | elena-leopard-snap-236p-6lk | COMMAND_SOURCE_MISSING |
| elena | e277e18c-cd7f-46eb-86a4-bf5af6e48623 | elena-leopard-snap-236pp-6lk-or-236p-6p-6lk | COMMAND_SOURCE_MISSING |
| elena | e7008dc1-c61b-440e-bd0a-c25dd2416988 | elena-lynx-song-236hp | COMMAND_SOURCE_MISSING |
| elena | 61398b6e-3e45-4ac8-8350-545f06d3ac47 | elena-lynx-song-236lp | COMMAND_SOURCE_MISSING |
| elena | a2203168-0b8c-44b9-9493-1b75e1f275d6 | elena-lynx-song-236mp | COMMAND_SOURCE_MISSING |
| elena | f5490cd6-dd8a-4050-9e98-82320951a393 | elena-lynx-song-236pp | COMMAND_SOURCE_MISSING |
| elena | 02a62e54-a6ea-4222-b6b0-bc5fe71e6652 | elena-lynx-whirl-236p-6hp | COMMAND_SOURCE_MISSING |
| elena | 8460e337-f30b-4c31-9057-cf9afaf56eb9 | elena-lynx-whirl-236p-6lp | COMMAND_SOURCE_MISSING |
| elena | 26fd9989-85d3-482b-bcf2-44f173193997 | elena-lynx-whirl-236p-6mp | COMMAND_SOURCE_MISSING |
| elena | ddc55cad-6882-4625-8927-805c4551509b | elena-lynx-whirl-236pp-6p | COMMAND_SOURCE_MISSING |
| elena | dd5b1500-b646-4716-9c1b-c5cc0fb191f3 | elena-mallet-smash-236p-6hk | COMMAND_SOURCE_MISSING |
| elena | a38cfb8b-3a44-4172-b9b1-5b502d2e53f7 | elena-mallet-smash-236pp-6hk-or-236p-6p-6hk | COMMAND_SOURCE_MISSING |
| elena | f7fa0d87-9ffe-44cf-b263-c3e01893c205 | elena-meteor-volley-236236k | COMMAND_SOURCE_MISSING |
| elena | eb39b4bf-47fd-4405-b2d0-66045e8c61b1 | elena-moon-glider-214hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| elena | ad10bccc-42ea-41b3-9745-d6c1f5e2f8d1 | elena-moon-glider-214lp | COMMAND_SOURCE_MISSING |
| elena | 1ccbe0bd-8d08-418d-b498-72cc842fc211 | elena-moon-glider-214mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| elena | 341bde0b-7471-4c28-85ee-b7ebb09ff371 | elena-moon-glider-214pp | COMMAND_SOURCE_MISSING |
| elena | 375ab2d8-4862-424a-a736-fcc6df15205b | elena-moon-glider-follow-up-214p-6p | COMMAND_SOURCE_MISSING |
| elena | 9916c7aa-9882-4e13-9c62-b839c1346ff7 | elena-moon-glider-follow-up-214pp-6p | COMMAND_SOURCE_MISSING |
| elena | 3814450b-c6eb-496e-afa0-50ad1e39d0ad | elena-raptor-range-j-mp-j-hp | COMMAND_SOURCE_MISSING |
| elena | 2f989ac3-a346-4ec7-ad57-7f4190741f79 | elena-revival-dance-236236p | COMMAND_SOURCE_MISSING |
| elena | c17fd4da-fcaa-42c9-ba3e-89ac1ad128f4 | elena-revival-dance-healing-236236p-2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| elena | 8ddf7123-8e88-475f-a0a0-56853b050f04 | elena-rhino-horn-236hk | COMMAND_SOURCE_MISSING |
| elena | 261aebad-45a9-4fe5-88dd-8a419c988b43 | elena-rhino-horn-236kk | COMMAND_SOURCE_MISSING |
| elena | 4c80247d-5c92-4c0f-828d-b71be622f735 | elena-rhino-horn-236lk | COMMAND_SOURCE_MISSING |
| elena | ac7bab5a-33b7-41e1-bb63-d7930a9ae0e4 | elena-rhino-horn-236mk | COMMAND_SOURCE_MISSING |
| elena | a872dc1e-f5ce-4a68-a083-9b1674b983bf | elena-root-breaker-2hk | COMMAND_SOURCE_MISSING |
| elena | 98c709d8-f4a7-4264-8d03-8cef4758cfb0 | elena-round-arch-4hk | COMMAND_SOURCE_MISSING |
| elena | 02c0e90b-cde9-46fb-81f2-5994ee3c5a73 | elena-scratch-wheel-623hk | COMMAND_SOURCE_MISSING |
| elena | 6e0b8aa1-fccd-44e4-aac5-b2313b959f94 | elena-scratch-wheel-623kk | COMMAND_SOURCE_MISSING |
| elena | f3753764-5baa-4c63-a10a-7b6fe9424f4a | elena-scratch-wheel-623lk | COMMAND_SOURCE_MISSING |
| elena | ccb40731-8cfa-46de-86a7-e06afc3b6b54 | elena-scratch-wheel-623mk | COMMAND_SOURCE_MISSING |
| elena | e2b6b864-e958-4810-b193-f0ef6b04fe0f | elena-slide-3hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| elena | 047cd83f-8110-424d-9069-8e1886b46aef | elena-soaring-raid-j-lp-j-mk | COMMAND_SOURCE_MISSING |
| elena | 65b2045a-a03f-46db-ab0a-65f433377da5 | elena-song-of-the-grasslands-214214k | COMMAND_SOURCE_MISSING |
| elena | 2eb66583-f555-4123-b233-cc9a864246ac | elena-song-of-the-grasslands-ca-214214k | COMMAND_SOURCE_MISSING |
| elena | fbe394c7-3820-491f-a365-50769eca14ac | elena-spinning-scythe-214hk | COMMAND_SOURCE_MISSING |
| elena | a04fe8b5-007c-4731-a5bb-0a8e2161d9ce | elena-spinning-scythe-214kk | COMMAND_SOURCE_MISSING |
| elena | 5d2ffa11-e0fd-4c81-ba40-06e24e8d3d2e | elena-spinning-scythe-214lk | COMMAND_SOURCE_MISSING |
| elena | 68fb4360-a536-4ada-9759-a4b78bbce0ae | elena-spinning-scythe-214mk | COMMAND_SOURCE_MISSING |
| elena | b90072af-d85b-4cbe-a240-036ab7742891 | elena-standing-heavy-kick-5hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| elena | d8290194-9d3d-4499-be63-9c4a0be06763 | elena-standing-heavy-punch-5hp | COMMAND_SOURCE_MISSING |
| elena | 5f521773-71c7-4a90-a67e-33af09381e69 | elena-standing-light-kick-5lk | COMMAND_SOURCE_MISSING |
| elena | abc19582-3e56-44db-9415-a9e7e0251a27 | elena-standing-light-punch-5lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| elena | 223ad40c-6c36-41fc-9e6f-d5ca2d496e60 | elena-standing-medium-kick-5mk | COMMAND_SOURCE_MISSING |
| elena | 886714a1-4920-4be1-b103-ab3847911ca5 | elena-standing-medium-punch-5mp | COMMAND_SOURCE_MISSING |
| elena | 0ec23819-7110-4a97-b064-6938125d7f84 | elena-starling-beak-5mp-mp | COMMAND_SOURCE_MISSING |
| elena | df4cbbca-0424-4e64-906c-d8bbd066af31 | elena-trunk-slap-1-6hp | COMMAND_SOURCE_MISSING |
| elena | 1f35c804-2eab-482e-8159-faaa612a2a67 | elena-trunk-slap-2-6hp-hp | COMMAND_SOURCE_MISSING |
| elena | 4c808394-2c01-4481-9d5f-3fd5cd855f81 | elena-trunk-slap-3-6hp-hp-hp | COMMAND_SOURCE_MISSING |
| elena | c6aa3b3e-09fe-49fa-b430-7998a00df1b3 | elena-turning-tail-5hp-hp | COMMAND_SOURCE_MISSING |
| ingrid | 61514fdd-4707-4b13-bbff-5197ee9c43d0 | ingrid-cosmic-ray-236236p | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 8e74d393-d33c-46df-ba61-ebe1d19b8696 | ingrid-cosmic-ray-ca-236236p | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 090b6c76-7d7a-4fac-9b5d-480783eb142c | ingrid-crouching-heavy-punch-2hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 085b713f-2fa2-4ad3-b5fc-9b181801dc07 | ingrid-crouching-light-kick-2lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | c46008e0-e4d0-4ea6-9361-f64397569f51 | ingrid-crouching-light-punch-2lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | a0605fb6-b60f-4ba0-be1e-c39610de1cb3 | ingrid-crouching-medium-kick-2mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 1bbc8a7b-7dab-4156-890f-c59158f9f96c | ingrid-crouching-medium-punch-2mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | fbc62d82-9ce7-4d18-9820-9cacdb10dee9 | ingrid-glowing-touch-1-4mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | f0b734d1-b0a9-45c5-a580-58919e942afe | ingrid-glowing-touch-2-4mk-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | e13e81a4-55ee-4080-a156-f088c56df4b8 | ingrid-gravity-drop-4lplk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 6d7499cb-08b8-494c-a655-667925c97d04 | ingrid-halo-flight-6hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 59d6f7e0-928a-43bb-bcf0-ce90c8f69463 | ingrid-jumping-heavy-kick-j-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 78a246c6-7c64-4143-aeb4-dd0e68ef7720 | ingrid-jumping-heavy-punch-j-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 37be78a6-8061-49a5-8e19-9b00a5244ed9 | ingrid-jumping-light-kick-j-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 46862ac1-c8f8-4aaf-95d3-4c22cf7379bb | ingrid-jumping-light-punch-j-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 473156b0-0500-4d8b-8960-21f725345e39 | ingrid-jumping-medium-kick-j-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 7a7e74ff-40b3-4008-aeda-0515ea8656ed | ingrid-jumping-medium-punch-j-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 8b6b34bf-96c7-44a9-aa4f-bb2c6347d48a | ingrid-luminous-uppercut-1-4hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | a7ac77d0-e9a6-4a0b-8ac4-7bcaa62efb89 | ingrid-luminous-uppercut-2-4hp-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | b0f3a8f8-8307-4b70-90fa-9ca58bd1d559 | ingrid-orbital-kick-2hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 4ef25e1d-afed-41ef-8d11-54f917b32b9d | ingrid-order-of-the-sun-0-stock-214214p-0-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 6413aa87-0e47-49d2-93ef-bc94a010179e | ingrid-order-of-the-sun-1-stock-214214-p-1-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | b6bc235a-79d2-46f3-ba3e-92d958bf1868 | ingrid-order-of-the-sun-2-stock-214214-p-2-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 69bbedb3-a847-4a83-bbb5-f41a26e818ce | ingrid-pretty-heel-kick-5mp-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 3658815c-407c-4aa2-a068-f8f80ea685fd | ingrid-satellite-leap-j-hk-j-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 10016add-2efb-44cc-a5b4-444d610e24a5 | ingrid-shining-sun-0-stock-236236k-0-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 69f4a36e-028e-4dc0-ac4f-bad477196210 | ingrid-shining-sun-1-stock-236236-k-1-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | f40ca33c-4063-45f3-b39e-a415c0092eb7 | ingrid-shining-sun-2-stock-236236-k-2-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 076d1989-9455-4c47-a440-f481b7e6bfeb | ingrid-solar-burst-1-stock-j-214hp-1-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | a9f2303e-ff13-40bb-9089-d907a8b7efe6 | ingrid-solar-burst-1-stock-j-214pp-1-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 378d69bb-6f99-453f-988f-57dbbc83e9f2 | ingrid-solar-burst-2-stock-j-214hp-2-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 044ab472-3a6c-4777-a0fe-530c3dd182f8 | ingrid-solar-burst-2-stock-j-214pp-2-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 2c31c0cb-4d0f-48b8-8bbe-fef4bff88c34 | ingrid-solar-burst-j-214lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 4ce0a704-d05a-41a5-9973-f1d30ca5b118 | ingrid-solar-burst-j-214mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 44bec95a-fd1f-40bb-8b97-091b21b4fa74 | ingrid-solar-burst-j-214pp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | f467c51d-f893-418b-850b-2bec448a3439 | ingrid-standing-heavy-kick-5hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 41172dc1-d44c-4ba7-97d2-d95cd9dcbfe4 | ingrid-standing-heavy-punch-5hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 1161be83-5832-44a1-afef-d23fcfd9732d | ingrid-standing-light-kick-5lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 3ec12cfd-c155-4eb6-90d9-65092aaf37db | ingrid-standing-light-punch-5lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 6734fcd5-29c3-4064-8679-956460208ba0 | ingrid-standing-medium-kick-5mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 3dd49984-4b15-4f9e-9634-2b55cad264ea | ingrid-standing-medium-punch-5mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | aafb7458-4fb7-4cc8-acf8-d637ffbac022 | ingrid-strange-knuckle-lplk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 15593710-4688-4533-b66d-40f3d37a1435 | ingrid-sun-bright-6mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 35a10956-10d9-4c94-8379-275caf1b533f | ingrid-sun-flare-1-stock-214hp-1-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 630e8d36-b192-4cf5-b0fb-e63fd41dc204 | ingrid-sun-flare-1-stock-214pp-1-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 376c51c9-6d64-455f-a71b-96adc1d4a80e | ingrid-sun-flare-2-stock-214hp-2-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 17fa5c91-b8df-4886-8354-bd48401225d1 | ingrid-sun-flare-2-stock-214pp-2-stock | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 686f0058-9334-4c85-833d-8dbc2973ad97 | ingrid-sun-flare-214lp-hold-ok | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 1ad5ddd7-9079-40df-be00-c12204e91d6d | ingrid-sun-flare-214mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 7c84e192-aaee-4916-ad7f-529ea882770d | ingrid-sun-flare-214pp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 666e7042-3c1b-4179-babe-b7cb67896272 | ingrid-sun-rise-236hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | a9e69d63-6089-4b37-84da-b82130315be0 | ingrid-sun-rise-236kk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 193c7170-ee4d-4781-829c-0a77ed7c81b2 | ingrid-sun-rise-236lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 896bcfc7-5f28-420f-9edb-0290359b43f1 | ingrid-sun-rise-236mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 106c2942-c3ec-48ca-b673-51e7d0fa932a | ingrid-sun-shot-236hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | f3264dc7-cead-4fbd-a48b-2fc550b41446 | ingrid-sun-shot-236lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 48860f55-2304-4e43-9b31-54fe0ab34fbf | ingrid-sun-shot-236mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 05920cf1-13ec-4bec-b9fc-3a4df4590f85 | ingrid-sun-veil-22k | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 17006beb-bc73-46df-aca4-40059e85ff70 | ingrid-sun-veil-22kk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 5dbaff2a-f404-471b-ade9-603e3220f500 | ingrid-vanishing-sun-back-4kkk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | 32d66e08-81e4-4074-8e7d-2a3de73295c0 | ingrid-vanishing-sun-down-2kkk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ingrid | a001d08a-cfad-4749-a340-1e410f1e847e | ingrid-vanishing-sun-forward-6kkk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 51680ee1-db0b-4906-80da-93ba82dde6f1 | jp-amnesia | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | f262b667-3ec4-4b75-a7f1-df1748df2ba3 | jp-amnesia-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 00306fb8-0213-4c10-af70-df4286431957 | jp-back-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | a63b4bd9-535b-4893-a55e-42d105ad9f8b | jp-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 2472fe66-f312-4a5d-9c7c-25e0fa2515d7 | jp-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 5fad21d1-bb82-4a22-bf29-f125688d3cb9 | jp-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 33b785cd-b4e9-4232-be5c-aca9ccef7b0a | jp-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 5a596631-df8f-450b-b735-ae4b9ca14390 | jp-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 7c4584fd-fdb5-4fb9-84a2-472c3c03febe | jp-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 92ecb272-1cbd-46f0-95f2-ad4d21506e99 | jp-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 0afd12fb-5c7a-4799-b222-21daa7ca18f3 | jp-crouching-mp | COMMAND_SOURCE_MISSING |
| jp | 50c13c49-015c-423a-880e-9c4663ad34d9 | jp-departure-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | f0766896-f8e9-45eb-a769-0762d98a2714 | jp-departure-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 732536be-f8e8-4701-9871-991075ed5c8a | jp-departure-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | c9f1220a-5353-4da4-803e-02b71563cf85 | jp-departure-od-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 9ec80073-a3d7-4d24-9437-8a21dc112c68 | jp-departure-od-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 40e948eb-d634-4dc8-8b3a-43aef82df522 | jp-departure-od-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | a6b9d663-b9b3-494b-8d43-7aed196be8f4 | jp-departure-shadow | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 6fbfed6b-7805-4277-b216-60503d4cee88 | jp-departure-window | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | a7bb98cd-731c-485c-ab95-78de6cf5448e | jp-embrace | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | e87c51f7-a2e9-44b1-8061-d823351b42d5 | jp-embrace-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 3ed94fcd-3820-4ad6-91ea-7405360afac0 | jp-forward-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 94a12a74-68c3-41d2-9fb5-7684451741b5 | jp-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | fb460c24-5453-48e4-bc72-dc3dffcfc81c | jp-grom-strelka | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 610e39c3-8fef-4a72-b85b-15c3a8fedd71 | jp-guillotine | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 61797d46-a331-4638-ba60-3dc3ea0cfd16 | jp-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 88b7028e-f54a-4b51-a75a-670ccfce75dc | jp-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 6cb6065e-9c33-47d1-af2c-00e4b3871182 | jp-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 00edfdc1-cf06-4b8c-b836-a213a7028cf6 | jp-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | ce1e365b-8572-44a2-8767-0bce9f20054b | jp-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 3baf3077-05b0-4360-b548-ee16b68f8a37 | jp-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 7817f9e6-8542-4da1-be01-c6bd24294f22 | jp-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 85762bb5-b5ae-4a88-b4ee-55112037774e | jp-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 1845d4b9-4bac-4e4e-b6fd-3b57accfa973 | jp-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 290c6317-4a8a-4241-84cb-fc6774db1a98 | jp-shalosti | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 9e959d30-059e-404b-ab0e-279ec4c5a54a | jp-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 45863f7d-e112-42d8-ab88-d33839b4873a | jp-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 45d7ef0d-2f7c-415d-b433-1e04ad9fe09b | jp-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | b558b854-1a5b-41a3-89ec-b119abc475ae | jp-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 94ad1cb7-1464-432d-b7ee-34e0171541b0 | jp-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | e4ed90d9-23bf-4089-978a-4f2061e3b94a | jp-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 43f19305-48cc-4928-b355-b07daf382c00 | jp-stribog-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 34287e66-c123-4cba-8c97-7bb0bd5a90b6 | jp-stribog-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | acef0697-16a0-49eb-b289-4df09a1843e7 | jp-stribog-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | b8329b05-de0d-46dd-8688-e44231540c80 | jp-stribog-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | cd0255a1-bf6f-4b92-ad4e-1b2d5905983c | jp-torbalan-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 06f4575b-6654-459f-bf7b-2357dcf71478 | jp-torbalan-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 0b13852f-0f76-4787-b794-1ef8257fa5fe | jp-torbalan-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 852ac443-78e0-4c00-a43e-5196d33aba36 | jp-torbalan-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 8fdddc58-2331-4ceb-baec-cd8289c30bb5 | jp-tornado | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | c6bcbf1d-e8ea-40f3-ae9e-c341ececf18d | jp-triglav-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | ac58d193-6639-4fe4-921c-fb69f7a85908 | jp-triglav-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 7e400c75-ee2f-491c-a063-c70d1c73d5ff | jp-triglav-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 6f77b24f-8671-4370-bd3a-f8e0e7c7028e | jp-triglav-od-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | c31fe91a-5449-49c7-b264-97dccae0908f | jp-triglav-od-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 14090a4d-132e-4d55-8d8d-4669444dba8f | jp-triglav-od-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 0cc4dbc5-1dfc-4225-b050-a6ad29b92c0e | jp-zilant | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 0b5841d6-8c3d-4da9-af74-0d4e9c2e389c | jp-zilant-low | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| jp | 1e3cc0be-14ef-4c39-9392-d8b88196fc46 | jp-zilant-mid | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | f1f7bdc0-5abb-4dcd-9a18-6ed7ebcacabd | juri-air-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 453d3d43-4df0-4281-a38f-4c2b5151fb81 | juri-ankensatsu | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 4f7d14e2-ed50-4525-aac6-dff1f24c073d | juri-ankensatsu-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 7722f444-553d-4a47-93ea-e92f66baeb5e | juri-back-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 5cc1893e-1ad5-41cd-bd06-6688b060508e | juri-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 8c772908-c117-4985-aa01-02f9e357525e | juri-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 5e48fac3-fa32-4536-8e2d-bf0570cb98cb | juri-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 2b16c519-2cc7-4164-8f26-8cf28eeb4c42 | juri-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | d0b3f714-9b4b-45fa-a223-dcf772f3c1d4 | juri-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 501c9852-448b-434a-96fc-f9227225f89c | juri-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | e0df78eb-f4eb-4b61-b5ff-c8c194ded0b2 | juri-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 14cc7865-3cbb-4cd7-9cf8-fd5625d15b90 | juri-forward-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 7a1df939-a2fb-4ae2-aaf9-cd3c54406db8 | juri-forward-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | b5c35158-2c77-4e40-ab38-5ed3e5ecee04 | juri-forward-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 6d1e92da-67bf-49ea-8630-7c333d1199e9 | juri-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | cbc368ca-d0f3-4777-ae9d-cbeeaf937a1f | juri-fuhajin-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 5a98da7b-3c31-4889-af24-22a93f74080b | juri-fuhajin-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | c0222f7b-ade2-40b3-9306-1c73c9e3cc5a | juri-fuhajin-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 7c61f024-fca7-4e40-a278-c69bacfe4c6e | juri-fuhajin-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 8b775baf-27e9-47cc-a3c3-9d21ae396d88 | juri-go-ohsatsu | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 8b14f12a-30f6-4092-a564-abc65dd214fc | juri-go-ohsatsu-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 10ca8307-afd5-4742-a064-3406619c3b96 | juri-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 87b089e4-becb-4768-b5dd-96f736e0981d | juri-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | f5e75dfd-4b1b-4030-a5e0-06b58df5e0cd | juri-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | c3c885f1-6446-441b-97cb-bb4ff28021ff | juri-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 1ee8ba21-5b52-4f70-a342-e49959242e5d | juri-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | be322e27-dde3-48e7-8080-9261e7a98ba0 | juri-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | ce47d469-55ed-4743-b467-dc62a689b5b0 | juri-neutral-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | a0b600a3-0b0c-432d-8a6a-75bba7af99cb | juri-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 953af9d9-ad43-430d-9ea2-ffa332436fbe | juri-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | d93fe029-deff-4d33-9a36-edf219cb92d5 | juri-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 010a1ad9-e796-4af1-a1a7-2f8d17c7c3fb | juri-saihasho | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 221d7c73-57cc-4a5f-b94d-aa444ff9d222 | juri-saihasho-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | ba59597e-b3b2-4932-ac71-c57a5c8d43c9 | juri-shikusen | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | d8b0f1e0-9608-4189-8118-b4bf13274f10 | juri-shikusen-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 6eec0561-3a94-44e2-83f5-7f7b408cc3f9 | juri-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | bb2f57bb-6a4b-4c81-ab6c-1315ea7433f3 | juri-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 31e7f452-d59f-4ff8-9c6e-6e4b0d4839b6 | juri-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 67327dc0-faeb-419b-ab35-0a006ca1fc21 | juri-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 0f570ab6-a5d5-469d-9a18-fea8f85b3962 | juri-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 6805e9b9-a136-4b38-b91a-9a8b9854afa3 | juri-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | f617d69b-8a4a-440c-b8ad-8e0fc53ba614 | juri-target-mp-bhp-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 1201daae-e1b8-47aa-88d9-19be3fb4f80b | juri-tensenrin-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 1e7d1cc0-8118-4c5a-8b43-94f585c2a83e | juri-tensenrin-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 9f311585-00ac-4e7c-83fc-08a04f4f9f8d | juri-tensenrin-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| juri | 3e607e52-090d-4c0b-96ec-d3bf99fd7c8b | juri-tensenrin-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | f6171332-63ad-40d3-8fb7-8c4fe6fa6218 | ken-air-tatsu | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | bacc9cc1-aff3-4b61-841d-fb313a77e3d5 | ken-air-tatsu-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 37dfc815-fab3-4be0-a0d3-c83db2f4c3b1 | ken-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | cdde3afe-40c5-40b3-8883-294a19aa35ff | ken-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | e2d7691f-7e96-4337-9690-f6bbdee4b00d | ken-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | c02c7a22-c800-4a29-9b0d-e4dad5b62230 | ken-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | c19fb166-6fe5-4bef-b046-32d90312b827 | ken-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 7d58e80b-b800-48ff-8a9b-ad6bb92e3e4a | ken-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 272f1707-9bad-4301-adbe-4538e2da0bf0 | ken-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | f767adcd-c716-46c3-a1f5-819390fde640 | ken-dragonlash-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 2471b3a9-56a9-4e1c-80d0-3cfd73d4513e | ken-dragonlash-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 3ca5b57a-0acb-4a5b-9f4f-512baa076a2d | ken-dragonlash-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 2ae7c845-f576-49f2-b81a-9e556485a9ba | ken-dragonlash-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | ec656dda-486b-4d70-89b2-c7e2c8935fa6 | ken-dragonlash-quick-dash | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 0b963e9d-0a9d-4d32-83f8-38187e4fc12e | ken-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 7e7854bb-b559-456f-bb38-4eaf4ab8f317 | ken-hadoken-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | da463a86-012e-489c-83c2-4d9c788ec522 | ken-hadoken-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | a387256a-dac1-411f-9d33-3a0e9c1b6ab2 | ken-hadoken-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | fd90ad37-4df3-4385-a480-70458d20e24b | ken-hadoken-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | c2a9f794-1729-4a80-ae69-80eedea265a4 | ken-jinrai-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 08c0ef1b-86af-4f11-981b-e8cdb5bf3e3b | ken-jinrai-h-follow | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 5cb7c595-a3ad-4cf1-a9a1-6c319279c6cc | ken-jinrai-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 250fd7eb-821d-41ba-b01d-bfd018dc7dd0 | ken-jinrai-l-follow | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 3586bd08-a3f6-401e-9d49-0915b711dcbc | ken-jinrai-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 02fb7dd2-41dc-4c9e-ac60-9dba818f1779 | ken-jinrai-m-follow | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 7369f84d-cbee-48a6-9fb9-cf83805d36b0 | ken-jinrai-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | b22c5f0f-371f-49a5-b27d-7ab8940edae0 | ken-jinrai-od-third | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | d2525123-fae1-4342-9ea2-c31a211530fd | ken-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 8afdd432-ff11-4508-acba-d0fdc05d510c | ken-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 4487e49b-4891-45d2-8f6a-e72d15ea9649 | ken-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | cce77dbc-8964-4c57-987c-1a1760647abd | ken-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | f1553986-dddc-4333-8b69-4606e6ecca49 | ken-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 26d989a7-ac25-4bb9-80fd-42c2642cd2b9 | ken-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | ea6f8d3f-3fdd-4d0f-a5d8-46d1dc2d8013 | ken-neutral-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 7d2cac0c-e80b-43dd-a4df-15e6a3b71db5 | ken-quick-dash | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 0075125f-a9c4-4274-b3d1-588ceea35617 | ken-quick-dash-forward-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 4bf7f7ff-9512-48c3-bd21-95e21535e073 | ken-quick-dash-stop | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 280e8428-087e-4cac-8d7e-434989eda118 | ken-quick-dash-thunder-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 7c35987c-b8f2-461d-a406-c8d4cede0e4d | ken-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 7ec44688-4e77-48bb-8b9f-0731b6eed185 | ken-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 87998cdc-9b82-4b36-9582-3e144fe7b107 | ken-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | be01ed12-ba8a-457b-9954-a996223e4426 | ken-shoryuken-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 339114d8-31e2-4760-9a65-cf4c9e289616 | ken-shoryuken-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | bc92ba83-9725-464b-8358-aff0977879c7 | ken-shoryuken-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 6876468e-a58f-49ec-8141-ebac16b9a162 | ken-shoryuken-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 8005546e-eee1-413b-9acc-c76e783f6660 | ken-shoryuken-quick-dash | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | be0ff01f-d21c-4b58-8763-fc5d24618ada | ken-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | d0d02467-4e2e-483f-b9b4-54347ad88642 | ken-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 91fed226-09c8-4bf2-a082-be9d5490366f | ken-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 0d079eeb-5fa6-40f0-a6d6-42c4abde4653 | ken-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 432a788a-2374-4108-b7a1-42fac75edcf9 | ken-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | a262468d-d351-4fe3-95f9-1b8ce5f97749 | ken-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 97b9e6f8-ce78-4e9b-9310-3206e2aed9ff | ken-target-mk-mk-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 73805d67-6c3e-4ab6-84bb-c3f214011f77 | ken-target-mp-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 69c0324c-b2d1-4d19-873f-e147d82c79ab | ken-tatsu-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 7e3c88e5-1626-4546-950f-7a7b1a3edcac | ken-tatsu-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | e59ca6b7-22fc-40f4-94a2-e8a52bd02ade | ken-tatsu-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 41217421-641d-40ab-89b6-e683ab04fcce | ken-tatsu-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ken | 63e3c941-3368-42fd-9228-bb01ab9258ae | ken-tatsu-quick-dash | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 3efe3247-d69b-499e-aaed-b81b421b7b5e | lily-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | d443d973-0462-458f-a25e-3b51759ebfd2 | lily-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | d9dc6a43-1108-4cc6-b910-a57dd875db7f | lily-condor-dive | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 3d24b9fa-acd9-40c7-ab2d-c6072387bf4e | lily-condor-dive-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 9dbe5691-feb2-4ca7-9d7c-5540866135bf | lily-condor-spire-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | a79cee14-f203-4edd-b652-ce84a8ed3101 | lily-condor-spire-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 2a8f3b75-dc9e-4b74-bc99-453d89e393de | lily-condor-spire-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | b7e85880-5a68-4d91-a643-c906bdf4b226 | lily-condor-spire-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 00757623-de90-4d2e-ae90-da9a682a357d | lily-condor-wind-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | d563587e-1e97-4039-9a78-2bab79f78d58 | lily-condor-wind-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 05bab123-00a7-41b0-889f-53e4527153ef | lily-condor-wind-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 2efc8988-c256-4213-8198-1191e8ef8928 | lily-condor-wind-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | b9d5b6ee-30ba-4dd8-a005-618a2fb5573d | lily-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 7c920824-53ef-4ed5-95da-a744eb17a49c | lily-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | a7dca108-10d6-4d01-b2c8-987a2a543d19 | lily-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | a59a7028-d1e4-46de-8c39-445ab2793bc2 | lily-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 99d40d81-1aee-4194-99df-27a556359da1 | lily-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 562bdd63-69d2-45af-a846-1575e7ed6164 | lily-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 8b413672-a9a4-4b33-a4d0-c71fc2bbd7bb | lily-desert-storm | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | b1197eb5-0af7-4da8-bf0a-f9af1a7094b1 | lily-forward-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | a903733b-bfea-4ae3-bb7a-a2ab1f8db7bc | lily-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | b8f6c01b-75fe-447b-993e-53883d70c86c | lily-great-spin | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | a722c0d0-c726-44f7-880c-0506f31bb6ca | lily-horn-breaker | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 0290a978-c728-46e4-a8f7-b493f68df73c | lily-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | d0e0be38-756e-4649-8b42-ab710f43c81d | lily-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | c019e770-945f-49ba-90cc-6f27cdd7cc49 | lily-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | db1dc9a6-a40d-4a67-a9f2-23cfc5da9cb6 | lily-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 9b0d90ef-57d6-44bf-b3e4-979fbe61d341 | lily-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 9e0e16a5-893b-4afc-8768-b809085f2b3c | lily-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 506d86ff-9851-4d4a-97f7-f5445ae0a5df | lily-ridge-thrust | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | c0d1f90a-71dc-4cd6-97a5-e9b300369320 | lily-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | b6c4e084-c653-42b8-94b8-c0a5dd115702 | lily-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 32d1cd8d-b7a2-4def-8074-667ee62e8536 | lily-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 2e7b4bbc-a9da-47a2-86b0-7987ad5b69a3 | lily-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 0cf0c983-503b-437c-81d9-0d3c5ce2c243 | lily-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 6a0a575f-4548-4adf-ac32-d043cc15dfbf | lily-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 47688cef-f3bf-45f6-b4bf-83bec7695c18 | lily-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 48125962-89d1-4fbe-88f0-a29b4b4173ba | lily-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | f4c2b403-675b-48ef-a04a-78d2382ca631 | lily-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 564965af-494f-4926-9ffb-542c60e0d5bb | lily-tomahawk-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | fe1878ca-0f87-4caa-8a08-52586006a3b4 | lily-tomahawk-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 491be84d-faa8-4ecc-9a4f-4b4e8faa3c5b | lily-tomahawk-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | d9a2e1cb-6fb0-4d81-85d8-b052b0eced6d | lily-tomahawk-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 00098e8f-ce4d-45cf-a785-f3238be5e859 | lily-typhoon-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | 204a2e48-71e3-4180-b42e-8ec5c8bd1ed7 | lily-typhoon-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | c58e0a88-2a82-4f7f-a8d9-60b2b406f395 | lily-typhoon-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| lily | f37f3b86-5ba5-4ccf-831b-f0ebcc4cae2d | lily-typhoon-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 5d28a0ed-7abe-4c1b-8cc4-bcb208d55626 | luke-aerial-flash-knuckle | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 29ba87ce-14a6-40b2-84aa-936228092b66 | luke-avenger | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | c40c1f4a-5753-486d-a902-e017ae79de78 | luke-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 9f9e639b-a942-40a2-ad23-33fa36e1ac06 | luke-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 2efffb76-d9f8-44e2-830a-16ee127f96cc | luke-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 3ead79b6-43a0-4376-8ccb-04e068be8df7 | luke-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 40d7e3a8-5e6c-49b1-9e88-3cdb830f8ce0 | luke-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 2666b0fc-64f1-405c-afbe-382431e1df9b | luke-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | d21b0a0c-4d1a-4ccf-9a0f-585246d91395 | luke-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 6afa6076-dff0-4ca5-b00d-acbf1a6f74e0 | luke-ddt | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 423f6d80-072c-4dd1-863d-5b8e0061a37d | luke-fatal-shot | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 4b6fa7c0-c85c-4d4f-aca4-b54b29599818 | luke-flash-knuckle-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 53070580-449c-4fcb-b6f5-bb97de387ba1 | luke-flash-knuckle-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 8668e8a5-945a-437c-a833-f265d837d0bc | luke-flash-knuckle-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 9616dccc-5222-420c-97c7-512fe6ebad17 | luke-flash-knuckle-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 1e553e7b-1abf-47eb-8864-c46d2f8cfa58 | luke-forward-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 4f16469c-504c-4290-a5c7-6b685169b8c3 | luke-forward-hp-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | dc4d041c-4259-4636-8142-d2f329b7d77b | luke-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | b2aaf0e6-82b4-49eb-8690-96450cfb7d1e | luke-impaler | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 5a9a9a77-2943-428c-8eb0-8729e26ed0bc | luke-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 229b7150-2d1c-46ae-87cf-c2dfa413d588 | luke-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 31807b8f-99c8-446f-a2db-5200ae2fae69 | luke-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 00fb09ee-aba9-4dc7-8115-29b46bd67dad | luke-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 779533b9-24da-421b-ac57-bb8c3d5700b9 | luke-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 48c184ed-390f-454f-9de8-75df3887fc13 | luke-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | c9027806-a085-4461-a802-592e907e9a46 | luke-no-chaser | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | aab86b9c-f501-4928-8818-114f5fc0574a | luke-nose-breaker | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 938179e9-b0e1-4b22-8adb-d61bcb84ae86 | luke-outlaw-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | f415ffa3-f701-4586-8e02-e30596c119e9 | luke-rawhide | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | c647ddae-2f4f-440d-ab84-8c44b5ba9188 | luke-rising-uppercut-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | ee3a7178-324f-4238-9e0d-b3735dfc9beb | luke-rising-uppercut-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 249ae616-7fd2-422e-80a3-65bb64b80a17 | luke-rising-uppercut-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 3176f9a4-9586-49cc-9dd6-8a444e2cd1ae | luke-rising-uppercut-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 9e34282d-9da4-43fb-a47c-dfdd72eda6ee | luke-sa1-vulcan-blast | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | a1931623-d8f1-47e4-9f18-ef4fde632b4b | luke-sa2-eraser | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 03dc215b-fe91-445b-9089-9a9d090ac1a0 | luke-sa3-pale-rider | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | fb68e4ad-4c0a-4bc1-bd8c-c79244c78d78 | luke-sand-blast-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | e5c37a22-9ba1-409b-bc2a-52b4839c8e6f | luke-sand-blast-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | e881de87-5e45-4e0f-bda5-668c28d2b76a | luke-sand-blast-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 0466a4f1-0e3c-4352-8f61-0f1874663e99 | luke-sand-blast-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 4743c57a-35e7-404f-82e2-79a0854b12f6 | luke-slam-dunk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | a6088794-0ed1-4ee9-9d4a-ee4cbe159e37 | luke-snapback-combo | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 0dd61560-79e9-4220-89a7-3044bc01b630 | luke-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 97651c5b-50de-45b3-851d-4e6157c22192 | luke-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | b09359b8-9a9b-4fce-a1e6-5ed2a1bc1afe | luke-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | beb7d320-94fb-4e21-93ca-7defe9570f50 | luke-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 82fb24e6-a9e4-4f76-9686-450d0ff43143 | luke-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 548d97af-d316-4a12-9574-e08b9dad159a | luke-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 4383dae4-bdac-418f-9a11-e4632eb25696 | luke-suppressor | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| luke | 42cfd8d8-a47b-4d89-8fd6-95e758b07e0d | luke-triple-impact | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 4a25d3d8-585e-4b52-bec2-ca7ee2888210 | m-bison-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | f7d9014b-5cad-4add-a2cc-8b5e3f7f2ca8 | m-bison-backfist-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 0e0a450a-c755-499a-b295-bb2dd9fb861e | m-bison-backfist-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | c9bf8dcf-1dd8-4555-beea-299ead31b37e | m-bison-backfist-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | b5f873c7-850c-47af-93b2-c235577fc43c | m-bison-backfist-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 4b65d125-b5dc-4a1b-916b-f2d3e0914350 | m-bison-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 6f14be7e-c55f-4abb-a795-be18d766991c | m-bison-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 51fc51dc-9d49-446c-9593-1f7b0504fb47 | m-bison-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | af71d7be-ed9c-4baf-816a-ced471305369 | m-bison-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 5cd98003-d486-40a6-8640-999a1b7714c8 | m-bison-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | b96ff6c3-1824-49a1-b908-48dd9bb48810 | m-bison-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 55696c1b-8fa5-4ebb-9332-21292b6fc02a | m-bison-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | c2acaa79-eeef-4639-a37a-145fd9c1a134 | m-bison-devil-reverse | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | d5925df3-8858-4dea-ab51-a761da97624b | m-bison-devil-reverse-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | fcb5f9cf-db38-4230-87dc-3b4312d0cc92 | m-bison-double-knee-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 10052ee8-75dc-4201-9bb0-17c04cbf6025 | m-bison-double-knee-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | e0432fac-9d08-49ac-8314-6b094fec9eb2 | m-bison-double-knee-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 819951f6-3153-40da-97b8-4377c064ea68 | m-bison-double-knee-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 3fd9568c-2f2c-4832-89db-8ee137f5e070 | m-bison-evil-knee | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | c7d2d956-6cb6-4b50-9958-37e3345b907c | m-bison-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 0f5b1b32-dd83-4fcc-b38b-63b219a2585d | m-bison-head-press | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | ef1bccbb-f2aa-41f5-bbe9-7b2bd501a7f8 | m-bison-head-press-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 6febf370-0000-42e1-811a-bee83f2c248a | m-bison-hover-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 62338ed3-a07e-4767-a3c4-fa27579545a4 | m-bison-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 68dc311a-e131-4e22-9a14-2536452298a2 | m-bison-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | fd6994d7-9b39-442b-80fa-88eeaf147f93 | m-bison-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | ffc46504-0632-4b6e-ac49-5d799425d179 | m-bison-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 86f77e43-38bc-47e6-8781-2ec32010d60f | m-bison-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 849683cc-dc9a-46f6-b33a-16a15ec9aa13 | m-bison-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | d25205a7-8dab-45e4-9f64-a829470f222d | m-bison-psycho-crusher-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 3e0db2d0-b2f3-40b7-8bcc-8912a315e398 | m-bison-psycho-crusher-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | c2720255-9359-433f-8d10-86b888c31037 | m-bison-psycho-crusher-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | cc7127a5-3dc3-45b4-ba53-ccf7a81a6572 | m-bison-psycho-crusher-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 06f6772d-c72a-4204-a21f-86a1c39c7785 | m-bison-psycho-hammer | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | c0b714e7-924a-4ec5-9bd3-e3d8eaa65484 | m-bison-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | b97162b5-eba5-4147-b4e9-6168e67fd7be | m-bison-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | cbcab1b6-75cc-4b86-932c-8a190812e623 | m-bison-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | cf27b61b-2a87-482a-ab89-6353b06bb5db | m-bison-shadow-hammer | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | e008aab9-83d9-4651-a751-baa6eb4ff5a0 | m-bison-shadow-rise | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | fda154bc-d27a-4763-92e7-1f93c15f971e | m-bison-shadow-spear | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 3650688e-300c-4846-9b2f-2b9c59cc50b7 | m-bison-skull-diver | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 8bf5c0eb-0ada-4578-9a7a-95c21670c0ff | m-bison-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | ffa725b6-b958-41b6-9cb5-b9fcc5331d97 | m-bison-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 5108cffa-507a-490f-ade0-097d5fedb023 | m-bison-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 6544558c-024a-4504-b36c-11887ecc52d5 | m-bison-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 25689873-937f-4724-ad9d-2c8dd55fa794 | m-bison-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| m-bison | 823a6d63-aef7-46c7-ad54-c961630cb692 | m-bison-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| mai | d8c75cd4-688b-4524-8f84-a233f459c643 | mai-air-chou-hissatsu-shinobi-bachi-flame-j-236236k | COMMAND_SOURCE_MISSING |
| mai | d6c70d59-2a08-45ff-8677-578b09b520c1 | mai-air-chou-hissatsu-shinobi-bachi-j-236236k | COMMAND_SOURCE_MISSING |
| mai | 0d8b787f-05d6-4b99-b5ac-f58cc071fae6 | mai-chou-hissatsu-shinobi-bachi-236236k | COMMAND_SOURCE_MISSING |
| mai | 10e9e8aa-439d-4afd-b229-bcaa72caee66 | mai-chou-hissatsu-shinobi-bachi-flame-236236k | COMMAND_SOURCE_MISSING |
| mai | 55531a5d-ba9c-44c2-af06-cb2363570932 | mai-crouching-heavy-punch-2hp | COMMAND_SOURCE_MISSING |
| mai | 2a58235d-299a-4618-8ea4-c230f3302cac | mai-crouching-light-kick-2lk | COMMAND_SOURCE_MISSING |
| mai | 799cbf62-e5b0-48d3-8546-1358987c7359 | mai-crouching-light-punch-2lp | COMMAND_SOURCE_MISSING |
| mai | 95730c67-addc-4642-a20a-5945ef11ed44 | mai-crouching-medium-kick-2mk | COMMAND_SOURCE_MISSING |
| mai | 0e0a9837-cbe4-4f29-aa63-f6b88a786bcf | mai-crouching-medium-punch-2mp | COMMAND_SOURCE_MISSING |
| mai | 64233f0e-dc53-488f-a1e9-1f622523d2db | mai-fuusha-kuzushi-4lplk | COMMAND_SOURCE_MISSING |
| mai | ff4be576-a5ac-4d8a-a03d-f2d59cc85529 | mai-hien-ren-kyaku-1-5lk-lk | COMMAND_SOURCE_MISSING |
| mai | f3fc4f71-7de2-4f23-9a7c-5b98c41124b7 | mai-hien-ren-kyaku-2-5lk-lk-lk | COMMAND_SOURCE_MISSING |
| mai | 1060f3f7-058e-4be2-8714-3f0e1795e554 | mai-hishou-ryuuenjin-623hk | COMMAND_SOURCE_MISSING |
| mai | 099baed1-255e-4fec-b9d0-75f87e24e641 | mai-hishou-ryuuenjin-623kk | COMMAND_SOURCE_MISSING |
| mai | c64c6dad-c13f-4ba7-bd9f-9cab33f6b85f | mai-hishou-ryuuenjin-623lk | COMMAND_SOURCE_MISSING |
| mai | 65f00a1a-fea9-4c04-bad2-85c0fc7c3563 | mai-hishou-ryuuenjin-623mk | COMMAND_SOURCE_MISSING |
| mai | 70f76978-8e89-4042-8cab-c9e24d1d8243 | mai-hishou-ryuuenjin-flame-623hk | COMMAND_SOURCE_MISSING |
| mai | f960e717-25c7-44da-ac0b-2f7aa866f88c | mai-hishou-ryuuenjin-flame-623kk | COMMAND_SOURCE_MISSING |
| mai | 254fd65b-d6d6-486d-922e-17c2dbe1d887 | mai-hishou-ryuuenjin-flame-623lk | COMMAND_SOURCE_MISSING |
| mai | dc665b65-f046-48c7-bc4f-fe9bb7a380bf | mai-hishou-ryuuenjin-flame-623mk | COMMAND_SOURCE_MISSING |
| mai | 4e935bdf-a3ba-4cbd-b375-2cd3f3754222 | mai-hissatsu-shinobi-bachi-236hk | COMMAND_SOURCE_MISSING |
| mai | e9f91496-79de-420d-b144-8f81e54c8079 | mai-hissatsu-shinobi-bachi-236kk | COMMAND_SOURCE_MISSING |
| mai | 4368337b-faaa-4a61-bf5e-de753a1672ad | mai-hissatsu-shinobi-bachi-236lk | COMMAND_SOURCE_MISSING |
| mai | 579f6039-66a5-4b78-858a-fc9f53534ee7 | mai-hissatsu-shinobi-bachi-236mk | COMMAND_SOURCE_MISSING |
| mai | 4c5114d4-b091-4953-a66b-3492c3c7aba7 | mai-hissatsu-shinobi-bachi-flame-236hk | COMMAND_SOURCE_MISSING |
| mai | ff2aeb51-9c84-4409-ada8-09083329826c | mai-hissatsu-shinobi-bachi-flame-236kk | COMMAND_SOURCE_MISSING |
| mai | 2ee03507-15cc-49ad-9391-d7dcd050eea1 | mai-hissatsu-shinobi-bachi-flame-236lk | COMMAND_SOURCE_MISSING |
| mai | ca182cfe-9100-43cd-90b3-b6aff2e27a4a | mai-hissatsu-shinobi-bachi-flame-236mk | COMMAND_SOURCE_MISSING |
| mai | c59b75c7-e1f2-46be-b8df-11e3299cfafa | mai-hoshi-kujaku-1-4hk | COMMAND_SOURCE_MISSING |
| mai | af3b83e5-f64d-4521-95e7-1b74b0bd65b6 | mai-hoshi-kujaku-2-4hk-hk | COMMAND_SOURCE_MISSING |
| mai | 0a6ba915-5360-40b0-b37e-31e2df09e568 | mai-jumping-heavy-kick-j-hk | COMMAND_SOURCE_MISSING |
| mai | 1e35ff30-76f3-44a3-a5a7-ec74ca790f70 | mai-jumping-heavy-punch-j-hp | COMMAND_SOURCE_MISSING |
| mai | 71f95882-1eb5-4a41-9023-8565dd9189a5 | mai-jumping-light-kick-j-lk | COMMAND_SOURCE_MISSING |
| mai | 722ea2f7-7922-4a01-a41d-9aa990abae2a | mai-jumping-light-punch-j-lp | COMMAND_SOURCE_MISSING |
| mai | 0da28746-384f-4894-a50c-5f8c4de07aa2 | mai-jumping-medium-kick-j-mk | COMMAND_SOURCE_MISSING |
| mai | 2c04ce27-7982-40e1-9149-c8067306bfcc | mai-jumping-medium-punch-j-mp | COMMAND_SOURCE_MISSING |
| mai | 10dcc221-233d-42bc-99aa-8706d7e1283a | mai-kachousen-236hp | COMMAND_SOURCE_MISSING |
| mai | 59f4a69e-972b-4a2e-a525-4685c62f4312 | mai-kachousen-236lp | COMMAND_SOURCE_MISSING |
| mai | 47d6dfe7-4242-4d43-a961-b7695a030e48 | mai-kachousen-236mp | COMMAND_SOURCE_MISSING |
| mai | 452adbd1-a514-4306-8924-ded4748130d2 | mai-kachousen-236pp | COMMAND_SOURCE_MISSING |
| mai | a89daa00-59bb-4e97-bdee-8777baae8923 | mai-kachousen-flame-236hp | COMMAND_SOURCE_MISSING |
| mai | 30ffa854-0001-41d1-bfb1-809d7483b9a0 | mai-kachousen-flame-236lp | COMMAND_SOURCE_MISSING |
| mai | f9c3b0fa-760c-4e7f-ba79-5f83ba5aca06 | mai-kachousen-flame-236mp | COMMAND_SOURCE_MISSING |
| mai | 21dc9ace-04ee-4766-8b5b-a8cac9db4915 | mai-kachousen-flame-236pp | COMMAND_SOURCE_MISSING |
| mai | 03601c2d-0d4b-4c7d-be09-46c8bccd5448 | mai-kachousen-flame-hold-236-pp | COMMAND_SOURCE_MISSING |
| mai | 98a28cf7-2575-41e3-88e5-ef939df6f3b5 | mai-kachousen-hold-236-pp | COMMAND_SOURCE_MISSING |
| mai | 1e085854-0f9f-4a2e-8ebb-5d801af83fee | mai-kagerou-no-mai-236236p | COMMAND_SOURCE_MISSING |
| mai | 42fdc185-4aa1-4234-ba81-3169dce48cbc | mai-kagerou-no-mai-flame-236236p | COMMAND_SOURCE_MISSING |
| mai | 65d63ab3-e0c2-4e73-a26d-289f89c4f1bd | mai-midare-kachousen-236-pp-6p | COMMAND_SOURCE_MISSING |
| mai | 25170cee-b17f-4b2e-9018-b06e4b40f3d1 | mai-midare-kachousen-flame-236-pp-6p | COMMAND_SOURCE_MISSING |
| mai | beb82132-a72c-4d8b-8b22-bd88143767b4 | mai-musasabi-no-mai-flame-j-214p | COMMAND_SOURCE_MISSING |
| mai | 18670ca7-c6c3-414e-8449-776b5585b10c | mai-musasabi-no-mai-flame-j-214pp | COMMAND_SOURCE_MISSING |
| mai | b2593844-99eb-4711-8f16-641062458c51 | mai-musasabi-no-mai-j-214p | COMMAND_SOURCE_MISSING |
| mai | ed62ecda-34f3-43c3-b2fc-4b9bf8a08065 | mai-musasabi-no-mai-j-214pp | COMMAND_SOURCE_MISSING |
| mai | a1433e3c-2463-434f-bc73-b7bb37cbfe15 | mai-ryuuenbu-214hp | COMMAND_SOURCE_MISSING |
| mai | ea9af208-f4f2-4637-b78d-aa52ca53c3ec | mai-ryuuenbu-214lp | COMMAND_SOURCE_MISSING |
| mai | 4eb2fb8b-4bc7-438e-acea-e040152b4910 | mai-ryuuenbu-214mp | COMMAND_SOURCE_MISSING |
| mai | 870ce756-5677-4db4-84f4-70353b9f015b | mai-ryuuenbu-214pp | COMMAND_SOURCE_MISSING |
| mai | 5bfa1b80-d214-4066-9328-87354142ce08 | mai-ryuuenbu-flame-214hp | COMMAND_SOURCE_MISSING |
| mai | fd6a2d51-686d-4271-8054-f5013996f7a9 | mai-ryuuenbu-flame-214lp | COMMAND_SOURCE_MISSING |
| mai | effe2cef-e943-4b22-8826-a175b7b47250 | mai-ryuuenbu-flame-214mp | COMMAND_SOURCE_MISSING |
| mai | d4e58ad5-da60-4a4d-baea-006dd40b49ea | mai-ryuuenbu-flame-214pp | COMMAND_SOURCE_MISSING |
| mai | 00b0a428-c1e2-4765-a7f8-36445be32cfa | mai-senkotsu-uchi-6mp | COMMAND_SOURCE_MISSING |
| mai | 7313c119-d754-4136-8774-06ce55ec9560 | mai-shiranui-gourin-lplk | COMMAND_SOURCE_MISSING |
| mai | 90941f06-5027-454c-81bb-d0e63d862d60 | mai-shiranui-ryuu-enbu-ada-zakura-214214p | COMMAND_SOURCE_MISSING |
| mai | 22f4f8af-d7a2-49a4-af3e-3e4815003d3a | mai-shiranui-ryuu-enbu-ada-zakura-ca-214214p | COMMAND_SOURCE_MISSING |
| mai | 62c81d2f-2c47-4a87-bc5a-2fdbd0bb3627 | mai-sori-geri-2hk | COMMAND_SOURCE_MISSING |
| mai | c87f5c0a-5c24-4461-9113-6b416fababfa | mai-standing-heavy-kick-5hk | COMMAND_SOURCE_MISSING |
| mai | 6c114c87-785f-4b90-a830-1431f9aed5a5 | mai-standing-heavy-punch-5hp | COMMAND_SOURCE_MISSING |
| mai | c36cb84d-b266-455d-96a9-836c93ac05ef | mai-standing-light-kick-5lk | COMMAND_SOURCE_MISSING |
| mai | c4813437-7ccf-4598-8723-6970a608688e | mai-standing-light-punch-5lp | COMMAND_SOURCE_MISSING |
| mai | c8456bde-c38f-45c7-9ec4-72f56146010e | mai-standing-medium-kick-5mk | COMMAND_SOURCE_MISSING |
| mai | d6aef7a2-f24b-41f9-b594-e94a8d2e147f | mai-standing-medium-punch-5mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| mai | e589aae2-b6ef-4ab6-8523-2a9e6af24e5f | mai-yume-zakura-j-lplk | COMMAND_SOURCE_MISSING |
| manon | 1a11e706-08e7-4a29-a656-84ac942d5a18 | manon-a-terre | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 701cd562-2e2b-4b05-afdb-e9a162b076ce | manon-back-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 55b92472-63bf-4775-baf8-ee65ee4b1b60 | manon-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 1d2d8c87-2a79-44c4-a3e3-263a7e00f9a4 | manon-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 4d0d1ebf-0226-487b-a19a-109d7efaa506 | manon-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | c2637f0c-c297-4bcb-94f4-1a560575226e | manon-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 80ba147b-0531-4fc0-9b86-da220ab7a52b | manon-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 22224768-644f-49c1-94d2-6baedc745506 | manon-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 95906801-2718-41e8-a7ff-1e519604881c | manon-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | f90b1411-94f7-4d79-b46f-b56961d0dd18 | manon-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | f284f407-cbb4-4300-a615-9a11af7178df | manon-degage-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | f21d0878-5c98-45f9-995c-1488b784d044 | manon-degage-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 61da79b8-44e4-4102-8fd8-b8567c34b055 | manon-degage-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 9de1ac97-fc73-4ae2-9271-64174f9b1c27 | manon-degage-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | ee465bb0-22b4-41d2-9b26-a2fa733c3d06 | manon-en-haut | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | e9d7d8e0-0ead-44cc-9c9f-4137ecb3aae4 | manon-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 453697c0-bbee-4cd4-bb25-dc0fa55d688c | manon-grand-fouette | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 1ee03250-5022-4db8-ab9c-f08af76c1a4b | manon-grand-fouette-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | de77ddfe-d9e0-48c6-9776-7585a70193ac | manon-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 1b7f9b40-80d2-472f-b954-be1619adb7c7 | manon-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 4181126f-96c6-4856-96f7-cea78f874c41 | manon-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | e833739b-e7f2-43af-9e30-8b8d57513a15 | manon-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | b6d91c3a-0516-428f-9b80-14720578e991 | manon-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | a921d7b3-84e2-4cb5-998c-e28063671f5d | manon-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 7508a273-cd0f-43ae-85f1-e16dc8f9b850 | manon-manege-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 47d8e1cb-af05-4495-994d-cdf7f83675da | manon-manege-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 1c8375a6-7858-40ad-8ca3-aa265f2da682 | manon-manege-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | ddc87d1a-7319-4f33-836d-1f1d49e31e79 | manon-manege-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | ec082d29-a7db-4164-9ba7-a9c73a5c9be5 | manon-renverse-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | cb2b113e-e4dc-42a7-928b-b309cc78ec75 | manon-renverse-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | a39eee5c-5732-4d6e-afb7-623e1ca7fb17 | manon-renverse-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 2a72c52e-206d-4c2c-b564-705305fd9d1c | manon-renverse-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 44b0a3f1-968d-48e7-8162-8c03e994e443 | manon-reverence | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | dbde2cbc-e04d-4c39-8847-4eaf65282637 | manon-rond-point-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | a517d65e-66a7-48ed-bbcc-7fd5be704c28 | manon-rond-point-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | c2ee71d5-9294-43c2-9f9a-c1cba60a080c | manon-rond-point-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | e33ab912-790e-4cc3-b532-1518cf8bdf7b | manon-rond-point-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | d7961e55-c6ed-443d-a3fa-e53fdc54fd26 | manon-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 3e16e56f-1b3d-43ad-a321-ef70e876a8e0 | manon-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 061b7386-762e-467c-9b9d-09470f92a27d | manon-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | f0a39044-5d2c-4a5f-82df-9c16820eebdf | manon-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | a2ab637e-c864-42d6-a7ae-4bd8817a95dd | manon-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | a581ec10-1e15-42d2-ba9b-18f968c65f39 | manon-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 23ddbf0e-4f6d-43d1-bc7d-69243454a4bb | manon-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 0e2b2802-d460-4eaa-bc76-c4da80e6bb29 | manon-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | a30bb77f-b445-45d8-9553-69f9f95d4c7f | manon-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 77d4237a-58c0-46aa-b136-2125e9ee96a6 | manon-temps-lie-2hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 20ab47b8-49bd-4bc0-b54e-ae8cb55aa7b2 | manon-temps-lie-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| manon | 469e1ffd-bc8b-466e-8858-9cc9f83efeb9 | manon-tomoe-derriere | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | a0d8ffde-c03a-4132-9182-35cfa18c384a | marisa-back-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 3d782d80-90d2-4dac-a551-7d1440154270 | marisa-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | fd10b2f0-9eae-4bd5-b435-745cc1f7417b | marisa-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | bbeef1e8-9287-453d-bc4f-d115974a9331 | marisa-caelum-arc | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 6884aee0-ea97-470d-9bb7-7d7337a9815f | marisa-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 9af93d94-e6d3-4ff4-8fd6-52900942192f | marisa-crouching-hk-charged | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | d9e2ffbc-e5f9-4ef3-88a9-304c2cb11113 | marisa-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | f7baabab-6ba6-4502-a5cd-d40f6ef8af15 | marisa-crouching-hp-charged | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | ccc15440-1a93-47d3-b418-0c19ffaa9ac9 | marisa-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 07ed2cc2-7120-4cd8-9717-ab94b69ef335 | marisa-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 51efb115-6a2f-4dab-979c-e122bba684b3 | marisa-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 4bdc72e5-bd38-4a84-bf76-77eeb11a22fa | marisa-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | abf6ef9d-b60c-41ca-98ed-86fdbb4a05bb | marisa-dimachaerus-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 98d29190-1a77-4567-a7f7-95659013c566 | marisa-dimachaerus-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 07d94252-18d9-46b4-a466-7b949a899564 | marisa-dimachaerus-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 9217a5dc-508e-4f69-a4ee-7ef8ea4cc947 | marisa-dimachaerus-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 1fc056f3-e4bb-4e38-a1f5-17ea3e58238b | marisa-enfold | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | f7a86d2f-1e98-4e54-9a74-7a066e144ab2 | marisa-forward-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 3eb3f810-dc04-40dd-82a6-dcad8a5eb0c1 | marisa-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 836eefa3-c5c3-4b9c-bdbf-c10d8d4955c8 | marisa-gladius-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 11b61a58-9052-4a0d-9afb-fa07a34e97a8 | marisa-gladius-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | b7eadec4-8fd6-4a2c-8bec-7e850cce87a5 | marisa-gladius-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | e9ce6c9c-9cf2-4e01-b562-957f93bf9244 | marisa-gladius-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 008eb6cd-42d9-4890-93e6-4c9989226aa2 | marisa-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | af1d4cda-8efa-4486-8538-58ffa69f3d6b | marisa-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 0fb71af6-f90c-4e8f-900a-86e4b1e27ae2 | marisa-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | af90da9b-b6e2-4ce8-a1cc-4ec156f3b2e2 | marisa-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 8b09cf50-8806-480a-ad0f-f84d8ecda4b0 | marisa-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 4b1a0068-0a3f-47ae-a6e7-25203715422a | marisa-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 50e0ba77-5871-45d0-b2c2-6cc3377bca12 | marisa-malleus-breaker | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 2c260a98-659f-4f5d-99be-937bbead788e | marisa-phalanx-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 5a668792-db6c-40cb-a688-0831f0b4cd36 | marisa-phalanx-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 6b7b0036-ebfa-4321-88a4-20f5f4a8a234 | marisa-phalanx-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 6055f004-87c8-4693-a2ae-4bbb05bc007a | marisa-phalanx-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 4c61549d-6bd2-47c7-b10a-4f06b4b6cc5f | marisa-procella | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | eec39fbf-0e15-4910-93db-bb00358f13cc | marisa-quadriga-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 3ee9366f-f7dd-455b-be30-b32cff494759 | marisa-quadriga-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | aa6c3d5d-ecea-4d7a-bbfb-55842c2495d8 | marisa-quadriga-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 0d5b60c4-22a5-4806-9c05-4dfec9991fb8 | marisa-quadriga-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | e563c895-a1c9-4bdf-b272-bd67571b9005 | marisa-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | cd89ca29-9d94-4bb5-8485-1cd1ef1b2f08 | marisa-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | f9981edd-a6d9-436b-baef-f8546d865ebb | marisa-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 670780a3-5cf4-4b2f-8005-47093baac13d | marisa-scutum | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | f66f9d3e-fefd-41f5-83ef-8096ff841e23 | marisa-scutum-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 9a7758e3-61b0-43f4-95fe-c266142a5928 | marisa-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 5d51d98d-1c65-42ac-bfbf-88a6d3acc0f9 | marisa-standing-hk-charged | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 49b3abad-1656-4da4-8ac5-bb08a6f0120f | marisa-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | d2a9ee6d-9154-449e-bd1e-59c3541cfb1e | marisa-standing-hp-charged | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | e481d5e5-c92e-4123-8b4f-15712e49d122 | marisa-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 0a0ee763-62ed-47a1-b118-8d3aa3069043 | marisa-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | dc37b5d4-ea8f-438d-bdcd-525c9c79ac54 | marisa-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 8da451d3-fce6-47af-99c2-bb7dfe30c4bc | marisa-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| marisa | 4a95f844-02b5-4424-ad10-807efc6c2e5f | marisa-tonitrus | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | bb451c18-e404-420c-9330-b425eb613dea | rashid-air-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | ac645307-8547-4842-ac04-0dcfce948526 | rashid-arabian-cyclone-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | d1be1e82-9053-47bd-8151-7d5685e77674 | rashid-arabian-cyclone-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | c784a575-3056-451f-bb91-29bc9d22c467 | rashid-arabian-cyclone-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | babc0054-e8a2-4cc6-9f45-3d6edf02fe7e | rashid-arabian-cyclone-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 199d95f3-0448-47ad-8755-907025ec73b6 | rashid-arabian-skyhigh-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | dc601d7e-3b68-489f-8cba-26af3dd27576 | rashid-arabian-skyhigh-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 0e176630-093f-45da-b14d-89aedc0351dd | rashid-arabian-skyhigh-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | a2c35da5-202c-47b5-ac09-1183910eddde | rashid-arabian-skyhigh-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 0c0a3ca4-6f2d-4636-af55-75e756d16ba3 | rashid-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 8cc71489-4897-48cf-b77e-e4ba87ac6843 | rashid-backup | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | c3456374-88d8-425e-9227-34890583d2df | rashid-break-assault | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 913b8ba5-30e6-4cd7-8f9f-0cd79b2734dd | rashid-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | a46571ba-1e14-45e1-9441-3a98b5ac4db3 | rashid-crescent-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | e8afff26-8248-4f84-80a8-5befd9bdccc9 | rashid-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 1b689c0d-f1d1-41a0-b2e5-ef32b1ce40c3 | rashid-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 0ef71f00-7096-4b97-b00a-c89c475d12b9 | rashid-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | b459f906-d710-4305-ba06-76effc05a122 | rashid-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 8659ff28-3220-4b5c-9cf3-0fbe338f5447 | rashid-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | b3d37c80-b3a9-4ba6-896f-73b95da5aee1 | rashid-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | b4065448-f993-46cb-85fe-b765647c2ce0 | rashid-eagle-spike-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 32fadd68-b3b8-441b-a714-0654a5d79ed9 | rashid-eagle-spike-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 3ab2ac67-fa8f-4ccd-bee1-dc4e0bec45b2 | rashid-eagle-spike-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 5bf6c6c0-defe-4990-99a3-cc725a757fa2 | rashid-eagle-spike-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | daa36e5b-1e69-4950-9ad3-884c96f97b84 | rashid-flapping-spin | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | f5f54109-2d7e-407c-88fb-2d131ac0c6a3 | rashid-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 4f6cfd73-f0f6-4042-bb5b-769c11b4dd93 | rashid-front-flip | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 634dfdac-eb2c-4f55-9ee8-57a4a748d6f6 | rashid-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | b687a0aa-1c7a-4bed-8eda-4dc14b9ce951 | rashid-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | af4a3e5d-e550-4e1f-9b77-0f9b8040de93 | rashid-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 9d9f4f43-8e2e-4265-ae16-a327357e001e | rashid-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | a277674a-e207-425d-8f63-48d8c7a2882f | rashid-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | d3d1c380-8ba4-4244-8ac5-57a5fab0b5c3 | rashid-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | d2ff8a2b-fff2-435e-bee9-b2ce37e4a5f3 | rashid-nail-assault | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | de7eb545-550e-4acb-a16a-f9d10e0a7c18 | rashid-rising-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 7e1b3557-f159-4bac-b373-dbe05a25f5fa | rashid-rolling-assault | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | de27f855-6232-4098-bf00-d718e26ceb7e | rashid-run | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 94467707-05fc-4ade-bdcd-12e9679fc4be | rashid-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 65f8a26b-8db1-461c-8155-fe2654d0ef93 | rashid-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | fce51be8-e862-490e-b57e-7affd1ced909 | rashid-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | bbb5a868-6323-476f-b782-6bca034959ff | rashid-side-flip | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | f5d14482-3cfd-402c-8218-d4e56b3d41b1 | rashid-spinning-mixer-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | fa221c4d-c9b5-45dc-a9ba-8f97c39c77fe | rashid-spinning-mixer-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 9cf342db-df03-4ca4-8784-95862d8beb5b | rashid-spinning-mixer-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 86626a4b-1d07-42fe-bba5-20484654b14d | rashid-spinning-mixer-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 0ff95150-dd6d-425b-aafd-01c14ade4ed5 | rashid-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 43355763-5313-4141-9de1-f8781f0639df | rashid-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | b4516e12-a45f-47da-bce5-23fa71cf697e | rashid-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 3ebe138a-f24d-4696-995f-5cb6451d037a | rashid-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 00ddec54-466d-4653-ae84-2f0d148fbf25 | rashid-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 7252c75a-2123-4170-a542-1b21911c43ec | rashid-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | ac08f4e5-d61d-4455-81cf-78044483eeec | rashid-tempest-moon | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | e51dd2a6-7cdf-45a3-b5a9-61e6e3ff99b3 | rashid-whirlwind-shot | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| rashid | 40c5c26a-bcd7-4df0-8ff6-952dbec9b6c5 | rashid-wing-stroke | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | ed764818-867d-4188-b9fa-71bbd7cfb0b8 | ryu-aerial-tatsumaki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 3ecf9a07-5539-4a4a-81fd-ab90b9fc3b61 | ryu-back-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 01f701c5-e0b5-402d-94b3-d8166c686370 | ryu-back-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | b0e5f2a6-29fd-4aa0-98ed-05b9b248343a | ryu-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 1bc5bdf1-5471-4f09-ab27-093482bf5954 | ryu-collarbone-breaker | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 06cb478c-ed44-47f7-99ec-1a2dbe45e8b5 | ryu-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 477ec830-0cbf-4400-950a-d6fce904306a | ryu-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | e12c05a0-4a5f-43fd-84a1-c258ca99f18f | ryu-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | b52d8627-51e8-46f2-84b9-021d41d34c9c | ryu-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 46093af4-c66f-4941-94a6-939a0730f7d5 | ryu-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | e1ab790a-51d5-4461-b496-6fdc8f50a703 | ryu-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | db46db6f-26dd-4638-8397-d235750929b9 | ryu-denjin-charge | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | e1307e32-ef9f-4b5e-8a9f-b64863bf9303 | ryu-denjin-hadoken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 5a55599e-800f-4831-886c-345d1e88a9ef | ryu-denjin-hashogeki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 5593524d-b9d7-4203-8ec3-15b483ed23dc | ryu-denjin-od-hadoken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 2a83a1ca-a458-4e02-a496-40ff278964c2 | ryu-denjin-od-hashogeki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 7be699d6-7021-450a-823f-235eb9513561 | ryu-forward-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 252287ef-f49c-4347-ace6-76dce143ef59 | ryu-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 3605c1b6-1f6b-42a3-981d-6ce606d760b4 | ryu-fuwa-triple-strike | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 3922bb25-41b4-4ce9-bfb2-e0678d0a5c8e | ryu-h-hadoken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 41ad35a2-c41d-4b51-ab6c-4e2a37a526b5 | ryu-h-hashogeki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 46ac6533-8a93-4783-8c70-7c466e27cfe5 | ryu-h-high-blade-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 5e4a8e85-0eac-4c86-a343-b69c17ce9fec | ryu-h-shoryuken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 7f7f8816-f6ac-40ef-9f3b-bc8c64d9666c | ryu-h-tatsumaki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | f0b5f99f-692a-4706-8f68-40bb4e4f0015 | ryu-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | ec64fb71-06c8-4603-9aa5-b74f40f2df06 | ryu-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 199c77e5-2064-4090-8f9b-4226af92a68d | ryu-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 034b09a8-7a59-4aff-a35d-90a022094914 | ryu-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 51da4eb2-83d2-4afe-981d-cdcd52582424 | ryu-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 389b1337-3b9b-4ea6-9d90-14383797c6b4 | ryu-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | f1ca42ab-4cd4-414c-9b06-b70f5a3e8b43 | ryu-l-hadoken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 3dd9e618-062b-483b-bc45-d2819c97030b | ryu-l-hashogeki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 12b670e7-d91b-4590-beee-a414726f7c23 | ryu-l-high-blade-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 2e127af1-553f-477c-81ce-c4027213b237 | ryu-l-shoryuken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 6e6d7e31-71b6-499c-b53a-a8725267879c | ryu-l-tatsumaki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 99caf881-5986-41a8-bb7f-9282a7409cad | ryu-m-hadoken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | ed402fb3-798e-4b66-9d94-5098a28369a1 | ryu-m-hashogeki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | ca18582a-dc15-4ad5-9eb3-86b2b269b2b0 | ryu-m-high-blade-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | ba18efcc-5215-49f9-94b0-bab116f79f43 | ryu-m-shoryuken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | f45ed8ef-efc2-45fe-af69-6af95691af3c | ryu-m-tatsumaki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 271fc7f0-8035-4945-8b68-40e43ab42725 | ryu-od-aerial-tatsumaki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | cd656302-682f-41ea-9ea3-4dd48e121764 | ryu-od-hadoken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | ec9b330f-ae5e-457b-993e-8c60ea0afabd | ryu-od-hashogeki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 1aefba80-f15b-4bf2-b96c-a06155070371 | ryu-od-high-blade-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | d525aa87-9b71-44a0-a0b2-77e152dd23a8 | ryu-od-shoryuken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 1b2cae35-53bd-4334-9e29-c1be501d0567 | ryu-od-tatsumaki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | af1a30a4-7bf1-49eb-bd60-76b10861c470 | ryu-sa1-shinku-hadoken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 522dafee-8e8a-4a86-8e02-e26d17137507 | ryu-sa2-shin-hashogeki | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 560625d9-16b9-484e-883d-6ace0adeb39c | ryu-sa3-shin-shoryuken | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | e0df5bcc-6bf7-4f08-9d8d-311ea95ed89f | ryu-solar-plexus-strike | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | b2362378-1411-45ae-a0f0-014e898042e0 | ryu-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 2ca379aa-216c-4bae-829d-50b8c273b7d7 | ryu-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 631c8d80-2000-4756-be30-bb1ffbe52060 | ryu-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | ad5f57f5-f156-4d20-8f0a-f4da4772831d | ryu-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 7ac63edd-7d49-4a1a-9a2f-09ad04dc7d0d | ryu-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | b33dd19c-add5-4420-8856-163fab932249 | ryu-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| ryu | 3c25e9b9-0031-42b4-a9ef-c68ca1907f9c | ryu-target-hp-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 1122e5ca-33ab-48f3-839a-db11a92df23c | sagat-crouching-heavy-punch-2hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 1fb18471-9519-48c4-a54a-47fece316b9d | sagat-crouching-light-kick-2lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 631788a5-6005-40b1-9173-eaa1668986c6 | sagat-crouching-light-punch-2lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | a6da1642-2c37-4a21-96a8-d5df30bbeb35 | sagat-crouching-medium-kick-2mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 7670ef08-4cb0-4bea-adca-ef9bd51c2cba | sagat-crouching-medium-punch-2mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 1e826784-d57a-4c4a-9dbe-855978d54a99 | sagat-greedy-tiger-214k-6mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | e2da3a09-5904-4ebf-8355-967b4c814fca | sagat-greedy-tiger-214kk-6mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 80fb142f-e718-4351-8b6b-a6a6223d154e | sagat-high-step-kick-6hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 8191ea60-a364-46b8-af7a-48e5c796a226 | sagat-high-tiger-shot-236hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 1c662b91-d7e2-4642-8505-bbec0dad0176 | sagat-high-tiger-shot-236mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | fdd1def1-6703-48c2-9c0f-d6bf382fdf4d | sagat-high-tiger-shot-236mphp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | b4493b55-f441-4b45-af15-1c88cf599e88 | sagat-jumping-heavy-kick-j-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | a96dc8ea-2f1b-4fae-917e-7f9566745116 | sagat-jumping-heavy-punch-j-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | e652b451-8724-4ada-b51d-6abcd1f7f340 | sagat-jumping-light-kick-j-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | a7931a35-5e71-41c3-a02c-29b0e9cda8a9 | sagat-jumping-light-punch-j-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | e27fde8a-f1f6-4127-a3a2-3e95daa81d34 | sagat-jumping-medium-kick-j-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 95d6f194-a3eb-43dc-96b4-54e0563d2173 | sagat-jumping-medium-punch-j-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 20bc0d65-d8c0-47fa-947f-9f1e0e0ad2e0 | sagat-low-step-kick-6lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | bdc4b7b4-5fd3-4c2c-9e3e-cd7d200add22 | sagat-low-tiger-shot-236lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | b5b68ad9-2961-46b5-a1b1-748391d7e3ba | sagat-low-tiger-shot-236lpmp-or-236lphp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 83a016d1-13cd-4b74-913a-7a38c7790d96 | sagat-middle-step-kick-5mk-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 2eb50331-ac42-40e4-ae0b-693f148ef844 | sagat-mighty-tiger-214k-6lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | e49aa0bc-fea3-4618-806a-4096f4fd3b56 | sagat-mighty-tiger-214kk-6lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 89790402-97e4-4ffb-900c-357f2a8978b8 | sagat-nova-tiger-214k-6hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | d72a2eba-6a3e-4e0f-8bcc-96c148357d13 | sagat-nova-tiger-214kk-6hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | ee10d430-3404-4acc-868c-9733ceefb6b9 | sagat-savage-tiger-214214k | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 93e64c1f-c1b2-409d-93e0-e6da471b0b8e | sagat-savage-tiger-pendulum-br-side-switch-214214k-4 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 35e63821-7384-4b81-8ec6-18f728f88ac3 | sagat-savage-tiger-raid-br-damage-214214k-5 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 5d5b68a2-68ae-4083-85d7-a928c8e6b495 | sagat-savage-tiger-stomp-br-oki-214214k-2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 85849d3a-12f9-4f1e-9177-920460342b0d | sagat-savage-tiger-zenith-br-launcher-214214k-6 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 14be0a8f-f528-4c4f-84db-f4d5eb19e7f9 | sagat-standing-heavy-kick-5hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | e4fe4542-2341-41c0-bf33-c12587764b40 | sagat-standing-heavy-punch-5hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | cb40fb77-ad4e-4c87-b356-559401001528 | sagat-standing-light-kick-5lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 757453f1-253e-4d42-bed1-1347b68af148 | sagat-standing-light-punch-5lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 4a6edef5-5184-45df-b332-4146fb16e9e2 | sagat-standing-medium-kick-5mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 0d0c933c-45e4-4064-8ab8-533839b0bfc3 | sagat-standing-medium-punch-5mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 40875f29-b3fa-4f6e-9ad6-a8d69cd2c2cf | sagat-tiger-cannon-236236p | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | bda71928-a789-41ae-b774-b391699d1d53 | sagat-tiger-carry-4lplk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | aaf6d3df-7ecd-4a73-aa58-85aeed417565 | sagat-tiger-hang-lplk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 5c2e6303-f4a9-4a02-95d9-20028ad10f0f | sagat-tiger-heavy-elbow-6mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | dae8c392-b9cc-4a2d-96fb-752e7d3e0e85 | sagat-tiger-kick-2hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 1c6a8286-4ea0-454b-8fa6-03902af6fd73 | sagat-tiger-knee-crush-236hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 5fab46b1-9288-406b-ad2d-a26aba0a8dd3 | sagat-tiger-knee-crush-236kk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 76deda71-a355-4b5c-a0c5-fc41d1cd8d98 | sagat-tiger-knee-crush-236lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 86e06c95-6bbe-4ad4-842a-b22e46cdbc13 | sagat-tiger-knee-crush-236mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 6e81e836-5b6e-49b6-9e63-e7eb7895d622 | sagat-tiger-monolith-4hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 1ffae614-098c-465a-a2c7-7944d57800f6 | sagat-tiger-nexus-214hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 7965380d-dbe7-4ff6-b747-87b7708c38a9 | sagat-tiger-nexus-214kk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 733b2825-ba9f-42a6-b563-e8edb7b96815 | sagat-tiger-nexus-214lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | a6059d53-b985-4dcd-85bd-d8430b33f8bf | sagat-tiger-nexus-214mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 44025b46-7c90-4946-8732-a2bfcd4d91ca | sagat-tiger-rise-2mp-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 41856c71-04c5-4358-a13c-95ec2d0f2ccf | sagat-tiger-slash-2mp-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | fde534cd-5f83-44f5-8904-bc4621185740 | sagat-tiger-sting-5hp-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 3ce7e264-3236-45aa-ad20-5b574a4e60f3 | sagat-tiger-uppercut-623hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | cf6c7a7b-d2c0-443c-8419-47ea312ab61c | sagat-tiger-uppercut-623lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 31d8df84-a2fd-42a4-b706-5a2d0d0bf664 | sagat-tiger-uppercut-623mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | d877e908-2212-4549-aefd-c6a437fd19c4 | sagat-tiger-uppercut-623pp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 7485228b-fee0-4930-af0d-e4d69bc3947b | sagat-tiger-uppercut-hold-623-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | 1288b242-aeaa-475d-ba3d-07e53b4d1b2c | sagat-tiger-vanquisher-236236k | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| sagat | f38a62a7-09db-4a94-9d2b-0b8422680d44 | sagat-tiger-vanquisher-ca-236236k | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | c5b400be-6611-41cb-8fd8-ba4ba5c69960 | terry-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 09cdfa8f-b62d-41f8-b2ac-ef7488c9bd1c | terry-burn-knuckle-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 7299be56-d518-4794-a111-2e0608615b76 | terry-burn-knuckle-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | ee5354a6-15f6-48ad-ae18-4b7da6c9423c | terry-burn-knuckle-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 43b7c674-ae0d-48cd-8cdc-61098b7ce4ca | terry-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | d5d208ff-bfae-440f-9d47-c2236543ebb4 | terry-crack-shoot-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 4fb976b2-3ab2-4586-a3b7-610f9ce3faa6 | terry-crack-shoot-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | d44ccb19-614d-4ee6-9f50-263b93271d28 | terry-crack-shoot-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | ab1d9137-f56e-4055-9113-6980c39d7386 | terry-crack-shoot-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | b6dd3ebf-80dc-40af-b69a-cbb8b8fb8935 | terry-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | ba6e696c-80f2-4f22-be2d-66042011f432 | terry-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | cee5a655-806c-4b20-8266-e4cd467b3bce | terry-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | b974f59f-b625-4188-91de-5c573c1bcc2e | terry-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 14702465-d5f5-44cd-8848-338de1426ce1 | terry-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | c49c61ff-d013-47be-83f1-d9eab3dd2df9 | terry-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 563d6042-ecce-48c0-9e28-90056a509e5b | terry-fire-kick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 83045762-537a-4ac0-91f4-ff7e6a5094a0 | terry-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 34e678af-4277-4e6d-869a-483f73f93416 | terry-hammer-punch | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 08f65128-4b48-4a17-b73f-fc039f7664dc | terry-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | e43326d2-278e-461b-994d-14205ba9687c | terry-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 59cfffe0-2b84-4020-ac71-61dd3746e7e4 | terry-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | fc8dba88-8de7-4656-b6ac-6198538940d6 | terry-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 9c1eebcf-2c81-44c8-86a2-d701afcc1284 | terry-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 08d6e0a3-298d-463a-b406-df8db280b17e | terry-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | a5f4ab80-ee51-478c-b755-b194b7e81cb6 | terry-passing-sway | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 9f5a8d0c-9cb5-4b92-8e3b-1bcff4c29c8e | terry-passing-sway-knee | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | f0ae8fc6-fb7d-4eac-98d5-bd30542a90cd | terry-passing-sway-lariat | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 4bb58091-85b9-4dc4-8a1c-eca25085c1b7 | terry-power-charge-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 11e5667b-aece-434e-87af-8725413ce7f4 | terry-power-charge-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | beca6874-e2c1-4761-89d8-31d00e871ada | terry-power-charge-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | c65414e9-b51d-4dc2-a5a8-64ca1bcb201a | terry-power-charge-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | f0b380fa-6ddd-488c-adf0-1db4b1d7b6d4 | terry-power-drive | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 8884e700-85de-4019-89d6-a3270b0a4026 | terry-power-dunk-tc | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | ed082d1e-0859-4473-ade6-a007105f7b7d | terry-power-shoot | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 77115c40-9327-4d01-905c-ade6640b41b7 | terry-power-wave-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 5d6ce0dd-31e3-4f44-8ce4-45424fbbc86d | terry-power-wave-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 850d653e-51e4-406e-9a32-420ad09e7ef2 | terry-quick-burn-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 0459a697-071e-49f9-a203-120441648d22 | terry-quick-burn-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | a278ec2e-546e-467a-9c88-cdd85ef6aadb | terry-rising-tackle-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 8f186d65-1026-4806-b232-8bb1914471f1 | terry-rising-tackle-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | e19b086b-c4ca-4162-acdc-4572fa4fa173 | terry-rising-tackle-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 8a73a65b-99dd-447b-99cd-c85d3741d711 | terry-rising-tackle-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 9ef9c617-af65-417a-8637-b239ebadb818 | terry-round-wave-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 62651720-45a7-4d2b-ac4d-8a723ff1b3ce | terry-round-wave-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 427a1f73-626c-4394-8eee-01b252a8c005 | terry-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 97ba8ecf-cac1-4dbe-8ac2-92118bbc7f34 | terry-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | f5e14a1b-ade5-48b1-8bd8-37cad87bb8d0 | terry-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | ad986d67-c68e-4671-b22e-69b3385b11ae | terry-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 9b64f2ea-0cba-43d7-98fb-0dee13ffcda9 | terry-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 119758cd-b526-4ba2-bdf1-9f6b9460c56f | terry-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 3282e211-5c99-4d0b-a6bf-6e487c3b91b9 | terry-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 8a7d747b-5373-4ee7-965f-67fd4e08e01e | terry-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| terry | 78294e57-b7fe-4023-903f-62b6cd4392bd | terry-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| yasmine | 88e637c4-1c01-4b41-b1e4-8d0443cbf8a6 | yasmine-alon-236hp-6p | COMMAND_SOURCE_MISSING |
| yasmine | 6d0eac80-e601-47e0-bbde-5177918119c7 | yasmine-alon-236lp-6p | COMMAND_SOURCE_MISSING |
| yasmine | 94df5acf-0ac9-4ec7-b05e-f270b6820620 | yasmine-alon-236mp-6p | COMMAND_SOURCE_MISSING |
| yasmine | 3485b1cd-dfdf-40d6-9125-42c8ebda906a | yasmine-alon-236pp-6p | COMMAND_SOURCE_MISSING |
| yasmine | 21410a7b-74b6-40da-8639-7ae894a98e35 | yasmine-alon-bayani-236hp-6p | COMMAND_SOURCE_MISSING |
| yasmine | 77e1c548-9ad0-4224-abee-8d3beab0840a | yasmine-alon-bayani-236lp-6p | COMMAND_SOURCE_MISSING |
| yasmine | 8dcbfc4d-c704-4397-bffa-791e12496d45 | yasmine-alon-bayani-236mp-6p | COMMAND_SOURCE_MISSING |
| yasmine | 67ba636f-2fb0-4356-b49d-6031c96a44a1 | yasmine-alon-bayani-236pp-6p | COMMAND_SOURCE_MISSING |
| yasmine | 495aa9a0-c9b0-4484-b845-856a538832e4 | yasmine-crouching-heavy-punch-2hp | COMMAND_SOURCE_MISSING |
| yasmine | dcda78cf-a5be-4d31-9fed-d18bcf34e9ac | yasmine-crouching-light-kick-2lk | COMMAND_SOURCE_MISSING |
| yasmine | bcdb1926-b1a6-4a85-b8d0-25dcf464fd87 | yasmine-crouching-light-punch-2lp | COMMAND_SOURCE_MISSING |
| yasmine | 44237752-18cd-4aa7-8e78-9670a78a6e2e | yasmine-crouching-medium-kick-2mk | COMMAND_SOURCE_MISSING |
| yasmine | 03a3c78f-d49e-4dff-9857-08856fd40b25 | yasmine-crouching-medium-punch-2mp | COMMAND_SOURCE_MISSING |
| yasmine | 368baecb-d1cc-4164-923b-a7512ad7cf55 | yasmine-daloy-ng-tubig-236hp | COMMAND_SOURCE_MISSING |
| yasmine | 8416a1f7-69c0-4cc6-8c94-62e5d599ce1f | yasmine-daloy-ng-tubig-236lp | COMMAND_SOURCE_MISSING |
| yasmine | 5844bf2f-b0b1-4fc0-a357-5fba2447c274 | yasmine-daloy-ng-tubig-236mp | COMMAND_SOURCE_MISSING |
| yasmine | adcc4f11-0d51-41b5-9b6b-2ad04b63ac46 | yasmine-daloy-ng-tubig-236pp | COMMAND_SOURCE_MISSING |
| yasmine | d66223a6-df43-4ce9-801b-dbc83cf21bf1 | yasmine-gunting-na-pabagsak-2hk | COMMAND_SOURCE_MISSING |
| yasmine | 4301622d-102a-40e1-b583-2b02db739e54 | yasmine-hila-kamay-4lplk | COMMAND_SOURCE_MISSING |
| yasmine | 1c09f2c2-5300-4355-b988-3756a2c8c5dd | yasmine-hiwa-ng-kalangitan-236236k | COMMAND_SOURCE_MISSING |
| yasmine | de33eadd-d757-4794-a2bb-ad809acf4247 | yasmine-hiwang-pababa-6mp | COMMAND_SOURCE_MISSING |
| yasmine | c030fb18-aa67-4ec7-923e-a54179286219 | yasmine-jumping-heavy-kick-j-hk | COMMAND_SOURCE_MISSING |
| yasmine | 84d5d088-b584-42e0-a20b-5627d457eb00 | yasmine-jumping-heavy-punch-j-hp | COMMAND_SOURCE_MISSING |
| yasmine | d58cda82-9f2a-4cc7-b421-7ab696cbbd32 | yasmine-jumping-light-kick-j-lk | COMMAND_SOURCE_MISSING |
| yasmine | 7949413b-1ea3-41cd-83be-250b5759aca1 | yasmine-jumping-light-punch-j-lp | COMMAND_SOURCE_MISSING |
| yasmine | 697468cc-a9d2-4531-b974-b919aec0fc12 | yasmine-jumping-medium-kick-j-mk | COMMAND_SOURCE_MISSING |
| yasmine | 3e76ed52-4ebe-4bcd-a44d-2a60960c5e55 | yasmine-jumping-medium-punch-j-mp | COMMAND_SOURCE_MISSING |
| yasmine | c7bb118a-d199-4e59-bc32-e1b6d34de8c8 | yasmine-kidlat-na-hiwa-5lp-lp | COMMAND_SOURCE_MISSING |
| yasmine | f10077f2-758d-43a5-b0ff-d6a801a17762 | yasmine-kulog-236k-k | COMMAND_SOURCE_MISSING |
| yasmine | 0ac54e2d-a6af-4ab1-8e54-bfea51f851a4 | yasmine-kulog-236kk-k-or-236k-kk | COMMAND_SOURCE_MISSING |
| yasmine | 3ca23e5c-4ae7-4047-b8fb-9b72af2c62c1 | yasmine-kumbinasyong-pampabagsak-2mk-hk | COMMAND_SOURCE_MISSING |
| yasmine | 720e4c8e-a93c-457e-b1c8-6ec230947b61 | yasmine-linya-ng-liwanag-214214p-4kk | COMMAND_SOURCE_MISSING |
| yasmine | 104a6f55-f256-4521-9190-15e6daf741ea | yasmine-lipad-ng-agila-623hk | COMMAND_SOURCE_MISSING |
| yasmine | b79816b6-b16f-47f7-8cbf-32221c3914e6 | yasmine-lipad-ng-agila-623kk | COMMAND_SOURCE_MISSING |
| yasmine | 802cddff-6b17-4069-9fbb-520d81a10914 | yasmine-lipad-ng-agila-623lk | COMMAND_SOURCE_MISSING |
| yasmine | a2be59a6-469a-4501-a18d-515c58849bd4 | yasmine-lipad-ng-agila-623mk | COMMAND_SOURCE_MISSING |
| yasmine | 8ecba6ae-0914-473a-a91b-9619dc3b7ad6 | yasmine-nakatagong-lakas-214214p | COMMAND_SOURCE_MISSING |
| yasmine | 9e92c699-6f60-4553-b1db-322bbdcb32e0 | yasmine-pamumukadkad-ng-sampaguita-236236p | COMMAND_SOURCE_MISSING |
| yasmine | b55d287e-ca8e-46bd-bf81-db53775b8294 | yasmine-pamumukadkad-ng-sampaguita-ca-236236p | COMMAND_SOURCE_MISSING |
| yasmine | f7faa5a2-62a0-4c72-abf3-91c16631a7c2 | yasmine-pigil-ulo-lplk | COMMAND_SOURCE_MISSING |
| yasmine | 72e48438-5de6-43cb-b421-41a5105dd213 | yasmine-standing-heavy-kick-5hk | COMMAND_SOURCE_MISSING |
| yasmine | de5b585d-28cd-4be8-b495-2611b995ef2f | yasmine-standing-heavy-punch-5hp | COMMAND_SOURCE_MISSING |
| yasmine | 77b8c07a-0085-40ab-bae7-ad37aadd44ce | yasmine-standing-light-kick-5lk | COMMAND_SOURCE_MISSING |
| yasmine | 42bfb7b6-2511-48e4-b50e-7045fc676ba9 | yasmine-standing-light-punch-5lp | COMMAND_SOURCE_MISSING |
| yasmine | 329ee255-394a-49be-9ecb-e9fb2b982370 | yasmine-standing-medium-kick-5mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| yasmine | 6b816c73-20c6-4590-8389-2bd0db98b251 | yasmine-standing-medium-punch-5mp | COMMAND_SOURCE_MISSING |
| yasmine | 13f79a86-bf36-4f35-b39b-84af16365872 | yasmine-sunod-sunod-na-sipa-1-5mk-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| yasmine | b255814b-57aa-4668-a729-ab6c35b61c35 | yasmine-sunod-sunod-na-sipa-2-5mk-mk-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| yasmine | fcc23bd3-7104-4cb5-8421-000a2a5e6db7 | yasmine-talim-ng-hangin-214hp | COMMAND_SOURCE_MISSING |
| yasmine | 48628cf4-d99e-420b-907e-16435f3650fe | yasmine-talim-ng-hangin-214lp | COMMAND_SOURCE_MISSING |
| yasmine | b075f9f1-5c86-43bd-b391-c6d8857d7ddb | yasmine-talim-ng-hangin-214mp | COMMAND_SOURCE_MISSING |
| yasmine | 46bc481b-23be-4394-9781-cd11b77d52bd | yasmine-talim-ng-hangin-214pp | COMMAND_SOURCE_MISSING |
| yasmine | e1b79767-8628-4a4a-b36d-570655e8c039 | yasmine-tatlong-hiwa-5mp-mp | COMMAND_SOURCE_MISSING |
| yasmine | 5223be98-b774-44f3-93c6-f525e9bcd293 | yasmine-ulan-236k-p | COMMAND_SOURCE_MISSING |
| yasmine | 6038b360-5979-4a12-a69f-7b2cbc35edd4 | yasmine-ulan-236kk-p-or-236k-pp | COMMAND_SOURCE_MISSING |
| yasmine | 62dd7d64-e7b7-48f4-a2d7-58ed81feb84d | yasmine-walis-na-pabagsak-4hk | COMMAND_SOURCE_MISSING |
| zangief | 32d6df45-6fb9-44f0-b1b4-ce65096c3ad4 | zangief-back-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 581d6f69-8903-42e9-9cab-95516dc08c62 | zangief-borscht | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 24fc2e5a-1a00-4483-8038-a699a7910f5a | zangief-borscht-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 329420bc-a269-4ab5-a252-f1ee48c76224 | zangief-ca | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | bb752526-d05a-42bc-bdd1-f73213ad600b | zangief-crouching-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | ee8ba451-ed5e-4393-960b-d97117872093 | zangief-crouching-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 5174a94f-0f1e-4401-91f8-79b38bac474b | zangief-crouching-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 8dcd6126-66d9-4a5f-96ff-97375f0c06aa | zangief-crouching-lk-rapid | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 78f4195c-362c-47db-87fa-4368e14c8e1a | zangief-crouching-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 4990d250-0915-4ecc-99a2-d53f2d679b1b | zangief-crouching-lp-rapid | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 0eb8fc53-158b-4b05-a749-1f18edee59fe | zangief-crouching-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | eeea022d-c2c8-4806-b098-9ac01ac64768 | zangief-crouching-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | d9586bd9-7772-4848-ae3c-07678e098dce | zangief-cyclone-wheel | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | a906b77a-fac7-4af5-b504-6703c9c326fb | zangief-dropkick | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 2ebe76b8-1ebb-4858-8768-506d735f6950 | zangief-flying-headbutt | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 87266be2-2f2d-46e3-9be4-82e6205ba22a | zangief-forward-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 6710753b-e2a8-4912-8c71-b4aa83fc9b46 | zangief-forward-throw | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | a2d40675-a0c3-48c0-a4fd-404dba335d57 | zangief-headbutt | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | bf6c5e62-ea0c-4a56-a50f-86b0315639e0 | zangief-jump-down-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | cdc01926-65fc-48d3-936e-ec17651e24ce | zangief-jump-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | d947a02d-bc33-4488-88e6-d3c47ded3cdf | zangief-jump-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | c14f9dc6-0bf8-4bfd-a851-597b6c2ea538 | zangief-jump-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | e8255860-cfad-4d52-b565-2b93285b5d35 | zangief-jump-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 7c3aa976-8051-46a7-bc51-484cc42a09cd | zangief-jump-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 62d308f8-1d29-4e0f-9b43-936bfd951583 | zangief-jump-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 35687da1-7e42-4f95-8291-997afe2a87d4 | zangief-knee-hammer | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | dcaa6b8e-a890-4fc1-8cd0-5b0eda3fc46e | zangief-lariat | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 607a609a-965c-47f3-8bf9-1d85f46fef7d | zangief-lariat-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 1476cf16-7efd-4570-8d43-32ce58ac52f4 | zangief-power-stomps | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 97e3e20a-2e9c-42fb-a469-db1ffad3461f | zangief-sa1 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 556f01e9-26c5-44fe-a040-6a9df119224b | zangief-sa2 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 07544f32-f3c5-4664-9769-2c6b6a51fbec | zangief-sa3 | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 5e58e436-e252-4954-9376-ee931ac2274f | zangief-spd-h | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | b66ea408-f849-471c-9c83-6752ac418f97 | zangief-spd-l | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | da70ca46-5657-4c92-b64f-a5d183868d2c | zangief-spd-m | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 289e792a-b1df-465c-9a70-625738990b50 | zangief-spd-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 282a7574-4278-4991-96b8-aace72061e14 | zangief-standing-hk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 97f29df8-fc86-4644-bdfc-6b8a4b7d5cbd | zangief-standing-hp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 69221b02-e8c8-4f6b-9705-cd7d6adc577a | zangief-standing-hp-charged | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | c5461be8-2131-4ab4-93cb-f33ce62b4abb | zangief-standing-lk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | bb3ef38f-80b6-4859-b45a-3e5e161bf47d | zangief-standing-lp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 99fb6d15-984b-4a5e-9769-d090c0e2db21 | zangief-standing-lp-rapid | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | ff7232e2-08d6-4e11-937d-267012e2bfb6 | zangief-standing-mk | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 65d09147-c7e2-4118-a327-812b7aee734c | zangief-standing-mp | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | 68528506-5339-4057-86bd-0516bc7b0471 | zangief-suplex | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | affd4f00-0ad5-4471-a887-2fafde1f6ba2 | zangief-suplex-od | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
| zangief | bfb8b0aa-7e06-413c-9060-3d1ae5d1ddf0 | zangief-tundra-storm | MOVE_SOURCE_MISSING, COMMAND_SOURCE_MISSING |
