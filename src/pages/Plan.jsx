import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { quote } from '../data/metro';
import PageHeader from '../components/PageHeader.jsx';
import StationSelect from '../components/StationSelect.jsx';

export default function Plan() {
  const navigate = useNavigate();
  const { setBooking } = useBooking();
  const [form, setForm] = useState({ from: 'Shivaji Nagar', to: 'Swargate' });
  const [query, setQuery] = useState(form);
  const result = quote({ ...query, passengers: 1, journey: 'single' });

  function book() { setBooking({ ...query }); navigate('/book'); }

  return (
    <>
      <PageHeader title="Plan Your Trip" sub="Find the route, stops and fare between two stations." />
      <div className="grid cols-2 top">
        <form className="card stack" onSubmit={(e) => { e.preventDefault(); setQuery(form); }}>
          <StationSelect id="p-from" label="From" value={form.from} onChange={(v) => setForm({ ...form, from: v })} />
          <StationSelect id="p-to" label="To" value={form.to} onChange={(v) => setForm({ ...form, to: v })} />
          <button className="btn" type="submit">Find route</button>
        </form>
        <div className="card">
          {!result ? <p className="muted">Choose two different stations to see a route.</p> : (
            <>
              <div className="line"><h2>Route</h2><span><span className="lbl">Stops</span> <strong>{result.stops}</strong> · <span className="lbl">Fare</span> <strong>₹{result.perPassenger}</strong></span></div>
              {result.segments.map((seg, i) => (
                <div key={i} className="segment">
                  <span className="line-chip" style={{ background: seg.line.color }}>{seg.line.name}</span>
                  <ol className="timeline">
                    {seg.stations.map((s, j) => <li key={s} className={j === 0 || j === seg.stations.length - 1 ? 'end' : ''}>{s}</li>)}
                  </ol>
                  {i < result.segments.length - 1 && <p className="muted small">Change trains here.</p>}
                </div>
              ))}
              <button className="btn" onClick={book}>Book this trip</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}