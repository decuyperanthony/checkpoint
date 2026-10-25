import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

type ScreenProps = {
  title: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
};

export const Screen = ({ title, actions, children }: ScreenProps) => (
  <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 pt-8 pb-24 sm:px-8 sm:pt-12">
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* The mark: a line roundel holding a check, in line 12's green. */}
        <span aria-hidden className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
          <CheckIcon className="size-5" strokeWidth={3} />
        </span>
        <h1 className="font-heading text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      {actions}
    </header>
    {children}
  </main>
);
