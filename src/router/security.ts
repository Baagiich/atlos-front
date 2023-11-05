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
];
