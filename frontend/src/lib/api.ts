import axios from "axios";

// export const API_BASE_URL =
  // (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5000";
  export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5299";

export const TOKEN_KEY = "hrms_token";  

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

/** Extracts a friendly message from an axios error / ASP.NET ProblemDetails. */
export function getApiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | string
      | { message?: string; title?: string; errors?: Record<string, string[]> }
      | undefined;

    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      if (data.errors) {
        const first = Object.values(data.errors)[0];
        if (Array.isArray(first) && first[0]) return first[0];
      }
      if (data.title) return data.title;
    }
    if (err.message === "Network Error") {
      return `Cannot reach API at ${API_BASE_URL}. Is the backend running?`;
    }
    return err.message || fallback;
  }
  return fallback;
}
