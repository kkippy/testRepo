import { GoogleGenAI, Type } from "@google/genai";
import { Template, AIRecommendationResponse } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found, AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getSmartRecommendations = async (
  query: string,
  allTemplates: Template[]
): Promise<AIRecommendationResponse> => {
  const client = getClient();
  if (!client) {
    // Fallback mock response if no API key
    return {
      recommendedIds: allTemplates.slice(0, 3).map(t => t.id),
      reasoning: "API 密钥未配置，为您展示默认推荐。"
    };
  }

  // Create a minified version of templates to save tokens
  const contextData = allTemplates.map(t => ({
    id: t.id,
    title: t.title,
    desc: t.description,
    cat: t.category,
    tags: t.tags.join(", ")
  }));

  const prompt = `
    You are an expert UI curator.
    User Query: "${query}"
    
    Available Templates (JSON):
    ${JSON.stringify(contextData)}
    
    Task: Select the top 1-4 templates that best match the user's intent.
    If the query is vague, pick the most popular or versatile ones.
    
    IMPORTANT: Return the 'reasoning' field in Chinese (Simplified).
    
    Return the result in JSON format.
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIRecommendationResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      recommendedIds: [],
      reasoning: "抱歉，当前无法处理您的请求。"
    };
  }
};