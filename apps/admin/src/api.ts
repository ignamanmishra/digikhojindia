/**
 * DIGIKHOJINDIA ADMIN API CLIENT
 * Encapsulates secure requests and session management
 */

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE = !isLocal ? '/api' : ((import.meta as any).env?.VITE_API_BASE || 'http://localhost:8787/api');

export function getAuthToken(): string | null {
  return localStorage.getItem('dki_admin_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('dki_admin_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('dki_admin_token');
}

export async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
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

