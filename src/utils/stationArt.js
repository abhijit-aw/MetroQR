import { STATIONS, linesOf } from '../data/metro';

// Picks the drawn picture for a station from its line(s):
//   on both lines  -> interchange-station.svg
//   Purple Line    -> purple-line-station-1/2/3.svg  (cycled, so neighbours look different)
//   Aqua Line      -> aqua-line-station-1/2/3.svg
// The pictures live in public/images/.
const VARIANTS = 3;

function kindOf(name) {
  const lines = linesOf(name).map((l) => l.name.toLowerCase());
  if (lines.length > 1) return 'interchange';
  return lines[0]?.includes('aqua') ? 'aqua' : 'purple';
}

// Worked out once, in the order of STATIONS, so a station keeps the same picture when you search or filter.
const counters = { purple: 0, aqua: 0 };
const files = {};
STATIONS.forEach((s) => {
  const kind = kindOf(s);
  files[s] = kind === 'interchange' ? 'interchange-station' : `${kind}-line-station-${(counters[kind]++ % VARIANTS) + 1}`;
});

export function stationArtFile(name) {
  return files[name] || `${kindOf(name) === 'aqua' ? 'aqua' : 'purple'}-line-station-1`;
}

export const stationArtUrl = (name) => `${import.meta.env.BASE_URL}images/${stationArtFile(name)}.svg`;