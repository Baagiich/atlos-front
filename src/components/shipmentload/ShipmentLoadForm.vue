<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          v-model="item.name"
          :error="Boolean(violations?.name)"
          :error-messages="violations?.name"
          :label="$t('shipmentload.loadName')"
          variant="outlined"
          clearable
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
          v-model="item.packageType"
          :error="Boolean(violations?.packageType)"
          :error-messages="violations?.packageType"
          :label="$t('shipmentload.packageType')"
          variant="outlined"
          clearable
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.packageType = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-text-field
          v-model.number="item.quantity"
          :error="Boolean(violations?.quantity)"
          :error-messages="violations?.quantity"
          :label="$t('shipmentload.quantity')"
          variant="outlined"
          clearable
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.quantity = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-text-field
          v-model.number="item.length"
          :error="Boolean(violations?.length)"
          :error-messages="violations?.length"
          :label="$t('shipmentload.length')"
          variant="outlined"
          clearable
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.length = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-text-field
          v-model.number="item.width"
          :error="Boolean(violations?.width)"
          :error-messages="violations?.width"
          :label="$t('shipmentload.width')"
          variant="outlined"
          clearable
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.width = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-text-field
          v-model.number="item.height"
          :error="Boolean(violations?.height)"
          :error-messages="violations?.height"
          :label="$t('shipmentload.height')"
          variant="outlined"
          clearable
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.height = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-text-field
          v-model.number="item.weight"
          :error="Boolean(violations?.weight)"
          :error-messages="violations?.weight"
          :label="$t('shipmentload.weight')"
          variant="outlined"
          clearable
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.weight = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-radio-group v-model="item.isPileUp">
          <v-radio
            :label="$t('shipmentload.isPileUp')"
            :value="pileUpType"
            color="indigo"
            @click="toggleIsPileUp"
            variant="outlined"
            clearable
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-btn color="primary" type="add">{{ $t("add") }}</v-btn>

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
import type { ShipmentLoad } from "@/types/shipmentload";
import type { SubmissionErrors } from "@/types/error";
const props = defineProps<{
  values?: ShipmentLoad;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

const item: Ref<ShipmentLoad> = ref({});
var pileUpType = ref(false);
if (props.values) {
  item.value = {
    ...props.values,
  };
}

const emit = defineEmits<{
  (e: "submit", item: ShipmentLoad): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
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
