import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relation: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface FamilyState {
  members: FamilyMember[];
  addMember: (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMember: (id: string, member: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  getMemberById: (id: string) => FamilyMember | undefined;
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      members: [],

      addMember: (member) => {
        const newMember: FamilyMember = {
          ...member,
          id: Date.now().toString(),
          avatar: member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          members: [...state.members, newMember]
        }));
      },

      updateMember: (id, updatedData) => {
        set((state) => ({
          members: state.members.map((member) =>
            member.id === id
              ? { ...member, ...updatedData, updatedAt: new Date().toISOString() }
              : member
          )
        }));
      },

      deleteMember: (id) => {
        set((state) => ({
          members: state.members.filter((member) => member.id !== id)
        }));
      },

      getMemberById: (id) => {
        return get().members.find((member) => member.id === id);
      }
    }),
    {
      name: 'health-diary-family'
    }
  )
);