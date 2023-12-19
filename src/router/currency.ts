const names = {
  list: "CurrencyList",
  create: "CurrencyCreate",
  update: "CurrencyUpdate",
};

const breadcrumbs = {
  list: { title: "List", to: { name: names.list } },
  create: { title: "Create", to: { name: names.create } },
  update: { title: "Update", to: { name: names.update } },
};

export default [
  {
    name: names.list,
    path: "/currencies",
    component: () => import("@/views/currency/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/currencies/create",
    component: () => import("@/views/currency/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/currencies/edit/:id",
    component: () => import("@/views/currency/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
];
