import { useI18n } from "vue-i18n";
export function assertPhoneNumber() {
  const { t } = useI18n();
  const zhRegex = /^(?:\+86)?1[3456789]\d{9}$/
  const ruRegex = /^(?:\+7|8)?[0-9]{10}$/
  const mnRegex = /^(?:\+976)?[89]\d{7}$/

  return (v: string) => {
    return zhRegex.test(v) || ruRegex.test(v) || mnRegex.test(v) || t("validation.phoneNumberInvalid")
  }
}
