import { Auth, TokenResponse } from "@/types/auth";
import * as dayjs from "dayjs";
import { ENTRYPOINT } from "./config";

const TOKEN_KEY = "API_TOKEN";

let _tokenData: TokenResponse | null = null;

export function save(tokenResponse: TokenResponse) {
  _tokenData = tokenResponse;
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
}

export function get(): TokenResponse | undefined {
  if (_tokenData) {
    return _tokenData;
  }

  try {
    _tokenData = JSON.parse(localStorage.getItem(TOKEN_KEY) || "?");
  } catch (e) {
    remove();
  }

  return undefined;
}

export function remove() {
  _tokenData = null;
  localStorage.removeItem(TOKEN_KEY);
}

export function isRefreshTokenAlive(tokenData: TokenResponse): boolean {
  const now = dayjs();

  return (
    (tokenData && now.isBefore(dayjs(tokenData.refreshTokenExpiration))) ||
    false
  );
}

export async function setToken(payload: Auth) {
  remove();
  save(await callAuth(payload));
}

export async function refreshToken() {
  const tokenData = get();

  if (!tokenData || !isRefreshTokenAlive(tokenData)) {
    throw new Error("no token data");
  }

  save(await callRefreshToken(tokenData));
}

export async function callAuth(payload: Auth) {
  const response = await fetch(ENTRYPOINT + "auth", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/ld+json",
      deviceId: "uuid-uuid-uuid-0",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    const error =
      data["hydra:description"] || data.message || response.statusText;

    throw new Error(error);
  }

  return response.json();
}

export async function callRefreshToken(tokenData: TokenResponse) {
  if (!isRefreshTokenAlive(tokenData)) {
    throw new Error("refresh token is dead");
  }

  const response = await fetch(ENTRYPOINT + "token/refresh", {
    method: "POST",
    body: JSON.stringify({
      refreshToken: tokenData.refreshToken,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/ld+json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    const error =
      data["hydra:description"] || data.message || response.statusText;

    throw new Error(error);
  }

  return response.json();
}
