
import React from 'react';
import { SUPPORTED_LANGUAGES } from '../types';

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
}

const LanguageSelector: React.FC<Props> = ({ label, value, onChange, icon }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
        {icon} {label}
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
              value === lang.code
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <span>{lang.emoji}</span>
            <span className="truncate">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
