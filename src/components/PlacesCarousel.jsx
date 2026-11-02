import { useCallback, useEffect, useRef, useState } from 'react';
import { PLACES } from '../data/places';
import PlaceCard from './PlaceCard.jsx';

// Side-scrolling row of place cards: swipe, trackpad, scrollbar, arrow buttons or arrow keys.
export default function PlacesCarousel({ places = PLACES }) {
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const go = (dir) => {
    const el = track.current;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: calm ? 'auto' : 'smooth' });
  };

  return (
    <div className="pc">
      <button type="button" className="pc-btn prev" aria-label="Scroll places left" disabled={edge.start} onClick={() => go(-1)}>‹</button>
      <ul className="pc-track" ref={track} onScroll={update} tabIndex={0} aria-label="Best places in Pune. Scroll sideways to see more.">
        {places.map((p) => <li key={p.slug}><PlaceCard place={p} /></li>)}
      </ul>
      <button type="button" className="pc-btn next" aria-label="Scroll places right" disabled={edge.end} onClick={() => go(1)}>›</button>
    </div>
  );
}