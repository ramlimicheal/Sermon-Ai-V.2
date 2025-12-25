const MEGALLM_API_KEY = import.meta.env.VITE_MEGALLM_API_KEY || '';
const MEGALLM_BASE_URL = 'https://ai.megallm.io/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const callMegaLLM = async (
  messages: ChatMessage[],
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    response_format?: { type: 'json_object' | 'text' };
  } = {}
): Promise<string> => {
  const {
    model = 'llama3-8b-instruct',
    temperature = 0.7,
    max_tokens = 4096,
    response_format,
  } = options;

  try {
    const body: any = {
      model,
      messages,
      temperature,
      max_tokens,
    };

    if (response_format) {
      body.response_format = response_format;
    }

    const response = await fetch(`${MEGALLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MEGALLM_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MegaLLM API Error:', response.status, errorText);
      throw new Error(`MegaLLM API Error: ${response.status}`);
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('MegaLLM Request Error:', error);
    throw error;
  }
};

export const streamMegaLLM = async (
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<string> => {
  const {
    model = 'llama3-8b-instruct',
    temperature = 0.7,
    max_tokens = 4096,
  } = options;

  try {
    const response = await fetch(`${MEGALLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MEGALLM_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`MegaLLM API Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    return fullContent;
  } catch (error) {
    console.error('MegaLLM Stream Error:', error);
    throw error;
  }
};

// Helper function to generate sermon content with MegaLLM
export const generateSermonContent = async (
  type: 'commentary' | 'illustrations' | 'outline' | 'applications' | 'crossReferences',
  scripture: string,
  language: 'English' | 'Tamil' = 'English',
  additionalContext?: string
): Promise<string> => {
  const languageInstruction = language === 'Tamil' 
    ? 'Output ALL user-facing text content in Tamil language.' 
    : 'Output in English.';

  const prompts: Record<string, string> = {
    commentary: `Act as a world-class biblical scholar and theologian.
Provide a synthesized commentary overview for the passage: "${scripture}".
${languageInstruction}

Structure your response with these sections:
1. **Historical Context**: Setting, author, and audience.
2. **Exegetical Insights**: Key original language notes (Greek/Hebrew) and verse-by-verse summary.
3. **Theological Perspectives**: Synthesize views from historical figures (Augustine, Luther, Calvin) to modern scholars.
4. **The Nature of God**: What this passage reveals about God's character.
5. **Key Themes**: The main theological points.

Keep it concise, accessible for sermon prep, yet intellectually deep.`,

    illustrations: `Find 3 distinct, powerful sermon illustrations for the passage: "${scripture}".
${languageInstruction}

Provide:
1. One from History
2. One from Classic Literature or Pop Culture
3. One from Science or Nature

For each illustration include:
- Title
- Source type (Historical/Literature/Scientific/Modern)
- The story or concept suitable for speaking
- How it connects to the passage`,

    outline: `Create a sermon outline for "${scripture}".
${languageInstruction}
${additionalContext ? `Style: ${additionalContext}` : ''}

Include:
- A compelling Title
- Main Points with supporting verses
- Brief application points for each section
- Transitions between points
- A powerful conclusion

Format using clear Markdown headings.`,

    applications: `Generate practical applications of "${scripture}" for different audiences.
${languageInstruction}

For each of these groups provide specific, actionable applications:
- Youth (teens)
- Families
- Singles
- Professionals
- Seniors

Include:
- How the passage applies to their specific life situation
- A concrete action step they can take this week`,

    crossReferences: `Provide 5 key biblical cross-references that connect to: "${scripture}".
${languageInstruction}

For each reference include:
- The scripture reference
- The type of connection (thematic, prophetic, typological, etc.)
- A brief explanation of how they connect`,
  };

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful research assistant for pastors preparing sermons. Provide accurate, scholarly, and practical content.',
    },
    {
      role: 'user',
      content: prompts[type] || prompts.commentary,
    },
  ];

  return callMegaLLM(messages, { temperature: 0.7 });
};

export const generateEngagementContent = async (
  scripture: string,
  language: 'English' | 'Tamil' = 'English'
): Promise<any[]> => {
  const languageInstruction = language === 'Tamil'
    ? 'Output ALL user-facing text content in Tamil language.'
    : 'Output in English.';

  const prompt = `Generate 4 engagement tools for a sermon on "${scripture}" to help the pastor connect with the audience.
${languageInstruction}

Include:
1. An Ice Breaker (fun opening)
2. A Humorous Anecdote or Saying related to the topic
3. An Interactive Question to ask the audience
4. A Powerful Quote

Return a JSON array with exactly 4 objects, each having:
- category: One of ["Ice Breaker", "Humor", "Interactive Question", "Quote"]
- content: The actual content

Return ONLY the JSON array, no other text.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a helpful assistant that creates engaging sermon content. Always respond with valid JSON.' },
    { role: 'user', content: prompt }
  ];

  const response = await callMegaLLM(messages, { temperature: 0.7 });

  try {
    const parsed = JSON.parse(response);
    return Array.isArray(parsed) ? parsed : parsed.items || [];
  } catch {
    const match = response.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  }
};

export const getExegeticalNotes = async (
  scripture: string,
  language: 'English' | 'Tamil' = 'English'
): Promise<any> => {
  const languageInstruction = language === 'Tamil'
    ? 'Output ALL user-facing text content in Tamil language.'
    : 'Output in English.';

  const prompt = `Provide advanced exegetical notes for "${scripture}".
${languageInstruction}

Include these sections:
- literaryStructure: Literary structure and genre analysis
- grammaticalInsights: Key grammatical observations
- textualVariants: Significant textual variants (if any)
- theologicalThemes: Main theological themes
- homileticalBridges: How to preach this passage effectively

Return as a JSON object with these exact keys.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a biblical scholar providing exegetical notes. Always respond with valid JSON.' },
    { role: 'user', content: prompt }
  ];

  const response = await callMegaLLM(messages, { temperature: 0.7 });
  return JSON.parse(response);
};

export const getGreekHebrewAnalysis = async (
  scripture: string,
  language: 'English' | 'Tamil' = 'English'
): Promise<any[]> => {
  const languageInstruction = language === 'Tamil'
    ? 'Output ALL user-facing text content in Tamil language except for Greek/Hebrew characters.'
    : 'Output in English.';

  const prompt = `Analyze the key Greek or Hebrew words in "${scripture}".
${languageInstruction}

Provide 3-5 significant words with:
- word: Original word (Greek/Hebrew characters)
- transliteration: English transliteration
- strongsNumber: Strong's concordance number
- definition: Concise definition
- usage: How it's used in this context

Return as JSON array.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a biblical languages expert. Always respond with valid JSON.' },
    { role: 'user', content: prompt }
  ];

  const response = await callMegaLLM(messages, { temperature: 0.7 });

  try {
    const parsed = JSON.parse(response);
    return Array.isArray(parsed) ? parsed : parsed.words || [];
  } catch {
    const match = response.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  }
};

export const getHistoricalContext = async (
  scripture: string,
  language: 'English' | 'Tamil' = 'English'
): Promise<any> => {
  const languageInstruction = language === 'Tamil'
    ? 'Output ALL user-facing text content in Tamil language.'
    : 'Output in English.';

  const prompt = `Provide comprehensive historical context for "${scripture}".
${languageInstruction}

Include these sections:
- timePeriod: Time period when written
- culturalBackground: Cultural context
- geographicalSetting: Geographic location and setting
- politicalContext: Political situation
- religiousContext: Religious environment

Return as a JSON object with these exact keys.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a biblical historian. Always respond with valid JSON.' },
    { role: 'user', content: prompt }
  ];

  const response = await callMegaLLM(messages, { temperature: 0.7 });
  return JSON.parse(response);
};

export const getParallelPassages = async (
  scripture: string,
  language: 'English' | 'Tamil' = 'English'
): Promise<any[]> => {
  const languageInstruction = language === 'Tamil'
    ? 'Output ALL user-facing text content in Tamil language.'
    : 'Output in English.';

  const prompt = `Find parallel passages for "${scripture}" across the Bible.
${languageInstruction}

Include:
- Gospel parallels (if applicable)
- Old Testament/New Testament connections
- Thematic parallels

For each provide:
- reference: Scripture reference
- relationshipType: Type of relationship (parallel, fulfillment, echo, contrast, thematic)
- explanation: Brief explanation of the connection

Return as JSON array with 5-7 references.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a biblical cross-reference expert. Always respond with valid JSON.' },
    { role: 'user', content: prompt }
  ];

  const response = await callMegaLLM(messages, { temperature: 0.7 });

  try {
    const parsed = JSON.parse(response);
    return Array.isArray(parsed) ? parsed : parsed.passages || [];
  } catch {
    const match = response.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  }
};

export const generateSermonSeries = async (
  theme: string,
  weeks: number,
  language: 'English' | 'Tamil' = 'English'
): Promise<any[]> => {
  const languageInstruction = language === 'Tamil'
    ? 'Output ALL user-facing text content in Tamil language.'
    : 'Output in English.';

  const prompt = `Create a ${weeks}-week sermon series on the theme: "${theme}".
${languageInstruction}

For each week provide:
- week: Week number (1, 2, 3, etc.)
- title: Sermon title for that week
- scripture: Main scripture passage
- keyPoints: Array of 3-4 key points
- progression: How this builds on previous weeks

Return as JSON array with ${weeks} objects.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a sermon planning expert. Always respond with valid JSON.' },
    { role: 'user', content: prompt }
  ];

  const response = await callMegaLLM(messages, { temperature: 0.7, max_tokens: 6000 });

  try {
    const parsed = JSON.parse(response);
    return Array.isArray(parsed) ? parsed : parsed.series || [];
  } catch {
    const match = response.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  }
};

export const getTheologicalPerspectives = async (
  scripture: string,
  language: 'English' | 'Tamil' = 'English'
): Promise<any[]> => {
  const languageInstruction = language === 'Tamil'
    ? 'Output ALL user-facing text content in Tamil language.'
    : 'Output in English.';

  const prompt = `Provide interpretations of "${scripture}" from different Christian traditions.
${languageInstruction}

Include these traditions:
- Reformed
- Catholic
- Orthodox
- Pentecostal
- Baptist
- Methodist

For each provide:
- tradition: Tradition name
- interpretation: Their interpretation of the passage
- keyEmphasis: What they emphasize in this passage

Return as JSON array.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a theological expert familiar with various Christian traditions. Always respond with valid JSON.' },
    { role: 'user', content: prompt }
  ];

  const response = await callMegaLLM(messages, { temperature: 0.7 });

  try {
    const parsed = JSON.parse(response);
    return Array.isArray(parsed) ? parsed : parsed.perspectives || [];
  } catch {
    const match = response.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  }
};
