import { Link, Navigate, useParams } from 'react-router-dom';
import { useTickets } from '../context/TicketContext.jsx';

export default function Success() {
  const { id } = useParams();
  const { getTicket } = useTickets();
  const t = getTicket(id);
  if (!t) return <Navigate to="/tickets" replace />;
  return (
    <div className="card narrow center-text">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0B5A4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" /></svg>
      <h1>Payment successful</h1>
      <p className="muted">Demo payment · no real money was charged</p>
      <div className="line"><span className="lbl">Transaction ID</span><strong>{t.txnId}</strong></div>
      <div className="line"><span className="lbl">Amount</span><strong>₹{t.fare}</strong></div>
      <Link to={`/ticket/${t.id}`} className="btn block">View ticket</Link>
      <Link to="/" className="link-center">Back to Home</Link>
    </div>
  );
}