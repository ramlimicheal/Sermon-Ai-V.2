
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Illustration, CrossReference, OutlineType, Language, EngagementItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get the model
const getModel = () => 'gemini-2.5-flash';

const getLanguageInstruction = (language: Language) => {
  return language === 'Tamil' 
    ? " IMPORTANT: output ALL user-facing text content in Tamil language. Keep JSON keys in English." 
    : " Output in English.";
};

// Helper to clean Markdown code blocks which cause "crowded" code-style rendering
const cleanGeminiOutput = (text: string | undefined): string => {
  if (!text) return "";
  // Remove ```markdown ... ``` or just ``` ... ``` wrappers
  return text.replace(/^```(?:markdown)?\s*/i, '').replace(/\s*```$/, '').trim();
};

export const synthesizeCommentary = async (scripture: string, language: Language): Promise<string> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `
      Act as a world-class biblical scholar and theologian.
      Provide a synthesized commentary overview for the passage: "${scripture}".
      ${langInstruction}
      
      Structure your response with the following Markdown headings:
      1. **Historical Context**: Setting, author, and audience.
      2. **Exegetical Insights**: Key original language notes (Greek/Hebrew) and verse-by-verse summary.
      3. **Theological Perspectives**: Synthesize views from historical figures (e.g., Augustine, Luther, Calvin) to modern scholars.
      4. **The Nature of God**: Specifically analyze what this passage reveals about God's character and attributes.
      5. **Key Themes**: The main theological points.
      
      Keep it concise, accessible for sermon prep, yet intellectually deep.
      Do not wrap response in a code block.
    `;

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful research assistant for a pastor.",
      }
    });

    return cleanGeminiOutput(response.text) || "No commentary generated.";
  } catch (error) {
    console.error("Commentary Error:", error);
    throw new Error("Failed to synthesize commentary.");
  }
};

export const findIllustrations = async (theme: string, language: Language): Promise<Illustration[]> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Find 3 distinct, powerful sermon illustrations for the theme: "${theme}".
    1. One from History.
    2. One from Classic Literature or Pop Culture.
    3. One from Science or Nature.
    
    ${langInstruction}
    Return the result strictly as a JSON array.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          sourceType: { type: Type.STRING, enum: ['Historical', 'Literature', 'Scientific', 'Modern', 'Other'] },
          content: { type: Type.STRING, description: "A summary of the story or concept suitable for speaking." },
        },
        required: ['title', 'sourceType', 'content'],
      },
    };

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Illustration[];
  } catch (error) {
    console.error("Illustration Error:", error);
    throw new Error("Failed to find illustrations.");
  }
};

export const getCrossReferences = async (scripture: string, language: Language): Promise<CrossReference[]> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Provide 5 key biblical cross-references that intellectually and thematically connect to: "${scripture}".
    Explain the connection briefly for each. 
    ${langInstruction}
    Return as JSON.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING },
          connection: { type: Type.STRING },
        },
        required: ['reference', 'connection'],
      },
    };

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as CrossReference[];
  } catch (error) {
    console.error("Cross Reference Error:", error);
    throw new Error("Failed to get cross references.");
  }
};

export const generateEngagementContent = async (scripture: string, language: Language): Promise<EngagementItem[]> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Generate 4 engagement tools for a sermon on "${scripture}" to help the pastor connect with the audience.
    Include:
    1. An Ice Breaker (fun opening).
    2. A Humorous Anecdote or Saying related to the topic.
    3. An Interactive Question to ask the audience.
    4. A Powerful Quote.

    ${langInstruction}
    Return as JSON.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ['Ice Breaker', 'Humor', 'Interactive Question', 'Quote'] },
          content: { type: Type.STRING },
        },
        required: ['category', 'content'],
      },
    };

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as EngagementItem[];
  } catch (error) {
    console.error("Engagement Error:", error);
    throw new Error("Failed to generate engagement content.");
  }
};

export const generateOutline = async (scripture: string, outlineType: OutlineType, language: Language): Promise<string> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Create a sermon outline for "${scripture}" following the "${outlineType}" structure.
    
    The outline should include:
    - A Title
    - Main Points with supporting verses
    - Brief application points for each section
    - A conclusion
    
    ${langInstruction}
    Format using Markdown.
    Do not wrap response in a code block.`;

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
    });

    return cleanGeminiOutput(response.text) || "No outline generated.";
  } catch (error) {
    console.error("Outline Error:", error);
    throw new Error("Failed to generate outline.");
  }
};
