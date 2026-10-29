import { Option, Schema } from "effect";
import { useCallback, useMemo, useSyncExternalStore } from "react";

// `storage` only fires in the other tabs: this one tells its own hooks.
const changed = "checkpoint:stored-state";

const subscribe = (notify: () => void) => {
  window.addEventListener("storage", notify);
  window.addEventListener(changed, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(changed, notify);
  };
};

// Storage can be missing or refuse (private mode, quota): the value then lives for the visit only.
const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, raw: string) => {
  try {
    localStorage.setItem(key, raw);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(changed));
};

type StoredStateOptions<S extends Schema.ConstraintCodec<unknown, unknown>> = {
  key: string;
  // What is stored: a value that does not decode (older version, edited by hand) reads as `fallback`.
  schema: S;
  fallback: S["Type"];
};

// A value kept in `localStorage`, per device. The server and the first render see `fallback`, so
// hydration never differs from the markup.
export const useStoredState = <S extends Schema.ConstraintCodec<unknown, unknown>>({
  key,
  schema,
  fallback,
}: StoredStateOptions<S>) => {
  const json = useMemo(() => Schema.fromJsonString(schema), [schema]);
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );

  const value = useMemo(
    () => (raw === null ? fallback : Option.getOrElse(Schema.decodeUnknownOption(json)(raw), () => fallback)),
    [raw, json, fallback],
  );
  const setValue = useCallback((next: S["Type"]) => write(key, Schema.encodeSync(json)(next)), [key, json]);

  return [value, setValue] as const;
};
