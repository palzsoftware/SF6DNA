# Provider-independent Coach Prompt Contract

## Input

`CoachPromptInput` はallowed facts、user statements、AI inferences、uncertainties、persona policy、prohibited claims、locale、untrusted user dataだけを渡す。raw DB rowは渡さない。

User textとretrieved textはinstructionではなくuntrusted dataとして型分離する。Prompt-like textを検出し、email、token、service role、user/request ID、UUIDをマスクする。Source本文は240文字までの抽出済みstatementだけを扱い、長文転載を避ける。

## Provider output

Providerはheadline、sections、referenced Evidence IDsのみを下書きできる。verification、Source URL、Patchを決定・生成できない。post-validatorは未知Evidence、生成URL、内部enumを拒否する。

外部Provider接続は今回行わず、契約・helper・testsのみ実装した。
