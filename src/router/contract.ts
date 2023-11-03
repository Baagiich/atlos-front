const names = {
  list: "ContractList",
  create: "ContractCreate",
  update: "ContractUpdate",
  show: "ContractShow",
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
    path: "/contracts",
    component: () => import("@/views/contract/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/contracts/create",
    component: () => import("@/views/contract/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/contracts/edit/:id",
    component: () => import("@/views/contract/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/contracts/show/:id",
    component: () => import("@/views/contract/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
