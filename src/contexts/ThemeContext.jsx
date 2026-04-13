

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      
      document.documentElement.classList.add("dark");
    } else {
      
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]); 

  const toggleTheme = () => setIsDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
