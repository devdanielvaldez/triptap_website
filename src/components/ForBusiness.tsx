import React from 'react';
import { Target, TrendingUp, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const ForBusinesses = () => {
  const { t } = useLanguage();
  const [isAdvertisingModalOpen, setIsAdvertisingModalOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleAdvertiseClick = () => {
    setIsAdvertisingModalOpen(true);
  };

  // Import AdvertisingModal
  const AdvertisingModal = React.lazy(() => import('./AvertisingModal'));

  return (
    <>
      <section id="empresas" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Business Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-20 text-3xl animate-float opacity-20">📊</div>
        <div className="absolute top-60 right-32 text-2xl animate-float delay-1000 opacity-15">📈</div>
        <div className="absolute bottom-40 left-32 text-4xl animate-float delay-2000 opacity-10">💼</div>
        <div className="absolute bottom-32 right-20 text-2xl animate-float delay-500 opacity-20">🎯</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('business.title')}
            <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> {t('business.audiences')}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {t('business.description.short')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] mx-auto rounded-full"></div>
        </div>

        {/* Key Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{t('business.preview.targeting')}</h3>
            <p className="text-gray-300">{t('business.preview.targeting.desc')}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{t('business.preview.impressions')}</h3>
            <p className="text-gray-300">{t('business.preview.impressions.desc')}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{t('business.preview.analytics')}</h3>
            <p className="text-gray-300">{t('business.preview.analytics.desc')}</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">{t('business.ready.title')}</h3>
            <p className="text-gray-300 mb-6">
              {t('business.ready.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleAdvertiseClick}
                className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {t('business.cta.campaign')}
              </button>
              <button 
                onClick={() => navigate('/business')}
                className="border-2 border-[#EF5AFF] text-[#EF5AFF] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#EF5AFF] hover:text-white transition-all duration-300"
              >
                {t('business.cta.learn')}
              </button>
            </div>
          </div>
        </div>
      </div>
      </section>
      
      <React.Suspense fallback={<div>Loading...</div>}>
        <AdvertisingModal 
          isOpen={isAdvertisingModalOpen} 
          onClose={() => setIsAdvertisingModalOpen(false)}
        />
      </React.Suspense>
    </>
  );
};

export default ForBusinesses;