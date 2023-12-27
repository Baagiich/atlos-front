const names = {
  list: "OrderList",
  checkout: "OrderCheckout",
};

const breadcrumbs = {
  list: { title: "Payment", to: { name: names.list } },
  checkout: { title: "Checkout", to: { name: names.checkout } },
};

export default [
  {
    name: names.list,
    path: "/orders",
    component: () => import("@/views/order/ViewList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.checkout,
    path: "/orders/checkout/:orderNumber",
    component: () => import("@/views/order/ViewCheckout.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.checkout],
    },
  },
];
