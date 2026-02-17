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
  MapPin,
  ChevronsRight,
  Trophy,
  Flame
} from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<GameSection>(GameSection.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // High-Quality Assets
  const images = {
    background: "https://images.unsplash.com/photo-1547234935-80c7142ee969?auto=format&fit=crop&q=80&w=2000",
    karoonjhar: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Karoonjhar_Mountains.jpg/800px-Karoonjhar_Mountains.jpg",
    mithi: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Gadi_Bhitt.jpg/800px-Gadi_Bhitt.jpg",
    dunes: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=800",
    camel: "https://images.unsplash.com/photo-1598556776374-2c355822369d?auto=format&fit=crop&q=80&w=800"
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800"; 
  };

  const renderContent = () => {
    switch (activeSection) {
      case GameSection.HOME:
        return (
          <div className="flex flex-col items-center min-h-[80vh] text-center animate-fadeIn relative z-10">
            {/* Hero Text */}
            <div className="mt-12 md:mt-20 space-y-2 relative">
               <div className="absolute -inset-10 bg-orange-500/10 blur-[100px] rounded-full"></div>
               <h2 className="text-orange-500 font-teko tracking-[0.8em] text-lg md:text-2xl uppercase animate-pulse">
                  Project: Sindh
               </h2>
               <h1 className="text-7xl md:text-[10rem] leading-[0.85] font-cinzel font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-100 to-gray-400 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                DESERT<br/><span className="text-transparent bg-clip-text bg-gradient-to-t from-orange-600 to-orange-400">THUNDER</span>
              </h1>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-[2px] w-12 md:w-32 bg-gradient-to-r from-transparent to-orange-500"></div>
                <p className="font-rajdhani font-bold text-xl md:text-3xl text-gray-300 tracking-wider">
                  THARPARKAR DRIFT
                </p>
                <div className="h-[2px] w-12 md:w-32 bg-gradient-to-l from-transparent to-orange-500"></div>
              </div>
            </div>
            
            <p className="max-w-3xl mx-auto text-lg text-gray-400 font-rajdhani mt-8 leading-relaxed px-4">
              A high-octane open-world racing experience set in the heart of Pakistan. 
              Drift through the <span className="text-orange-400 font-bold">Karoonjhar Mountains</span> and conquer the dunes of Thar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-6 mt-12 w-full max-w-2xl px-4">
              <button 
                onClick={() => setActiveSection(GameSection.PLAYABLE)}
                className="flex-1 group relative bg-orange-600 hover:bg-orange-500 text-black font-black font-teko text-3xl py-4 clip-angled transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,88,12,0.4)]"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <Gamepad2 size={28} /> INIT_PROTOTYPE
                </span>
              </button>
              
              <button 
                onClick={() => setActiveSection(GameSection.GALLERY)}
                className="flex-1 group relative bg-transparent border-2 border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-black font-teko text-3xl py-4 clip-angled transition-all hover:scale-105 backdrop-blur-sm"
              >
                <span className="relative flex items-center justify-center gap-3">
                  <ImageIcon size={28} /> VISUAL_ARCHIVES
                </span>
              </button>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mt-24 px-4">
               {[
                 { img: images.karoonjhar, title: "Karoonjhar Hills", sub: "Granite Peaks" },
                 { img: images.mithi, title: "Mithi City", sub: "Urban Drift" },
                 { img: images.dunes, title: "The Great Desert", sub: "Open World" }
               ].map((item, i) => (
                 <div key={i} className="group relative h-64 bg-gray-900 clip-angled overflow-hidden cursor-pointer border border-gray-800 hover:border-orange-500/50 transition-all">
                    <img src={item.img} onError={handleImageError} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                       <h3 className="text-2xl font-teko uppercase text-white leading-none">{item.title}</h3>
                       <p className="text-orange-500 font-rajdhani text-sm font-bold tracking-widest">{item.sub}</p>
                    </div>
                 </div>
               ))}
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
    <div className="min-h-screen relative text-white selection:bg-orange-500 selection:text-black font-rajdhani overflow-x-hidden">
      
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/90 z-10"></div>
        <img 
          src={images.background}
          onError={handleImageError}
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050301] via-transparent to-[#050301] z-20"></div>
        {/* Animated Dust Particles (CSS) */}
        <div className="absolute inset-0 z-20 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/5c/Image_gaussian_noise_example.png')] mix-blend-overlay"></div>
      </div>

      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0f0a05]/80 backdrop-blur-xl h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveSection(GameSection.HOME)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-orange-600 clip-angled flex items-center justify-center group-hover:bg-white transition-colors">
               <Flame size={20} className="text-black fill-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl font-bold tracking-widest leading-none group-hover:text-orange-500 transition-colors">DESERT THUNDER</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors">Prototype Build v0.9</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: GameSection.HOME, label: 'HUB' },
              { id: GameSection.PLAYABLE, label: 'DEPLOY' },
              { id: GameSection.GDD, label: 'INTEL' },
              { id: GameSection.GALLERY, label: 'VISUALS' },
              { id: GameSection.TECH, label: 'SYSTEMS' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as GameSection)}
                className={`relative px-8 py-2 font-teko text-xl font-bold uppercase tracking-wider transition-all skew-x-[-15deg] border-r border-white/10 hover:bg-white/5 ${
                  activeSection === item.id 
                    ? 'text-orange-500 bg-white/5 border-orange-500/50' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="block skew-x-[15deg]">{item.label}</span>
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-500 shadow-[0_0_10px_orange]"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center gap-8 lg:hidden animate-fadeIn">
             {[
              { id: GameSection.HOME, label: 'Mission Hub' },
              { id: GameSection.PLAYABLE, label: 'Start Engine' },
              { id: GameSection.GDD, label: 'Design Intel' },
              { id: GameSection.GALLERY, label: 'Visual Archives' },
              { id: GameSection.TECH, label: 'Tech Systems' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as GameSection);
                  setMobileMenuOpen(false);
                }}
                className={`text-3xl font-teko uppercase tracking-widest ${
                  activeSection === item.id ? 'text-orange-500' : 'text-gray-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

      {/* Main Content Area */}
      <main className="relative z-10 pt-24 pb-12 min-h-screen flex flex-col">
         {renderContent()}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-600 font-rajdhani text-sm">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>SYSTEM ONLINE // THAR_NET</span>
           </div>
           <p className="mt-4 md:mt-0">COPYRIGHT 2024 // THARPARKAR RACING DIVISION</p>
        </div>
      </footer>

    </div>
  );
};

export default App;