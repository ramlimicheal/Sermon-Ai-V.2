
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Illustration, CrossReference, OutlineType, Language, EngagementItem } from "@/types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
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

// Greek & Hebrew Word Analysis
export const analyzeOriginalLanguages = async (scripture: string, language: Language): Promise<any[]> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Analyze the key Greek or Hebrew words in "${scripture}".
    Provide 3-5 significant words with:
    - Original word (Greek/Hebrew characters)
    - Transliteration
    - Strong's number
    - Definition
    - Usage in context
    ${langInstruction}
    Return as JSON array.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          transliteration: { type: Type.STRING },
          strongsNumber: { type: Type.STRING },
          definition: { type: Type.STRING },
          usage: { type: Type.STRING },
        },
        required: ['word', 'transliteration', 'strongsNumber', 'definition', 'usage'],
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
    return JSON.parse(text);
  } catch (error) {
    console.error("Original Languages Error:", error);
    throw new Error("Failed to analyze original languages.");
  }
};

// Historical Context
export const getHistoricalContext = async (scripture: string, language: Language): Promise<any> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Provide comprehensive historical context for "${scripture}".
    Include:
    - Time period
    - Cultural background
    - Geographical setting
    - Political context
    - Religious context
    ${langInstruction}
    Return as JSON object.`;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        timeperiod: { type: Type.STRING },
        culturalBackground: { type: Type.STRING },
        geographicalSetting: { type: Type.STRING },
        politicalContext: { type: Type.STRING },
        religiousContext: { type: Type.STRING },
      },
      required: ['timeperiod', 'culturalBackground', 'geographicalSetting', 'politicalContext', 'religiousContext'],
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
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Historical Context Error:", error);
    throw new Error("Failed to get historical context.");
  }
};

// Theological Perspectives
export const getTheologicalPerspectives = async (scripture: string, language: Language): Promise<any[]> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Provide interpretations of "${scripture}" from different Christian traditions:
    Reformed, Catholic, Orthodox, Pentecostal, Baptist, Methodist.
    For each tradition provide:
    - Tradition name
    - Interpretation
    - Key emphasis
    ${langInstruction}
    Return as JSON array.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tradition: { type: Type.STRING },
          interpretation: { type: Type.STRING },
          keyEmphasis: { type: Type.STRING },
        },
        required: ['tradition', 'interpretation', 'keyEmphasis'],
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
    return JSON.parse(text);
  } catch (error) {
    console.error("Theological Perspectives Error:", error);
    throw new Error("Failed to get theological perspectives.");
  }
};

// Practical Applications
export const generateApplications = async (scripture: string, language: Language): Promise<any[]> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Generate practical applications of "${scripture}" for different audiences:
    Youth, Families, Singles, Professionals, Seniors.
    For each provide:
    - Audience
    - Application (how it applies to their life)
    - Action step (specific thing they can do this week)
    ${langInstruction}
    Return as JSON array.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          audience: { type: Type.STRING },
          application: { type: Type.STRING },
          actionStep: { type: Type.STRING },
        },
        required: ['audience', 'application', 'actionStep'],
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
    return JSON.parse(text);
  } catch (error) {
    console.error("Applications Error:", error);
    throw new Error("Failed to generate applications.");
  }
};

// Parallel Passages (Gospel Harmonization)
export const getParallelPassages = async (scripture: string, language: Language): Promise<any[]> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Find parallel passages for "${scripture}" across the Bible.
    Include:
    - Gospel parallels (if applicable)
    - Old Testament/New Testament connections
    - Thematic parallels
    For each provide:
    - Reference
    - Relationship type (parallel, fulfillment, echo, contrast)
    - Explanation of connection
    ${langInstruction}
    Return as JSON array.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING },
          relationshipType: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ['reference', 'relationshipType', 'explanation'],
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
    return JSON.parse(text);
  } catch (error) {
    console.error("Parallel Passages Error:", error);
    throw new Error("Failed to get parallel passages.");
  }
};

// Sermon Illustrations from Church History
export const getChurchHistoryIllustrations = async (scripture: string, language: Language): Promise<any[]> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Provide church history illustrations related to "${scripture}".
    Include stories from:
    - Early Church Fathers
    - Reformation leaders
    - Revival movements
    - Modern church history
    For each provide:
    - Historical figure or event
    - Time period
    - Story/illustration
    - Application to the passage
    ${langInstruction}
    Return as JSON array.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          figure: { type: Type.STRING },
          timePeriod: { type: Type.STRING },
          story: { type: Type.STRING },
          application: { type: Type.STRING },
        },
        required: ['figure', 'timePeriod', 'story', 'application'],
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
    return JSON.parse(text);
  } catch (error) {
    console.error("Church History Error:", error);
    throw new Error("Failed to get church history illustrations.");
  }
};

// Sermon Series Builder
export const generateSermonSeries = async (theme: string, weeks: number, language: Language): Promise<any[]> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Create a ${weeks}-week sermon series on the theme: "${theme}".
    For each week provide:
    - Week number
    - Sermon title
    - Main scripture passage
    - Key points (3-4 bullet points)
    - Series progression (how it builds on previous weeks)
    ${langInstruction}
    Return as JSON array.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          week: { type: Type.NUMBER },
          title: { type: Type.STRING },
          scripture: { type: Type.STRING },
          keyPoints: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          progression: { type: Type.STRING },
        },
        required: ['week', 'title', 'scripture', 'keyPoints', 'progression'],
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
    return JSON.parse(text);
  } catch (error) {
    console.error("Sermon Series Error:", error);
    throw new Error("Failed to generate sermon series.");
  }
};

// Exegetical Notes (Advanced Commentary)
export const getExegeticalNotes = async (scripture: string, language: Language): Promise<any> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Provide advanced exegetical notes for "${scripture}".
    Include:
    - Literary structure and genre
    - Grammatical insights
    - Textual variants (if significant)
    - Theological themes
    - Homiletical bridges (how to preach this)
    ${langInstruction}
    Return as JSON object.`;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        literaryStructure: { type: Type.STRING },
        grammaticalInsights: { type: Type.STRING },
        textualVariants: { type: Type.STRING },
        theologicalThemes: { type: Type.STRING },
        homileticalBridges: { type: Type.STRING },
      },
      required: ['literaryStructure', 'grammaticalInsights', 'textualVariants', 'theologicalThemes', 'homileticalBridges'],
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
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Exegetical Notes Error:", error);
    throw new Error("Failed to get exegetical notes.");
  }
};

// Preaching Outline with Transitions
export const generateAdvancedOutline = async (scripture: string, outlineType: OutlineType, language: Language): Promise<any> => {
  try {
    const langInstruction = getLanguageInstruction(language);
    const prompt = `Create a detailed ${outlineType} sermon outline for "${scripture}".
    Include:
    - Introduction (hook, context, thesis)
    - Main points (3-4 with sub-points)
    - Transitions between points
    - Illustrations placement suggestions
    - Conclusion (summary, application, call to action)
    ${langInstruction}
    Return as JSON object.`;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        introduction: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            context: { type: Type.STRING },
            thesis: { type: Type.STRING },
          },
          required: ['hook', 'context', 'thesis'],
        },
        mainPoints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              point: { type: Type.STRING },
              subPoints: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              transition: { type: Type.STRING },
            },
            required: ['point', 'subPoints', 'transition'],
          },
        },
        conclusion: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            application: { type: Type.STRING },
            callToAction: { type: Type.STRING },
          },
          required: ['summary', 'application', 'callToAction'],
        },
      },
      required: ['introduction', 'mainPoints', 'conclusion'],
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
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Advanced Outline Error:", error);
    throw new Error("Failed to generate advanced outline.");
  }
};
