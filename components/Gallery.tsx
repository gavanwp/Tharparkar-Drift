import React, { useState } from 'react';
import { generateConceptImage } from '../services/geminiService';
import { Image as ImageIcon, Sparkles, Download, Layers, Command, Quote, Grid, Monitor } from 'lucide-react';

const presetPrompts = [
  "Cinematic shot of a modified rally jeep jumping over a sand dune in Tharparkar, sunset lighting, 8k",
  "Wide angle view of Karoonjhar Mountains with ancient temples, hyper-realistic, unreal engine 5",
  "Close up of a Sindhi peacock with vibrant feathers in a desert village, depth of field",
  "Futuristic solar punk village in Thar desert, neon lights mixed with mud architecture",
  "Sandstorm engulfing a race track marked by tires and flags, dramatic atmosphere"
];

const Gallery: React.FC = () => {
  const [images, setImages] = useState<{ url: string; prompt: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  const handleGenerate = async (promptText: string) => {
    setLoading(true);
    const url = await generateConceptImage(promptText);
    if (url) {
      setImages(prev => [{ url, prompt: promptText }, ...prev]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative max-w-[1600px] mx-auto">
       
       <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-orange-900/30 pb-6 gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-teko uppercase font-bold text-white mb-2">
              Visual <span className="text-orange-500">Archives</span>
            </h1>
            <p className="text-gray-400 font-rajdhani text-lg max-w-2xl">
              Use the studio tools to generate high-fidelity concept art for the game environment.
            </p>
          </div>
          <div className="flex gap-2">
             <div className="px-4 py-2 bg-orange-900/20 border border-orange-500/30 text-orange-400 font-mono text-xs rounded flex items-center gap-2">
                <Grid size={14} /> GRID_VIEW
             </div>
             <div className="px-4 py-2 bg-orange-900/20 border border-orange-500/30 text-orange-400 font-mono text-xs rounded flex items-center gap-2">
                <Monitor size={14} /> HI_RES
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Left: Generation Console */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-[#0f0a05] border border-gray-800 p-1 relative overflow-hidden group shadow-2xl">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-orange-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-orange-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500"></div>

                <div className="bg-black/50 p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-teko uppercase text-orange-400 mb-6 flex items-center gap-2">
                       <Command size={20} /> Command Terminal
                    </h3>
                    
                    <div className="space-y-4">
                       <textarea 
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="INPUT_VISUAL_DESCRIPTION..."
                          className="w-full bg-[#050301] border border-gray-700 text-gray-300 placeholder-gray-600 p-4 outline-none font-mono text-sm h-32 focus:border-orange-500 transition-colors resize-none"
                       />
                       
                       <button
                          onClick={() => handleGenerate(customPrompt)}
                          disabled={loading || !customPrompt}
                          className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold font-teko text-2xl py-3 clip-angled transition-all hover:translate-x-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                          {loading ? <Sparkles className="animate-spin" /> : <Layers />}
                          {loading ? "RENDERING..." : "EXECUTE RENDER"}
                       </button>
                    </div>
                </div>
             </div>

             <div className="space-y-2">
                <p className="text-xs font-mono text-gray-500 uppercase">Quick Access Presets</p>
                {presetPrompts.map((p, idx) => (
                   <button
                      key={idx}
                      onClick={() => handleGenerate(p)}
                      disabled={loading}
                      className="w-full text-left p-3 bg-gray-900/50 hover:bg-orange-900/20 border-l-2 border-gray-700 hover:border-orange-500 transition-all text-gray-400 hover:text-orange-200 text-xs font-rajdhani group"
                   >
                      <span className="line-clamp-1">{p}</span>
                   </button>
                ))}
             </div>
          </div>

          {/* Right: Output Grid */}
          <div className="lg:col-span-8">
             {loading && (
                <div className="w-full aspect-video bg-black border border-orange-500/30 flex flex-col items-center justify-center relative overflow-hidden mb-8">
                   <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif')] opacity-5 bg-cover"></div>
                   <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden relative z-10">
                        <div className="h-full bg-orange-500 w-1/2 animate-[shimmer_1s_infinite]"></div>
                   </div>
                   <p className="text-orange-500 font-mono text-sm mt-4 animate-pulse">PROCESSING DATA STREAM...</p>
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((img, idx) => (
                   <div key={idx} className="group relative bg-[#0a0a0a] border border-gray-800 hover:border-orange-500/50 transition-all duration-300 shadow-xl">
                      <div className="aspect-[4/3] overflow-hidden relative">
                         <img 
                            src={img.url} 
                            alt={img.prompt} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                         />
                         {/* Holographic Overlay on Hover */}
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
                         
                         {/* Metadata Overlay */}
                         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                             <p className="text-white font-rajdhani text-sm line-clamp-2 mb-2">{img.prompt}</p>
                             <div className="flex justify-between items-center border-t border-gray-700 pt-2">
                                <span className="text-[10px] text-orange-500 font-mono">IMG_ID_{Math.floor(Math.random()*10000)}</span>
                                <a href={img.url} download className="text-gray-400 hover:text-white"><Download size={16}/></a>
                             </div>
                         </div>
                      </div>
                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-orange-500 transition-colors"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-orange-500 transition-colors"></div>
                   </div>
                ))}

                {images.length === 0 && !loading && (
                   <div className="col-span-full h-64 border-2 border-dashed border-gray-800 rounded-lg flex flex-col items-center justify-center text-gray-700 font-mono">
                      <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                      <p>NO VISUAL DATA FOUND</p>
                      <p className="text-xs mt-2 opacity-50">Initiate render command</p>
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default Gallery;