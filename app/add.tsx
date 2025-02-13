import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
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
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function AddCard() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const { addCard } = useCardStore();
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
          onPress={handleSubmit}
          disabled={!question.trim() || !answer.trim()}
        >
          <Text style={styles.buttonText}>Create Card</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}