import { Link, useParams } from 'react-router-dom';
import { useTickets } from '../context/TicketContext.jsx';
import useNow from '../hooks/useNow';
import { fmtTime, getStatus } from '../utils/time';
import QRTicket from '../components/QRTicket.jsx';
import Countdown from '../components/Countdown.jsx';

export default function Ticket() {
  const { id } = useParams();
  const { getTicket, markUsed } = useTickets();
  const now = useNow();
  const t = getTicket(id);
  if (!t) return <div className="card"><h1>Ticket not found</h1><Link to="/tickets" className="btn">My Tickets</Link></div>;
  const status = getStatus(t, now);

  return (
    <div className="narrow">
      <Link to="/tickets" className="back">← My tickets</Link>
      <div className="ticket-head"><div><small>From</small><strong>{t.from}</strong></div><span aria-hidden="true">→</span><div className="right"><small>To</small><strong>{t.to}</strong></div></div>
      <div className="card ticket-body">
        <QRTicket ticket={t} size={220} dim={status !== 'active'} />
        <Countdown ticket={t} />
        <dl className="details inline">
          <div><dt>Ticket ID</dt><dd>{t.id}</dd></div>
          <div><dt>Passengers</dt><dd>{t.passengers}</dd></div>
          <div><dt>Valid till</dt><dd>{fmtTime(t.validTill)}</dd></div>
          <div><dt>Paid</dt><dd>₹{t.fare}</dd></div>
        </dl>
        {status === 'active'
          ? <button className="btn outline" onClick={() => markUsed(t.id)}>Simulate gate scan (demo)</button>
          : <Link to="/book" className="btn">Book a new ticket</Link>}
      </div>
    </div>
  );
}