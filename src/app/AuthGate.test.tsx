import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LogoutButton } from "@/features/auth/ui/LogoutButton";
import { makeFakeApi } from "@/server/testing/fakeApi";
import { testPin } from "@/server/testing/fixtures";
import { renderScreen } from "@/shared/testing/renderScreen";

import AuthGate from "./AuthGate";

const fakeApi = makeFakeApi({ loggedIn: false });
vi.stubGlobal("fetch", vi.fn<typeof fetch>(fakeApi.fetch));

beforeEach(() => fakeApi.reset());

// As on the page: the logout button sits in the header, outside the gate.
const renderApp = () =>
  renderScreen(
    <>
      <LogoutButton />
      <AuthGate />
    </>,
  );

const pinField = () => screen.findByLabelText("Code PIN");

const unlock = async (pin: string) => {
  await userEvent.type(await pinField(), `${pin}{Enter}`);
};

describe("AuthGate", () => {
  it("asks for the PIN first, focused, with what it must look like", async () => {
    renderApp();

    const field = await pinField();
    expect(field).toHaveFocus();
    expect(field).toHaveAccessibleDescription("4 à 12 chiffres");
    expect(screen.queryByRole("textbox", { name: "Nouvelle ligne" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Se déconnecter" })).not.toBeInTheDocument();
  });

  it("says a wrong PIN under the field, empties it and keeps the focus there", async () => {
    renderApp();

    await unlock("0000");

    const field = await pinField();
    expect(await screen.findByRole("alert")).toHaveTextContent("Code PIN incorrect.");
    expect(field).toHaveValue("");
    expect(field).toHaveFocus();
    // Under the field only, never in a toast as well.
    await expect(screen.findAllByText("Code PIN incorrect.", {}, { timeout: 300 })).resolves.toHaveLength(1);
  });

  it("refuses a PIN that is not 4 to 12 digits without calling the API", async () => {
    renderApp();

    await unlock("12");

    expect(await screen.findByRole("alert")).toHaveTextContent("Cette valeur n'est pas valide.");
  });

  it("says how long to wait after too many wrong PINs", async () => {
    renderApp();

    for (const _ of Array.from({ length: 5 })) {
      await unlock("0000");
      await screen.findByRole("alert");
    }
    await unlock(testPin);

    expect(await screen.findByRole("alert")).toHaveTextContent("Trop de tentatives. Réessaie dans 15 minutes.");
  });

  it("opens the board with the right PIN, then logs out back to the PIN", async () => {
    renderApp();

    await unlock(testPin);
    expect(await screen.findByRole("textbox", { name: "Nouvelle ligne" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Se déconnecter" }));

    expect(await pinField()).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Nouvelle ligne" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Se déconnecter" })).not.toBeInTheDocument();
  });

  it("goes back to the PIN when the session expires while in use", async () => {
    renderApp();
    await unlock(testPin);
    await userEvent.type(await screen.findByRole("textbox", { name: "Nouvelle ligne" }), "Courses{Enter}");
    await screen.findByRole("heading", { name: "Courses" });

    fakeApi.expireSession();
    await userEvent.type(screen.getByRole("textbox", { name: "Nouvelle station sur la ligne Courses" }), "Lait{Enter}");

    expect(await pinField()).toBeInTheDocument();
    expect(screen.queryByText("Ta session a expiré. Saisis à nouveau ton code PIN.")).not.toBeInTheDocument();
  });
});
