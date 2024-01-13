const names = {
  login: "Login",
  shipperLogin: "ShipperLogin",
  consignorLogin: "ConsignorLogin",
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
    name: names.shipperLogin,
    path: "/shipper/login",
    component: () => import("@/views/security/ShipperLoginShow.vue"),
    meta: {
      breadcrumb: [],
    },
  },
  {
    name: names.consignorLogin,
    path: "/consignor/login",
    component: () => import("@/views/security/ConsignorLoginShow.vue"),
    meta: {
      breadcrumb: [],
    },
  },
  {
    name: names.shipperCompanyRegister,
    path: "/shipper/registration",
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
