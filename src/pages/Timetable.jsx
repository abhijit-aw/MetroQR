import { useState } from 'react';

/* ====== DATA: ethe badal kar ====== */
const LINES = [
  {
    id: 'purple',
    name: 'Purple Line',
    color: '#6A2E8E',
    dark: '#4B1D6B',
    dot: '#8E3FC0',
    accent: '#C79BEA',
    stations: [
      'PCMC', 'Sant Tukaram Nagar', 'Bhosari', 'Kasarwadi', 'Phugewadi', 'Dapodi', 'Bopodi',
      'Khadki', 'Range Hill', 'Shivaji Nagar', 'Civil Court', 'Budhwar Peth', 'Mandai', 'Swargate',
    ],
    first: '06:00',
    last: '22:00 – 23:00*',
    peak: '7–10 min',
    offpeak: '10–15 min',
  },
  {
    id: 'aqua',
    name: 'Aqua Line',
    color: '#0A7C93',
    dark: '#064F5F',
    dot: '#2FD0D8',
    accent: '#7FE3EA',
    // TODO: Aqua Line che stations ani timings tujhya data pramane verify/update kar
    stations: [
      'Vanaz', 'Anand Nagar', 'Ideal Colony', 'Nal Stop', 'Garware College', 'Deccan Gymkhana',
      'Chhatrapati Sambhaji Udyan', 'PMC', 'Civil Court', 'Mangalwar Peth', 'Pune Railway Station',
      'Ruby Hall Clinic', 'Bund Garden', 'Yerwada', 'Kalyani Nagar', 'Ramwadi',
    ],
    first: '06:00',
    last: '22:00 – 23:00*',
    peak: '7–10 min',
    offpeak: '10–15 min',
  },
];

const ICONS = {
  first: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  last: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  peak: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  offpeak: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
};

const STATS = [
  { key: 'first', label: 'First train', bg: '#E8F1FD', fg: '#1259B8' },
  { key: 'last', label: 'Last train', bg: '#EFE6F7', fg: '#6A2E8E' },
  { key: 'peak', label: 'Peak frequency', bg: '#DDF3EC', fg: '#0B5A4B' },
  { key: 'offpeak', label: 'Off-peak', bg: '#FFF1DC', fg: '#8A4B00' },
];

export default function Timetable() {
  const [lineId, setLineId] = useState('purple');
  const line = LINES.find((l) => l.id === lineId);
  const st = line.stations;
  const n = st.length;
  const half = Math.ceil(n / 2);
  const cols = [st.slice(0, half), st.slice(half)];

  return (
    <div className="bk tt" style={{ '--lc': line.color }}>
      <header className="bk-hero">
        <svg className="tt-deco" viewBox="0 0 700 300" preserveAspectRatio="xMaxYMid slice" fill="none" aria-hidden="true">
          <path d="M-20 260C120 260 180 110 320 120S480 230 560 150 660 60 720 40" stroke={line.accent} strokeOpacity=".55" strokeWidth="5" strokeDasharray="2 12" strokeLinecap="round" />
          <g fill="#0B1F3A" stroke={line.accent} strokeWidth="4">
            <circle cx="320" cy="120" r="12" /><circle cx="560" cy="150" r="12" /><circle cx="170" cy="190" r="8" /><circle cx="650" cy="70" r="8" />
          </g>
          <circle cx="430" cy="200" r="30" fill="#fff" fillOpacity=".1" />
        </svg>

        <div className="bk-wrap tt-hero-in">
          <h1>Pune Metro Time Table</h1>
          <p>First and last train, and how often trains run.</p>

          <div className="tt-tabs" role="tablist" aria-label="Metro line">
            {LINES.map((l) => (
              <button key={l.id} type="button" role="tab" aria-selected={l.id === lineId}
                      className={`tt-tab ${l.id === lineId ? 'on' : ''}`} onClick={() => setLineId(l.id)}>
                <i style={{ background: l.dot }} />{l.name}
              </button>
            ))}
          </div>

          <div className="tt-strip">
            <div><small>From</small><b>{st[0]}</b></div>
            <svg height="28" viewBox="0 0 300 28" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <path d="M4 14H296" stroke={line.accent} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
              <circle cx="6" cy="14" r="6" fill="#0B1F3A" stroke="#fff" strokeWidth="3" />
              <circle cx="294" cy="14" r="6" fill={line.accent} />
              <rect x="132" y="3" width="36" height="22" rx="8" fill="#fff" />
              <rect x="139" y="9" width="9" height="7" rx="2" fill={line.color} />
              <rect x="152" y="9" width="9" height="7" rx="2" fill={line.color} />
            </svg>
            <div className="tt-to"><small>To</small><b>{st[n - 1]}</b></div>
            <span className="tt-chip">{n} stations</span>
          </div>
        </div>
      </header>

      <main className="tt-body">
        <div className="tt-cards">
          {STATS.map((s) => (
            <div key={s.key} className="tt-stat" style={{ '--c': s.fg }}>
              <span className="tt-ico" style={{ background: s.bg, color: s.fg }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[s.key]}</svg>
              </span>
              <span className="tt-lbl">{s.label}</span>
              <strong>{line[s.key]}</strong>
            </div>
          ))}
        </div>

        <section className="tt-stations" aria-label="Stations in order">
          <div className="tt-sthead" style={{ background: `linear-gradient(110deg, ${line.dark}, ${line.color})` }}>
            <h2>Stations in order</h2>
            <p>{st[0]} to {st[n - 1]}, stop by stop.</p>
          </div>
          <div className="tt-cols">
            {cols.map((col, ci) => (
              <ol className="tt-stn" key={ci}>
                {col.map((name, i) => {
                  const num = ci * half + i + 1;
                  const end = num === 1 || num === n;
                  return (
                    <li key={name} className={end ? 'end' : ''} data-tag={num === 1 ? 'Start' : num === n ? 'End' : ''}>
                      <i>{num}</i>{name}
                    </li>
                  );
                })}
              </ol>
            ))}
          </div>
        </section>

        <div className="tt-note">
          <span className="tt-ni">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.5" /></svg>
          </span>
          <div>
            <strong>*Check before you travel.</strong> Sources disagree: some list the last train at 10 PM and some at 11 PM,
            and Sunday or holiday service may start around 8 AM.
          </div>
        </div>
      </main>
    </div>
  );
}