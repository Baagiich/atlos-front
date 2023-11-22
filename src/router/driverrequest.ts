const names = {
  show: "DriverRequestShow",
  dahsboard: "DriverRequestDashboard",
};
const breadcrumbs = {
  create: { title: names.create, to: { name: names.create } },
  show: { title: names.show, to: { name: names.show } },
};
export default [
  {
    name: names.show,
    path: "/driver_request/:id",
    component: () => import("@/views/driverrequest/DriverRequestShow.vue"),
    meta: {
      breadcrumb: [],
    },
  },
  {
    name: names.dahsboard,
    path: "/driver_request/dashboard/:id",
    component: () => import("@/views/driverrequest/DriverRequestDashboard.vue"),
    meta: {
      breadcrumb: [],
    },
  },
];
