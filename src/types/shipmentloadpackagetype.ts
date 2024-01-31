import type { Item } from "./item";
import { ShipmentLoadPackageTypeTranslation } from "./shipmentloadpackagetypetranslation";

interface Translations {
  [locale: string]: ShipmentLoadPackageTypeTranslation;
}

export interface ShipmentLoadPackageType extends Item {
  name?: string;
  translations?: Translations;
}
