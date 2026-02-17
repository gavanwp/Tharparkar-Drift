import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateGameDesignDoc = async (topic: string): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Act as a Lead Game Designer for a AAA racing game titled "Desert Thunder: Tharparkar Drift".
      Write a professional, detailed Game Design Document section about: ${topic}.
      
      Context:
      - Setting: Tharparkar Desert, Sindh, Pakistan.
      - Key elements: Sand dunes, Karoonjhar Mountains, Peacocks, Traditional villages, Solar panels.
      - Style: Realistic open-world.
      
      Format the output with clear Markdown-style headers and bullet points. 
      Focus on mechanics, atmosphere, and user experience.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Error generating GDD:", error);
    return "Failed to generate design document section. Please check API Key.";
  }
};

export const generateTechAdvice = async (): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview'; // Using Pro for complex reasoning
    const prompt = `
      Act as a Technical Director for a game studio.
      Compare Unity and Unreal Engine 5 for the game "Desert Thunder: Tharparkar Drift".
      
      Requirements:
      - Open-world desert environment (high fidelity sand rendering).
      - Vehicle physics (suspension, sand sinking).
      - Dynamic weather (sandstorms).
      
      Provide a recommendation and list the best tools/plugins for sand simulation and monetization strategies (skins, rally pass).
      Format as a technical memo.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No advice generated.";
  } catch (error) {
    console.error("Error generating tech advice:", error);
    return "Failed to generate technical advice.";
  }
};

export const generateConceptImage = async (promptDescription: string): Promise<string | null> => {
  try {
    const model = 'gemini-2.5-flash-image';
    const prompt = `Concept art for a video game called Desert Thunder: Tharparkar Drift. ${promptDescription}. High quality, cinematic lighting, unreal engine 5 render style, desert sunset atmosphere.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    // Check all parts for the image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
