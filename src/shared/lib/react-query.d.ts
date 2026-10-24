import type { ApiError } from "@/shared/lib/api";

// Every query and mutation rejects with an `ApiError` (see `callApi`).
// Module augmentation only works with an interface: the `type`-only lint rule is disabled for this file.
declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}
