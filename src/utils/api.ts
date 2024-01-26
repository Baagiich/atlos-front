import qs from "qs";
import type { SubmissionErrors } from "../types/error";
import { SubmissionError } from "./error";
import { ENTRYPOINT } from "./config";
import { useRouter } from "vue-router";
import * as apiToken from "@/utils/apiToken";
import { useDeviceShowStore } from "@/store/device/show";
import { useSecurityLoginStore } from "@/store/security/login";

const MIME_TYPE = "application/ld+json";

export interface ApiOptions {
  method?: string;
  headers?: Headers;
  auth?: boolean;
  body?: any;
  params?: { [key: string]: any };
}

export default async function api(
  id: string,
  options: ApiOptions = {},
): Promise<Response> {
  const router = useRouter();
  const deviceShowStore = useDeviceShowStore();
  const securityLoginStore = useSecurityLoginStore();

  deviceShowStore.retrieveFromLocal();

  if (typeof options.headers === "undefined" || !options.headers) {
    options.headers = new Headers();
  }

  if (options.auth !== false) {
    options.auth = true;
  }

  if (options.auth) {
    const { token } = (await apiToken.get()) || { token: null };
    if (token) {
      options.headers.set("Authorization", `Bearer ${token}`);
      securityLoginStore.setUserTokenData(apiToken.getDecodedToken());
    }
  }

  try {
    return await internalApi(id, { ...options });
  } catch (e) {
    if (options.auth) {
      if (e === 401) {
        if (router.currentRoute.value.name !== "Home") {
          apiToken.remove();
          securityLoginStore.setUserTokenData(undefined);
          router.push({ name: "Home" });
        }
      }
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

  if (options.headers.get("Accept-Language") === null) {
    options.headers.set(
      "Accept-Language",
      localStorage.getItem("locale") ?? "mn-MN",
    );
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
