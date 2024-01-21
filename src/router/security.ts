const names = {
  login: "Login",
  shipperLogin: "ShipperLogin",
  consignorLogin: "ConsignorLogin",
  shipperCompanyRegister: "ShipperCompanyRegister",
  consignorRegister: "ConsignorRegister",
};

export default [
  {
    name: names.shipperLogin,
    path: "/shipper/login",
    component: () => import("@/views/security/ShipperLoginShow.vue"),
    meta: {
      breadcrumb: [],
      showSidebar: false,
    },
  },
  {
    name: names.consignorLogin,
    path: "/consignor/login",
    component: () => import("@/views/security/ConsignorLoginShow.vue"),
    meta: {
      breadcrumb: [],
      showSidebar: false,
    },
  },
  {
    name: names.shipperCompanyRegister,
    path: "/shipper/registration",
    component: () => import("@/views/shippercompany/ViewRegister.vue"),
    meta: {
      breadcrumb: [],
      showSidebar: false,
    },
  },
  {
    name: names.consignorRegister,
    path: "/consignor/registration",
    component: () => import("@/views/consignor/ViewRegister.vue"),
    meta: {
      breadcrumb: [],
      showSidebar: false,
    },
  },
];
