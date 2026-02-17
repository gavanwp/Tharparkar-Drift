import React, { useState } from 'react';
import { generateConceptImage } from '../services/geminiService';
import { Image as ImageIcon, Sparkles, Download, Palette, Layers, Command, Quote } from 'lucide-react';

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
    <div className="min-h-screen text-white p-4 md:p-8 relative">
       {/* Background Element */}
       <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-orange-900/20 to-transparent pointer-events-none"></div>

       {/* Header */}
       <div className="mb-12 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-[1px] w-12 bg-orange-500/50"></div>
            <span className="text-orange-500 font-rajdhani tracking-[0.3em] text-sm uppercase font-bold">Visual Development</span>
            <div className="h-[1px] w-12 bg-orange-500/50"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-white drop-shadow-lg">
            The Art of <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-600">Thar</span>
          </h1>
          <p className="mt-4 text-gray-400 font-rajdhani max-w-2xl mx-auto text-lg">
            Generate high-fidelity concept art for Desert Thunder. Use the studio tools below to visualize the environment, vehicles, and characters.
          </p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto relative z-10">
          {/* Control Panel (Left - 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
             {/* Studio Card */}
             <div className="bg-[#120c08] border border-orange-900/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group backdrop-blur-sm">
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                   <Palette size={180} />
                </div>
                
                <h3 className="text-2xl font-cinzel text-orange-100 mb-6 flex items-center gap-3 border-b border-orange-900/30 pb-4">
                   <Command className="w-6 h-6 text-orange-500" />
                   Prompt Studio
                </h3>

                <div className="space-y-5 relative z-10">
                   <div>
                      <label className="text-xs uppercase tracking-widest text-orange-500/70 mb-2 block font-bold">Creative Input</label>
                      <textarea 
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Describe a scene (e.g., 'A camel caravan at night under the milky way')..."
                        className="w-full bg-black/60 border border-gray-800 rounded-xl p-4 text-orange-50 placeholder-gray-600 focus:border-orange-500/50 outline-none h-40 resize-none font-rajdhani text-lg transition-all focus:bg-black/80 focus:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                      />
                   </div>

                   <button
                      onClick={() => handleGenerate(customPrompt)}
                      disabled={loading || !customPrompt}
                      className="w-full bg-gradient-to-r from-orange-700 to-red-800 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-orange-900/50 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                   >
                      {loading ? <Sparkles className="animate-spin w-5 h-5" /> : <Layers className="w-5 h-5" />}
                      {loading ? "Rendering Scene..." : "Generate Concept"}
                   </button>
                </div>
             </div>

             {/* Presets */}
             <div className="bg-[#120c08]/80 border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h4 className="text-xs font-rajdhani uppercase tracking-widest text-gray-500 mb-4 font-bold flex items-center gap-2">
                    <Quote className="w-3 h-3" /> Quick Inspirations
                </h4>
                <div className="space-y-3">
                   {presetPrompts.map((p, idx) => (
                      <button
                         key={idx}
                         onClick={() => handleGenerate(p)}
                         disabled={loading}
                         className="w-full text-left p-3 rounded-lg bg-black/40 hover:bg-orange-900/20 border border-transparent hover:border-orange-900/50 transition-all text-gray-400 hover:text-orange-200 text-sm font-rajdhani group flex items-start gap-3"
                      >
                         <div className="min-w-[6px] h-[6px] rounded-full bg-gray-700 group-hover:bg-orange-500 mt-1.5 transition-colors"></div>
                         <span className="line-clamp-2 leading-snug">{p}</span>
                      </button>
                   ))}
                </div>
             </div>
          </div>

          {/* Gallery Display (Right - 8 cols) */}
          <div className="lg:col-span-8">
             {/* Loading State */}
             {loading && (
                <div className="bg-[#120c08] border border-orange-900/20 rounded-2xl aspect-video flex flex-col items-center justify-center animate-pulse mb-8 relative overflow-hidden shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-900/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                   <div className="p-4 bg-orange-500/10 rounded-full mb-4">
                        <Sparkles className="w-8 h-8 text-orange-500 animate-spin" />
                   </div>
                   <p className="text-orange-300 font-cinzel text-xl tracking-widest">Constructing Visuals...</p>
                   <p className="text-orange-500/40 text-sm font-rajdhani mt-2">Powered by Gemini 2.5 Image Model</p>
                </div>
             )}

             {/* Images Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((img, idx) => (
                   <div key={idx} className="group relative bg-[#120c08] rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(234,88,12,0.15)]">
                      {/* Image */}
                      <div className="aspect-[16/10] overflow-hidden bg-gray-900">
                         <img 
                            src={img.url} 
                            alt={img.prompt} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                         />
                      </div>
                      
                      {/* Overlay Content */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 backdrop-blur-[1px]">
                         <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white font-rajdhani font-bold text-lg leading-tight mb-3 line-clamp-3">{img.prompt}</p>
                            <div className="flex items-center justify-between border-t border-white/10 pt-3">
                               <span className="text-[10px] text-orange-400 uppercase tracking-widest font-bold bg-orange-500/10 px-2 py-1 rounded">AI Concept</span>
                               <a 
                                  href={img.url} 
                                  download={`thar-concept-${idx}.png`} 
                                  className="text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                                  title="Download High Res"
                                >
                                  <Download size={20} />
                               </a>
                            </div>
                         </div>
                      </div>
                   </div>
                ))}

                {/* Empty State */}
                {images.length === 0 && !loading && (
                   <div className="col-span-full min-h-[500px] bg-[#120c08] border border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center text-gray-600 group hover:border-orange-900/30 transition-colors relative overflow-hidden">
                      {/* Subtle pattern background */}
                      <div className="absolute inset-0 ajrak-pattern opacity-[0.03]"></div>
                      
                      <div className="p-8 rounded-full bg-black/40 mb-6 group-hover:scale-110 transition-transform duration-500 border border-gray-800 group-hover:border-orange-900/50">
                         <ImageIcon className="w-16 h-16 opacity-30 group-hover:opacity-60 group-hover:text-orange-500 transition-all" />
                      </div>
                      <h3 className="text-3xl font-cinzel text-gray-500 mb-3 group-hover:text-gray-400 transition-colors">The Canvas is Empty</h3>
                      <p className="text-gray-600 font-rajdhani text-lg max-w-md text-center px-4">
                        Enter a prompt in the studio to generate professional concept art for the game.
                      </p>
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default Gallery;