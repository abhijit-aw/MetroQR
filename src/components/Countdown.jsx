 import useNow from '../hooks/useNow';
import { fmtCountdown, fmtTime, getStatus, percentLeft } from '../utils/time';
import StatusBadge from './StatusBadge.jsx';

// Live "Expires in 00:42:10" + progress bar. Re-renders every second.
export default function Countdown({ ticket }) {
  const now = useNow();
  const status = getStatus(ticket, now);
  return (
    <div className="countdown">
      <div className="cd-row">
        <StatusBadge status={status} />
        {status === 'active' && <span>Expires in <strong role="timer">{fmtCountdown(ticket.validTill - now)}</strong></span>}
        {status === 'expired' && <span>Expired at <strong>{fmtTime(ticket.validTill)}</strong></span>}
        {status === 'used' && <span>Used at <strong>{fmtTime(ticket.usedAt)}</strong></span>}
      </div>
      {status === 'active' && (
        <div className="bar" aria-hidden="true"><div style={{ width: `${percentLeft(ticket, now)}%` }} /></div>
      )}
      <p className="muted small">Tickets are valid for 1 hour after booking.</p>
    </div>
  );
}