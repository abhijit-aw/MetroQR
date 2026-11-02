import { Link } from 'react-router-dom';
 
const STEPS = [
  { label: 'Route', to: '/book' },
  { label: 'Fare', to: '/fare' },
  { label: 'Payment', to: '/payment' },
];
 
/*
  <PageHeader title sub />               -> junya sarkha sadha header
  <PageHeader hero title sub />          -> hero (stepper nahi)
  <PageHeader step={1|2|3} title sub />  -> hero + Route/Fare/Payment stepper
*/
export default function PageHeader({ title, sub, step, hero, children }) {
  if (!step && !hero) {
    return (
      <div className="page-head">
        <h1>{title}</h1>
        {sub && <p className="muted">{sub}</p>}
      </div>
    );
  }
 
  return (
    <header className="bk-hero">
      {/* background decoration: metro line */}
      <svg className="bk-deco" viewBox="0 0 700 220" preserveAspectRatio="xMaxYMid slice" fill="none" aria-hidden="true">
        <path d="M-20 190C100 190 170 80 300 88S470 170 550 110 650 40 720 24" stroke="#5FE0D2" strokeOpacity=".6" strokeWidth="4" strokeDasharray="2 11" strokeLinecap="round" />
        <path d="M-20 214C140 214 240 150 380 160S600 200 720 120" stroke="#fff" strokeOpacity=".18" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
        <g fill="#0B1F3A" stroke="#5FE0D2" strokeWidth="4">
          <circle cx="300" cy="88" r="11" /><circle cx="550" cy="110" r="11" /><circle cx="160" cy="130" r="7" /><circle cx="650" cy="40" r="7" />
        </g>
        <circle cx="430" cy="140" r="28" fill="#fff" fillOpacity=".08" />
        <g transform="translate(398 72)">
          <rect width="58" height="30" rx="10" fill="#fff" />
          <rect x="9" y="8" width="12" height="9" rx="3" fill="#12417F" />
          <rect x="23" y="8" width="12" height="9" rx="3" fill="#12417F" />
          <rect x="37" y="8" width="12" height="9" rx="3" fill="#12417F" />
          <circle cx="14" cy="34" r="4" fill="#5FE0D2" /><circle cx="44" cy="34" r="4" fill="#5FE0D2" />
        </g>
      </svg>
 
      <div className="bk-wrap">
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
        {step && (
          <ol className="bk-steps" aria-label="Booking progress">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const state = n < step ? 'done' : n === step ? 'on' : '';
              const inner = (<><span>{n < step ? '✓' : n}</span>{s.label}</>);
              return (
                <li key={s.label} className={state} aria-current={n === step ? 'step' : undefined}>
                  {n < step ? <Link to={s.to}>{inner}</Link> : inner}
                </li>
              );
            })}
          </ol>
        )}
        {children}
      </div>
    </header>
  );
}