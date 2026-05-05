import React, { useState, useEffect } from 'react';
import { VillaData } from './VillaData';

const PropertyCard = ({ property, onContactClick }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const nextImg = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev + 1) % property.images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // Get status color based on status text - NEW RELEASE = ORANGE color
  const getStatusStyle = (status) => {
    if (status === 'NEW') {
      return {
        bg: 'bg-gradient-to-r from-orange-500 to-red-500',
        icon: '✨',
        animation: 'pulse-orange'
      };
    }

   
    if (status === 'RE-SALE') {
      return {
        bg: 'bg-gradient-to-r from-indigo-500 to-purple-500',
        icon: '🔄',
        animation: 'rotate-slow'
      };
    }
   
   
    return {
      bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
      icon: '🏷️',
      animation: ''
    };
  };

  const statusStyle = getStatusStyle(property.status);

  // Animation for the tag
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/90 to-teal-50/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 lg:p-8 border border-teal-200/30 hover:shadow-[0_0_60px_rgba(0,105,92,0.3)] transition-all duration-700 group mb-10 w-full lg:w-[75%] lg:ml-8">
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: IMAGE SECTION */}
          <div className="lg:w-[430px] flex h-[350px] bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
            <div className="w-[75%] relative overflow-hidden cursor-pointer" onClick={() => setShowImageModal(true)}>
              <img 
                src={property.images[activeImg]} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt="Villa"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop';
                }}
              />
              
              {/* STATUS BADGE - NEW RELEASE is ORANGE color */}
              <div className="absolute top-4 left-4 z-10">
                <div className={`${statusStyle.bg} text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-sm flex items-center gap-1.5 ${statusStyle.animation}`}>
                  <span className="text-xs">{statusStyle.icon}</span>
                  <span className="uppercase tracking-wider">{property.status}</span>
                </div>
              </div>
            </div>

            <div className="w-[25%] flex flex-col gap-1 p-1 bg-white">
              {property.images.slice(0, 2).map((img, idx) => (
                <div 
                  key={idx}
                  className={`flex-1 relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${activeImg === idx ? 'ring-2 ring-[#26A69A] shadow-md' : 'hover:shadow-md'}`}
                  onClick={() => setActiveImg(idx)}
                >
                  <img 
                    src={img} 
                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105" 
                    alt="thumb"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop';
                    }}
                  />
                  {idx === 1 && property.images.length > 2 && (
                    <div 
                      className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-black/80 transition-all duration-300 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowImageModal(true);
                      }}
                    >
                      <span className="text-xl font-bold">+{property.images.length - 1}</span>
                      <span className="text-[10px] uppercase font-bold tracking-tighter">Photos</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTENT SECTION */}
          <div className="flex-1 p-4 flex flex-col justify-between text-left">
            
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                  {property.price}
                </h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-[#00695C] font-bold text-lg bg-teal-50 px-2 py-0.5 rounded-lg">{property.sqftPrice}</span>
                  <span className="h-5 w-[1.5px] bg-gray-200"></span>
                  <span className="text-slate-600 font-bold text-lg flex items-center gap-1.5">
                    📐 {property.totalSqft}
                  </span>
                  <span className="text-slate-500 text-sm bg-gray-100 px-2 py-1 rounded-lg">
                    🏗️ {property.builtUp}
                  </span>
                </div>
              </div>
              
              {/* BUY/RENT/LEASE/SELL TAG with THEME COLORED SHADOW + LUXURY ANIMATION */}
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-white text-sm font-black tracking-wider uppercase flex items-center gap-2 transition-all duration-500"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)',
                  animation: isAnimating ? 'bounce 0.5s ease-in-out, tag-glow 0.5s ease-in-out' : 'tag-glow 2s infinite',
                  transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: '0 0 25px rgba(0, 105, 92, 0.7), 0 0 50px rgba(38, 166, 154, 0.4)'
                }}
              >
                <span className="text-base" style={{ animation: 'luxury-float 2s infinite' }}>
                  {property.tag === 'BUY' && '💰'}
                  {property.tag === 'RENT' && '🔑'}
                  {property.tag === 'LEASE' && '📄'}
                  {property.tag === 'SELL' && '🏷️'}
                </span>
                <span style={{ textShadow: '0 0 8px rgba(255,255,255,0.5)' }}>{property.tag}</span>
              </div>
            </div>

            {/* Location */}
            <div className="mt-5 flex items-start gap-3">
              <div className="bg-teal-100 p-2.5 rounded-xl text-[#00695C]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-slate-800 font-bold text-base leading-tight">{property.location}</p>
            </div>

            {/* HIGHLIGHTS */}
            <div className="mt-5">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#26A69A]"></span>
                Property Highlights
              </p>
              <div className="flex flex-wrap gap-2">
                {property.highlights.split('|').map((h, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/70 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-xl border border-teal-100 text-xs font-bold hover:bg-teal-50 hover:text-[#00695C] hover:border-teal-200 transition-all shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#26A69A]"></span>
                    {h.trim()}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-teal-100 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-lg text-lg transform transition-transform hover:scale-105">
                  {property.postedBy.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-[#00695C] font-bold uppercase tracking-widest">Listing Agent</p>
                  <p className="text-base font-black text-slate-800">{property.postedBy}</p>
                </div>
              </div>

              {/* CONTACT BUTTON with LUXURY SHADOW */}
              <button 
                onClick={onContactClick}
                className="bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-8 py-3.5 rounded-xl text-sm font-black transition-all duration-300 flex items-center gap-2 uppercase tracking-wider group"
                style={{
                  animation: 'button-shadow-pulse 2s infinite',
                  boxShadow: '0 0 25px rgba(0, 105, 92, 0.6), 0 10px 20px -5px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.animation = 'none';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 105, 92, 0.9), 0 15px 25px -8px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.animation = 'button-shadow-pulse 2s infinite';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 105, 92, 0.6), 0 10px 20px -5px rgba(0,0,0,0.2)';
                }}
              >
                <span className="group-hover:scale-110 transition-transform">📞</span>
                Contact Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY MODAL */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col animate-fadeIn"
          onClick={() => setShowImageModal(false)}
        >
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-5 flex justify-between items-center px-8">
            <div>
              <h3 className="text-white font-bold text-xl">📸 {property.location.split(',')[0]}</h3>
              <p className="text-white/80 text-sm mt-1">{property.images.length} Photos</p>
            </div>
            <button 
              onClick={() => setShowImageModal(false)} 
              className="text-white hover:text-gray-200 text-4xl transition-transform hover:scale-110"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-8" onClick={(e) => e.stopPropagation()}>
            <div className="relative max-w-6xl w-full">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black/50">
                <img 
                  src={property.images[activeImg]} 
                  alt="Gallery"
                  className="w-full h-auto max-h-[65vh] object-contain transition-all duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
                  }}
                />
              </div>
              
              <button 
                onClick={prevImg} 
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full transition-all duration-300 text-2xl flex items-center justify-center backdrop-blur hover:scale-110"
              >
                ❮
              </button>
              <button 
                onClick={nextImg} 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full transition-all duration-300 text-2xl flex items-center justify-center backdrop-blur hover:scale-110"
              >
                ❯
              </button>
              
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-lg text-white text-sm px-4 py-2 rounded-full">
                {activeImg + 1} / {property.images.length}
              </div>
            </div>
            
            <div className="flex gap-3 mt-16 overflow-x-auto pb-4 max-w-6xl justify-center">
              {property.images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    activeImg === idx 
                      ? 'ring-4 ring-[#26A69A] shadow-xl scale-105' 
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  onClick={() => setActiveImg(idx)}
                >
                  <img 
                    src={img} 
                    alt={`thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const IndependentVilla = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredData = activeFilter === 'ALL' 
    ? VillaData 
    : VillaData.filter(item => item.tag === activeFilter);

  const handleContactClick = (property) => {
    setSelectedProperty(property);
    setShowLoginModal(true);
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    setShowContactInfo(true);
    setTimeout(() => setShowContactInfo(false), 5000);
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-teal-50/30 py-12 px-4">
      <div className="max-w-[1600px] mx-auto">
      

        <div className="flex flex-col items-center lg:items-start">
          {filteredData.map((item) => (
            <PropertyCard 
              key={item.id} 
              property={item} 
              onContactClick={() => handleContactClick(item)} 
            />
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-16 bg-white/50 backdrop-blur rounded-3xl max-w-md mx-auto">
            <p className="text-gray-500 text-lg">No properties found</p>
          </div>
        )}
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
               <span className="text-2xl text-white">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Unlock Contact</h3>
            <p className="text-gray-500 text-xs text-center mb-6">
               Login to view contact details
            </p>
            <button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-2.5 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition"
            >
              Continue to Login
            </button>
            <button 
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-2 text-gray-500 text-xs py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showContactInfo && selectedProperty && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl shadow-2xl p-3 z-[200] animate-slideIn">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">📞</div>
            <div>
              <p className="font-bold text-xs">Agent Contact</p>
              <p className="text-[10px]">{selectedProperty.postedBy.toLowerCase().replace(/\s/g, '')}@elite.com</p>
              <p className="text-[10px]">+91 98765 43210</p>
            </div>
            <button onClick={() => setShowContactInfo(false)} className="text-white/70 text-lg">✕</button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        @keyframes tag-glow {
          0%, 100% { box-shadow: 0 0 25px rgba(0, 105, 92, 0.7), 0 0 50px rgba(38, 166, 154, 0.4), 0 10px 20px -5px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 0 45px rgba(0, 105, 92, 1), 0 0 70px rgba(38, 166, 154, 0.6), 0 15px 25px -5px rgba(0,0,0,0.3); }
        }
        @keyframes button-shadow-pulse {
          0%, 100% { box-shadow: 0 0 25px rgba(0, 105, 92, 0.6), 0 10px 20px -5px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 0 45px rgba(0, 105, 92, 0.9), 0 15px 25px -8px rgba(0,0,0,0.3); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes luxury-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pulse-orange {
          0%, 100% { box-shadow: 0 0 5px rgba(249, 115, 22, 0.5); transform: scale(1); }
          50% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.8); transform: scale(1.02); }
        }
        @keyframes rotate-slow {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        .pulse-orange {
          animation: pulse-orange 2s infinite;
        }
        .rotate-slow {
          animation: rotate-slow 3s infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default IndependentVilla;