import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';

type Theme = 'light' | 'dark';
const THEME_KEY = 'iops.theme';

function readTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* penyimpanan tidak tersedia, abaikan */
    }
  }, [theme]);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__dot" aria-hidden="true" />
          I/O Pipeline Simulator
        </Link>
        <span className="navbar__spacer" />
        <button
          type="button"
          className="btn navbar__toggle"
          aria-expanded={open}
          aria-controls="menu-utama"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
        <nav id="menu-utama" className={'navbar__nav' + (open ? ' is-open' : '')} aria-label="Navigasi utama">
          <NavigationMenu onNavigate={() => setOpen(false)} />
        </nav>
        <button
          type="button"
          className="btn"
          aria-pressed={theme === 'dark'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
        </button>
      </div>
    </header>
  );
}
