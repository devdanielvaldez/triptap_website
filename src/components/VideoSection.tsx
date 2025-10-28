import React from 'react';

const VideoSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#EF5AFF] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#4EBEFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Driver Video */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
              >
                <source src="https://video.wixstatic.com/video/77fac4_86ccd34d296145108bd6c12852a21182/1080p/mp4/file.mp4" type="video/mp4" />
              </video>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#EF5AFF] rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#4EBEFF] rounded-full animate-bounce delay-500"></div>
            </div>
          </div>

          {/* App Promo Video */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4EBEFF] to-[#EF5AFF] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
              >
                <source src="https://video.wixstatic.com/video/77fac4_3dd5d2f7fa4b44fe9bf3b91ec3b66672/1080p/mp4/file.mp4" type="video/mp4" />
              </video>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#4EBEFF] rounded-full animate-bounce delay-300"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#EF5AFF] rounded-full animate-bounce delay-700"></div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#4EBEFF] rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse delay-400"></div>
            <div className="w-2 h-2 bg-[#4EBEFF] rounded-full animate-pulse delay-600"></div>
            <div className="w-2 h-2 bg-[#EF5AFF] rounded-full animate-pulse delay-800"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;