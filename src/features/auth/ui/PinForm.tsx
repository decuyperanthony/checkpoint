"use client";

import { useTranslations } from "next-intl";

import { LoginPayload } from "@/contract/schemas/Auth";
import { useLogin } from "@/features/auth/api/auth";
import { createForm } from "@/shared/form";
import type { ApiError } from "@/shared/lib/api";
import { errorMessageKey } from "@/shared/lib/errorMessage";
import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";

const LoginForm = createForm(LoginPayload);

// Said under the field rather than in a toast: the field is where the user tries again.
const useLoginErrorMessage = () => {
  const t = useTranslations();
  return (error: ApiError) =>
    error._tag === "TooManyAttempts"
      ? t("auth.tooManyAttempts", { minutes: Math.ceil(error.retryAfterSeconds / 60) })
      : t(`errors.${errorMessageKey(error)}`);
};

export const PinForm = () => {
  const t = useTranslations("auth");
  const login = useLogin();
  const loginErrorMessage = useLoginErrorMessage();
  const form = LoginForm.useForm({ defaultValues: { pin: "" } });

  const unlock = (values: LoginPayload) =>
    login.mutate(values, {
      onError: (error) => {
        // A wrong PIN is typed again from scratch.
        form.reset();
        form.setError("pin", { message: loginErrorMessage(error) }, { shouldFocus: true });
      },
    });

  return (
    <LoginForm form={form} onSubmit={unlock}>
      <Stack gap="md">
        <LoginForm.TextField
          name="pin"
          label={t("pin")}
          hint={t("pinHint")}
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          focusOnMount
        />
        <Button type="submit" disabled={login.isPending}>
          {t("unlock")}
        </Button>
      </Stack>
    </LoginForm>
  );
};
