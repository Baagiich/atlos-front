<template>
  <v-navigation-drawer
    v-if="userTokenData"
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <v-list-item class="text-center mb-2" nav>
      <v-img style="max-height: 30px" :src="logoAtlos" />
    </v-list-item>
    <v-list-item
      prepend-icon="mdi-account-circle"
      :class="bgClass"
      :subtitle="userTokenData?.username"
      title="DASHBOARD"
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
        :title="$t(menuItem.title)"
        :value="menuItem.routeName"
        @click="router.push({ name: menuItem.routeName })"
      ></v-list-item>
    </v-list>
    <template #append>
      <v-list-item class="text-center" prepend-icon="mdi-power" nav>
        <div class="pa-2">
          <v-btn block @click="logout"> {{ t("logout") }} </v-btn>
        </div>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import * as apiToken from "@/utils/apiToken";
import { useI18n } from "vue-i18n";
import { useSecurityLoginStore } from "@/store/security/login";
import { storeToRefs } from "pinia";
import logoAtlos from "@/assets/logo-atlos.png";

const router = useRouter();
const { t } = useI18n();

const securityLoginStore = useSecurityLoginStore();
const { userTokenData } = storeToRefs(securityLoginStore);

const drawer = ref(true);
const rail = ref(true);
const menuItems = [
  {
    title: "shipment.addShipment",
    routeName: "ShipmentLoadDashboard",
    icon: "mdi mdi-plus-box",
    roles: ["ROLE_CONSIGNOR"],
  },
  {
    title: "order.title",
    routeName: "OrderList",
    icon: "mdi-account-credit-card",
    roles: ["ROLE_CONSIGNOR", "ROLE_SHIPPER"],
  },
  {
    title: "wallet.title",
    routeName: "WalletList",
    icon: "mdi-wallet",
    roles: ["ROLE_CONSIGNOR", "ROLE_SHIPPER"],
  },

  {
    title: "bank.title",
    routeName: "BankList",
    icon: "mdi-bank",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: "currency.title",
    routeName: "CurrencyList",
    icon: "mdi-currency-usd",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: "city.title",
    routeName: "CityList",
    icon: "mdi-home-city",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: "contract.title",
    routeName: "ContractList",
    icon: "mdi-note-text",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: "contracttemplate.title",
    routeName: "ContractTemplateList",
    icon: "mdi-note-search",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: "country.title",
    routeName: "CountryList",
    icon: "mdi-earth",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: "driver.title",
    routeName: "DriverList",
    icon: "mdi-card-account-details",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: "shipment.title",
    routeName: "ShipmentList",
    icon: "mdi-truck-delivery",
    roles: ["ROLE_ADMIN", "ROLE_CONSIGNOR", "ROLE_SHIPPER"],
  },
  // {
  //   title: "shipment.activeShipment",
  //   routeName: "ShipmentOwnList",
  //   icon: "mdi-truck-delivery",
  //   roles: ["ROLE_ADMIN", "ROLE_CONSIGNOR", "ROLE_SHIPPER"],
  // },
  {
    title: "shppercompany.title",
    routeName: "ShipperCompanyList",
    icon: "mdi-handshake",
    roles: ["ROLE_ADMIN"],
  },
  {
    title: "vehicle.title",
    routeName: "VehicleList",
    icon: "mdi-car-estate",
    roles: ["ROLE_ADMIN"],
  },
];

const bgClass = computed(() => {
  return userTokenData?.value?.user_type == 3
    ? "bg-red"
    : "bg-blue-grey-darken-1";
});

function isGrantedRole(roles: string[] | undefined): boolean {
  const userRoles = userTokenData?.value ? userTokenData?.value?.roles : [];
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

function logout() {
  apiToken.remove();
  securityLoginStore.setUserTokenData(undefined);
  router.push({ name: "Home" });
}
</script>
