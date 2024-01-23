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
    <span v-if="!date && showError" class="date-error">{{
      $t("validation.required")
    }}</span>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";
import VueDatePicker from "@vuepic/vue-datepicker";
import { storeToRefs } from "pinia";
import { mn } from "date-fns/locale";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const date = ref();
const showError = ref(false);
const { t } = useI18n();
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
<style lang="scss">
.date-error {
  color: rgb(var(--v-theme-error));
  font-size: 12px;
  min-height: 14px;
  min-width: 1px;
  position: relative;
}
</style>
