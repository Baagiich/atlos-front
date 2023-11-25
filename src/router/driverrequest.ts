const names = {
  dahsboard: "DriverRequestDashboard",
};
const breadcrumbs = {
  create: { title: names.dahsboard, to: { name: names.dahsboard } },
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
