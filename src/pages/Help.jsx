import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

const FAQ = [
  ['How do I book a ticket?', 'Go to Book Ticket, pick your stations and pay. Your QR code appears in My Tickets.'],
  ['How long is a ticket valid?', 'A ticket is valid for 1 hour after booking. After that it shows as Expired and you need to book a new one.'],
  ['Can I get a refund?', '[Add refund policy here.]'],
  ['How do I recharge my Metro Card?', 'Open Metro Card, pick an amount and tap Recharge. This is a demo, so no real money moves.'],
];

export default function Help() {
  return (
    <>
      <PageHeader title="Help & Support" sub="Answers to common questions." />
      <div className="grid cols-2 top">
        <div className="card">
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
        <div className="stack">
          <Link to="/info/customer-care" className="card"><strong>Customer Care</strong><div className="muted">[phone number]</div></Link>
          <Link to="/info/complaint" className="card"><strong>Suggestion / Complaint</strong><div className="muted">[email address]</div></Link>
        </div>
      </div>
    </>
  );
}