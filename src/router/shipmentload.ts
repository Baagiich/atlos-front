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
    path: "/shipment_loads",
    component: () => import("@/views/shipmentload/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/shipment_loads/create",
    component: () => import("@/views/shipmentload/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/shipment_loads/edit/:id",
    component: () => import("@/views/shipmentload/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/shipment_loads/show/:id",
    component: () => import("@/views/shipmentload/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
