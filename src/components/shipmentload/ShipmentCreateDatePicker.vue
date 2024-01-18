<template>
  <VueDatePicker
    v-model="date"
    range
    :format="formatRange"
    :format-locale="mn"
    @update:model-value="selectDate"
  >
  </VueDatePicker>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { storeToRefs } from "pinia";
import { mn } from "date-fns/locale";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const date = ref();
const { t } = useI18n();

onMounted(() => {
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
  date.value = [startDate, endDate];
});
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);

function selectDate() {
  if (!item || !item.value) {
    return;
  }

  item.value.loadAt = dayjs(date.value[0]).toISOString();
  item.value.unloadAt = dayjs(date.value[1]).toISOString();
}

const formatRange = (range: any[]) => {
  const startDate = range[0];
  const endDate = range[1];

  const resultArray = [];

  if (startDate) {
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth() + 1;
    const startYear = startDate.getFullYear();

    resultArray.push(t("shipment.loadAt").toLocaleUpperCase());
    resultArray.push(`: ${startYear}/${startMonth}/${startDay}`);
  }

  if (endDate) {
    const endDay = endDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endYear = endDate.getFullYear();

    resultArray.push("|");
    resultArray.push(t("shipment.unloadAt").toLocaleUpperCase());
    resultArray.push(`: ${endYear}/${endMonth}/${endDay}`);
  }

  return resultArray.join(" ");
};
</script>
