import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/';
  const [f, setF] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={from} replace />;

  async function submit(e) {
    e.preventDefault();
    if (!f.identifier.trim() || !f.password) { setError('Enter your email or mobile and password.'); return; }
    setBusy(true);
    const res = await login(f);
    setBusy(false);
    if (res.ok) navigate(from, { replace: true });
    else setError(res.error);
  }

  return (
    <div className="card auth">
      <div className="auth-side"><h2>Welcome back</h2><p>Login to see your tickets, Metro Card and trips.</p></div>
      <form className="stack auth-form" onSubmit={submit}>
        <h1>Login</h1>
        <label className="field"><span className="lbl">Email or mobile</span><input className="fld" autoComplete="username" value={f.identifier} onChange={(e) => setF({ ...f, identifier: e.target.value })} /></label>
        <label className="field"><span className="lbl">Password</span><input className="fld" type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</button>
       <p className="small"><Link to="/forgot-password">Forgot password?</Link></p>
<p className="small">New here? <Link to="/signup" state={{ from }}>Sign up</Link></p>
      </form>
    </div>
  );
}