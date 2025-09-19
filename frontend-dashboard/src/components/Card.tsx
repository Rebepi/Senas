import type { ReactNode } from "react";
type Props = {
  title: string;
  children: ReactNode;
};

export function Card({ title, children }: Props) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
      {children}
    </div>
  );
}