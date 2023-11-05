<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="email"
          :label="$t('email')"
          :error="Boolean(violations?.email)"
          :error-messages="violations?.email"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="email = undefined"
            >
              mdi-email
            </v-icon>
          </template>
        </v-text-field>
        <v-text-field
          v-model="password"
          :label="$t('password')"
          :error="Boolean(violations?.password)"
          :error-messages="violations?.password"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="email = undefined"
            >
              mdi-lock
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-btn color="primary" type="submit">{{ $t("submit") }}</v-btn>

        <v-btn color="primary" variant="text" class="ml-2" @click="resetForm">
          {{ $t("reset") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import {ref} from "vue";

const email = ref(null);
const password = ref(null);
</script>
