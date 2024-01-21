<template>
  <v-footer
    name="footer"
    color="#202020 !important"
    style="margin-top: 100px; padding: 70px 0"
  >
    <v-container>
      <v-row>
        <v-col cols="5">
          <h3>{{ $t("contactAddressTitle") }}</h3>
          <hr class="mb-8 mt-3" />
          <p>{{ $t("contactAddressAtlos") }}</p>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="5">
          <h3>{{ $t("contactTitle") }}</h3>
          <hr class="mb-8 mt-3" />
          <p>{{ $t("email") }}: support@atlos.mn</p>
          <p>{{ $t("contactPhoneTitle") }}: +976 99057911</p>
        </v-col>
      </v-row>
      <v-row class="mt-15">
        <v-col cols="5">
          <p>© 2024 {{ $t("copyright") }}</p>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="5">
          <v-btn class="pa-0 text-capitalize" variant="text" href="#">{{
            $t("contactTermsTitle")
          }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts" setup></script>
