export default function App() {
  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <aside className="w-64 bg-dark/80 backdrop-blur-md text-white p-6 flex flex-col shadow-lg">
        <h1 className="text-2xl font-bold mb-10 tracking-wide text-primary">
          Dashboard
        </h1>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="hover:text-primary transition-colors">Inicio</a>
          <a href="#" className="hover:text-primary transition-colors">Reportes</a>
          <a href="#" className="hover:text-primary transition-colors">Configuración</a>
        </nav>
        <div className="mt-auto pt-6 border-t border-white/20">
          <p className="text-sm text-gray-300">© 2025 MiApp</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-dark">Panel Principal</h2>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
            Nuevo
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 bg-gradient-to-br from-white to-gray-100">
          <h3 className="text-2xl font-bold text-dark mb-6">Bienvenido</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold text-primary">Card 1</h4>
              <p className="mt-2 text-gray-600">Descripción breve de la card.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold text-primary">Card 2</h4>
              <p className="mt-2 text-gray-600">Más información interesante.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold text-primary">Card 3</h4>
              <p className="mt-2 text-gray-600">Texto de ejemplo para el panel.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
