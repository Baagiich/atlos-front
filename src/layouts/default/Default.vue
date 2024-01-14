<template>
  <div>
    <v-container>
      <div
        class="float-right d-inline-block font-weight-medium py-5"
        style="vertical-align: middle"
      >
        <span>{{ $t("Help") }}</span>
        <div class="d-inline-block text-black ml-16">
          <a
            href="#"
            :class="{ 'text-red': locale === 'en-US' }"
            class="text-black text-decoration-none mx-1"
            @click.prevent="locale = 'en-US'"
            >EN</a
          >
          <v-divider
            :style="{ height: '15px', verticalAlign: 'middle' }"
            vertical
          ></v-divider>
          <a
            href="#"
            class="text-black text-decoration-none mx-1"
            :class="{ 'text-red': locale === 'zh-Hans' }"
            @click.prevent="locale = 'zh-Hans'"
            >中文</a
          >
          <v-divider
            :style="{ height: '15px', verticalAlign: 'middle' }"
            color="bg-red"
            vertical
          ></v-divider>
          <a
            href="#"
            :class="{ 'text-red': locale === 'mn-MN' }"
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

      <v-divider
        :style="{ height: '52px', verticalAlign: 'middle' }"
        class="mx-7"
        inset
        vertical
      ></v-divider>

      <router-link
        class="d-inline align-middle mr-7 text-black text-decoration-none font-weight-medium"
        :to="{ name: 'ConsignorLogin' }"
        >{{ $t("Consignor") }}
      </router-link>

      <router-link
        class="d-inline align-middle text-black text-decoration-none font-weight-medium"
        :to="{ name: 'ShipperLogin' }"
        >{{ $t("Shipper") }}
      </router-link>
    </v-container>
  </div>
  <div>
    <v-img cover width="100%" src="@/assets/main-banner.jpg"></v-img>
  </div>
  <div style="margin-top: -100px; z-index: 1">
    <v-row>
      <v-col class="text-right font-weight-medium" style="z-index: 1" cols="6"
        ><span class="d-inline-block py-5" style="z-index: 1">{{
          $t("DownloadDriverApp")
        }}</span></v-col
      >
      <v-col>
        <v-img
          class="d-inline-block"
          src="@/assets/app-store.png"
          :height="60"
          :width="200"
        ></v-img>
        <v-img
          class="d-inline-block"
          src="@/assets/play-store.png"
          :height="60"
          :width="200"
        ></v-img>
      </v-col>
    </v-row>
  </div>

  <v-footer
    name="footer"
    color="#202020 !important"
    style="margin-top: 100px; padding: 70px 0"
  >
    <v-container>
      <v-row>
        <v-col cols="5">
          <h3>{{ $t("contactAddressTitle") }}</h3>
          <hr class="mb-8 mt-3" />
          <p>{{ $t("contactAddressAtlos") }}</p>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="5">
          <h3>{{ $t("contactTitle") }}</h3>
          <hr class="mb-8 mt-3" />
          <p>{{ $t("email") }}: support@atlos.mn</p>
          <p>{{ $t("contactPhoneTitle") }}: +976 99057911</p>
        </v-col>
      </v-row>
      <v-row class="mt-15">
        <v-col cols="5">
          <p>© 2024 {{ $t("copyright") }}</p>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="5">
          <v-btn class="pa-0 text-capitalize" variant="text" href="#">{{
            $t("contactTermsTitle")
          }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { watch } from "vue";

const { locale } = useI18n();

watch(locale, (newLocale) => {
  localStorage.setItem("locale", newLocale);
});
</script>
