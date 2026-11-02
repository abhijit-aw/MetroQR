import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { quote } from '../data/metro';
import PageHeader from '../components/PageHeader.jsx';
import StationSelect from '../components/StationSelect.jsx';

export default function Book() {
  const navigate = useNavigate();
  const { booking, setBooking } = useBooking();
  const [error, setError] = useState('');
  const q = quote(booking);
  const pax = booking.passengers;

  function next() {
    if (!q) { setError('Choose two different stations.'); return; }
    navigate('/fare');
  }

  function swap() {
    setBooking({ from: booking.to, to: booking.from });
  }

  return (
    <div className="bk">
      <PageHeader step={1} title="Book Ticket" sub="Pick your stations, we'll work out the fare." />

      <main className="bk-pull">
        <div className="bk-grid">
          <section className="bk-card bk-form" aria-label="Journey details">
            <div className="bk-route">
              <div className="bk-rail" aria-hidden="true"><i /><b /><i className="end" /></div>
              <div className="bk-stations">
                <StationSelect id="b-from" label="From" value={booking.from} onChange={(v) => setBooking({ from: v })} />
                <StationSelect id="b-to" label="To" value={booking.to} onChange={(v) => setBooking({ to: v })} />
              </div>
              <button type="button" className="bk-swap" onClick={swap} aria-label="Swap stations">⇅</button>
            </div>

            <div className="bk-two">
              <div>
                <span className="bk-lbl">Date</span>
                <div className="bk-fld">{new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</div>
              </div>
              <div>
                <span className="bk-lbl">Passengers</span>
                <div className="bk-qty">
                  <span>{pax} passenger{pax > 1 ? 's' : ''}</span>
                  <span>
                    <button type="button" aria-label="Fewer passengers" disabled={pax <= 1} onClick={() => setBooking({ passengers: pax - 1 })}>−</button>
                    <button type="button" aria-label="More passengers" disabled={pax >= 6} onClick={() => setBooking({ passengers: pax + 1 })}>+</button>
                  </span>
                </div>
              </div>
            </div>

            <span className="bk-lbl">Journey type</span>
            <div className="bk-seg">
              {[['single', 'Single Journey'], ['return', 'Return Journey']].map(([v, l]) => (
                <button key={v} type="button" className={booking.journey === v ? 'on' : ''} aria-pressed={booking.journey === v} onClick={() => setBooking({ journey: v })}>{l}</button>
              ))}
            </div>
          </section>

          <aside className="bk-card bk-ticket" aria-label="Summary">
            {q ? (
              <>
                <div className="bk-ticket-top">
                  <small>Your trip</small>
                  <div className="bk-ft"><span>{booking.from}</span><em>→</em><span>{booking.to}</span></div>
                </div>
                <div className="bk-tear" />
                <div className="bk-ticket-body">
                  <div className="bk-stats">
                    <div><b>{q.stops}</b><span>Stops</span></div>
                    <div><b>{pax}</b><span>Passenger{pax > 1 ? 's' : ''}</span></div>
                    <div><b>{booking.journey === 'return' ? 'Return' : 'Single'}</b><span>Journey</span></div>
                  </div>
                  <div className="bk-total"><span className="bk-lbl">Total</span><strong>₹{q.total}</strong></div>
                  {error && <p className="bk-err" role="alert">{error}</p>}
                  <button className="bk-btn" onClick={next}>Continue to Fare →</button>
                </div>
              </>
            ) : (
              <div className="bk-ticket-body">
                <p className="bk-muted">Choose two different stations to see the fare.</p>
                {error && <p className="bk-err" role="alert">{error}</p>}
                <button className="bk-btn" onClick={next}>Continue to Fare →</button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}