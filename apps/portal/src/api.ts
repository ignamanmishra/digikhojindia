/**
 * DIGIKHOJINDIA CUSTOMER PORTAL API CLIENT
 * Encapsulates secure client requests and tenant isolation
 */

const API_BASE = 'http://localhost:8787/api';

export function getPortalToken(): string | null {
  return localStorage.getItem('dki_portal_token');
}

export function setPortalToken(token: string): void {
  localStorage.setItem('dki_portal_token', token);
}

export function removePortalToken(): void {
  localStorage.removeItem('dki_portal_token');
}

export async function portalRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getPortalToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}
