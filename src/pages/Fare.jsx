import { Link, Navigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { quote } from '../data/metro';
import PageHeader from '../components/PageHeader.jsx';

export default function Fare() {
  const { booking } = useBooking();
  const q = quote(booking);
  if (!q) return <Navigate to="/book" replace />;

  return (
    <>
      <PageHeader step={2} title="Fare summary" sub="Check your fare before paying." />
      <div className="bk-pull">
        <div className="grid cols-2 top">
          <div className="card">
            <ol className="timeline">
              {q.path.map((s, i) => (
                <li key={s + i} className={i === 0 || i === q.path.length - 1 ? 'end' : ''}>{s}</li>
              ))}
            </ol>
            <dl className="details inline">
              <div><dt>Stops</dt><dd>{q.stops}</dd></div>
              <div><dt>Line</dt><dd>{q.segments.map((s) => s.line.name.replace(' Line', '')).join(' → ')}</dd></div>
              <div><dt>Passengers</dt><dd>{booking.passengers}</dd></div>
            </dl>
          </div>
          <div className="card">
            <div className="line"><span>Fare per passenger (demo)</span><span>₹{q.perPassenger}</span></div>
            <div className="line"><span>Passengers</span><span>× {booking.passengers}</span></div>
            {booking.journey === 'return' && <div className="line"><span>Return journey</span><span>× 2</span></div>}
            <div className="line total"><span className="lbl">Total</span><strong>₹{q.total}</strong></div>
            <Link to="/payment" className="btn block">Continue to payment</Link>
            <Link to="/book" className="link-center">Change route</Link>
          </div>
        </div>
      </div>
    </>
  );
}