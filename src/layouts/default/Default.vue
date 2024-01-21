<template>
  <AppBar />
  <div>
    <router-view />
  </div>
  <Footer />
</template>

<script lang="ts" setup>
import AppBar from "./AppBar.vue";
import Footer from "./Footer.vue";
</script>
