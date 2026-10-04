const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL

export const API_BASE_URL: string = configuredBaseUrl?.replace(/\/+$/, '') ?? ''

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured. Set it to the public backend URL.')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
  })

  if (!response.ok) {
    let detail = ''
    try {
      const body: unknown = await response.json()
      if (typeof body === 'object' && body !== null && 'message' in body) {
        detail = String(body.message)
      }
    } catch {
      // The status code still provides a useful error for empty or non-JSON bodies.
    }
    throw new Error(`API request failed: ${response.status} ${response.statusText}${detail ? ` — ${detail}` : ''}`)
  }

  const body = await response.text()
  if (!body) {
    return undefined as T
  }

  return JSON.parse(body) as T
}
