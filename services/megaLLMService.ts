const MEGALLM_API_KEY = 'sk-mega-49931f96a2f99590f5f9ed52b12e1b23cdab0f01f5c8074ce58d43cafb6d7fbc';
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
    model = 'gpt-4o-mini',
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
    model = 'gpt-4o-mini',
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
