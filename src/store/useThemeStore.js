import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useThemeStore = create(
    persist(
        (set) => ({
            isDark: false,
            toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
            setTheme: (isDark) => set({ isDark }),
        }),
        {
            name: 'app-theme',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
