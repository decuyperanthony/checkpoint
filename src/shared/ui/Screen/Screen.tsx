import type { ReactNode } from "react";

type ScreenProps = {
  title: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
};

export const Screen = ({ title, actions, children }: ScreenProps) => (
  <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
    <header className="flex items-center justify-between gap-4">
      <h1 className="font-heading text-2xl font-semibold">{title}</h1>
      {actions}
    </header>
    {children}
  </main>
);
