import { useI18n } from "vue-i18n";
export function assertNumber(message: string) {
  const { t } = useI18n();
  return (v: number) => !!v || t(message);
}
