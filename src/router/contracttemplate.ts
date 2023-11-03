const names = {
  list: "ContractTemplateList",
  create: "ContractTemplateCreate",
  update: "ContractTemplateUpdate",
  show: "ContractTemplateShow",
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
    path: "/contract_templates",
    component: () => import("@/views/contracttemplate/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/contract_templates/create",
    component: () => import("@/views/contracttemplate/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/contract_templates/edit/:id",
    component: () => import("@/views/contracttemplate/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/contract_templates/show/:id",
    component: () => import("@/views/contracttemplate/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
