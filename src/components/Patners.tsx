import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Partners = () => {
  const { t } = useLanguage();

  const partners = [
    {
      name: "Universal Music Group",
      logo: "https://static.wixstatic.com/media/8bd644_ab4960af81fd4491a7378d40e6ad34f7~mv2.png/v1/fill/w_332,h_188,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/pngfind_edited.png"
    },
    {
      name: "Visa",
      logo: "https://static.wixstatic.com/media/8bd644_1bd2c27268fd4b11bfcdd4684ba798b3~mv2.png/v1/fill/w_348,h_232,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/pngwing_com%20(5).png"
    },
    {
      name: "Mastercard",
      logo: "https://static.wixstatic.com/media/8bd644_b1b290aeaa624b12a487dd5f4913102d~mv2.png/v1/crop/x_0,y_0,w_842,h_764/fill/w_212,h_192,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/pngwing_com%20(2).png"
    },
    {
      name: "American Express",
      logo: "https://static.wixstatic.com/media/8bd644_43862e1b4103472f86accaaeb3c443b2~mv2.png/v1/fill/w_356,h_238,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/pngwing_com%20(3).png"
    }
  ];

  return (
    <section id="aliados" className="py-20 bg-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#EF5AFF] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4EBEFF] to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('partners.title')}
            <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> {t('partners.allies')}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('partners.description')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] mx-auto rounded-full mt-6"></div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center justify-center h-24">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse"></div>
              <span>{t('partners.global')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#4EBEFF] rounded-full animate-pulse delay-200"></div>
              <span>{t('partners.technology')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse delay-400"></div>
              <span>{t('partners.reach')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;