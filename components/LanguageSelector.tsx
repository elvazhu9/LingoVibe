
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
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border-2 border-slate-100 rounded-2xl py-3 px-4 pr-10 text-sm font-semibold text-slate-700 hover:border-indigo-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer shadow-sm"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.emoji} {lang.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
