import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import useNow from '../hooks/useNow';
import { fmtTime, getStatus } from '../utils/time';
import QRTicket from '../components/QRTicket.jsx';
import PageHeader from '../components/PageHeader.jsx';
 
const TABS = [['active', 'Active'], ['used', 'Used'], ['expired', 'Expired']];
const LABEL = { active: 'Active', used: 'Used', expired: 'Expired' };
 
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg>
);
 
export default function MyTickets() {
  const navigate = useNavigate();
  const { tickets } = useTickets();
  const { setBooking } = useBooking();
  const now = useNow(5000);
  const [chosen, setChosen] = useState(null);
 
  // status of each ticket (active / used / expired), newest first
  const list = [...tickets]
    .sort((a, b) => b.bookedAt - a.bookedAt)
    .map((tk) => ({ tk, status: getStatus(tk, now) }));
 
  const counts = { active: 0, used: 0, expired: 0 };
  list.forEach(({ status }) => { if (counts[status] !== undefined) counts[status] += 1; });
 
  // first time: open the first tab that has tickets
  const tab = chosen ?? (counts.active ? 'active' : counts.used ? 'used' : counts.expired ? 'expired' : 'active');
  const shown = list.filter((x) => x.status === tab);
 
  function bookAgain(tk) {
    setBooking({ from: tk.from, to: tk.to, passengers: tk.passengers, journey: tk.journey || 'single' });
    navigate('/book');
  }
 
  return (
    <div className="bk mt">
      <PageHeader hero title="My Tickets" sub="All your journeys in one place.">
        <div className="mt-row">
          <div className="mt-seg" role="tablist" aria-label="Ticket status">
            {TABS.map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k}
                      className={tab === k ? 'on' : ''} onClick={() => setChosen(k)}>{label}</button>
            ))}
          </div>
          <span className={`mt-cnt ${tab}`}>{counts[tab]} {tab}</span>
        </div>
      </PageHeader>
 
      <main className="mt-body">
        <div className="mt-sum">
          <h2>{LABEL[tab]} tickets</h2>
          <span>{shown.length} {shown.length === 1 ? 'ticket' : 'tickets'}</span>
        </div>
 
        {shown.length === 0 ? (
          <div className="mt-empty">
            <h3>No {tab} tickets</h3>
            <p>Your {tab} tickets will show up here.</p>
            <Link to="/book" className="mt-btn">Book a ticket</Link>
          </div>
        ) : (
          <div className="mt-grid">
            {shown.map(({ tk, status }) => (
              <article key={tk.id} className={`mt-tk ${status}`}>
                <div className="mt-main">
                  <div className="mt-tp">
                    <span className="mt-badge"><i />{LABEL[status]}</span>
                    <span className="mt-tm"><ClockIcon />{fmtTime(tk.bookedAt)}</span>
                  </div>
 
                  <div className="mt-rt">
                    <div><small>From</small><b>{tk.from}</b></div>
                    <svg className="mt-ln" viewBox="0 0 120 20" preserveAspectRatio="none" fill="none" aria-hidden="true">
                      <path d="M6 10H114" stroke="currentColor" strokeOpacity=".5" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
                      <circle cx="6" cy="10" r="5" fill="#fff" stroke="currentColor" strokeWidth="3" />
                      <circle cx="114" cy="10" r="5" fill="currentColor" />
                    </svg>
                    <div className="mt-to"><small>To</small><b>{tk.to}</b></div>
                  </div>
 
                  <div className="mt-meta">
                    <span className="mt-chip"><UserIcon />{tk.passengers} passenger{tk.passengers > 1 ? 's' : ''}</span>
                    <Link to={`/ticket/${tk.id}`} className="mt-view">View details →</Link>
                    <strong>₹{tk.fare}</strong>
                  </div>
                </div>
 
                <div className="mt-tear"><i /><i className="b" /></div>
 
                <div className="mt-stub">
                  <div className="mt-qrw">
                    <QRTicket ticket={tk} size={84} dim={status !== 'active'} />
                    {status !== 'active' && <span className="mt-stamp">{LABEL[status]}</span>}
                  </div>
                  {status === 'active'
                    ? <Link to={`/ticket/${tk.id}`} className="mt-btn">Show QR</Link>
                    : <button type="button" className="mt-btn" onClick={() => bookAgain(tk)}>Book again</button>}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}