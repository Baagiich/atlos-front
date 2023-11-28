<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert
      v-if="error || deleteError"
      type="error"
      class="mb-4"
      closable="true"
    >
      {{ error || deleteError }}
    </v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <ShipmentForm />
      </v-col>
    </v-row>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
// import { useMercureItem } from "@/composables/mercureItem";
import { useBreadcrumb } from "@/composables/breadcrumb";
import ShipmentForm from "@/components/shipmentload/ShipmentCreateForm.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();


// useMercureItem({
//   store: shipmentShowStore,
//   deleteStore: shipmentDeleteStore,
//   redirectRouteName: "ShipmentList",
// });



onBeforeUnmount(() => {
  // shipmentShowStore.$reset();
});
</script>
<style lang="scss">
.driver-request-shipment-code {
  text-align: right;
  font-weight: bold;
}
</style>
