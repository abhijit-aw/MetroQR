import PlacesShowcase from '../components/PlacesShowcase.jsx';

export default function Places() {
  return (
    <>
      <h1>Best places in Pune</h1>
      <p className="muted">Ride the metro and explore the city's forts, temples, gardens and lakes.</p>
      <PlacesShowcase variant="grid" filters />
    </>
  );
}