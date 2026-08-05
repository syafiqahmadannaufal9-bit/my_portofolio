import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('portfolio_lang') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('portfolio_lang', language);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'id' ? 'en' : 'id'));
  }, []);

  // Memoize context value to prevent unnecessary re-renders of consumers
  // when the provider itself re-renders for other reasons.
  const value = useMemo(() => ({ language, setLanguage, toggleLanguage }), [language, toggleLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
