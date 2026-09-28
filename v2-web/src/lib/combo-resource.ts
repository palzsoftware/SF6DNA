type ComboResource = {
  drive: number | null;
  sa: number | null;
};

export function matchesResource(meta: ComboResource, resource: string) {
  if (resource === "all") return true;
  if (resource === "meterless") return meta.drive === 0 && meta.sa === 0;
  if (resource === "no-sa") return meta.sa === 0;
  if (resource === "drive") return meta.drive !== null && meta.drive > 0;
  if (resource === "sa") return meta.sa !== null && meta.sa > 0;
  return true;
}
