export interface AdminUserShipmentLimit {
  isLimitExceed: boolean;
  currentCount: number;
  limit: number;
  message?: string;
}
