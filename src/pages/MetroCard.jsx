import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useWallet } from '../context/WalletContext.jsx';
import { createOrder } from '../gateway/gatewayApi';
import { fmtTime } from '../utils/time';
import PageHeader from '../components/PageHeader.jsx';
import './metrocard.css';

// The card picture lives in public/images/. To use your own photo, put it there and change this name.
const CARD_IMAGE = 'metro-card.png';

const AMOUNTS = [100, 200, 500, 1000];
const MIN = 10, MAX = 5000; // demo limits per recharge, change them as you like

// Recharge goes through the payment gateway. The balance only changes after the payment is verified.
export default function MetroCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const added = useLocation().state?.added; // set by the payment return page
  const { balance, tx } = useWallet();
  const [preset, setPreset] = useState(200);
  const [custom, setCustom] = useState('');
  const [busy, setBusy] = useState(false);
  const [photoOk, setPhotoOk] = useState(true); // false if the picture file is missing

  const usingCustom = custom !== '';
  const amount = usingCustom ? Number(custom) : preset;
  const error = usingCustom && (amount < MIN || amount > MAX) ? `Enter an amount between ₹${MIN} and ₹${MAX}.` : '';
  const canPay = !error && amount >= MIN && amount <= MAX;

  function pick(a) { setPreset(a); setCustom(''); }
  function onCustom(e) { setCustom(e.target.value.replace(/\D/g, '').slice(0, 5)); } // digits only

  async function submit(e) {
    e.preventDefault();
    if (!canPay || busy) return;
    setBusy(true);
    const order = await createOrder({ amount, purpose: 'recharge', userId: user.id, notes: {} });
    navigate(`/pay/${order.id}`); // pay on the gateway page; the balance is credited after the payment is verified
  }

  return (
    <>
      <PageHeader title="Metro Card" sub="Check your balance and recharge." />
      <div className="grid cols-2 top">
        <div className="stack">
          {photoOk ? (
            <img className="card-photo" src={`${import.meta.env.BASE_URL}images/${CARD_IMAGE}`} alt="MetroQR prepaid metro card" onError={() => setPhotoOk(false)} />
          ) : (
            <div className="metro-card"><div className="mc-top"><strong>MetroQR Card</strong><span className="chip" /></div><div className="mc-no">•••• •••• •••• 1234</div><div><small>BALANCE</small><div className="mc-bal">₹{balance}</div></div></div>
          )}
          {photoOk && <div className="balance-bar"><span className="lbl">Balance</span><strong>₹{balance}</strong></div>}
        </div>

        <form className="card" onSubmit={submit}>
          <h2>Recharge</h2>
          <div className="row">
            {AMOUNTS.map((a) => (
              <button key={a} type="button" className={`pill ${!usingCustom && preset === a ? 'on' : ''}`} aria-pressed={!usingCustom && preset === a} onClick={() => pick(a)}>₹{a}</button>
            ))}
          </div>

          <label className="field custom" htmlFor="custom-amt">
            <span className="lbl">Or enter your own amount</span>
            <div className="rupee">
              <span aria-hidden="true">₹</span>
              <input id="custom-amt" className="fld" inputMode="numeric" autoComplete="off" placeholder="e.g. 350" value={custom} onChange={onCustom} aria-invalid={!!error} aria-describedby="custom-hint" />
            </div>
          </label>
          <p id="custom-hint" className={error ? 'error' : 'muted small'} role={error ? 'alert' : undefined}>
            {error || `Min ₹${MIN}, max ₹${MAX} per recharge (demo limits).`}
          </p>

          <button className="btn block" type="submit" disabled={!canPay || busy}>{busy ? 'Opening secure checkout…' : canPay ? `Pay ₹${amount} securely` : 'Enter a valid amount'}</button>
          {added && <p className="success-msg" role="status">₹{added} added to your Metro Card.</p>}

          <h2 className="gap-top">Recent</h2>
          {tx.length === 0 && <p className="muted">No transactions yet.</p>}
          {tx.slice(0, 6).map((t, i) => (
            <div className="line" key={i}><span>{t.label}<br /><small className="muted">{fmtTime(t.at)}</small></span><strong>{t.amount > 0 ? '+' : '−'}₹{Math.abs(t.amount)}</strong></div>
          ))}
        </form>
      </div>
    </>
  );
}