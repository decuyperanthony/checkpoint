import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

type ScreenProps = {
  title: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
};

export const Screen = ({ title, actions, children }: ScreenProps) => (
  <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 pt-10 pb-24 sm:pt-16">
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"
        >
          <CheckIcon className="size-5" strokeWidth={3} />
        </span>
        <h1 className="font-heading text-4xl tracking-tight">{title}</h1>
      </div>
      {actions}
    </header>
    {children}
  </main>
);
