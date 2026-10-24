import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { requiredText } from "@/shared/testing/fixtures";
import { renderWithIntl } from "@/shared/testing/renderWithIntl";

import { EditForm } from "./EditForm";

const renderForm = () => {
  const onSave = vi.fn<(value: string) => void>();
  const onCancel = vi.fn<() => void>();
  renderWithIntl(
    <EditForm
      label="Item text"
      field={requiredText}
      value="Milk"
      pending={false}
      onSave={onSave}
      onCancel={onCancel}
    />,
  );
  return { onSave, onCancel, field: screen.getByRole("textbox", { name: "Item text" }) };
};

describe("EditForm", () => {
  it("opens focused on the current value and saves the new one", async () => {
    const { onSave, field } = renderForm();
    expect(field).toHaveFocus();
    expect(field).toHaveValue("Milk");

    await userEvent.clear(field);
    await userEvent.type(field, "Oat milk{Enter}");

    expect(onSave).toHaveBeenCalledWith("Oat milk");
  });

  it("cancels with Escape", async () => {
    const { onSave, onCancel } = renderForm();

    await userEvent.keyboard(" and bread{Escape}");

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("treats saving an unchanged value as cancelling", async () => {
    const { onSave, onCancel } = renderForm();

    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onSave).not.toHaveBeenCalled();
  });
});
