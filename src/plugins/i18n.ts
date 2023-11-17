import { createI18n } from "vue-i18n";
import messages from "@/locales";

export default createI18n({
  locale: "mn-MN",
  fallback: "en-US",
  legacy: false,
  messages,
});
