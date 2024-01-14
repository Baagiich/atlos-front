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
import { Ref } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const showSidebar: Ref<boolean> = ref(true);

const routeName = router.currentRoute.value.name;
if (routeName) {
  showSidebar.value = ![
    "Home",
    "ShipperLogin",
    "ConsignorLogin",
    "ShipperCompanyRegister",
    "ConsignorRegister",
  ].includes(routeName.toString());
}
</script>
