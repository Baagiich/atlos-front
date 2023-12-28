import { createI18n } from "vue-i18n";
import messages from "@/locales";

const locale = "mn-MN";
const currentLocale = localStorage.getItem("locale") ?? locale;

export default createI18n({
  locale: currentLocale,
  fallback: "en-US",
  legacy: false,
  messages,
});
