import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import useNow from '../hooks/useNow';
import { fmtTime, getStatus } from '../utils/time';
import StationSelect from '../components/StationSelect.jsx';
import QRTicket from '../components/QRTicket.jsx';
import Countdown from '../components/Countdown.jsx';
import PlacesCarousel from '../components/PlacesCarousel.jsx';
import HeroBackground from '../components/HeroBackground.jsx';
import '../components/home-photos.css';

const BASE = import.meta.env.BASE_URL;

// [title key, text key, photo]. The words themselves live in src/i18n/translations.js
// Photos live in public/images/. A missing photo shows a blue-teal block instead, so the layout never breaks.
const FEATURES = [
  ['home.f1', 'home.f1d', `${BASE}images/qr-entry.svg`],
  ['home.f2', 'home.f2d', `${BASE}images/instant-fare.svg`],
  ['home.f3', 'home.f3d', `${BASE}images/save-time.svg`],
];
// [path, label key, photo]
const QUICK = [
  ['/stations', 'home.q1', `${BASE}images/metro-stations.svg`],
  ['/book', 'home.q2', `${BASE}images/fare-enquiry.svg`],
  ['/services', 'home.q3', `${BASE}images/city-landmarks.svg`],
  ['/plan', 'home.q4', `${BASE}images/plan-my-trip.svg`],
];

function Photo({ src }) {
  return (
    <div className="photo">
      <img src={src} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
    </div>
  );
}

// Shows the latest ticket: active (with live countdown) or expired/used.
function UpcomingTrip() {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const { t } = useLang();
  const now = useNow(5000);

  if (!user) {
    return (
      <div className="card">
        <h2>{t('home.upcoming')}</h2>
        <p className="muted">{t('home.loginToSee')}</p>
        <Link to="/login" className="btn">{t('top.login')}</Link>
      </div>
    );
  }
  const active = tickets.filter((tk) => getStatus(tk, now) === 'active').sort((a, b) => a.validTill - b.validTill)[0];
  const ticket = active || tickets[0];
  if (!ticket) {
    return (
      <div className="card">
        <h2>{t('home.upcoming')}</h2>
        <p className="muted">{t('home.noTickets')}</p>
        <Link to="/book" className="btn">{t('nav.book')}</Link>
      </div>
    );
  }
  const status = getStatus(ticket, now);
  return (
    <div className="card">
      <h2>{status === 'active' ? t('home.upcoming') : t('home.last')}</h2>
      <Link to={`/ticket/${ticket.id}`} className="trip">
        <QRTicket ticket={ticket} size={96} dim={status !== 'active'} />
        <div>
          <strong>{ticket.from} → {ticket.to}</strong>
          <dl className="details">
            <div><dt>{t('home.ticketId')}</dt><dd>{ticket.id}</dd></div>
            <div><dt>{t('home.passengers')}</dt><dd>{ticket.passengers}</dd></div>
            <div><dt>{t('home.booked')}</dt><dd>{fmtTime(ticket.bookedAt)}</dd></div>
            <div><dt>{t('home.validTill')}</dt><dd>{fmtTime(ticket.validTill)}</dd></div>
          </dl>
        </div>
      </Link>
      <Countdown ticket={ticket} />
      {status !== 'active' && <Link to="/book" className="btn block">{t('home.bookNew')}</Link>}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { booking, setBooking } = useBooking();
  const [form, setForm] = useState({ from: booking.from, to: booking.to, passengers: booking.passengers });
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (form.from === form.to) { setError(t('home.sameStation')); return; }
    setBooking({ ...form, passengers: Number(form.passengers) });
    navigate('/fare'); // /fare is protected, so logged-out users are sent to login first
  }

  return (
    <>
      <section className="hero">
        <HeroBackground />
        <div className="grid cols-2 center">
          <div>
            <span className="pill glass">{t('home.pill')}</span>
            <h1>{t('home.h1a')}<br />{t('home.h1b')}</h1>
            <p>{t('home.sub')}</p>
            <div className="row">
              <Link to="/book" className="btn light">{t('nav.book')}</Link>
              <Link to="/plan" className="btn outline-light">{t('nav.plan')}</Link>
            </div>
          </div>
          <form className="card glass-card" onSubmit={submit}>
            <h2>{t('home.quickBooking')}</h2>
            <div className="grid cols-2">
              <StationSelect id="q-from" label={t('home.from')} value={form.from} onChange={(v) => setForm({ ...form, from: v })} />
              <StationSelect id="q-to" label={t('home.to')} value={form.to} onChange={(v) => setForm({ ...form, to: v })} />
              <label className="field" htmlFor="q-pax">
                <span className="lbl">{t('home.passengers')}</span>
                <select id="q-pax" className="fld" value={form.passengers} onChange={(e) => setForm({ ...form, passengers: e.target.value })}>
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}
                </select>
              </label>
              <div className="field end"><button className="btn block" type="submit">{t('home.seeFare')}</button></div>
            </div>
            {error && <p className="error" role="alert">{error}</p>}
          </form>
        </div>
      </section>

      <div className="grid cols-3 gap-top">
        {FEATURES.map(([titleKey, textKey, img]) => (
          <div className="card photo-card" key={titleKey}>
            <Photo src={img} />
            <div className="photo-body"><strong>{t(titleKey)}</strong><p className="muted">{t(textKey)}</p></div>
          </div>
        ))}
      </div>

      <h2 className="sec">{t('home.quickActions')}</h2>
      <div className="grid cols-4">
        {QUICK.map(([to, labelKey, img]) => (
          <Link key={labelKey} to={to} className="card tile photo-tile">
            <Photo src={img} />
            <span className="tile-label">{t(labelKey)}</span>
          </Link>
        ))}
      </div>

      <div className="grid cols-2 gap-top">
        <UpcomingTrip />
        <div className="offer">
          <img className="offer-card" src={`${BASE}images/metro-card.png`} alt={t('home.cardAlt')} width="260" />
          <div>
            <span>{t('home.cardTag')}</span>
            <strong>{t('home.cardTitle')}</strong>
            <p>{t('home.cardText')}</p>
            <Link to="/card" className="btn light">{t('home.cardBtn')}</Link>
          </div>
        </div>
      </div>

      <div className="sec-row">
        <h2 className="sec">{t('home.places')}</h2>
        <Link to="/places" className="see-all">{t('home.seeAllPlaces')}</Link>
      </div>
      <PlacesCarousel />
    </>
  );
}