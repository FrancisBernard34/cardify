import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import useCardStore from '../stores/card-store';
import { useTheme } from '../hooks/useTheme';
import { lightTheme } from '../stores/theme-store';

const createStyles = (colors: typeof lightTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    minHeight: 100,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.success,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.danger,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  }
});

export default function EditCard() {
  const { id } = useLocalSearchParams();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { cards, updateCard, deleteCard } = useCardStore();

  // Load card data when component mounts
  useEffect(() => {
    const card = cards.find(c => c.id === id);
    if (card) {
      setQuestion(card.question);
      setAnswer(card.answer);
      setCategory(card.category || '');
    } else {
      Alert.alert('Error', 'Card not found');
      router.back();
    }
  }, [id, cards]);

  const handleUpdate = () => {
    if (question.trim() && answer.trim()) {
      const card = cards.find(c => c.id === id);
      if (card) {
        updateCard({
          ...card,
          question: question.trim(),
          answer: answer.trim(),
          category: category.trim() || undefined,
        });
        router.back();
      }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCard(id as string);
            router.back();
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Category (optional)"
          placeholderTextColor={colors.textTertiary}
          value={category}
          onChangeText={setCategory}
          textAlignVertical="top"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter question"
          placeholderTextColor={colors.textTertiary}
          value={question}
          onChangeText={setQuestion}
          multiline
          textAlignVertical="top"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter answer"
          placeholderTextColor={colors.textTertiary}
          value={answer}
          onChangeText={setAnswer}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity 
          style={[
            styles.button,
            (!question.trim() || !answer.trim()) && styles.buttonDisabled
          ]} 
          onPress={handleUpdate}
          disabled={!question.trim() || !answer.trim()}
        >
          <Text style={styles.buttonText}>Update Card</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Card</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}