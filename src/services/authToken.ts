export const AUTH_STORAGE_KEY = 'citasmedicas.auth'

export function readStoredToken(): string | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return (JSON.parse(raw) as { token?: string }).token ?? null
  } catch {
    return null
  }
}
