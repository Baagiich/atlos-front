<template>
  <v-container fluid class="pa-0">
    <v-row justify="center">
      <v-col cols="12" sm="6" md="6" class="pa-15">
        <div
          class="float-right d-inline-block font-weight-medium"
          style="vertical-align: middle; height: 100px"
        >
          <span>{{ $t("Help") }}</span>
          <div class="d-inline-block text-black ml-16">
            <a
              href="#"
              class="text-black text-decoration-none mx-1"
              @click.prevent="locale = 'en-US'"
              >EN</a
            >
            <a
              href="#"
              class="text-black text-decoration-none mx-1"
              @click.prevent="locale = 'zh-Hans'"
              >中文</a
            >
            <a
              href="#"
              class="text-black text-decoration-none mx-1"
              @click.prevent="locale = 'mn-MN'"
              >MNG</a
            >
          </div>
        </div>

        <router-link style="vertical-align: middle" :to="{ name: 'Home' }">
          <v-img
            class="d-inline-block"
            src="@/assets/logo-atlos.png"
            :height="40"
            :width="100"
          ></v-img>
        </router-link>

        <div class="mt-15 pt-15 mb-10">
          <v-card-title
            style="text-transform: uppercase; font-weight: bold"
            align="center"
            justify="center"
          >
            {{ $t("Shipper") }}
          </v-card-title>
          <v-card-subtitle class="text-center font-weight-medium">
            {{ $t("registerVerification") }}
          </v-card-subtitle>
        </div>
        <v-alert v-if="error" type="error" class="mb-4" closable>{{
          error
        }}</v-alert>

        <Form :errors="violations" @submit="verify" />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-img cover height="100vh" src="@/assets/shipper-banner.png"></v-img>
      </v-col>
    </v-row>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/adminuser/AdminUserVerifyForm.vue";
import { useAdminUserCreateStore } from "@/store/adminuser/create";
import type { AdminUserVerify } from "@/types/adminuserverify";
import { useI18n } from "vue-i18n";
import { watch } from "vue";

const { locale } = useI18n();
const router = useRouter();

const adminUserCreate = useAdminUserCreateStore();
const { isLoading, violations, error, verified } = storeToRefs(adminUserCreate);
async function verify(item: AdminUserVerify) {
  await adminUserCreate.verify(item);

  if (!verified?.value) {
    return;
  }

  router.push({ name: "ShipperLogin" });
}
watch(locale, (newLocale) => {
  localStorage.setItem("locale", newLocale);
});

onBeforeUnmount(() => {
  adminUserCreate.$reset();
});
</script>
