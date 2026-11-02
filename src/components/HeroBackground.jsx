import { useEffect, useState } from 'react';
import './hero.css';

// REAL PHOTOS: put metro pictures in public/images/hero/ named metro-1.jpg, metro-2.jpg ... (up to 6).
// With 4 or more photos only your photos move. With fewer, the drawn scenes below fill the gap.
const PHOTO_NAMES = [1, 2, 3, 4, 5, 6].map((n) => `hero/metro-${n}.jpg`);
const url = (name) => `${import.meta.env.BASE_URL}images/${name}`;

function useHeroPhotos() {
  const [photos, setPhotos] = useState(null); // null = still checking
  useEffect(() => {
    let alive = true;
    Promise.all(PHOTO_NAMES.map((n) => new Promise((res) => {
      const img = new Image();
      img.onload = () => res(n);
      img.onerror = () => res(null);
      img.src = url(n);
    }))).then((r) => { if (alive) setPhotos(r.filter(Boolean)); });
    return () => { alive = false; };
  }, []);
  return photos;
}

const box = { viewBox: '0 0 340 520', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': true };

// Four drawn scenes (decorative).
const SCENES = [
  // 1. elevated line at sunset
  () => (
    <svg {...box}>
      <defs><linearGradient id="hs1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B3A8C" /><stop offset=".62" stopColor="#E8772A" /><stop offset="1" stopColor="#F6B042" /></linearGradient></defs>
      <rect width="340" height="520" fill="url(#hs1)" />
      <circle cx="248" cy="300" r="44" fill="#FFE2A8" fillOpacity=".9" />
      <path d="M0 410 L70 360 L130 398 L205 345 L340 415 V520 H0Z" fill="#0F1B2D" fillOpacity=".5" />
      <rect y="338" width="340" height="14" fill="#0F1B2D" />
      {[34, 150, 266].map((x) => <rect key={x} x={x} y="352" width="20" height="168" fill="#0F1B2D" />)}
      <rect x="50" y="296" width="230" height="42" rx="16" fill="#fff" />
      {[66, 112, 158, 204].map((x) => <rect key={x} x={x} y="304" width="34" height="16" rx="5" fill="#1565C0" />)}
      <rect x="50" y="326" width="230" height="5" fill="#F28C0F" />
    </svg>
  ),
  // 2. station platform
  () => (
    <svg {...box}>
      <defs><linearGradient id="hs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B2A63" /><stop offset="1" stopColor="#1565C0" /></linearGradient></defs>
      <rect width="340" height="520" fill="url(#hs2)" />
      <rect y="70" width="340" height="16" fill="#0F1B2D" fillOpacity=".7" />
      {[40, 150, 260].map((x) => <rect key={x} x={x} y="86" width="14" height="330" fill="#0F1B2D" fillOpacity=".55" />)}
      {[70, 175, 285].map((x) => <rect key={x} x={x} y="92" width="40" height="6" rx="3" fill="#FFF3C4" />)}
      <rect y="330" width="340" height="190" fill="#0B1F3F" />
      <rect y="410" width="340" height="8" fill="#F6B042" />
      <rect x="-20" y="236" width="380" height="94" rx="20" fill="#fff" fillOpacity=".95" />
      {[10, 80, 150, 220, 290].map((x) => <rect key={x} x={x} y="252" width="52" height="34" rx="8" fill="#FFF3C4" />)}
      <rect x="-20" y="306" width="380" height="8" fill="#00A99D" />
    </svg>
  ),
  // 3. city skyline with the line
  () => (
    <svg {...box}>
      <defs><linearGradient id="hs3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0D47A1" /><stop offset="1" stopColor="#00A99D" /></linearGradient></defs>
      <rect width="340" height="520" fill="url(#hs3)" />
      {[[10, 250, 60], [80, 190, 70], [160, 270, 55], [225, 160, 66], [298, 230, 60]].map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={520 - y} fill="#0F1B2D" fillOpacity=".62" />
          {[0, 1, 2, 3, 4, 5].map((r) => <rect key={r} x={x + 10} y={y + 16 + r * 26} width={w - 20} height="6" fill="#FFF3C4" fillOpacity=".55" />)}
        </g>
      ))}
      <rect y="395" width="340" height="10" fill="#fff" fillOpacity=".9" />
      <rect x="70" y="362" width="170" height="33" rx="12" fill="#fff" />
      {[84, 124, 164, 204].map((x) => <rect key={x} x={x} y="369" width="26" height="12" rx="4" fill="#0D47A1" />)}
    </svg>
  ),
  // 4. tunnel arches
  () => (
    <svg {...box}>
      <defs><radialGradient id="hs4" cx=".5" cy=".55" r=".6"><stop offset="0" stopColor="#8FD8FF" /><stop offset=".25" stopColor="#1565C0" /><stop offset="1" stopColor="#06122B" /></radialGradient></defs>
      <rect width="340" height="520" fill="url(#hs4)" />
      {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx="170" cy={290 - i * 6} rx={40 + i * 40} ry={60 + i * 62} fill="none" stroke="#fff" strokeOpacity={0.5 - i * 0.08} strokeWidth="4" />)}
      <path d="M170 300 L20 520 M170 300 L320 520" stroke="#F6B042" strokeWidth="5" strokeOpacity=".8" />
      <circle cx="170" cy="300" r="20" fill="#fff" fillOpacity=".9" />
    </svg>
  ),
];

export default function HeroBackground() {
  const photos = useHeroPhotos();
  const [paused, setPaused] = useState(false);
  if (photos === null) return <div className="hero-bg" aria-hidden="true" />; // wait for the photo check, so the strip never jumps

  const photoTiles = photos.map((n) => <img key={n} src={url(n)} alt="" loading="lazy" />);
  const artTiles = SCENES.map((Scene, i) => <Scene key={`art-${i}`} />);
  const set = photos.length >= 4 ? photoTiles : [...photoTiles, ...artTiles];

  return (
    <>
      <div className="hero-bg" aria-hidden="true">
        <div className={`hero-track ${paused ? 'paused' : ''}`} style={{ '--n': set.length }}>
          {[0, 1].map((copy) => set.map((tile, i) => <div className="hero-tile" key={`${copy}-${i}`}>{tile}</div>))}
        </div>
      </div>
      <button type="button" className="hero-pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        {paused ? 'Play motion' : 'Pause motion'}
      </button>
    </>
  );
}