import type { DevicePreviewBundle } from '@/lib/device-preview';
export type MediaKeyBinding={characterSlug:string;moveSlug:string;sourceRecordKey:string};
export type MediaKeyReference=MediaKeyBinding&{mediaKey:string;currentMoveId:string};
export function createMoveMediaKey(binding:MediaKeyBinding):string;
export function createInputRouteMediaKey(mediaKey:string,command:{scheme:string;conditionText?:string|null;commandText?:string|null;numericNotation?:string|null;buttonNotation?:string|null}):string;
export function resolveStableMoveMediaKey(binding:MediaKeyBinding,previousRegistry?:readonly MediaKeyReference[]):string;
export function attachMoveMediaKeys(bundle:DevicePreviewBundle|null,registry:readonly MediaKeyReference[],characterSlug:string):{bundle:DevicePreviewBundle|null;holds:Array<{moveId:string;reason:string}>;publicationGrant:false};
