

import { createContext, useContext, useState, useEffect } from "react";

import en from "../translations/en"; 
import ar from "../translations/ar"; 

const LanguageContext = createContext(null);

const translations = { en, ar };

export const LanguageProvider = ({ children }) => {
  
  const [lang, setLang] = useState("en");

  useEffect(() => {
    
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    
    document.documentElement.lang = lang;
  }, [lang]); 

  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"));

  const isRTL = lang === "ar";

  const t = (key) => {
    
    const keys = key.split(".");
    
    let val = translations[lang];
    
    for (const k of keys) val = val?.[k];
    
    return val || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
