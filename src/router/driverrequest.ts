const names = {
  show: "DriverRequestShow",
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
];
