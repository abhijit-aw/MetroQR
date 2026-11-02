import { Link } from 'react-router-dom';
import PlaceImage from './PlaceImage.jsx';

export default function PlaceCard({ place }) {
  return (
    <Link to={`/place/${place.slug}`} className="place-card">
      <div className="place-img">
        <PlaceImage place={place} />
        {place.sample && <span className="sample-tag">Sample photo</span>}
      </div>
      <div className="place-info">
        <span className="place-chip">{place.category}</span>
        <strong>{place.name}</strong>
        <span className="muted small">{place.area}</span>
      </div>
    </Link>
  );
}