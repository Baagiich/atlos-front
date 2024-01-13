<template>
  <v-container fluid class="load-sum-container">
    <v-form ref="form">
      <v-row class="row-sum">
        <v-col cols="3"> </v-col>
        <v-col cols="1">
          <h4>
            {{ $t("shipmentload.sum") }}
          </h4>
        </v-col>
        <v-col cols="1">
          <v-text-field
            variant="outlined"
            :label="$t('shipmentload.sumQuantity')"
            :model-value="totalQuantity"
            suffix="ш"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-text-field
            variant="outlined"
            :label="$t('shipmentload.sumWeight')"
            :model-value="totalWeight"
            suffix="кг"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            variant="outlined"
            :label="$t('shipmentload.cube')"
            :model-value="totalCube"
            suffix="Мкуб"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="3"> </v-col>
        <v-col cols="12" sm="6" md="1">
          <v-text-field
            v-model="loadPrice"
            type="number"
            variant="outlined"
            :label="$t('shipmentload.loadPrice')"
            :rules="priceRules"
            @update:model-value="onPriceWrited"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <div color="red">
            {{ $t("shipmentload.loadAttention") }}
          </div>
        </v-col>
      </v-row>
      <!-- <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-btn color="primary" variant="outlined" @click="resetForm">
          {{ $t("shipmentload.return") }}
        </v-btn>
        <v-btn  color="primary" class="ml-2" @click="emitNextStep">{{ $t("shipmentload.continue") }}</v-btn>
      </v-col>
    </v-row> -->
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
const form: Ref<VForm | null> = ref(null);
</script>
<style lang="scss" scoped>
.load-sum-container {
  margin-top: 85px;
  .row-sum {
    pointer-events: none;
    h4 {
      text-align: right;
    }
  }
}
</style>
