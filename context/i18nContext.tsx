
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { translations, TranslationKey } from '../i18n/locales';

type Language = 'en' | 'zh-TW';

interface I18nContextType {
  language: Language;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const userLang = navigator.language;
    if (userLang.startsWith('zh-TW') || userLang.startsWith('zh-HK')) {
      setLanguage('zh-TW');
    } else {
      setLanguage('en');
    }
  }, []);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key];
  };

  return (
    <I18nContext.Provider value={{ language, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
