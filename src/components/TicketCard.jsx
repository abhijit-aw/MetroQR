import { Link } from 'react-router-dom';
import useNow from '../hooks/useNow';
import { fmtTime, getStatus } from '../utils/time';
import StatusBadge from './StatusBadge.jsx';

export default function TicketCard({ ticket }) {
  const now = useNow(10000);
  const status = getStatus(ticket, now);
  const minsLeft = Math.max(1, Math.ceil((ticket.validTill - now) / 60000));
  return (
    <Link to={`/ticket/${ticket.id}`} className="card ticket-card">
      <div>
        <strong>{ticket.from} → {ticket.to}</strong>
        <div className="muted small">
          {ticket.passengers} passenger{ticket.passengers > 1 ? 's' : ''} · ₹{ticket.fare} · booked {fmtTime(ticket.bookedAt)}
          {status === 'active' && ` · expires in ${minsLeft} min`}
        </div>
      </div>
      <StatusBadge status={status} />
    </Link>
  );
}