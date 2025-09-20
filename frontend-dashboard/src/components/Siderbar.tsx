// src/components/Sidebar.tsx
import { Home, Book, Calculator, Type, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Inicio", icon: <Home size={20} />, path: "/" },
    { name: "Lenguaje de Señas", icon: <Type size={20} />, path: "/vocales" },
    { name: "Operaciones Matemáticas", icon: <Calculator size={20} />, path: "/calculadora" },
    { name: "Abecedario", icon: <Book size={20} />, path: "/abecedario" },
    { name: "Oraciones", icon: <Calculator size={20} />, path: "/oraciones" },
    { name: "Perfil de Usuario", icon: <User size={20} />, path: "/perfil" },
  ];

  const user = {
    name: "Auxilio",
    email: "Sozzy Dozzyrats",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // Puedes reemplazar esta URL con la de tu usuario
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 h-screen p-6 flex flex-col justify-between shadow-xl rounded-2xl m-4">
      <div>
        {/* Logo y nombre de la aplicación */}
        <div className="flex items-center gap-2 mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-indigo-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2A10 10 0 1 0 12 22A10 10 0 1 0 12 2Zm-2 15a1 1 0 0 1-2 0V9a1 1 0 0 1 2 0v8Zm6-4a1 1 0 0 1-2 0V9a1 1 0 0 1 2 0v4Zm-3 6a1 1 0 0 1-2 0V9a1 1 0 0 1 2 0v10Z" />
          </svg>
          <h1 className="text-xl font-bold text-white">SignSpeak AI</h1>
        </div>

        {/* Menú de navegación */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition duration-200
                ${
                  location.pathname === item.path
                    ? "bg-indigo-600 text-white font-semibold shadow-md"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Perfil de usuario en la parte inferior */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-xl mt-8">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-indigo-400"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{user.name}</span>
          <span className="text-xs text-slate-400">{user.email}</span>
        </div>
      </div>
    </aside>
  );
}