import type { ReactNode } from "react";
import { Sidebar } from "../components/Siderbar";
import { Navbar } from "../components/Navbar";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex bg-slate-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-8">
        <Navbar />
        <main className="flex-1 mt-6">{children}</main>
      </div>
    </div>
  );
}