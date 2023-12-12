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
      v-model="datePickerModel"
      v-if="showDatePickerDialog"
      @input="onDatePickerInput"
      @click="saveDatePicker"
    >
    </v-date-picker>
  </v-form>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import { useI18n } from "vue-i18n";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";

import { storeToRefs } from "pinia";
import dayjs from "dayjs";

const props = defineProps(["isstartdate", "title"]);
const isStartDate = ref(props.isstartdate);
const title = ref(props.title);
const { t } = useI18n();
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);
const date: Ref<Date> = ref(new Date());

const showDatePickerDialog = ref(false);
const datePickerModel = ref(new Date());

const emit = defineEmits<{}>();

function showDatePicker() {
  showDatePickerDialog.value = true;
}

function closeDatePicker() {
  showDatePickerDialog.value = false;
}

function saveDatePicker() {
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

function emitSubmit() {}

const form: Ref<VForm | null> = ref(null);

function resetForm() {
  if (!form.value) return;
  form.value.reset();
}
</script>
