import React from 'react';
import { Target, Clock, Brain, TrendingUp, Eye, BarChart3, Users, Zap, Globe, Award, Smartphone, MousePointer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuoteModal from '../components/QuoteModal';

const BusinessPage = () => {
  const { t } = useLanguage();
  const [isAdvertisingModalOpen, setIsAdvertisingModalOpen] = React.useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = React.useState(false);

  const handleAdvertiseClick = () => {
    setIsAdvertisingModalOpen(true);
  };

  const handleQuoteClick = () => {
    setIsQuoteModalOpen(true);
  };
  // Import AdvertisingModal
  const AdvertisingModal = React.lazy(() => import('../components/AvertisingModal'));

  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: t('business.feature.audiences'),
      description: t('business.feature.audiences.desc'),
      gradient: 'from-[#EF5AFF] to-[#4EBEFF]'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('business.feature.hourly'),
      description: t('business.feature.hourly.desc'),
      gradient: 'from-blue-400 to-cyan-600'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: t('business.feature.ai'),
      description: t('business.feature.ai.desc'),
      gradient: 'from-purple-400 to-pink-600'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('business.feature.roi'),
      description: t('business.feature.roi.desc'),
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: t('business.feature.impressions'),
      description: t('business.feature.impressions.desc'),
      gradient: 'from-orange-400 to-red-600'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: t('business.feature.reports'),
      description: t('business.feature.reports.desc'),
      gradient: 'from-indigo-400 to-purple-600'
    }
  ];

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: '+240K',
      label: t('business.stats.passengers'),
      gradient: 'from-[#EF5AFF] to-[#4EBEFF]'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      number: '98%',
      label: t('business.stats.engagement'),
      gradient: 'from-yellow-400 to-orange-600'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: '+3',
      label: t('business.stats.provinces'),
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: '5X',
      label: t('business.stats.roi'),
      gradient: 'from-purple-400 to-pink-600'
    }
  ];

  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: t('business.advanced.interactive'),
      description: t('business.advanced.interactive.desc'),
      image: "https://static.wixstatic.com/media/77fac4_a83cb0adf6104677966d77753b537184~mv2.png/v1/fill/w_1188,h_548,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/touch-interactive-triptap.png"
    },
    {
      icon: <MousePointer className="w-8 h-8" />,
      title: t('business.advanced.targeting'),
      description: t('business.advanced.targeting.desc'),
      image: "https://static.wixstatic.com/media/8bd644_cee235e9533741528d41dcadc299117a~mv2.png/v1/fill/w_1188,h_548,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/preview%20interfaz%20.png"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('business.advanced.analytics'),
      description: t('business.advanced.analytics.desc'),
      image: "https://static.wixstatic.com/media/77fac4_c8eb23893abe45a38a77ea702f66d621~mv2.png/v1/fill/w_1188,h_548,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/geolocalizaci%C3%B3n-triptap.png"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center relative overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Business Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-20 text-4xl animate-float opacity-30">📊</div>
          <div className="absolute top-60 right-32 text-3xl animate-float delay-1000 opacity-25">📈</div>
          <div className="absolute bottom-40 left-32 text-5xl animate-float delay-2000 opacity-20">💼</div>
          <div className="absolute bottom-32 right-20 text-3xl animate-float delay-500 opacity-30">🎯</div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
              <span className="inline-block bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent text-lg font-semibold mb-4">
                {t('business.hero.subtitle')}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                {t('business.hero.title')}
                <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> {t('business.hero.smart')}</span>
                <br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">{t('business.hero.advertising')}</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              {t('business.hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-400">
              <button 
                onClick={handleAdvertiseClick}
                className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {t('business.hero.cta.start')}
              </button>
              <button 
                onClick={handleQuoteClick}
                className="border-2 border-[#EF5AFF] text-[#EF5AFF] px-12 py-4 rounded-full text-lg font-semibold hover:bg-[#EF5AFF] hover:text-white transition-all duration-300"
              >
                {t('business.cta.quote')}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up delay-600">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">{stat.icon}</div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('business.benefits.title')}
              <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> {t('business.benefits.powerful')}</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
                <div className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{benefit.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-gray-800 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('business.advanced.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-2xl flex items-center justify-center">
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

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

      {/* Detailed Features */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-16">
            <div className="bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 rounded-3xl p-12 border border-white/10">
              <div className="flex items-start space-x-6 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-2xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">{t('business.impressions.title')}</h3>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed">
                {t('business.impressions.description')}
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-[#EF5AFF] mb-2">100%</div>
                  <div className="text-gray-400">{t('business.impressions.verified')}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-[#4EBEFF] mb-2">Real-Time</div>
                  <div className="text-gray-400">{t('business.impressions.tracking')}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">ROI+</div>
                  <div className="text-gray-400">{t('business.impressions.optimization')}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#4EBEFF]/10 to-green-400/10 rounded-3xl p-12 border border-white/10">
              <div className="flex items-start space-x-6 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#4EBEFF] to-green-400 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">{t('business.reports.title')}</h3>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                {t('business.reports.description')}
              </p>
              <div className="relative">
                <img 
                  src="https://static.wixstatic.com/media/8bd644_fb9cff857b6948609d66de910e1e0570~mv2.jpeg/v1/crop/x_17,y_102,w_1263,h_729/fill/w_1262,h_729,fp_0.50_0.50,q_85,enc_avif,quality_auto/WhatsApp%20Image%202025-04-24%20at%2009_29_10.jpeg" 
                  alt="TripTap Analytics Dashboard"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('business.cta.title')}
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              {t('business.cta.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleAdvertiseClick}
                className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {t('business.cta.start')}
              </button>
              <button 
                onClick={handleQuoteClick}
                className="border-2 border-[#EF5AFF] text-[#EF5AFF] px-12 py-4 rounded-full text-lg font-semibold hover:bg-[#EF5AFF] hover:text-white transition-all duration-300"
              >
                {t('business.cta.quote')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
      
      <React.Suspense fallback={<div>Loading...</div>}>
        <AdvertisingModal 
          isOpen={isAdvertisingModalOpen} 
          onClose={() => setIsAdvertisingModalOpen(false)}
        />
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)}
      />
      </React.Suspense>
    </>
  );
};

export default BusinessPage;