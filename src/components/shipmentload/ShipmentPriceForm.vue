<template>
  <v-form v-if="item" ref="form">
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          v-model="item.name"
          :error="Boolean(violations?.name)"
          :error-messages="violations?.name"
          :label="$t('shipmentload.name')"
          :rules="priceRules"
          type="string"
          variant="outlined"
          clearable
          @update:model-value="onPriceWrited"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.name = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
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
      <v-col cols="4">
        <v-select
          v-model="selectedPercent"
          :label="$t('shipmentload.prePostPaymentRatio')"
          :items="paymentPercentList.map((item) => item.percent)"
          :rules="percentNumberRules"
          variant="outlined"
          clearable
          @update:modelValue="onSelectChange()"
        ></v-select>
      </v-col>
      <v-col v-if="item.loadType === 2" cols="12" sm="6" md="1">
        <v-text-field
          v-model="item.mainWeight"
          :error="Boolean(violations?.name)"
          :error-messages="violations?.name"
          :label="$t('shipmentload.mainWeight')"
          :rules="priceRules"
          type="number"
          variant="outlined"
          clearable
          @update:model-value="onPriceWrited"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.mainWeight = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col v-if="item.loadType === 2" cols="12" sm="6" md="1">
        <v-text-field
          v-model.number="item.mainSize"
          :error="Boolean(violations?.packageType)"
          :error-messages="violations?.packageType"
          :label="$t('shipmentload.mainSize')"
          :rules="priceRules"
          type="number"
          variant="outlined"
          clearable
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.mainSize = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
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
import { assertNumber, assertRequired } from "@/validations";
import { useI18n } from "vue-i18n";
const selectedPercent: Ref<string> = ref<string>("");
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);
const props = defineProps<{
  errors?: SubmissionErrors;
}>();
const price: Ref<number | undefined> = ref();
const { t } = useI18n();

const violations = toRef(props, "errors");
const percentNumberRules = [assertRequired()];
const priceRules = [
  assertRequired(),
  assertNumber(t("shipmentload.shipmentPrice")),
];
const onPriceWrited = () => {
  if (!item || !item.value) {
    return;
  }
  if (typeof price.value === "undefined") {
    return;
  }
  item.value.price = {
    amount: +price.value,
    currency: item.value.currency,
  };
};
const paymentPercentList = [
  { percent: "10-90", prePayValue: 10 },
  { percent: "20-80", prePayValue: 20 },
  { percent: "30-70", prePayValue: 30 },
  { percent: "40-60", prePayValue: 40 },
  { percent: "50-50", prePayValue: 50 },
  { percent: "60-40", prePayValue: 60 },
  { percent: "70-30", prePayValue: 70 },
  { percent: "80-20", prePayValue: 80 },
  { percent: "90-10", prePayValue: 90 },
];
function onSelectChange() {
  const selectedPayment = paymentPercentList.find(
    (item) => item.percent === selectedPercent.value,
  );

  if (selectedPayment) {
    if (!item || !item.value) {
      return;
    }
    item.value.prePayment = selectedPayment.prePayValue;
    item.value.postPayment = 100 - selectedPayment.prePayValue;
  }
}
async function validateForm(): Promise<boolean> {
  if (!form.value) {
    return false;
  }
  const v = await form.value.validate();
  return v.valid;
}
defineExpose({
  validateForm,
});
const form: Ref<VForm | null> = ref(null);
</script>
