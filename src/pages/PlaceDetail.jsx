import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PLACES, placeBySlug } from '../data/places';
import { slugOf } from '../data/stationInfo';
import { useBooking } from '../context/BookingContext.jsx';
import { PlaceArt, photoUrl, usePhotos } from '../components/PlaceImage.jsx';
import PlaceCard from '../components/PlaceCard.jsx';

export default function PlaceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setBooking } = useBooking();
  const place = placeBySlug(slug);
  const photos = usePhotos(place);
  const [current, setCurrent] = useState(0);
  useEffect(() => setCurrent(0), [slug]);

  if (!place) {
    return <div className="card"><h1>Place not found</h1><Link to="/places" className="btn">See all places</Link></div>;
  }

  const nearby = place.nearby.map(placeBySlug).filter(Boolean);
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} Pune`)}`;
  const facts = [
    ['Area', place.area], ['Best time', place.bestTime], ['Time needed', place.duration],
    place.fromRailway && ['From Pune Railway Station', `${place.fromRailway} km`],
    place.timings && ['Timings', place.timings], place.fee && ['Entry fee', place.fee],
  ].filter(Boolean);

  return (
    <>
      <Link to="/places" className="back">← All places</Link>

      <section className="place-hero">
        <div>
          <div className="gallery-main">
            {photos === null && <div className="place-art" style={{ background: 'var(--line, #DCE5EE)' }} aria-busy="true" />}
            {photos && photos.length > 0 && <img src={photoUrl(photos[current] || photos[0])} alt={`${place.name}, photo ${current + 1}`} />}
            {photos && photos.length === 0 && <PlaceArt place={place} />}
            {place.sample && photos?.length > 0 && <span className="sample-tag">Sample photo</span>}
          </div>
          {photos && photos.length > 1 && (
            <div className="gallery-thumbs" role="group" aria-label="More photos">
              {photos.map((n, i) => (
                <button key={n} type="button" aria-current={i === current} aria-label={`Show photo ${i + 1}`} onClick={() => setCurrent(i)}>
                  <img src={photoUrl(n)} alt="" />
                </button>
              ))}
            </div>
          )}
          {photos && photos.length === 0 && <p className="muted small">Photos coming soon.</p>}
          {place.credit && <p className="muted small">Photo: {place.credit}</p>}
        </div>

        <div className="stack">
          <span className="place-chip">{place.category}</span>
          <h1>{place.name}</h1>
          <p className="muted" style={{ margin: 0 }}>{place.about}</p>
          <div className="row">
            <a className="btn" href={mapLink} target="_blank" rel="noreferrer">Open in Google Maps</a>
            {place.metro && <button type="button" className="btn outline" onClick={() => { setBooking({ to: place.metro }); navigate('/book'); }}>Travel to {place.metro} station</button>}
          </div>
        </div>
      </section>

      <h2 className="sec">Highlights</h2>
      <ul className="stn-feats hl big">{place.highlights.map((h) => <li key={h}>{h}</li>)}</ul>

      <h2 className="sec">Good to know</h2>
      <div className="fact-grid">
        {facts.map(([k, v]) => <div className="fact" key={k}><span className="lbl">{k}</span><strong>{v}</strong></div>)}
        {place.metro && (
          <div className="fact"><span className="lbl">Nearest metro</span><strong><Link to={`/station/${slugOf(place.metro)}`}>{place.metro}</Link></strong><span className="muted small">{place.metroNote}</span></div>
        )}
      </div>
      <p className="muted small">Timings, fees and rules change, so check before you go. Distances are approximate.</p>

      {place.tips.length > 0 && (
        <>
          <h2 className="sec">Tips</h2>
          <div className="card"><ul style={{ margin: 0, paddingLeft: 20 }}>{place.tips.map((t) => <li key={t}>{t}</li>)}</ul></div>
        </>
      )}

      {nearby.length > 0 && (
        <>
          <h2 className="sec">Nearby places</h2>
          <div className="places-grid">{nearby.map((p) => <PlaceCard key={p.slug} place={p} />)}</div>
        </>
      )}
      <p className="muted small" style={{ marginTop: 24 }}>{PLACES.length} places in total. <Link to="/places">See all</Link></p>
    </>
  );
}