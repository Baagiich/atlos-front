<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-text-field
      v-model="date"
      :label="title"
      prepend-icon="event"
      readonly
      @click="showDatePicker"
    ></v-text-field>

    <v-date-picker
      v-if="showDatePickerDialog"
      v-model="datePickerModel"
      @input="onDatePickerInput"
      @click="saveDatePicker"
    >
    </v-date-picker>
  </v-form>
</template>

<script setup lang="ts">
import { ref, defineProps, Ref } from "vue";
import { VForm } from "vuetify/components";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";

import { storeToRefs } from "pinia";
import dayjs from "dayjs";

const props = defineProps<{
  isstartdate?: boolean;
  title?: string;
}>();
const isStartDate = ref(props.isstartdate);
const title = ref(props.title);
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);
const date: Ref<Date> = ref(new Date());

const showDatePickerDialog = ref(false);
const datePickerModel = ref(new Date());

function showDatePicker() {
  showDatePickerDialog.value = true;
}

function saveDatePicker() {
  if (!item || !item.value) {
    return;
  }
  date.value = datePickerModel.value;
  if (isStartDate.value) {
    item.value.loadAt = dayjs(date.value).format("YYYY/MM/DD");
  } else {
    item.value.unloadAt = dayjs(date.value).format("YYYY/MM/DD");
  }
  showDatePickerDialog.value = false;
}

function onDatePickerInput(value: any) {
  datePickerModel.value = value;
}

function emitSubmit() {
  return true;
}

const form: Ref<VForm | null> = ref(null);
</script>
