import PageHeader from '../components/PageHeader.jsx';

// Logo styles live here, so no extra CSS file is needed.
const logoBox = { position: 'relative', display: 'grid', placeItems: 'center', width: 'min(100%, 250px)', aspectRatio: '1', margin: '0 auto' };
const glow = {
  position: 'absolute', inset: '4%', borderRadius: '50%', filter: 'blur(14px)',
  background: 'radial-gradient(circle, rgba(0,169,157,.38), rgba(21,101,192,.2) 55%, transparent 72%)',
};
const badge = { position: 'relative', width: '74%', aspectRatio: '1', borderRadius: '50%', background: '#fff', boxShadow: '0 14px 34px rgba(13,71,161,.35)' };

export default function About() {
  return (
    <>
      <PageHeader title="About MetroQR" />
      <div className="card about">
        <div style={logoBox}>
          <div style={glow} aria-hidden="true" />
          <div style={badge}>
            <svg viewBox="0 0 100 100" role="img" aria-label="MetroQR logo" style={{ display: 'block', width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="47" fill="#fff" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#0e8fa5" strokeWidth="6" />
              <path d="M50 8A42 42 0 0 1 92 50" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
              <path d="M33 68V40a17 17 0 0 1 34 0v28z" fill="#1565c0" />
              <rect x="39" y="32" width="22" height="19" rx="3" fill="#fff" />
              <g fill="#1565c0">
                <rect x="41.5" y="34.5" width="6" height="6" rx="1" /><rect x="52.5" y="34.5" width="6" height="6" rx="1" />
                <rect x="41.5" y="43" width="6" height="5.5" rx="1" /><rect x="52.5" y="43" width="2.6" height="2.6" /><rect x="56" y="46" width="2.6" height="2.6" />
              </g>
              <circle cx="40" cy="60" r="2.8" fill="#f59e0b" /><circle cx="60" cy="60" r="2.8" fill="#f59e0b" />
              <rect x="45" y="59" width="10" height="2.8" rx="1.4" fill="#f59e0b" />
              <path d="M39 74l-3.5 7M50 74v7M61 74l3.5 7" stroke="#1565c0" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div>
          <p>MetroQR is a simple web-based application designed to streamline the metro ticketing process from your laptop or phone. </p>
          <p>Users can effortlessly choose their departure and arrival stations, view their fare, and get a scannable QR code for gate entry. </p>
          <p>Fares are dynamically calculated based on the total number of stops between the starting point and the destination, ensuring full price transparency before checkout.</p>
          <p>The platform also features a centralized "My Tickets" dashboard to track and categorize active, used, and expired passes in one convenient location.</p>
          <p className="muted small">Note: This is a demo project and is not the official Pune Metro application. All payments and transactions are simulated for demonstration purposes only.</p>
        </div>
      </div>
    </>
  );
}