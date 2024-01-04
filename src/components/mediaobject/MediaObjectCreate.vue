<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable>{{
      error
    }}</v-alert>

    <Form :errors="violations" @submit="create" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/mediaobject/MediaObjectForm.vue";
import { useMediaObjectCreateStore } from "@/store/mediaobject/create";
import { useBreadcrumb } from "@/composables/breadcrumb";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const mediaobjectCreateStore = useMediaObjectCreateStore();
const { created, isLoading, violations, error } = storeToRefs(
  mediaobjectCreateStore,
);

// async function create(item: MediaObject) {
async function create() {
  await mediaobjectCreateStore.create(new FormData());

  if (!created?.value) {
    return;
  }

  router.push({
    name: "MediaObjectUpdate",
    params: { id: created?.value?.["@id"] },
  });
}

onBeforeUnmount(() => {
  mediaobjectCreateStore.$reset();
});
</script>
