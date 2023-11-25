<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12">
        <FormRepeater
          :values="item.shipmentImages"
          :label="$t('shipment.shipmentImages')"
          @update="(values: any) => (item.shipmentImages = values)"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.state"
          :error="Boolean(violations?.state)"
          :error-messages="violations?.state"
          :label="$t('shipment.state')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.state = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.driver"
          :error="Boolean(violations?.driver)"
          :error-messages="violations?.driver"
          :label="$t('shipment.driver')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.driver = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.action"
          :error="Boolean(violations?.action)"
          :error-messages="violations?.action"
          :label="$t('shipment.action')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.action = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.consignor"
          :error="Boolean(violations?.consignor)"
          :error-messages="violations?.consignor"
          :label="$t('shipment.consignor')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.consignor = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.shipmentCode"
          :error="Boolean(violations?.shipmentCode)"
          :error-messages="violations?.shipmentCode"
          :label="$t('shipment.shipmentCode')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.shipmentCode = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.shipmentType"
          :error="Boolean(violations?.shipmentType)"
          :error-messages="violations?.shipmentType"
          :label="$t('shipment.shipmentType')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.shipmentType = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <FormRepeater
          :values="item.shipmentShipperDeals"
          :label="$t('shipment.shipmentShipperDeals')"
          @update="(values: any) => (item.shipmentShipperDeals = values)"
        />
      </v-col>
      <v-col cols="12">
        <FormRepeater
          :values="item.reviews"
          :label="$t('shipment.reviews')"
          @update="(values: any) => (item.reviews = values)"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.shipper"
          :error="Boolean(violations?.shipper)"
          :error-messages="violations?.shipper"
          :label="$t('shipment.shipper')"
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
          v-model="item.fromAddress"
          :error="Boolean(violations?.fromAddress)"
          :error-messages="violations?.fromAddress"
          :label="$t('shipment.fromAddress')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.fromAddress = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.toAddress"
          :error="Boolean(violations?.toAddress)"
          :error-messages="violations?.toAddress"
          :label="$t('shipment.toAddress')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.toAddress = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.loadAt"
          :error="Boolean(violations?.loadAt)"
          :error-messages="violations?.loadAt"
          :label="$t('shipment.loadAt')"
          type="date"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.loadAt = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.unloadAt"
          :error="Boolean(violations?.unloadAt)"
          :error-messages="violations?.unloadAt"
          :label="$t('shipment.unloadAt')"
          type="date"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.unloadAt = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model.number="item.prePayment"
          :error="Boolean(violations?.prePayment)"
          :error-messages="violations?.prePayment"
          :label="$t('shipment.prePayment')"
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
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model.number="item.postPayment"
          :error="Boolean(violations?.postPayment)"
          :error-messages="violations?.postPayment"
          :label="$t('shipment.postPayment')"
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
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.price"
          :error="Boolean(violations?.price)"
          :error-messages="violations?.price"
          :label="$t('shipment.price')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.price = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.updatedAt"
          :error="Boolean(violations?.updatedAt)"
          :error-messages="violations?.updatedAt"
          :label="$t('shipment.updatedAt')"
          type="date"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.updatedAt = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.createdAt"
          :error="Boolean(violations?.createdAt)"
          :error-messages="violations?.createdAt"
          :label="$t('shipment.createdAt')"
          type="date"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.createdAt = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.shipmentTypeCode"
          :error="Boolean(violations?.shipmentTypeCode)"
          :error-messages="violations?.shipmentTypeCode"
          :label="$t('shipment.shipmentTypeCode')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.shipmentTypeCode = undefined"
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
import { formatDateInput } from "@/utils/date";
import FormRepeater from "@/components/common/FormRepeater.vue";
import type { Shipment } from "@/types/shipment";
import type { SubmissionErrors } from "@/types/error";
const props = defineProps<{
  values?: Shipment;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

const item: Ref<Shipment> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    publicationDate: formatDateInput(props.values.publicationDate),
  };
}

const emit = defineEmits<{
  (e: "submit", item: Shipment): void;
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
