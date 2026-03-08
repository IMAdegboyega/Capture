import { apiFetch, clearTokens, getAccessToken, setTokens } from "./client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Exchange a Google OAuth authorization code for JWT tokens.
 */
export async function loginWithGoogle(code: string): Promise<AuthUser> {
  const tokens = await apiFetch<TokenResponse>("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ code }),
  });

  setTokens(tokens.access_token, tokens.refresh_token);

  // Immediately fetch the user profile
  return getMe();
}

/**
 * Get the currently authenticated user's profile.
 */
export async function getMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/auth/me");
}

/**
 * Sign out — clears local tokens.
 */
export function signOut() {
  clearTokens();
}

/**
 * Check if the user is currently authenticated (has a token).
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
