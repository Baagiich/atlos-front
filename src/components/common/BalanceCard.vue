<template>
  <v-card class="d-flex">
    <div class="balance-card-bordered align-self-center"></div>
    <v-card-item>
      <div class="text-medium-emphasis mb-1">
        {{ currency }}
      </div>
      <div class="text-h6 font-weight-bold mb-1">
        {{ balance }}
      </div>
      <div class="mb-1">
        <span class="text-medium-emphasis"
          >{{ $t("wallet.account.credit") }}:</span
        >
        {{ credit }}
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  currency?: string;
  balance?: string;
  color?: string;
  credit?: string;
}>();
</script>

<style>
.balance-card-bordered {
  width: 5px;
  height: 53px;
  flex-shrink: 0;
  border-radius: var(--none, 0px) 100px 100px var(--none, 0px);
  background: #c0000f;
}
</style>
