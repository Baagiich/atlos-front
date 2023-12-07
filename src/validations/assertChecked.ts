import { useI18n } from "vue-i18n";
export function assertChecked() {
  const { t } = useI18n();
  return (v: boolean) => !!v || t("validation.contractTemplateError");
}
