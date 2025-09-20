import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import VocalesPage from "./pages/VocalesPage";
import CalculadoraPage from "./pages/CalculadoraPage";
import AbecedarioPage from "./pages/AbecedarioPage";
import OracionesPage from "./pages/OracionesPage";
import PerfilPage from "./pages/PerfilPage";

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vocales" element={<VocalesPage />} />
          <Route path="/abecedario" element={<AbecedarioPage />} />
          <Route path="/oraciones" element={<OracionesPage />} />
          <Route path="/calculadora" element={<CalculadoraPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
