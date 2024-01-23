/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";

// Types
import type { App } from "vue";
import i18n from "@/plugins/i18n";
import "@/plugins/vue-datepicker";

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia).use(i18n);
}
