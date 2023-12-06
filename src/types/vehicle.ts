import type { Item } from "./item";

export interface Vehicle extends Item {
  plateNumber?: string;
  shipper?: any;
  vehicleType?: string;
  vehicleCapacity?: string;
  status?: string;
  adminEditable?: boolean;
}
