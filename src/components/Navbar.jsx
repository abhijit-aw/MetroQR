import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import useTheme from '../hooks/useTheme';
import { initials } from '../utils/initials';
import './navbar.css';
 
// [path, translation key, English fallback used if the key has no translation yet]
const LINKS = [
  ['/', 'nav.home', 'Home'], ['/book', 'nav.book', 'Book Ticket'], ['/stations', 'nav.stations', 'Stations'],
  ['/map', 'nav.map', 'Metro Map'], ['/timetable', 'nav.timetable', 'Time Table'], ['/card', 'nav.card', 'Metro Card'],
  ['/tickets', 'nav.tickets', 'My Tickets'], ['/services', 'nav.services', 'Services'], ['/about', 'nav.about', 'About'],
  ['/info/complaint', 'nav.help', 'Help'],
];
 
const icon = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
const Pin = () => <svg {...icon}><path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z" /><circle cx="12" cy="11" r="2" /></svg>;
const Moon = () => <svg {...icon}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;
const Sun = () => <svg {...icon}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
const Globe = () => <svg {...icon}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>;
 
function Logo() {
  return (
    <svg className="mq-logo-svg" viewBox="0 0 100 100" role="img" aria-label="Metro QR logo">
      <circle cx="50" cy="50" r="47" fill="#fff" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#0e8fa5" strokeWidth="6" />
      <path d="M50 8A42 42 0 0 1 92 50" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
      <path d="M33 68V40a17 17 0 0 1 34 0v28z" fill="#1565c0" />
      <rect x="39" y="32" width="22" height="19" rx="3" fill="#fff" />
      <g fill="#1565c0">
        <rect x="41.5" y="34.5" width="6" height="6" rx="1" /><rect x="52.5" y="34.5" width="6" height="6" rx="1" />
        <rect x="41.5" y="43" width="6" height="5.5" rx="1" /><rect x="52.5" y="43" width="2.6" height="2.6" /><rect x="56" y="46" width="2.6" height="2.6" />
      </g>
      <circle cx="40" cy="60" r="2.8" fill="#f59e0b" /><circle cx="60" cy="60" r="2.8" fill="#f59e0b" />
      <rect x="45" y="59" width="10" height="2.8" rx="1.4" fill="#f59e0b" />
      <path d="M39 74l-3.5 7M50 74v7M61 74l3.5 7" stroke="#1565c0" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}
 
export default function Navbar() {
  const { user } = useAuth();
  const { lang, setLang, t, languages } = useLang();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const dark = theme === 'dark';
 
  // each click on the language button moves to the next language: English -> मराठी -> हिन्दी -> English
  const current = languages.findIndex((l) => l.code === lang);
  const next = languages[(current + 1) % languages.length];

  // use the translation when it exists, otherwise the English fallback
  const label = (key, fallback) => {
    const text = t(key);
    return !text || text === key ? fallback : text;
  };
 
  return (
    <header className="mq-header">
      <div className="mq-top">
        <div className="mq-wrap mq-top-in">
          <Link to="/" className="mq-logo" aria-label={t('top.homeAria')}><Logo /></Link>
 
          <Link to="/" className="mq-brand">
            <span className="mq-title">METRO QR</span>
            <span className="mq-tag">{t('top.tagline')}</span>
          </Link>
 
          <div className="mq-actions">
            <button type="button" className="mq-pill" onClick={() => setLang(next.code)} aria-label={`${t('top.language')}: ${next.label}`} title={`${t('top.language')}: ${next.label}`}>
              <Globe />{languages[current]?.label}
            </button>
            <button type="button" className="mq-pill" onClick={toggle} aria-pressed={dark} aria-label={dark ? t('top.toLight') : t('top.toDark')}>
              {dark ? <Sun /> : <Moon />}{dark ? t('top.light') : t('top.dark')}
            </button>
            <Link to="/map" className="mq-pill" title={t('top.locationTitle')} aria-label={t('top.location')}><Pin /><span className="mq-loc">{t('top.location')}</span></Link>
            {/* login / account stays last, at the far right */}
            {user ? (
              <NavLink to="/profile" className="mq-acct" title={`${user.name} · ${t('top.account')}`} aria-label={`${t('top.accountOf')} ${user.name}`}>
                {initials(user.name)}
              </NavLink>
            ) : (
              <>
                <Link to="/login" className="mq-pill">{t('top.login')}</Link>
                <Link to="/signup" className="mq-pill mq-primary">{t('top.signup')}</Link>
              </>
            )}
          </div>
        </div>
      </div>
 
      <nav className="mq-nav" aria-label={t('nav.main')}>
        <div className="mq-wrap mq-nav-in">
          <button className="mq-menu-btn" aria-expanded={open} aria-controls="mq-links" onClick={() => setOpen(!open)}>
            {open ? t('top.close') : t('top.menu')}
          </button>
          <div id="mq-links" className={`mq-links ${open ? 'open' : ''}`}>
            {LINKS.map(([to, key, fallback]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label(key, fallback)}</NavLink>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}