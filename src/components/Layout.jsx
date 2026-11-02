import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // new page starts at the top
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main className="wrap page"><Outlet /></main>
      <Footer />
      <Link to="/info/emergency" className="btn emergency">Emergency</Link>
    </>
  );
}