<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />
  <v-container fluid>
    <v-alert
      v-if="created || updated"
      type="success"
      class="mb-4"
      :closable="true"
    >
      <template v-if="updated">
        {{ $t("itemUpdated", [updated["@id"]]) }}
      </template>
      <template v-else-if="created">
        {{ $t("itemCreated", [created["@id"]]) }}
      </template>
    </v-alert>
    <Form v-if="item" :values="item" :errors="violations" @submit="update" />
  </v-container>
  <Loading :visible="isLoading" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Form from "@/components/notificationorder/NotificationOrderForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useNotificationOrderUpdateStore } from "@/store/notificationorder/update";
import { useNotificationOrderCreateStore } from "@/store/notificationorder/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { NotificationOrder } from "@/types/notificationorder";

const route = useRoute();
const breadcrumb = useBreadcrumb();

const createStore = useNotificationOrderCreateStore();
const { created } = storeToRefs(createStore);

const updateStore = useNotificationOrderUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  violations,
} = storeToRefs(updateStore);

await updateStore.retrieve(decodeURIComponent(route.params.id as string));

async function update(item: NotificationOrder) {
  await updateStore.update(item);
}

onBeforeUnmount(() => {
  createStore.$reset();
  updateStore.$reset();
});
</script>
