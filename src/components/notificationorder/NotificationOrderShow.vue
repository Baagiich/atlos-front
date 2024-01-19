<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert
      v-if="error || deleteError || errorSend"
      type="error"
      class="mb-4"
      :closable="true"
    >
      {{ error || deleteError || errorSend }}
    </v-alert>

    <v-table v-if="item">
      <tbody>
        <tr>
          <td>
            {{ $t("notification.title") }}
          </td>

          <td>
            {{ item.title }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("description") }}
          </td>

          <td>
            {{ item.description }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("notification.segment") }}
          </td>
          <td>{{ item.segment?.toUpperCase() }}</td>
        </tr>
        <tr>
          <td>
            {{ $t("status") }}
          </td>
          <td>
            <v-chip
              v-if="item?.status == NotificationStatus.SENT"
              color="green"
              >{{ $t("notification.sentTitle") }}</v-chip
            >
            <v-chip v-else-if="item?.status == NotificationStatus.CREATED">{{
              $t("notification.createdTitle")
            }}</v-chip>
            <v-chip v-else color="red">{{
              $t("notification.failTitle")
            }}</v-chip>
            <v-btn
              v-if="item.status == NotificationStatus.CREATED"
              color="success"
              size="small"
              class="ma-2"
              :loading="isLoadingSend"
              :disabled="isLoadingSend"
              @click="toggleConfirmSendDialog"
              >{{ $t("notification.send") }}</v-btn
            >
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("notification.createdDate") }}
          </td>
          <td>{{ item.createdAt }}</td>
        </tr>
        <tr>
          <td>
            {{ $t("notification.sentDate") }}
          </td>
          <td>{{ item.sentAt }}</td>
        </tr>
      </tbody>
      <v-btn color="primary" variant="text" class="ml-2" @click="goToBackPage">
        {{ $t("back") }}
      </v-btn>
      <ConfirmDialog
        :show="confirmSend"
        @cancel="toggleConfirmSendDialog"
        @confirm="send(item)"
      ></ConfirmDialog>
    </v-table>
  </v-container>
  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import { useNotificationOrderDeleteStore } from "@/store/notificationorder/delete";
import { useNotificationOrderShowStore } from "@/store/notificationorder/show";
import { useNotificationOrderSendStore } from "@/store/notificationorder/send";
import { useBreadcrumb } from "@/composables/breadcrumb";
import { NotificationStatus } from "@/types/notification_status";
import { NotificationOrder } from "@/types/notificationorder";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();
const confirmSend = ref(false);

const showStore = useNotificationOrderShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(showStore);

const deleteStore = useNotificationOrderDeleteStore();
const { deleted, error: deleteError } = storeToRefs(deleteStore);

const sendStore = useNotificationOrderSendStore();
const {
  updated: updatedSend,
  error: errorSend,
  isLoading: isLoadingSend,
} = storeToRefs(sendStore);

await showStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    deleteStore.setError(t("itemNotFound"));
    return;
  }

  await deleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "NotificationOrderList" });
}

onBeforeUnmount(() => {
  showStore.$reset();
});

function goToBackPage() {
  router.back();
}

function toggleConfirmSendDialog() {
  confirmSend.value = !confirmSend.value;
}

async function send(item: NotificationOrder) {
  toggleConfirmSendDialog();
  if (!item.id) {
    return;
  }
  await sendStore.send(item.id);
  if (!updatedSend?.value) {
    return;
  }
  router.push({ name: "NotificationOrderList" });
}
onBeforeUnmount(() => {
  sendStore.$reset();
});
</script>
