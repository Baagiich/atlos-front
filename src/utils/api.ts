import qs from "qs";
import type { SubmissionErrors } from "../types/error";
import { SubmissionError } from "./error";
import { ENTRYPOINT } from "./config";
import { useRouter } from "vue-router";
import * as apiToken from "@/utils/apiToken";
import { useDeviceShowStore } from "@/store/device/show";
import { useDeviceCreateStore } from "@/store/device/create";
import { useSecurityLoginStore } from "@/store/security/login";
import { storeToRefs } from "pinia";

const MIME_TYPE = "application/ld+json";

export default async function api(
  id: string,
  options: any = {},
): Promise<Response> {
  const router = useRouter();
  const deviceShowStore = useDeviceShowStore();
  const deviceCreateStore = useDeviceCreateStore();

  deviceShowStore.retrieveFromLocal();
  const { retrieved } = storeToRefs(deviceShowStore);

  if (typeof options.headers === "undefined") {
    Object.assign(options, { headers: new Headers() });
  }

  if (options.auth !== false) {
    options.auth = true;
  }

  if (options.auth) {
    const { token } = apiToken.get() || { token: null };
    if (token) {
      options.headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let isRefreshed = false;

  for (let i = 0; i < 2; i++) {
    try {
      return await internalApi(id, { ...options });
    } catch (e) {
      if (options.auth) {
        if (e === 401) {
          const tokenData = apiToken.get();

          if (
            !isRefreshed &&
            tokenData &&
            apiToken.isRefreshTokenAlive(tokenData) &&
            retrieved &&
            retrieved.value
          ) {
            try {
              await apiToken.refreshToken(retrieved.value.deviceId);
              deviceCreateStore.setCreated(retrieved.value);
              isRefreshed = true;
              continue;
            } catch (e) {
              console.error(e);
            }
          }

          if (router.currentRoute.value.name !== "Login") {
            apiToken.remove();
            const securityLoginStore = useSecurityLoginStore();
            securityLoginStore.setUserTokenData(undefined);
            router.push({ name: "Login" });
          }
        }
      }

      throw e;
    }
  }

  throw "failed api";
}

async function internalApi(id: string, options: any = {}) {
  if (options.headers.get("Accept") === null) {
    options.headers.set("Accept", MIME_TYPE);
  }

  if (options.headers.get("deviceId") === null) {
    options.headers.set("deviceId", "uuid-uuid-uuid-0");
  }

  if (
    options.body !== undefined &&
    !(options.body instanceof FormData) &&
    options.headers.get("Content-Type") === null
  ) {
    options.headers.set("Content-Type", MIME_TYPE);
  }

  if (options.params) {
    const queryString = qs.stringify(options.params);
    id = `${id}?${queryString}`;
  }

  // enable CORS for all requests
  Object.assign(options, {
    mode: "cors",
    // credentials: 'include', // when credentials needed
  });

  const response = await fetch(new URL(id, ENTRYPOINT), options);

  if (!response.ok) {
    if (response.status === 401) {
      throw 401;
    }

    const data = await response.json();
    const error =
      data["hydra:description"] || data.message || response.statusText;
    if (!data.violations) throw Error(error);

    const errors: SubmissionErrors = { _error: error };
    data.violations.forEach(
      (violation: { propertyPath: string; message: string }) => {
        errors[violation.propertyPath] = violation.message;
      },
    );

    throw new SubmissionError(errors);
  }

  return response;
}
