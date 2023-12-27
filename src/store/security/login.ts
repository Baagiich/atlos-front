import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import type { Auth } from "@/types/auth";
import type { SubmissionErrors } from "@/types/error";
import * as apiToken from "@/utils/apiToken";
import { useDeviceShowStore } from "@/store/device/show";
import { useDeviceCreateStore } from "@/store/device/create";
import UAParser from "ua-parser-js";
import { v4 as uuidv4 } from "uuid";
import { JwtPayload } from "jwt-decode";

interface State {
  userTokenData?: JwtPayload;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useSecurityLoginStore = defineStore("securityLogin", {
  state: (): State => ({
    userTokenData: apiToken.getDecodedToken(),
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async login(payload: Auth) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      const deviceShow = useDeviceShowStore();
      const deviceCreate = useDeviceCreateStore();
      try {
        deviceShow.retrieveFromLocal();
        if (!deviceShow.retrieved) {
          const parser = new UAParser();
          await deviceCreate.create({
            name: parser.getBrowser().name,
            deviceId: uuidv4(),
            model: parser.getBrowser().name,
            version: parser.getBrowser().version,
            os: parser.getOS().name,
          });

          if (deviceCreate.error) {
            this.setError(deviceCreate.error);
            this.setViolations(deviceCreate.violations);
            return;
          }

          deviceShow.retrieveFromLocal();
        }
        payload.deviceId = deviceShow.retrieved?.deviceId;
        await apiToken.setToken(payload);

        this.toggleLoading();
      } catch (error) {
        this.toggleLoading();

        if (error instanceof SubmissionError) {
          this.setViolations(error.errors);
          this.setError(error.errors._error);
          return;
        }

        if (error instanceof Error) {
          if (error.message === "Бүртгэлгүй төхөөрөмж байна") {
            deviceShow.setRetrieved(undefined);
          }
          this.setError(error.message);
        }
      }
    },
    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setUserTokenData(data?: JwtPayload) {
      this.userTokenData = data;
    },

    setError(error: string | undefined) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors | undefined) {
      this.violations = violations;
    },
  },
});
