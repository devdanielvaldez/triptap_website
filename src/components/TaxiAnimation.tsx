import React from 'react';

const TaxiAnimations = () => {
  return (
    <>
      {/* Floating Taxi Icons */}
      <div className="fixed top-20 left-10 z-0 opacity-20 animate-float">
        <div className="text-6xl">🚕</div>
      </div>
      <div className="fixed top-40 right-20 z-0 opacity-15 animate-float delay-1000">
        <div className="text-4xl">🚗</div>
      </div>
      <div className="fixed bottom-40 left-20 z-0 opacity-10 animate-float delay-2000">
        <div className="text-5xl">🚙</div>
      </div>
      <div className="fixed bottom-20 right-10 z-0 opacity-20 animate-float delay-500">
        <div className="text-3xl">🚘</div>
      </div>

      {/* Moving Taxi Animation */}
      <div className="fixed top-1/2 left-0 z-0 opacity-10">
        <div className="animate-drive-across text-4xl">🚕💨</div>
      </div>

      {/* Advertising Icons */}
      <div className="fixed top-32 right-32 z-0 opacity-15 animate-pulse">
        <div className="text-3xl">📱</div>
      </div>
      <div className="fixed bottom-32 left-32 z-0 opacity-10 animate-pulse delay-1000">
        <div className="text-4xl">📺</div>
      </div>
      <div className="fixed top-60 left-60 z-0 opacity-15 animate-pulse delay-2000">
        <div className="text-2xl">💰</div>
      </div>

      {/* Floating Money Animation */}
      <div className="fixed top-1/4 right-1/4 z-0 opacity-20">
        <div className="animate-money-float text-2xl">💵</div>
      </div>
      <div className="fixed bottom-1/4 left-1/4 z-0 opacity-15">
        <div className="animate-money-float delay-1000 text-2xl">💸</div>
      </div>

      {/* Route Lines */}
      <div className="fixed inset-0 z-0 opacity-5">
        <svg className="w-full h-full">
          <path
            d="M0,100 Q200,50 400,100 T800,100"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-dash"
          />
          <path
            d="M0,300 Q300,250 600,300 T1200,300"
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
            className="animate-dash delay-1000"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF5AFF" />
              <stop offset="100%" stopColor="#4EBEFF" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4EBEFF" />
              <stop offset="100%" stopColor="#EF5AFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Particle System */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </>
  );
};

export default TaxiAnimations;