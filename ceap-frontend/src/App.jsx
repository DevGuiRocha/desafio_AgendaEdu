import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Deputados from './pages/Deputados';
import Despesas from './pages/Despesas';
import UploadCsv from "./pages/UploadCsv";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deputados" element={<Deputados />} />
          <Route path="/deputados/:id/despesas" element={<Despesas />} />
          <Route path="/uploadcsv" element={<UploadCsv />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
