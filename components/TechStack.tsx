import React, { useState } from 'react';
import { generateTechAdvice } from '../services/geminiService';
import { Cpu, Terminal, Activity, Server, Code, ShieldCheck, Wifi } from 'lucide-react';

const TechStack: React.FC = () => {
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const text = await generateTechAdvice();
    setAdvice(text);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: System Monitors */}
        <div className="lg:col-span-1 space-y-6">
             
             {/* Engine Status Pod */}
             <div className="bg-[#0a0a0a] border border-gray-800 relative overflow-hidden group shadow-2xl">
                {/* Header */}
                <div className="bg-gray-900/50 p-3 border-b border-gray-800 flex justify-between items-center">
                    <span className="text-orange-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        <Activity size={14} className="animate-pulse"/> Core Engine
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">ID: UNREAL_5</span>
                </div>
                
                {/* Visualizer */}
                <div className="p-6 flex flex-col items-center justify-center relative">
                    <div className="relative w-40 h-40">
                        {/* Spinning Rings */}
                        <svg className="w-full h-full animate-spin-slow absolute inset-0 opacity-50" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="48" stroke="#333" strokeWidth="1" fill="none" strokeDasharray="10 5" />
                        </svg>
                        <svg className="w-full h-full animate-spin absolute inset-0 opacity-80" style={{animationDuration: '3s'}} viewBox="0 0 100 100">
                             <path d="M50 5 A45 45 0 0 1 95 50" stroke="#f97316" strokeWidth="2" fill="none" />
                        </svg>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <span className="text-3xl font-teko font-bold text-white tracking-widest">UE5</span>
                            <span className="text-[10px] text-green-500 font-mono tracking-wider bg-green-900/20 px-2 py-0.5 rounded">ONLINE</span>
                        </div>
                    </div>
                </div>

                {/* Sub Stats */}
                <div className="grid grid-cols-2 gap-px bg-gray-800 border-t border-gray-800">
                    <div className="bg-[#0f0f0f] p-3 text-center group-hover:bg-[#151515] transition-colors">
                        <div className="text-[10px] text-gray-500 font-mono">PHYSICS</div>
                        <div className="text-green-500 font-bold font-mono">98%</div>
                    </div>
                    <div className="bg-[#0f0f0f] p-3 text-center group-hover:bg-[#151515] transition-colors">
                        <div className="text-[10px] text-gray-500 font-mono">RENDER</div>
                        <div className="text-orange-500 font-bold font-mono">60FPS</div>
                    </div>
                    <div className="bg-[#0f0f0f] p-3 text-center group-hover:bg-[#151515] transition-colors">
                        <div className="text-[10px] text-gray-500 font-mono">NET</div>
                        <div className="text-blue-500 font-bold font-mono">12ms</div>
                    </div>
                    <div className="bg-[#0f0f0f] p-3 text-center group-hover:bg-[#151515] transition-colors">
                        <div className="text-[10px] text-gray-500 font-mono">MEMORY</div>
                        <div className="text-purple-500 font-bold font-mono">4.2GB</div>
                    </div>
                </div>
             </div>

             {/* Network Traffic/Market Pod */}
             <div className="bg-[#0a0a0a] border border-gray-800 p-1">
                 <div className="bg-gray-900/30 p-4 border border-gray-800/50">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-blue-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                             <Wifi size={14} /> Data Stream
                        </h3>
                        <div className="flex gap-0.5">
                            {[1,2,3,4].map(i => <div key={i} className={`w-1 h-1 rounded-full ${i<3 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>)}
                        </div>
                     </div>
                     
                     <div className="flex items-end gap-1 h-32 mb-2 px-2 border-b border-gray-700/50 pb-1 relative">
                         {/* Grid Lines */}
                         <div className="absolute inset-0 border-t border-gray-800 top-1/4"></div>
                         <div className="absolute inset-0 border-t border-gray-800 top-2/4"></div>
                         <div className="absolute inset-0 border-t border-gray-800 top-3/4"></div>
                         
                         {[35, 55, 40, 70, 45, 60, 85, 65, 90, 75, 50, 80].map((h, i) => (
                             <div key={i} className="flex-1 bg-blue-900/10 border-t-2 border-blue-500/50 relative hover:bg-blue-500/20 transition-all duration-300 group cursor-crosshair">
                                 <div className="absolute bottom-0 w-full bg-blue-500/20 transition-all duration-500" style={{height: `${h}%`}}></div>
                                 <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-[10px] px-2 py-1 rounded border border-blue-500 pointer-events-none">
                                     {h}%
                                 </div>
                             </div>
                         ))}
                     </div>
                     <div className="flex justify-between text-[10px] text-gray-600 font-mono uppercase">
                        <span>T-Minus 24h</span>
                        <span>Present</span>
                     </div>
                 </div>
             </div>
        </div>

        {/* Right Column: Main Terminal */}
        <div className="lg:col-span-2 bg-[#050301] border border-gray-700 relative flex flex-col min-h-[600px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Terminal Header */}
            <div className="bg-gray-900/50 border-b border-gray-700 p-4 flex justify-between items-center backdrop-blur">
                <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-orange-500" />
                    <div className="flex flex-col">
                        <span className="font-mono text-sm text-gray-300 font-bold">SYSTEM_DIAGNOSTICS_TOOL_V2.1</span>
                        <span className="text-[10px] text-gray-500 font-mono">AUTHORIZED_USER: LEAD_DEV</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2 items-center text-[10px] font-mono text-gray-500 bg-black/50 px-3 py-1 rounded-full border border-gray-800">
                        <ShieldCheck size={10} className="text-green-500"/> SECURE
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
                    </div>
                </div>
            </div>

            {/* Content Window */}
            <div className="flex-1 p-6 md:p-8 font-mono text-sm relative overflow-hidden bg-black/80">
                {/* CRT Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-0"></div>
                <div className="absolute top-0 w-full h-px bg-white/5 animate-scanline z-0"></div>
                
                <div className="relative z-10 h-full">
                    {!advice && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-6">
                            <div className="w-24 h-24 border border-gray-800 rounded-full flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border border-gray-800 scale-125 opacity-50"></div>
                                <Server size={48} strokeWidth={1} className="text-gray-700" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg text-gray-400 font-bold mb-2">AWAITING DIAGNOSTIC PROTOCOLS</p>
                                <p className="max-w-md mx-auto text-xs opacity-50">Initiate analysis to compare engine architectures and generate monetization protocols via Gemini 3 Pro Neural Link.</p>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="space-y-4 h-full flex flex-col justify-center max-w-lg mx-auto">
                            <div className="flex items-center gap-3 text-orange-500 border-l-2 border-orange-500 pl-4 bg-orange-900/10 p-2">
                                <span className="animate-pulse font-bold">></span> INITIALIZING NEURAL LINK...
                            </div>
                            <div className="flex items-center gap-3 text-orange-400 border-l-2 border-orange-400 pl-4 bg-orange-900/10 p-2 delay-100 opacity-80">
                                <span className="animate-pulse font-bold">></span> PARSING ENGINE ARCHITECTURE...
                            </div>
                            <div className="flex items-center gap-3 text-orange-300 border-l-2 border-orange-300 pl-4 bg-orange-900/10 p-2 delay-200 opacity-60">
                                <span className="animate-pulse font-bold">></span> CALCULATING REVENUE MODELS...
                            </div>
                            
                            <div className="mt-8">
                                <div className="flex justify-between text-xs text-orange-500 mb-1 font-bold">
                                    <span>PROGRESS</span>
                                    <span>PROCESSING</span>
                                </div>
                                <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-700">
                                    <div className="h-full bg-orange-500 animate-progress w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {advice && (
                        <div className="h-full overflow-y-auto pr-4 custom-scrollbar">
                            <div className="text-green-400 whitespace-pre-wrap leading-relaxed animate-fadeIn">
                                <span className="text-green-600 select-none mr-4">1</span>{advice}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className="w-3 h-5 bg-green-500 animate-pulse"></span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/30 flex justify-between items-center">
                <div className="text-[10px] text-gray-500 font-mono">
                    MEM_USAGE: 452MB // CPU_LOAD: 12%
                </div>
                <button
                    onClick={fetchAdvice}
                    disabled={loading}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-black font-bold font-teko text-xl px-8 py-3 clip-angled transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,88,12,0.4)]"
                >
                    {loading ? <Cpu className="animate-spin" /> : <Code />}
                    EXECUTE ANALYSIS
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;