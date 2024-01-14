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
  const routeName = router.currentRoute.value.name;
  return routeName
    ? !["Home", "ShipperLogin", "ConsignorLogin"].includes(routeName.toString())
    : false;
});
</script>
