import { useColorScheme } from 'react-native';
import useThemeStore, { lightTheme, darkTheme } from '../stores/theme-store';

export function useTheme() {
  const systemTheme = useColorScheme();
  const { theme, useSystemTheme } = useThemeStore();
  
  // Determine which theme to use
  const activeTheme = useSystemTheme ? systemTheme : theme;
  const isDark = activeTheme === 'dark';
  
  return {
    isDark,
    colors: isDark ? darkTheme : lightTheme,
    // Helper function to get the correct color for text based on background
    getTextColor: (backgroundColor: string) => {
      // Simple luminance calculation
      const isLightBg = backgroundColor.toLowerCase() === '#ffffff' || 
                       backgroundColor.toLowerCase() === '#fff';
      return isLightBg ? '#000000' : '#ffffff';
    }
  };
}