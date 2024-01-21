<template>
  <div>
    <v-container>
      <div
        class="float-right d-inline-block font-weight-medium py-5"
        style="vertical-align: middle"
      >
        <router-link
          class="d-inline align-middle mr-7 text-black text-decoration-none font-weight-medium"
          :to="{ name: 'Help' }"
          >{{ $t("Help") }}</router-link
        >
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
            :class="{ 'text-red': locale === 'zh-HANS' }"
            @click.prevent="locale = 'zh-HANS'"
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
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { watch } from "vue";

const { locale } = useI18n();

watch(locale, (newLocale) => {
  localStorage.setItem("locale", newLocale);
});
</script>
