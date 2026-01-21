
import React from 'react';
import { DictionaryEntry } from '../types';

interface Props {
  entries: DictionaryEntry[];
}

const Flashcards: React.FC<Props> = ({ entries }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const next = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % entries.length), 150);
  };

  const prev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + entries.length) % entries.length), 150);
  };

  if (entries.length === 0) return <div className="text-center p-12 text-slate-400">Add words to your notebook first!</div>;

  const current = entries[currentIndex];

  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800">Learning Mode</h2>
        <p className="text-slate-500">{currentIndex + 1} / {entries.length}</p>
      </div>

      <div 
        className="relative w-full aspect-[3/4] cursor-pointer perspective-1000 group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border-4 border-indigo-100 shadow-xl flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-indigo-50">
              {current.imageUrl && <img src={current.imageUrl} className="w-full h-full object-cover" alt="" />}
            </div>
            <h3 className="text-4xl font-extrabold text-slate-900">{current.term}</h3>
            <p className="text-indigo-500 font-bold uppercase tracking-widest text-sm">Tap to reveal</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-3xl border-4 border-indigo-500 shadow-xl flex flex-col items-center justify-center p-8 text-center rotate-y-180 text-white space-y-6">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">{current.term}</h3>
              <div className="h-px w-12 bg-white/30 mx-auto"></div>
              <p className="text-xl font-medium text-white/90">{current.explanation}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl text-sm italic">
              "{current.examples[0].original}"
            </div>
            <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Tap to Flip back</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={prev} className="p-4 bg-white rounded-2xl shadow-md text-slate-600 hover:bg-slate-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={next} className="p-4 bg-indigo-600 rounded-2xl shadow-md text-white hover:bg-indigo-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
