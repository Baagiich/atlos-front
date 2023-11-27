const names = {
  list: "ShipmentLoadList",
  create: "ShipmentLoadCreate",
  update: "ShipmentLoadUpdate",
  show: "ShipmentLoadShow",
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
    path: "/shipment_load",
    component: () => import("@/views/ShipmentLoad/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/shipment_load/create",
    component: () => import("@/views/ShipmentLoad/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/shipment_load/edit/:id",
    component: () => import("@/views/ShipmentLoad/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/shipment_load/show/:id",
    component: () => import("@/views/ShipmentLoad/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
