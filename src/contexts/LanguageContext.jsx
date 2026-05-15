import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

const LanguageContext = createContext(null);

const LANGS = ["en", "ar", "fr"];

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("en");

  const toggleLang = () => {
    const next = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length];
    setLang(next);
    i18n.changeLanguage(next);
    document.documentElement.dir  = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
  };

  const isRTL = lang === "ar";

  return (
    <LanguageContext.Provider value={{ t, lang, toggleLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
