import { createContext, useCallback, useContext, useState } from 'react';
import { load, save } from '../utils/storage';
import { useAuth } from './AuthContext';
import { ONE_HOUR } from '../utils/time';

const Ctx = createContext(null);
export const useTickets = () => useContext(Ctx);

export function TicketProvider({ children }) {
  const { user } = useAuth();
  const [all, setAll] = useState(() => load('metroqr_tickets', []));
  const tickets = user ? all.filter((t) => t.userId === user.id).sort((a, b) => b.bookedAt - a.bookedAt) : [];

  const persist = (next) => { setAll(next); save('metroqr_tickets', next); };

  const addTicket = useCallback((data) => {
    const bookedAt = Date.now();
    const ticket = {
      ...data, userId: user.id, bookedAt, validTill: bookedAt + ONE_HOUR, usedAt: null,
      id: `MQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      txnId: `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    };
    persist([...all, ticket]);
    return ticket;
  }, [all, user]);

  const markUsed = useCallback((id) => {
    persist(all.map((t) => (t.id === id && !t.usedAt ? { ...t, usedAt: Date.now() } : t)));
  }, [all]);

  const getTicket = (id) => tickets.find((t) => t.id === id);

  return <Ctx.Provider value={{ tickets, addTicket, markUsed, getTicket }}>{children}</Ctx.Provider>;
}