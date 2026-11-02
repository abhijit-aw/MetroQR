import { Link, useParams } from 'react-router-dom';
import Emergency from './Emergency.jsx';

// One placeholder page for every "details" link. Replace it with real pages one by one.
export default function Info() {
  const { topic } = useParams();
  if (topic === 'emergency') return <Emergency />;
  const title = topic.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  return (
    <>
      <Link to="/services" className="back">← Back to Services</Link>
      <div className="card">
        <h1>{title}</h1>
        <p className="muted">[This page is a placeholder. Add the details for this option here.]</p>
      </div>
    </>
  );
}