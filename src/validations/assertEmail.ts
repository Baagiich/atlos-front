import { useI18n } from "vue-i18n";
export function assertEmail() {
  const { t } = useI18n();
  return (v: string) => /.+@.+\..+/.test(v) || t("validation.email");
}
