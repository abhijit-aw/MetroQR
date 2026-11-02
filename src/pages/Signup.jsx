import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const looksValid = (v) => /^\S+@\S+\.\S+$/.test(v.trim()) || /^\d{10}$/.test(v.trim());

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/';
  const [f, setF] = useState({ name: '', identifier: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={from} replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim()) return setError('Enter your full name.');
    if (!looksValid(f.identifier)) return setError('Enter a valid email or a 10-digit mobile number.');
    if (f.password.length < 6) return setError('Password must be at least 6 characters.');
    if (f.password !== f.confirm) return setError('Passwords do not match.');
    setBusy(true);
    const res = await signup(f);
    setBusy(false);
    if (res.ok) navigate(from, { replace: true });
    else setError(res.error);
  }

  return (
    <div className="card auth">
      <div className="auth-side"><h2>Create your account</h2><p>Sign up to book tickets, track your trips and recharge your Metro Card.</p></div>
      <form className="stack auth-form" onSubmit={submit}>
        <h1>Sign up</h1>
        <label className="field"><span className="lbl">Full name</span><input className="fld" autoComplete="name" value={f.name} onChange={set('name')} /></label>
        <label className="field"><span className="lbl">Email or mobile</span><input className="fld" autoComplete="username" value={f.identifier} onChange={set('identifier')} /></label>
        <label className="field"><span className="lbl">Password</span><input className="fld" type="password" autoComplete="new-password" value={f.password} onChange={set('password')} /></label>
        <label className="field"><span className="lbl">Confirm password</span><input className="fld" type="password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        <p className="small">Already have an account? <Link to="/login" state={{ from }}>Login</Link></p>
      </form>
    </div>
  );
}