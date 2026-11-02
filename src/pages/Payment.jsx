import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { useWallet } from '../context/WalletContext.jsx';
import { quote } from '../data/metro';
import PageHeader from '../components/PageHeader.jsx';

const METHODS = [['upi', 'UPI'], ['card', 'Debit/Credit Card'], ['bank', 'Net Banking'], ['wallet', 'Metro Card']];

// DEMO payment: nothing is sent anywhere and card details are never saved.
export default function Payment() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const { addTicket } = useTickets();
  const { balance, spend } = useWallet();
  const [method, setMethod] = useState('upi');
  const [f, setF] = useState({ upi: 'demo@upi', cardNo: '4242 4242 4242 4242', name: 'Demo User', expiry: '12/30', cvv: '123', bank: 'Demo Bank A' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const q = quote(booking);
  if (!q) return <Navigate to="/book" replace />;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  function validate() {
    if (method === 'upi' && !/^[\w.-]{2,}@[a-z]{2,}$/i.test(f.upi.trim())) return 'Enter a valid UPI ID, like demo@upi.';
    if (method === 'card') {
      if (f.cardNo.replace(/\s/g, '').length !== 16) return 'Card number must have 16 digits.';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.expiry)) return 'Enter expiry as MM/YY.';
      if (!/^\d{3}$/.test(f.cvv)) return 'CVV must be 3 digits.';
    }
    if (method === 'wallet' && balance < q.total) return `Not enough balance (₹${balance}). Recharge your Metro Card or pick another method.`;
    return '';
  }

  async function pay(e) {
    e.preventDefault();
    if (busy) return;
    const msg = validate();
    if (msg) { setError(msg); return; }
    setError(''); setBusy(true);
    await new Promise((r) => setTimeout(r, 1200)); // pretend to talk to a bank

    // Metro Card payment: take the money from the card first. No money = no ticket.
    if (method === 'wallet') {
      const ok = spend(q.total, `Ticket ${booking.from} → ${booking.to}`);
      if (!ok) {
        setBusy(false);
        setError('Not enough balance. Recharge your Metro Card or pick another method.');
        return;
      }
    }

    const ticket = addTicket({ from: booking.from, to: booking.to, passengers: booking.passengers, journey: booking.journey, fare: q.total, method });
    navigate(`/success/${ticket.id}`, { replace: true });
  }

  return (
    <>
      <PageHeader step={3} title="Payment" sub="Choose how to pay." />
      <div className="bk-pull">
        <form className="grid cols-2 top" onSubmit={pay}>
          <div className="card">
            <div className="row tabs" role="tablist" aria-label="Payment method">
              {METHODS.map(([id, label]) => (
                <button key={id} type="button" role="tab" aria-selected={method === id} className={`pill ${method === id ? 'on' : ''}`} onClick={() => { setMethod(id); setError(''); }}>{label}</button>
              ))}
            </div>
            <div className="stack" role="tabpanel">
              {method === 'upi' && <label className="field"><span className="lbl">UPI ID</span><input className="fld" value={f.upi} onChange={set('upi')} /></label>}
              {method === 'card' && (
                <>
                  <label className="field"><span className="lbl">Card number</span><input className="fld" inputMode="numeric" autoComplete="off" value={f.cardNo} onChange={set('cardNo')} /></label>
                  <label className="field"><span className="lbl">Name on card</span><input className="fld" value={f.name} onChange={set('name')} /></label>
                  <div className="grid cols-2">
                    <label className="field"><span className="lbl">Expiry</span><input className="fld" value={f.expiry} onChange={set('expiry')} /></label>
                    <label className="field"><span className="lbl">CVV</span><input className="fld" type="password" inputMode="numeric" autoComplete="off" value={f.cvv} onChange={set('cvv')} /></label>
                  </div>
                </>
              )}
              {method === 'bank' && (
                <label className="field"><span className="lbl">Bank</span>
                  <select className="fld" value={f.bank} onChange={set('bank')}>
                    <option>Demo Bank A</option><option>Demo Bank B</option><option>Demo Bank C</option>
                  </select>
                </label>
              )}
              {method === 'wallet' && <div className="balance"><span className="lbl">Metro Card balance</span><strong>₹{balance}</strong></div>}
            </div>
          </div>
          <div className="card">
            <span className="demo-tag">Payment mode </span>
            <h2>Summary</h2>
            <div className="line"><span>{booking.from} → {booking.to}</span><span>{q.stops} stops</span></div>
            <div className="line"><span>{booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}</span><span>₹{q.total}</span></div>
            <div className="line total"><span className="lbl">Total</span><strong>₹{q.total}</strong></div>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="btn block" type="submit" disabled={busy}>{busy ? 'Processing…' : `Pay ₹${q.total} (demo)`}</button>
          </div>
        </form>
      </div>
    </>
  );
}