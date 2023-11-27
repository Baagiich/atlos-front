import { useI18n } from "vue-i18n";
export function assertRequired(message = "validation.required") {
  const { t } = useI18n();
  return (value: string) => !!value || t(message);
}
