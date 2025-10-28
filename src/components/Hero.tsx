import React from 'react';
import { MapPin, Car, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import DriverRegistrationModal from './DriverRegistrationModal';
import RedirectCountdown from './RedirectCountdown';
import AdvertisingModal from './AvertisingModal';
import EsimPromoModal from './EsimPromoModal';

const Hero = () => {
  const { t } = useLanguage();
  const [isDriverModalOpen, setIsDriverModalOpen] = React.useState(false);
  const [isAdvertisingModalOpen, setIsAdvertisingModalOpen] = React.useState(false);
  const [isEsimPromoModalOpen, setIsEsimPromoModalOpen] = React.useState(false);

  // Show eSIM promo modal after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsEsimPromoModalOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDriverClick = () => {
    setIsDriverModalOpen(true);
  };

  const handleAdvertiseClick = () => {
    setIsAdvertisingModalOpen(true);
  };

  return (
    <>
      <section id="inicio" className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Logo */}
          <div className="mb-8 animate-fade-in-up">
            <img 
              src="https://static.wixstatic.com/media/8bd644_9ed4e04b4f64455baa72f0fe7a701edc~mv2.png/v1/fill/w_744,h_154,al_c,lg_1,q_85,enc_avif,quality_auto/full%20chroma.png" 
              alt="TripTap Logo" 
              className="h-16 lg:h-24 w-auto mx-auto mb-6"
            />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up delay-200">
            {t('hero.title')}
            <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> {t('hero.experience')}</span>
            <br />{t('hero.subtitle')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-400">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-600">
            <button 
              onClick={handleDriverClick}
              className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {t('hero.cta.driver')}
            </button>
            <button 
              onClick={handleAdvertiseClick}
              className="border-2 border-[#EF5AFF] text-[#EF5AFF] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#EF5AFF] hover:text-white transition-all duration-300"
            >
              {t('hero.cta.advertise')}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up delay-800">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">+3</div>
              <div className="text-gray-300">{t('hero.stats.provinces')}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Car className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">+5K</div>
              <div className="text-gray-300">{t('hero.stats.taxis')}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">+240K</div>
              <div className="text-gray-300">{t('hero.stats.trips')}</div>
            </div>
          </div>
        </div>
      </div>
      </section>
      
      <DriverRegistrationModal 
        isOpen={isDriverModalOpen} 
        onClose={() => setIsDriverModalOpen(false)} 
      />
      
      <AdvertisingModal 
        isOpen={isAdvertisingModalOpen} 
        onClose={() => setIsAdvertisingModalOpen(false)}
      />
      
      <EsimPromoModal 
        isOpen={isEsimPromoModalOpen} 
        onClose={() => setIsEsimPromoModalOpen(false)}
      />
    </>
  );
};

export default Hero;