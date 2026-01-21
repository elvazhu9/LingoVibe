
import React, { useState, useEffect } from 'react';
import { AppView, DictionaryEntry, SUPPORTED_LANGUAGES } from './types';
import { dictionaryService } from './geminiService';
import LanguageSelector from './components/LanguageSelector';
import ResultCard from './components/ResultCard';
import ChatBot from './components/ChatBot';
import Flashcards from './components/Flashcards';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SEARCH);
  const [nativeLang, setNativeLang] = useState('zh-CN');
  const [targetLang, setTargetLang] = useState('en');
  const [input, setInput] = useState('');
  const [currentEntry, setCurrentEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [notebook, setNotebook] = useState<DictionaryEntry[]>([]);
  const [story, setStory] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lingovibe_notebook');
    if (saved) {
      try {
        setNotebook(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse notebook data", e);
      }
    }
  }, []);

  const saveToNotebook = (entry: DictionaryEntry) => {
    const exists = notebook.find(e => e.term === entry.term && e.targetLanguage === entry.targetLanguage);
    let updated;
    if (exists) {
      updated = notebook.filter(e => e.id !== exists.id);
    } else {
      updated = [...notebook, entry];
    }
    setNotebook(updated);
    localStorage.setItem('lingovibe_notebook', JSON.stringify(updated));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setView(AppView.RESULT);
    setCurrentEntry(null); // Clear previous result
    
    try {
      const entry = await dictionaryService.lookup(input, nativeLang, targetLang);
      setCurrentEntry(entry);
      
      // Generate image in background
      dictionaryService.generateImage(entry.imagePrompt)
        .then(url => {
          setCurrentEntry(prev => prev && prev.id === entry.id ? { ...prev, imageUrl: url } : prev);
        })
        .catch(err => {
          console.error("Image generation failed", err);
        });
        
    } catch (err: any) {
      console.error("Search failed:", err);
      const errorMessage = err?.message || "Something went wrong.";
      alert(`Oops! ${errorMessage}. Please check your connection or try a different term.`);
      setView(AppView.SEARCH);
    } finally {
      setLoading(false);
    }
  };

  const generateStory = async () => {
    if (notebook.length < 2) {
      alert('Save at least 2 words to make a story!');
      return;
    }
    setLoading(true);
    setView(AppView.STORY);
    setStory(null);
    try {
      const terms = notebook.map(e => e.term);
      const s = await dictionaryService.createStory(terms, nativeLang, targetLang);
      setStory(s);
    } catch (err) {
      alert('Storytelling failed. Please try again later.');
      setView(AppView.NOTEBOOK);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 flex flex-col max-w-2xl mx-auto px-4">
      {/* Header */}
      <header className="py-8 flex items-center justify-between">
        <button onClick={() => setView(AppView.SEARCH)} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110">
            L
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">LingoVibe</span>
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setView(AppView.NOTEBOOK)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${view === AppView.NOTEBOOK ? 'bg-rose-500 text-white shadow-lg' : 'bg-white text-slate-600'}`}
          >
            Notebook
          </button>
          <button 
            onClick={() => setView(AppView.LEARNING)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${view === AppView.LEARNING ? 'bg-amber-400 text-slate-900 shadow-lg' : 'bg-white text-slate-600'}`}
          >
            Review
          </button>
        </div>
      </header>

      <main className="flex-1">
        {view === AppView.SEARCH && (
          <div className="space-y-12 py-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Unlock any word with <span className="text-indigo-600 underline decoration-amber-400 underline-offset-8">Vibe.</span>
              </h1>
              <p className="text-slate-500 text-lg">Type anything—words, slang, or full sentences. We'll break it down for you.</p>
            </div>

            <div className="space-y-8 bg-white p-6 md:p-8 rounded-[40px] shadow-xl border border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <LanguageSelector 
                  label="I speak" 
                  value={nativeLang} 
                  onChange={setNativeLang}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>}
                />
                <LanguageSelector 
                  label="I'm learning" 
                  value={targetLang} 
                  onChange={setTargetLang}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                />
              </div>

              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste a word or sentence..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 px-8 text-xl font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all pr-32 shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : 'GO!'}
                </button>
              </form>
            </div>
          </div>
        )}

        {view === AppView.RESULT && (
          <div className="py-4">
            {loading && !currentEntry ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="space-y-1">
                  <p className="text-slate-900 font-black text-xl">Consulting the linguistic spirits...</p>
                  <p className="text-slate-500 text-sm">Translating culture, not just words.</p>
                </div>
              </div>
            ) : (
              currentEntry && (
                <>
                  <ResultCard 
                    entry={currentEntry} 
                    onSave={saveToNotebook} 
                    isSaved={!!notebook.find(e => e.id === currentEntry.id)}
                  />
                  <ChatBot entry={currentEntry} />
                </>
              )
            )}
          </div>
        )}

        {view === AppView.NOTEBOOK && (
          <div className="space-y-6 py-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-800">Your Words</h2>
              <button 
                onClick={generateStory}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
              >
                <span>✨ Create a Story</span>
              </button>
            </div>
            
            {notebook.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No words saved yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {notebook.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setCurrentEntry(entry);
                      setView(AppView.RESULT);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl overflow-hidden">
                        {entry.imageUrl && <img src={entry.imageUrl} className="w-full h-full object-cover" alt="" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{entry.term}</h4>
                        <p className="text-sm text-slate-500">{entry.explanation}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        saveToNotebook(entry);
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.372 0 2.615.551 3.512 1.435.897-.884 2.14-1.435 3.512-1.435 2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === AppView.STORY && (
          <div className="py-8 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-3xl font-black text-slate-900">Custom Story</h2>
               <button onClick={generateStory} className="text-indigo-600 font-bold text-sm">Regenerate</button>
            </div>
            {loading || !story ? (
              <div className="text-center py-24 space-y-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl animate-bounce mx-auto"></div>
                <p className="text-slate-500 font-bold">Spinning a yarn...</p>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 whitespace-pre-wrap leading-relaxed text-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {story}
              </div>
            )}
            <button 
              onClick={() => setView(AppView.NOTEBOOK)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold transition-transform active:scale-95"
            >
              Back to Notebook
            </button>
          </div>
        )}

        {view === AppView.LEARNING && (
          <Flashcards entries={notebook} />
        )}
      </main>

      {/* Persistent Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/50 h-16 rounded-[28px] flex items-center justify-around px-4 shadow-2xl md:hidden z-40">
        <button onClick={() => setView(AppView.SEARCH)} className={`p-2 transition-all ${view === AppView.SEARCH ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
        <button onClick={() => setView(AppView.NOTEBOOK)} className={`p-2 transition-all ${view === AppView.NOTEBOOK ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </button>
        <button onClick={() => setView(AppView.LEARNING)} className={`p-2 transition-all ${view === AppView.LEARNING ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </nav>
    </div>
  );
};

export default App;
