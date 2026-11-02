import { load, save } from '../utils/storage';
 
// ---------------------------------------------------------------------------
// MetroPay SANDBOX: a pretend payment gateway that lives in your browser.
// A real gateway (Razorpay, Stripe, PayU ...) does the same steps on its own
// servers: create an order -> customer pays on the gateway page -> gateway sends
// back a signed result -> YOUR SERVER verifies the signature -> then you give the
// ticket. Here everything is saved in localStorage so you can learn the flow.
// ---------------------------------------------------------------------------
 
const KEY = 'metroqr_gateway_orders';
// DEMO ONLY. A real secret key stays on your server and never goes into browser code.
const SECRET = 'metropay_sandbox_demo_secret';
 
export const ORDER_TTL = 10 * 60 * 1000;   // checkout session lasts 10 minutes
const UPI_TTL = 60 * 1000;                 // UPI request must be approved within 1 minute
const OTP_TTL = 2 * 60 * 1000;             // OTP is valid for 2 minutes
export const OTP_RESEND_AFTER = 20 * 1000; // wait 20 seconds before asking for a new OTP
export const MAX_ATTEMPTS = 3;             // failed attempts allowed per order
export const BANKS = ['Demo Bank A', 'Demo Bank B', 'Demo Bank C'];
 
// Test credentials shown on the checkout page (like Razorpay / Stripe test mode).
export const TEST_CARDS = [
  ['4111 1111 1111 1111', 'Visa', 'Works (OTP needed)'],
  ['5555 5555 5555 4444', 'Mastercard', 'Works (OTP needed)'],
  ['6522 0000 0000 0006', 'RuPay', 'Works (OTP needed)'],
  ['4000 0000 0000 0002', 'Visa', 'Declined by the bank'],
  ['4000 0000 0000 9995', 'Visa', 'Insufficient funds'],
];
 
const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms + Math.random() * 300)); // fake network delay
const rid = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
const err = (code, description) => ({ ok: false, error: { code, description } });
const readAll = () => load(KEY, {});
const writeAll = (all) => save(KEY, all);
 
// ---- small helpers (also used by the checkout page) ----
export const digits = (s) => String(s).replace(/\D/g, '');
export const formatCard = (s) => digits(s).slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
export const validVpa = (v) => /^[a-z0-9._-]{2,}@[a-z]{2,}$/i.test(v.trim());
 
export function luhn(num) {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return num.length > 0 && sum % 10 === 0;
}
 
export function cardBrand(num) {
  const n = digits(num);
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if (/^(60|65|81|82|508)/.test(n)) return 'RuPay';
  return '';
}
 
// Demo rule: ANY card number is accepted (12 to 19 digits).
export function validateCard({ number, name, expiry, cvv }) {
  const n = digits(number);
  if (n.length < 12 || n.length > 19) return 'Enter your card number (12 to 19 digits).';
  if (!name.trim()) return 'Enter the name on the card.';
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry.trim());
  if (!m) return 'Enter the expiry as MM/YY.';
  if (new Date(2000 + Number(m[2]), Number(m[1]), 1) <= new Date()) return 'This card has expired.'; // valid till end of the month
  if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits.';
  return '';
}
 
// ---- signing: the gateway signs "orderId|paymentId", the merchant checks it ----
async function hmac(message) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
export async function verifySignature(orderId, paymentId, signature) {
  return (await hmac(`${orderId}|${paymentId}`)) === signature;
}
 
// ---- internal state machine ----
function view(o) {
  // what the browser may see. The OTP is shown as "demoOtp" because there is no real SMS here.
  const copy = JSON.parse(JSON.stringify(o));
  copy.maxAttempts = MAX_ATTEMPTS;
  copy.attempts.forEach((a) => { if (a.otp) { a.demoOtp = a.otp; delete a.otp; } });
  return copy;
}
 
function failAttempt(o, a, code, description) {
  a.status = 'failed'; a.stage = null; a.error = { code, description }; a.endedAt = Date.now();
  const failed = o.attempts.filter((x) => x.status === 'failed').length;
  o.status = failed >= MAX_ATTEMPTS ? 'failed' : 'attempted';
}
 
// Timeouts are applied whenever the order is read, like a server would do.
function expire(o) {
  const now = Date.now();
  const pending = o.attempts.find((a) => a.status === 'pending');
  if (pending && now > pending.expiresAt) {
    failAttempt(o, pending, pending.stage === 'upi' ? 'UPI_TIMEOUT' : 'OTP_TIMEOUT',
      pending.stage === 'upi' ? 'The UPI request was not approved in time.' : 'The OTP expired.');
  }
  if ((o.status === 'created' || o.status === 'attempted') && now > o.expiresAt) {
    o.attempts.filter((a) => a.status === 'pending').forEach((a) => { a.status = 'cancelled'; a.stage = null; });
    o.status = 'expired';
  }
}
 
async function capture(o, a) {
  const paymentId = rid('pay');
  a.status = 'captured'; a.stage = null; a.paymentId = paymentId; a.endedAt = Date.now();
  o.status = 'paid'; o.paymentId = paymentId; o.method = a.method; o.paidAt = Date.now();
  o.methodLabel = a.method === 'card' ? `${a.meta.brand} card •••• ${a.meta.last4}`
    : a.method === 'upi' ? `UPI (${a.meta.vpa})` : `Net Banking (${a.meta.bank})`;
  o.signature = await hmac(`${o.id}|${paymentId}`);
}
 
async function withOrder(id, fn) {
  await wait();
  const o = readAll()[id];
  if (!o) return err('ORDER_NOT_FOUND', 'This payment link is not valid.');
  expire(o);
  const res = (await fn(o)) || { ok: true };
  const all = readAll(); all[id] = o; writeAll(all);
  return { ...res, order: view(o) };
}
 
const pendingAt = (o, stage) => o.attempts.find((a) => a.status === 'pending' && a.stage === stage);
const randomOtp = () => String(Math.floor(100000 + Math.random() * 900000));
 
// ---- public API (each call behaves like a request to the gateway's server) ----
 
// MERCHANT -> GATEWAY: "I want to collect this amount"
export async function createOrder({ amount, purpose, notes, userId }) {
  await wait(300);
  const now = Date.now();
  const o = {
    id: rid('order'), amount, currency: 'INR', purpose, notes: notes || {}, userId,
    receipt: `rcpt_${now}`, status: 'created', createdAt: now, expiresAt: now + ORDER_TTL,
    attempts: [], paymentId: null, signature: null, fulfilledRef: null,
  };
  const all = readAll(); all[o.id] = o; writeAll(all);
  return view(o);
}
 
export async function getOrder(id) {
  const r = await withOrder(id, () => ({ ok: true }));
  return r.order || null;
}
 
// CUSTOMER -> GATEWAY: "pay with this method"
export function startPayment(id, input) {
  return withOrder(id, (o) => {
    if (o.status === 'paid') return err('ALREADY_PAID', 'This order is already paid.');
    if (o.status !== 'created' && o.status !== 'attempted') return err('ORDER_CLOSED', 'This payment session has ended.');
 
    const now = Date.now();
    const a = { id: rid('att'), method: input.method, status: 'pending', stage: null, createdAt: now, expiresAt: null, error: null, meta: {}, paymentId: null };
 
    if (input.method === 'card') {
      const msg = validateCard(input.card);
      if (msg) return err('BAD_CARD', msg);
      const n = digits(input.card.number);
      a.meta = { brand: cardBrand(n) || 'Card', last4: n.slice(-4) };
      if (n === '4000000000000002') { cancelPending(o); o.attempts.push(a); failAttempt(o, a, 'CARD_DECLINED', 'Your card was declined by the issuing bank.'); return { ok: true }; }
      if (n === '4000000000009995') { cancelPending(o); o.attempts.push(a); failAttempt(o, a, 'INSUFFICIENT_FUNDS', 'Insufficient funds in the account.'); return { ok: true }; }
      Object.assign(a, { stage: 'otp', otp: randomOtp(), otpTries: 0, resends: 0, otpSentAt: now, expiresAt: now + OTP_TTL });
    } else if (input.method === 'upi') {
      if (!validVpa(input.vpa)) return err('BAD_VPA', 'Enter a valid UPI ID, like name@bank.');
      if (/^invalid/i.test(input.vpa.trim())) return err('INVALID_VPA', 'This UPI ID does not exist.');
      a.meta = { vpa: input.vpa.trim().toLowerCase() };
      Object.assign(a, { stage: 'upi', expiresAt: now + UPI_TTL });
    } else if (input.method === 'netbanking') {
      if (!BANKS.includes(input.bank)) return err('BAD_BANK', 'Choose a bank.');
      a.meta = { bank: input.bank };
      Object.assign(a, { stage: 'bank', expiresAt: now + ORDER_TTL });
    } else {
      return err('BAD_METHOD', 'This payment method is not available.');
    }
    cancelPending(o); o.attempts.push(a); o.status = 'attempted';
    return { ok: true };
  });
}
const cancelPending = (o) => o.attempts.filter((a) => a.status === 'pending').forEach((a) => { a.status = 'cancelled'; a.stage = null; });
 
// Customer goes back to choose another method (not counted as a failed attempt)
export function abortAttempt(id) {
  return withOrder(id, (o) => { cancelPending(o); if (o.status === 'attempted' || o.status === 'created') o.status = o.attempts.some((a) => a.status === 'failed') ? 'attempted' : 'created'; });
}
 
// Card: 3-D Secure step
export function submitOtp(id, otp) {
  return withOrder(id, async (o) => {
    const a = pendingAt(o, 'otp');
    if (!a) return err('NO_PENDING', 'No payment is waiting for an OTP.');
    if (digits(otp) !== a.otp) {
      a.otpTries += 1;
      if (a.otpTries >= 3) { failAttempt(o, a, 'OTP_FAILED', 'Too many wrong OTP attempts.'); return err('OTP_FAILED', 'Too many wrong OTP attempts. This payment attempt has failed.'); }
      const left = 3 - a.otpTries;
      return err('OTP_WRONG', `Incorrect OTP. ${left} attempt${left > 1 ? 's' : ''} left.`);
    }
    await capture(o, a);
  });
}
 
export function resendOtp(id) {
  return withOrder(id, (o) => {
    const a = pendingAt(o, 'otp');
    if (!a) return err('NO_PENDING', 'No payment is waiting for an OTP.');
    if (Date.now() - a.otpSentAt < OTP_RESEND_AFTER) return err('TOO_SOON', 'Please wait a few seconds before asking for a new OTP.');
    if (a.resends >= 2) return err('RESEND_LIMIT', 'You have used all OTP resends. Try another method.');
    Object.assign(a, { otp: randomOtp(), otpTries: 0, resends: a.resends + 1, otpSentAt: Date.now(), expiresAt: Date.now() + OTP_TTL });
  });
}
 
// UPI: the customer approves or declines in their UPI app
export function respondUpi(id, { action, pin }) {
  return withOrder(id, async (o) => {
    const a = pendingAt(o, 'upi');
    if (!a) return err('NO_PENDING', 'There is no UPI request to answer.');
    if (action === 'decline') { failAttempt(o, a, 'UPI_DECLINED', 'The payment was declined in the UPI app.'); return; }
    if (!/^(\d{4}|\d{6})$/.test(pin || '')) return err('BAD_PIN', 'Enter your 4 or 6 digit UPI PIN.');
    if (/^fail/i.test(a.meta.vpa)) { failAttempt(o, a, 'INSUFFICIENT_FUNDS', 'Insufficient balance in the linked bank account.'); return; }
    await capture(o, a);
  });
}
 
// Net banking: the customer logs in on the bank's own page and authorizes
export function respondBank(id, { action, userId, password }) {
  return withOrder(id, async (o) => {
    const a = pendingAt(o, 'bank');
    if (!a) return err('NO_PENDING', 'There is no bank page waiting.');
    if (action === 'cancel') { failAttempt(o, a, 'BANK_CANCELLED', 'You cancelled the payment on the bank page.'); return; }
    if (!String(userId || '').trim() || !password) return err('BAD_LOGIN', 'Enter your user ID and password.');
    if (a.meta.bank === 'Demo Bank C') { failAttempt(o, a, 'BANK_DOWN', 'The bank server is not responding. Try another method.'); return; }
    await capture(o, a);
  });
}
 
// Customer closes the checkout without paying
export function cancelOrder(id) {
  return withOrder(id, (o) => {
    if (o.status === 'paid') return err('ALREADY_PAID', 'This order is already paid.');
    cancelPending(o);
    if (o.status === 'created' || o.status === 'attempted') o.status = 'cancelled';
  });
}
 
// MERCHANT: remember that the ticket / recharge was delivered, so a page refresh never gives it twice
export function markFulfilled(id, ref) {
  const all = readAll();
  if (all[id]) { all[id].fulfilledRef = ref; all[id].fulfilledAt = Date.now(); writeAll(all); }
}