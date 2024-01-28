<template>
  <v-form>
    <div class="car-wrapper">
      <div v-for="vtype in vehicleTypes" :key="vtype.key" class="container">
        <v-checkbox
          v-model="selected"
          :label="$t('shipmentload.' + vtype.key)"
          :value="vtype.value"
        >
        </v-checkbox>
        <v-img
          v-if="vtype.value === VehicleType.HEAVY"
          src="@/assets/heavy.png"
        ></v-img>
        <v-img
          v-if="vtype.key === 'REFRIGERATOR'"
          src="@/assets/refrigeragtor.png"
        ></v-img>
        <v-img
          v-if="vtype.value === VehicleType.TENT"
          src="@/assets/tent.png"
        ></v-img>
        <v-img
          v-if="vtype.value === VehicleType.TRAILER_METER13"
          src="@/assets/trailer_meter13.png"
        ></v-img>
        <v-img
          v-if="vtype.value === VehicleType.TRAILER_METER17"
          src="@/assets/trailer_meter17.png"
        ></v-img>
      </div>
    </div>
    <span v-if="selected.length === 0 && showError" class="date-error">{{
      $t("validation.required")
    }}</span>
  </v-form>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { VForm } from "vuetify/components";
import * as enumHelper from "@/utils/enumHelper";
import { VehicleType } from "@/types/vehicletype";

const selected = ref([]);
const vehicleTypes = enumHelper.getMap(VehicleType);
const showError = ref(false);

async function validateForm() {
  if (selected.value.length === 0) {
    showError.value = true;
    return false;
  }
  return selected;
}
defineExpose({
  validateForm,
});
onBeforeUnmount(() => {
  selected.value = [];
});
</script>
<style lang="scss">
.car-wrapper {
  display: grid;
  place-items: center;
  gap: 15px;
  margin-top: 20px;
  .container {
    height: 100px;
    width: 200px;
    background-color: #ffffff;
    box-shadow: 0 0 25px rgba(17, 1, 68, 0.08);
    border-radius: 8px;
    position: relative;
    cursor: pointer;
  }
  .v-selection-control__wrapper {
    position: absolute;
    right: 0;
    top: 0;
  }
  .v-label--clickable {
    -webkit-appearance: none;
    position: relative;
    width: 100%;
    cursor: pointer;
    height: 100px;
    align-items: flex-start;
  }
  .v-label--clickable:after {
    position: absolute;
    font-family: "Font Awesome 5 Free";
    font-weight: 400;
    content: "\f111";
    font-size: 18px;
    color: #478bfb;
    right: 10px;
    top: -5px;
  }
  .v-label--clickable:checked:after {
    font-weight: 900;
    content: "\f058";
    color: #478bfb;
  }
  .v-selection-control {
    min-height: 200px;
  }
  .v-label--clickable:after {
    display: none;
  }
  .container .v-img {
    width: 100px;
    position: absolute;
    top: 10px;
  }
}

@media screen and (min-width: 950px) {
  .car-wrapper {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .container {
    width: 300px;
  }
  .v-label--clickable:after {
    font-size: 22px;
  }
}
</style>
