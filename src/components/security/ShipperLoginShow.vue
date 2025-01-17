<template>
  <v-container fluid class="pa-0">
    <v-row justify="center">
      <v-col cols="12" sm="6" md="6" class="pa-15">
        <div
          class="float-right d-inline-block font-weight-medium"
          style="vertical-align: middle; height: 100px"
        >
          <router-link
            class="d-inline align-middle mr-7 text-black text-decoration-none font-weight-medium"
            :to="{ name: 'Help' }"
            >{{ $t("Help") }}</router-link
          >
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
              @click.prevent="locale = 'zh-HANS'"
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

        <div class="mt-15 pt-15">
          <v-card-title
            style="text-transform: uppercase; font-weight: bold"
            align="center"
            justify="center"
          >
            {{ $t("Shipper") }}
          </v-card-title>
          <v-card-subtitle class="text-center font-weight-medium">
            {{ $t("signin") }}
          </v-card-subtitle>
        </div>
        <v-alert
          v-if="queryStatus === 'success'"
          type="success"
          :title="$t('successfull')"
          :text="$t('registrationSuccessText')"
        ></v-alert>
        <v-alert v-if="error" type="error" class="mb-4" :closable="true">
          {{ error }}
        </v-alert>
        <v-row align="center" justify="center">
          <v-col cols="6">
            <LoginForm
              :errors="violations"
              :loading="isLoading"
              @submit="login"
            />
          </v-col>
        </v-row>

        <v-card-subtitle align="center" justify="center">
          <router-link
            class="d-inline align-middle text-decoration-none"
            style="font-weight: bold; color: red"
            :to="{ name: 'ShipperCompanyRegister' }"
            >{{ $t("register") }}
          </router-link>
        </v-card-subtitle>

        <v-row class="mt-15">
          <v-col
            cols="12"
            sm="6"
            md="6"
            align="center"
            justify="center"
            class="mt-auto mb-auto"
          >
            <router-link
              class="d-inline align-middle text-black text-decoration-none font-weight-medium"
              :to="{ name: 'ConsignorLogin' }"
              >{{ $t("Consignor") }}
            </router-link>
          </v-col>
          <v-col cols="12" sm="6" md="6" align="center" justify="center">
            <div class="pa-5 font-weight-medium">
              {{ $t("DownloadDriverApp") }}
            </div>
            <v-img
              class="d-inline-block"
              src="@/assets/app-store.png"
              :height="55"
              :width="156"
            ></v-img>
            <v-img
              class="d-inline-block"
              src="@/assets/play-store.png"
              :height="55"
              :width="151"
            ></v-img>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-img cover height="100vh" src="@/assets/shipper-banner.jpg"></v-img>
      </v-col>
    </v-row>
  </v-container>
  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { Ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import LoginForm from "@/components/security/LoginForm.vue";
import { useSecurityLoginStore } from "@/store/security/login";
import Loading from "@/components/common/Loading.vue";
import { Auth } from "@/types/auth";
import { storeToRefs } from "pinia";
import isUndefined from "lodash/isUndefined";
import { useI18n } from "vue-i18n";
import { watch } from "vue";
import { ref } from "vue";

const { locale } = useI18n();

const router = useRouter();

const queryStatus: Ref<string | undefined> = ref(undefined);

queryStatus.value = router.currentRoute.value.query.status?.toString();

const securityLoginStore = useSecurityLoginStore();

const { isLoading, violations, error } = storeToRefs(securityLoginStore);

async function login(item: Auth) {
  await securityLoginStore.login(item);

  if (isUndefined(error?.value)) {
    router.push({
      name: "ShipmentList",
    });
  }
}
watch(locale, (newLocale) => {
  localStorage.setItem("locale", newLocale);
});
onBeforeUnmount(() => {
  securityLoginStore.$reset();
});
</script>
