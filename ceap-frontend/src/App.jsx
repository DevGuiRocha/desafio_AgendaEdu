import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Deputados from './pages/Deputados';
import Despesas from './pages/Despesas';
import UploadCsv from "./pages/UploadCsv";
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className={styles.root}>
        <main style={{ width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deputados" element={<Deputados />} />
            <Route path="/deputados/:id/despesas" element={<Despesas />} />
            <Route path="/uploadcsv" element={<UploadCsv />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
