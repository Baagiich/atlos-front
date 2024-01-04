<template>
  <v-dialog v-model="show" width="500">
    <v-sheet class="position-relative">
      <v-fade-transition hide-on-leave>
        <v-card
          append-icon="$close"
          class="mx-auto"
          elevation="16"
          max-width="500"
        >
          <template #append>
            <v-btn icon="$close" variant="text" @click="emitClose"></v-btn>
          </template>
          <v-divider></v-divider>
          <div class="py-12 text-center">
            <v-icon
              v-if="type == 'success'"
              class="mb-6"
              color="success"
              icon="mdi-check-circle-outline"
              size="80"
            ></v-icon>
            <v-icon
              v-else
              class="mb-6"
              color="red"
              icon="mdi-check-circle-outline"
              size="80"
            ></v-icon>

            <div class="text-h5 font-weight-bold">
              {{ message }}
            </div>
          </div>

          <v-divider></v-divider>

          <div class="pa-4 text-end">
            <v-btn
              class="text-none"
              color="medium-emphasis"
              min-width="92"
              rounded
              variant="outlined"
              @click="emitClose"
            >
              Close
            </v-btn>
          </div>
        </v-card>
      </v-fade-transition>
    </v-sheet>
  </v-dialog>
</template>
<script setup lang="ts">
import { toRef } from "vue";

const props = defineProps<{
  show: boolean;
  type?: "success" | "fail";
  message: string;
}>();

let show = toRef(props, "show");

const emit = defineEmits<{
  (e: "close"): void;
}>();

function emitClose() {
  emit("close");
}
</script>
