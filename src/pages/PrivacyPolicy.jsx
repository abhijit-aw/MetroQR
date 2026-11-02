import { Link } from 'react-router-dom';
import '../components/privacy.css';

const SECTIONS = [
  ['📋', 'What we collect', [
    'Account details you enter, like your name, email and mobile number.',
    'Ticket and booking details you create in the app.',
    'Complaint details you submit: category, name, mobile number, station, ticket ID and your message.',
  ]],
  ['🎯', 'How we use it', [
    'To show your tickets, card and profile in the app.',
    'To read and respond to the complaints you send us.',
    'We do not sell your data and we do not show ads.',
  ]],
  ['✉️', 'Complaints and email', [
    'When you submit the complaint form, the details are sent by email to the project owner using EmailJS.',
    'In demo mode, nothing is sent anywhere.',
    'Please do not write card numbers, UPI PINs, OTPs or passwords in the complaint.',
  ]],
  ['💾', 'Your device', [
    'The app saves small settings in your browser, like your language and dark or light mode.',
    'You can clear this any time from your browser settings.',
  ]],
  ['🔒', 'Staying safe', [
    'Never share your OTP, UPI PIN or card details with anyone, even if they say they are metro staff.',
    'Book tickets only in the official app or at the station.',
  ]],
];

export default function PrivacyPolicy() {
  return (
    <>
      <Link to="/" className="back">← Back to Home</Link>

      <section className="pv-hero">
        <h1>Privacy Policy</h1>
        <p>A short and simple note on what this app does with your information.</p>
        <span>Last updated: November 2026</span>
      </section>

      <div className="pv-grid">
        {SECTIONS.map(([icon, title, points]) => (
          <section key={title} className="card pv-card">
            <h2><span aria-hidden="true">{icon}</span>{title}</h2>
            <ul>{points.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>
        ))}
      </div>

      <p className="pv-note">
        <strong>About this page:</strong> MetroQR is a demo project, not the official Pune Metro app.
        Questions about your data? <Link to="/info/complaint">Contact us through the complaint page</Link>.
      </p>
    </>
  );
}