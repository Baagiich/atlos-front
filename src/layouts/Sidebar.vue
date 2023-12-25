<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <v-list-item
      prepend-avatar="https://mgl.gogo.mn/newsn/thumbnail/1000/images/c/2023/10/311617-10102023-1696900623-2008281341-Fuso_1.jpg"
      title="ATLOS DASHBOARD"
      nav
    >
      <template #append>
        <v-btn
          variant="text"
          icon="mdi-chevron-left"
          @click.stop="rail = !rail"
        ></v-btn>
      </template>
    </v-list-item>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item
        v-for="(menuItem, index) in menuItems"
        v-show="isGrantedRole(menuItem.roles)"
        :key="index"
        :prepend-icon="menuItem.icon"
        :title="menuItem.title"
        :value="menuItem.routeName"
        @click="router.push({ name: menuItem.routeName })"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as apiToken from "@/utils/apiToken";
import { useI18n } from "vue-i18n";
const router = useRouter();
const { t } = useI18n();

const drawer = ref(true);
const rail = ref(true);
const menuItems = [
  {
    title: t("order.title"),
    routeName: "OrderList",
    icon: "mdi-account-credit-card",
    roles: ["ROLE_CONSIGNOR", "ROLE_SHIPPER"],
  },
  {
    title: t("wallet.title"),
    routeName: "WalletList",
    icon: "mdi-wallet",
    roles: ["ROLE_CONSIGNOR", "ROLE_SHIPPER"],
  },
  {
    title: t("bank.title"),
    routeName: "BankList",
    icon: "mdi-bank",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: t("currency.title"),
    routeName: "CurrencyList",
    icon: "mdi-currency-usd",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: t("city.title"),
    routeName: "CityList",
    icon: "mdi-home-city",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: t("contract.title"),
    routeName: "ContractList",
    icon: "mdi-note-text",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: t("contracttemplate.title"),
    routeName: "ContractTemplateList",
    icon: "mdi-note-search",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: t("country.title"),
    routeName: "CountryList",
    icon: "mdi-earth",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: t("driver.title"),
    routeName: "DriverList",
    icon: "mdi-card-account-details",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: t("shipment.title"),
    routeName: "ShipmentList",
    icon: "mdi-truck-delivery",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: t("shppercompany.title"),
    routeName: "ShipperCompanyList",
    icon: "mdi-handshake",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: t("vehicle.title"),
    routeName: "VehicleList",
    icon: "mdi-car-estate",
    roles: ["ROLE_ADMIN"],
  },
];

const userRoles = apiToken.getDecodedToken().roles;
function isGrantedRole(roles: string[] | undefined): boolean {
  if (!roles) {
    return true;
  }

  for (const role of roles) {
    for (const userRole of userRoles) {
      if (role == userRole) return true;
    }
  }

  return false;
}
</script>
