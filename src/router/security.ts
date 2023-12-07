const names = {
  login: "Login",
  shipperCompanyRegister: "ShipperCompanyRegister",
  consignorRegister: "ConsignorRegister",
};

export default [
  {
    name: names.login,
    path: "/login",
    component: () => import("@/views/security/LoginShow.vue"),
    meta: {
      breadcrumb: [],
    },
  },
  {
    name: names.shipperCompanyRegister,
    path: "/shipper_companies/registration",
    component: () => import("@/views/shippercompany/ViewRegister.vue"),
    meta: {
      breadcrumb: [],
    },
  },
  {
    name: names.consignorRegister,
    path: "/consignor/registration",
    component: () => import("@/views/consignor/ViewRegister.vue"),
    meta: {
      breadcrumb: [],
    },
  },
];
