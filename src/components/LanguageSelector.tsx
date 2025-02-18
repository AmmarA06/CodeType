import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages: { value: Language; label: string; icon: string }[] = [
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'cpp', label: 'C++', icon: '⚙️' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
];

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {languages.map(lang => (
        <button
          key={lang.value}
          onClick={() => onLanguageChange(lang.value)}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${
              selectedLanguage === lang.value
                ? 'bg-accent-primary text-dark-bg'
                : 'bg-dark-card text-dark-text hover:bg-dark-border'
            }
          `}
        >
          <span className="mr-2">{lang.icon}</span>
          {lang.label}
        </button>
      ))}
    </div>
  );
};
