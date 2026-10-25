import { getTranslations } from "next-intl/server";

import { LogoutButton } from "@/features/auth/ui/LogoutButton";
import { Screen } from "@/shared/ui/Screen";
import { Stack } from "@/shared/ui/Stack";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

import { ClientBoard } from "./ClientBoard";

const HomePage = async () => {
  const t = await getTranslations("app");

  return (
    <Screen
      title={t("title")}
      actions={
        <Stack direction="row" gap="sm">
          <LogoutButton />
          <ThemeToggle />
        </Stack>
      }
    >
      <ClientBoard />
    </Screen>
  );
};

export default HomePage;
