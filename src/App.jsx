import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useLang } from './context/LanguageContext.jsx';
import Home from './pages/Home.jsx';
import Book from './pages/Book.jsx';
// import Plan from './pages/Plan.jsx';
import Stations from './pages/Stations.jsx';
import Timetable from './pages/Timetable.jsx';
import MapPage from './pages/MapPage.jsx';
import Fare from './pages/Fare.jsx';
import Payment from './pages/Payment.jsx';
import Pay from './pages/Pay.jsx';
import Success from './pages/Success.jsx';
import Ticket from './pages/Ticket.jsx';
import MyTickets from './pages/MyTickets.jsx';
import MetroCard from './pages/MetroCard.jsx';
import Services from './pages/Services.jsx';
import Help from './pages/Help.jsx';
import About from './pages/About.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Info from './pages/Info.jsx';
import StationDetail from './pages/StationDetail.jsx';
import Places from './pages/Places.jsx';
import PlaceDetail from './pages/PlaceDetail.jsx';
import Complaint from './pages/Complaint.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

const Private = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

function NotFound() {
  const { t } = useLang();
  return (
    <div className="card">
      <h1>{t('nf.title')}</h1>
      <Link to="/" className="btn">{t('nf.home')}</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* every page lives inside Layout, so the Navbar (and its language button) is always there */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="book" element={<Book />} />
        {/* <Route path="plan" element={<Plan />} /> */}
        <Route path="stations" element={<Stations />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="map" element={<MapPage />} />
        <Route path="services" element={<Services />} />
        <Route path="help" element={<Help />} />
        <Route path="about" element={<About />} />
        <Route path="station/:slug" element={<StationDetail />} />
        <Route path="info/:topic" element={<Info />} />
        <Route path="places" element={<Places />} />
        <Route path="place/:slug" element={<PlaceDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        {/* these need a logged-in user */}
        <Route path="fare" element={<Private><Fare /></Private>} />
        <Route path="payment" element={<Private><Payment /></Private>} />
        <Route path="pay/:id" element={<Private><Pay /></Private>} />
        <Route path="success/:id" element={<Private><Success /></Private>} />
        <Route path="ticket/:id" element={<Private><Ticket /></Private>} />
        <Route path="tickets" element={<Private><MyTickets /></Private>} />
        <Route path="card" element={<Private><MetroCard /></Private>} />
        <Route path="profile" element={<Private><Profile /></Private>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/info/complaint" element={<Complaint />} />
        <Route path="/info/privacy-policy" element={<PrivacyPolicy />} />
      </Route>
    </Routes>
  );
}