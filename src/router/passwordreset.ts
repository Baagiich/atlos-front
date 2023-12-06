const names = {
    change: "PasswordChange",
  };
  
  export default [
    {
      name: names.change,
      path: "/password-reset/verify/:token",
      component: () => import("@/views/adminuser/ViewPasswordResetVerify.vue"),
    
    },
  ];
  