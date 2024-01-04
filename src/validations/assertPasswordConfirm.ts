import { useI18n } from "vue-i18n";

type Callback = () => void;

export function assertPasswordConfirm(
  message: string,
  plainPassword: string | Callback,
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
