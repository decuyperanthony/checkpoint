import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Schema } from "effect";
import { describe, expect, it, vi } from "vitest";

import { renderWithIntl } from "@/shared/testing/renderWithIntl";

import { createForm } from "./createForm";

const ProfileSchema = Schema.Struct({
  name: Schema.Trim.check(Schema.isNonEmpty(), Schema.isMaxLength(10)),
  // A check without a message of its own.
  nickname: Schema.String.check(Schema.isPattern(/^[a-z]*$/)),
});
type Profile = typeof ProfileSchema.Type;

const ProfileForm = createForm(ProfileSchema);

type EmptySubmit = "validate" | "ignore";

const Profile = ({
  name,
  onSubmit,
  emptySubmit,
}: {
  name: string;
  onSubmit: (values: Profile) => void;
  emptySubmit: EmptySubmit;
}) => {
  const form = ProfileForm.useForm({ defaultValues: { name, nickname: "" } });

  return (
    <ProfileForm form={form} onSubmit={onSubmit} emptySubmit={emptySubmit}>
      <ProfileForm.TextField name="name" label="Name" />
      <ProfileForm.TextField name="nickname" label="Nickname" />
      <button type="submit">Save</button>
    </ProfileForm>
  );
};

const renderProfile = (name = "", emptySubmit: EmptySubmit = "validate") => {
  const onSubmit = vi.fn<(values: Profile) => void>();
  renderWithIntl(<Profile name={name} onSubmit={onSubmit} emptySubmit={emptySubmit} />);
  return onSubmit;
};

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));

describe("createForm", () => {
  it("submits the values decoded by the schema", async () => {
    const onSubmit = renderProfile();

    await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "  Ada  ");
    await save();

    expect(onSubmit).toHaveBeenCalledWith({ name: "Ada", nickname: "" });
  });

  it("reads required and the length limit from the schema", () => {
    renderProfile();

    expect(screen.getByRole("textbox", { name: "Name" })).toBeRequired();
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("maxLength", "10");
    expect(screen.getByRole("textbox", { name: "Nickname" })).not.toBeRequired();
    expect(screen.getByRole("textbox", { name: "Nickname" })).not.toHaveAttribute("maxLength");
  });

  it("refuses an empty required field, says why and moves the focus to it", async () => {
    const onSubmit = renderProfile();

    await save();

    const name = screen.getByRole("textbox", { name: "Name" });
    expect(name).toHaveFocus();
    expect(name).toHaveAccessibleDescription("Ce champ est obligatoire.");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("lets an empty submit pass in silence when the form ignores it", async () => {
    const onSubmit = renderProfile("", "ignore");

    await save();

    const name = screen.getByRole("textbox", { name: "Name" });
    expect(name).toHaveFocus();
    expect(name).not.toHaveAccessibleDescription();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("names the limit of a value that is too long", async () => {
    const onSubmit = renderProfile("Ada Lovelace");

    await save();

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAccessibleDescription(
      "Ce champ ne peut pas dépasser 10 caractères.",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("words a check without a message of its own as an invalid value", async () => {
    const onSubmit = renderProfile("Ada");

    await userEvent.type(screen.getByRole("textbox", { name: "Nickname" }), "ADA");
    await save();

    expect(screen.getByRole("textbox", { name: "Nickname" })).toHaveAccessibleDescription(
      "Cette valeur n'est pas valide.",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
