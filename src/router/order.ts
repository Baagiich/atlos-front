const names = {
  checkout: "OrderCheckout",
};

const breadcrumbs = {
  checkout: { title: "Order checkout", to: { name: names.checkout } },
};

export default [
  {
    name: names.checkout,
    path: "/orders/checkout",
    component: () => import("@/views/order/Checkout.vue"),
    meta: {
      breadcrumb: [breadcrumbs.checkout],
    },
  },
];
