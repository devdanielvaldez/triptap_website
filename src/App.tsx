import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import HomePage from './pages/HomePage';
import DriversPage from './pages/DriversPage';
import BusinessPage from './pages/BusinessPage';
import EsimPage from './pages/EsimPage';
import CountryEsimPage from './pages/CountryEsimPage';
import AdvertisingPage from './pages/AdvertisignPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import EntertainmentPage from './pages/EntertainmentPage';
import EntertainmentDetailPage from './pages/EntertainmentDetailPage';
import DealsPage from './pages/DealsPage';
import DealDetailPage from './pages/DealDetailPage';
import RequestRidePage from './pages/RequestRidePage';
import TaxiAnimations from './components/TaxiAnimation';
import FloatingRideButton from './components/FloatingRideButton';
import TripStatusPage from './pages/TripStatusPage';
import PublishEventPage from './pages/SendEventsPage';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <TaxiAnimations />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/esim" element={<EsimPage />} />
            <Route path="/esim/:countrySlug" element={<CountryEsimPage />} />
            <Route path="/entertainment" element={<EntertainmentPage />} />
            <Route path="/entertainment/:placeId" element={<EntertainmentDetailPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/deals/:dealId" element={<DealDetailPage />} />
            <Route path="/business" element={<BusinessPage />} />
            <Route path="/advertising" element={<AdvertisingPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />
            <Route path="/request-ride" element={<RequestRidePage />} />
            <Route path="/trip-status/:requestId" element={<TripStatusPage />} />
            <Route path="/publish-events" element={<PublishEventPage />}/>
          </Routes>
          <FloatingRideButton />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;