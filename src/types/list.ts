export interface Filters {
  [key: string]: string;
}

export interface Order {
  [key: string]: "asc" | "desc";
}

export interface VuetifyOrder {
  key: string;
  order: string;
}

export interface ListParams {
  page: number;
  filters?: Filters;
  order?: Order;
  page_size?: number;
  groups?: Array<string>;
  atlosuserParam?: Array<string>;
}
