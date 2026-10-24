import { getTranslations } from "next-intl/server";

import { Screen } from "@/shared/ui/Screen";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

import { ClientBoard } from "./ClientBoard";

const HomePage = async () => {
  const t = await getTranslations("app");

  return (
    <Screen title={t("title")} actions={<ThemeToggle />}>
      <ClientBoard />
    </Screen>
  );
};

export default HomePage;
