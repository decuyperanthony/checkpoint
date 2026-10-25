import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PanelProps = {
  icon: LucideIcon;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
};

// A screen with a single thing to do (enter the PIN): centred, narrow, a title that says it.
export const Panel = ({ icon: Icon, title, description, children }: PanelProps) => (
  <section className="mx-auto flex w-full max-w-sm flex-col items-center gap-8 pt-4 text-center sm:pt-12">
    <span aria-hidden className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
      <Icon className="size-6" />
    </span>
    <div className="flex flex-col gap-2">
      <h2 className="font-heading text-4xl tracking-tight">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <div className="w-full">{children}</div>
  </section>
);
