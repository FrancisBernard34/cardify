import React, { useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Link, router } from 'expo-router';
import useCardStore from '../../stores/card-store';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../stores/card-store';

const CardList = memo(({ cards }: { cards: Card[] }) => (
  <View>
    {cards.map((card) => (
      <View key={`card-${card.id}`} style={styles.card}>
        <Text style={styles.cardQuestion}>{card.question}</Text>
        <Text style={styles.cardAnswer}>{card.answer}</Text>
        <Text style={styles.cardMeta}>
          Last reviewed: {new Date(card.lastReviewed).toLocaleDateString()}
        </Text>
      </View>
    ))}
  </View>
));

const CategoryItem = memo(({ 
  category, 
  isExpanded, 
  onToggle, 
  cards 
}: { 
  category: string;
  isExpanded: boolean;
  onToggle: () => void;
  cards: Card[];
}) => (
  <View style={styles.categoryContainer}>
    <TouchableOpacity
      style={styles.categoryHeader}
      onPress={onToggle}
    >
      <Text style={styles.categoryTitle}>
        {category} ({cards.length})
      </Text>
      <Ionicons
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={24}
        color="#007AFF"
      />
    </TouchableOpacity>
    {isExpanded && <CardList cards={cards} />}
  </View>
));

export default function Library() {
  const { getCategories, getCardsByCategory } = useCardStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const categories = getCategories();

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
    />
  ), [expandedCategory, getCardsByCategory, toggleCategory]);

  if (categories.length === 0) {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <Text style={styles.emptyText}>No flashcards yet</Text>
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.buttonText}>Create Your First Card</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  categoryContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardQuestion: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  cardAnswer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
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
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});