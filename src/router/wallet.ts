const names = {
  list: "WalletList",
};

const breadcrumbs = {
  list: { title: names.list, to: { name: names.list } },
};

export default [
  {
    name: names.list,
    path: "/wallets",
    component: () => import("@/views/wallet/WalletList.vue"),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
];
