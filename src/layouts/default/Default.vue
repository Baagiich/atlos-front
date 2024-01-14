<template>
  <div class="py-7">
    <v-container>
      <div
        class="float-right d-inline-block font-weight-medium py-5"
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

      <v-divider
        :style="{ height: '52px', verticalAlign: 'middle' }"
        class="mx-7"
        inset
        vertical
      ></v-divider>

      <router-link
        class="d-inline text-capitalize align-middle mr-7 text-black text-decoration-none font-weight-medium"
        :to="{ name: 'ConsignorLogin' }"
        >{{ $t("Consignor") }}
      </router-link>

      <router-link
        class="d-inline text-capitalize align-middle text-black text-decoration-none font-weight-medium"
        :to="{ name: 'ShipperLogin' }"
        >{{ $t("Shipper") }}
      </router-link>
    </v-container>
  </div>
  <div>
    <v-img cover src="@/assets/main-banner.jpg"></v-img>
  </div>
  <div style="margin-top: -100px; z-index: 1">
    <v-row>
      <v-col class="text-right font-weight-medium" style="z-index: 1"
        ><span class="d-inline-block py-5" style="z-index: 1">{{
          $t("DownloadDriverApp")
        }}</span></v-col
      >
      <v-col>
        <v-img
          class="d-inline-block"
          src="@/assets/app-store.png"
          :height="75"
          :width="206"
        ></v-img>
        <v-img
          class="d-inline-block"
          src="@/assets/play-store.png"
          :height="75"
          :width="201"
        ></v-img>
      </v-col>
    </v-row>
  </div>

  <v-footer name="footer"> footer </v-footer>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { watch } from "vue";

const { locale } = useI18n();

watch(locale, (newLocale) => {
  localStorage.setItem("locale", newLocale);
});
</script>
