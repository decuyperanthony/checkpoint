import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Schema } from "effect";
import { useTranslations } from "next-intl";

// French is the reference catalog: every language has the same keys.
import fr from "@/shared/i18n/messages/fr.json";

import type { FormFields } from "./fieldFacts";

type ErrorKey = keyof (typeof fr)["form"]["errors"];
type ErrorValues = { [name: string]: number | string };

const checkPrefix = "effect/schema/";

const isErrorKey = (key: string): key is ErrorKey => key in fr.form.errors;

const isErrorValues = (payload: unknown): payload is ErrorValues =>
  typeof payload === "object" &&
  payload !== null &&
  Object.values(payload).every((value) => typeof value === "number" || typeof value === "string");

// Validates a form with its schema and words each error after the check that failed:
// `Schema.isMaxLength(10)` fails as "effect/schema/isMaxLength" with `{ maxLength: 10 }`, which
// becomes the message `form.errors.isMaxLength`. One message per kind of check, none per field;
// a check without a message reads as `form.errors.invalid`.
export const useSchemaResolver = <F extends FormFields>(schema: Schema.Struct<F>) => {
  const t = useTranslations("form.errors");

  return standardSchemaResolver<Schema.Struct<F>["Encoded"], unknown, Schema.Struct<F>["Type"]>(
    Schema.toStandardSchemaV1(schema, {
      leafHook: () => t("invalid"),
      checkHook: ({ filter }) => {
        const { id = "", payload } = filter.annotations?.representation ?? {};
        const key = id.replace(checkPrefix, "");
        if (!isErrorKey(key)) return t("invalid");
        return isErrorValues(payload) ? t(key, payload) : t(key);
      },
    }),
  );
};
