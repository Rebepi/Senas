import { Search, Bell } from "lucide-react";

export function Navbar() {
  const user = {
    name: "Auxilio",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  };

  return (
    <header className="flex items-center justify-between p-6 bg-transparent border-b-[1px] border-white/10">
      {/* Título de bienvenida */}
      <h1 className="text-3xl font-bold text-white">¡BIENVENIDO a SignSpeak AI!</h1>

      {/* Buscador y perfil */}
      <div className="flex items-center gap-6">
        {/* Buscador */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full w-80 shadow-md">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full text-sm placeholder-slate-500 text-white"
          />
        </div>

        {/* Notificaciones y perfil */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-slate-800 transition duration-200">
            <Bell size={20} className="text-slate-400" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-indigo-400 cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}