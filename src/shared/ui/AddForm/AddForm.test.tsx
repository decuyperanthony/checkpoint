import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { requiredText } from "@/shared/testing/fixtures";
import { renderWithIntl } from "@/shared/testing/renderWithIntl";

import { AddForm } from "./AddForm";

type OnAdd = (value: string, options: { readonly onSuccess: () => void }) => void;

const renderForm = (onAdd: OnAdd) =>
  renderWithIntl(<AddForm label="New item" field={requiredText} pending={false} onAdd={onAdd} />);

describe("AddForm", () => {
  it("adds the trimmed value, then empties the field and keeps the focus there", async () => {
    const onAdd = vi.fn<OnAdd>((_value, { onSuccess }) => onSuccess());
    renderForm(onAdd);
    const field = screen.getByRole("textbox", { name: "New item" });

    await userEvent.type(field, "  Milk {Enter}");

    expect(onAdd).toHaveBeenCalledWith("Milk", expect.anything());
    expect(field).toHaveValue("");
    expect(field).toHaveFocus();
  });

  it("keeps the typed value when adding fails", async () => {
    renderForm(vi.fn<OnAdd>());
    const field = screen.getByRole("textbox", { name: "New item" });

    await userEvent.type(field, "Milk{Enter}");

    expect(field).toHaveValue("Milk");
  });

  it("refuses a blank value without adding it", async () => {
    const onAdd = vi.fn<OnAdd>();
    renderForm(onAdd);

    await userEvent.type(screen.getByRole("textbox", { name: "New item" }), "   {Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent("Required");
    expect(onAdd).not.toHaveBeenCalled();
  });
});
