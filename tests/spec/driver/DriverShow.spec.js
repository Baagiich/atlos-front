import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import DriverShow from "@/components/driver/DriverShow.vue";
import i18n from "@/plugins/i18n";
import router from "@/router";
import { createTestingPinia } from "@pinia/testing";
import { useDriverShowStore } from "@/store/driver/show";
import * as breadcrumb from "@/composables/breadcrumb";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

describe("DriverShow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("admin user edit link", async () => {
    vi.spyOn(breadcrumb, "useBreadcrumb").mockImplementation(() => []);

    const wrapper = mount(
      {
        template: "<Suspense><DriverShow></DriverShow></Suspense>",
      },
      {
        props: {},
        global: {
          components: {
            DriverShow,
          },
          plugins: [vuetify, createTestingPinia(), i18n, router],
        },
      },
    );

    const driverShowStore = useDriverShowStore();
    driverShowStore.retrieved = {
      "@id": "api/drivers/1",
      adminUser: "api/admin_users/2",
      firstName: "Tsetsee",
      lastName: "Munkh",
      phoneNumber: "94094096",
      email: "tsetsee.yugi@gmail.com",
      registerNumber: "УУ67676767",
    };

    await flushPromises();

    const adminUserEditLink = wrapper.find("#adminuser-edit-link");
    expect(adminUserEditLink.exists()).toBeTruthy();
    expect(adminUserEditLink.element.getAttribute("href")).toBe(
      "/admin_users/edit/api%2Fadmin_users%2F2",
    );

    expect(
      wrapper.findComponent({ name: "SimpleDriverImageList" }).exists(),
    ).toBeTruthy();
  });
});
