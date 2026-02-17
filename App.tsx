import React, { useState } from 'react';
import { GameSection } from './types';
import GDDSection from './components/GDDSection';
import TechStack from './components/TechStack';
import Gallery from './components/Gallery';
import DriftGame from './components/DriftGame';
import { 
  Gamepad2, 
  FileText, 
  Settings, 
  Image as ImageIcon, 
  Menu, 
  X,
  Compass,
  MapPin,
  Sun
} from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<GameSection>(GameSection.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Reliable image URLs for Tharparkar theme
  // Updated to match user provided visuals: Gadhi Bhit, Dunes, Camel
  const images = {
    background: "https://images.unsplash.com/photo-1516999902649-0447361a93e3?auto=format&fit=crop&q=80&w=2074", // Vast Desert Textures
    karoonjhar: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Karoonjhar_Mountains.jpg/800px-Karoonjhar_Mountains.jpg", // Karoonjhar Mountains
    mithi: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Gadi_Bhitt.jpg/800px-Gadi_Bhitt.jpg", // Gadhi Bhit Mithi (Red Tower)
    dunes: "https://images.unsplash.com/photo-1547234935-80c7142ee969?auto=format&fit=crop&q=80&w=800", // Golden Dunes
    camel: "https://images.unsplash.com/photo-1560611843-0599c9678c2e?auto=format&fit=crop&q=80&w=800" // Decorated Camel
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback to a generic high-quality desert image if specific landmark links fail
    e.currentTarget.src = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800"; 
  };

  const renderContent = () => {
    switch (activeSection) {
      case GameSection.HOME:
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 animate-fadeIn pb-12">
            {/* Hero Section */}
            <div className="relative z-10 space-y-4 pt-10">
               <h1 className="text-6xl md:text-9xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-orange-300 via-orange-500 to-red-900 drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]">
                DESERT THUNDER
              </h1>
              <h2 className="text-2xl md:text-4xl font-rajdhani tracking-[0.6em] text-orange-100 uppercase drop-shadow-md">
                Tharparkar Drift
              </h2>
            </div>
            
            <p className="max-w-2xl text-lg md:text-xl text-gray-200 font-rajdhani leading-relaxed backdrop-blur-md bg-black/50 p-8 rounded-2xl border border-orange-500/30 shadow-2xl">
              Experience the raw beauty of Sindh. Race through the legendary 
              <span className="text-orange-400 font-bold"> Karoonjhar Mountains</span>, 
              drift across the golden dunes of <span className="text-orange-400 font-bold">Mithi</span>, 
              and survive the sandstorms of the Great Thar Desert.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => setActiveSection(GameSection.PLAYABLE)}
                className="bg-orange-700 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-bold text-xl transition-all shadow-[0_0_30px_rgba(194,65,12,0.6)] flex items-center gap-2 hover:scale-105"
              >
                <Gamepad2 /> PLAY PROTOTYPE
              </button>
              <button 
                onClick={() => setActiveSection(GameSection.GALLERY)}
                className="bg-black/60 border-2 border-orange-600 text-orange-400 hover:bg-orange-900/40 px-10 py-4 rounded-full font-bold text-xl transition-all hover:scale-105 backdrop-blur-sm"
              >
                VIEW ART
              </button>
            </div>

            {/* Visual Atmosphere Grid */}
            <div className="w-full max-w-7xl mt-16">
              <div className="flex items-center gap-4 mb-8 justify-center text-orange-300/80">
                <div className="h-[1px] w-20 bg-orange-500/50"></div>
                <h3 className="text-2xl font-cinzel uppercase tracking-widest">The Spirit of Thar</h3>
                <div className="h-[1px] w-20 bg-orange-500/50"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Image 1: Mithi (Gadhi Bhit) */}
                <div className="group relative h-80 rounded-xl overflow-hidden border-2 border-orange-900/30 shadow-2xl cursor-pointer bg-gray-900">
                  <img 
                    src={images.mithi}
                    onError={handleImageError}
                    alt="Gadhi Bhit Mithi" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="font-cinzel text-white text-xl">Gadhi Bhit, Mithi</p>
                    <p className="text-xs text-orange-300 font-rajdhani mt-1">Historic Watchtower Views</p>
                  </div>
                </div>

                {/* Image 2: Dunes */}
                <div className="group relative h-80 rounded-xl overflow-hidden border-2 border-orange-900/30 shadow-2xl md:mt-12 cursor-pointer bg-gray-900">
                   <img 
                    src={images.dunes}
                    onError={handleImageError}
                    alt="Thar Desert Dunes" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                   <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="font-cinzel text-white text-xl">Golden Dunes</p>
                    <p className="text-xs text-orange-300 font-rajdhani mt-1">Endless Sand & Adventure</p>
                  </div>
                </div>

                {/* Image 3: Camel */}
                <div className="group relative h-80 rounded-xl overflow-hidden border-2 border-orange-900/30 shadow-2xl cursor-pointer bg-gray-900">
                   <img 
                    src={images.camel}
                    onError={handleImageError}
                    alt="Decorated Camel" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                   <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="font-cinzel text-white text-xl">Ship of the Desert</p>
                    <p className="text-xs text-orange-300 font-rajdhani mt-1">Traditional Transport</p>
                  </div>
                </div>

                 {/* Image 4: Karoonjhar */}
                 <div className="group relative h-80 rounded-xl overflow-hidden border-2 border-orange-900/30 shadow-2xl md:mt-12 cursor-pointer bg-gray-900">
                   <img 
                    src={images.karoonjhar}
                    onError={handleImageError}
                    alt="Karoonjhar Mountains" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                   <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="font-cinzel text-white text-xl">Karoonjhar Mountains</p>
                    <p className="text-xs text-orange-300 font-rajdhani mt-1">Granite Hills of Nagarparkar</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      case GameSection.GDD:
        return <GDDSection />;
      case GameSection.TECH:
        return <TechStack />;
      case GameSection.GALLERY:
        return <Gallery />;
      case GameSection.PLAYABLE:
        return <DriftGame />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a05] text-white relative overflow-x-hidden selection:bg-orange-500 selection:text-black font-rajdhani">
      {/* Background Ambience with Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src={images.background}
          onError={handleImageError}
          alt="Desert Background" 
          className="w-full h-full object-cover opacity-40 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1a0f05]/60 to-black/90"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-orange-900/30 bg-black/80 backdrop-blur-md sticky top-0 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveSection(GameSection.HOME)}>
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-700 to-yellow-600 rounded-lg transform rotate-45 flex items-center justify-center border-2 border-yellow-500 group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_15px_rgba(234,88,12,0.6)]">
               <Sun className="text-black transform -rotate-45 w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl font-bold hidden sm:block text-orange-100 leading-none">DESERT THUNDER</span>
              <span className="text-[0.6rem] uppercase tracking-widest text-orange-500 hidden sm:block">Tharparkar Drift</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {[
              { id: GameSection.HOME, label: 'Home', icon: <MapPin size={18} /> },
              { id: GameSection.PLAYABLE, label: 'Prototype', icon: <Gamepad2 size={18} /> },
              { id: GameSection.GDD, label: 'Design Doc', icon: <FileText size={18} /> },
              { id: GameSection.GALLERY, label: 'Art', icon: <ImageIcon size={18} /> },
              { id: GameSection.TECH, label: 'Tech Stack', icon: <Settings size={18} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as GameSection)}
                className={`flex items-center gap-2 font-bold uppercase tracking-wider text-sm transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'text-orange-400 border-b-2 border-orange-500 pb-1' 
                    : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-600 pb-1'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-orange-500 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-orange-900/50 py-6 flex flex-col gap-6 px-6 animate-slideDown shadow-2xl backdrop-blur-xl">
             {[
              { id: GameSection.HOME, label: 'Home' },
              { id: GameSection.PLAYABLE, label: 'Play Prototype' },
              { id: GameSection.GDD, label: 'Design Document' },
              { id: GameSection.GALLERY, label: 'Concept Art' },
              { id: GameSection.TECH, label: 'Technical Stack' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as GameSection);
                  setMobileMenuOpen(false);
                }}
                className={`text-left font-rajdhani uppercase text-lg tracking-widest ${
                  activeSection === item.id ? 'text-orange-500 font-bold' : 'text-gray-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-orange-900/30 bg-black/80 backdrop-blur-md py-8 text-center text-gray-500 font-rajdhani text-sm">
        <p className="text-orange-500/50 mb-2 font-cinzel text-lg">Built for the love of Sindh</p>
        <p>&copy; 2024 Desert Thunder Dev Team. Concept Application.</p>
        <p className="font-bold text-orange-400 mt-1">Made by Gavan Kumar</p>
        <p className="mt-2 text-xs opacity-50">Powered by React, Tailwind & Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;