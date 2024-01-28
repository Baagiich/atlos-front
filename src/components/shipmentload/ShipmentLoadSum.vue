<template>
  <v-container fluid class="load-sum-container">
    <v-form ref="form">
      <row>
        <h4>
          {{ $t("shipmentload.sum") }}
        </h4>
      </row>
      <v-row class="row-sum">
        <v-text-field
          variant="outlined"
          :label="$t('shipmentload.sumQuantity')"
          :model-value="totalQuantity"
          suffix="ш"
        ></v-text-field>

        <v-text-field
          variant="outlined"
          :label="$t('shipmentload.sumWeight')"
          :model-value="totalWeight"
          suffix="кг"
        ></v-text-field>

        <v-text-field
          variant="outlined"
          :label="$t('shipmentload.cube')"
          :model-value="totalCube"
          suffix="Мкуб"
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="loadPrice"
          type="number"
          variant="outlined"
          :label="$t('shipmentload.loadPrice')"
          :rules="priceRules"
          @update:model-value="onPriceWrited"
        ></v-text-field>
        <div color="red">
          {{ $t("shipmentload.loadAttention") }}
        </div>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Ref } from "vue";
import { assertNumber, assertRequired } from "@/validations";
import { useI18n } from "vue-i18n";
import { VForm } from "vuetify/components";
import { ShipmentLoad } from "@/types/shipmentload";

const props = defineProps(["createdLoads", "patchShipmentItem", "currency"]);
const patchShipmentItem = ref(props.patchShipmentItem);
const currency = ref(props.currency);
const totalQuantity = computed(() => {
  if (!props.createdLoads) {
    return 0;
  }
  return props.createdLoads.length;
});
const totalWeight = computed(() => {
  if (!props.createdLoads) {
    return 0;
  }
  return props.createdLoads.reduce(
    (sum: number, load: ShipmentLoad) => sum + (load.weight ?? 0),
    0,
  );
});
const totalCube = computed(() => {
  if (!props.createdLoads) {
    return 0;
  }
  return props.createdLoads.reduce(
    (sum: number, load: ShipmentLoad) =>
      sum + (load.length ?? 1) * (load.width ?? 1) * (load.height ?? 1),
    0,
  );
});
const loadPrice = ref();
const { t } = useI18n();
const priceRules = [
  assertRequired(),
  assertNumber(t("shipmentload.loadPrice")),
];
const onPriceWrited = () => {
  patchShipmentItem.value.loadPrice = {
    amount: +loadPrice.value,
    currency: currency,
  };
  patchShipmentItem.value.mainWeight = totalWeight.value;
  patchShipmentItem.value.mainQuantity = totalQuantity.value;
  patchShipmentItem.value.mainSize = totalCube.value;
};
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
<style lang="scss" scoped>
.load-sum-container {
  .row-sum {
    margin-top: 30px;
    pointer-events: none;
    h4 {
      text-align: right;
    }
  }
}
</style>
