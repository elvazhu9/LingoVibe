
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DictionaryEntry, ChatMessage } from "./types";

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const dictionaryService = {
  async lookup(term: string, nativeLang: string, targetLang: string): Promise<DictionaryEntry> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Explain "${term}". 
          Note: The user's native language is ${nativeLang} and the target language they are learning is ${targetLang}. 
          If the input "${term}" is in ${nativeLang}, translate it to the most natural equivalent in ${targetLang} and use that as the primary 'term' for the result. 
          If it's already in ${targetLang}, use it directly.
          Output in JSON format only.`
        }]
      }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING, description: 'The main word or phrase in the TARGET language.' },
            explanation: { type: Type.STRING, description: 'Clear, natural explanation in the NATIVE language.' },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: 'Example sentence in the TARGET language.' },
                  translation: { type: Type.STRING, description: 'Translation of the example in the NATIVE language.' }
                },
                required: ['original', 'translation']
              }
            },
            usageNotes: { type: Type.STRING, description: 'Casual, friendly chat-like notes about culture, usage, tone, and related words.' },
            imagePrompt: { type: Type.STRING, description: 'A detailed prompt to generate a visual representing this concept.' }
          },
          required: ['term', 'explanation', 'examples', 'usageNotes', 'imagePrompt']
        },
        systemInstruction: `You are a cool, young, bilingual language expert. 
        When explaining, act like a close friend sending a voice message or text. Use simple, direct language. 
        Avoid textbook phrasing. 
        For usageNotes:
        1. Be punchy and direct.
        2. Explain the "vibe" (formal, casual, slang).
        3. Mention 1-2 synonyms or "false friends" (words that look similar but mean something else).
        4. Keep it visually airy and easy to read.`
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const data = JSON.parse(text);
    return {
      id: Date.now().toString(),
      nativeLanguage: nativeLang,
      targetLanguage: targetLang,
      ...data,
      timestamp: Date.now()
    };
  },

  async generateImage(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{
        parts: [{ text: `A vibrant, modern, and artistic concept illustration of: ${prompt}. Use a clean style, bright colors, 3D render feel or pop-art.` }]
      }]
    });

    if (!response.candidates?.[0]?.content?.parts) throw new Error("No parts in response");

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image generated');
  },

  async speak(text: string): Promise<void> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1
    );
    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);
    source.start();
  },

  async chat(history: ChatMessage[], context: DictionaryEntry): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are discussing the term "${context.term}" (translated as "${context.explanation}"). 
        The user is learning this language. Answer their questions like a friendly tutor. 
        If they ask in their native language (${context.nativeLanguage}), you can respond in a mix of both to help them learn.`
      }
    });

    const lastMsg = history[history.length - 1].content;
    const response = await chat.sendMessage({ message: lastMsg });
    return response.text || "I'm sorry, I couldn't generate a response.";
  },

  async createStory(terms: string[], nativeLang: string, targetLang: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Create a funny, short story using these words: ${terms.join(', ')}. 
          Target language: ${targetLang}. 
          Native language: ${nativeLang}. 
          Format: One sentence in ${targetLang}, followed by its translation in ${nativeLang}.`
        }]
      }]
    });
    return response.text || "I couldn't write the story this time.";
  }
};
