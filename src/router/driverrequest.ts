const names = {
  show: "DriverRequestShow",
  create: "DriverRequestCreate",
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
    name: names.create,
    path: "/driver_request/create/:id",
    component: () => import("@/views/driverrequest/DriverRequestCreate.vue"),
    meta: {
      breadcrumb: [],
    },
  },
];
