import { useState } from 'react';
import { STATION_INFO, slugOf } from '../data/stationInfo';
import { stationArtUrl } from '../utils/stationArt';

// Simple drawn station (platform, pillars, train), the last fallback if nothing else loads.
function StationArt({ color }) {
  return (
    <svg className="stn-art" viewBox="0 0 280 130" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect x="0" y="100" width="280" height="30" fill="rgba(255,255,255,.18)" />
      <rect x="16" y="34" width="248" height="9" rx="4" fill="rgba(255,255,255,.4)" />
      {[48, 132, 216].map((x) => <rect key={x} x={x} y="43" width="7" height="57" fill="rgba(255,255,255,.3)" />)}
      <rect x="56" y="58" width="168" height="42" rx="14" fill="rgba(255,255,255,.95)" />
      {[70, 120, 170].map((x) => <rect key={x} x={x} y="66" width="38" height="16" rx="5" fill={color} />)}
      <circle cx="92" cy="100" r="6" fill="#F28C0F" /><circle cx="188" cy="100" r="6" fill="#F28C0F" />
    </svg>
  );
}

// What it shows, in this order:
//   1. a real photo: public/images/stations/<station>.jpg (or the image set in STATION_INFO)
//   2. the picture of the station's line (Purple, Aqua or Interchange) from public/images/
//   3. the small drawn station above
// Pass alt="" when the station name is already written next to the picture (like on the Stations cards).
export default function StationImage({ name, color, alt }) {
  const [state, setState] = useState({ name, stage: 'photo' });
  const stage = state.name === name ? state.stage : 'photo'; // starts again when the station changes
  const label = alt ?? `${name} station`;

  if (stage === 'drawn') {
    return (
      <div className="stn-img ph" style={{ background: `linear-gradient(160deg, ${color}, #0F1B2D)` }}>
        <StationArt color={color} />
        <span>{name}</span>
      </div>
    );
  }

  if (stage === 'art') {
    return <img className="stn-img" src={stationArtUrl(name)} alt={label} loading="lazy" onError={() => setState({ name, stage: 'drawn' })} />;
  }

  const image = STATION_INFO[name]?.image || `${slugOf(name)}.jpg`;
  const src = image.startsWith('http') ? image : `${import.meta.env.BASE_URL}images/stations/${image}`;
  return <img className="stn-img" src={src} alt={label} loading="lazy" onError={() => setState({ name, stage: 'art' })} />;
}