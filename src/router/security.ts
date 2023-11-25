const names = {
  login: "Login",
  register: "Register",
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
    name: names.register,
    path: "/shipper_companies/registration",
    component: () => import("@/views/shippercompany/ViewRegister.vue"),
    meta: {
      breadcrumb: [],
    },
  },
];
