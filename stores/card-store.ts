import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Card {
  id: string;
  question: string;
  answer: string;
  lastReviewed: number;
  interval: number; // in hours
  repetitions: number; // number of successful reviews
  easeFactor: number; // multiplier for interval increases
  dueDate: number; // timestamp when card is due for review
}

interface CardStore {
  cards: Card[];
  addCard: (question: string, answer: string) => void;
  updateCard: (card: Card) => void;
  reviewCard: (id: string, quality: number) => void; // quality: 0-5 rating of answer
  getDueCards: () => Card[];
}

// SM-2 algorithm constants
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      cards: [],
      
      addCard: (question: string, answer: string) => {
        const newCard: Card = {
          id: Date.now().toString(),
          question,
          answer,
          lastReviewed: Date.now(),
          interval: 0,
          repetitions: 0,
          easeFactor: DEFAULT_EASE_FACTOR,
          dueDate: Date.now(),
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
            if (card.id !== id) return card;

            let { interval, repetitions, easeFactor } = card;
            
            // Update ease factor based on performance
            easeFactor = Math.max(
              MIN_EASE_FACTOR,
              easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
            );

            // Calculate new interval
            if (quality < 3) {
              // If rating is less than 3, reset the card
              interval = 0;
              repetitions = 0;
            } else {
              repetitions += 1;
              if (repetitions === 1) {
                interval = 1; // 1 day
              } else if (repetitions === 2) {
                interval = 6; // 6 days
              } else {
                interval = Math.round(interval * easeFactor);
              }
            }

            const now = Date.now();
            return {
              ...card,
              lastReviewed: now,
              interval,
              repetitions,
              easeFactor,
              dueDate: now + interval * 24 * 60 * 60 * 1000,
            };
          }),
        }),

      getDueCards: () => {
        const now = Date.now();
        return get().cards.filter((card) => card.dueDate <= now);
      },
    }),
    {
      name: 'cardify-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCardStore;
