import { LINES, PINK } from '../data/metro';
import PageHeader from '../components/PageHeader.jsx';
import MetroMap from '../components/MetroMap.jsx';

export default function MapPage() {
  const legend = [...LINES.map((l) => [l.color, `${l.name} · ${l.ends.replace(' ⇄ ', ' – ')} (${l.stations.length} stations)`, 'solid']), [PINK.color, `${PINK.name} · ${PINK.note}`, 'dotted']];
  return (
    <>
     <PageHeader title="Pune Metro Map" sub="Hover over (or tap) a station to see its details. Schematic map, not to scale." />
      <div className="card">
        <div className="row wrap legend">
          {legend.map(([c, t, style]) => <span key={t}><i style={{ borderTop: `6px ${style} ${c}` }} />{t}</span>)}
        </div>
        <MetroMap />
        <a className="btn" href="https://www.google.com/maps/search/Pune+Metro+stations" target="_blank" rel="noreferrer">Open real map in Google Maps</a>
      </div>
      <div className="grid cols-2 gap-top">
        {LINES.map((l) => (
          <div className="card" key={l.id}>
            <h2>{l.name}</h2>
            <div className="row wrap">{l.stations.map((s, i) => <span key={s} className="pill static" style={{ borderColor: l.color }}>{i + 1}. {s}</span>)}</div>
          </div>
        ))}
      </div>
    </>
  );
}