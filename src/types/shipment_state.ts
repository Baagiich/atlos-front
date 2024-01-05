export enum ShipmentState {
  waiting_driver = 1,
  ready_to_load = 2,
  transporting = 3,
  ready_to_unload = 4,
  delivered = 5,
}

export enum ShipmentStateString {
  CREATED = "created",
  WAITING_ADVANCE = "waiting_advance",
  WAITING_DRIVER = "waiting_driver",
  READY_TO_LOAD = "ready_to_load",
  TRANSPORTING = "transporting",
  READY_TO_UNLOAD = "ready_to_unload",
  DELIVERED = "delivered",
  DELIVERY_APPROVED = "delivery_approved",
  FINISHED = "finished",
  CANCELED = "canceled",
  FAILED = "failed",
}
