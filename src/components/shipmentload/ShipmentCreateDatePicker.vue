<template>
  <VueDatePicker v-model="date" range :format="formatRange" :format-locale="mn" @update:model-value="selectDate">
  </VueDatePicker>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { storeToRefs } from "pinia";
import { mn } from 'date-fns/locale';
import dayjs from "dayjs";

const date = ref();

onMounted(() => {
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
  date.value = [startDate, endDate];
})
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);


function selectDate() {
  item.value.loadAt = dayjs(date.value[0]).toISOString();
  item.value.unloadAt = dayjs(date.value[0]).toISOString();
}

const formatRange = (range) => {
  const startDate = range[0];
  const endDate = range[1];

  const startDay = startDate.getDate();
  const startMonth = startDate.getMonth() + 1;
  const startYear = startDate.getFullYear();

  const endDay = endDate.getDate();
  const endMonth = endDate.getMonth() + 1;
  const endYear = endDate.getFullYear();

  return `АЧИХ: ${startYear}/${startMonth}/${startDay} | БУУЛГАХ: ${endYear}/${endMonth}/${endDay}`;
};
</script>
