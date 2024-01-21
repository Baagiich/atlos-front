<template>
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
</template>

<script lang="ts" setup></script>
