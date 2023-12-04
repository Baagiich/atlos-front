import { useI18n } from "vue-i18n";
export function assertMaxLengthNumber(
  maxlength: number,
  message = "validation.maxlength",
) {
  const { t } = useI18n();
  return (v: number) =>
    (v && v.toString().length <= maxlength) || t(message, { maxlength });
}
