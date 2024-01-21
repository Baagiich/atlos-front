import { useI18n } from "vue-i18n";
export function assertNumber(message = "validation.number") {
  const regex = /^[0-9]+$/;
  const { t } = useI18n();
  return (v: number | string) => regex.test(v.toString()) || t(message);
}
