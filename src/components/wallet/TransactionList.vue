<template>
  <v-data-table-server
    :headers="headers"
    :items="items"
    :items-length="totalItems"
    :loading="isLoading"
    :items-per-page="items.length"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>
          <v-chip v-if="item.is_inflow === 1" color="green">
            +{{ item.amount }}
          </v-chip>
          <v-chip v-else color="red"> -{{ item.amount }} </v-chip>
        </td>
        <td>{{ item.currency }}</td>
        <td>{{ item.created_at }}</td>
        <td>{{ item.description }}</td>
      </tr>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
const props = defineProps({
  headers: {
    type: Array,
  },
  items: { type: Array },
  totalItems: {
    type: Number,
    default: 0,
  },
  isLoading: Boolean,
});
</script>
