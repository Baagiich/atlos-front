export interface Auth {
  email?: string;
  password?: string;
  deviceId?: string;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
  /**
   * Unix timestamp
   */
  refreshTokenExpiration: number;
}
