import { create } from "zustand";

export const useChatStore = create((set) => ({
  count: 0,
  messages: ["Hello World"],
  incrementCount: () => set((state) => ({ count: state.count + 1 })),
  addMessage: (newMessage) =>
    set((state) => ({ messages: [...state.messages, newMessage] })),
}));
