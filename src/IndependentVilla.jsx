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

  return (
    <>
      <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/90 to-teal-50/90 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-teal-200/30 hover:shadow-[0_0_60px_rgba(0,105,92,0.3)] transition-all duration-700 group mb-6 md:mb-8 w-full">

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* LEFT: IMAGE SECTION */}
          <div className="w-full lg:w-[380px] xl:w-[430px] flex flex-col sm:flex-row h-auto sm:h-[300px] md:h-[320px] lg:h-[350px] bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden shadow-xl">
            <div
              className="w-full sm:w-[75%] relative overflow-hidden cursor-pointer h-[250px] sm:h-full"
              onDoubleClick={(e) => handleImageDoubleClick(activeImg, e)}
            >
              <img
                src={property.images[activeImg]}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt="Villa"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop';
                }}
              />
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[8px] md:text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Double click to view gallery
              </div>
              <div className="absolute top-4 left-4 z-10">
                <div className={`${statusStyle.bg} text-white text-[10px] md:text-[11px] font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-xl shadow-2xl backdrop-blur-sm flex items-center gap-1 md:gap-1.5 ${statusStyle.animation}`}>
                  <span className="text-[10px] md:text-xs">{statusStyle.icon}</span>
                  <span className="uppercase tracking-wider">{property.status}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-row lg:flex-col w-full sm:w-[25%] gap-1 p-1 bg-white overflow-x-auto sm:overflow-y-auto">
              {property.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
                    activeImg === idx
                      ? 'ring-2 ring-[#26A69A] shadow-md scale-[0.98]'
                      : 'hover:shadow-md hover:scale-[0.98]'
                  } w-20 h-20 sm:w-auto sm:flex-1 sm:min-h-[70px]`}
                  onClick={() => setActiveImg(idx)}
                  onDoubleClick={(e) => handleImageDoubleClick(idx, e)}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                    alt="thumb"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTENT SECTION */}
          <div className="flex-1 p-3 md:p-4 flex flex-col justify-between text-left">

            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="w-full sm:w-auto">
                <h2 className="font-black text-slate-900 tracking-tighter mb-2 break-words flex flex-wrap items-baseline gap-x-1.5 md:gap-x-2">
                  <span className="text-2xl md:text-3xl lg:text-4xl leading-none">
                    {priceNum}
                  </span>
                  {priceUnit && (
                    <span className="text-xs md:text-sm lg:text-base font-bold text-slate-600 leading-none">
                      {priceUnit}
                    </span>
                  )}
                  {bhk && (
                    <span className="text-xl md:text-2xl lg:text-3xl leading-none text-[#00695C]">
                      ({bhk})
                    </span>
                  )}
                </h2>

                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  <span className="text-[#00695C] font-bold text-sm md:text-lg bg-teal-50 px-2 py-0.5 rounded-lg">{property.sqftPrice}</span>
                  <span className="h-5 w-[1.5px] bg-gray-200 hidden sm:block"></span>
                  <span className="text-slate-600 font-bold text-sm md:text-lg flex items-center gap-1.5">
                    📐 {property.totalSqft}
                  </span>
                  <span className="text-slate-500 text-xs md:text-sm bg-gray-100 px-2 py-1 rounded-lg">
                    🏗️ {property.builtUp}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">
                  <span className="w-3 md:w-4 h-[1px] bg-slate-300"></span>
                  <span>{PAGE_NAME}</span>
                </div>

                <div style={{ 
                  filter: 'drop-shadow(0 15px 15px rgba(0, 105, 92, 0.4)) drop-shadow(0 25px 35px rgba(0, 0, 0, 0.2))',
                  transform: isAnimating ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.5s ease-in-out'
                }}>
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] md:text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1.5"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%, 8% 50%)',
                      padding: '8px 24px', 
                      minWidth: '95px',
                      animation: isAnimating ? 'bounce 0.5s ease-in-out' : 'none'
                    }}
                  >
                    <span className="text-[14px] md:text-base" style={{ animation: 'luxury-float 2s infinite' }}>
                      {property.tag === 'BUY' && '💰'}
                      {property.tag === 'RENT' && '🔑'}
                      {property.tag === 'LEASE' && '📄'}
                      {property.tag === 'SELL' && '🏷️'}
                    </span>
                    <span className="text-[11px] md:text-sm font-black" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                      {property.tag}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mt-3 md:mt-5 flex items-start gap-2 md:gap-3">
              <div className="bg-teal-100 p-2 md:p-2.5 rounded-xl text-[#00695C] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-slate-800 font-bold text-sm md:text-base leading-tight break-words">{property.location}</p>
            </div>

            {/* Property Highlights */}
            <div className="mt-3 md:mt-5">
              <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 md:mb-3 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#26A69A]"></span>
                Property Highlights
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {property.highlights.split('|').map((h, i) => (
                  <div key={i} className="flex items-center gap-1 md:gap-2 bg-white/70 backdrop-blur-sm text-slate-700 px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl border border-teal-100 text-[10px] md:text-xs font-bold hover:bg-teal-50 hover:text-[#00695C] hover:border-teal-200 transition-all shadow-sm">
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#26A69A] shrink-0"></span>
                    <span className="break-words">{h.trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* POSTED BY SECTION */}
            <div className="mt-4 md:mt-6 pt-4 md:pt-5 border-t border-teal-100">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-[200px]">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-lg text-lg md:text-xl transform transition-transform hover:scale-105 shrink-0 overflow-hidden">
                    {property.logo && !logoError ? (
                      <img
                        src={property.logo}
                        alt="logo"
                        className="w-full h-full object-cover"
                        onError={() => setLogoError(true)}
                      />
                    ) : (
                      <span>{property.postedBy.charAt(0)}</span>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[9px] md:text-[11px] text-[#00695C] font-bold uppercase tracking-wider">
                      {getListedByText()}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <p className="text-base md:text-lg font-black text-slate-800 break-words">
                        {property.postedBy}
                      </p>
                      {property.agentDetails && (
                        <span className="text-[10px] md:text-xs text-gray-600">
                          ( {getShortDetails()} )
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[9px] md:text-[10px] text-teal-600 font-medium">
                        {getRoleTitle()}
                      </span>
                      
                      {property.agentDetails && (
                        <button
                          onClick={() => setShowAgentModal(true)}
                          className="text-[9px] md:text-[10px] text-teal-500 hover:text-teal-700 font-medium underline transition-colors duration-200 flex items-center gap-1"
                        >
                          📖 View Complete Details
                          <span className="text-[10px]">→</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onContactClick}
                  className="bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-lg md:rounded-xl text-xs md:text-sm font-black transition-all duration-300 flex items-center gap-2 uppercase tracking-wider group shrink-0"
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
                  <span className="group-hover:scale-110 transition-transform text-sm md:text-base">📞</span>
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AGENT DETAILS MODAL - DYNAMIC DATA FROM VillaData */}
      {showAgentModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAgentModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-5 rounded-t-2xl flex justify-between items-center sticky top-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  {property.tag === 'BUY' && '🏠'}
                  {property.tag === 'SELL' && '💰'}
                  {property.tag === 'RENT' && '🔑'}
                  {property.tag === 'LEASE' && '📄'}
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">Complete Details</h3>
                  <p className="text-white/80 text-sm">{property.postedAs || getRoleTitle()}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAgentModal(false)} 
                className="text-white hover:text-gray-200 text-3xl transition-transform hover:scale-110"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Logo and Name Section */}
              <div className="flex items-center gap-4 pb-4 border-b border-teal-100 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-lg text-2xl overflow-hidden">
                  {property.logo && !logoError ? (
                    <img
                      src={property.logo}
                      alt="logo"
                      className="w-full h-full object-cover"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <span>{property.postedBy.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-[#00695C] font-bold uppercase tracking-wider">
                    {getListedByText()}
                  </p>
                  <p className="text-2xl font-black text-slate-800">{property.postedBy}</p>
                  <p className="text-sm text-teal-600 font-medium mt-1">{getRoleTitle()}</p>
                </div>
              </div>

              {/* Complete Agent Details */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 bg-teal-500 rounded-full"></span>
                  About {property.postedAs === 'Agent' ? 'Agent' : property.postedAs === 'Builder' ? 'Builder' : property.postedAs === 'Seller' ? 'Seller' : 'Owner'}
                </h4>
                <div className="bg-teal-50/50 rounded-xl p-4">
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {property.agentDetails || "No additional details provided."}
                  </p>
                </div>
              </div>

              {/* Contact Information - DYNAMIC from VillaData */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 bg-teal-500 rounded-full"></span>
                  Contact Information
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-teal-600">📧</span>
                    <span>{property.contactEmail || property.postedBy.toLowerCase().replace(/\s/g, '') + '@example.com'}</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-teal-600">📞</span>
                    <span>{property.contactPhone || '+91 98765 43210'}</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-teal-600">📍</span>
                    <span>{property.location}</span>
                  </p>
                </div>
              </div>

              {/* Additional Info - Experience & Achievements from VillaData */}
              {(property.experience || property.achievements) && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-4 h-4 bg-teal-500 rounded-full"></span>
                    Additional Information
                  </h4>
                  <div className="bg-teal-50/30 rounded-xl p-4 space-y-2">
                    {property.experience && (
                      <p className="text-sm flex items-center gap-2">
                        <span className="text-teal-600">⭐</span>
                        <span><strong>Experience:</strong> {property.experience}</span>
                      </p>
                    )}
                    {property.achievements && (
                      <p className="text-sm flex items-center gap-2">
                        <span className="text-teal-600">🏆</span>
                        <span><strong>Achievements:</strong> {property.achievements}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Property Reference */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-4 h-4 bg-teal-500 rounded-full"></span>
                  Property Reference
                </h4>
                <div className="bg-teal-50/30 rounded-xl p-4 space-y-1">
                  <p className="text-sm"><strong>Property ID:</strong> {property.id}</p>
                  <p className="text-sm"><strong>Listed Price:</strong> {property.price}</p>
                  <p className="text-sm"><strong>Total Area:</strong> {property.totalSqft}</p>
                  <p className="text-sm"><strong>Status:</strong> {property.status}</p>
                  <p className="text-sm"><strong>Listed By:</strong> {property.postedAs || getRoleTitle()}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-teal-100">
                <button
                  onClick={() => {
                    setShowAgentModal(false);
                    onContactClick();
                  }}
                  className="flex-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105"
                >
                  📞 Contact Now
                </button>
                <button
                  onClick={() => setShowAgentModal(false)}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL GALLERY MODAL */}
      {showFullGallery && (
        <div className="fixed inset-0 bg-black/95 z-[150] flex flex-col animate-fadeIn" onClick={() => setShowFullGallery(false)}>
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 md:p-4 flex justify-between items-center px-4 md:px-6">
            <div>
              <h3 className="text-white font-bold text-sm md:text-lg break-words max-w-[200px] md:max-w-none">{property.location.split(',')[0]}</h3>
              <p className="text-white/80 text-[10px] md:text-xs mt-1">Double click any image to view full size</p>
            </div>
            <button onClick={() => setShowFullGallery(false)} className="text-white hover:text-gray-200 text-2xl md:text-3xl transition-transform hover:scale-110">✕</button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 pb-2 md:pb-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-4xl">
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black/50">
                <img src={property.images[galleryActiveImg]} alt="Gallery main" className="w-full h-auto max-h-[45vh] md:max-h-[55vh] object-contain transition-all duration-300"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'; }} />
              </div>
              <button onClick={prevGalleryImg} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-300 text-sm md:text-xl flex items-center justify-center backdrop-blur hover:scale-110">❮</button>
              <button onClick={nextGalleryImg} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-300 text-sm md:text-xl flex items-center justify-center backdrop-blur hover:scale-110">❯</button>
            </div>
            <div className="mt-2 md:mt-3 text-white/80 text-xs md:text-sm">{galleryActiveImg + 1} / {property.images.length}</div>
            <div className="w-full max-w-5xl mt-4 md:mt-6 px-2">
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-3 justify-center flex-wrap">
                {property.images.map((img, idx) => (
                  <div key={idx} className={`w-14 h-14 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    galleryActiveImg === idx ? 'ring-2 md:ring-3 ring-[#26A69A] shadow-xl scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`} onClick={() => handleGalleryThumbnailClick(idx)}>
                    <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop'; }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center pb-2 md:pb-4 text-white/40 text-[10px] md:text-xs">Click outside or press ESC to close</div>
        </div>
      )}

      {/* SINGLE CLICK MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col animate-fadeIn" onClick={() => setShowImageModal(false)}>
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 md:p-5 flex justify-between items-center px-4 md:px-8">
            <div>
              <h3 className="text-white font-bold text-sm md:text-xl">{property.location.split(',')[0]}</h3>
              <p className="text-white/80 text-xs md:text-sm mt-1">{property.images.length} Photos</p>
            </div>
            <button onClick={() => setShowImageModal(false)} className="text-white hover:text-gray-200 text-2xl md:text-4xl transition-transform hover:scale-110">✕</button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-4xl">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black/50">
                <img src={property.images[activeImg]} alt="Gallery" className="w-full h-auto max-h-[55vh] md:max-h-[65vh] object-contain transition-all duration-300"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'; }} />
              </div>
              <button onClick={prevImg} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-12 md:h-12 rounded-full transition-all duration-300 text-sm md:text-2xl flex items-center justify-center backdrop-blur hover:scale-110">❮</button>
              <button onClick={nextImg} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-12 md:h-12 rounded-full transition-all duration-300 text-sm md:text-2xl flex items-center justify-center backdrop-blur hover:scale-110">❯</button>
              <div className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-lg text-white text-[10px] md:text-sm px-2 md:px-4 py-1 md:py-2 rounded-full">{activeImg + 1} / {property.images.length}</div>
            </div>
            <div className="flex gap-2 md:gap-3 mt-8 md:mt-16 overflow-x-auto pb-2 md:pb-4 max-w-full justify-center flex-wrap">
              {property.images.map((img, idx) => (
                <div key={idx} className={`w-16 h-16 md:w-24 md:h-24 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  activeImg === idx ? 'ring-2 md:ring-4 ring-[#26A69A] shadow-xl scale-105' : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`} onClick={() => setActiveImg(idx)}>
                  <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop'; }} />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-teal-50/30 py-6 md:py-12 px-3 md:px-4 lg:px-6">
      <div className="max-w-none mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10">
          
          {/* LEFT COLUMN - CARDS SECTION */}
          <div className="w-full lg:w-[70%] xl:w-[72%]">
            <div className="flex flex-col">
              {VillaData.map((item) => (
                <PropertyCard key={item.id} property={item} onContactClick={() => handleContactClick(item)} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-3 md:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 md:p-6 shadow-2xl mx-3">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
              <span className="text-xl md:text-2xl text-white">🔒</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 text-center mb-2">Unlock Contact</h3>
            <p className="text-gray-500 text-[10px] md:text-xs text-center mb-4 md:mb-6">Login to view contact details</p>
            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-2 md:py-2.5 rounded-lg font-bold text-xs md:text-sm shadow-md hover:shadow-lg transition">Continue to Login</button>
            <button onClick={() => setShowLoginModal(false)} className="w-full mt-2 text-gray-500 text-[10px] md:text-xs py-2">Cancel</button>
          </div>
        </div>
      )}

      {/* CONTACT INFO TOAST */}
      {showContactInfo && selectedProperty && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl shadow-2xl p-2 md:p-3 z-[200] animate-slideIn max-w-[250px] md:max-w-none">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 md:p-1.5 rounded-full text-xs md:text-base">📞</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[10px] md:text-xs">Contact Details</p>
              <p className="text-[8px] md:text-[10px] truncate">{selectedProperty.contactEmail || selectedProperty.postedBy.toLowerCase().replace(/\s/g, '') + '@example.com'}</p>
              <p className="text-[8px] md:text-[10px]">{selectedProperty.contactPhone || '+91 98765 43210'}</p>
            </div>
            <button onClick={() => setShowContactInfo(false)} className="text-white/70 text-sm md:text-lg shrink-0">✕</button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        @keyframes button-shadow-pulse {
          0%, 100% { box-shadow: 0 0 25px rgba(0, 105, 92, 0.6), 0 10px 20px -5px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 0 45px rgba(0, 105, 92, 0.9), 0 15px 25px -8px rgba(0,0,0,0.3); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes luxury-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); transform: rotate(0deg); }
          50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8); transform: rotate(8deg); }
        }
        @keyframes rotate-slow {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        .pulse-green { animation: pulse-green 2s infinite; }
        .rotate-slow { animation: rotate-slow 3s infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default IndependentVilla;