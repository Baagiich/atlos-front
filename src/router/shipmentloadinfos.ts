const names = {
  list: "ShipmentLoadInfosList",
  create: "ShipmentLoadInfosCreate",
  update: "ShipmentLoadInfosUpdate",
  show: "ShipmentLoadInfosShow",
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
    path: "/shipment_load_infos",
    component: () => import("@/views/shipmentloadinfos/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/shipment_load_infos/create",
    component: () => import("@/views/shipmentloadinfos/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/shipment_load_infos/edit/:id",
    component: () => import("@/views/shipmentloadinfos/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/shipment_load_infos/show/:id",
    component: () => import("@/views/shipmentloadinfos/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
