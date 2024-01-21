import { FaqTranslation } from "./faqTranslation";
import type { Item } from "./item";

interface Translations {
  [locale: string]: FaqTranslation;
}

export interface Faq extends Item {
  question?: string;
  answer?: string;
  order?: number;
  translations?: Translations;
}
