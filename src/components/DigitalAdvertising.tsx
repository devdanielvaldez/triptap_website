import React from 'react';
import { Users, MousePointer, BarChart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const DigitalAdvertising = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: t('advertising.connection.title'),
      description: t('advertising.connection.description'),
      image: "https://static.wixstatic.com/media/8bd644_cee235e9533741528d41dcadc299117a~mv2.png/v1/fill/w_1188,h_548,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/preview%20interfaz%20.png"
    },
    {
      icon: <MousePointer className="w-8 h-8" />,
      title: t('advertising.interactive.title'),
      description: t('advertising.interactive.description'),
      image: "https://static.wixstatic.com/media/77fac4_a83cb0adf6104677966d77753b537184~mv2.png/v1/fill/w_1188,h_548,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/touch-interactive-triptap.png"
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: t('advertising.analytics.title'),
      description: t('advertising.analytics.description'),
      image: "https://static.wixstatic.com/media/77fac4_c8eb23893abe45a38a77ea702f66d621~mv2.png/v1/fill/w_1188,h_548,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/geolocalizaci%C3%B3n-triptap.png"
    }
  ];

  return (
    <section id="publicidad" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EF5AFF] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('advertising.title')}
            <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> {t('advertising.digital')}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] mx-auto rounded-full"></div>
        </div>

        {/* Features */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-2xl flex items-center justify-center">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{feature.title}</h3>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                  {feature.description}
                </p>
                
                {/* Decorative elements */}
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#4EBEFF] rounded-full animate-pulse delay-200"></div>
                  <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse delay-400"></div>
                </div>
              </div>

              {/* Image */}
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="relative rounded-2xl shadow-2xl w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalAdvertising;