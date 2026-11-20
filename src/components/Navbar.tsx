import { useEffect, useState } from 'react';
import { Menu, ShieldPlus, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/features', name: 'Features' },
  { path: '/guide', name: 'Safety Guide' },
  { path: '/hardware', name: 'Hardware' },
  { path: '/about', name: 'About' },
  { path: '/docs', name: 'Docs' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const onHome = pathname === '/' || pathname === '/how-it-works';

  useEffect(() => {
    setMenuOpen(false);
    const sectionId = hash.slice(1) || (pathname === '/how-it-works' ? 'how-it-works' : '');
    if (!sectionId) {
      window.scrollTo(0, 0);
      return;
    }
    const frame = requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <header className="landing-header">
      <a className="landing-skip" href="#main-content">Skip to content</a>
      <nav className="landing-wrap landing-nav" aria-label="Main navigation">
        <Link className="landing-brand" to="/" aria-label="RAMISA home">
          <span className="landing-brand-icon"><ShieldPlus size={22} aria-hidden="true" /></span>
          RAMISA
        </Link>
        <button
          className="landing-menu-button"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="landing-nav-links"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <div className="landing-nav-links" id="landing-nav-links" data-open={menuOpen}>
          {navItems.map(({ path, name }) => <NavLink key={path} to={path}>{name}</NavLink>)}
          {onHome ? (
            <a className="landing-button landing-button-primary" href="#app-preview" onClick={() => setMenuOpen(false)}>See the app</a>
          ) : (
            <Link className="landing-button landing-button-primary" to="/#app-preview">See the app</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
