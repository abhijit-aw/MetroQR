// Details shown on the map hover card.
export const slugOf = (s) => s.toLowerCase().replace(/\s+/g, '-');

// Facilities Pune Metro lists for persons with disabilities at its stations
// (source: "Facilities available for PWD", punemetrorail.org). Shown on every station card.
export const COMMON_FEATURES = [
  'Lifts to the platform',
  'Lowered ticket counters',
  'Lowered drinking-water points',
  'Tactile paths',
  'Accessible restroom',
  'Wheelchairs on request',
  'Ramps at key locations',
];

// Optional extras for one station. All fields are optional.
//   image:    a file in public/images/stations/  (default: <station-name>.jpg)
//             or a full https:// link to an image you have the right to use
//   features: short highlights shown on the card
//   about:    one or two sentences
// Only add things you have checked.
export const STATION_INFO = {
  'Civil Court': {
    features: ['Deepest metro station in India (108.59 ft)', '95 ft high ceiling with natural light'],
    about: 'Interchange for the Purple and Aqua lines. Reported to have 18 escalators and 8 lifts.',
  },
  Mandai: {
    features: ['Gate 3 for Tulshibaug market'],
    about: 'Gate 3 opened in June 2025 to help commuters reach Tulshibaug market and nearby religious and tourist spots.',
  },
  Kasarwadi: { features: ['Escalators added in June 2025'] },
  Ramwadi: { features: ['Escalators added in June 2025'] },
  // 'Shivaji Nagar': { image: 'shivaji-nagar.jpg', features: ['...'], about: '...' },
};