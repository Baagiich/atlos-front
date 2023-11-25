// Composables
import { createRouter, createWebHistory } from "vue-router";
import contracttemplateRoutes from "./contracttemplate";
import countryRoutes from "./country";
import adminUserRoutes from "./adminuser";
import securityRoutes from "./security";
import shipmentRoutes from "./shipment";
import requestsRoutes from "./requests";
import addressRoutes from "./address";
import vehicleRoutes from "./vehicle";
import cityRoutes from "./city";
import driverrequest from "./driverrequest";
import driverRoutes from "./driver";
import driverimageRoutes from "./driverimage";
import mediaobjectRoutes from "./mediaobject";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
    ],
  },
  ...contracttemplateRoutes,
  ...countryRoutes,
  ...adminUserRoutes,
  ...securityRoutes,
  ...shipmentRoutes,
  ...requestsRoutes,
  ...addressRoutes,
  ...vehicleRoutes,
  ...cityRoutes,
  ...driverrequest,
  ...driverRoutes,
  ...driverimageRoutes,
  ...mediaobjectRoutes,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
