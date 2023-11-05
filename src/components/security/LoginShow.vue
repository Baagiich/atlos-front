<template>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable="true">
      {{ error }}
    </v-alert>

    <LoginForm />
  </v-container>
</template>

<script setup lang="ts">
import { ref} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import LoginForm from './LoginForm.vue'

const { t } = useI18n();
const router = useRouter();

const page = ref("1");
const order = ref({});

async function sendRequest() {
  await countryListStore.getItems({
    page: page.value,
    order: order.value,
  });
}

// sendRequest();

</script>
