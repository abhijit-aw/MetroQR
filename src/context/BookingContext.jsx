import { createContext, useCallback, useContext, useState } from 'react';
import { load, save } from '../utils/storage';

const Ctx = createContext(null);
export const useBooking = () => useContext(Ctx);

const DEFAULT = { from: 'Shivaji Nagar', to: 'Swargate', passengers: 1, journey: 'single' };

// The booking "draft" (stations, passengers) is kept so it survives the login redirect.
export function BookingProvider({ children }) {
  const [booking, setState] = useState(() => load('metroqr_booking', DEFAULT));
  const setBooking = useCallback((patch) => {
    setState((prev) => { const next = { ...prev, ...patch }; save('metroqr_booking', next); return next; });
  }, []);
  return <Ctx.Provider value={{ booking, setBooking }}>{children}</Ctx.Provider>;
}