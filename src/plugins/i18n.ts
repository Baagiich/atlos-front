import { createI18n } from "vue-i18n";
import messages from "@/locales";

const currentLocale = localStorage.getItem("locale") ?? "mn-MN";

export default createI18n({
  locale: currentLocale,
  fallback: "en-US",
  legacy: false,
  messages,
});
