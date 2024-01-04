import { useRoute } from "vue-router";
import { VBreadcrumbsItem } from "vuetify/lib/components/index.mjs";

export function useBreadcrumb() {
  const route = useRoute();
  return route.meta.breadcrumb as VBreadcrumbsItem[];
}
