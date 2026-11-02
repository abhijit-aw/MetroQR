import { STATIONS } from '../data/metro';

export default function StationSelect({ id, label, value, onChange }) {
  return (
    <label className="field" htmlFor={id}>
      <span className="lbl">{label}</span>
      <select id={id} className="fld" value={value} onChange={(e) => onChange(e.target.value)}>
        {STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </label>
  );
}