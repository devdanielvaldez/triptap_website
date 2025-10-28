import React from 'react';
import { Tablet, Wifi, Zap, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const TabletSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Tablet className="w-6 h-6" />,
      title: t('tablet.feature.hd'),
      description: t('tablet.feature.hd.desc')
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: t('tablet.feature.connectivity'),
      description: t('tablet.feature.connectivity.desc')
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('tablet.feature.touch'),
      description: t('tablet.feature.touch.desc')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('tablet.feature.secure'),
      description: t('tablet.feature.secure.desc')
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t('tablet.title')}
                <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> {t('tablet.revolutionizing')}</span>
                <br />{t('tablet.subtitle')}
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                {t('tablet.description')}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
          </div>

          {/* Tablet Image */}
          <div className="flex-1 flex justify-center">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-110"></div>
              
              {/* Main image */}
              <div className="relative">
                <img 
                  src="https://static.wixstatic.com/media/8bd644_9c8bc0345e1540ea97543862319c60cf~mv2.png/v1/crop/x_0,y_2,w_1475,h_1376/fill/w_1368,h_1276,fp_0.50_0.50,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pantalla.png" 
                  alt="TripTap Interactive Tablet"
                  className="w-full max-w-lg h-auto group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#EF5AFF] rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#4EBEFF] rounded-full animate-bounce delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TabletSection;