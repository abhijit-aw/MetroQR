import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useWallet } from '../context/WalletContext.jsx';
import {
  getOrder, startPayment, submitOtp, resendOtp, respondUpi, respondBank, abortAttempt, cancelOrder,
  verifySignature, markFulfilled, formatCard, BANKS,
} from '../gateway/gatewayApi';
import PageHeader from '../components/PageHeader.jsx';

const METHODS = [['card', 'Card'], ['upi', 'UPI'], ['netbanking', 'Net Banking']];
const LINK_BTN = { background: 'none', border: 0, cursor: 'pointer', font: 'inherit' };

// Demo gateway checkout for Metro Card recharge. No real money is used.
// The balance is added ONLY here, ONLY once, and ONLY after the payment signature is verified.
export default function Pay() {
  const { id } = useParams();
  const { user } = useAuth();
  const { recharge } = useWallet();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState('card');
  const [f, setF] = useState({
    number: '', name: '', expiry: '', cvv: '',
    vpa: '', bank: BANKS[0], otp: '', pin: '', uid: '', pw: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const credited = useRef(false); // stops React StrictMode from running the credit twice

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => { getOrder(id).then(setOrder); }, [id]);

  // Payment finished -> verify signature -> add money once -> go back to Metro Card
  useEffect(() => {
    if (!order || order.status !== 'paid' || credited.current) return;
    credited.current = true;
    (async () => {
      const genuine = await verifySignature(order.id, order.paymentId, order.signature);
      if (!genuine || order.userId !== user.id) { setError('Payment could not be verified. No money was added.'); return; }
      if (!order.fulfilledRef) {            // never credit the same order twice, even after a refresh
        recharge(order.amount);
        markFulfilled(order.id, 'recharge');
      }
      navigate('/card', { replace: true, state: { added: order.amount } });
    })();
  }, [order]); // eslint-disable-line react-hooks/exhaustive-deps

  async function run(fn) {
    if (busy) return;
    setBusy(true); setError('');
    const res = await fn();
    if (res.order) setOrder(res.order);
    if (!res.ok) setError(res.error.description);
    setBusy(false);
  }

  if (!order) {
    return (
      <>
        <PageHeader hero title="Pay securely" sub="Loading checkout…" />
        <div className="bk-pull narrow"><div className="card"><p className="muted">Loading checkout…</p></div></div>
      </>
    );
  }

  if (order.status === 'paid') {
    return (
      <>
        <PageHeader hero title="Payment received" sub="Thank you." />
        <div className="bk-pull narrow">
          <div className="card"><h2>Payment received</h2><p className="muted">{error || 'Adding money to your Metro Card…'}</p></div>
        </div>
      </>
    );
  }

  const closed = ['expired', 'cancelled', 'failed'].includes(order.status);
  const pending = order.attempts.find((a) => a.status === 'pending');
  const lastFailed = [...order.attempts].reverse().find((a) => a.status === 'failed');

  if (closed) {
    return (
      <>
        <PageHeader hero title="Payment" sub="This payment session has ended." />
        <div className="bk-pull narrow">
          <div className="card stack">
            {lastFailed && <p className="error" role="alert">{lastFailed.error.description}</p>}
            <p className="muted">No money was added to your Metro Card.</p>
            <Link to="/card" className="btn">Back to Metro Card</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader hero title="Pay securely" sub={`Recharge Metro Card with ₹${order.amount} (demo gateway).`} />
      <div className="bk-pull narrow">
        <div className="card stack">
          {/* <span className="demo-tag">Demo payment · no real money is used</span> */}

          {!pending && (
            <>
              <div className="row tabs" role="tablist" aria-label="Payment method">
                {METHODS.map(([k, label]) => (
                  <button key={k} type="button" role="tab" aria-selected={method === k}
                          className={`pill ${method === k ? 'on' : ''}`} onClick={() => { setMethod(k); setError(''); }}>{label}</button>
                ))}
              </div>

              {lastFailed && !error && <p className="error" role="alert">{lastFailed.error.description} Try again.</p>}

              <form className="stack" onSubmit={(e) => {
                e.preventDefault();
                run(() => startPayment(order.id, {
                  method,
                  card: { number: f.number, name: f.name, expiry: f.expiry, cvv: f.cvv },
                  vpa: f.vpa, bank: f.bank,
                }));
              }}>
                {method === 'card' && (
                  <>
                    <label className="field"><span className="lbl">Card number</span>
                      <input className="fld" inputMode="numeric" autoComplete="off" value={f.number} onChange={(e) => setF({ ...f, number: formatCard(e.target.value) })} /></label>
                    <label className="field"><span className="lbl">Name on card</span><input className="fld" value={f.name} onChange={set('name')} /></label>
                    <div className="grid cols-2">
                      <label className="field"><span className="lbl">Expiry (MM/YY)</span><input className="fld" value={f.expiry} onChange={set('expiry')} /></label>
                      <label className="field"><span className="lbl">CVV</span><input className="fld" type="password" inputMode="numeric" autoComplete="off" value={f.cvv} onChange={set('cvv')} /></label>
                    </div>
                  </>
                )}
                {method === 'upi' && (
                  <label className="field"><span className="lbl">UPI ID</span>
                    <input className="fld" placeholder="name@bank" value={f.vpa} onChange={set('vpa')} /></label>
                )}
                {method === 'netbanking' && (
                  <label className="field"><span className="lbl">Bank</span>
                    <select className="fld" value={f.bank} onChange={set('bank')}>{BANKS.map((b) => <option key={b}>{b}</option>)}</select></label>
                )}
                {error && <p className="error" role="alert">{error}</p>}
                <button className="btn block" type="submit" disabled={busy}>{busy ? 'Please wait…' : `Pay ₹${order.amount}`}</button>
              </form>
            </>
          )}

          {pending?.stage === 'otp' && (
            <form className="stack" onSubmit={(e) => { e.preventDefault(); run(() => submitOtp(order.id, f.otp || pending.demoOtp)); }}>
              <h2>Enter OTP</h2>
              <p className="muted small">Demo OTP is already filled in. Just press the button.</p>
              <input className="fld" inputMode="numeric" autoComplete="one-time-code" value={f.otp || pending.demoOtp} onChange={set('otp')} aria-label="OTP" />
              {error && <p className="error" role="alert">{error}</p>}
              <button className="btn block" type="submit" disabled={busy}>{busy ? 'Verifying…' : 'Verify and pay'}</button>
              <button className="link-center" style={LINK_BTN} type="button" disabled={busy} onClick={() => run(() => resendOtp(order.id))}>Resend OTP</button>
            </form>
          )}

          {pending?.stage === 'upi' && (
            <form className="stack" onSubmit={(e) => { e.preventDefault(); run(() => respondUpi(order.id, { action: 'approve', pin: f.pin })); }}>
              <h2>Approve in your UPI app</h2>
              <p className="muted small">Request sent to {pending.meta.vpa}. Enter your UPI PIN (any 4 or 6 digits in demo).</p>
              <input className="fld" type="password" inputMode="numeric" autoComplete="off" value={f.pin} onChange={set('pin')} aria-label="UPI PIN" />
              {error && <p className="error" role="alert">{error}</p>}
              <button className="btn block" type="submit" disabled={busy}>{busy ? 'Processing…' : `Approve ₹${order.amount}`}</button>
              <button className="link-center" style={LINK_BTN} type="button" disabled={busy} onClick={() => run(() => respondUpi(order.id, { action: 'decline' }))}>Decline</button>
            </form>
          )}

          {pending?.stage === 'bank' && (
            <form className="stack" onSubmit={(e) => { e.preventDefault(); run(() => respondBank(order.id, { action: 'pay', userId: f.uid, password: f.pw })); }}>
              <h2>{pending.meta.bank} login</h2>
              <label className="field"><span className="lbl">User ID</span><input className="fld" value={f.uid} onChange={set('uid')} /></label>
              <label className="field"><span className="lbl">Password</span><input className="fld" type="password" value={f.pw} onChange={set('pw')} /></label>
              {error && <p className="error" role="alert">{error}</p>}
              <button className="btn block" type="submit" disabled={busy}>{busy ? 'Processing…' : 'Login and pay'}</button>
              <button className="link-center" style={LINK_BTN} type="button" disabled={busy} onClick={() => run(() => respondBank(order.id, { action: 'cancel' }))}>Cancel at bank</button>
            </form>
          )}

          {pending && (
            <button className="link-center" style={LINK_BTN} type="button" disabled={busy} onClick={() => run(() => abortAttempt(order.id))}>Choose another method</button>
          )}
          <button className="link-center" style={LINK_BTN} type="button" disabled={busy}
                  onClick={async () => { await cancelOrder(order.id); navigate('/card'); }}>Cancel payment</button>
        </div>
      </div>
    </>
  );
}