<template>
  <v-form ref="form">
    <v-row class="load-form">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="item.name"
          :error="Boolean(violations?.name)"
          :error-messages="violations?.name"
          :label="$t('shipmentload.loadName')"
          :rules="requireRules"
          variant="outlined"
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
        <v-select
          v-model="packageTypeName"
          :label="$t('shipmentload.packageType')"
          :items="getTypeNames()"
          :rules="requireRules"
          variant="outlined"
          @update:modelValue="onTypeSelected"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          v-model.number="item.quantity"
          :error="Boolean(violations?.quantity)"
          :error-messages="violations?.quantity"
          :label="$t('shipmentload.quantity')"
          :rules="requireRules"
          type="number"
          variant="outlined"
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
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          v-model.number="item.length"
          :error="Boolean(violations?.length)"
          :error-messages="violations?.length"
          :label="$t('shipmentload.length')"
          :rules="requireRules"
          type="number"
          variant="outlined"
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
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          v-model.number="item.width"
          :error="Boolean(violations?.width)"
          :error-messages="violations?.width"
          :label="$t('shipmentload.width')"
          :rules="requireRules"
          type="number"
          variant="outlined"
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
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          v-model.number="item.height"
          :error="Boolean(violations?.height)"
          :error-messages="violations?.height"
          :label="$t('shipmentload.height')"
          :rules="requireRules"
          type="number"
          variant="outlined"
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
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          v-model.number="item.weight"
          :error="Boolean(violations?.weight)"
          :error-messages="violations?.weight"
          :label="$t('shipmentload.weight')"
          :rules="requireRules"
          type="number"
          variant="outlined"
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
      <v-col cols="12" sm="6" md="2">
        <v-radio-group v-model="item.isPileUp">
          <v-radio
            :label="$t('shipmentload.isPileUp')"
            color="indigo"
            variant="outlined"
            @click="toggleIsPileUp"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-btn
          v-if="isUpdate"
          :key="item['@id']"
          icon="mdi-pencil-circle"
          color="green"
          @click="addPerLoad"
        ></v-btn>
        <v-btn
          v-if="isUpdate"
          :key="item['@id']"
          icon="mdi-delete-circle"
          class="ml-2"
          color="red"
          @click="deleteItem"
        ></v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-btn
          v-if="!isUpdate"
          color="primary"
          class="load-add-btn"
          @click="addPerLoad"
          >{{ $t("shipmentload.addLoad") }}</v-btn
        >
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-form>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { ShipmentLoad } from "@/types/shipmentload";
import type { SubmissionErrors } from "@/types/error";
import { useShipmentLoadPackageTypeStore } from "@/store/shipmentload/packagetype";
import { storeToRefs } from "pinia";
import { Filters } from "@/types/list";
import { assertRequired } from "@/validations";
const props = defineProps<{
  values?: ShipmentLoad;
  errors?: SubmissionErrors;
  createdShipmentId?: string;
  isUpdate?: boolean;
}>();
const isUpdate = toRef(props, "isUpdate");
const packageTypeName: Ref<string> = ref("");
const shipmentloadTypeStore = useShipmentLoadPackageTypeStore();
const { items } = storeToRefs(shipmentloadTypeStore);
const page = ref(1);
const filters: Ref<Filters> = ref({});
const order = ref({});
const requireRules = [assertRequired()];

function getTypeNames() {
  return items.value.map((type) => type.name);
}

async function sendRequest() {
  await shipmentloadTypeStore.getItems({
    page: +page.value,
    order: order.value,
    ...filters.value,
  });
}

const violations = toRef(props, "errors");

const item: Ref<ShipmentLoad> = ref({
  isPileUp: false,
});

function onTypeSelected(value: string | null) {
  const selectedType = shipmentloadTypeStore.items.find(
    (type) => type.name === value,
  );
  if (selectedType) {
    item.value.packageType = selectedType["@id"];
  }
}
async function setShipmentTypeName() {
  if (item.value.packageType) {
    const type = shipmentloadTypeStore.items.find(
      (type) => type["@id"] === item.value.packageType,
    );
    if (type && type.name) {
      packageTypeName.value = type.name;
    }
  }
}

async function setup() {
  await sendRequest();
  await setShipmentTypeName();
}
setup();
if (props.values) {
  item.value = props.values;
}

const emit = defineEmits<{
  (e: "submit", item: ShipmentLoad): void;
  (e: "delete", item: ShipmentLoad): void;
}>();

async function addPerLoad() {
  item.value.shipment = props.createdShipmentId;
  if (!form.value) {
    return;
  }
  const v = await form.value.validate();
  if (v.valid) {
    emit("submit", item.value);
    if (!isUpdate.value) {
      resetForm();
    }
  }
}
function deleteItem() {
  emit("delete", item.value);
}

const form: Ref<VForm | null> = ref(null);

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}
function toggleIsPileUp(value: boolean) {
  item.value.isPileUp = !value;
}
</script>
<style lang="scss">
.load-add-btn {
  margin-top: 38px;
}
</style>
