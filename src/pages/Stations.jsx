import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LINES, STATIONS, linesOf } from '../data/metro';
import { slugOf } from '../data/stationInfo';
import '../components/stations-page.css';

const IX_COLOR = '#1565C0';

// Little illustrated train used on every card banner.
function Train() {
  return (
    <svg className="sc-train" viewBox="0 0 120 56" aria-hidden="true">
      <rect x="2" y="4" width="116" height="38" rx="14" fill="#fff" />
      <rect x="14" y="14" width="26" height="12" rx="6" className="sc-win" />
      <rect x="47" y="14" width="26" height="12" rx="6" className="sc-win" />
      <rect x="80" y="14" width="26" height="12" rx="6" className="sc-win" />
      <circle cx="30" cy="48" r="4" fill="#F59E0B" />
      <circle cx="90" cy="48" r="4" fill="#F59E0B" />
    </svg>
  );
}

function StationCard({ line, name, index }) {
  const total = line.stations.length;
  const next = line.stations[index + 1];
  const pct = total > 1 ? (index / (total - 1)) * 100 : 0;
  return (
    <Link to={`/station/${slugOf(name)}`} className="sc" style={{ '--c': line.color }}>
      <div className="sc-banner">
        <span className="sc-tag"><i />{line.name}</span>
        <span className="sc-num">{String(index + 1).padStart(2, '0')}</span>
        <Train />
      </div>
      <div className="sc-body">
        <strong className="sc-name">{name}</strong>
        <div className="sc-track"><b style={{ width: `${pct}%` }} /><i style={{ left: `${pct}%` }} /></div>
        <div className="sc-meta">
          <span>Station {index + 1} of {total}</span>
          {next && <span>Next: {next} →</span>}
        </div>
      </div>
    </Link>
  );
}

// Card for a station where two lines meet.
function InterchangeCard({ name }) {
  const lines = linesOf(name);
  return (
    <Link
      to={`/station/${slugOf(name)}`}
      className="sc ix"
      style={{ '--c': IX_COLOR, '--c1': lines[0].color, '--c2': lines[lines.length - 1].color }}
    >
      <div className="sc-banner">
        <span className="sc-tag"><i />Interchange</span>
        <span className="sc-num">⇄</span>
        <Train />
      </div>
      <div className="sc-body">
        <strong className="sc-name">{name}</strong>
        <div className="sc-lines">
          {lines.map((l) => <span key={l.id} style={{ background: l.color }}>{l.name.replace(' Line', '')}</span>)}
        </div>
        <div className="sc-meta">
          <span>Change between {lines.map((l) => l.name.replace(' Line', '')).join(' and ')}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Stations() {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | line id | 'interchange'

  const q = text.trim().toLowerCase();
  const matches = (s) => s.toLowerCase().includes(q);

  const interchanges = STATIONS.filter((s) => linesOf(s).length > 1);

  const showLines = filter === 'all' || LINES.some((l) => l.id === filter);
  const sections = showLines
    ? LINES
        .filter((l) => filter === 'all' || filter === l.id)
        .map((l) => ({
          line: l,
          items: l.stations.map((name, index) => ({ name, index })).filter(({ name }) => matches(name)),
        }))
        .filter((s) => s.items.length > 0)
    : [];

  const ixShown = (filter === 'all' || filter === 'interchange') ? interchanges.filter(matches) : [];

  const tabs = [
    ['all', 'All', STATIONS.length],
    ...LINES.map((l) => [l.id, l.name, l.stations.length]),
    ['interchange', 'Interchange', interchanges.length],
  ];

  return (
    <>
      <header className="sp-head">
        <div>
          <h1>Metro Stations</h1>
          <p className="muted">All {STATIONS.length} operational stations on the Purple and Aqua lines. Tap a station for photos and details.</p>
        </div>
        <div className="sp-stats">
          {[[STATIONS.length, 'Stations'], [LINES.length, 'Lines'], [interchanges.length, 'Interchange']].map(([n, l]) => (
            <div key={l}><strong>{n}</strong><span>{l}</span></div>
          ))}
        </div>
      </header>

      <div className="sp-tools">
        <input className="sp-search" placeholder="Search a station" aria-label="Search a station" value={text} onChange={(e) => setText(e.target.value)} />
        {tabs.map(([id, label, n]) => (
          <button key={id} className={`sp-pill ${filter === id ? 'on' : ''}`} aria-pressed={filter === id} onClick={() => setFilter(id)}>
            {label} <small>{n}</small>
          </button>
        ))}
      </div>

      {sections.map(({ line, items }) => {
        const first = line.stations[0];
        const last = line.stations[line.stations.length - 1];
        return (
          <section key={line.id} className="sp-sec">
            <div className="sp-sec-head" style={{ '--c': line.color }}>
              <span className="sp-chip">{line.name}</span>
              <span className="sp-route">{first} ⇄ {last} · {line.stations.length} stations</span>
              <hr />
            </div>
            <div className="sp-grid">
              {items.map(({ name, index }) => <StationCard key={name} line={line} name={name} index={index} />)}
            </div>
          </section>
        );
      })}

      {ixShown.length > 0 && (
        <section className="sp-sec">
          <div className="sp-sec-head" style={{ '--c': IX_COLOR }}>
            <span className="sp-chip">Interchange</span>
            <span className="sp-route">Change between lines · {interchanges.length} station{interchanges.length > 1 ? 's' : ''}</span>
            <hr />
          </div>
          <div className="sp-grid">
            {ixShown.map((s) => <InterchangeCard key={s} name={s} />)}
          </div>
        </section>
      )}

      {sections.length === 0 && ixShown.length === 0 && <p className="muted">No station matches “{text}”.</p>}
    </>
  );
}