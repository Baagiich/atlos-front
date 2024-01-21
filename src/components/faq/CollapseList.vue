<template>
  <v-container>
    <div class="text-h4 text-center mb-8">{{ $t("FAQ") }}</div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="item in items"
        :key="'faq-item-' + item['@id']"
        :title="getPropertyByLocale(item, 'question', locale)"
        :text="getPropertyByLocale(item, 'answer', locale)"
      >
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
import { useFaqItemListStore } from "@/store/faq/list";
import { Faq } from "@/types/faq";
import { Filters } from "@/types/list";
import { storeToRefs } from "pinia";
import { ref, Ref } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const faqItemListStore = useFaqItemListStore();
const { items } = storeToRefs(faqItemListStore);

const page = ref(1);
const filters: Ref<Filters> = ref({});
const order = ref({});

async function sendRequest() {
  await faqItemListStore.getItems({
    page: +page.value,
    order: order.value,
    groups: ["translations"],
    ...filters.value,
  });
}

function getPropertyByLocale(
  item: Faq,
  property: string,
  locale: string,
): string {
  if (item.translations && item.translations[locale]) {
    return item.translations[locale][property];
  }

  return item[property];
}

sendRequest();
</script>
