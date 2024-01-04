const names = {
  list: "ShipmentList",
  create: "ShipmentCreate",
  update: "ShipmentUpdate",
  show: "ShipmentShow",
  editPrice: "EditPriceDashboard",
  detail: "ShipmentDetail",
  ownList: "ShipmentOwnList",
  detailFiles: "ShipmentDetailFiles",
};

const breadcrumbs = {
  list: { title: names.list, to: { name: names.list } },
  create: { title: names.create, to: { name: names.create } },
  update: { title: names.update, to: { name: names.update } },
  show: { title: names.show, to: { name: names.show } },
  editPrice: { title: names.editPrice, to: { name: names.editPrice } },
  detail: { title: names.detail, to: { name: names.detail } },
  ownList: { title: names.ownList, to: { name: names.ownList } },
  detailFiles: { title: names.detailFiles, to: { name: names.detailFiles } },
};

export default [
  {
    name: names.list,
    path: "/shipments",
    component: () => import("@/views/shipment/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.ownList,
    path: "/shipments/list",
    component: () => import("@/views/shipment/ViewOwnList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.ownList],
    },
  },
  {
    name: names.create,
    path: "/shipments/create",
    component: () => import("@/views/shipment/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/shipments/edit/:id",
    component: () => import("@/views/shipment/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/shipments/show/:id",
    component: () => import("@/views/shipment/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
  {
    name: names.editPrice,
    path: "/shipments/price/edit/:id",
    component: () => import("@/views/shipment/EditPriceDashboard.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.editPrice],
    },
  },
  {
    name: names.detail,
    path: "/shipments/detail/:id",
    component: () => import("@/views/shipment/ViewDetail.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.detail],
    },
  },
  {
    name: names.detailFiles,
    path: "/shipments/detail/files/:id",
    component: () => import("@/views/shipment/ViewDetailFiles.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.detailFiles],
    },
  },
];
