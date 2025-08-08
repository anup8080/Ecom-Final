import axios from 'axios';

/**
 * A preconfigured Axios instance that points to your backend API.  The base URL
 * is read from the environment variable `NEXT_PUBLIC_API_BASE_URL`.  If the
 * variable isn't set the API will default to `http://localhost:4000/api`.
 *
 * An interceptor attaches a bearer token from localStorage on the client to
 * every request.  This allows authenticated API routes to verify the user
 * without each call manually setting headers.  When running on the server
 * (e.g. in getServerSideProps) the token will be absent and the request will
 * proceed unauthenticated.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add the JWT token from localStorage if present on the client
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Extract a human readable message from an Axios error.  Useful for
 * displaying error notifications in the UI.
 */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (
      (err.response?.data as any)?.message || err.message || 'An unexpected error occurred'
    );
  }
  return String(err);
}