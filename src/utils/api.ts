import qs from "qs";
import type { SubmissionErrors } from "../types/error";
import { SubmissionError } from "./error";
import { ENTRYPOINT } from "./config";
import { useSecurityLoginStore } from "@/store/security/login";
import { useRouter } from "vue-router";

const MIME_TYPE = "application/ld+json";

export default async function api(id: string, options: any = {}) {
  const securityLoginStore = useSecurityLoginStore();
  const router = useRouter();
  if (typeof options.headers === "undefined") {
    Object.assign(options, { headers: new Headers() });
  }

  if (options.headers.get("Accept") === null) {
    options.headers.set("Accept", MIME_TYPE);
  }

  if (options.headers.get("deviceId") === null) {
    options.headers.set("deviceId", "uuid-uuid-uuid-0");
  }

  if (typeof options.auth === "undefined") {
    options.auth = true;
  }

  const { token, refreshToken } = securityLoginStore.getToken();

  if (options.auth) {
    if (token) {
      options.headers.set("Authorization", `Bearer ${token}`);
    }
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
      if (options.auth) {
        if (!securityLoginStore.isRefreshTokenAlive()) {
          if (router.currentRoute.value.name !== "Login");
          {
            return router.push({ name: "Login" });
          }
        } else {
          securityLoginStore.refresh();

          return api(id, options);
        }
      }
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
