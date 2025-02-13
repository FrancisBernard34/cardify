import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName } from 'react-native';

interface ThemeStore {
  theme: ColorSchemeName; // 'light' | 'dark' | null (for system default)
  useSystemTheme: boolean;
  setTheme: (theme: ColorSchemeName) => void;
  setUseSystemTheme: (use: boolean) => void;
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: null,
      useSystemTheme: true,
      setTheme: (theme) => set({ theme, useSystemTheme: false }),
      setUseSystemTheme: (use) => set({ useSystemTheme: use, theme: null }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useThemeStore;

// Theme colors
export const lightTheme = {
  background: '#f0f0f0',
  cardBackground: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  primary: '#007AFF',
  success: '#34C759',
  danger: '#FF3B30',
  border: '#e0e0e0',
  buttonText: '#ffffff',
  disabled: '#cccccc',
};

export const darkTheme = {
  background: '#000000',
  cardBackground: '#1c1c1e',
  text: '#ffffff',
  textSecondary: '#ebebf5',
  textTertiary: '#ebebf599',
  primary: '#0a84ff',
  success: '#32d74b',
  danger: '#ff453a',
  border: '#333333',
  buttonText: '#ffffff',
  disabled: '#3a3a3c',
};