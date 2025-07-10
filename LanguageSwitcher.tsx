import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { Language } from '../types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLocalization();

  const buttonClasses = (lang: Language) => 
    `px-4 py-2 text-sm font-bold rounded-md transition-colors duration-200 ` +
    (language === lang
      ? 'bg-purple-600 text-white'
      : 'bg-gray-700 text-gray-300 hover:bg-gray-600');

  return (
    <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
      <button onClick={() => setLanguage(Language.EN)} className={buttonClasses(Language.EN)}>
        EN
      </button>
      <button onClick={() => setLanguage(Language.PT)} className={buttonClasses(Language.PT)}>
        PT
      </button>
    </div>
  );
};

export default LanguageSwitcher;
