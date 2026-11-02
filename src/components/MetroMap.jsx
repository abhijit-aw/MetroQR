import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LINES, PINK, linesOf } from '../data/metro';
import { COMMON_FEATURES, STATION_INFO, slugOf } from '../data/stationInfo';
import { useBooking } from '../context/BookingContext.jsx';
import StationImage from './StationImage.jsx';

// Schematic map (not geographic). Coordinates are in a 1000 x 680 box.
const W = 1000, H = 680;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// Spreads n points evenly along a polyline.
function along(wp, n) {
  const seg = wp.slice(1).map((p, i) => dist(wp[i], p));
  const total = seg.reduce((a, b) => a + b, 0);
  return Array.from({ length: n }, (_, k) => {
    let t = (total * k) / (n - 1), i = 0;
    while (i < seg.length - 1 && t > seg[i]) { t -= seg[i]; i++; }
    const f = Math.min(t / seg[i], 1), a = wp[i], b = wp[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  });
}

const PA = [[170, 70], [300, 170], [430, 260], [520, 330]], PB = [[520, 330], [550, 470], [590, 640]];
const QA = [[70, 440], [300, 410], [520, 330]], QB = [[520, 330], [700, 270], [830, 190], [930, 110]];
const PINK_PATH = [[520, 330], [610, 210], [640, 100], [440, 40], [260, 30]];
const PURPLE_XY = [...along(PA, 11), ...along(PB, 4).slice(1)];   // Civil Court = index 10
const AQUA_XY = [...along(QA, 9), ...along(QB, 8).slice(1)];      // Civil Court = index 8
const pts = (w) => w.map((p) => p.join(',')).join(' ');

// Every station that can be hovered, once. Civil Court is shared by both lines.
const [purple, aqua] = LINES;
const POINTS = [
  ...purple.stations.map((name, i) => ({
    name, x: PURPLE_XY[i][0], y: PURPLE_XY[i][1], color: purple.color, interchange: name === 'Civil Court',
    label: i < 10 ? { dx: -11, dy: 4, anchor: 'end' } : { dx: 11, dy: 4, anchor: 'start' },
  })),
  ...aqua.stations
    .map((name, i) => ({ name, x: AQUA_XY[i][0], y: AQUA_XY[i][1], color: aqua.color, label: { dx: 2, dy: 16, anchor: 'start', rotate: 35 } }))
    .filter((p) => p.name !== 'Civil Court'),
  { name: 'Maan', x: 260, y: 30, color: PINK.color, upcoming: true, label: { dx: 0, dy: -14, anchor: 'middle' } },
  { name: 'Balewadi', x: 440, y: 40, color: PINK.color, upcoming: true, label: { dx: 0, dy: -12, anchor: 'middle' } },
];

const Label = ({ x, y, anchor = 'start', rotate = 0, bold, children }) => (
  <text x={x} y={y} fontSize="11" fontWeight={bold ? 800 : 400} fill="#22303F" textAnchor={anchor} transform={`rotate(${rotate} ${x} ${y})`}>{children}</text>
);

// One station on the map. Hover, keyboard focus or a tap opens its card.
function Station({ p, active, onOpen }) {
  const open = () => onOpen(p);
  const L = p.label;
  return (
    <g
      className="stn" tabIndex={0} role="button" aria-label={`${p.name} station. Show details`}
      onMouseEnter={open} onFocus={open} onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
    >
      <circle className="hit" cx={p.x} cy={p.y} r="16" fill="none" pointerEvents="all" />
      {p.interchange ? (
        <>
          <circle className="dot" cx={p.x} cy={p.y} r="11" fill={active ? '#0F1B2D' : '#fff'} stroke="#0F1B2D" strokeWidth="4" />
          <line x1="528" y1="340" x2="556" y2="396" stroke="#0F1B2D" strokeWidth="1.5" />
          <Label x={558} y={404} bold>Civil Court (interchange)</Label>
        </>
      ) : (
        <>
          <circle className="dot" cx={p.x} cy={p.y} r="6" fill={active ? p.color : '#fff'} stroke={p.color} strokeWidth="3" />
          <Label x={p.x + L.dx} y={p.y + L.dy} anchor={L.anchor} rotate={L.rotate || 0}>{p.name}</Label>
        </>
      )}
    </g>
  );
}

function StationCard({ p }) {
  const navigate = useNavigate();
  const { setBooking } = useBooking();
  const info = STATION_INFO[p.name] || {};
  const lines = linesOf(p.name);
  const side = p.x > 600 ? 'left' : '';
  const vert = p.y > 380 ? 'up' : '';

  const travel = (field) => { setBooking({ [field]: p.name }); navigate('/book'); };

  return (
    <div className={`stn-card ${side} ${vert}`} style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }} role="dialog" aria-label={`${p.name} station details`}>
      <StationImage name={p.name} color={p.color} />
      <div className="stn-body">
        <h3>{p.name}</h3>
        {p.upcoming && <p className="stn-note">Upcoming station on the Pink Line. Not open yet.</p>}
        {lines.map((l) => {
          const i = l.stations.length ? l.stations.indexOf(p.name) : 0;
          const last = l.stations.length - 1;
          const hint = [
            i > 0 ? `Previous: ${l.stations[i - 1]}` : null,
            i < last ? `Next: ${l.stations[i + 1]}` : null,
            i === 0 || i === last ? 'Terminal station' : null,
          ].filter(Boolean).join(' · ');
          return (
            <p key={l.id} className="small">
              <span className="line-chip" style={{ background: l.color }}>{l.name}</span>
              Station {i + 1} of {l.stations.length}
              <br /><span className="muted">{hint}</span>
            </p>
          );
        })}
        {lines.length > 1 && <p className="stn-note">Interchange: change here between the Purple and Aqua lines.</p>}
        {info.about && <p className="small">{info.about}</p>}
        {info.features?.length > 0 && (
          <>
            <div className="stn-feat-title">Highlights</div>
            <ul className="stn-feats hl">{info.features.map((f) => <li key={f}>{f}</li>)}</ul>
          </>
        )}
        {!p.upcoming && (
          <>
            <div className="stn-feat-title">At the station</div>
            <ul className="stn-feats">{COMMON_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
          </>
        )}
        {!p.upcoming && (
          <div className="stn-actions">
            <button type="button" onClick={() => travel('from')}>Travel from here</button>
            <button type="button" className="primary" onClick={() => travel('to')}>Travel to here</button>
          </div>
        )}
        {!p.upcoming && <Link className="stn-more" to={`/station/${slugOf(p.name)}`}>More details →</Link>}
      </div>
    </div>
  );
}

export default function MetroMap() {
  const [active, setActive] = useState(null);
  return (
    <div className="map-scroll">
      <div className="map-inner" onMouseLeave={() => setActive(null)} onKeyDown={(e) => e.key === 'Escape' && setActive(null)}>
        <div className="map-stage">
        <svg
          viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Schematic map of the Pune Metro Purple and Aqua lines and the upcoming Pink line. Each station can be focused to see details."
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onClick={(e) => { if (e.target === e.currentTarget) setActive(null); }}
        >
          <polyline points={pts(PINK_PATH)} fill="none" stroke={PINK.color} strokeWidth="7" strokeLinecap="round" strokeDasharray="4 12" />
          <polyline points={pts([...PA, ...PB.slice(1)])} fill="none" stroke={purple.color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={pts([...QA, ...QB.slice(1)])} fill="none" stroke={aqua.color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <Label x={660} y={168} bold>Pink Line (upcoming)</Label>
          {POINTS.map((p) => <Station key={p.name} p={p} active={active?.name === p.name} onOpen={setActive} />)}
        </svg>
        {active && <StationCard key={active.name} p={active} />}
        </div>
      </div>
    </div>
  );
}