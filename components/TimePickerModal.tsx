import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

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
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {isFirstTime ? 'Welcome to Cardify!' : 'Choose Notification Time'}
          </Text>
          {isFirstTime && (
            <Text style={styles.description}>
              Choose a time for your daily review reminder. You can change this later in settings.
            </Text>
          )}
          
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
            style={styles.timePicker}
            display="spinner"
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>{isFirstTime ? 'Get Started' : 'Save'}</Text>
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
    backgroundColor: '#fff',
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
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  timePicker: {
    width: 100,
    height: 100,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});