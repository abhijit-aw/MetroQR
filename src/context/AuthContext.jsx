import { createContext, useCallback, useContext, useState } from 'react';
import { load, save } from '../utils/storage';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

// Demo auth: accounts live in localStorage. Passwords are hashed, but this is NOT real security.
async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
const clean = (s) => s.trim().toLowerCase();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => load('metroqr_users', []));
  const [sessionId, setSessionId] = useState(() => load('metroqr_session', null));
  const user = users.find((u) => u.id === sessionId) || null;

  const startSession = (id) => { setSessionId(id); save('metroqr_session', id); };

  const signup = useCallback(async ({ name, identifier, password }) => {
    const ident = clean(identifier);
    if (users.some((u) => u.identifier === ident)) {
      return { ok: false, error: 'An account with this email or mobile already exists. Login instead.' };
    }
    const u = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(), identifier: ident, hash: await sha256(`${ident}:${password}`),
    };
    const next = [...users, u];
    setUsers(next); save('metroqr_users', next); startSession(u.id);
    return { ok: true };
  }, [users]);

  const login = useCallback(async ({ identifier, password }) => {
    const ident = clean(identifier);
    const hash = await sha256(`${ident}:${password}`);
    const u = users.find((x) => x.identifier === ident && x.hash === hash);
    if (!u) return { ok: false, error: 'Wrong email/mobile or password. Check and try again.' };
    startSession(u.id);
    return { ok: true };
  }, [users]);

  const logout = useCallback(() => { setSessionId(null); save('metroqr_session', null); }, []);

  const updateName = useCallback((name) => {
    const next = users.map((u) => (u.id === sessionId ? { ...u, name: name.trim() } : u));
    setUsers(next); save('metroqr_users', next);
  }, [users, sessionId]);

  // NEW: used by the Forgot password page
  const accountExists = useCallback(
    (identifier) => users.some((u) => u.identifier === clean(identifier)),
    [users]
  );

  const resetPassword = useCallback(async ({ identifier, password }) => {
    const ident = clean(identifier);
    const found = users.find((u) => u.identifier === ident);
    if (!found) return { ok: false, error: 'No account found with this email or mobile.' };
    const hash = await sha256(`${ident}:${password}`);
    const next = users.map((u) => (u.id === found.id ? { ...u, hash } : u));
    setUsers(next); save('metroqr_users', next);
    return { ok: true };
  }, [users]);

  return (
    <Ctx.Provider value={{ user, signup, login, logout, updateName, accountExists, resetPassword }}>
      {children}
    </Ctx.Provider>
  );
}