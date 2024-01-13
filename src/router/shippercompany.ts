const names = {
  list: "ShipperCompanyList",
  create: "ShipperCompanyCreate",
  update: "ShipperCompanyUpdate",
  show: "ShipperCompanyShow",
  verify: "ShipperCompanyVerify",
};

const breadcrumbs = {
  list: { title: names.list, to: { name: names.list } },
  create: { title: names.create, to: { name: names.create } },
  update: { title: names.update, to: { name: names.update } },
  show: { title: names.show, to: { name: names.show } },
  verify: { title: names.verify, to: { name: names.verify } },
};

export default [
  {
    name: names.list,
    path: "/shipper",
    component: () => import("@/views/shippercompany/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/shipper/create",
    component: () => import("@/views/shippercompany/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/shipper/edit/:id",
    component: () => import("@/views/shippercompany/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/shipper/show/:id",
    component: () => import("@/views/shippercompany/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
  {
    name: names.verify,
    path: "/shipper/verify",
    component: () => import("@/views/shippercompany/ViewVerify.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.verify],
    },
  },
];
