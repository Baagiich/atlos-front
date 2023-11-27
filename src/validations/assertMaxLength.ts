import { useI18n } from "vue-i18n";
export function assertMaxLength(
  maxlength: number,
  message = "validation.maxlength",
) {
  const { t } = useI18n();
  return (v: string) =>
    (v && v.length <= maxlength) || t(message, { maxlength });
}
