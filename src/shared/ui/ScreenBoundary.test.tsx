import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import messages from "@/shared/i18n/messages/fr.json";
import { sectionNotFound } from "@/shared/lib/fixtures";

import { ScreenBoundary } from "./ScreenBoundary";

const renderBoundary = (child: () => string) => {
  const Child = () => <p>{child()}</p>;
  render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <ScreenBoundary>
        <Child />
      </ScreenBoundary>
    </NextIntlClientProvider>,
  );
};

describe("ScreenBoundary", () => {
  it("shows the message of a contract error, and renders the screen again on retry", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    // React renders a failing tree twice before giving up, so the failure lasts until retry.
    let sectionExists = false;
    renderBoundary(() => {
      if (!sectionExists) throw sectionNotFound();
      return "Courses";
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Cette section n'existe plus.");

    sectionExists = true;
    await userEvent.click(screen.getByRole("button", { name: "Réessayer" }));

    expect(screen.getByText("Courses")).toBeInTheDocument();
  });

  it("shows a generic message for any other failure", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    renderBoundary(() => {
      throw new Error("boom");
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Une erreur est survenue.");
  });
});
