import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import useCardStore from '../stores/card-store';

export default function AddCard() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const { addCard } = useCardStore();

  const handleSubmit = () => {
    if (question.trim() && answer.trim()) {
      addCard(question.trim(), answer.trim(), category);
      router.back();
    }
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
          onPress={handleSubmit}
          disabled={!question.trim() || !answer.trim()}
        >
          <Text style={styles.buttonText}>Create Card</Text>
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
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});