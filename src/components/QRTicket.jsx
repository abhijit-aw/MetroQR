import { QRCodeSVG } from 'qrcode.react';

// The QR holds the ticket details as JSON. A real system would sign this on a server.
export default function QRTicket({ ticket, size = 160, dim = false }) {
  const value = JSON.stringify({ id: ticket.id, from: ticket.from, to: ticket.to, pax: ticket.passengers, validTill: ticket.validTill });
  return (
    <div className={`qr ${dim ? 'dim' : ''}`} role="img" aria-label={`QR code for ticket ${ticket.id}`}>
      <QRCodeSVG value={value} size={size} level="M" />
    </div>
  );
}