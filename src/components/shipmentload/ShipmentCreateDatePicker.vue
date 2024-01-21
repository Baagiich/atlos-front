<template>
  <form id="myForm">
    <VueDatePicker
      v-model="date"
      range
      placeholder="Ачих, буулгах огноо"
      :format="formatRange"
      :format-locale="mn"
      required
      @update:model-value="selectDate"
    />
    <span class="date-error" v-if="!date && showError">{{
      $t("validation.required")
    }}</span>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { storeToRefs } from "pinia";
import { mn } from "date-fns/locale";
import dayjs from "dayjs";

const date = ref();
const showError = ref(false);
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);

function selectDate() {
  if (!item || !item.value) {
    return;
  }

  item.value.loadAt = dayjs(date.value[0]).toISOString();
  item.value.unloadAt = dayjs(date.value[1]).toISOString();
}
function validateForm() {
  if (!date.value) {
    showError.value = true;
    return false;
  }
  return true;
}
defineExpose({
  validateForm,
});

const formatRange = (range: any[]) => {
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
<style lang="scss">
.date-error {
  color: rgb(var(--v-theme-error));
  font-size: 12px;
  min-height: 14px;
  min-width: 1px;
  position: relative;
}
</style>
