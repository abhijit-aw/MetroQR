import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// DEMO: no email or SMS is sent. The code is shown on screen so you can test the flow.
export default function ForgotPassword() {
  const { user, accountExists, resetPassword } = useAuth();
  const [step, setStep] = useState(1); // 1 = find account, 2 = code + new password, 3 = done
  const [identifier, setIdentifier] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [code, setCode] = useState('');
  const [f, setF] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const newCode = () => String(Math.floor(100000 + Math.random() * 900000));

  function sendCode(e) {
    e.preventDefault();
    if (!identifier.trim()) return setError('Enter your email or mobile.');
    if (!accountExists(identifier)) return setError('No account found with this email or mobile. Check it, or sign up.');
    setSentCode(newCode());
    setError('');
    setStep(2);
  }

  async function reset(e) {
    e.preventDefault();
    if (code.trim() !== sentCode) return setError('The code is wrong. Check the code shown above.');
    if (f.password.length < 6) return setError('Password must be at least 6 characters.');
    if (f.password !== f.confirm) return setError('Passwords do not match.');
    setBusy(true);
    const res = await resetPassword({ identifier, password: f.password });
    setBusy(false);
    if (res.ok) { setError(''); setStep(3); } else setError(res.error);
  }

  return (
    <div className="card auth">
      <div className="auth-side">
        <h2>Forgot your password?</h2>
        <p>No problem. Verify your account and set a new password.</p>
      </div>

      {step === 1 && (
        <form className="stack auth-form" onSubmit={sendCode}>
          <h1>Reset password</h1>
          <label className="field">
            <span className="lbl">Email or mobile</span>
            <input className="fld" autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" type="submit">Send code</button>
          <p className="small"><Link to="/login">Back to Login</Link></p>
        </form>
      )}

      {step === 2 && (
        <form className="stack auth-form" onSubmit={reset}>
          <h1>Enter code</h1>
          <div className="notice">
            <strong>Demo mode:</strong> no SMS or email is sent. Your code is <strong>{sentCode}</strong>.
          </div>
          <label className="field">
            <span className="lbl">6-digit code</span>
            <input className="fld" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          <label className="field">
            <span className="lbl">New password</span>
            <input className="fld" type="password" autoComplete="new-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          </label>
          <label className="field">
            <span className="lbl">Confirm new password</span>
            <input className="fld" type="password" autoComplete="new-password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Change password'}</button>
          <button type="button" className="link-btn" onClick={() => { setSentCode(newCode()); setCode(''); setError(''); }}>Send a new code</button>
        </form>
      )}

      {step === 3 && (
        <div className="stack auth-form">
          <h1>Password changed</h1>
          <p className="muted">You can now login with your new password.</p>
          <Link to="/login" className="btn">Go to Login</Link>
        </div>
      )}
    </div>
  );
}