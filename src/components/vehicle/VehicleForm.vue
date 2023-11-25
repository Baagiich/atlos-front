<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.plateNumber"
          :error="Boolean(violations?.plateNumber)"
          :error-messages="violations?.plateNumber"
          :label="$t('vehicle.plateNumber')"
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
          v-model="item.shipper"
          :error="Boolean(violations?.shipper)"
          :error-messages="violations?.shipper"
          :label="$t('vehicle.shipper')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.shipper = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.vehicleType"
          :error="Boolean(violations?.vehicleType)"
          :error-messages="violations?.vehicleType"
          :label="$t('vehicle.vehicleType')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.vehicleType = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.vehicleCapacity"
          :error="Boolean(violations?.vehicleCapacity)"
          :error-messages="violations?.vehicleCapacity"
          :label="$t('vehicle.vehicleCapacity')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.vehicleCapacity = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
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
const props = defineProps<{
  values?: Vehicle;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

const item: Ref<Vehicle> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

const emit = defineEmits<{
  (e: "submit", item: Vehicle): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}

const form: Ref<VForm | null> = ref(null);

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}
</script>
