const names = {
  list: "VehicleImageList",
  create: "VehicleImageCreate",
  update: "VehicleImageUpdate",
  show: "VehicleImageShow",
};

const breadcrumbs = {
  list: { title: names.list, to: { name: names.list } },
  create: { title: names.create, to: { name: names.create } },
  update: { title: names.update, to: { name: names.update } },
  show: { title: names.show, to: { name: names.show } },
};

export default [
  {
    name: names.list,
    path: "/vehicle_images",
    component: () => import("@/views/vehicleimage/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/vehicle_images/create",
    component: () => import("@/views/vehicleimage/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/vehicle_images/edit/:id",
    component: () => import("@/views/vehicleimage/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/vehicle_images/show/:id",
    component: () => import("@/views/vehicleimage/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
