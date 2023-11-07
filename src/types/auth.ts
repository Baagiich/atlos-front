import { Dayjs } from "dayjs";

export interface Auth {
  email?: string;
  password?: string;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
  /**
   * Unix timestamp
   */
  refreshTokenExpiration: number;
}
