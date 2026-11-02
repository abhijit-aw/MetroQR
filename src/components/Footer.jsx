import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';

// [column title key, [[path, label key], ...]]
const COLS = [
  ['foot.travel', [['/book', 'nav.book'], ['/stations', 'nav.stations'], ['/timetable', 'nav.timetable']]],
  ['foot.account', [['/card', 'nav.card'], ['/tickets', 'nav.tickets'], ['/profile', 'foot.profile'], ['/login', 'top.login']]],
  ['foot.support', [['/info/complaint', 'foot.help'], ['/about', 'nav.about'], ['/info/privacy-policy', 'foot.privacy'], ['/info/emergency', 'foot.emergency']]],
];

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="wrap grid cols-4">
        <div>
          <div className="foot-brand">MetroQR</div>
          <br />
          <p className="muted small">{t('foot.note')}</p>
          <p>{t('foot.madeBy')}</p>
        </div>
        {COLS.map(([titleKey, links]) => (
          <div key={titleKey}>
            <div className="foot-title">{t(titleKey)}</div>
            {links.map(([to, labelKey]) => <Link key={labelKey} to={to}>{t(labelKey)}</Link>)}
          </div>
        ))}
      </div>
    </footer>
  );
}