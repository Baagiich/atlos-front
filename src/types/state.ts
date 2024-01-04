import { City } from "./city";
import { Country } from "./country";
import type { Item } from "./item";

export interface State extends Item {
  name: string;
  country: Country;
  cities: City[];
}
