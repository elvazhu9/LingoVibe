
import React from 'react';
import { DictionaryEntry } from '../types';
import { dictionaryService } from '../geminiService';

interface Props {
  entry: DictionaryEntry;
  onSave: (entry: DictionaryEntry) => void;
  isSaved: boolean;
}

const ResultCard: React.FC<Props> = ({ entry, onSave, isSaved }) => {
  const [isPlaying, setIsPlaying] = React.useState<string | null>(null);

  const handlePlay = async (text: string, id: string) => {
    if (isPlaying) return;
    setIsPlaying(id);
    try {
      await dictionaryService.speak(text);
    } finally {
      setIsPlaying(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 mb-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Visual Concept */}
      <div className="aspect-[4/3] sm:aspect-video w-full bg-slate-100 relative group">
        {entry.imageUrl ? (
          <img 
            src={entry.imageUrl} 
            alt={entry.term} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="text-sm font-bold tracking-widest uppercase animate-pulse">Visualizing Concept...</div>
          </div>
        )}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => onSave(entry)}
            className={`p-4 rounded-full shadow-2xl backdrop-blur-md transition-all active:scale-90 ${
              isSaved ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-600 hover:bg-white'
            }`}
          >
            {isSaved ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.372 0 2.615.551 3.512 1.435.897-.884 2.14-1.435 3.512-1.435 2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            )}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      <div className="p-6 md:p-10 space-y-10 relative">
        {/* Term Section */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">
              {entry.term}
            </h1>
            <p className="text-xl font-bold text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded-lg">
              {entry.explanation}
            </p>
          </div>
          <button 
            onClick={() => handlePlay(entry.term, 'term')}
            className={`flex-shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${
              isPlaying === 'term' 
                ? 'bg-indigo-600 text-white animate-pulse shadow-lg shadow-indigo-200' 
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:scale-105 active:scale-95'
            }`}
            title="Hear Pronunciation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          </button>
        </div>

        {/* Example Sentences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-indigo-200 rounded-full"></div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Contextual Examples</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {entry.examples.map((ex, idx) => (
              <div key={idx} className="group bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all p-5 rounded-3xl border border-slate-100 flex items-start gap-4">
                <button 
                  onClick={() => handlePlay(ex.original, `ex-${idx}`)}
                  className={`flex-shrink-0 p-3 rounded-2xl transition-all ${
                    isPlaying === `ex-${idx}` 
                      ? 'bg-indigo-600 text-white animate-pulse' 
                      : 'bg-white text-slate-300 group-hover:text-indigo-500 shadow-sm'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                </button>
                <div className="flex-1">
                  <p className="text-slate-800 font-bold text-lg mb-1 leading-tight">{ex.original}</p>
                  <p className="text-slate-500 text-sm font-medium">{ex.translation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Notes */}
        <div className="relative">
          <div className="absolute -top-4 -left-2 text-4xl opacity-20 pointer-events-none">✨</div>
          <div className="bg-amber-50/80 backdrop-blur-sm p-6 rounded-[32px] border-2 border-amber-100 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-400 p-2 rounded-xl shadow-lg shadow-amber-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-900" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              </div>
              <h3 className="font-black text-amber-900 tracking-tight">The LingoVibe Note</h3>
            </div>
            <p className="text-amber-900/80 leading-relaxed font-medium text-[15px] whitespace-pre-wrap italic">
              {entry.usageNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
