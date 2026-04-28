import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Tracker from './pages/Tracker';
import Database from './pages/Database';
import About from './pages/About';

function NavBar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      background: 'var(--color-card)',
      padding: '1rem 2rem',
      display: 'flex',
      gap: '2rem',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <Link
        to="/"
        style={{
          color: isActive('/') ? 'var(--color-primary)' : 'var(--color-text)',
          fontWeight: isActive('/') ? 'bold' : 'normal',
          textDecoration: 'none',
          fontSize: '1.1rem',
        }}
      >
        调律追踪
      </Link>
      <Link
        to="/database"
        style={{
          color: isActive('/database') ? 'var(--color-primary)' : 'var(--color-text)',
          fontWeight: isActive('/database') ? 'bold' : 'normal',
          textDecoration: 'none',
          fontSize: '1.1rem',
        }}
      >
        词条数据库
      </Link>
      <Link
        to="/about"
        style={{
          color: isActive('/about') ? 'var(--color-primary)' : 'var(--color-text)',
          fontWeight: isActive('/about') ? 'bold' : 'normal',
          textDecoration: 'none',
          fontSize: '1.1rem',
        }}
      >
        使用说明
      </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar />
        <main style={{ flex: 1, padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Tracker />} />
            <Route path="/database" element={<Database />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer style={{
          textAlign: 'center',
          padding: '1rem',
          color: 'var(--color-text-muted)',
          fontSize: '0.9rem',
          borderTop: '1px solid var(--color-border)',
        }}>
          燕云调律 — 垫子调律法工具
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
