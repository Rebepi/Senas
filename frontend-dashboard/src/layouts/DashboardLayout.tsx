import type { ReactNode } from "react";
import { Sidebar } from "../components/Siderbar";
import { Navbar } from "../components/Navbar";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex bg-slate-900 text-white h-screen">
      {/* Sidebar fija */}
      <div className="w-64 fixed h-screen">
        <Sidebar />
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 flex flex-col ml-64 overflow-y-auto">
        <Navbar />
        <main className="flex-1 p-8 mt-6">{children}</main>
      </div>
    </div>
  );
}
