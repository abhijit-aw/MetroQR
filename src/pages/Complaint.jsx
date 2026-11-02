import { useState } from 'react';
import { Link } from 'react-router-dom';
import { STATIONS } from '../data/metro';
import '../components/complaint.css';

const CATEGORIES = [
  ['Ticket / QR', '🎫'], ['Payment', '💳'], ['Metro Card', '🪪'], ['Station', '🚉'],
  ['Train', '🚇'], ['Staff', '🧑‍✈️'], ['Other', '✏️'],
];
const MAX = 500;
const EMPTY = { category: 'Payment', urgency: 'Normal', name: '', mobile: '', station: '', ticket: '', text: '' };

const { VITE_EMAILJS_SERVICE_ID: SERVICE, VITE_EMAILJS_TEMPLATE_ID: TEMPLATE, VITE_EMAILJS_PUBLIC_KEY: KEY } = import.meta.env;
const LIVE = Boolean(SERVICE && TEMPLATE && KEY); // false = demo mode, nothing is sent

const makeRef = () => `CMP-${Math.floor(10000 + Math.random() * 90000)}`;

async function sendMail(params) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: SERVICE, template_id: TEMPLATE, user_id: KEY, template_params: params }),
  });
  if (!res.ok) throw new Error(await res.text());
}

function check(f) {
  if (f.name.trim().length < 2) return { field: 'name', msg: 'Enter your name.' };
  if (!/^\d{10}$/.test(f.mobile)) return { field: 'mobile', msg: 'Enter a 10-digit mobile number.' };
  if (f.text.trim().length < 10) return { field: 'text', msg: 'Describe the problem in at least 10 characters.' };
  return null;
}

export default function Complaint() {
  const [f, setF] = useState(EMPTY);
  const [error, setError] = useState(null); // { field, msg }
  const [sending, setSending] = useState(false);
  const [ref, setRef] = useState('');

  const set = (key, value) => {
    setF((p) => ({ ...p, [key]: value }));
    setError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const problem = check(f);
    if (problem) return setError(problem);

    const id = makeRef();
    setSending(true);
    try {
      if (LIVE) {
        await sendMail({
          ref: id,
          subject: `${f.urgency === 'Urgent' ? '[URGENT] ' : ''}Metro complaint ${id} - ${f.category}`,
          urgency: f.urgency,
          category: f.category,
          name: f.name.trim(),
          mobile: f.mobile,
          station: f.station || 'Not given',
          ticket: f.ticket.trim() || 'Not given',
          message: f.text.trim(),
          time: new Date().toLocaleString('en-IN'),
        });
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
      setRef(id);
    } catch {
      setError({ field: 'send', msg: "Couldn't send your complaint. Check your internet and try again." });
    } finally {
      setSending(false);
    }
  };

  const reset = () => { setF(EMPTY); setError(null); setRef(''); };
  const bad = (k) => (error?.field === k ? 'bad' : '');
  const done = Boolean(ref);

  return (
    <div className="cp-page">
     <section className="cp-hero">
  <div className="cp-hero-in">
    <Link to="/services" className="cp-back">← Back to Services</Link>
    <h1>Complaint</h1>
    <p>Something went wrong? Let us know and we will look into it.</p>
  </div>
</section>

      <div className="cp-layout">
        <div className="cp-card">
          {!done ? (
            <form className="cp-form" onSubmit={submit} noValidate>
              <div className="cp-top">
                {/* <span className={`cp-badge ${LIVE ? '' : 'demo'}`}>
                  {LIVE ? '✉️ Sent straight to our team' : 'Demo mode · nothing is sent'}
                </span> */}
                <div className="cp-seg" role="group" aria-label="Priority">
                  {['Normal', 'Urgent'].map((u) => (
                    <button type="button" key={u} aria-pressed={f.urgency === u}
                      className={`${f.urgency === u ? 'on' : ''} ${u === 'Urgent' ? 'u' : ''}`}
                      onClick={() => set('urgency', u)}>{u}</button>
                  ))}
                </div>
              </div>

              <div>
                <span className="cp-lbl">What is it about?</span>
                <div className="cp-tiles">
                  {CATEGORIES.map(([c, icon]) => (
                    <button type="button" key={c} aria-pressed={f.category === c}
                      className={`cp-tile ${f.category === c ? 'on' : ''}`} onClick={() => set('category', c)}>
                      <span aria-hidden="true">{icon}</span>{c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cp-two">
                <label>
                  <span className="cp-lbl">Your name</span>
                  <div className="cp-f"><i aria-hidden="true">👤</i>
                    <input className={bad('name')} placeholder="Full name" value={f.name} onChange={(e) => set('name', e.target.value)} />
                  </div>
                </label>
                <label>
                  <span className="cp-lbl">Mobile number</span>
                  <div className="cp-f"><i aria-hidden="true">📱</i>
                    <input className={bad('mobile')} placeholder="10-digit mobile" inputMode="numeric" maxLength={10}
                      value={f.mobile} onChange={(e) => set('mobile', e.target.value.replace(/\D/g, ''))} />
                  </div>
                </label>
              </div>

              <div className="cp-two">
                <label>
                  <span className="cp-lbl">Station (optional)</span>
                  <div className="cp-f"><i aria-hidden="true">📍</i>
                    <select value={f.station} onChange={(e) => set('station', e.target.value)}>
                      <option value="">Choose a station</option>
                      {STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </label>
                <label>
                  <span className="cp-lbl">Ticket ID (optional)</span>
                  <div className="cp-f"><i aria-hidden="true">🧾</i>
                    <input placeholder="e.g. T-12345" value={f.ticket} onChange={(e) => set('ticket', e.target.value)} />
                  </div>
                </label>
              </div>

              <label>
                <span className="cp-lbl">Describe the problem</span>
                <textarea className={bad('text')} placeholder="Tell us what happened" maxLength={MAX}
                  value={f.text} onChange={(e) => set('text', e.target.value)} />
                <div className="cp-bar"><b style={{ width: `${(f.text.length / MAX) * 100}%` }} /></div>
                <span className="cp-foot">
                  <span>Please do not share card numbers or passwords.</span>
                  <span>{f.text.length} / {MAX}</span>
                </span>
              </label>

              {error && <p className="cp-error" role="alert">{error.msg}</p>}

              <button className="cp-go" type="submit" disabled={sending}>
                {sending ? <><span className="cp-spin" />Sending…</> : <>Submit complaint →</>}
              </button>
            </form>
          ) : (
            <div className="cp-done">
              <div className="cp-tick" aria-hidden="true">✓</div>
              <h2>{LIVE ? 'Complaint sent' : 'Complaint noted'}</h2>
              <p className="cp-muted">
                {LIVE ? 'We received it. Keep this reference number to follow up.' : 'Demo mode: nothing was sent. This is how it will look.'}
              </p>
              <div className="cp-big">{ref}</div>
              <button className="cp-ghost" onClick={reset}>File another complaint</button>
            </div>
          )}
        </div>

        <aside className="cp-side">
          <div className="cp-card">
            <h3>What happens next</h3>
            <ol className="cp-steps">
              <li><span className={done ? 'ok' : ''}>{done ? '✓' : 1}</span><div><strong>Submit</strong><p>Tell us what went wrong.</p></div></li>
              <li><span>2</span><div><strong>We review</strong><p>Your complaint is noted with a reference number.</p></div></li>
              <li><span>3</span><div><strong>Follow up</strong><p>Use the reference number to check the status.</p></div></li>
            </ol>
          </div>
          <div className="cp-ref">
            <small>Your reference number</small>
            <strong>{ref || 'CMP-48213'}</strong>
            <p>{done ? 'Keep it to follow up.' : 'You will get this number after submitting. Keep it to follow up.'}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}