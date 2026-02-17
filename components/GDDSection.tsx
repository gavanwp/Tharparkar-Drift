import React, { useState } from 'react';
import { generateGameDesignDoc } from '../services/geminiService';
import { Loader2, ScrollText, BookOpen, FolderOpen, FileText, ChevronRight, Hash } from 'lucide-react';

const topics = [
  "Core Gameplay Loop & Mechanics",
  "Storyline & Mission Structure",
  "Tharparkar World Building & Environment",
  "Vehicle Customization & Physics",
  "Multiplayer & Social Features"
];

const GDDSection: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string>(topics[0]);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedCache, setGeneratedCache] = useState<Record<string, string>>({});

  const handleGenerate = async (topic: string) => {
    setActiveTopic(topic);
    if (generatedCache[topic]) {
      setContent(generatedCache[topic]);
      return;
    }

    setLoading(true);
    const text = await generateGameDesignDoc(topic);
    setGeneratedCache(prev => ({ ...prev, [topic]: text }));
    setContent(text);
    setLoading(false);
  };

  // Initial load
  React.useEffect(() => {
    if (!content && !loading) {
      handleGenerate(topics[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[700px] max-w-7xl mx-auto p-4">
      
      {/* Sidebar: File Directory */}
      <div className="lg:col-span-3 bg-black/40 border border-white/10 p-1 backdrop-blur-sm flex flex-col">
        <div className="p-4 border-b border-white/10 bg-black/40">
            <h3 className="text-xl font-teko text-orange-500 flex items-center gap-2 tracking-wide uppercase">
              <FolderOpen className="w-5 h-5" />
              Project Files
            </h3>
        </div>
        <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            {topics.map((topic, idx) => (
              <button
                key={topic}
                onClick={() => handleGenerate(topic)}
                disabled={loading && activeTopic === topic}
                className={`w-full text-left p-3 group relative overflow-hidden transition-all duration-300 border border-transparent ${
                  activeTopic === topic
                    ? "bg-orange-500/10 border-orange-500/50 text-orange-100"
                    : "hover:bg-white/5 hover:border-white/10 text-gray-500 hover:text-gray-300"
                }`}
              >
                {/* Active Indicator */}
                {activeTopic === topic && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                )}
                
                <div className="flex items-center gap-3 relative z-10">
                    <span className="font-mono text-[10px] opacity-50">0{idx + 1}</span>
                    <span className="font-rajdhani font-bold text-sm leading-tight">{topic}</span>
                </div>

                {/* Hover Glitch Line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-orange-500/50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
            ))}
        </div>
        <div className="p-4 text-[10px] font-mono text-gray-600 border-t border-white/10 bg-black/60">
            SECURE CONNECTION // ENCRYPTED
        </div>
      </div>

      {/* Content Area: Document Viewer */}
      <div className="lg:col-span-9 bg-black/80 border border-orange-900/30 relative flex flex-col shadow-2xl">
        {/* Decorative Top Bar */}
        <div className="h-2 bg-gradient-to-r from-orange-600 via-orange-900 to-black w-full"></div>
        <div className="absolute top-0 right-0 p-2">
            <div className="flex gap-1">
                 {[1,2,3].map(i => <div key={i} className="w-8 h-1 bg-orange-500/20"></div>)}
            </div>
        </div>

        <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
            {/* Background Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
                 <Hash size={400} className="text-white" />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-orange-500">
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 animate-pulse"></div>
                    <Loader2 className="w-16 h-16 animate-spin mb-6 relative z-10" />
                </div>
                <p className="font-teko text-3xl tracking-widest animate-pulse">DECRYPTING DATA...</p>
                <p className="font-mono text-xs text-orange-400/50 mt-2">ACCESSING GEMINI SECURE ARCHIVES</p>
              </div>
            ) : (
              <div className="relative z-10 animate-fadeIn">
                <div className="flex items-baseline gap-4 mb-8 border-b border-orange-500/30 pb-4">
                    <h1 className="text-4xl md:text-5xl font-teko text-white uppercase tracking-wide">
                      {activeTopic}
                    </h1>
                    <span className="font-mono text-orange-500 text-xs px-2 py-1 bg-orange-500/10 border border-orange-500/30 rounded">
                        CONFIDENTIAL
                    </span>
                </div>
                
                <div className="prose prose-invert prose-orange max-w-none prose-headings:font-cinzel prose-p:font-rajdhani prose-p:text-lg prose-p:leading-relaxed prose-li:text-gray-300">
                   <div className="whitespace-pre-wrap text-gray-300">
                      {content}
                   </div>
                </div>
              </div>
            )}
        </div>
        
        {/* Decorative Bottom Bar */}
        <div className="h-8 bg-black border-t border-white/10 flex justify-between items-center px-4 font-mono text-[10px] text-gray-600">
            <span>DOC_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            <span>LAST_EDIT: NOW</span>
        </div>
      </div>
    </div>
  );
};

export default GDDSection;