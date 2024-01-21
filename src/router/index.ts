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
import shippercompany from "./shippercompany";
import shipmentload from "./shipmentload";
import shipmentLoadCreate from "./shipmentLoadCreate";
import passwordresetRoutes from "./passwordreset";
import vehicleimagesRoutes from "./vehicleimage";
import consignorRoutes from "./consignor";
import walletRoutes from "./wallet";
import currencyRoutes from "./currency";
import bankRoutes from "./bank";
import order from "./order";
import notificationorder from "./notificationorder";
import DefaultLayout from "@/layouts/default/Default.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    meta: {
      showSidebar: false,
    },
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/home/HomePage.vue"),
      },
      {
        path: "/help",
        name: "Help",
        component: () => import("@/views/home/Faq.vue"),
      },
    ],
  },
  ...securityRoutes,
  ...contracttemplateRoutes,
  ...countryRoutes,
  ...adminUserRoutes,
  ...shipmentRoutes,
  ...requestsRoutes,
  ...addressRoutes,
  ...vehicleRoutes,
  ...cityRoutes,
  ...driverrequest,
  ...driverRoutes,
  ...driverimageRoutes,
  ...mediaobjectRoutes,
  ...shippercompany,
  ...shipmentload,
  ...shipmentLoadCreate,
  ...passwordresetRoutes,
  ...vehicleimagesRoutes,
  ...consignorRoutes,
  ...walletRoutes,
  ...currencyRoutes,
  ...bankRoutes,
  ...order,
  ...notificationorder,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
