const names = {
  list: "AdminUserList",
  create: "AdminUserCreate",
  update: "AdminUserUpdate",
  show: "AdminUserShow",
  passwordReset: "AdminUserPasswordReset",
  verify: "AdminUserVerify",
};

const breadcrumbs = {
  list: { title: names.list, to: { name: names.list } },
  create: { title: names.create, to: { name: names.create } },
  update: { title: names.update, to: { name: names.update } },
  show: { title: names.show, to: { name: names.show } },
  passwordReset: {
    title: names.passwordReset,
    to: { name: names.passwordReset },
  },
  verify: { title: names.verify, to: { name: names.verify } },
};

export default [
  {
    name: names.list,
    path: "/admin_users",
    component: () => import("@/views/adminuser/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/admin_users/create",
    component: () => import("@/views/adminuser/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/admin_users/edit/:id",
    component: () => import("@/views/adminuser/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/admin_users/show/:id",
    component: () => import("@/views/adminuser/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
  {
    name: names.passwordReset,
    path: "/admin_users/password-reset",
    component: () => import("@/views/adminuser/ViewPasswordReset.vue"),
  },
  {
    name: names.verify,
    path: "/admin_users/verify",
    component: () => import("@/views/adminuser/ViewVerify.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.verify],
    },
  },
];
