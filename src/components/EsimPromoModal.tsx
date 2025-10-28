import React from 'react';
import { X, Wifi, Globe, Smartphone, Zap, Shield, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface EsimPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EsimPromoModal: React.FC<EsimPromoModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const handleExploreClick = () => {
    window.location.href = '/esim';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-3xl max-w-4xl w-full mx-4 border border-white/10 animate-scale-in overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:top-6 lg:right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] lg:min-h-[500px]">
          {/* Left Side - Content */}
          <div className="p-6 lg:p-12 order-2 lg:order-1">
            {/* Header */}
            <div className="mb-6 lg:mb-8 text-center lg:text-left">
              <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('esim.promo.title')}
                <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> eSIM</span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                {t('esim.promo.subtitle')}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm lg:text-base">{t('esim.promo.feature1')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#4EBEFF] to-[#EF5AFF] rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm lg:text-base">{t('esim.promo.feature2')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm lg:text-base">{t('esim.promo.feature3')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm lg:text-base">{t('esim.promo.feature4')}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 lg:gap-4">
              <button 
                onClick={handleExploreClick}
                className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-6 lg:px-8 py-3 lg:py-4 rounded-full text-base lg:text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {t('esim.promo.cta.explore')}
              </button>
              <button 
                onClick={onClose}
                className="border-2 border-[#EF5AFF] text-[#EF5AFF] px-6 lg:px-8 py-3 lg:py-4 rounded-full text-base lg:text-lg font-semibold hover:bg-[#EF5AFF] hover:text-white transition-all duration-300"
              >
                {t('esim.promo.cta.later')}
              </button>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="bg-gradient-to-br from-[#EF5AFF]/20 to-[#4EBEFF]/20 p-6 lg:p-12 flex items-center justify-center relative overflow-hidden order-1 lg:order-2 min-h-[200px] lg:min-h-auto">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-5 left-5 lg:top-10 lg:left-10 w-20 h-20 lg:w-32 lg:h-32 bg-[#EF5AFF] rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-5 right-5 lg:bottom-10 lg:right-10 w-24 h-24 lg:w-40 lg:h-40 bg-[#4EBEFF] rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-10 lg:top-20 lg:left-20 text-2xl lg:text-4xl animate-float opacity-60">📱</div>
              <div className="absolute top-20 right-10 lg:top-40 lg:right-20 text-xl lg:text-3xl animate-float delay-1000 opacity-50">🌐</div>
              <div className="absolute bottom-20 left-10 lg:bottom-40 lg:left-20 text-3xl lg:text-5xl animate-float delay-2000 opacity-40">📶</div>
              <div className="absolute bottom-10 right-10 lg:bottom-20 lg:right-20 text-xl lg:text-3xl animate-float delay-500 opacity-60">✈️</div>
            </div>

            {/* Central phone mockup */}
            <div className="relative z-10">
              <div className="w-32 h-56 lg:w-48 lg:h-80 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl lg:rounded-3xl p-3 lg:p-4 shadow-2xl border border-white/20">
                <div className="w-full h-full bg-gradient-to-br from-[#EF5AFF]/30 to-[#4EBEFF]/30 rounded-2xl flex flex-col items-center justify-center space-y-4">
                  <Smartphone className="w-10 h-10 lg:w-16 lg:h-16 text-white animate-pulse" />
                  <div className="text-center">
                    <div className="text-white font-bold text-sm lg:text-lg">eSIM</div>
                    <div className="text-gray-300 text-xs lg:text-sm">TripTap</div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#4EBEFF] rounded-full animate-pulse delay-200"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF]"></div>
      </div>
    </div>
  );
};

export default EsimPromoModal;