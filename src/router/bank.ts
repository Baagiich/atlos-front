const names = {
  list: "BankList",
  create: "BankCreate",
  update: "BankUpdate",
};

const breadcrumbs = {
  list: { title: "Banks", to: { name: names.list } },
  create: { title: "Create", to: { name: names.create } },
  update: { title: "Update", to: { name: names.update } },
};

export default [
  {
    name: names.list,
    path: "/banks",
    component: () => import("@/views/bank/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/banks/create",
    component: () => import("@/views/bank/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/banks/edit/:id",
    component: () => import("@/views/bank/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
];
