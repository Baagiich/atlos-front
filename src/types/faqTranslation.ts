import type { Item } from "./item";

export interface FaqTranslation extends Item {
  question?: string;
  answer?: string;
  locale?: string;
}
