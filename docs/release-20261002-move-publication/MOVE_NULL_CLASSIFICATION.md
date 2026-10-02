# SF6DNA move publication remediation — 2026-10-02

Base: `aba1746bf062ca87f8745cecd9fea5973db121cc`. DB capture: `2026-10-02T08:59:41.841144+00:00`. All database operations in this batch were SELECT only. Production unchanged. Counts are current DB evidence, not game verification.

## Evidence rule

Classify NULL as N/A only with positive field-specific official/applicability evidence. Neither throw category nor a general missing-data note proves N/A. No field-specific N/A proof was found in the queried evidence/notes. General incomplete-capture notes do not prove that every NULL field is applicable. Therefore all NULLs remain UNKNOWN; confirmed REAL_MISSING=0 and NOT_APPLICABLE=0. No filling or rewriting occurred. This conservative classification is complete but applicability verification is still pending.

| Field | Value present | NULL / UNKNOWN | NOT_APPLICABLE | REAL_MISSING |
|---|---|---|---|---|
| on_hit | 1575 | 364 | 0 | 0 |
| on_block | 1422 | 517 | 0 | 0 |
| damage | 1905 | 34 | 0 | 0 |

## Exact NULL review list

| Character | Move ID | Slug | UNKNOWN fields |
|---|---|---|---|
| aki | 61b21c00-8448-4264-ae8b-50bbcebb7c91 | aki-back-throw | on_hit, on_block |
| aki | dcd74045-c552-4b2a-bc4b-227deeaf9742 | aki-entrapment | on_block |
| aki | 9862cfc2-b16b-48a6-9f2c-a4f698abff92 | aki-forward-throw | on_hit, on_block |
| aki | ea563fe3-90d2-4816-b9da-6310611ab084 | aki-jump-hk | on_hit, on_block |
| aki | add403d6-41fe-4395-b9b9-8d9f24e20e96 | aki-jump-hp | on_hit, on_block |
| aki | c5b3f30f-6d75-4ff5-a73d-2310856de401 | aki-jump-lk | on_hit, on_block |
| aki | 5f9ea511-7dec-40bf-ab39-31d6eb4190e9 | aki-jump-lp | on_hit, on_block |
| aki | 389dc6e2-eb99-4077-b93f-379bdac1edce | aki-jump-mk | on_hit, on_block |
| aki | 88a66202-ea61-4f19-a337-1e0952935b36 | aki-jump-mp | on_hit, on_block |
| aki | 5ad21670-2e9a-44e3-8e35-b3eb76173713 | aki-orchid-spring | damage |
| aki | 6378f5d0-4700-4cce-90c0-5e8c96352fe8 | aki-sinister-slide | damage |
| aki | 3f8da7a4-682c-479e-a1b6-47c453e3e6a1 | aki-snake-step-h | on_hit, on_block, damage |
| aki | 41c2cf57-937b-4984-8def-033f2cdc52b0 | aki-snake-step-l | on_hit, on_block, damage |
| aki | fb83abe8-2b71-40cc-9b56-7ae12c48d490 | aki-snake-step-m | on_hit, on_block, damage |
| aki | 20ab4271-c79d-442a-934a-73035f8c98a0 | aki-snake-step-od | on_hit, on_block, damage |
| akuma | a44c6608-1e01-40f7-b05b-5ea899b42c8d | akuma-air-tatsu | on_block |
| akuma | ffe7b417-928a-4ec8-a618-94e092c01a02 | akuma-air-tatsu-od | on_block |
| akuma | 642de152-1642-42e5-87bc-8df6e002d4d6 | akuma-ashura-senku | on_hit, on_block, damage |
| akuma | 0d0bf082-34ab-4cc1-a26b-6a227d6f0f31 | akuma-back-throw | on_block |
| akuma | 09fd5956-dda3-492b-a0e8-3ae06f2c35e6 | akuma-demon-gou-rasen | on_block |
| akuma | cdcb128c-113d-4657-aa2e-b6153969c2ab | akuma-demon-gou-zanku | on_block |
| akuma | 2191ffb5-985d-4502-998f-0548be4f5786 | akuma-demon-raid | on_hit, on_block, damage |
| akuma | cff38b55-0e9d-4eb0-9985-0c7a1d91129e | akuma-demon-raid-od | on_hit, on_block, damage |
| akuma | 2ba11fb4-4e19-4d72-8b71-87778d097c9d | akuma-demon-swoop | on_hit, on_block, damage |
| akuma | 131d987f-722c-4e08-8852-d6b81302d1ab | akuma-forward-throw | on_block |
| akuma | b2b9c27e-2aec-47cb-b7e2-a918e0186932 | akuma-jump-hk | on_hit, on_block |
| akuma | e04c5b9a-2c16-4b39-86ce-28f30f24fb31 | akuma-jump-hp | on_hit, on_block |
| akuma | 256b4f38-7a75-437f-89b5-b187eb576f0e | akuma-jump-lk | on_hit, on_block |
| akuma | 042db52d-5484-4097-b2a9-df47b8d96889 | akuma-jump-lp | on_hit, on_block |
| akuma | 7c2add4a-6967-4f3f-b1c8-719a61a608e7 | akuma-jump-mk | on_hit, on_block |
| akuma | 921f1862-981a-42d2-9c9a-17a423221c78 | akuma-jump-mp | on_hit, on_block |
| akuma | bf19018c-f842-4627-8e5b-8535fceb836a | akuma-oboro-throw | on_block |
| akuma | 0977d5cb-329c-4829-969a-da3bc7954cf5 | akuma-raging-demon | on_block |
| akuma | 946e201d-443f-42fc-ace6-485647936bb5 | akuma-standing-mp | on_hit, on_block |
| akuma | 69a0d966-a9fe-4479-8f73-7c78e5e4cc23 | akuma-tenma-gozanku | on_block |
| akuma | 86460772-32a6-449e-b696-cf308eb20c98 | akuma-tenmaku | on_hit, on_block |
| akuma | 1eb0895a-7a85-4f94-a2f8-f70509bf9b12 | akuma-zanku-hadoken | on_hit, on_block |
| akuma | b70ea6e7-7429-4802-aacb-efcfdd7ba62f | akuma-zanku-hadoken-od | on_block |
| alex | 9b8e20f3-1bef-48e4-ae7f-8aa3dc16aeb3 | alex-aerial-knee-smash-623lk | on_block |
| alex | c6b7057f-1029-427f-b5be-7c6b899eda2d | alex-aerial-knee-smash-623mk | on_block |
| alex | 1330719f-f6a7-43c0-8b6b-65d4e72ac6d3 | alex-arm-lock-lplk | on_block |
| alex | 46bc5d76-8274-4235-be2b-5c09e1035dff | alex-dangerous-armbar-br-spiral-ddt-2pp-2lplk | on_block |
| alex | 7b009800-5747-4b7d-a2c1-7163f1826d48 | alex-exit-prowler-stance-2pp-8 | on_hit, on_block |
| alex | f312a35c-8737-45fc-a731-3c07ecda80d3 | alex-guillotine-hammer-4lplk | on_block |
| alex | 4298e722-af4f-4f5d-95aa-511c5612044d | alex-hyper-takedown-br-death-valley-bomb-2pp-lplk | on_block |
| alex | 6532d41e-6d5e-406c-8040-6a5b8af429d2 | alex-illegal-knees-2lplk | on_block |
| alex | fa2e772a-edf7-4bc6-91b5-a268233449ca | alex-jumping-heavy-kick-j-hk | on_hit, on_block |
| alex | a9d9c4e7-283b-4752-b4e0-479d0f1918c0 | alex-jumping-heavy-punch-j-hp | on_hit, on_block |
| alex | e23d9ea0-95fa-413d-a422-522925408935 | alex-jumping-light-kick-j-lk | on_hit, on_block |
| alex | 48afacd7-cf3c-4abe-9aef-dfb65cead3f4 | alex-jumping-light-punch-j-lp | on_hit, on_block |
| alex | 3ee78b99-47b1-4000-a31a-bf83fb0d1b96 | alex-jumping-medium-kick-j-mk | on_hit, on_block |
| alex | dcaea7bc-4cc8-414f-8a01-6cfae24f14e7 | alex-jumping-medium-punch-j-mp | on_hit, on_block |
| alex | cde1ae13-ff8c-46ed-898a-9b6cb9dbfef9 | alex-low-retreat-2pp-4 | on_hit, on_block |
| alex | ea2c911c-7bc1-4d56-a43b-44fae109c7ad | alex-low-rush-2pp-6 | on_hit, on_block |
| alex | fed2bcf4-7765-4414-a749-34bd33b51aa1 | alex-od-hyper-bomb-63214pp-6-backturn | on_block |
| alex | e7b534dd-8d0c-4200-ba60-e79ae126020a | alex-omega-wing-buster-pp-sa2 | on_block |
| alex | a9c526e6-55e2-400e-943a-30dbd838497e | alex-power-bomb-63214hp | on_block |
| alex | a62a7836-7c5b-4e47-a4e9-61dbfa2f082a | alex-power-bomb-63214lp | on_block |
| alex | 9168f1d7-f1db-4052-9671-ce8d7af1f787 | alex-power-bomb-63214mp | on_block |
| alex | 6cda610f-fab6-4960-bf8c-95a85af896a8 | alex-power-bomb-63214pp | on_block |
| alex | a89e15c4-dc2b-4c32-9cae-f3552d77d202 | alex-power-drop-63214p-backturn | on_block |
| alex | 32d9fde6-3c18-4bec-a93e-09a7dbdd6cd6 | alex-power-drop-63214pp-backturn | on_block |
| alex | 8c40a2bd-8778-4ddd-991b-d0cda1925665 | alex-prowler-stance-2pp | on_hit, on_block |
| alex | 506b622b-765d-43c4-8111-321848d0fb0d | alex-tactical-hop-2pp-lk | on_hit, on_block |
| blanka | d174c7e0-e631-4207-900d-03aaa63ce1db | blanka-air-rolling | on_block |
| blanka | 357470d2-3863-4987-8771-b89e3c582ce9 | blanka-air-rolling-od | on_block |
| blanka | eeab0c5f-2d4f-4b71-8062-8b7626f734ab | blanka-back-throw | on_block |
| blanka | a56cdd07-fc2f-4db3-b0d7-ce61681d18f0 | blanka-capcom-frame-025 | on_hit, on_block |
| blanka | 1b6c55e6-ff78-47e7-8ad2-5b9dd2fcbae9 | blanka-capcom-frame-027 | on_hit, on_block |
| blanka | 74d45937-d537-4b26-b647-7c6e9e1794ef | blanka-capcom-frame-028 | on_hit, on_block |
| blanka | aecbfb5f-ee4f-4c6a-98a4-134bc15d0b71 | blanka-capcom-frame-029 | on_hit, on_block |
| blanka | 546e20dd-3c53-4ba7-b23b-0e8ec51439b8 | blanka-capcom-frame-059 | on_block |
| blanka | 1b9b1946-b557-44fb-8826-d2d1622e5e0d | blanka-capcom-frame-060 | on_block |
| blanka | 71d43070-0b11-4a7d-9755-91cc302ce47d | blanka-capcom-frame-061 | on_block |
| blanka | 33e58140-48a5-453e-a9a4-535bc6d3cc18 | blanka-capcom-frame-062 | on_block |
| blanka | 68679da9-8f16-418b-8079-e81d465b82ee | blanka-capcom-frame-063 | on_block |
| blanka | 52d3711f-7e87-4323-b57f-b38e52fc1e0a | blanka-capcom-frame-065 | on_block |
| blanka | 714b8de7-9430-4eac-967a-649545f4957f | blanka-capcom-frame-071 | on_block |
| blanka | c4716f62-791b-4452-8bd1-3e48f1fd668c | blanka-capcom-frame-072 | on_block |
| blanka | 1dc7c2cf-1f8b-4e58-bd89-964e2ed41411 | blanka-capcom-frame-081 | on_block |
| blanka | 5b878f4d-f6e7-4a7b-9373-b07193be0f5b | blanka-capcom-frame-082 | on_hit, on_block |
| blanka | da025585-53da-4463-a9b9-7170df202667 | blanka-capcom-frame-083 | on_hit, on_block |
| blanka | 09fbdf70-6920-4387-bb5b-cf9de1b681e8 | blanka-chan-bomb | on_hit, on_block |
| blanka | 39349618-5bd9-4434-90b5-a5f681f33ede | blanka-forward-throw | on_block |
| blanka | b2328f87-fed4-4399-8829-6c71513c6606 | blanka-jump-hk | on_hit, on_block |
| blanka | 9b3e02d5-69bf-4ce8-a5cf-6973033a263d | blanka-jump-hp | on_hit, on_block |
| blanka | 26d3ac7d-b340-4d33-bab0-718f9d4e7ac0 | blanka-jump-lk | on_hit, on_block |
| blanka | 3ae030e0-1daa-4016-86fc-baf177f9dbe2 | blanka-jump-lp | on_hit, on_block |
| blanka | fc2d5631-c2c1-4b62-b9db-f81c4fd8c5d0 | blanka-jump-mk | on_hit, on_block |
| blanka | 040687f1-eb85-4a6e-9997-83dfddc8387c | blanka-jump-mp | on_hit, on_block |
| blanka | 1f71334e-800a-42c4-a403-d8d8fd869e8a | blanka-neutral-jump-hp | on_hit, on_block |
| blanka | 6c011d0e-53e7-44e1-bb2d-836c1c97b24e | blanka-rolling-cannon | on_block |
| blanka | 46cc493a-facd-40dd-ad34-74cd7005acc4 | blanka-sa2 | on_hit, on_block |
| blanka | f607e0b6-2b61-498f-bba0-a4e1ac1550d6 | blanka-wild-hunt-h | on_block |
| blanka | fa5e4269-6a41-4d3e-b719-d87e268e871d | blanka-wild-hunt-l | on_block |
| blanka | acaeb0fd-8461-4f24-b72d-ceb9db8a655d | blanka-wild-hunt-m | on_block |
| blanka | 18d2bee8-0233-4ac0-967c-a9bdb370c64c | blanka-wild-hunt-od | on_block |
| c-viper | a0841ad5-a95c-43f8-81d4-46842fa7eba6 | c-viper-back-step-44 | on_hit, on_block |
| c-viper | f0ddeeeb-503a-404e-9b4b-89f4d38fd873 | c-viper-focus-force-forward-step-66 | on_hit, on_block |
| c-viper | 493cb95f-ca38-4ca2-bc65-3b708e81e4e4 | c-viper-forward-step-66 | on_hit, on_block |
| c-viper | 524cbb71-a557-47bf-8e72-1c2a90927182 | c-viper-high-impulse-lplk | on_block |
| c-viper | 39b5b08b-13b6-480e-91e7-44b997748277 | c-viper-high-jump-forward-2-9 | on_hit, on_block |
| c-viper | 5fdba88e-ceae-4d2e-9df7-b66b5fe60dcd | c-viper-high-jump-vertical-2-8 | on_hit, on_block |
| c-viper | 0894f523-66f8-45de-966d-d7fec4c97be3 | c-viper-jumping-heavy-kick-j-hk | on_hit, on_block |
| c-viper | 01afbb21-1c1f-4ac7-82ee-48c50654668c | c-viper-jumping-heavy-punch-j-hp | on_hit, on_block |
| c-viper | 8fc36ad0-ee77-492d-8965-11067f4a2eff | c-viper-jumping-light-kick-j-lk | on_hit, on_block |
| c-viper | 2d75ffb0-1bac-405b-a149-8e7f28e3f0f3 | c-viper-jumping-light-punch-j-lp | on_hit, on_block |
| c-viper | f0125277-c547-4549-aedb-d2be9fa3bf8f | c-viper-jumping-medium-kick-j-mk | on_hit, on_block |
| c-viper | a9376105-7a20-46d0-b259-0a2d05f8ec7f | c-viper-jumping-medium-punch-j-mp | on_hit, on_block |
| c-viper | e2e8ddfd-0d71-44a0-9e3b-d3a80bf7c2eb | c-viper-neutral-jump-heavy-kick-8hk | on_hit, on_block |
| c-viper | 93188acc-38c2-42cc-86d1-7a6cdabb17d8 | c-viper-seismic-hammer-feint-623p-k | on_hit, on_block |
| c-viper | 58a97045-a46a-4692-839c-f72d31a05a0e | c-viper-thunder-cradle-4lplk | on_block |
| c-viper | 914e1504-a559-445c-888b-b90bd2d85ad0 | c-viper-thunder-dash-feint-214p-k | on_hit, on_block |
| c-viper | 6eb936a0-b8db-48cd-84f1-6536b140ad79 | c-viper-tracer-combination-214hp-6pp | on_block |
| cammy | 2e4348f3-6108-41bc-a0ff-3cac35362291 | cammy-air-throw | on_block |
| cammy | 5003bab7-95fe-405f-960b-f1af0fa4151b | cammy-back-throw | on_block |
| cammy | 00398ea1-7adc-44eb-8edc-321538bec402 | cammy-forward-throw | on_block |
| cammy | 18521e87-1e5f-40d7-8ed5-20760e94c8ee | cammy-hooligan-silent | on_hit, on_block, damage |
| cammy | 5e300bea-0365-4a60-b820-f42679cd2c7e | cammy-hooligan-throw | on_block |
| cammy | 9c176e07-df77-49eb-a10f-86f0d248694c | cammy-jump-hk | on_hit, on_block |
| cammy | 3f29b3ca-9e60-4469-b102-07091159ce98 | cammy-jump-hp | on_hit, on_block |
| cammy | 6060d323-fa4e-4b00-845f-131524b49f6d | cammy-jump-lk | on_hit, on_block |
| cammy | 4cbf54f3-dcb6-4cae-be0b-53d2da935a6f | cammy-jump-lp | on_hit, on_block |
| cammy | 4dd98dcb-5860-4283-8152-31ef60d7a057 | cammy-jump-mk | on_hit, on_block |
| cammy | bf6e9444-04e0-42bb-8bd0-529fd8cb7858 | cammy-jump-mp | on_hit, on_block |
| chun-li | 8ced9bfd-a69f-413a-bc27-e582fd1ef4e0 | chun-li-frame-019 | on_hit, on_block |
| chun-li | 89db0d36-7b4b-49ba-a0bd-7a31f38da407 | chun-li-frame-025 | on_hit, on_block |
| chun-li | 17afcb64-90cc-464b-bb9b-37530e74aa01 | chun-li-frame-026 | on_hit, on_block |
| chun-li | 39e0489f-53c9-4849-ac1f-219e126cb6af | chun-li-frame-027 | on_hit, on_block |
| chun-li | c061710c-e6ad-4638-86dc-90dd3161adda | chun-li-frame-028 | on_hit, on_block |
| chun-li | 61e12281-6b2b-4931-9163-dc77d196321f | chun-li-frame-029 | on_hit, on_block |
| chun-li | 3b3fcce0-ee7a-4b34-8069-05bf3be3fba1 | chun-li-frame-045 | on_hit, on_block |
| chun-li | 5ec2d77a-ba11-4a4c-b970-bc3aea2859b9 | chun-li-frame-046 | on_hit, on_block |
| chun-li | 25e37a56-bce0-4392-be4d-dadf28734203 | chun-li-frame-047 | on_hit, on_block |
| chun-li | fc7a9212-57ab-4c0e-bc42-d06bbeb0af86 | chun-li-frame-048 | on_hit, on_block |
| chun-li | 172b1493-a2b6-4ea5-a53a-a05ea5e09650 | chun-li-frame-062 | on_block |
| chun-li | 6b5687c5-02d7-4214-8df6-30587b3e6cd1 | chun-li-frame-066 | on_block |
| chun-li | 9bc191ba-9467-4532-aaa9-1df05fecab11 | chun-li-frame-067 | on_block |
| chun-li | fd80aded-a75d-4608-a275-82303a0d49bd | chun-li-frame-068 | on_block |
| chun-li | b99276eb-6300-4769-9ae5-7552ea21c134 | chun-li-jump-hk | on_hit, on_block |
| chun-li | 4f9ca18b-c107-40b6-be86-38582a638e68 | chun-li-jump-hp | on_hit, on_block |
| chun-li | 71252786-a5ad-45b4-92f9-bbf0b879f5cb | chun-li-jump-lk | on_hit, on_block |
| chun-li | 5fc475ca-207b-49f2-9489-7c16d4aad5db | chun-li-jump-lp | on_hit, on_block |
| chun-li | 24182c23-c657-4ea8-b722-90a1e8ba3ac5 | chun-li-jump-mk | on_hit, on_block |
| chun-li | 86f4031d-8472-4ac2-8425-725e925bec5c | chun-li-jump-mp | on_hit, on_block |
| dee-jay | 373ec31c-6d7d-414e-a3e2-39d1e1c17e0d | dee-jay-air-slasher-l | on_hit, on_block |
| dee-jay | e8b09fbd-4b14-49a8-a1b7-52067f87409b | dee-jay-back-throw | on_block |
| dee-jay | d051fd45-5f0f-42da-b15c-49eca2bf8dcd | dee-jay-capcom-frame-029 | on_hit, on_block |
| dee-jay | c19eaa3a-aa16-4e44-9428-ff6e69f7d051 | dee-jay-capcom-frame-096 | on_hit, on_block |
| dee-jay | 40ee2c2c-00cb-43af-a311-bd194e69c283 | dee-jay-capcom-frame-097 | on_hit, on_block |
| dee-jay | b60102f5-af5c-492a-bca6-0c0277bf69b7 | dee-jay-crouching-mk | on_hit |
| dee-jay | f6538624-3bad-4968-a1b3-1292f9d96311 | dee-jay-forward-throw | on_block |
| dee-jay | 3c831bed-9a12-49a5-bd29-6b9d282a35e3 | dee-jay-funky-dance | on_hit, on_block |
| dee-jay | 3f8211e6-9fdc-45ba-9558-bd5908199ec4 | dee-jay-jackknife-l | on_hit, on_block |
| dee-jay | 7ccdd714-f92b-4519-8294-d0c74b2880bc | dee-jay-jc-backdash | on_hit, on_block |
| dee-jay | 02cfea2b-ffef-4597-a02e-1ce45681924f | dee-jay-jc-backdash-od | on_hit, on_block |
| dee-jay | a6c2fe5a-3708-4852-a006-a81964e63106 | dee-jay-jc-dash | on_hit, on_block |
| dee-jay | 2d1e8e24-0795-486b-97ab-7e1b92a18724 | dee-jay-jc-dash-od | on_hit, on_block |
| dee-jay | ec176c91-b69d-4988-86f3-579ca6b1f5b4 | dee-jay-jump-down-lk | on_hit, on_block |
| dee-jay | c6b4199e-1e8e-421a-8826-d091f8028c61 | dee-jay-jump-hk | on_hit, on_block |
| dee-jay | 83273f07-dab4-4632-bbce-975f2c9ff506 | dee-jay-jump-hp | on_hit, on_block |
| dee-jay | efd4a014-1971-4185-84e4-43168d2dc991 | dee-jay-jump-lk | on_hit, on_block |
| dee-jay | c23de894-0516-4edd-9b97-5b14e536cd32 | dee-jay-jump-lp | on_hit, on_block |
| dee-jay | dc32dc03-29b1-4507-95cd-53e49ff1d5fa | dee-jay-jump-mk | on_hit, on_block |
| dee-jay | 0f8ed5f9-a022-4246-9eef-36b077a1441d | dee-jay-jump-mp | on_hit, on_block |
| dee-jay | cb65cb89-a54c-4847-aee3-6de1ea6131c6 | dee-jay-jus-cool | on_hit, on_block |
| dee-jay | 49f0d4ea-618e-4ce9-94f3-8e6db0b9f7b7 | dee-jay-sobat-l | on_hit, on_block |
| dee-jay | 155af88f-6cb8-40c1-b585-ebfdfb7d2ad3 | dee-jay-speedy-maracas | on_hit, on_block |
| dhalsim | c2521186-291d-41f1-a0c9-f2ea5cb8fe2e | dhalsim-back-throw | on_block |
| dhalsim | 78d5b69e-a7f9-4cce-a4bc-89c1d50e1c72 | dhalsim-capcom-frame-029 | on_hit, on_block |
| dhalsim | 8b0bcb30-8a92-4dbe-ae43-c923e3155e67 | dhalsim-capcom-frame-030 | on_hit, on_block |
| dhalsim | c12a4683-e5fa-4fdd-945b-3e587a1aa158 | dhalsim-capcom-frame-056 | on_hit, on_block |
| dhalsim | 37922781-5a5e-441d-adfe-3637609f78b1 | dhalsim-capcom-frame-057 | on_hit, on_block |
| dhalsim | 74c5e2cb-1058-4e46-9cff-bad782d425be | dhalsim-capcom-frame-060 | on_hit, on_block |
| dhalsim | 1d8d27d8-01e9-4c92-af23-67d564d9cef7 | dhalsim-capcom-frame-061 | on_hit, on_block |
| dhalsim | 93b78193-d185-4578-9f3e-f91bba52bb50 | dhalsim-capcom-frame-063 | on_hit, on_block |
| dhalsim | d29a6b51-cf11-4f25-9925-07906e807ee4 | dhalsim-capcom-frame-064 | on_hit, on_block |
| dhalsim | df4c97a6-f2d2-4bda-8fab-66a8745928cc | dhalsim-capcom-frame-065 | on_hit, on_block |
| dhalsim | b130fd01-3bd1-40a3-be52-7772886411e8 | dhalsim-capcom-frame-066 | on_hit, on_block |
| dhalsim | 6ccdcffd-89fb-47d5-becf-b62dc711cba7 | dhalsim-capcom-frame-067 | on_hit, on_block |
| dhalsim | acbfd880-c7d0-4843-b61d-e37bef2a6d40 | dhalsim-capcom-frame-068 | on_hit, on_block |
| dhalsim | 048eec3e-c6ea-4b0a-b97e-cdff5ef2f469 | dhalsim-capcom-frame-073 | on_hit, on_block |
| dhalsim | fb5dbe18-c93b-44bc-b0f3-de514def8c60 | dhalsim-capcom-frame-074 | on_hit, on_block |
| dhalsim | c70b28e3-644d-4297-8478-6510d952d49e | dhalsim-capcom-frame-079 | on_block |
| dhalsim | 51530b14-bfe3-4255-91f1-5d709a320eac | dhalsim-capcom-frame-080 | on_hit, on_block |
| dhalsim | 8f9ede3c-6a0c-4ebb-8ff2-42548e0d6ec2 | dhalsim-capcom-frame-081 | on_hit, on_block |
| dhalsim | 4e125e65-9f18-45d0-8b83-471b0170267c | dhalsim-drill-kick | on_hit, on_block |
| dhalsim | 9752070d-0d30-4c46-a24d-4c537a3ddb7b | dhalsim-forward-throw | on_block |
| dhalsim | 0b6a35ba-373b-42b9-8ec0-fa4f38698641 | dhalsim-jump-hk | on_hit, on_block |
| dhalsim | 824741ed-cbb4-4085-873f-d40df42337cf | dhalsim-jump-hp | on_hit, on_block |
| dhalsim | 6aa58f08-34cb-44a1-9553-abfa59ee3503 | dhalsim-jump-lk | on_hit, on_block |
| dhalsim | c9cfc2ca-5e15-484d-819d-250d76d23b6c | dhalsim-jump-lp | on_hit, on_block |
| dhalsim | 1af59f00-98c1-461e-a15b-8f76e4f61217 | dhalsim-jump-mk | on_hit, on_block |
| dhalsim | ed6d3e34-5a79-4bc3-80df-ed571fd5a8b8 | dhalsim-jump-mp | on_hit, on_block |
| dhalsim | 9dfa14b1-f690-4ee3-9676-6664b392ec77 | dhalsim-sa2 | on_hit, on_block |
| dhalsim | dd77df63-0221-4c46-8768-a0a81b108524 | dhalsim-yoga-comet | on_hit, on_block |
| dhalsim | 9733b299-b1c2-4ca7-888b-4c5cf4c61105 | dhalsim-yoga-comet-od | on_hit, on_block |
| dhalsim | 86214164-dd87-4f41-a325-5e217251199e | dhalsim-yoga-float | on_hit, on_block |
| dhalsim | 28cddd9b-7abc-4125-b7a9-eb7a15d40fa5 | dhalsim-yoga-mummy | on_hit, on_block |
| dhalsim | 5a0df114-d300-4fae-b768-611a72836440 | dhalsim-yoga-teleport | on_hit, on_block |
| e-honda | df343417-cd07-4dcc-8d71-c682ea6d2a5e | e-honda-back-throw | on_block |
| e-honda | 31e4e2ba-9028-415d-b513-11572253dbef | e-honda-capcom-frame-061 | on_hit, on_block |
| e-honda | 544cc8fd-1062-48ff-aea7-1b48d0122c6d | e-honda-capcom-frame-062 | on_hit, on_block |
| e-honda | b3591ffd-6a68-49cc-92ff-b60cb8a0d62e | e-honda-forward-throw | on_block |
| e-honda | e2545791-7e98-48cc-9e97-a18f78513a17 | e-honda-jump-down-mk | on_hit, on_block |
| e-honda | 0ef4ec45-b564-4153-a8f4-3bcfb3a4a54c | e-honda-jump-hk | on_hit, on_block |
| e-honda | 04ca30b1-afdc-461b-8271-349e6a822de9 | e-honda-jump-hp | on_hit, on_block |
| e-honda | d0dbdc65-03cd-4752-84ba-9502ffa0a3f7 | e-honda-jump-lk | on_hit, on_block |
| e-honda | c41aa523-ad17-43b2-858d-024ce62a270a | e-honda-jump-lp | on_hit, on_block |
| e-honda | 421d8ba7-45e8-4a97-a48b-72105957b25f | e-honda-jump-mk | on_hit, on_block |
| e-honda | 13d8afd8-0d3c-4e0b-8e6f-f96c5d54fe83 | e-honda-jump-mp | on_hit, on_block |
| e-honda | 932ca604-2349-473e-aa31-9bb59a3c69ee | e-honda-neutral-jump-hp | on_hit, on_block |
| e-honda | bdd88a74-6cd2-47b7-859c-906ad60f3c7d | e-honda-oicho-h | on_block |
| e-honda | 0643f73e-f4a9-4cc6-bc73-2c907fa1113c | e-honda-oicho-l | on_block |
| e-honda | 843494eb-c51b-441a-aa6a-e5ffa13ae975 | e-honda-oicho-m | on_block |
| e-honda | 9d96fccd-787e-450a-87ae-44016fd9f74c | e-honda-oicho-od | on_block |
| e-honda | 78d7e1fb-4715-4e25-af6b-93e321c6bf8f | e-honda-sumo-dash | on_hit, on_block |
| e-honda | 45ff83bf-7d74-403b-88b2-c7cd585fbf56 | e-honda-sumo-dash-od | on_hit, on_block |
| e-honda | 7a391155-29e3-4e61-8463-349399343d54 | e-honda-sumo-spirit | on_hit, on_block |
| ed | 4b143800-5803-4bcb-b2f7-0b3939146dc4 | ed-back-throw | on_block |
| ed | bdc8a84c-243a-4d97-80fd-6d96fa2698a6 | ed-forward-throw | on_block |
| ed | fe1009d4-44e0-4702-950b-0d5ebf69862f | ed-jump-hk | on_hit, on_block |
| ed | 62bb74b1-ab83-414d-9e83-fb21f539399c | ed-jump-hp | on_hit, on_block |
| ed | bb38c8c9-c5d3-41b3-a800-10a6e53344be | ed-jump-lk | on_hit, on_block |
| ed | 8b1fbe0c-461e-459f-9e51-aad6833afd46 | ed-jump-lp | on_hit, on_block |
| ed | f4e388a0-7616-48b6-9b97-266ced50ebb0 | ed-jump-mk | on_hit, on_block |
| ed | b009be13-ba4b-4075-916b-d5ca5cb0ed4b | ed-jump-mp | on_hit, on_block |
| ed | 1f8944c8-bcab-4f26-816b-7face5ac90d4 | ed-kill-rush | on_hit, on_block, damage |
| ed | 93f83e6d-9f9c-43fc-aaaf-70f954d44dcc | ed-psycho-flicker-h | on_hit, on_block |
| ed | bf258f77-218f-4cf9-ab54-9de59bb304c9 | ed-psycho-knuckle-lv1 | on_block |
| elena | d9d7d368-3583-4535-9d64-ac6872e0758d | elena-back-step-44 | on_hit, on_block |
| elena | 16fe033a-0d3d-4270-8706-3b29a6d1d139 | elena-forward-step-66 | on_hit, on_block |
| elena | 3e2fd952-26b8-4942-85fb-651512e650ba | elena-jumping-heavy-kick-j-hk | on_hit, on_block |
| elena | 6800af4c-4cb0-4746-9d38-d5018258239b | elena-jumping-heavy-punch-j-hp | on_hit, on_block |
| elena | 03636a7c-3511-43a3-ac8f-f44441b3f97d | elena-jumping-light-kick-j-lk | on_hit, on_block |
| elena | b8d2ab8e-c245-4fbd-8518-9d332befb15f | elena-jumping-light-punch-j-lp | on_hit, on_block |
| elena | d26c2adf-536b-4e81-9e75-7e49fefefa7d | elena-jumping-medium-kick-j-mk | on_hit, on_block |
| elena | 34ad9991-74c8-4819-a88d-0c1204cd4573 | elena-jumping-medium-punch-j-mp | on_hit, on_block |
| elena | 029c9fbe-9ec0-4142-83cc-7aa456943c38 | elena-leg-lift-throw-4lplk | on_block |
| elena | 402f9dee-ca5b-4ddb-8a69-c76f150caff5 | elena-leg-tackle-lplk | on_block |
| elena | e7008dc1-c61b-440e-bd0a-c25dd2416988 | elena-lynx-song-236hp | on_hit, on_block |
| elena | 61398b6e-3e45-4ac8-8350-545f06d3ac47 | elena-lynx-song-236lp | on_hit, on_block |
| elena | a2203168-0b8c-44b9-9493-1b75e1f275d6 | elena-lynx-song-236mp | on_hit, on_block |
| elena | f5490cd6-dd8a-4050-9e98-82320951a393 | elena-lynx-song-236pp | on_hit, on_block |
| elena | 02a62e54-a6ea-4222-b6b0-bc5fe71e6652 | elena-lynx-whirl-236p-6hp | on_hit, on_block |
| elena | 8460e337-f30b-4c31-9057-cf9afaf56eb9 | elena-lynx-whirl-236p-6lp | on_hit, on_block |
| elena | 26fd9989-85d3-482b-bcf2-44f173193997 | elena-lynx-whirl-236p-6mp | on_hit, on_block |
| elena | ddc55cad-6882-4625-8927-805c4551509b | elena-lynx-whirl-236pp-6p | on_hit, on_block |
| elena | 3814450b-c6eb-496e-afa0-50ad1e39d0ad | elena-raptor-range-j-mp-j-hp | on_hit, on_block |
| elena | 047cd83f-8110-424d-9069-8e1886b46aef | elena-soaring-raid-j-lp-j-mk | on_hit, on_block |
| guile | 9887a4fc-5935-4d09-9504-a326f6d3640e | guile-frame-037 | on_hit |
| guile | cbc187f2-53f7-4075-a555-f51bd443bddf | guile-frame-038 | damage |
| guile | 691fc93c-afe9-4390-ae5e-aa8a49de482d | guile-frame-039 | damage |
| guile | 64c6f070-1497-4852-bc19-18c051a346c2 | guile-frame-040 | damage |
| guile | 83ad9057-9361-4de0-93f5-f3e3353105ac | guile-frame-041 | damage |
| guile | e9f02f89-e447-4d3d-95ba-a7062d5587b3 | guile-frame-042 | damage |
| guile | 40c95b20-76f0-4056-ae56-fee47784f3a9 | guile-frame-043 | damage |
| guile | 94e9ef6b-c696-4c51-baef-f49af33bf7f2 | guile-frame-044 | damage |
| guile | 7fef2076-927c-4f5c-a765-a155350ee8b6 | guile-frame-062 | on_hit |
| guile | 1d634ae8-f10b-4791-9ee5-4ebd401872d4 | guile-frame-064 | on_hit, on_block |
| guile | 815bf11c-4392-4df2-93f6-646e6f6e776b | guile-frame-067 | on_block |
| guile | f5980889-233a-4ed9-819d-594703955bf2 | guile-frame-068 | on_block |
| guile | cafad44f-9cf0-4b50-9e47-48d038deefda | guile-frame-069 | on_block |
| guile | b41c4eb5-c444-4159-b985-e63fe60a10ed | guile-frame-070 | on_block |
| guile | fc2abf30-f6d7-4bf8-9d79-aef1a7e17c2b | guile-jump-hk | on_hit, on_block |
| guile | 61dfcdd2-d807-4ee4-8c60-ce890cd4fee5 | guile-jump-hp | on_hit, on_block |
| guile | 2f49252a-2e1f-4e01-8537-2d5f44ea1acd | guile-jump-lk | on_hit, on_block |
| guile | de67e7d0-be9a-4696-89dd-1ec2cfcebd66 | guile-jump-lp | on_hit, on_block |
| guile | 6e8b1005-078d-48a0-b18b-998ac9cfcbf4 | guile-jump-mk | on_hit, on_block |
| guile | 8153e082-daca-4e51-ae51-61e705150be3 | guile-jump-mp | on_hit, on_block |
| ingrid | e13e81a4-55ee-4080-a156-f088c56df4b8 | ingrid-gravity-drop-4lplk | on_block |
| ingrid | 59d6f7e0-928a-43bb-bcf0-ce90c8f69463 | ingrid-jumping-heavy-kick-j-hk | on_hit, on_block |
| ingrid | 78a246c6-7c64-4143-aeb4-dd0e68ef7720 | ingrid-jumping-heavy-punch-j-hp | on_hit, on_block |
| ingrid | 37be78a6-8061-49a5-8e19-9b00a5244ed9 | ingrid-jumping-light-kick-j-lk | on_hit, on_block |
| ingrid | 46862ac1-c8f8-4aaf-95d3-4c22cf7379bb | ingrid-jumping-light-punch-j-lp | on_hit, on_block |
| ingrid | 473156b0-0500-4d8b-8960-21f725345e39 | ingrid-jumping-medium-kick-j-mk | on_hit, on_block |
| ingrid | 7a7e74ff-40b3-4008-aeda-0515ea8656ed | ingrid-jumping-medium-punch-j-mp | on_hit, on_block |
| ingrid | 4ef25e1d-afed-41ef-8d11-54f917b32b9d | ingrid-order-of-the-sun-0-stock-214214p-0-stock | on_hit, on_block |
| ingrid | 6413aa87-0e47-49d2-93ef-bc94a010179e | ingrid-order-of-the-sun-1-stock-214214-p-1-stock | on_hit, on_block |
| ingrid | b6bc235a-79d2-46f3-ba3e-92d958bf1868 | ingrid-order-of-the-sun-2-stock-214214-p-2-stock | on_hit, on_block |
| ingrid | 3658815c-407c-4aa2-a068-f8f80ea685fd | ingrid-satellite-leap-j-hk-j-hk | on_hit, on_block |
| ingrid | 076d1989-9455-4c47-a440-f481b7e6bfeb | ingrid-solar-burst-1-stock-j-214hp-1-stock | on_hit, on_block |
| ingrid | a9f2303e-ff13-40bb-9089-d907a8b7efe6 | ingrid-solar-burst-1-stock-j-214pp-1-stock | on_hit, on_block |
| ingrid | 378d69bb-6f99-453f-988f-57dbbc83e9f2 | ingrid-solar-burst-2-stock-j-214hp-2-stock | on_hit, on_block |
| ingrid | 044ab472-3a6c-4777-a0fe-530c3dd182f8 | ingrid-solar-burst-2-stock-j-214pp-2-stock | on_hit, on_block |
| ingrid | 2c31c0cb-4d0f-48b8-8bbe-fef4bff88c34 | ingrid-solar-burst-j-214lp | on_hit, on_block |
| ingrid | 4ce0a704-d05a-41a5-9973-f1d30ca5b118 | ingrid-solar-burst-j-214mp | on_hit, on_block |
| ingrid | 44bec95a-fd1f-40bb-8b97-091b21b4fa74 | ingrid-solar-burst-j-214pp | on_hit, on_block |
| ingrid | aafb7458-4fb7-4cc8-acf8-d637ffbac022 | ingrid-strange-knuckle-lplk | on_block |
| ingrid | 686f0058-9334-4c85-833d-8dbc2973ad97 | ingrid-sun-flare-214lp-hold-ok | on_hit, on_block |
| ingrid | 5dbaff2a-f404-471b-ade9-603e3220f500 | ingrid-vanishing-sun-back-4kkk | on_hit, on_block |
| jamie | ef0ac821-3719-428f-976f-dce9b299453f | jamie-frame-021 | on_hit, on_block |
| jamie | 1d42c55b-0dbe-44e1-aeaf-3f47f5d7d897 | jamie-frame-030 | on_hit, on_block |
| jamie | badf2c88-8b03-4a9d-bf5b-3623090ab005 | jamie-frame-035 | on_hit, on_block |
| jamie | 62a9d028-e70a-401f-adc0-d4d131819f01 | jamie-frame-038 | on_hit, on_block |
| jamie | 799268da-a1f2-4bb5-b016-6ea3035d2015 | jamie-frame-039 | on_hit, on_block |
| jamie | d38b6a9d-6ad9-43ba-bf10-8b97275d3a4b | jamie-frame-076 | on_block |
| jamie | e8c4c6d3-c300-47ae-b94e-5051826ecf29 | jamie-frame-077 | on_block |
| jamie | 69a093f4-92da-44a6-a659-ac11f1ee2f4a | jamie-frame-078 | on_block |
| jamie | 56e9221a-75ee-4a4a-8295-2c23cd60ce38 | jamie-frame-079 | on_block |
| jamie | 7bc4a79d-75dd-4a7a-95fe-ed02c344b8b9 | jamie-frame-084 | on_block |
| jamie | 47f2b44d-7d51-49f0-866e-6a2e1b5648ff | jamie-frame-085 | on_block |
| jamie | e395af47-aedc-467e-b4cb-2aa5c112c348 | jamie-frame-088 | damage |
| jamie | 99b9dbf0-5322-4397-bd1f-976a60965a2d | jamie-frame-089 | on_hit, on_block |
| jamie | 21a4b863-0c4b-4dae-8300-a6c09765f380 | jamie-frame-092 | on_block |
| jamie | a55bf301-744e-4439-966c-a26065fe9983 | jamie-frame-093 | on_block |
| jamie | d895641f-3033-4950-82e9-2f3eff071cbd | jamie-jump-hk | on_hit, on_block |
| jamie | 95492209-1432-4bde-9e89-b4286885c384 | jamie-jump-hp | on_hit, on_block |
| jamie | 6b798ab0-f058-4cca-8f49-6e10a5b1d8ea | jamie-jump-lk | on_hit, on_block |
| jamie | e3b0f48c-12d1-445c-8164-00ddc2300265 | jamie-jump-lp | on_hit, on_block |
| jamie | 5310fceb-d9e6-4e78-b695-7ee2a8464a62 | jamie-jump-mk | on_hit, on_block |
| jamie | 2ace90e1-ddf1-446b-b239-7abdb8c04e3d | jamie-jump-mp | on_hit, on_block |
| jp | 51680ee1-db0b-4906-80da-93ba82dde6f1 | jp-amnesia | on_hit, on_block |
| jp | f262b667-3ec4-4b75-a7f1-df1748df2ba3 | jp-amnesia-od | on_hit, on_block |
| jp | a63b4bd9-535b-4893-a55e-42d105ad9f8b | jp-back-throw | on_block |
| jp | 50c13c49-015c-423a-880e-9c4663ad34d9 | jp-departure-h | on_hit, on_block |
| jp | f0766896-f8e9-45eb-a769-0762d98a2714 | jp-departure-l | on_hit, on_block |
| jp | 732536be-f8e8-4701-9871-991075ed5c8a | jp-departure-m | on_hit, on_block |
| jp | c9f1220a-5353-4da4-803e-02b71563cf85 | jp-departure-od-h | on_hit, on_block |
| jp | 9ec80073-a3d7-4d24-9437-8a21dc112c68 | jp-departure-od-l | on_hit, on_block |
| jp | 40e948eb-d634-4dc8-8b3a-43aef82df522 | jp-departure-od-m | on_hit, on_block |
| jp | a6b9d663-b9b3-494b-8d43-7aed196be8f4 | jp-departure-shadow | on_hit, on_block |
| jp | 6fbfed6b-7805-4277-b216-60503d4cee88 | jp-departure-window | damage |
| jp | a7bb98cd-731c-485c-ab95-78de6cf5448e | jp-embrace | on_hit, on_block |
| jp | e87c51f7-a2e9-44b1-8061-d823351b42d5 | jp-embrace-od | on_hit, on_block |
| jp | 94a12a74-68c3-41d2-9fb5-7684451741b5 | jp-forward-throw | on_block |
| jp | 61797d46-a331-4638-ba60-3dc3ea0cfd16 | jp-jump-hk | on_hit, on_block |
| jp | 88b7028e-f54a-4b51-a75a-670ccfce75dc | jp-jump-hp | on_hit, on_block |
| jp | 6cb6065e-9c33-47d1-af2c-00e4b3871182 | jp-jump-lk | on_hit, on_block |
| jp | 00edfdc1-cf06-4b8c-b836-a213a7028cf6 | jp-jump-lp | on_hit, on_block |
| jp | ce1e365b-8572-44a2-8767-0bce9f20054b | jp-jump-mk | on_hit, on_block |
| jp | 3baf3077-05b0-4360-b548-ee16b68f8a37 | jp-jump-mp | on_hit, on_block |
| jp | 8fdddc58-2331-4ceb-baec-cd8289c30bb5 | jp-tornado | on_block |
| juri | f1f7bdc0-5abb-4dcd-9a18-6ed7ebcacabd | juri-air-throw | on_hit, on_block |
| juri | 5cc1893e-1ad5-41cd-bd06-6688b060508e | juri-back-throw | on_block |
| juri | 6d1e92da-67bf-49ea-8630-7c333d1199e9 | juri-forward-throw | on_block |
| ken | 37dfc815-fab3-4be0-a0d3-c83db2f4c3b1 | ken-back-throw | on_block |
| ken | 0b963e9d-0a9d-4d32-83f8-38187e4fc12e | ken-forward-throw | on_block |
| ken | 7d2cac0c-e80b-43dd-a4df-15e6a3b71db5 | ken-quick-dash | on_hit, on_block, damage |
| ken | 4bf7f7ff-9512-48c3-bd21-95e21535e073 | ken-quick-dash-stop | on_hit, on_block, damage |
| kimberly | 4ac80d7f-840f-4f8a-bc92-09bb18877f34 | kimberly-frame-013 | on_hit, on_block |
| kimberly | 5381cbfd-c2ff-4adf-8f0f-a4b3da2d2a4b | kimberly-frame-014 | on_hit, on_block |
| kimberly | 5f164e6c-9f9b-4fde-ae41-123878488eef | kimberly-frame-015 | on_hit, on_block |
| kimberly | ef4adca8-d007-45d8-ac18-5abb7c67d231 | kimberly-frame-016 | on_hit, on_block |
| kimberly | 101ed893-5f2b-46c9-b952-1ef9e3c3bc21 | kimberly-frame-017 | on_hit, on_block |
| kimberly | 8ec8eb18-dc34-48b2-81ac-457b3f66b0da | kimberly-frame-018 | on_hit, on_block |
| kimberly | 3ada19ee-592c-4fed-a23a-f415c6afea7e | kimberly-frame-023 | on_hit, on_block |
| kimberly | c724f0ae-dffb-4afc-9ea3-e315b81c0d5d | kimberly-frame-037 | on_hit, on_block |
| kimberly | 88033ae3-3e0d-47b3-ae03-272023880ca6 | kimberly-frame-038 | on_hit, on_block |
| kimberly | 60a09c4f-d5e4-436a-9b27-f454edd44359 | kimberly-frame-039 | on_hit, on_block |
| kimberly | ad87f835-3557-4069-a387-f3fff79f1734 | kimberly-frame-040 | on_hit, on_block |
| kimberly | 9a085f69-cdf5-4375-be46-cce6f6569056 | kimberly-frame-049 | on_block |
| kimberly | cba8b8fc-9a17-4eb3-aa86-94d1c4cccf5b | kimberly-frame-050 | on_block |
| kimberly | e297937e-6a0b-4ee6-80c5-d468ad554632 | kimberly-frame-057 | on_hit, on_block |
| kimberly | b6ef3b5e-6e5f-4372-b782-81016cf80d48 | kimberly-frame-058 | on_hit, on_block |
| kimberly | dca425fc-d8c6-4395-8fc1-fed18e7d54d4 | kimberly-frame-059 | on_hit, on_block |
| kimberly | f6a3ade1-5b2b-44c5-9a78-9c5f32ac136e | kimberly-frame-060 | on_hit, on_block |
| kimberly | c226c305-4d85-421d-8461-ceb46e619dda | kimberly-frame-061 | on_hit, on_block |
| kimberly | 93a9c0ac-552d-4b29-8a88-86a5e9a29689 | kimberly-frame-062 | on_hit, on_block |
| kimberly | fbe7eb9f-ec4d-436a-8f8c-0b38b0e7760a | kimberly-frame-063 | on_hit, on_block |
| kimberly | 8f23066e-ec2d-41d6-aa5f-8dcd892c9025 | kimberly-frame-064 | on_hit, on_block |
| kimberly | 8a25ea74-8b68-43d4-873e-1a117d51104a | kimberly-frame-065 | on_hit, on_block |
| kimberly | f21d57c9-88e5-41b3-919e-f14db0df3519 | kimberly-frame-066 | on_hit, on_block |
| kimberly | 6d2ef0ae-1812-40d8-9bd6-4ac5e5677572 | kimberly-frame-067 | on_block |
| kimberly | e93af4aa-3c38-44a9-8cba-8ced80a54fb9 | kimberly-frame-068 | on_block |
| kimberly | 183a7882-7c0a-4e06-8131-4edc78fa7d32 | kimberly-frame-072 | on_block |
| kimberly | f34fea41-3cef-42d1-9b59-318d3d58dd8b | kimberly-frame-075 | on_block |
| kimberly | 3f3aefa2-b47e-49bb-85eb-82d5f4e2588c | kimberly-frame-076 | on_block |
| lily | 3efe3247-d69b-499e-aaed-b81b421b7b5e | lily-back-throw | on_block |
| lily | d443d973-0462-458f-a25e-3b51759ebfd2 | lily-ca | on_block |
| lily | a903733b-bfea-4ae3-bb7a-a2ab1f8db7bc | lily-forward-throw | on_block |
| lily | b8f6c01b-75fe-447b-993e-53883d70c86c | lily-great-spin | on_hit, on_block |
| lily | d0e0be38-756e-4649-8b42-ab710f43c81d | lily-jump-hp | on_hit, on_block |
| lily | c019e770-945f-49ba-90cc-6f27cdd7cc49 | lily-jump-lk | on_hit, on_block |
| lily | db1dc9a6-a40d-4a67-a9f2-23cfc5da9cb6 | lily-jump-lp | on_hit, on_block |
| lily | 9b0d90ef-57d6-44bf-b3e4-979fbe61d341 | lily-jump-mk | on_hit, on_block |
| lily | 9e0e16a5-893b-4afc-8768-b809085f2b3c | lily-jump-mp | on_hit, on_block |
| lily | 32d1cd8d-b7a2-4def-8074-667ee62e8536 | lily-sa3 | on_block |
| lily | 00098e8f-ce4d-45cf-a785-f3238be5e859 | lily-typhoon-h | on_block |
| lily | 204a2e48-71e3-4180-b42e-8ec5c8bd1ed7 | lily-typhoon-l | on_block |
| lily | c58e0a88-2a82-4f7f-a8d9-60b2b406f395 | lily-typhoon-m | on_block |
| lily | f37f3b86-5ba5-4ccf-831b-f0ebcc4cae2d | lily-typhoon-od | on_block |
| luke | 5d28a0ed-7abe-4c1b-8cc4-bcb208d55626 | luke-aerial-flash-knuckle | on_block |
| luke | 29ba87ce-14a6-40b2-84aa-936228092b66 | luke-avenger | damage |
| luke | c40c1f4a-5753-486d-a902-e017ae79de78 | luke-back-throw | on_block |
| luke | 6afa6076-dff0-4ca5-b00d-acbf1a6f74e0 | luke-ddt | on_block |
| luke | dc4d041c-4259-4636-8142-d2f329b7d77b | luke-forward-throw | on_block |
| luke | 5a9a9a77-2943-428c-8eb0-8729e26ed0bc | luke-jump-hk | on_hit, on_block |
| luke | 229b7150-2d1c-46ae-87cf-c2dfa413d588 | luke-jump-hp | on_hit, on_block |
| luke | 31807b8f-99c8-446f-a2db-5200ae2fae69 | luke-jump-lk | on_hit, on_block |
| luke | 00fb09ee-aba9-4dc7-8115-29b46bd67dad | luke-jump-lp | on_hit, on_block |
| luke | 779533b9-24da-421b-ac57-bb8c3d5700b9 | luke-jump-mk | on_hit, on_block |
| luke | 48c184ed-390f-454f-9de8-75df3887fc13 | luke-jump-mp | on_hit, on_block |
| luke | 4743c57a-35e7-404f-82e2-79a0854b12f6 | luke-slam-dunk | on_block |
| m-bison | 4a25d3d8-585e-4b52-bec2-ca7ee2888210 | m-bison-back-throw | on_block |
| m-bison | c7d2d956-6cb6-4b50-9958-37e3345b907c | m-bison-forward-throw | on_block |
| m-bison | 62338ed3-a07e-4767-a3c4-fa27579545a4 | m-bison-jump-hk | on_hit, on_block |
| m-bison | 68dc311a-e131-4e22-9a14-2536452298a2 | m-bison-jump-hp | on_hit, on_block |
| m-bison | fd6994d7-9b39-442b-80fa-88eeaf147f93 | m-bison-jump-lk | on_hit, on_block |
| m-bison | ffc46504-0632-4b6e-ac49-5d799425d179 | m-bison-jump-lp | on_hit, on_block |
| m-bison | 86f77e43-38bc-47e6-8781-2ec32010d60f | m-bison-jump-mk | on_hit, on_block |
| m-bison | 849683cc-dc9a-46f6-b33a-16a15ec9aa13 | m-bison-jump-mp | on_hit, on_block |
| m-bison | e008aab9-83d9-4651-a751-baa6eb4ff5a0 | m-bison-shadow-rise | on_hit, on_block |
| m-bison | 3650688e-300c-4846-9b2f-2b9c59cc50b7 | m-bison-skull-diver | on_hit, on_block |
| mai | d8c75cd4-688b-4524-8f84-a233f459c643 | mai-air-chou-hissatsu-shinobi-bachi-flame-j-236236k | on_block |
| mai | d6c70d59-2a08-45ff-8677-578b09b520c1 | mai-air-chou-hissatsu-shinobi-bachi-j-236236k | on_block |
| mai | c3c98b8c-819e-47bf-9fea-fa79032f230e | mai-back-step-44 | on_hit, on_block |
| mai | 5f981ef0-e793-41f6-a8eb-c3f4d6e25fe6 | mai-forward-step-66 | on_hit, on_block |
| mai | 64233f0e-dc53-488f-a1e9-1f622523d2db | mai-fuusha-kuzushi-4lplk | on_block |
| mai | 0a6ba915-5360-40b0-b37e-31e2df09e568 | mai-jumping-heavy-kick-j-hk | on_hit, on_block |
| mai | 1e35ff30-76f3-44a3-a5a7-ec74ca790f70 | mai-jumping-heavy-punch-j-hp | on_hit, on_block |
| mai | 71f95882-1eb5-4a41-9023-8565dd9189a5 | mai-jumping-light-kick-j-lk | on_hit, on_block |
| mai | 722ea2f7-7922-4a01-a41d-9aa990abae2a | mai-jumping-light-punch-j-lp | on_hit, on_block |
| mai | 0da28746-384f-4894-a50c-5f8c4de07aa2 | mai-jumping-medium-kick-j-mk | on_hit, on_block |
| mai | 2c04ce27-7982-40e1-9149-c8067306bfcc | mai-jumping-medium-punch-j-mp | on_hit, on_block |
| mai | 7313c119-d754-4136-8774-06ce55ec9560 | mai-shiranui-gourin-lplk | on_block |
| mai | e589aae2-b6ef-4ab6-8523-2a9e6af24e5f | mai-yume-zakura-j-lplk | on_block |
| manon | 55b92472-63bf-4775-baf8-ee65ee4b1b60 | manon-back-throw | on_block |
| manon | e9d7d8e0-0ead-44cc-9c9f-4137ecb3aae4 | manon-forward-throw | on_block |
| manon | de77ddfe-d9e0-48c6-9776-7585a70193ac | manon-jump-hk | on_hit, on_block |
| manon | 1b7f9b40-80d2-472f-b954-be1619adb7c7 | manon-jump-hp | on_hit, on_block |
| manon | 4181126f-96c6-4856-96f7-cea78f874c41 | manon-jump-lk | on_hit, on_block |
| manon | e833739b-e7f2-43af-9e30-8b8d57513a15 | manon-jump-lp | on_hit, on_block |
| manon | b6d91c3a-0516-428f-9b80-14720578e991 | manon-jump-mk | on_hit, on_block |
| manon | a921d7b3-84e2-4cb5-998c-e28063671f5d | manon-jump-mp | on_hit, on_block |
| manon | 7508a273-cd0f-43ae-85f1-e16dc8f9b850 | manon-manege-h | on_block, damage |
| manon | 47d8e1cb-af05-4495-994d-cdf7f83675da | manon-manege-l | on_block, damage |
| manon | 1c8375a6-7858-40ad-8ca3-aa265f2da682 | manon-manege-m | on_block, damage |
| manon | ddc87d1a-7319-4f33-836d-1f1d49e31e79 | manon-manege-od | on_block, damage |
| marisa | 3d782d80-90d2-4dac-a551-7d1440154270 | marisa-back-throw | on_block |
| marisa | fd10b2f0-9eae-4bd5-b435-745cc1f7417b | marisa-ca | on_block |
| marisa | bbeef1e8-9287-453d-bc4f-d115974a9331 | marisa-caelum-arc | on_hit, on_block |
| marisa | 1fc056f3-e4bb-4e38-a1f5-17ea3e58238b | marisa-enfold | on_block |
| marisa | 3eb3f810-dc04-40dd-82a6-dcad8a5eb0c1 | marisa-forward-throw | on_block |
| marisa | 008eb6cd-42d9-4890-93e6-4c9989226aa2 | marisa-jump-hk | on_hit, on_block |
| marisa | af1d4cda-8efa-4486-8538-58ffa69f3d6b | marisa-jump-hp | on_hit, on_block |
| marisa | 0fb71af6-f90c-4e8f-900a-86e4b1e27ae2 | marisa-jump-lk | on_hit, on_block |
| marisa | af90da9b-b6e2-4ce8-a1cc-4ec156f3b2e2 | marisa-jump-lp | on_hit, on_block |
| marisa | 8b09cf50-8806-480a-ad0f-f84d8ecda4b0 | marisa-jump-mk | on_hit, on_block |
| marisa | 4b1a0068-0a3f-47ae-a6e7-25203715422a | marisa-jump-mp | on_hit, on_block |
| marisa | f9981edd-a6d9-436b-baef-f8546d865ebb | marisa-sa3 | on_block |
| marisa | 670780a3-5cf4-4b2f-8005-47093baac13d | marisa-scutum | damage |
| marisa | f66f9d3e-fefd-41f5-83ef-8096ff841e23 | marisa-scutum-od | on_hit, on_block |
| rashid | bb451c18-e404-420c-9330-b425eb613dea | rashid-air-throw | on_block |
| rashid | 199d95f3-0448-47ad-8755-907025ec73b6 | rashid-arabian-skyhigh-h | on_block |
| rashid | dc601d7e-3b68-489f-8cba-26af3dd27576 | rashid-arabian-skyhigh-l | on_block |
| rashid | 0e176630-093f-45da-b14d-89aedc0351dd | rashid-arabian-skyhigh-m | on_block |
| rashid | a2c35da5-202c-47b5-ac09-1183910eddde | rashid-arabian-skyhigh-od | on_block |
| rashid | 0c0a3ca4-6f2d-4636-af55-75e756d16ba3 | rashid-back-throw | on_block |
| rashid | f5f54109-2d7e-407c-88fb-2d131ac0c6a3 | rashid-forward-throw | on_block |
| rashid | 4f6cfd73-f0f6-4042-bb5b-769c11b4dd93 | rashid-front-flip | on_hit, on_block, damage |
| rashid | 634dfdac-eb2c-4f55-9ee8-57a4a748d6f6 | rashid-jump-hk | on_hit, on_block |
| rashid | b687a0aa-1c7a-4bed-8eda-4dc14b9ce951 | rashid-jump-hp | on_hit, on_block |
| rashid | af4a3e5d-e550-4e1f-9b77-0f9b8040de93 | rashid-jump-lk | on_hit, on_block |
| rashid | 9d9f4f43-8e2e-4265-ae16-a327357e001e | rashid-jump-lp | on_hit, on_block |
| rashid | a277674a-e207-425d-8f63-48d8c7a2882f | rashid-jump-mk | on_hit, on_block |
| rashid | d3d1c380-8ba4-4244-8ac5-57a5fab0b5c3 | rashid-jump-mp | on_hit, on_block |
| rashid | 7e1b3557-f159-4bac-b373-dbe05a25f5fa | rashid-rolling-assault | damage |
| rashid | de27f855-6232-4098-bf00-d718e26ceb7e | rashid-run | on_hit, on_block |
| rashid | bbb5a868-6323-476f-b782-6bca034959ff | rashid-side-flip | damage |
| rashid | 40c5c26a-bcd7-4df0-8ff6-952dbec9b6c5 | rashid-wing-stroke | damage |
| ryu | ed764818-867d-4188-b9fa-71bbd7cfb0b8 | ryu-aerial-tatsumaki | on_block |
| ryu | b0e5f2a6-29fd-4aa0-98ed-05b9b248343a | ryu-back-throw | on_block |
| ryu | db46db6f-26dd-4638-8397-d235750929b9 | ryu-denjin-charge | on_hit, on_block, damage |
| ryu | 252287ef-f49c-4347-ace6-76dce143ef59 | ryu-forward-throw | on_block |
| ryu | f0b5f99f-692a-4706-8f68-40bb4e4f0015 | ryu-jump-hk | on_hit, on_block |
| ryu | ec64fb71-06c8-4603-9aa5-b74f40f2df06 | ryu-jump-hp | on_hit, on_block |
| ryu | 199c77e5-2064-4090-8f9b-4226af92a68d | ryu-jump-lk | on_hit, on_block |
| ryu | 034b09a8-7a59-4aff-a35d-90a022094914 | ryu-jump-lp | on_hit, on_block |
| ryu | 51da4eb2-83d2-4afe-981d-cdcd52582424 | ryu-jump-mk | on_hit, on_block |
| ryu | 389b1337-3b9b-4ea6-9d90-14383797c6b4 | ryu-jump-mp | on_hit, on_block |
| ryu | 271fc7f0-8035-4945-8b68-40e43ab42725 | ryu-od-aerial-tatsumaki | on_block |
| sagat | b4493b55-f441-4b45-af15-1c88cf599e88 | sagat-jumping-heavy-kick-j-hk | on_hit, on_block |
| sagat | a96dc8ea-2f1b-4fae-917e-7f9566745116 | sagat-jumping-heavy-punch-j-hp | on_hit, on_block |
| sagat | e652b451-8724-4ada-b51d-6abcd1f7f340 | sagat-jumping-light-kick-j-lk | on_hit, on_block |
| sagat | a7931a35-5e71-41c3-a02c-29b0e9cda8a9 | sagat-jumping-light-punch-j-lp | on_hit, on_block |
| sagat | e27fde8a-f1f6-4127-a3a2-3e95daa81d34 | sagat-jumping-medium-kick-j-mk | on_hit, on_block |
| sagat | 95d6f194-a3eb-43dc-96b4-54e0563d2173 | sagat-jumping-medium-punch-j-mp | on_hit, on_block |
| sagat | ee10d430-3404-4acc-868c-9733ceefb6b9 | sagat-savage-tiger-214214k | on_hit |
| sagat | 93e64c1f-c1b2-409d-93e0-e6da471b0b8e | sagat-savage-tiger-pendulum-br-side-switch-214214k-4 | on_block |
| sagat | 35e63821-7384-4b81-8ec6-18f728f88ac3 | sagat-savage-tiger-raid-br-damage-214214k-5 | on_block |
| sagat | 5d5b68a2-68ae-4083-85d7-a928c8e6b495 | sagat-savage-tiger-stomp-br-oki-214214k-2 | on_block |
| sagat | 85849d3a-12f9-4f1e-9177-920460342b0d | sagat-savage-tiger-zenith-br-launcher-214214k-6 | on_block |
| sagat | bda71928-a789-41ae-b774-b391699d1d53 | sagat-tiger-carry-4lplk | on_block |
| sagat | aaf6d3df-7ecd-4a73-aa58-85aeed417565 | sagat-tiger-hang-lplk | on_block |
| terry | c5b400be-6611-41cb-8fd8-ba4ba5c69960 | terry-back-throw | on_block |
| terry | 09cdfa8f-b62d-41f8-b2ac-ef7488c9bd1c | terry-burn-knuckle-h | on_hit, on_block |
| terry | ee5354a6-15f6-48ad-ae18-4b7da6c9423c | terry-burn-knuckle-od | on_hit, on_block |
| terry | d44ccb19-614d-4ee6-9f50-263b93271d28 | terry-crack-shoot-m | on_hit, on_block |
| terry | ab1d9137-f56e-4055-9113-6980c39d7386 | terry-crack-shoot-od | on_hit, on_block |
| terry | 83045762-537a-4ac0-91f4-ff7e6a5094a0 | terry-forward-throw | on_block |
| terry | 08f65128-4b48-4a17-b73f-fc039f7664dc | terry-jump-hk | on_hit, on_block |
| terry | e43326d2-278e-461b-994d-14205ba9687c | terry-jump-hp | on_hit, on_block |
| terry | 59cfffe0-2b84-4020-ac71-61dd3746e7e4 | terry-jump-lk | on_hit, on_block |
| terry | fc8dba88-8de7-4656-b6ac-6198538940d6 | terry-jump-lp | on_hit, on_block |
| terry | 9c1eebcf-2c81-44c8-86a2-d701afcc1284 | terry-jump-mk | on_hit, on_block |
| terry | 08d6e0a3-298d-463a-b406-df8db280b17e | terry-jump-mp | on_hit, on_block |
| terry | c65414e9-b51d-4dc2-a5a8-64ca1bcb201a | terry-power-charge-od | on_hit, on_block |
| yasmine | 88e637c4-1c01-4b41-b1e4-8d0443cbf8a6 | yasmine-alon-236hp-6p | on_hit |
| yasmine | 6d0eac80-e601-47e0-bbde-5177918119c7 | yasmine-alon-236lp-6p | on_hit |
| yasmine | 94df5acf-0ac9-4ec7-b05e-f270b6820620 | yasmine-alon-236mp-6p | on_hit |
| yasmine | 3485b1cd-dfdf-40d6-9125-42c8ebda906a | yasmine-alon-236pp-6p | on_hit |
| yasmine | da883fa5-c9ef-4a75-b8cc-3bfb26879ee9 | yasmine-back-step-44 | on_hit, on_block |
| yasmine | 723e292b-7d41-47c1-85ab-b549b32d7742 | yasmine-forward-step-66 | on_hit, on_block |
| yasmine | 4301622d-102a-40e1-b583-2b02db739e54 | yasmine-hila-kamay-4lplk | on_hit, on_block |
| yasmine | c030fb18-aa67-4ec7-923e-a54179286219 | yasmine-jumping-heavy-kick-j-hk | on_hit, on_block |
| yasmine | 84d5d088-b584-42e0-a20b-5627d457eb00 | yasmine-jumping-heavy-punch-j-hp | on_hit, on_block |
| yasmine | d58cda82-9f2a-4cc7-b421-7ab696cbbd32 | yasmine-jumping-light-kick-j-lk | on_hit, on_block |
| yasmine | 7949413b-1ea3-41cd-83be-250b5759aca1 | yasmine-jumping-light-punch-j-lp | on_hit, on_block |
| yasmine | 697468cc-a9d2-4531-b974-b919aec0fc12 | yasmine-jumping-medium-kick-j-mk | on_hit, on_block |
| yasmine | 3e76ed52-4ebe-4bcd-a44d-2a60960c5e55 | yasmine-jumping-medium-punch-j-mp | on_hit, on_block |
| yasmine | 9d541ca6-b232-4a72-9d74-23efdff833a4 | yasmine-mukha-ng-langit-236hk | on_hit, on_block |
| yasmine | d3e482ae-ea0c-4643-92d9-9ec0a4727702 | yasmine-mukha-ng-langit-236kk | on_hit, on_block |
| yasmine | 063766f0-b20c-4f6d-bd7f-80cae0f692f7 | yasmine-mukha-ng-langit-236lk | on_hit, on_block |
| yasmine | 90ef6e3e-33a6-4407-935a-f9843b7d6b17 | yasmine-mukha-ng-langit-236mk | on_hit, on_block |
| yasmine | 8ecba6ae-0914-473a-a91b-9619dc3b7ad6 | yasmine-nakatagong-lakas-214214p | on_hit, on_block |
| yasmine | f7faa5a2-62a0-4c72-abf3-91c16631a7c2 | yasmine-pigil-ulo-lplk | on_hit, on_block |
| yasmine | 48628cf4-d99e-420b-907e-16435f3650fe | yasmine-talim-ng-hangin-214lp | on_hit, on_block |
| zangief | 32d6df45-6fb9-44f0-b1b4-ce65096c3ad4 | zangief-back-throw | on_hit, on_block |
| zangief | 581d6f69-8903-42e9-9cab-95516dc08c62 | zangief-borscht | on_block |
| zangief | 24fc2e5a-1a00-4483-8038-a699a7910f5a | zangief-borscht-od | on_block |
| zangief | 329420bc-a269-4ab5-a252-f1ee48c76224 | zangief-ca | on_block |
| zangief | 2ebe76b8-1ebb-4858-8768-506d735f6950 | zangief-flying-headbutt | on_hit, on_block |
| zangief | 6710753b-e2a8-4912-8c71-b4aa83fc9b46 | zangief-forward-throw | on_hit, on_block |
| zangief | bf6c5e62-ea0c-4a56-a50f-86b0315639e0 | zangief-jump-down-hp | on_hit, on_block |
| zangief | cdc01926-65fc-48d3-936e-ec17651e24ce | zangief-jump-hk | on_hit, on_block |
| zangief | d947a02d-bc33-4488-88e6-d3c47ded3cdf | zangief-jump-hp | on_hit, on_block |
| zangief | c14f9dc6-0bf8-4bfd-a851-597b6c2ea538 | zangief-jump-lk | on_hit, on_block |
| zangief | e8255860-cfad-4d52-b565-2b93285b5d35 | zangief-jump-lp | on_hit, on_block |
| zangief | 7c3aa976-8051-46a7-bc51-484cc42a09cd | zangief-jump-mk | on_hit, on_block |
| zangief | 62d308f8-1d29-4e0f-9b43-936bfd951583 | zangief-jump-mp | on_hit, on_block |
| zangief | 1476cf16-7efd-4570-8d43-32ce58ac52f4 | zangief-power-stomps | on_hit, on_block |
| zangief | 97e3e20a-2e9c-42fb-a469-db1ffad3461f | zangief-sa1 | on_block |
| zangief | 07544f32-f3c5-4664-9769-2c6b6a51fbec | zangief-sa3 | on_block |
| zangief | 5e58e436-e252-4954-9376-ee931ac2274f | zangief-spd-h | on_block |
| zangief | b66ea408-f849-471c-9c83-6752ac418f97 | zangief-spd-l | on_block |
| zangief | da70ca46-5657-4c92-b64f-a5d183868d2c | zangief-spd-m | on_block |
| zangief | 289e792a-b1df-465c-9a70-625738990b50 | zangief-spd-od | on_block |
| zangief | 68528506-5339-4057-86bd-0516bc7b0471 | zangief-suplex | on_block |
| zangief | affd4f00-0ad5-4471-a887-2fafde1f6ba2 | zangief-suplex-od | on_block |
| zangief | bfb8b0aa-7e06-413c-9060-3d1ae5d1ddf0 | zangief-tundra-storm | on_block |
