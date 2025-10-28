import React from 'react';
import { Target, Zap, BarChart3, Users, Eye, MousePointer, Smartphone, Globe, TrendingUp, Play, Pause, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdvertisingModal from '../components/AvertisingModal';

const AdvertisingPage = () => {
  const { t } = useLanguage();
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(true);
  const [isAdvertisingModalOpen, setIsAdvertisingModalOpen] = React.useState(false);

  const handleAdvertiseClick = () => {
    setIsAdvertisingModalOpen(true);
  };

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Segmentación IA',
      description: 'Reconocimiento automático de género y edad para mostrar anuncios personalizados',
      gradient: 'from-[#EF5AFF] to-[#4EBEFF]',
      stats: '98% Precisión'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Impresiones Verificadas',
      description: 'Cada visualización es real y verificada, garantizando transparencia total',
      gradient: 'from-green-400 to-emerald-600',
      stats: '100% Reales'
    },
    {
      icon: <MousePointer className="w-8 h-8" />,
      title: 'Interactividad Total',
      description: 'Botones, formularios y encuestas que generan engagement inmediato',
      gradient: 'from-blue-400 to-cyan-600',
      stats: '5x Engagement'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics Avanzado',
      description: 'Métricas en tiempo real con geolocalización y datos demográficos',
      gradient: 'from-purple-400 to-pink-600',
      stats: 'Tiempo Real'
    }
  ];

  const adFormats = [
    {
      title: 'Video Interactivo',
      description: 'Videos HD con botones de acción integrados',
      image: 'https://static.wixstatic.com/media/77fac4_a83cb0adf6104677966d77753b537184~mv2.png/v1/fill/w_1188,h_548,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/touch-interactive-triptap.png',
      icon: <Play className="w-6 h-6" />
    },
    {
      title: 'Banner Dinámico',
      description: 'Anuncios adaptativos con animaciones llamativas',
      image: 'https://static.wixstatic.com/media/8bd644_cee235e9533741528d41dcadc299117a~mv2.png/v1/fill/w_1188,h_548,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/preview%20interfaz%20.png',
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: 'Encuestas Interactivas',
      description: 'Captura datos valiosos de tu audiencia',
      image: 'https://static.wixstatic.com/media/77fac4_c8eb23893abe45a38a77ea702f66d621~mv2.png/v1/fill/w_1188,h_548,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/geolocalizaci%C3%B3n-triptap.png',
      icon: <Users className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section with Video Background */}
      <section className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="https://video.wixstatic.com/video/77fac4_86ccd34d296145108bd6c12852a21182/1080p/mp4/file.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-purple-900/60 to-gray-900/80"></div>
        </div>

        {/* Floating Ad Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-4xl animate-float opacity-30">📱</div>
          <div className="absolute top-40 right-20 text-3xl animate-float delay-1000 opacity-25">📺</div>
          <div className="absolute bottom-40 left-20 text-5xl animate-float delay-2000 opacity-20">🎯</div>
          <div className="absolute bottom-20 right-10 text-3xl animate-float delay-500 opacity-30">💰</div>
          <div className="absolute top-60 left-1/2 text-2xl animate-float delay-1500 opacity-25">📊</div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
              <span className="inline-block bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent text-lg font-semibold mb-4">
                Publicidad Revolucionaria
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                El Futuro de la
                <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> Publicidad</span>
                <br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Está en Movimiento</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Transforma cada taxi en una poderosa plataforma publicitaria interactiva. Con IA que reconoce audiencias y métricas en tiempo real, tu marca alcanza nuevas alturas.
            </p>

            {/* Interactive Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-fade-in-up delay-400">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent mb-2">240K+</div>
                <div className="text-gray-400 text-sm">Impresiones/Mes</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-2">98%</div>
                <div className="text-gray-400 text-sm">Precisión IA</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent mb-2">5X</div>
                <div className="text-gray-400 text-sm">Engagement</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Analytics</div>
              </div>
            </div>

            {/* CTA */}
            <button 
              onClick={handleAdvertiseClick}
              className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg animate-fade-in-up delay-600"
            >
              Crear Mi Campaña Ahora
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tecnología
              <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> Revolucionaria</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${feature.gradient} text-white`}>
                        {feature.stats}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Formats Section */}
      <section className="py-20 bg-gray-800 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Formatos
              <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"> Publicitarios</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-24">
            {adFormats.map((format, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-2xl flex items-center justify-center">
                      <div className="text-white">{format.icon}</div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{format.title}</h3>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {format.description}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <img 
                      src={format.image} 
                      alt={format.title}
                      className="relative rounded-2xl shadow-2xl w-full h-auto group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay with play button */}
                    <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Dashboard Preview */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Dashboard
              <span className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] bg-clip-text text-transparent"> en Tiempo Real</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Monitorea el rendimiento de tus campañas con métricas detalladas y análisis geográfico
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] mx-auto rounded-full mt-6"></div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 rounded-3xl blur-2xl"></div>
            <img 
              src="https://static.wixstatic.com/media/8bd644_fb9cff857b6948609d66de910e1e0570~mv2.jpeg/v1/crop/x_17,y_102,w_1263,h_729/fill/w_1262,h_729,fp_0.50_0.50,q_85,enc_avif,quality_auto/WhatsApp%20Image%202025-04-24%20at%2009_29_10.jpeg" 
              alt="TripTap Analytics Dashboard"
              className="relative w-full rounded-3xl shadow-2xl border border-white/10"
            />
            
            {/* Floating metrics */}
            <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
              <div className="text-green-400 font-bold text-lg">+15.2%</div>
              <div className="text-green-300 text-sm">CTR Hoy</div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
              <div className="text-blue-400 font-bold text-lg">2,847</div>
              <div className="text-blue-300 text-sm">Impresiones</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para Revolucionar tu Publicidad?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Únete a las marcas líderes que ya están aprovechando el poder de la publicidad inteligente en movimiento
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleAdvertiseClick}
                className="bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Comenzar Ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <AdvertisingModal 
        isOpen={isAdvertisingModalOpen} 
        onClose={() => setIsAdvertisingModalOpen(false)}
      />
    </div>
  );
};

export default AdvertisingPage;