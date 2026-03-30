import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useConnectionStore = create(
    persist(
        (set, get) => ({
            connections: [], // array of objects { id, uri, name }
            activeUri: null,
            addConnection: (connection) => {
                // simple duplicate check
                const current = get().connections;
                if (!current.find(c => c.uri === connection.uri)) {
                    set({ connections: [...current, { id: Date.now().toString(), ...connection }] });
                }
            },
            removeConnection: (id) => set((state) => ({
                connections: state.connections.filter(c => c.id !== id),
                activeUri: state.connections.find(c => c.id === id)?.uri === state.activeUri ? null : state.activeUri
            })),
            setActiveUri: (uri) => set({ activeUri: uri })
        }),
        {
            name: 'mongo-connections',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
