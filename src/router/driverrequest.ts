const names = {
  dahsboard: "DriverRequestDashboard",
};
export default [
  {
    name: names.dahsboard,
    path: "/driver_request/dashboard/:id",
    component: () => import("@/views/driverrequest/DriverRequestDashboard.vue"),
    meta: {
      breadcrumb: [],
    },
  },
];
