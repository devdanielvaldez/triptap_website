import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import DigitalAdvertising from '../components/DigitalAdvertising';
import TabletSection from '../components/TabletSection';
import Partners from '../components/Patners';
import ForBusinesses from '../components/ForBusiness';
import VideoSection from '../components/VideoSection';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <DigitalAdvertising />
      <TabletSection />
      <Partners />
      <ForBusinesses />
      <VideoSection />
      <Footer />
    </>
  );
};

export default HomePage;