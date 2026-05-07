import React, { useState, useEffect } from 'react';
import { VillaData } from './VillaData';

const PAGE_NAME = "Independent Villa";

// Helper: split price into amount + unit
const splitPrice = (price) => {
  if (!price) return { num: '', unit: '' };
  const match = price.match(/^(\s*₹[\d.,]+)(.*)$/);
  if (!match) return { num: price, unit: '' };
  return { num: match[1].trim(), unit: match[2].trim() };
};

// Helper: extract BHK from highlights
const extractBHK = (highlights) => {
  if (!highlights) return '';
  const match = highlights.match(/(\d+\s*\+?\s*BHK)/i);
  return match ? match[1].trim() : '';
};

const PropertyCard = ({ property, onContactClick }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [galleryActiveImg, setGalleryActiveImg] = useState(0);
  const [logoError, setLogoError] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);

  const nextImg = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev + 1) % property.images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const nextGalleryImg = (e) => {
    e.stopPropagation();
    setGalleryActiveImg((prev) => (prev + 1) % property.images.length);
  };

  const prevGalleryImg = (e) => {
    e.stopPropagation();
    setGalleryActiveImg((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleGalleryThumbnailClick = (idx) => {
    setGalleryActiveImg(idx);
  };

  const handleImageDoubleClick = (idx, e) => {
    e.stopPropagation();
    setGalleryActiveImg(idx);
    setShowFullGallery(true);
  };

  const getStatusStyle = (status) => {
    if (status === 'NEW') {
      return {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
        icon: '✨',
        animation: 'pulse-green'
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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { num: priceNum, unit: priceUnit } = splitPrice(property.price);
  const bhk = extractBHK(property.highlights);

  const getRoleTitle = () => {
    if (property.postedAs === 'Agent') return 'Real Estate Agent';
    if (property.postedAs === 'Builder') return 'Builder / Developer';
    if (property.postedAs === 'Seller') return 'Property Seller';
    if (property.tag === 'BUY') return 'Property Owner';
    if (property.tag === 'SELL') return 'Property Seller';
    if (property.tag === 'RENT') return 'Property Owner';
    if (property.tag === 'LEASE') return 'Property Lessor';
    return 'Listed By';
  };

  const getListedByText = () => {
    if (property.postedAs === 'Agent') return '🏢 Listed By (Agent)';
    if (property.postedAs === 'Builder') return '🏗️ Listed By (Builder)';
    if (property.postedAs === 'Seller') return '💰 Listed By (Seller)';
    if (property.tag === 'BUY') return '🏠 Listed By (Owner)';
    if (property.tag === 'SELL') return '💰 Listed By (Seller)';
    if (property.tag === 'RENT') return '🔑 Listed By (Owner)';
    if (property.tag === 'LEASE') return '📄 Listed By (Lessor)';
    return '👤 Listed By';
  };

  const getShortDetails = () => {
    if (!property.agentDetails) return '';
    if (property.agentDetails.length <= 40) return property.agentDetails;
    return property.agentDetails.substring(0, 40) + '...';
  };

  const imageCount = property.images.length;

  return (
    <>
      {/* MAIN CARD - OPTIMAL READABLE SIZE */}
      <div 
        className="w-full bg-gradient-to-br from-teal-50/90 via-emerald-50/90 to-teal-50/90 rounded-xl shadow-lg border border-teal-200/30 p-4 mb-4 overflow-hidden transition-all duration-500 group"
      >
        {/* FLEX ROW */}
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* IMAGE SECTION - OPTIMAL SIZE */}
          <div className="w-full lg:w-[35%] xl:w-[32%]">
            <div className="flex flex-row bg-gray-100 rounded-lg overflow-hidden shadow-md" style={{ height: '200px' }}>
              
              {/* MAIN IMAGE */}
              <div className="flex-1 h-full overflow-hidden relative cursor-pointer" onDoubleClick={(e) => handleImageDoubleClick(activeImg, e)}>
                <img
                  src={property.images[activeImg]}
                  alt="Villa"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop';
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  Double click
                </div>
                <div className="absolute top-2 left-2 z-10">
                  <div className={`${statusStyle.bg} text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md flex items-center gap-1 ${statusStyle.animation}`}>
                    <span className="text-[10px]">{statusStyle.icon}</span>
                    <span className="uppercase tracking-wider text-[9px]">{property.status}</span>
                  </div>
                </div>
              </div>
              
              {/* THUMBNAILS */}
              <div 
                className="h-full overflow-y-auto bg-white flex flex-col gap-1 p-1"
                style={{ width: imageCount <= 2 ? '70px' : imageCount <= 3 ? '75px' : imageCount <= 4 ? '80px' : '85px' }}
              >
                {property.images.map((img, idx) => {
                  const gapTotal = (imageCount - 1) * 4;
                  const itemHeight = `calc((100% - ${gapTotal}px) / ${imageCount})`;
                  
                  return (
                    <div
                      key={idx}
                      className={`relative overflow-hidden rounded cursor-pointer transition-all duration-200 flex-shrink-0 ${
                        activeImg === idx ? 'ring-2 ring-[#26A69A] shadow-sm' : 'hover:shadow-sm'
                      }`}
                      style={{ height: itemHeight, minHeight: '40px' }}
                      onClick={() => setActiveImg(idx)}
                      onDoubleClick={(e) => handleImageDoubleClick(idx, e)}
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt="thumb"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop';
                        }}
                      />
                      {imageCount > 5 && idx === 2 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-[10px]">
                          +{imageCount - 2}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CONTENT SECTION - READABLE TEXT SIZES */}
          <div className="flex-1 flex flex-col gap-2">
            
            {/* PRICE AND HEADER */}
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                  <span className="font-black text-slate-900 text-2xl md:text-3xl">{priceNum}</span>
                  {priceUnit && <span className="font-bold text-slate-600 text-sm md:text-base">{priceUnit}</span>}
                  {bhk && <span className="font-black text-[#00695C] text-xl md:text-2xl">({bhk})</span>}
                </div>
                
                {/* ALL THREE IN ONE LINE */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="text-[#00695C] font-bold bg-teal-50 px-2 py-1 rounded-md text-xs md:text-sm">{property.sqftPrice}</span>
                  <span className="text-slate-600 font-bold flex items-center gap-1 text-xs md:text-sm">📐 {property.totalSqft}</span>
                  <span className="text-slate-500 bg-gray-100 px-2 py-1 rounded-md text-xs md:text-sm">🏗️ {property.builtUp}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1 font-bold text-slate-500 uppercase tracking-wide text-[9px] md:text-[10px]">
                  <span className="w-3 h-px bg-slate-300"></span>
                  <span>{PAGE_NAME}</span>
                </div>
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black tracking-wider uppercase flex items-center justify-center gap-1 whitespace-nowrap text-[10px] md:text-xs"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%, 8% 50%)',
                    padding: '4px 16px',
                    minWidth: '80px'
                  }}
                >
                  <span className="text-xs md:text-sm">
                    {property.tag === 'BUY' && '💰'}
                    {property.tag === 'RENT' && '🔑'}
                    {property.tag === 'LEASE' && '📄'}
                    {property.tag === 'SELL' && '🏷️'}
                  </span>
                  <span>{property.tag}</span>
                </div>
              </div>
            </div>

            {/* LOCATION */}
            <div className="flex items-start gap-2">
              <div className="bg-teal-100 p-1.5 rounded-lg text-[#00695C] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-slate-800 font-bold text-sm md:text-base leading-tight">{property.location}</p>
            </div>

            {/* HIGHLIGHTS */}
            <div>
              <p className="font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-2 text-[9px] md:text-[10px]">
                <span className="w-5 h-px bg-[#26A69A]"></span>
                Property Highlights
              </p>
              <div className="flex flex-wrap gap-1.5">
                {property.highlights.split('|').map((h, i) => (
                  <div key={i} className="flex items-center gap-1 bg-white/70 text-slate-700 px-2 py-1 rounded-lg border border-teal-100 font-medium text-[10px] md:text-xs">
                    <span className="w-1 h-1 rounded-full bg-[#26A69A] shrink-0"></span>
                    <span>{h.trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* POSTED BY SECTION */}
            <div className="pt-2 border-t border-teal-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                
                <div className="flex items-center gap-3 flex-1 min-w-[180px]">
                  <div className="rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-md overflow-hidden shrink-0 w-10 h-10 md:w-12 md:h-12 text-base md:text-lg">
                    {property.logo && !logoError ? (
                      <img src={property.logo} alt="logo" className="w-full h-full object-cover" onError={() => setLogoError(true)} />
                    ) : (
                      <span>{property.postedBy.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#00695C] font-bold uppercase tracking-wider text-[8px] md:text-[9px]">{getListedByText()}</p>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <p className="font-black text-slate-800 break-words text-sm md:text-base">{property.postedBy}</p>
                      {property.agentDetails && (
                        <span className="text-gray-600 truncate max-w-[100px] text-[9px] md:text-[10px]">({getShortDetails()})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="text-teal-600 font-medium text-[9px] md:text-[10px]">{getRoleTitle()}</span>
                      {property.agentDetails && (
                        <button onClick={() => setShowAgentModal(true)} className="text-teal-500 hover:text-teal-700 underline flex items-center gap-0.5 text-[9px] md:text-[10px]">
                          📖 View Details →
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onContactClick}
                  className="bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-bold rounded-lg flex items-center gap-1 whitespace-nowrap shadow-md hover:shadow-lg transition-all shrink-0 px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm"
                >
                  <span className="text-xs md:text-sm">📞</span>
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLETE DETAILS MODAL */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowAgentModal(false)}>
          <div className="bg-white rounded-2xl max-w-[95%] sm:max-w-lg md:max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-5 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  {property.tag === 'BUY' && '🏠'}
                  {property.tag === 'SELL' && '💰'}
                  {property.tag === 'RENT' && '🔑'}
                  {property.tag === 'LEASE' && '📄'}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg md:text-xl">Complete Details</h3>
                  <p className="text-white/80 text-xs md:text-sm">{property.postedAs || getRoleTitle()}</p>
                </div>
              </div>
              <button onClick={() => setShowAgentModal(false)} className="text-white hover:text-gray-200 text-3xl transition-transform hover:scale-110">✕</button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 pb-4 border-b border-teal-100 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-lg text-xl overflow-hidden">
                  {property.logo && !logoError ? (
                    <img src={property.logo} alt="logo" className="w-full h-full object-cover" onError={() => setLogoError(true)} />
                  ) : (
                    <span>{property.postedBy.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-[#00695C] font-bold uppercase tracking-wider">{getListedByText()}</p>
                  <p className="text-xl md:text-2xl font-black text-slate-800">{property.postedBy}</p>
                  <p className="text-xs md:text-sm text-teal-600 font-medium mt-0.5">{getRoleTitle()}</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Property Information
                </h4>
                <div className="bg-teal-50/50 rounded-xl p-4 space-y-2">
                  <p className="text-sm"><strong>Property ID:</strong> {property.id}</p>
                  <p className="text-sm"><strong>Listed Price:</strong> {property.price} {bhk && `(${bhk})`}</p>
                  <p className="text-sm"><strong>{property.sqftPrice}</strong> • 📐 {property.totalSqft} • 🏗️ {property.builtUp}</p>
                  <p className="text-sm"><strong>📍 Location:</strong> {property.location}</p>
                  <p className="text-sm"><strong>🏷️ Status:</strong> <span className={`px-2 py-0.5 rounded-full text-white text-xs ${property.status === 'NEW' ? 'bg-green-500' : property.status === 'RE-SALE' ? 'bg-purple-500' : 'bg-gray-500'}`}>{property.status}</span></p>
                  <p className="text-sm"><strong>📌 Listing Type:</strong> {property.tag}</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Property Highlights
                </h4>
                <div className="bg-teal-50/50 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {property.highlights.split('|').map((h, i) => (
                      <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100">✨ {h.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  About {property.postedAs === 'Agent' ? 'Agent' : property.postedAs === 'Builder' ? 'Builder' : property.postedAs === 'Seller' ? 'Seller' : 'Owner'}
                </h4>
                <div className="bg-teal-50/50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{property.agentDetails || "No additional details provided."}</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Contact Information
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-sm flex items-center gap-2 break-all"><span className="text-teal-600">📧</span><span>{property.contactEmail || property.postedBy.toLowerCase().replace(/\s/g, '') + '@example.com'}</span></p>
                  <p className="text-sm flex items-center gap-2"><span className="text-teal-600">📞</span><span>{property.contactPhone || '+91 98765 43210'}</span></p>
                  <p className="text-sm flex items-center gap-2"><span className="text-teal-600">📍</span><span>{property.location}</span></p>
                </div>
              </div>
              {(property.experience || property.achievements) && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Additional Information
                  </h4>
                  <div className="bg-teal-50/30 rounded-xl p-4 space-y-2">
                    {property.experience && <p className="text-sm flex items-center gap-2"><span className="text-teal-600">⭐</span><span><strong>Experience:</strong> {property.experience}</span></p>}
                    {property.achievements && <p className="text-sm flex items-center gap-2"><span className="text-teal-600">🏆</span><span><strong>Achievements:</strong> {property.achievements}</span></p>}
                  </div>
                </div>
              )}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Gallery ({property.images.length} Photos)
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {property.images.slice(0, 6).map((img, idx) => (
                    <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-teal-200">
                      <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {property.images.length > 6 && (
                    <div className="w-16 h-16 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">
                      +{property.images.length - 6}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-5 pt-4 border-t border-teal-100">
                <button onClick={() => { setShowAgentModal(false); onContactClick(); }} className="flex-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105">📞 Contact Now</button>
                <button onClick={() => setShowAgentModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-gray-200">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL GALLERY MODAL */}
      {showFullGallery && (
        <div className="fixed inset-0 bg-black/95 z-[150] flex flex-col animate-fadeIn" onClick={() => setShowFullGallery(false)}>
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 md:p-4 flex justify-between items-center px-4 md:px-6">
            <div className="pr-2">
              <h3 className="text-white font-bold text-sm md:text-lg truncate max-w-[180px] md:max-w-none">{property.location.split(',')[0]}</h3>
              <p className="text-white/80 text-[10px] md:text-xs mt-0.5">Double click any image to view full size</p>
            </div>
            <button onClick={() => setShowFullGallery(false)} className="text-white hover:text-gray-200 text-2xl md:text-3xl transition-transform hover:scale-110 shrink-0">✕</button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 pb-2" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-4xl">
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black/50">
                <img src={property.images[galleryActiveImg]} alt="Gallery main" className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'; }} />
              </div>
              <button onClick={prevGalleryImg} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-10 md:h-10 rounded-full transition-all text-sm md:text-xl flex items-center justify-center backdrop-blur hover:scale-110">❮</button>
              <button onClick={nextGalleryImg} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-10 md:h-10 rounded-full transition-all text-sm md:text-xl flex items-center justify-center backdrop-blur hover:scale-110">❯</button>
            </div>
            <div className="mt-2 text-white/80 text-xs md:text-sm">{galleryActiveImg + 1} / {property.images.length}</div>
            <div className="w-full max-w-5xl mt-4 md:mt-6 px-2">
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 justify-center flex-wrap">
                {property.images.map((img, idx) => (
                  <div key={idx} className={`w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all ${galleryActiveImg === idx ? 'ring-2 ring-[#26A69A] shadow-xl scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105'}`} onClick={() => handleGalleryThumbnailClick(idx)}>
                    <img src={img} alt="thumb" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop'; }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center pb-2 text-white/40 text-[10px] md:text-xs">Click outside or press ESC to close</div>
        </div>
      )}

      {/* SINGLE CLICK MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col animate-fadeIn" onClick={() => setShowImageModal(false)}>
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 md:p-5 flex justify-between items-center px-4 md:px-8">
            <div>
              <h3 className="text-white font-bold text-sm md:text-xl truncate max-w-[150px] sm:max-w-[300px]">{property.location.split(',')[0]}</h3>
              <p className="text-white/80 text-xs md:text-sm mt-1">{property.images.length} Photos</p>
            </div>
            <button onClick={() => setShowImageModal(false)} className="text-white hover:text-gray-200 text-2xl md:text-4xl transition-transform hover:scale-110">✕</button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-4xl">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black/50">
                <img src={property.images[activeImg]} alt="Gallery" className="w-full h-auto max-h-[50vh] md:max-h-[65vh] object-contain" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'; }} />
              </div>
              <button onClick={prevImg} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-12 md:h-12 rounded-full transition-all text-sm md:text-2xl flex items-center justify-center backdrop-blur hover:scale-110">❮</button>
              <button onClick={nextImg} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-12 md:h-12 rounded-full transition-all text-sm md:text-2xl flex items-center justify-center backdrop-blur hover:scale-110">❯</button>
              <div className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-lg text-white text-[10px] md:text-sm px-2 md:px-4 py-1 rounded-full">{activeImg + 1} / {property.images.length}</div>
            </div>
            <div className="flex gap-2 md:gap-3 mt-6 md:mt-12 overflow-x-auto pb-2 justify-center flex-wrap max-w-full">
              {property.images.map((img, idx) => (
                <div key={idx} className={`w-12 h-12 md:w-20 md:h-20 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden cursor-pointer transition-all ${activeImg === idx ? 'ring-2 ring-[#26A69A] shadow-xl scale-105' : 'opacity-60 hover:opacity-100 hover:scale-105'}`} onClick={() => setActiveImg(idx)}>
                  <img src={img} alt="thumb" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop'; }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// FILTER SECTION
const FilterSection = ({ filters, onFilterChange, onReset, totalCount, filteredCount }) => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedBHK, setSelectedBHK] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
    onFilterChange({ priceMax: value, bhk: selectedBHK, status: selectedStatus, tag: selectedTag, search: searchTerm });
  };

  const handleBHKChange = (bhk) => {
    setSelectedBHK(bhk);
    onFilterChange({ priceMax: priceRange[1], bhk, status: selectedStatus, tag: selectedTag, search: searchTerm });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onFilterChange({ priceMax: priceRange[1], bhk: selectedBHK, status, tag: selectedTag, search: searchTerm });
  };

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    onFilterChange({ priceMax: priceRange[1], bhk: selectedBHK, status: selectedStatus, tag, search: searchTerm });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ priceMax: priceRange[1], bhk: selectedBHK, status: selectedStatus, tag: selectedTag, search: value });
  };

  const handleReset = () => {
    setPriceRange([0, 500]);
    setSelectedBHK('all');
    setSelectedStatus('all');
    setSelectedTag('all');
    setSearchTerm('');
    onReset();
  };

  return (
    <div className="w-full bg-gradient-to-br from-white/95 to-teal-50/80 backdrop-blur-xl rounded-xl shadow-lg border border-teal-200/30 p-4 sticky top-4 transition-all duration-300">
      
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-teal-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="font-black text-slate-800 text-sm md:text-base">Filter Properties</h3>
        </div>
        <button onClick={handleReset} className="text-teal-600 hover:text-teal-800 font-medium underline text-[10px] md:text-xs">Reset All</button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <label className="font-bold text-slate-600 uppercase tracking-wider mb-1 block text-[9px] md:text-[10px]">🔍 Search Location</label>
        <input type="text" placeholder="Enter location / city..." value={searchTerm} onChange={handleSearchChange} className="w-full px-3 py-2 rounded-xl border border-teal-200 focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 outline-none transition-all bg-white/70 text-xs md:text-sm" />
      </div>

      {/* Price */}
      <div className="mb-3">
        <label className="font-bold text-slate-600 uppercase tracking-wider mb-1 block text-[9px] md:text-[10px]">💰 Max Price (₹ Lakhs)</label>
        <input type="range" min="0" max="500" value={priceRange[1]} onChange={handlePriceChange} className="w-full h-1.5 bg-teal-100 rounded-lg appearance-none cursor-pointer accent-[#00695C]" />
        <div className="flex justify-between mt-1">
          <span className="text-[9px] md:text-[10px] text-slate-500">₹0 L</span>
          <span className="text-[9px] md:text-[10px] font-bold text-[#00695C]">₹{priceRange[1]} Lakhs</span>
          <span className="text-[9px] md:text-[10px] text-slate-500">₹500+ L</span>
        </div>
      </div>

      {/* BHK */}
      <div className="mb-3">
        <label className="font-bold text-slate-600 uppercase tracking-wider mb-1 block text-[9px] md:text-[10px]">🏠 BHK Type</label>
        <div className="flex flex-wrap gap-1.5">
          {['all', '2 BHK', '3 BHK', '4 BHK', '5 BHK'].map((bhk) => (
            <button key={bhk} onClick={() => handleBHKChange(bhk)} className={`px-3 py-1 rounded-lg font-bold transition-all duration-200 text-[10px] md:text-xs ${selectedBHK === bhk ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-md' : 'bg-white/70 text-slate-600 hover:bg-teal-50 border border-teal-200'}`}>
              {bhk === 'all' ? 'All BHK' : bhk}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mb-3">
        <label className="font-bold text-slate-600 uppercase tracking-wider mb-1 block text-[9px] md:text-[10px]">🏷️ Property Status</label>
        <div className="flex flex-wrap gap-1.5">
          {['all', 'NEW', 'RE-SALE', 'READY TO MOVE'].map((status) => (
            <button key={status} onClick={() => handleStatusChange(status)} className={`px-3 py-1 rounded-lg font-bold transition-all duration-200 text-[10px] md:text-xs ${selectedStatus === status ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-md' : 'bg-white/70 text-slate-600 hover:bg-teal-50 border border-teal-200'}`}>
              {status === 'all' ? 'All Status' : status === 'READY TO MOVE' ? 'Ready' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Tag */}
      <div className="mb-3">
        <label className="font-bold text-slate-600 uppercase tracking-wider mb-1 block text-[9px] md:text-[10px]">📌 Listing Type</label>
        <div className="flex flex-wrap gap-1.5">
          {['all', 'BUY', 'SELL', 'RENT', 'LEASE'].map((tag) => (
            <button key={tag} onClick={() => handleTagChange(tag)} className={`px-3 py-1 rounded-lg font-bold transition-all duration-200 text-[10px] md:text-xs ${selectedTag === tag ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-md' : 'bg-white/70 text-slate-600 hover:bg-teal-50 border border-teal-200'}`}>
              {tag === 'all' ? 'All Types' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-4 pt-3 border-t border-teal-200">
        <div className="flex items-center justify-between">
          <span className="text-[9px] md:text-[10px] text-slate-500">Showing Properties</span>
          <span className="text-sm md:text-base font-black text-[#00695C]">{filteredCount} / {totalCount}</span>
        </div>
        <div className="w-full bg-teal-100 rounded-full h-1.5 mt-2">
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] h-1.5 rounded-full transition-all duration-300" style={{ width: `${(filteredCount / totalCount) * 100}%` }}></div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-[8px] md:text-[9px] text-slate-400">🏡 Find your dream villa</p>
      </div>
    </div>
  );
};

const IndependentVilla = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(VillaData);
  const [filters, setFilters] = useState({ priceMax: 500, bhk: 'all', status: 'all', tag: 'all', search: '' });

  const handleContactClick = (property) => {
    setSelectedProperty(property);
    setShowLoginModal(true);
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    setShowContactInfo(true);
    setTimeout(() => setShowContactInfo(false), 5000);
  };

  const extractBHKNumber = (highlights) => {
    const match = highlights?.match(/(\d+)\s*\+?\s*BHK/i);
    return match ? parseInt(match[1]) : null;
  };

  const extractPriceNumber = (priceStr) => {
    const match = priceStr?.match(/₹([\d.,]+)/);
    if (match) return parseFloat(match[1].replace(/,/g, ''));
    return Infinity;
  };

  const applyFilters = () => {
    let filtered = [...VillaData];
    if (filters.search) filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.bhk !== 'all') filtered = filtered.filter(p => extractBHKNumber(p.highlights) === parseInt(filters.bhk));
    if (filters.status !== 'all') filtered = filtered.filter(p => p.status === filters.status);
    if (filters.tag !== 'all') filtered = filtered.filter(p => p.tag === filters.tag);
    filtered = filtered.filter(p => extractPriceNumber(p.price) <= filters.priceMax);
    setFilteredProperties(filtered);
  };

  useEffect(() => { applyFilters(); }, [filters]);

  const handleFilterChange = (newFilters) => { setFilters(prev => ({ ...prev, ...newFilters })); };
  const handleResetFilters = () => { setFilters({ priceMax: 500, bhk: 'all', status: 'all', tag: 'all', search: '' }); };

  return (
    <div style={{ 
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
      minHeight: '100vh',
      padding: '12px',
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #f0fdfa)'
    }}>
      
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* LEFT COLUMN - CARDS */}
        <div className="w-full lg:w-[68%] xl:w-[70%]">
          <div className="flex flex-col gap-4">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((item) => (
                <PropertyCard key={item.id} property={item} onContactClick={() => handleContactClick(item)} />
              ))
            ) : (
              <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-md">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Properties Found</h3>
                <p className="text-xs text-slate-500">Try adjusting your filters to find more properties.</p>
                <button onClick={handleResetFilters} className="mt-3 px-5 py-1.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg font-bold text-xs hover:shadow-md transition-all">Reset Filters</button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - FILTER */}
        <div className="w-full lg:w-[32%] xl:w-[30%]">
          <FilterSection 
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            totalCount={VillaData.length}
            filteredCount={filteredProperties.length}
          />
        </div>

      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <span className="text-xl text-white">🔒</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-1">Unlock Contact</h3>
            <p className="text-gray-500 text-xs text-center mb-4">Login to view contact details</p>
            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-2 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition">Continue to Login</button>
            <button onClick={() => setShowLoginModal(false)} className="w-full mt-2 text-gray-500 text-xs py-1.5">Cancel</button>
          </div>
        </div>
      )}

      {/* CONTACT TOAST */}
      {showContactInfo && selectedProperty && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl shadow-lg p-2.5 z-[200] animate-slideIn max-w-[260px] sm:max-w-sm">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-full text-xs">📞</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[10px]">Contact Details</p>
              <p className="text-[9px] truncate">{selectedProperty.contactEmail || selectedProperty.postedBy.toLowerCase().replace(/\s/g, '') + '@example.com'}</p>
              <p className="text-[9px]">{selectedProperty.contactPhone || '+91 98765 43210'}</p>
            </div>
            <button onClick={() => setShowContactInfo(false)} className="text-white/70 text-sm shrink-0">✕</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pulse-green { 0%, 100% { box-shadow: 0 0 5px rgba(34,197,94,0.5); } 50% { box-shadow: 0 0 15px rgba(34,197,94,0.8); } }
        @keyframes rotate-slow { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
        .pulse-green { animation: pulse-green 2s infinite; }
        .rotate-slow { animation: rotate-slow 3s infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default IndependentVilla;