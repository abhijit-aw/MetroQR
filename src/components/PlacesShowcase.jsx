import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BEST_PLACES, PLACE_TYPES } from '../data/bestPlaces.js';
import './places-showcase.css';

// Your detail page route is  place/:slug  (see App.jsx)
const detailPath = (slug) => `/place/${slug}`;

function PlaceTile({ place }) {
  const [broken, setBroken] = useState(false);
  return (
    <Link to={detailPath(place.slug)} className="ps-card">
      <div className="ps-photo">
        {broken ? (
          <span className="ps-fallback">{place.name}</span>
        ) : (
          // encodeURI makes file names with spaces ("Saras baug.jpeg") safe
          <img src={encodeURI(place.img)} alt={place.alt} loading="lazy" onError={() => setBroken(true)} />
        )}
        <span className="ps-chip">{place.type}</span>
      </div>
      <div className="ps-body">
        <h3>{place.name}</h3>
        <p>{place.area}</p>
      </div>
    </Link>
  );
}

// variant="carousel": one scrolling row (Home page).  variant="grid": all places, with type filter (Places page).
export default function PlacesShowcase({ variant = 'carousel', filters = false }) {
  const [type, setType] = useState('All');
  const row = useRef(null);
  const list = type === 'All' ? BEST_PLACES : BEST_PLACES.filter((p) => p.type === type);

  const scroll = (dir) => row.current?.scrollBy({ left: dir * 560, behavior: 'smooth' });

  return (
    <section className="ps" aria-label="Best places in Pune">
      {filters && (
        <div className="ps-filters" role="group" aria-label="Filter places by type">
          {PLACE_TYPES.map((t) => (
            <button key={t} type="button" className={`ps-filter ${t === type ? 'on' : ''}`} aria-pressed={t === type} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
      )}

      {variant === 'carousel' ? (
        <div className="ps-wrapper">
          <button type="button" className="ps-arrow left" aria-label="Scroll places left" onClick={() => scroll(-1)}>‹</button>
          <div className="ps-row" ref={row}>
            {list.map((p) => <PlaceTile key={p.slug} place={p} />)}
          </div>
          <button type="button" className="ps-arrow right" aria-label="Scroll places right" onClick={() => scroll(1)}>›</button>
        </div>
      ) : (
        <div className="ps-grid">
          {list.map((p) => <PlaceTile key={p.slug} place={p} />)}
        </div>
      )}
    </section>
  );
}