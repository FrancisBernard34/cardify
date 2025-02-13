import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../hooks/useTheme';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (time: string) => void;
  initialTime?: string;
  isFirstTime?: boolean;
}

export default function TimePickerModal({ 
  visible, 
  onClose, 
  onSave, 
  initialTime = "20:00",
  isFirstTime = false 
}: TimePickerModalProps) {
  const { colors, isDark } = useTheme();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    if (initialTime) {
      const [hours, minutes] = initialTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      setTime(date);
    }
  }, [initialTime]);

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (event.type === 'dismissed') {
      onClose();
      return;
    }

    if (selectedTime) {
      setTime(selectedTime);
      if (Platform.OS === 'android') {
        const timeString = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`;
        onSave(timeString);
        onClose();
      }
    }
  };

  const handleSave = () => {
    const timeString = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    onSave(timeString);
    onClose();
  };

  if (Platform.OS === 'android') {
    if (!visible) return null;
    
    return (
      <DateTimePicker
        value={time}
        mode="time"
        is24Hour={true}
        onChange={handleTimeChange}
        display="default"
      />
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isFirstTime ? 'Welcome to Cardify!' : 'Choose Notification Time'}
          </Text>
          {isFirstTime && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Choose a time for your daily review reminder. You can change this later in settings.
            </Text>
          )}
          
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
            style={[styles.timePicker, Platform.select({ ios: { backgroundColor: colors.cardBackground } })]}
            display="spinner"
            textColor={colors.text}
            themeVariant={isDark ? 'dark' : 'light'}
          />

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={handleSave}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              {isFirstTime ? 'Get Started' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  timePicker: {
    width: 100,
    height: 100,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});