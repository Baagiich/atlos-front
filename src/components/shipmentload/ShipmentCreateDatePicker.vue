<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="2">
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
      </v-col>
    </v-row>

    <!-- <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-btn color="primary" type="submit">{{ $t("submit") }}</v-btn>
        <v-btn color="primary" variant="text" class="ml-2" @click="resetForm">
          {{ $t("reset") }}
        </v-btn>
      </v-col>
    </v-row> -->
  </v-form>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import { useI18n } from "vue-i18n";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";

import { storeToRefs } from "pinia";

const props = defineProps(["date", "title"]);
const date = ref(props.date);
const title = ref(props.title);
const { t } = useI18n();


const newShipmentStore = useCreateNewShipmentStore();
const { items, totalItems, error, isLoading } = storeToRefs(newShipmentStore);

const showDatePickerDialog = ref(false);
const datePickerModel = ref(new Date());

const emit = defineEmits<{
}>();

function showDatePicker() {
  showDatePickerDialog.value = true;
}

function closeDatePicker() {
  showDatePickerDialog.value = false;
}

function saveDatePicker() {
  date.value = datePickerModel.value;
  showDatePickerDialog.value = false;
  
}

function onDatePickerInput(value: any) {
  datePickerModel.value = value;
}

function emitSubmit() {
  item.value.price = {
    amount: 0,
    currency: selectedCurrency.value,
  };
  newShipmentStore.setItems([item.value]);
  emit("submit", item.value);
}

const form: Ref<VForm | null> = ref(null);

function resetForm() {
  if (!form.value) return;
  form.value.reset();
}
</script>
