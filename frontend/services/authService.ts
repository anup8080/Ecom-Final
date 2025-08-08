import { api } from './api';
import type { AuthResponse, User } from './types';

/**
 * Attempt to authenticate a user with email and password.  On success
 * the returned token and user are persisted to localStorage for
 * subsequent requests.  The caller should update its Auth context
 * accordingly.
 */
export async function login(credentials: { email: string; password: string }): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

/**
 * Register a new account.  An optional role may be provided to
 * designate the user as admin or vendor.  Returns the JWT token and
 * user record.  On success the token and user are persisted.
 */
export async function register(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'customer' | 'admin' | 'vendor';
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

/**
 * Logout the current user by clearing the token and user from
 * localStorage.  Optionally call an API endpoint to invalidate the
 * token server-side (not strictly necessary for JWT stateless auth).
 */
export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  try {
    await api.post('/auth/logout');
  } catch {
    // ignore errors from logout; user might not be logged in on server
  }
}

/**
 * Retrieve the authenticated user's profile.  Returns the user
 * information if the token is valid, otherwise throws.
 */
export async function me(): Promise<User> {
  const { data } = await api.get<User>('/auth/status');
  return data;
}