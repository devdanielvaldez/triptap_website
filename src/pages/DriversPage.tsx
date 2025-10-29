import React from 'react';
import { Car, DollarSign, Clock, Smartphone, Users, TrendingUp, CheckCircle, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DriverRegistrationModal from '../components/DriverRegistrationModal';

const DriversPage = () => {
  const { t } = useLanguage();
  const [isDriverModalOpen, setIsDriverModalOpen] = React.useState(false);

  const handleDriverClick = () => {
    setIsDriverModalOpen(true);
  };

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: t('drivers.benefit1.title'),
      description: t('drivers.benefit1.description'),
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('drivers.benefit2.title'),
      description: t('drivers.benefit2.description'),
      gradient: 'from-[#EF5AFF] to-[#4EBEFF]'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t('drivers.benefit3.title'),
      description: t('drivers.benefit3.description'),
      gradient: 'from-blue-400 to-cyan-600'
    }
  ];

  const steps = [
    {
      number: '01',
      title: t('drivers.how.step1'),
      description: t('drivers.how.step1.desc'),
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      number: '02',
      title: t('drivers.how.step2'),
      description: t('drivers.how.step2.desc'),
      icon: <Car className="w-6 h-6" />
    },
    {
      number: '03',
      title: t('drivers.how.step3'),
      description: t('drivers.how.step3.desc'),
      icon: <DollarSign className="w-6 h-6" />
    }
  ];

  const platforms = [
    { name: 'Uber', logo: '🚗' },
    { name: 'Didi', logo: '🚕' },
    { name: 'InDrive', logo: '🚙' },
    { name: 'Independiente', logo: '🚘' }
  ];

  return (
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

  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Content */}
      <div className="text-center lg:text-left">
        <div className="mb-8 animate-fade-in-up">
          <span className="inline-block bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent text-lg font-semibold mb-4">
            Para Conductores
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {t('drivers.hero.title')}
            <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> {t('drivers.hero.subtitle')}</span>
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl animate-fade-in-up delay-200">
          {t('drivers.hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-fade-in-up delay-400">
          <button 
            onClick={handleDriverClick}
            className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {t('drivers.hero.cta.join')}
          </button>
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16 animate-fade-in-up delay-500">
          <a 
            href="https://apps.apple.com/us/app/triptap-drivers/id6748827812" 
            className="inline-block transition-transform duration-300 hover:scale-105"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" 
              alt="Download on App Store" 
              className="h-12 w-auto max-w-[160px]"
            />
          </a>
          <a 
            href="https://play.google.com/store/apps/details?id=com.triptap.drivers" 
            className="inline-block transition-transform duration-300 hover:scale-105"
          >
            <img 
              src="https://bciconline.com/wp-content/uploads/2025/09/1664287128google-play-store-logo-png.png" 
              alt="Get it on Google Play" 
              className="h-12 w-auto max-w-[160px]"
            />
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 animate-fade-in-up delay-600 mb-20">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-gray-400 text-sm">Ganancias Viajes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#EF5AFF] mb-2">24h</div>
            <div className="text-gray-400 text-sm">Pagos Rápidos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#4EBEFF] mb-2">+5K</div>
            <div className="text-gray-400 text-sm">Conductores</div>
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="flex justify-center lg:justify-end animate-fade-in-up delay-800">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-110"></div>
          <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full max-w-lg h-auto group-hover:scale-105 transition-transform duration-500"
            >
              <source src="https://video.wixstatic.com/video/77fac4_3dd5d2f7fa4b44fe9bf3b91ec3b66672/1080p/mp4/file.mp4" type="video/mp4" />
            </video>
            
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#EF5AFF] rounded-full animate-bounce delay-500"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Beneficios
              <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"> Exclusivos</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-16">
            {benefits.map((benefit, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">{benefit.icon}</div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{benefit.title}</h3>
                    </div>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 flex justify-center">
                  <div className={`w-64 h-64 bg-gradient-to-r ${benefit.gradient} rounded-full opacity-20 animate-pulse`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-800 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('drivers.how.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 text-center group-hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
                
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Compatibility */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('drivers.compatibility.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('drivers.compatibility.description')}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] mx-auto rounded-full mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 text-center group hover:scale-105">
                <div className="text-4xl mb-4">{platform.logo}</div>
                <h3 className="text-lg font-semibold text-white">{platform.name}</h3>
                <div className="w-full h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('drivers.stats.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">+5,000</div>
              <div className="text-gray-300">{t('drivers.stats.drivers')}</div>
            </div>


            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#4EBEFF] to-[#EF5AFF] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-300">{t('drivers.stats.satisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#EF5AFF]/10 to-green-400/10 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('drivers.cta.title')}
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              {t('drivers.cta.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleDriverClick}
                className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {t('drivers.cta.register')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <DriverRegistrationModal 
        isOpen={isDriverModalOpen} 
        onClose={() => setIsDriverModalOpen(false)} 
      />
    </div>
  );
};

export default DriversPage;