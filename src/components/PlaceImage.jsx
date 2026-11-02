import { useEffect, useState } from 'react';
import './places.css';

const COLORS = { History: '#8A4B2D', Temple: '#B85500', Museum: '#5B3F8C', Garden: '#2E7D32', Lake: '#00796B', Fort: '#6B4E2E' };

// Files live in public/images/. Full https:// links work too.
export const photoUrl = (name) => (name.startsWith('http') ? name : `${import.meta.env.BASE_URL}images/${name}`);
export const candidatePhotos = (place) => (place.photos?.length ? place.photos : [1, 2, 3, 4].map((n) => `places/${place.slug}-${n}.jpg`));

// Drawn scenery shown until a real photo exists.
export function PlaceArt({ place }) {
  const c = COLORS[place.category] || '#1565C0';
  return (
    <div className="place-art" style={{ background: `linear-gradient(160deg, ${c}, #0F1B2D)` }}>
      <svg viewBox="0 0 280 170" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <circle cx="210" cy="50" r="22" fill="rgba(255,255,255,.55)" />
        <path d="M0 150 L70 80 L120 125 L180 70 L280 150 Z" fill="rgba(255,255,255,.22)" />
        <path d="M0 170 L0 130 Q70 105 140 130 T280 125 L280 170 Z" fill="rgba(255,255,255,.3)" />
      </svg>
      <span>{place.name}</span>
    </div>
  );
}

// The first photo, or the drawn scenery if the file is missing.
export default function PlaceImage({ place }) {
  const [failed, setFailed] = useState(false);
  const first = candidatePhotos(place)[0];
  if (failed) return <PlaceArt place={place} />;
  return <img src={photoUrl(first)} alt={`${place.name}, Pune`} loading="lazy" onError={() => setFailed(true)} />;
}

// Checks which photos really exist and returns only those (null while checking).
export function usePhotos(place) {
  const [photos, setPhotos] = useState(null);
  useEffect(() => {
    let alive = true;
    setPhotos(null);
    if (!place) { setPhotos([]); return undefined; }
    Promise.all(candidatePhotos(place).map((n) => new Promise((res) => {
      const img = new Image();
      img.onload = () => res(n);
      img.onerror = () => res(null);
      img.src = photoUrl(n);
    }))).then((r) => { if (alive) setPhotos(r.filter(Boolean)); });
    return () => { alive = false; };
  }, [place]);
  return photos;
}