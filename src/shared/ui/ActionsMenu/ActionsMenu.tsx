"use client";

import { EllipsisIcon, type LucideIcon } from "lucide-react";
import type { ReactNode, Ref } from "react";

import { IconButton } from "@/shared/ui/IconButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/primitives/dropdown-menu";

type ActionsMenuProps = {
  // Names the menu after what it acts on: "Actions de la section Courses".
  label: string;
  // The `⋯` button, for an action that gives focus back to it once done.
  triggerRef?: Ref<HTMLButtonElement>;
  children: ReactNode;
};

// The `⋯` menu of a thing: its actions, the destructive ones last, after a separator.
//
//   <ActionsMenu label={t("menu", { title })} triggerRef={triggerRef}>
//     <ActionsMenu.Item icon={PencilIcon} onSelect={open}>{t("rename")}</ActionsMenu.Item>
//     <ActionsMenu.Separator />
//     <ActionsMenu.Item icon={Trash2Icon} tone="destructive" onSelect={…}>{t("remove")}</ActionsMenu.Item>
//   </ActionsMenu>
const Menu = ({ label, triggerRef, children }: ActionsMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <IconButton ref={triggerRef} icon={EllipsisIcon} label={label} />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">{children}</DropdownMenuContent>
  </DropdownMenu>
);

type ItemProps = {
  icon: LucideIcon;
  tone?: "default" | "destructive";
  onSelect: () => void;
  children: ReactNode;
};

const Item = ({ icon: Icon, tone = "default", onSelect, children }: ItemProps) => (
  <DropdownMenuItem variant={tone} onSelect={onSelect}>
    <Icon aria-hidden />
    {children}
  </DropdownMenuItem>
);

export const ActionsMenu = Object.assign(Menu, { Item, Separator: DropdownMenuSeparator });
