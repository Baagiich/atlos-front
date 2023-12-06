<template>
  <v-table>
    <tbody>
      <tr v-for="item in items" :key="item['@id']">
        <td>{{ $t("vehicleimage." + item.tag) }}</td>
        <td><MediaObjectThumb :id="item['image']"></MediaObjectThumb></td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import type { VehicleImage } from "@/types/vehicleimage";
import MediaObjectThumb from "@/components/mediaobject/MediaObjectThumb.vue";

defineProps<{
  items: VehicleImage[];
}>();
</script>
