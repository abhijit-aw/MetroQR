// Pune Metro data. Station order is the real route order (as far as I could verify).
export const LINES = [
  {
    id: 'purple', name: 'Purple Line', color: '#7B3FA0', ends: 'PCMC ⇄ Swargate',
    stations: ['PCMC', 'Sant Tukaram Nagar', 'Bhosari', 'Kasarwadi', 'Phugewadi', 'Dapodi', 'Bopodi', 'Khadki', 'Range Hill', 'Shivaji Nagar', 'Civil Court', 'Budhwar Peth', 'Mandai', 'Swargate'],
  },
  {
    id: 'aqua', name: 'Aqua Line', color: '#00A3AD', ends: 'Vanaz ⇄ Ramwadi',
    stations: ['Vanaz', 'Anand Nagar', 'Ideal Colony', 'Nal Stop', 'Garware College', 'Deccan Gymkhana', 'Chhatrapati Sambhaji Udyan', 'PMC Bhavan', 'Civil Court', 'Mangalwar Peth', 'Pune Railway Station', 'Ruby Hall Clinic', 'Bund Garden', 'Yerwada', 'Kalyani Nagar', 'Ramwadi'],
  },
];
export const PINK = { name: 'Pink Line (upcoming)', color: '#E0539A', note: 'Maan – Civil Court, under construction' };
export const INTERCHANGE = 'Civil Court';
export const STATIONS = [...new Set(LINES.flatMap((l) => l.stations))];
export const linesOf = (name) => LINES.filter((l) => l.stations.includes(name));

// Timings differ between sources, so the last train is shown as a range. Check punemetrorail.org.
export const TIMETABLE = { first: '06:00', last: '22:00 – 23:00*', peak: '7–10 min', offPeak: '10–15 min' };

// ---- Route finding (breadth-first search over the station graph) ----
const graph = new Map();
const link = (a, b) => {
  if (!graph.has(a)) graph.set(a, new Set());
  graph.get(a).add(b);
};
LINES.forEach((l) =>
  l.stations.forEach((s, i) => {
    if (i > 0) { link(s, l.stations[i - 1]); link(l.stations[i - 1], s); }
  })
);

export function findRoute(from, to) {
  if (!graph.has(from) || !graph.has(to)) return null;
  const parent = new Map([[from, null]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift();
    if (cur === to) break;
    for (const next of graph.get(cur)) {
      if (!parent.has(next)) { parent.set(next, cur); queue.push(next); }
    }
  }
  if (!parent.has(to)) return null;
  const path = [];
  for (let s = to; s !== null; s = parent.get(s)) path.unshift(s);
  return path;
}

// Splits a path into per-line segments (so we can show the interchange).
export function routeSegments(path) {
  const segs = [];
  for (let i = 0; i < path.length - 1; i++) {
    const [a, b] = [path[i], path[i + 1]];
    const line = LINES.find((l) => {
      const x = l.stations.indexOf(a), y = l.stations.indexOf(b);
      return x >= 0 && y >= 0 && Math.abs(x - y) === 1;
    });
    const last = segs[segs.length - 1];
    if (last && last.line.id === line.id) last.stations.push(b);
    else segs.push({ line, stations: [a, b] });
  }
  return segs;
}

// DEMO fare: Rs 5 per stop, minimum Rs 10, maximum Rs 30. Not the real Pune Metro fare chart.
export const calcFare = (stops) => Math.min(30, Math.max(10, stops * 5));

export function quote({ from, to, passengers, journey }) {
  const path = findRoute(from, to);
  if (!path || from === to) return null;
  const stops = path.length - 1;
  const perPassenger = calcFare(stops);
  const trips = journey === 'return' ? 2 : 1;
  return { path, stops, perPassenger, total: perPassenger * passengers * trips, segments: routeSegments(path) };
}