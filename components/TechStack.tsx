import React, { useState } from 'react';
    import { generateTechAdvice } from '../services/geminiService';
    import { Cpu, Terminal, DollarSign, CloudLightning } from 'lucide-react';
    
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-cinzel text-white">Technical Director's Log</h2>
                <p className="text-gray-400 font-rajdhani mt-2">Engine Architecture & Monetization Strategy</p>
              </div>
              <button
                onClick={fetchAdvice}
                disabled={loading}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-full font-bold transition-colors disabled:opacity-50"
              >
                {loading ? <Cpu className="animate-spin" /> : <Terminal />}
                {loading ? "Analyzing..." : "Generate Tech Analysis"}
              </button>
            </div>
    
            {advice ? (
              <div className="bg-black/40 p-6 rounded-lg border-l-4 border-orange-500 font-mono text-gray-300 whitespace-pre-wrap shadow-inner">
                {advice}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <CloudLightning className="text-yellow-400 w-8 h-8 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Engine Choice</h3>
                  <p className="text-gray-400 text-sm">Analysis of Unity vs. Unreal Engine 5 for sand rendering and vehicle physics.</p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <DollarSign className="text-green-400 w-8 h-8 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Monetization</h3>
                  <p className="text-gray-400 text-sm">Strategies for skins, rally passes, and premium content in the Pakistani market.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };
    
    export default TechStack;
    