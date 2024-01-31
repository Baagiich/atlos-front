<template>
  <v-toolbar class="px-4 d-flex justify-space-around" elevation="0">
    <v-breadcrumbs :breadcrumb="breadcrumb" />

    <v-spacer />

    <div>
      <v-btn
        v-if="actions?.includes('delete')"
        color="error"
        class="ml-sm-2"
        @click="toggleConfirmDelete"
      >
        {{ $t("delete") }}
      </v-btn>
      <v-btn
        v-if="actions?.includes('add')"
        prepend-icon="mdi-plus-circle"
        color="primary"
        :disabled="isLoading"
        :loading="isLoading"
        @click="emitAdd"
      >
        {{
          $route.name === "ShipmentList" ? $t("shipment.add") : $t("add")
        }}</v-btn
      >
    </div>

    <ConfirmDelete
      v-if="actions?.includes('delete')"
      :show="confirmDelete"
      @delete="emitDelete"
      @cancel="toggleConfirmDelete"
    />
  </v-toolbar>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
import ConfirmDelete from "@/components/common/ConfirmDelete.vue";
import { VBreadcrumbsItem } from "vuetify/lib/components/index.mjs";

const props = defineProps<{
  actions?: ("submit" | "reset" | "delete" | "add")[];
  isLoading: boolean;
  breadcrumb: VBreadcrumbsItem[];
}>();

const { actions } = toRefs(props);

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "reset"): void;
  (e: "add"): void;
  (e: "delete"): void;
}>();

function emitAdd() {
  emit("add");
}

function emitDelete() {
  emit("delete");
}

const confirmDelete = ref(false);

function toggleConfirmDelete() {
  confirmDelete.value = !confirmDelete.value;
}
</script>
