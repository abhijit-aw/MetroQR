import { createContext, useCallback, useContext, useState } from 'react';
import { load, save } from '../utils/storage';
import { useAuth } from './AuthContext';

const Ctx = createContext(null);
export const useWallet = () => useContext(Ctx);

const START_BALANCE = 250; // demo money for every new account

// Demo Metro Card wallet, one per user. No real money anywhere.
export function WalletProvider({ children }) {
  const { user } = useAuth();
  const [wallets, setWallets] = useState(() => load('metroqr_wallets', {}));
  const mine = (user && wallets[user.id]) || { balance: START_BALANCE, tx: [] };

  const write = useCallback((w) => {
    setWallets((prev) => { const next = { ...prev, [user.id]: w }; save('metroqr_wallets', next); return next; });
  }, [user]);

  const recharge = (amount) =>
    write({ balance: mine.balance + amount, tx: [{ label: 'Recharge', amount, at: Date.now() }, ...mine.tx] });

  // returns false if the balance is too low
  const spend = (amount, label) => {
    if (mine.balance < amount) return false;
    write({ balance: mine.balance - amount, tx: [{ label, amount: -amount, at: Date.now() }, ...mine.tx] });
    return true;
  };

  return <Ctx.Provider value={{ balance: mine.balance, tx: mine.tx, recharge, spend }}>{children}</Ctx.Provider>;
}