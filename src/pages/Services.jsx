import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import '../components/home-photos.css'; // the photo-card look is shared with the Home page

const BASE = import.meta.env.BASE_URL;
const photo = (name) => `${BASE}images/${name}.svg`; // files live in public/images/

// [English label, translation key, page link, photo file name]
const ITEMS = [
  ['View Map', 'svc.map', '/map', 'view-map'],
  ['Metro Time Table', 'svc.timetable', '/timetable', 'metro-timetable'],
  ['Nearby Metro Station', 'svc.nearby', '/stations', 'nearby-station'],
  ['Travel Advisor', 'svc.advisor', '/info/travel-advisor', 'travel-advisor'],
  ['Emergency Contacts', 'svc.emergency', '/info/emergency', 'emergency-contacts'],
  ['Feeder Services', 'svc.feeder', '/info/feeder-services', 'feeder-services'],
  ['Toilet Seva', 'svc.toilet', '/info/toilet-seva', 'toilet-seva'],
];
// Replace these with your own page links.
const SOCIAL = [
  ['Facebook', 'https://www.facebook.com', 'facebook'],
  ['Twitter', 'https://x.com', 'twitter'],
  ['Instagram', 'https://www.instagram.com', 'instagram'],
];

function Photo({ src }) {
  return (
    <div className="photo">
      <img src={src} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
    </div>
  );
}

export default function Services() {
  const { t } = useLang();
  // uses the translated word if it exists, otherwise the English label (so nothing ever shows a raw key)
  const label = (key, english) => { const s = t(key); return s === key ? english : s; };

  return (
    <>
      <PageHeader title={label('nav.services', 'Services')} />
      <div className="grid cols-4">
        {ITEMS.map(([english, key, to, img]) => (
          <Link key={key} to={to} className="card tile photo-tile">
            <Photo src={photo(img)} />
            <span className="tile-label">{label(key, english)}</span>
          </Link>
        ))}
        {SOCIAL.map(([name, href, img]) => (
          <a key={name} href={href} target="_blank" rel="noreferrer" className="card tile photo-tile" aria-label={`${name} (opens in a new tab)`}>
            <Photo src={photo(img)} />
            <span className="tile-label">{name}</span>
          </a>
        ))}
      </div>
    </>
  );
}
  