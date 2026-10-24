import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

import messages from "@/shared/i18n/messages/fr.json";

import { ThemeProvider } from "@/shared/ui/ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

const renderToggle = () =>
  render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    </NextIntlClientProvider>,
  );

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    // jsdom has no matchMedia; the system theme is light.
    vi.stubGlobal(
      "matchMedia",
      vi.fn<(query: string) => Pick<MediaQueryList, "matches" | "addListener" | "removeListener">>(() => ({
        matches: false,
        addListener: () => undefined,
        removeListener: () => undefined,
      })),
    );
  });

  it("switches between dark and light themes", async () => {
    renderToggle();
    const toggle = screen.getByRole("button", { name: "Basculer entre thème clair et sombre" });

    await userEvent.click(toggle);
    expect(document.documentElement).toHaveClass("dark");

    await userEvent.click(toggle);
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
