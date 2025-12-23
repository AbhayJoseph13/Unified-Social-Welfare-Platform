
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const MODEL_NAME = "gemini-2.5-flash"; // Maps Grounding requires 2.5 series
export const PRO_MODEL_NAME = "gemini-3-pro-preview"; // For complex reasoning & search

export interface GroundingSource {
  title: string;
  uri: string;
}

/**
 * Uses Google Maps Grounding to find real-world resources.
 * Requires geolocation.
 */
export const getNearbyResources = async (query: string, lat: number, lng: number) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Find real-world locations for: ${query} near my location.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      },
    });

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          sources.push({
            title: chunk.maps.title || "Location Info",
            uri: chunk.maps.uri
          });
        }
      });
    }

    return {
      text: response.text || "Found some resources nearby.",
      sources
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "Unable to reach Google Maps right now.", sources: [] };
  }
};

/**
 * Advanced Assistant with Search Grounding for current info.
 */
export const getGroundedProChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
) => {
  try {
    const response = await ai.models.generateContent({
      model: PRO_MODEL_NAME,
      contents: {
        parts: [
          ...history.flatMap(h => h.parts),
          { text: newMessage }
        ]
      },
      config: {
        systemInstruction: "You are the SEWA Assistant. Use Google Search to provide up-to-date info on social welfare, NGOs, and government schemes. Always provide URLs from grounding metadata.",
        tools: [{ googleSearch: {} }]
      },
    });

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Search Result",
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      text: response.text || "I processed your request.",
      sources
    };
  } catch (error) {
    console.error("Pro Grounding Error:", error);
    return { text: "Search currently unavailable.", sources: [] };
  }
};

/**
 * Fetches real-time news using Google Search Grounding via Gemini.
 */
export const fetchRealTimeNews = async (scope: 'global' | 'national' | 'local', lat?: number, lng?: number) => {
  try {
    let query = "latest major global news headlines about social impact, humanity and environment";
    if (scope === 'national') query = "top current social welfare, NGO, and government scheme news headlines in India";
    if (scope === 'local') query = `latest local community news and events ${lat && lng ? `near latitude ${lat}, longitude ${lng}` : ''}`;

    const response = await ai.models.generateContent({
      model: PRO_MODEL_NAME,
      contents: `You are a real-time news aggregator API. 
      Perform a Google Search for: "${query}". 
      Select the 6 most relevant and recent articles.
      Return a JSON array where each object has these exact keys:
      - title (string)
      - description (string, max 25 words summary)
      - source (string, publisher name)
      - url (string, the link to the article)
      - publishedAt (string, relative time e.g. "2 hours ago")
      
      Do not include any markdown formatting. Output pure JSON.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });

    const articles = JSON.parse(response.text || "[]");
    
    // Map to application NewsArticle type, adding placeholders for missing data
    return articles.map((art: any, i: number) => ({
      title: art.title,
      description: art.description,
      source: { name: art.source || "Google Search" },
      url: art.url || "#",
      publishedAt: art.publishedAt || new Date().toISOString(),
      // Since Search doesn't return image URLs directly in JSON mode, we use diverse placeholders
      image: `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)}` 
    }));
  } catch (error) {
    console.warn("Gemini Real-time News Failed:", error);
    return null; // Signal to fallback
  }
};

export const analyzeIssueDescription = async (description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze the following issue report: "${description}". Categorize and assess severity.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
            summary: { type: Type.STRING },
            suggestedAction: { type: Type.STRING },
          },
          required: ["category", "severity", "summary", "suggestedAction"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { category: "Other", severity: "MEDIUM", summary: "Analysis failed.", suggestedAction: "Verify manually." };
  }
};

export const getAIChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  systemInstruction: string,
  modelName: string = MODEL_NAME
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: modelName,
      config: { systemInstruction },
      history: history.map(h => ({ role: h.role, parts: h.parts })),
    });
    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "No response received.";
  } catch (error) {
    return "AI Service is temporarily offline.";
  }
};
