import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { theme as themeTokens } from '@/constants/Theme';

const ThemeContext = createContext(themeTokens.colors.light);
const AllTokensContext = createContext(themeTokens);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? themeTokens.colors.dark : themeTokens.colors.light;

  return (
    <AllTokensContext.Provider value={themeTokens}>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </AllTokensContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export const useTokens = () => useContext(AllTokensContext);
