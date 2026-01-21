
export interface ExampleSentence {
  original: string;
  translation: string;
}

export interface DictionaryEntry {
  id: string;
  term: string;
  targetLanguage: string;
  nativeLanguage: string;
  explanation: string;
  examples: ExampleSentence[];
  usageNotes: string;
  imagePrompt: string;
  imageUrl?: string;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum AppView {
  SEARCH = 'search',
  RESULT = 'result',
  NOTEBOOK = 'notebook',
  LEARNING = 'learning',
  STORY = 'story'
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', emoji: '🇺🇸' },
  { code: 'zh-CN', name: 'Mandarin (Simplified)', emoji: '🇨🇳' },
  { code: 'es', name: 'Spanish', emoji: '🇪🇸' },
  { code: 'fr', name: 'French', emoji: '🇫🇷' },
  { code: 'ar', name: 'Arabic', emoji: '🇸🇦' },
  { code: 'hi', name: 'Hindi', emoji: '🇮🇳' },
  { code: 'ja', name: 'Japanese', emoji: '🇯🇵' },
  { code: 'pt', name: 'Portuguese', emoji: '🇧🇷' },
  { code: 'ru', name: 'Russian', emoji: '🇷🇺' },
  { code: 'id', name: 'Indonesian', emoji: '🇮🇩' },
  { code: 'yue', name: 'Cantonese', emoji: '🇭🇰' }
];
