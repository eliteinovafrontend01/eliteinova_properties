import React, { useState, useEffect } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import IndependentVilla from "../IndependentVilla";
import BackgroundImage from '../assets/Villa/villabg.png';
import IndependentVillaFilter from "../Filter/IndependentVillaFilter";



const IndependentVillaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("Rent");
  const [activeHouseType, setActiveHouseType] = useState("Independent Villa");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const propertyCategories = [
    { name: "Apartment", path: "/apartment", icon: <Building className="w-4 h-4" /> },
    { name: "Commercial", path: "/commercial", icon: <Landmark className="w-4 h-4" /> },
    { name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-4 h-4" /> },
    { name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
  ];

  const houseTypes = [
    { name: "All", path: "/individual" },
    { name: "Independent House", path: "/individual/independent-house" },
    { name: "Independent Villa", path: "/individual/independent-villa" },
    { name: "Residential Apartment", path: "/individual/residential-apartment" },
    { name: "Duplex Residential Unit", path: "/individual/duplex-residential-unit" },
    { name: "Row House", path: "/individual/row-house" }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeType = houseTypes.find(type => type.path === currentPath);
    if (activeType) {
      setActiveHouseType(activeType.name);
    }
  }, [location.pathname]);

  const handleNavigation = (path, typeName = null) => {
    if (typeName) {
      setActiveHouseType(typeName);
    }
    navigate(path);
  };

  const handlePropertyCategoryNavigation = (path) => {
    navigate(path);
  };

  const handleFilterChange = (filters) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
  };

  const handleClearFilters = () => {
    setAppliedFilters(null);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <div className="w-full min-h-screen relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-emerald-900/20 to-teal-900/40"></div>
       
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 8}s`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `radial-gradient(circle, rgba(38, 166, 154, 0.4) 0%, rgba(0, 105, 92, 0.2) 70%, transparent 100%)`,
                borderRadius: '50%',
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <section className="w-full h-[350px] md:h-[450px] relative flex items-center overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b"></div>
         
          <div className="max-w-none mx-auto px-6 relative z-10 text-center w-full">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-600/20 to-emerald-600/20 backdrop-blur-lg border border-teal-300/20">
              <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-emerald-300 text-sm font-medium">
                Luxury Villa Properties
              </span>
            </div>
           
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Find Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300">Independent Villa</span>
            </h1>
           
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover luxurious independent villas with world-class amenities and breathtaking views
            </p>

            <div className="flex flex-wrap justify-center gap-4 px-4">
              {propertyCategories.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() => handlePropertyCategoryNavigation(category.path)}
                  className="group relative px-7 py-3.5 rounded-xl text-white font-semibold text-base shadow-2xl hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
                    backgroundSize: "200% 200%"
                  }}
                >
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500">
          <div className="max-w-none mx-auto px-6 py-4">
            <div className="hidden md:block space-y-4">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
                    className="group relative px-6 py-3.5 rounded-xl text-white font-semibold text-base flex items-center gap-3 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #00695C, #26A69A)",
                      backgroundSize: "200% 200%"
                    }}
                  >
                    <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10">{activeButton}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdown === "toggle" ? 'rotate-180' : ''} relative z-10`} />
                  </button>

                  {openDropdown === "toggle" && (
                    <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[180px] border border-teal-200/30">
                      <button onClick={() => { handleNavigation("/buy"); setActiveButton("Buy"); setOpenDropdown(null); }} className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group">
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all"><div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-teal-500"></div>Buy</div>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
                      <button onClick={() => { handleNavigation("/rent"); setActiveButton("Rent"); setOpenDropdown(null); }} className="w-full px-5 py-3.5 text-left text-base font-semibold transition-all duration-300 group" style={{ color: "#00695C", backgroundColor: "#e0f2f1" }}>
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all"><div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>Rent</div>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
                      <button onClick={() => { handleNavigation("/lease"); setActiveButton("Lease"); setOpenDropdown(null); }} className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group">
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all"><div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"></div>Lease</div>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
                      <button onClick={() => { handleNavigation("/sell"); setActiveButton("Sell"); setOpenDropdown(null); }} className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group">
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all"><div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-teal-500"></div>Sell</div>
                      </button>
                    </div>  
                  )}
                </div>

                <div className="relative flex-1 group">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    placeholder="Search luxury villas by city, locality, or landmark"
                    className="w-full pl-12 pr-5 py-3.5 rounded-2xl border-2 border-teal-200/50 bg-teal-50/90 text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
                  />
                  <MapPin className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
                </div>

                <button
                  onClick={() => setShowFilterModal(true)}
                  className="group relative px-6 py-3.5 rounded-xl text-white font-semibold text-base flex items-center gap-3 shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #E25822, #F97316)",
                    backgroundSize: "200% 200%"
                  }}
                >
                  <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">Advanced Filters</span>
                  {appliedFilters && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {houseTypes.map((type, index) => {
                  const isActive = activeHouseType === type.name;
                  return (
                    <button
                      key={type.name}
                      onClick={() => handleNavigation(type.path, type.name)}
                      className={`group relative px-5 py-3 rounded-xl font-semibold text-base shadow-xl transition-all duration-500 whitespace-nowrap transform hover:-translate-y-1 hover:scale-105 overflow-hidden ${
                        isActive
                          ? "text-white shadow-[0_0_30px_rgba(249,115,22,0.6)]"
                          : "text-white/90 hover:text-white"
                      }`}
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, #E25822, #F97316, #FB923C)"
                          : "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
                        backgroundSize: "200% 200%",
                        border: isActive ? "2px solid rgba(255,255,255,0.3)" : "none"
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <Home className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'rotate-12' : 'group-hover:rotate-12'}`} />
                        {type.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:hidden space-y-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {houseTypes.map((type) => {
                  const isActive = activeHouseType === type.name;
                  return (
                    <button
                      key={type.name}
                      onClick={() => handleNavigation(type.path, type.name)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                        isActive
                          ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg"
                          : "bg-gradient-to-r from-teal-600 to-teal-500 text-white/90 hover:text-white"
                      }`}
                    >
                      {type.name}
                    </button>
                  );
                })}
              </div>
             
              <button
                onClick={() => setShowFilterModal(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Filter className="w-4 h-4" />
                Filter Properties
                {appliedFilters && (
                  <span className="ml-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>
        </div>

        {showFilterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <IndependentVillaFilter
                activeTab={activeButton}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilterModal(false)}
              />
            </div>
          </div>
        )}

        <div className="max-w-none mx-auto px-6 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="lg:w-2/3">
              <section>
                <IndependentVilla />
              </section>
            </div>

            <div className="lg:w-1/3 lg:relative">
              <div className="lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto">
                <div className="hidden lg:block">
                  <IndependentVillaFilter
                    activeTab={activeButton}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes particle-float { 0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; } 50% { transform: translateY(-40px) translateX(20px) rotate(180deg); opacity: 0.8; } }
        .animate-particle-float { animation: particle-float 12s ease-in-out infinite; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .lg\:custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .lg\:custom-scrollbar::-webkit-scrollbar-track { background: linear-gradient(to bottom, transparent, rgba(0, 105, 92, 0.1), transparent); border-radius: 10px; }
        .lg\:custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #00695C, #26A69A); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default IndependentVillaPage;