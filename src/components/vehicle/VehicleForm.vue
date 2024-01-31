<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.plateNumber"
          :error="Boolean(violations?.plateNumber)"
          :error-messages="violations?.plateNumber"
          :label="$t('vehicle.plateNumber')"
          :rules="plateNumberRules"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.plateNumber = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.vinNumber"
          :error="Boolean(violations?.vinNumber)"
          :error-messages="violations?.vinNumber"
          :label="$t('vehicle.vinNumber')"
          :rules="vinNumberRules"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.vinNumber = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col v-if="isAdmin" cols="12" sm="6" md="6">
        <v-card
          class="mx-auto"
          :title="shipperName"
          :subtitle="$t('vehicle.shipper')"
          append-icon="mdi-open-in-new"
          @click="goToShowAdminPage(item.shipper)"
        ></v-card>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-select
          v-model="item.vehicleType"
          :label="$t('vehicle.vehicleType')"
          :items="vehicleTypes"
          :rules="required"
          item-title="key"
          item-value="value"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-select
          v-model="item.vehicleCapacity"
          :label="$t('vehicle.vehicleCapacity')"
          :items="vehicleCapacityTypes"
          :rules="required"
          item-title="key"
          item-value="value"
        />
      </v-col>

      <v-col v-if="isAdmin" cols="12" sm="6" md="6">
        <v-select
          v-model="item.status"
          :disabled="!item.adminEditable"
          :error="Boolean(violations?.status)"
          :error-messages="violations?.status"
          :items="vehicleStatusTypes"
          item-title="key"
          item-value="value"
          :label="$t('vehicle.status')"
        >
        </v-select>
      </v-col>
    </v-row>

    <v-row v-if="isAdmin">
      <v-col cols="12" sm="6" md="6">
        <v-checkbox
          v-model="item.fTypeVerified"
          :label="$t('vehicle.fTypeVerify')"
          :rules="fTypeRule"
        ></v-checkbox>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <VueDatePicker
          v-model="item.fTypeExpireAt"
          :placeholder="$t('vehicle.fTypeExpireAt')"
          :min-date="new Date()"
          :enable-time-picker="false"
          :format-locale="mn"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-btn color="primary" type="submit">{{ $t("submit") }}</v-btn>

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
import type { Vehicle } from "@/types/vehicle";
import type { SubmissionErrors } from "@/types/error";
import * as enumHelper from "@/utils/enumHelper";
import { VehicleType } from "@/types/vehicletype";
import { VehicleCapacityType } from "@/types/vehiclecapacitytype";
import { VehicleStatus } from "@/types/vehiclestatus";
import { AdminUser } from "@/types/adminuser";
import { useRouter } from "vue-router";
import * as apiToken from "@/utils/apiToken";
import { assertMaxLength, assertRequired } from "@/validations";
import { UserType } from "@/types/usertype";
import { mn } from "date-fns/locale";
import VueDatePicker from "@vuepic/vue-datepicker";
import { useI18n } from "vue-i18n";
const props = defineProps<{
  values?: Vehicle;
  errors?: SubmissionErrors;
}>();
const { t } = useI18n();
const violations = toRef(props, "errors");
const router = useRouter();
const item: Ref<Vehicle> = ref({});
const shipperName = ref();
const isAdmin = ref(false);
if (props.values) {
  item.value = {
    ...props.values,
  };
  shipperName.value =
    item.value.shipper.firstName + " " + item.value.shipper.lastName;
  isAdmin.value = apiToken.getDecodedToken()?.user_type === UserType.ADMIN;
}
const vehicleTypes = enumHelper.getMap(VehicleType);
vehicleTypes.unshift({ key: "", value: "" });

const vehicleCapacityTypes = enumHelper.getMap(VehicleCapacityType);
vehicleCapacityTypes.unshift({ key: "", value: "" });

const vehicleStatusTypes = enumHelper.getMap(VehicleStatus);
vehicleStatusTypes.unshift({ key: "", value: "" });
const plateNumberRules = [assertRequired(), assertMaxLength(8)];
const vinNumberRules = [assertRequired(), assertMaxLength(17)];
const required = [assertRequired()];
const fTypeRule = [checkFType()];

const emit = defineEmits<{
  (e: "submit", item: Vehicle): void;
}>();

const form: Ref<VForm | null> = ref(null);
async function emitSubmit() {
  if (!form.value) {
    return;
  }
  item.value.shipper = item.value.shipper["@id"];
  const v = await form.value.validate();
  if (v.valid) {
    emit("submit", item.value);
  }
}
function checkFType() {
  return () =>
    !item.value.fTypeExpireAt ||
    item.value.fTypeVerified ||
    t("validation.required");
}
function resetForm() {
  if (!form.value) return;

  form.value.reset();
}

function goToShowAdminPage(item: AdminUser) {
  router.push({
    name: "AdminUserShow",
    params: { id: item["@id"] },
  });
}
</script>
