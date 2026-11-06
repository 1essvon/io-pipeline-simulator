import { NavLink } from 'react-router-dom';

// Path harus disepakati dengan Anggota 1 (App.tsx).
export const NAV_ITEMS = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/belajar', label: 'Belajar' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/perbandingan', label: 'Perbandingan' },
  { to: '/panduan', label: 'Panduan' },
] as const;

interface Props {
  onNavigate?: () => void;
}

export default function NavigationMenu({ onNavigate }: Props) {
  return (
    <ul className="navmenu">
      {NAV_ITEMS.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={'end' in item ? item.end : false}
            onClick={onNavigate}
            className={({ isActive }) => 'navmenu__link' + (isActive ? ' is-active' : '')}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
