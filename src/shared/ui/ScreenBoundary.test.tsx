import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import messages from "@/shared/i18n/messages/fr.json";
import { sectionNotFound } from "@/shared/testing/fixtures";

import { QueryProvider } from "./QueryProvider";
import { ScreenBoundary } from "./ScreenBoundary";
import { Toaster } from "./Toaster";

const renderWithProviders = (children: ReactNode) =>
  render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <QueryProvider>
        <ScreenBoundary>{children}</ScreenBoundary>
      </QueryProvider>
      <Toaster />
    </NextIntlClientProvider>,
  );

const FailingScreen = () => {
  throw new Error("boom");
};

const FailingAction = () => {
  const remove = useMutation({ mutationFn: () => Promise.reject(sectionNotFound()) });
  return (
    <button type="button" onClick={() => remove.mutate()}>
      Supprimer
    </button>
  );
};

describe("ScreenBoundary", () => {
  it("shows the message of a failed query, and loads it again on retry", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const load = vi.fn<() => Promise<string>>().mockRejectedValueOnce(sectionNotFound()).mockResolvedValue("Courses");
    const Screen = () => <p>{useSuspenseQuery({ queryKey: ["screen"], queryFn: load, retry: false }).data}</p>;
    renderWithProviders(<Screen />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Cette section n'existe plus.");

    await userEvent.click(screen.getByRole("button", { name: "Réessayer" }));

    expect(await screen.findByText("Courses")).toBeInTheDocument();
  });

  it("shows a generic message for any other failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    renderWithProviders(<FailingScreen />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Une erreur est survenue.");
  });
});

describe("mutation errors", () => {
  it("are shown once, as a translated toast", async () => {
    renderWithProviders(<FailingAction />);

    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(await screen.findByText("Cette section n'existe plus.")).toBeInTheDocument();
  });
});
