import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { detectLocale, saveLocale } from '../i18n';

const LangCtx = createContext(null);

export const LangProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => detectLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir  = locale === 'ar' ? 'rtl' : 'ltr';
    saveLocale(locale);
  }, [locale]);

  const toggleLang = useCallback(() => setLocale(l => l === 'en' ? 'ar' : 'en'), []);

  return (
    <LangCtx.Provider value={{ locale, toggleLang, isAr: locale === 'ar' }}>
      {children}
    </LangCtx.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
};
