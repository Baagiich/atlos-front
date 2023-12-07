const names = {
  dahsboard: "DriverRequestDashboard",
};
export default [
  {
    name: names.dahsboard,
    path: "/shipment_loads/create/dashboard",
    component: () => import("@/views/shipmentload/ShipmentLoadDashboard.vue"),
    meta: {
      breadcrumb: [],
    },
  },
];
