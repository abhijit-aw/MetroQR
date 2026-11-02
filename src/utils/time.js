export const ONE_HOUR = 60 * 60 * 1000; // tickets are valid for 1 hour after booking

export const fmtTime = (ms) =>
  new Date(ms).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export function fmtCountdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const p = (n) => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}

// Status is DERIVED from the clock, so a ticket expires on its own.
export function getStatus(ticket, now) {
  if (ticket.usedAt) return 'used';
  return now >= ticket.validTill ? 'expired' : 'active';
}

export const percentLeft = (ticket, now) =>
  Math.max(0, Math.min(100, ((ticket.validTill - now) / ONE_HOUR) * 100));