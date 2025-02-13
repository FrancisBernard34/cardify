import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import useCardStore from '../stores/card-store';

export default function EditCard() {
  const { id } = useLocalSearchParams();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  
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
          value={category}
          onChangeText={setCategory}
          textAlignVertical="top"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter question"
          value={question}
          onChangeText={setQuestion}
          multiline
          textAlignVertical="top"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter answer"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    minHeight: 100,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});