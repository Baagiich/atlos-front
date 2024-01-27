<template>
  <v-app>
    <v-layout>
      <Sidebar v-if="showSidebar"></Sidebar>
      <v-main><router-view /> </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts" setup>
import Sidebar from "@/layouts/Sidebar.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const showSidebar = computed(() => {
  const showSidebar = router.currentRoute.value.meta?.showSidebar;
  return showSidebar === undefined ? true : showSidebar;
});
</script>
