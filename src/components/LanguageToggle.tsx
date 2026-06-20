import React from 'react';
import { Language } from '../i18n';

interface LanguageToggleProps {
  language: Language;
  onChange: (language: Language) => void;
  compact?: boolean;
  label?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onChange, compact = false, label }) => {
  return (
    <div className={`rounded-xl border border-white/10 bg-black/30 ${compact ? 'px-1.5 py-1.5' : 'px-3 py-3'}`}>
      {label && <div className="mb-2 text-[8px] font-black uppercase tracking-[0.24em] text-neutral-500">{label}</div>}
      <div className="flex rounded-lg bg-white/[0.04] p-1 gap-1">
        <button
          onClick={() => onChange('zh')}
          className={`rounded-md px-3 py-1.5 text-[10px] font-black transition-colors ${
            language === 'zh' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          中文
        </button>
        <button
          onClick={() => onChange('en')}
          className={`rounded-md px-3 py-1.5 text-[10px] font-black transition-colors ${
            language === 'en' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
