import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { STATIONS, TIMETABLE, linesOf, quote } from '../data/metro';
import { COMMON_FEATURES, STATION_INFO, slugOf } from '../data/stationInfo';
import { useBooking } from '../context/BookingContext.jsx';
import StationImage from '../components/StationImage.jsx';

// Shows every station of one line, with this station highlighted.
function LineStrip({ line, current }) {
  return (
    <div className="strip">
      <span className="line-chip" style={{ background: line.color }}>{line.name}</span>
      <ol className="strip-list">
        {line.stations.map((s) => (
          <li key={s} className={s === current ? 'now' : ''}>
            <Link to={`/station/${slugOf(s)}`} aria-current={s === current ? 'page' : undefined}>
             <i style={{ borderColor: line.color, background: s === current ? line.color : 'var(--card)' }} />
              <span>{s}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function StationDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setBooking } = useBooking();
  const [text, setText] = useState('');
  const name = STATIONS.find((s) => slugOf(s) === slug);

  if (!name) {
    return <div className="card"><h1>Station not found</h1><Link to="/stations" className="btn">All stations</Link></div>;
  }

  const info = STATION_INFO[name] || {};
  const lines = linesOf(name);
  const isInterchange = lines.length > 1;
  const color = isInterchange ? '#1565C0' : lines[0].color;
  const isTerminal = lines.some((l) => l.stations[0] === name || l.stations[l.stations.length - 1] === name);

  // Plain-English summary made from the line data, used when no description was added.
  const autoAbout = lines.map((l) => {
    const i = l.stations.indexOf(name);
    const near = [l.stations[i - 1], l.stations[i + 1]].filter(Boolean);
    return `${name} is station ${i + 1} of ${l.stations.length} on the ${l.name}${near.length ? `, next to ${near.join(' and ')}` : ''}.`;
  }).join(' ');

  const neighbours = [...new Set(lines.flatMap((l) => {
    const i = l.stations.indexOf(name);
    return [l.stations[i - 1], l.stations[i + 1]].filter(Boolean);
  }))];

  const rows = STATIONS
    .filter((s) => s !== name && s.toLowerCase().includes(text.trim().toLowerCase()))
    .map((s) => ({ to: s, q: quote({ from: name, to: s, passengers: 1, journey: 'single' }) }))
    .filter((r) => r.q)
    .sort((a, b) => a.q.stops - b.q.stops);

  const book = (from, to) => { setBooking({ from, to }); navigate('/book'); };

  return (
    <>
      <Link to="/stations" className="back">← All stations</Link>

      <section className="card sd-hero">
        <StationImage name={name} color={color} />
        <div className="sd-info">
          <div className="row">
            {lines.map((l) => <span key={l.id} className="line-chip" style={{ background: l.color }}>{l.name}</span>)}
            {isInterchange && <span className="soft-badge">Interchange</span>}
            {isTerminal && <span className="soft-badge">Terminal station</span>}
          </div>
          <h1>{name}</h1>
          <p className="muted">{info.about || autoAbout}</p>
          {info.credit && <p className="muted small">Photo: {info.credit}</p>}
          <div className="row">
            <button className="btn" onClick={() => { setBooking({ from: name }); navigate('/book'); }}>Travel from here</button>
            <button className="btn outline" onClick={() => { setBooking({ to: name }); navigate('/book'); }}>Travel to here</button>
            <Link to="/map" className="btn outline">View on map</Link>
          </div>
        </div>
      </section>

      <h2 className="sec">Where this station sits</h2>
      <div className="card stack">
        {lines.map((l) => <LineStrip key={l.id} line={l} current={name} />)}
        <div>
          <span className="lbl">Nearby stations</span>
          <div className="row nb">
            {neighbours.map((s) => <Link key={s} to={`/station/${slugOf(s)}`} className="pill">{s}</Link>)}
          </div>
        </div>
      </div>

      {info.features?.length > 0 && (
        <>
          <h2 className="sec">Highlights</h2>
          <ul className="stn-feats hl big">{info.features.map((f) => <li key={f}>{f}</li>)}</ul>
        </>
      )}

      <h2 className="sec">Facilities at the station</h2>
      <div className="facility-grid">
        {COMMON_FEATURES.map((f) => <div key={f} className="facility">{f}</div>)}
      </div>
      <p className="muted small">Based on Pune Metro&apos;s accessibility guide (punemetrorail.org). Individual stations can differ.</p>

      <h2 className="sec">Train timings</h2>
      <div className="grid cols-4">
        {[['First train', TIMETABLE.first], ['Last train', TIMETABLE.last], ['Peak frequency', TIMETABLE.peak], ['Off-peak', TIMETABLE.offPeak]].map(([k, v]) => (
          <div className="card" key={k}><div className="lbl">{k}</div><div className="stat">{v}</div></div>
        ))}
      </div>
      <p className="muted small">*Sources differ on the last train (10 PM or 11 PM). Check <a href="https://www.punemetrorail.org" target="_blank" rel="noreferrer">punemetrorail.org</a> before you travel.</p>

      <h2 className="sec">Travel from {name}</h2>
      <div className="card">
        <input className="fld search" placeholder="Search a destination" aria-label="Search a destination" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="reach">
          {rows.map((r) => (
            <div className="reach-row" key={r.to}>
              <Link to={`/station/${slugOf(r.to)}`}><strong>{r.to}</strong></Link>
              <span className="muted small">{r.q.stops} stop{r.q.stops > 1 ? 's' : ''} · {r.q.segments.map((s) => s.line.name.replace(' Line', '')).join(' → ')}</span>
              <strong>₹{r.q.perPassenger}</strong>
              <button className="btn-sm" onClick={() => book(name, r.to)}>Book</button>
            </div>
          ))}
          {rows.length === 0 && <p className="muted">No station matches “{text}”.</p>}
        </div>
        <p className="muted small">Fares are demo fares, not the real Pune Metro fare chart.</p>
      </div>
    </>
  );
}