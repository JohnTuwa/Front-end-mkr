import { create } from "zustand";

export const useCredentialsStore = create((set) => ({
    credentials: '',
    setCredentials: (newCredentials) => set({ credentials: newCredentials })
}));
