const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Token helpers ──────────────────────────────────────────────────────────────

export const getAccessToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

export const getRefreshToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// ─── Core fetch wrapper ─────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    setTokens(data.access_token, data.refresh_token);
    return data.access_token;
  } catch {
    clearTokens();
    return null;
  }
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  let token = getAccessToken();

  const makeRequest = async (authToken: string | null) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    return fetch(url, { ...options, headers });
  };

  let response = await makeRequest(token);

  // If 401, try refreshing the token once
  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await makeRequest(newToken);
    } else {
      throw new Error("Unauthenticated");
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  return response.json();
}
