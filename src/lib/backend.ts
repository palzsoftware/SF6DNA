import { getBackendUrl } from "@/lib/env";

export async function fetchBackend<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getBackendUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`SF6DNA Backend request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
