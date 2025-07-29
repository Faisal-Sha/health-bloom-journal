import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/apiClient';

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

      addEntry: async (entry) => {
        try {
          const response = await api.post('/family/entries', entry);
          const newEntry: DiaryEntry = response.data;
          set((state) => ({
            entries: [newEntry, ...state.entries]
          }));
          return {success: true, entry: newEntry};
        } catch (error) {
          console.error('Error adding entry:', error);
          return { success: false, message: error?.response?.data?.message || 'Failed to add entry.' };
        }
      },

      updateEntry: async(id, updatedData) => {
        try {
          const response = await api.post(`/family/entries/${id}`, updatedData);
          const update: DiaryEntry = response.data;
          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === id
                ? { ...entry, ...updatedData, updatedAt: new Date().toISOString() }
                : entry
            )
          }));
          return {success: true, entry: update};
        } catch (error) {
          console.error('Error updating entry:', error);
          return { success: false, message: error?.response?.data?.message || 'Failed to update entry.' };
        }
      },

      deleteEntry: async (id) => {
        try {
          await api.delete(`/family/entries/${id}`);
          set((state) => ({
            entries: state.entries.filter((entry) => entry.id !== id)
          }));
          return { success: true, message: 'Entry deleted successfully.' };
        } catch (error) {
          console.error('Error deleting entry:', error);
          return { success: false, message: error?.response?.data?.message || 'Failed to delete entry.' };
        }
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