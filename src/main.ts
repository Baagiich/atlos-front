/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

const app = createApp(App);

registerPlugins(app);
// app.component('file-upload', VueUploadComponent)
// app.config.globalProperties.$formatSize = function(size: number) {
//     if (size > 1024 * 1024 * 1024 * 1024) {
//       return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
//     } else if (size > 1024 * 1024 * 1024) {
//       return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
//     } else if (size > 1024 * 1024) {
//       return (size / 1024 / 1024).toFixed(2) + ' MB'
//     } else if (size > 1024) {
//       return (size / 1024).toFixed(2) + ' KB'
//     }
//     return size.toString() + ' B'
//   }
app.mount("#app");
