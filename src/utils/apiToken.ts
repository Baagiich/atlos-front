import { Auth, TokenResponse } from "@/types/auth";
import dayjs from "dayjs";
import { ENTRYPOINT } from "./config";
import { jwtDecode } from "jwt-decode";
import { AppJwtPayload } from "@/types/appjwtpayload";
import { UserType } from "@/types/usertype";

const TOKEN_KEY = "API_TOKEN";

let _tokenData: TokenResponse | undefined = undefined;

export function save(tokenResponse: TokenResponse) {
  _tokenData = tokenResponse;
  localStorage.setItem(TOKEN_KEY, JSON.stringify(_tokenData));
}

export function get(): TokenResponse | undefined {
  if (_tokenData) {
    return _tokenData;
  }

  try {
    _tokenData = JSON.parse(localStorage.getItem(TOKEN_KEY) || "?");
  } catch (e) {
    remove();
    return undefined;
  }

  return _tokenData;
}

export function remove() {
  _tokenData = undefined;
  localStorage.removeItem(TOKEN_KEY);
}

export function isRefreshTokenAlive(tokenData: TokenResponse): boolean {
  const now = dayjs();

  return (
    (tokenData && now.isBefore(dayjs.unix(tokenData.refreshTokenExpiration))) ||
    false
  );
}

export async function setToken(payload: Auth) {
  remove();
  save(await callAuth(payload));
}

export async function refreshToken(deviceId: string) {
  const tokenData = get();

  if (!tokenData || !isRefreshTokenAlive(tokenData)) {
    throw new Error("no token data");
  }

  save(await callRefreshToken(deviceId, tokenData));
}

export async function callAuth(payload: Auth) {
  const deviceId = payload.deviceId;
  delete payload.deviceId;

  const response = await fetch(ENTRYPOINT + "auth", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/ld+json",
      "Accept-Language": getLocale(),
      deviceId: deviceId,
    } as HeadersInit,
  });

  if (!response.ok) {
    const data = await response.json();
    const error =
      data["hydra:description"] || data.message || response.statusText;

    throw new Error(error);
  }

  return response.json();
}

export async function callRefreshToken(
  deviceId: string,
  tokenData: TokenResponse,
) {
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
      "Accept-Language": getLocale(),
      deviceId,
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
export function getDecodedToken() {
  const tokenData = get();
  if (!tokenData || !isRefreshTokenAlive(tokenData)) {
    return undefined;
  }
  return jwtDecode<AppJwtPayload>(tokenData.token);
}

export function isAdmin(): boolean {
  const payload = getDecodedToken();
  if (!payload) {
    return false;
  }
  return payload.user_type === UserType.ADMIN;
}

function getLocale(): string {
  return localStorage.getItem("locale") || "en";
}
