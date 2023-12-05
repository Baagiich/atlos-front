<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          v-model="price"
          :error="Boolean(violations?.name)"
          :error-messages="violations?.name"
          :label="$t('shipmentload.shipmentPrice')"
          :rules="priceRules"
          type="number"
          variant="outlined"
          clearable
          @update:model-value="onPriceWrited"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="price = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="2">
        <v-sheet class="d-inline-flex" height="40">
          {{ item.currency }}
        </v-sheet>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-text-field
          v-model.number="item.prePayment"
          :error="Boolean(violations?.packageType)"
          :error-messages="violations?.packageType"
          :label="$t('shipmentload.prePayment')"
          :rules="percentNumberRules"
          type="number"
          variant="outlined"
          clearable
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.prePayment = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-text-field
          v-model.number="item.postPayment"
          :error="Boolean(violations?.quantity)"
          :error-messages="violations?.quantity"
          :label="$t('shipmentload.postPayment')"
          :rules="percentNumberRules"
          type="number"
          variant="outlined"
          clearable
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.postPayment = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-btn color="primary" @click="emitNextStep">{{ $t("add") }}</v-btn>
        <v-btn color="primary" variant="text" class="ml-2" @click="resetForm">
          {{ $t("reset") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { SubmissionErrors } from "@/types/error";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";
import { storeToRefs } from "pinia";
import { assertMaxLengthNumber, assertNumber, assertRequired } from "@/validations";
import { useI18n } from "vue-i18n";
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);
const props = defineProps<{
  errors?: SubmissionErrors;
}>();
const price: Ref<number> = ref();
const { t } = useI18n();

const violations = toRef(props, "errors");
const percentNumberRules = [assertRequired(), assertMaxLengthNumber(2)];
const priceRules = [assertRequired(), assertNumber(t("shipmentload.shipmentPrice"))];
var pileUpType = ref(false);
const onPriceWrited = () => {
  item.value.price = {
    amount: price.value,
    currency: item.value.currency,
  };
};
const emit = defineEmits<{
  (e: "second-step"): void;
}>();

async function emitNextStep() {
  const v = await form.value.validate();
  if (v.valid) {
    emit("second-step");
  }
}
const form: Ref<VForm | null> = ref(null);

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}
function toggleIsPileUp() {
  pileUpType.value = !pileUpType.value;
}
</script>
