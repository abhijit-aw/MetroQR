import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useWallet } from '../context/WalletContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { initials } from '../utils/initials.js';
import { getStatus } from '../utils/time.js';

/* Change a path here if one of your routes is different. */
const LINKS = {
  card: '/card',
  tickets: '/tickets',
  customerCare: '/help',
  contact: '/info/contact',
  faq: '/info/faq',
  penalty: '/info/penalty',
  feedback: '/info/feedback',
  privacy: '/info/privacy',
  emergency: '/info/emergency',
};

const CSS = `
.pf {
  --pf-blue: #1456c4;
  --pf-teal: #14877f;
  --pf-ink: var(--text, #101c33);
  --pf-surface: var(--card-bg, #fff);
  --pf-muted: #5b6b86;
  --pf-line: #e6ecf5;
  --pf-red: #b3261e;
  max-width: 920px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  color: var(--pf-ink);
}
.pf a { color: inherit; text-decoration: none; }

/* ---------- hero ---------- */
.pf-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 22px 24px;
  border-radius: 18px;
  color: #fff;
  background: linear-gradient(110deg, #0d47b8 0%, #1565c0 45%, #138a80 100%);
  box-shadow: 0 10px 28px rgba(13, 71, 184, .28);
}
.pf-avatar {
  width: 82px; height: 82px; flex: none;
  display: grid; place-items: center;
  border-radius: 50%;
  background: #fff;
  color: var(--pf-blue);
  font-size: 26px; font-weight: 800;
  border: 4px solid #8fe3ee;
  box-shadow: 0 0 0 3px #f1b97a inset;
}
.pf-who { flex: 1 1 200px; min-width: 0; }
.pf-who h1 { margin: 0; font-size: 24px; font-weight: 700; }
.pf-who p { margin: 2px 0 10px; font-size: 13px; opacity: .9; overflow-wrap: anywhere; }
.pf-edit {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; font-size: 12px; font-weight: 700;
  color: #fff !important;
  background: rgba(255,255,255,.18);
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 999px;
}
.pf-edit:hover { background: rgba(255,255,255,.28); }

.pf-stats { display: flex; gap: 10px; flex-wrap: wrap; }
.pf-stat {
  min-width: 104px; padding: 10px 14px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.3);
  border-radius: 12px;
}
.pf-stat strong { display: block; font-size: 20px; line-height: 1.2; }
.pf-stat span { font-size: 11px; font-weight: 600; opacity: .85; }

/* ---------- layout ---------- */
.pf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 14px;
  align-items: start;
}
.pf-top { margin-top: 16px; }

/* ---------- quick cards ---------- */
.pf-quick {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px;
  background: var(--pf-surface);
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(16, 28, 51, .07);
  transition: box-shadow .15s;
}
.pf-quick:hover { box-shadow: 0 4px 16px rgba(16, 28, 51, .13); }
.pf-quick-ico {
  width: 40px; height: 40px; flex: none;
  display: grid; place-items: center;
  color: #fff; border-radius: 11px;
  background: linear-gradient(135deg, #1565c0, #138a80);
}
.pf-quick-text { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.pf-quick-text b { font-size: 14px; }
.pf-quick-text small { font-size: 11px; font-weight: 600; color: var(--pf-muted); }

/* ---------- panels ---------- */
.pf-panel {
  padding: 16px 14px 10px;
  background: var(--pf-surface);
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(16, 28, 51, .07);
}
.pf-panel h2 { margin: 0 0 8px 4px; font-size: 16px; font-weight: 700; }
.pf-row {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 6px;
  border-radius: 10px;
}
.pf-row:hover { background: #f4f8fe; }
.pf-ico {
  width: 28px; height: 28px; flex: none;
  display: grid; place-items: center;
  color: var(--pf-blue);
  background: #e8f1fd;
  border-radius: 8px;
}
.pf-row-label { flex: 1; font-size: 12.5px; font-weight: 700; }
.pf-chev { color: #8a97ae; display: grid; }
.pf-quick .pf-chev { color: #6b7a93; }

/* ---------- logout ---------- */
.pf-logout {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 232px; max-width: 100%;
  margin: 20px auto 0; padding: 12px;
  font: inherit; font-size: 13px; font-weight: 700;
  color: var(--pf-red);
  background: var(--pf-surface);
  border: 1.5px solid var(--pf-red);
  border-radius: 10px;
  cursor: pointer;
}
.pf-logout:hover { background: #fdeceb; }

.pf a:focus-visible, .pf button:focus-visible {
  outline: 2px solid var(--pf-blue); outline-offset: 2px;
}

/* ---------- mobile ---------- */
@media (max-width: 720px) {
  .pf-grid { grid-template-columns: 1fr; }
  .pf-stats { width: 100%; }
  .pf-stat { flex: 1; min-width: 0; }
}

/* edit name inside the banner */
.pf-editform { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.pf-input { flex: 1 1 160px; min-width: 0; font: inherit; font-size: 15px; padding: 8px 12px; color: #fff;
  background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.5); border-radius: 10px; }
.pf-input:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
button.pf-edit { font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
`;

const Ic = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const Icons = {
  card: <Ic><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20" /></Ic>,
  ticket: <Ic><path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z" /><path d="M9 6v12" strokeDasharray="2 3" /></Ic>,
  headset: <Ic><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></Ic>,
  phone: <Ic><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Ic>,
  help: <Ic><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7" /><path d="M12 17h.01" /></Ic>,
  doc: <Ic><path d="M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2-1.5z" /><path d="M10 8h4M10 12h4" /></Ic>,
  chat: <Ic><path d="M4 5h16v11H9l-5 4z" /><path d="M12 8v4M12 14h.01" /></Ic>,
  shield: <Ic><path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></Ic>,
  alert: <Ic><path d="M6 20V11a6 6 0 0 1 12 0v9" /><path d="M4 20h16M12 3v2M3.5 7l1.5 1M20.5 7L19 8" /></Ic>,
  chev: <Ic size={16}><path d="M9 6l6 6-6 6" /></Ic>,
  edit: <Ic size={14}><path d="M4 20h4L19 9l-4-4L4 16z" /></Ic>,
  logout: <Ic size={16}><path d="M10 4H5v16h5" /><path d="M15 8l4 4-4 4M19 12H9" /></Ic>,
};

function Row({ to, icon, label }) {
  return (
    <Link to={to} className="pf-row">
      <span className="pf-ico">{Icons[icon]}</span>
      <span className="pf-row-label">{label}</span>
      <span className="pf-chev">{Icons.chev}</span>
    </Link>
  );
}

export default function Profile() {
  const { user, logout, updateName } = useAuth();
  const { balance } = useWallet();       // goes up on recharge, down on ticket purchase
  const { tickets } = useTickets();
  const navigate = useNavigate();

  // re-check ticket status every 30s so an expired ticket leaves the "active" count
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  if (!user) return <Navigate to="/login" state={{ from: '/profile' }} replace />;

  const active = tickets.filter((t) => getStatus(t, now) === 'active').length;
  const total = tickets.length;

  function startEdit() { setDraft(user.name); setEditing(true); }
  function saveName(e) {
    e.preventDefault();
    if (draft.trim()) { updateName(draft); setEditing(false); }
  }
  function doLogout() { logout(); navigate('/login', { replace: true }); }

  return (
    <div className="pf">
      <style>{CSS}</style>
      <section className="pf-hero">
        <div className="pf-avatar">{initials(user.name)}</div>
        <div className="pf-who">
          {editing ? (
            <form className="pf-editform" onSubmit={saveName}>
              <input className="pf-input" value={draft} onChange={(e) => setDraft(e.target.value)}
                     aria-label="Your name" autoFocus />
              <button className="pf-edit" type="submit">Save</button>
              <button className="pf-edit" type="button" onClick={() => setEditing(false)}>Cancel</button>
            </form>
          ) : (
            <>
              <h1>{user.name}</h1>
              <p>{user.identifier}</p>
              <button type="button" className="pf-edit" onClick={startEdit}>{Icons.edit} Edit profile</button>
            </>
          )}
        </div>
        <div className="pf-stats">
          <div className="pf-stat"><strong>₹{balance}</strong><span>Card balance</span></div>
          <div className="pf-stat"><strong>{active}</strong><span>Active tickets</span></div>
          <div className="pf-stat"><strong>{total}</strong><span>Total tickets</span></div>
        </div>
      </section>

      <div className="pf-grid">
        <Link to={LINKS.card} className="pf-quick">
          <span className="pf-quick-ico">{Icons.card}</span>
          <span className="pf-quick-text"><b>Metro Card</b><small>Balance ₹{balance} · Recharge</small></span>
          <span className="pf-chev">{Icons.chev}</span>
        </Link>
        <Link to={LINKS.tickets} className="pf-quick">
          <span className="pf-quick-ico">{Icons.ticket}</span>
          <span className="pf-quick-text"><b>My Tickets</b><small>{active} active · {total} total</small></span>
          <span className="pf-chev">{Icons.chev}</span>
        </Link>
      </div>

      <div className="pf-grid pf-top">
        <section className="pf-panel">
          <h2>Help &amp; Support</h2>
          <Row to={LINKS.customerCare} icon="headset" label="Customer Care" />
          <Row to={LINKS.contact} icon="phone" label="Contact Us" />
          <Row to={LINKS.faq} icon="help" label="FAQ's" />
          <Row to={LINKS.penalty} icon="doc" label="Penalty" />
        </section>
        <section className="pf-panel">
          <h2>More</h2>
          <Row to={LINKS.feedback} icon="chat" label="Suggestion / Appreciation / Complaint" />
          <Row to={LINKS.privacy} icon="shield" label="Privacy Policy" />
          <Row to={LINKS.emergency} icon="alert" label="Emergency Contacts" />
        </section>
      </div>

      <button type="button" className="pf-logout" onClick={doLogout}>{Icons.logout} Log out</button>
    </div>
  );
}