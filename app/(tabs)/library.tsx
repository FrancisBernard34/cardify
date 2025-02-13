import React, { useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StyleSheet as RNStyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import useCardStore from '../../stores/card-store';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../stores/card-store';
import { useTheme } from '../../hooks/useTheme';
import { lightTheme } from '../../stores/theme-store';

const createStyles = (colors: typeof lightTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  categoryContainer: {
    marginBottom: 10,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.cardBackground,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  card: {
    padding: 15,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  cardQuestion: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  cardAnswer: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 12,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

const CardList = memo(({ cards, colors, styles }: {
  cards: Card[];
  colors: typeof lightTheme;
  styles: ReturnType<typeof createStyles>;
}) => (
  <View>
    {cards.map((card) => (
      <View key={`card-${card.id}`} style={[styles.card, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
        <View style={styles.cardContent}>
          <Text style={[styles.cardQuestion, { color: colors.text }]}>{card.question}</Text>
          <Text style={[styles.cardAnswer, { color: colors.textSecondary }]}>{card.answer}</Text>
          <Text style={[styles.cardMeta, { color: colors.textTertiary }]}>
            Last reviewed: {card.lastReviewed ? new Date(card.lastReviewed).toLocaleDateString() : 'Never'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.background }]}
          onPress={() => router.push(`/edit?id=${card.id}`)}
        >
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    ))}
  </View>
));

const CategoryItem = memo(({
  category,
  isExpanded,
  onToggle,
  cards,
  colors,
  styles
}: {
  category: string;
  isExpanded: boolean;
  onToggle: () => void;
  cards: Card[];
  colors: typeof lightTheme;
  styles: ReturnType<typeof createStyles>;
}) => (
  <View style={[styles.categoryContainer, { backgroundColor: colors.cardBackground }]}>
    <TouchableOpacity
      style={[styles.categoryHeader, { backgroundColor: colors.cardBackground }]}
      onPress={onToggle}
    >
      <Text style={[styles.categoryTitle, { color: colors.text }]}>
        {category} ({cards.length})
      </Text>
      <Ionicons
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={24}
        color={colors.primary}
      />
    </TouchableOpacity>
    {isExpanded && <CardList cards={cards} colors={colors} styles={styles} />}
  </View>
));
export default function Library() {
  const { getCategories, getCardsByCategory } = useCardStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { colors } = useTheme();
  const categories = getCategories();
  const styles = createStyles(colors);

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategory(prev => prev === category ? null : category);
  }, []);

  const renderItem = useCallback(({ item: category }: { item: string }) => (
    <CategoryItem
      key={`category-${category}`}
      category={category}
      isExpanded={expandedCategory === category}
      onToggle={() => toggleCategory(category)}
      cards={getCardsByCategory(category)}
      colors={colors}
      styles={styles}
    />
  ), [expandedCategory, getCardsByCategory, toggleCategory, colors, styles]);

  if (categories.length === 0) {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No flashcards yet
        </Text>
        <Link href="/add" asChild>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              Create Your First Card
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={category => `category-${category}`}
        contentContainerStyle={styles.scrollContainer}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add')}
      >
        <Ionicons name="add" size={24} color={colors.buttonText} />
      </TouchableOpacity>
    </View>
  );
}