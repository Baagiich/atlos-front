const names = {
  list: "NotificationOrderList",
  create: "NotificationOrderCreate",
  update: "NotificationOrderUpdate",
  show: "NotificationOrderShow",
};

const breadcrumbs = {
  list: { title: "Notifications", to: { name: names.list } },
  create: { title: "Create", to: { name: names.create } },
  update: { title: "Update", to: { name: names.update } },
  show: { title: "Show", to: { name: names.show } },
};

export default [
  {
    name: names.list,
    path: "/notification-orders",
    component: () => import("@/views/notificationorder/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: "/notification-orders/create",
    component: () => import("@/views/notificationorder/ViewCreate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: "/notification-orders/edit/:id",
    component: () => import("@/views/notificationorder/ViewUpdate.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: "/notification-orders/show/:id",
    component: () => import("@/views/notificationorder/ViewShow.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
];
