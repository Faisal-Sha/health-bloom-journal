import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'excited';
  tags: string[];
  familyMemberId?: string;
  createdAt: string;
  updatedAt: string;
}

interface EntryState {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDate: (date: string) => DiaryEntry[];
  getEntriesByMood: (mood: DiaryEntry['mood']) => DiaryEntry[];
}

export const useEntryStore = create<EntryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: DiaryEntry = {
          ...entry,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          entries: [newEntry, ...state.entries]
        }));
      },

      updateEntry: (id, updatedData) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updatedData, updatedAt: new Date().toISOString() }
              : entry
          )
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id)
        }));
      },

      getEntriesByDate: (date) => {
        return get().entries.filter((entry) => entry.date === date);
      },

      getEntriesByMood: (mood) => {
        return get().entries.filter((entry) => entry.mood === mood);
      }
    }),
    {
      name: 'health-diary-entries'
    }
  )
);