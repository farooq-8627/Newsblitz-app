import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const themes = {
  light: {
    // Light theme colors
    bgColor: '#FFFFFF',
    menuBgColor: '#FFFFFF',
    menuSlideColor: 'rgba(0, 0, 0, 0.5)',
    textColor: '#1F2937',
    headingColor: '#111827',
    timeTextColor: '#6B7280',
    iconColor: '#4B5563',
    borderColor: '#E5E7EB',
    cardBgColor: '#FFFFFF',
    cardBorderColor: '#E5E7EB',
  },
  dark: {
    // Dark theme colors from your existing theme
    bgColor: '#1F2937',
    menuBgColor: '#111827',
    menuSlideColor: 'rgba(0, 0, 0, 0.7)',
    textColor: '#F3F4F6',
    headingColor: '#FFFFFF',
    timeTextColor: '#9CA3AF',
    iconColor: '#D1D5DB',
    borderColor: '#374151',
    cardBgColor: '#374151',
    cardBorderColor: '#4B5563',
  },
  sepia: {
    bgColor: '#F7E5D4',
    menuBgColor: '#F7E5D4',
    menuSlideColor: 'rgba(74, 55, 40, 0.5)',
    textColor: '#4A3728',
    headingColor: '#2C1810',
    timeTextColor: '#8B4513',
    iconColor: '#8B4513',
    borderColor: '#DEB887',
    cardBgColor: '#FAF0E6',
    cardBorderColor: '#DEB887',
  },
  night: {
    bgColor: '#1A1B2E',
    menuBgColor: '#151626',
    menuSlideColor: 'rgba(0, 0, 0, 0.7)',
    textColor: '#E2E8F0',
    headingColor: '#FFFFFF',
    timeTextColor: '#94A3B8',
    iconColor: '#4F46E5',
    borderColor: '#2D2E47',
    cardBgColor: '#252642',
    cardBorderColor: '#2D2E47',
  },
  forest: {
    bgColor: '#E7F0E7',
    menuBgColor: '#E7F0E7',
    menuSlideColor: 'rgba(45, 59, 45, 0.5)',
    textColor: '#2D3B2D',
    headingColor: '#1C2B1C',
    timeTextColor: '#3B824B',
    iconColor: '#3B824B',
    borderColor: '#A7C4A7',
    cardBgColor: '#F0F7F0',
    cardBorderColor: '#A7C4A7',
  },
};

type ThemeType = keyof typeof themes;

interface ThemeContextType {
  theme: typeof themes.light;
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  currentTheme: 'light',
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');

  useEffect(() => {
    // Load saved theme from AsyncStorage
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme');
        if (savedTheme) {
          setCurrentTheme(savedTheme as ThemeType);
        } else {
          // If no saved theme, use system preference
          setCurrentTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('@theme', newTheme);
      setCurrentTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[currentTheme],
        currentTheme,
        setTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
