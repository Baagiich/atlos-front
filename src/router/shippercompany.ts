const names = {
  list: "ShipperCompanyList",
  create: "ShipperCompanyCreate",
  update: "ShipperCompanyUpdate",
  show: "ShipperCompanyShow",
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
    path: "/shipper_companies",
    component: () => import("@/views/shippercompany/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/shipper_companies/create",
    component: () => import("@/views/shippercompany/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/shipper_companies/edit/:id",
    component: () => import("@/views/shippercompany/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/shipper_companies/show/:id",
    component: () => import("@/views/shippercompany/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
