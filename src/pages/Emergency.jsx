import { Link } from 'react-router-dom';
import './emergency.css';

const tel = (n) => `tel:${n.replace(/[^\d+]/g, '')}`;

// National numbers that work from anywhere in India.
const NATIONAL = [
  ['112', 'All emergencies', 'Police, fire and ambulance'],
  ['100', 'Police', 'Crime, danger, lost items'],
  ['101', 'Fire brigade', 'Fire, smoke, gas leak'],
  ['108', 'Ambulance', 'Medical emergency'],
  ['1091', 'Women helpline', 'Safety and harassment'],
  ['1098', 'Child helpline', 'Lost or unsafe child'],
];

const METRO = [
  ['Customer support (toll-free)', '1800 270 5501'],
  ['One Pune Card support (lost or stolen card)', '022 4500 0800'],
  ['Pune Metro office', '020 2540 3355'],
];

const LOCAL = [
  ['District disaster helpline (toll-free)', '1077'],
  ['District disaster cell', '020 2612 3371'],
  ['Pune Municipal Corporation control room', '020 2550 6800'],
  ['Pimpri-Chinchwad Municipal Corporation', '020 6733 1111'],
  ['PMRDA disaster response force', '95452 82930'],
];

const STEPS = [
  ['Medical emergency', ['Call 108 or 112.', 'Tell the nearest metro staff or security.', 'Do not move a badly hurt person unless there is danger.', 'Give the station name and platform to the person on the phone.']],
  ['Fire or smoke', ['Stay low and move to the nearest exit sign.', 'Do not use the lifts.', 'Call 101 or 112 once you are safe.', 'Follow the instructions of the staff and announcements.']],
  ['Suspicious bag or person', ['Do not touch the bag.', 'Move away calmly and warn people nearby.', 'Tell the staff or call 112.']],
  ['Lost child or separated from family', ['Stay where you are and tell the staff.', 'Give a clear description and the station name.', 'Call 1098 (child helpline) if you cannot find help.']],
  ['Crowd rush', ['Move to the side and keep away from the platform edge.', 'Walk slowly and do not push.', 'Follow the staff and announcements.']],
  ['Someone falls on the track', ['Never climb down to help.', 'Alert the staff immediately and call 112.']],
];

export default function Emergency() {
  return (
    <>
      <Link to="/services" className="back">← Back to Services</Link>

      <section className="em-hero" aria-labelledby="em-title">
        <div>
          <h1 id="em-title">Emergency help</h1>
          <p>If you or someone near you is in danger, call 112 now. It works for police, fire and ambulance, from any phone in India.</p>
        </div>
        <a className="em-call" href="tel:112">Call 112</a>
      </section>

      <h2 className="sec">Emergency numbers</h2>
      <div className="em-grid">
        {NATIONAL.map(([n, name, sub]) => (
          <a key={n} href={tel(n)} className="em-tile" aria-label={`Call ${n}, ${name}`}>
            <span className="em-num">{n}</span><span className="em-name">{name}</span><span className="em-sub">{sub}</span>
          </a>
        ))}
      </div>

      <h2 className="sec">Pune Metro contacts</h2>
      <div className="card">
        <ul className="em-list">
          {METRO.map(([label, n]) => (
            <li key={label}><span>{label}</span><a href={tel(n)}>{n}</a></li>
          ))}
          <li><span>Email (general queries)</span><a href="mailto:customercare.pmrp@mahametro.org">customercare.pmrp@mahametro.org</a></li>
        </ul>
        <p className="muted small">Office: Pune Metro Bhavan, above District Court Metro Station, Nyaymurti Ranade Path, Shivajinagar, Pune 411005. These numbers come from public listings, so confirm them on punemetrorail.org.</p>
      </div>

      <h2 className="sec">What to do</h2>
      <div className="em-steps">
        {STEPS.map(([title, steps]) => (
          <details key={title}>
            <summary>{title}</summary>
            <ol>{steps.map((s) => <li key={s}>{s}</li>)}</ol>
          </details>
        ))}
      </div>

      <h2 className="sec">Local help in Pune</h2>
      <div className="card">
        <ul className="em-list">
          {LOCAL.map(([label, n]) => <li key={label}><span>{label}</span><a href={tel(n)}>{n}</a></li>)}
        </ul>
        <p className="muted small">For floods, landslides, waterlogging and fallen trees. As shared by the Pune district administration in July 2026.</p>
      </div>

      <h2 className="sec">Stay safe</h2>
      <div className="grid cols-2">
        <div className="card">
          <strong>On the platform and train</strong>
          <ul>
            <li>Stay behind the safety line at the platform edge.</li>
            <li>Hold the handrails and keep your bag with you.</li>
            <li>Keep the exits and doors clear for others.</li>
          </ul>
        </div>
        <div className="card">
          <strong>Online and on the phone</strong>
          <ul>
            <li>Never share your OTP, UPI PIN or card details, even with someone who says they are metro staff.</li>
            <li>Do not install screen-sharing apps because someone asked you to.</li>
            <li>Book tickets only in the official app or at the station.</li>
          </ul>
        </div>
      </div>

      <p className="em-note"><strong>About this page:</strong> MetroQR is a demo project, not the official Pune Metro app. In a real emergency, call 112 directly. Want to report a problem or give feedback? <Link to="/info/complaint">Open the complaint page</Link>.</p>
    </>
  );
}