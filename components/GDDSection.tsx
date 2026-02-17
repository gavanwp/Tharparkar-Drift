import React, { useState } from 'react';
import { generateGameDesignDoc } from '../services/geminiService';
import { Loader2, ScrollText, BookOpen } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-[600px]">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-2">
        <h3 className="text-xl font-cinzel text-orange-500 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Design Chapters
        </h3>
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleGenerate(topic)}
            disabled={loading && activeTopic === topic}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
              activeTopic === topic
                ? "bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-900/50"
                : "bg-gray-900/50 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-orange-200"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="lg:col-span-3 bg-black/60 border border-orange-900/30 rounded-xl p-8 backdrop-blur-md relative overflow-hidden">
        {/* Decorative Sindhi Pattern Top */}
        <div className="absolute top-0 left-0 right-0 h-2 ajrak-pattern opacity-50"></div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-orange-500 animate-pulse">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-rajdhani text-xl">Consulting Design Archives...</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-orange max-w-none">
            <h2 className="text-3xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200 mb-6 border-b border-orange-800 pb-2">
              {activeTopic}
            </h2>
            <div className="font-rajdhani text-lg leading-relaxed whitespace-pre-wrap text-gray-200">
              {content}
            </div>
          </div>
        )}
        
        {/* Decorative Sindhi Pattern Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2 ajrak-pattern opacity-50"></div>
      </div>
    </div>
  );
};

export default GDDSection;
