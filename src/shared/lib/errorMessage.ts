import type { Messages } from "@/shared/i18n/config";
import type { ApiError } from "@/shared/lib/api";

// One message per error the API can produce: a new contract error fails to compile until it has one.
const messageKeys = {
  SectionNotFound: "sectionNotFound",
  ItemNotFound: "itemNotFound",
  UnexpectedApiError: "unexpected",
} as const satisfies { [K in ApiError["_tag"]]: keyof Messages["errors"] };

export const errorMessageKey = (error: ApiError) => messageKeys[error._tag];
