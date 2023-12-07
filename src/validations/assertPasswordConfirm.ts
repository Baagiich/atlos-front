import { useI18n } from "vue-i18n";
export function assertPasswordConfirm(
  message: string,
  plainPassword: string | Function,
) {
  const { t } = useI18n();
  return function (v: string) {
    return (
      v ===
        (plainPassword instanceof Function ? plainPassword() : plainPassword) ||
      t(message)
    );
  };
}
