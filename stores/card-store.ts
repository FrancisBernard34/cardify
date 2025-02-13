import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Card {
  id: string;
  question: string;
  answer: string;
  category?: string;
  lastReviewed: number | null; // null means never reviewed
  interval: number; // in hours
}

interface CardStore {
  cards: Card[];
  notificationSettings: {
    enabled: boolean;
    notificationTime: string;
    isFirstTime: boolean;
  };
  addCard: (question: string, answer: string, category?: string) => void;
  updateCard: (card: Card) => void;
  deleteCard: (id: string) => void;
  reviewCard: (id: string, quality: number) => void;
  deleteAllCards: () => void;
  getDueCards: () => Card[];
  getCategories: () => string[];
  getCardsByCategory: (category: string) => Card[];
  updateNotificationSettings: (settings: Partial<CardStore['notificationSettings']>) => void;
}

const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      cards: [],
      notificationSettings: {
        enabled: false,
        notificationTime: "20:00",
        isFirstTime: true,
      },
      addCard: (question: string, answer: string, category?: string) => {
        const newCard: Card = {
          id: Date.now().toString(),
          question,
          answer,
          category,
          lastReviewed: null, // Mark as never reviewed
          interval: 1, // Start with 1 hour interval
        };
        set({ cards: [...get().cards, newCard] });
      },
      updateCard: (updatedCard: Card) =>
        set({
          cards: get().cards.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
          ),
        }),
      reviewCard: (id: string, quality: number) =>
        set({
          cards: get().cards.map((card) => {
            if (card.id === id) {
              // SuperMemo 2 algorithm simplified
              let newInterval;
              if (quality <= 2) { // Hard
                newInterval = 1;
              } else if (quality === 4) { // Good
                newInterval = card.interval * 2;
              } else { // Easy
                newInterval = card.interval * 2.5;
              }
              return { ...card, lastReviewed: Date.now(), interval: newInterval };
            }
            return card;
          }),
        }),
      getDueCards: () => {
        const now = Date.now();
        return get().cards.filter(card => {
          // New cards (never reviewed) are always due
          if (card.lastReviewed === null) return true;
          
          const hoursSinceReview = (now - card.lastReviewed) / (1000 * 60 * 60);
          return hoursSinceReview >= card.interval;
        });
      },
      getCategories: () => {
        const categories = new Set(get().cards.map(card => card.category || 'Uncategorized'));
        return Array.from(categories);
      },
      getCardsByCategory: (category: string) => {
        return get().cards.filter(card => 
          category === 'Uncategorized' 
            ? !card.category 
            : card.category === category
        );
      },
      deleteCard: (id: string) =>
        set(state => ({
          cards: state.cards.filter(card => card.id !== id)
        })),
      deleteAllCards: () => set({ cards: [] }),
      updateNotificationSettings: (settings) =>
        set(state => ({
          notificationSettings: {
            ...state.notificationSettings,
            ...settings,
          },
        })),
    }),
    {
      name: 'cardify-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCardStore;
