import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import useCardStore from '../stores/card-store';
import TimePickerModal from '../components/TimePickerModal';
import { scheduleNotification, cancelNotifications, requestNotificationPermissions } from '../utils/notifications';

export default function Settings() {
  const { notificationSettings, updateNotificationSettings } = useCardStore();
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        // If permission denied, keep notifications disabled
        return;
      }
      await scheduleNotification(notificationSettings.notificationTime);
    } else {
      await cancelNotifications();
    }
    updateNotificationSettings({ enabled: value });
  };

  const handleTimeChange = async (time: string) => {
    updateNotificationSettings({ notificationTime: time });
    if (notificationSettings.enabled) {
      await scheduleNotification(time);
    }
    setIsTimePickerVisible(false);
  };

  const handleTimePress = () => {
    if (notificationSettings.enabled) {
      setIsTimePickerVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Daily Reminder</Text>
          <Switch
            value={notificationSettings.enabled}
            onValueChange={toggleNotifications}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.settingRow,
            !notificationSettings.enabled && styles.disabled
          ]}
          onPress={handleTimePress}
          disabled={!notificationSettings.enabled}
        >
          <Text style={styles.settingText}>Reminder Time</Text>
          <Text style={[
            styles.settingValue,
            !notificationSettings.enabled && styles.disabledText
          ]}>
            {new Date(`2000-01-01T${notificationSettings.notificationTime}`).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </TouchableOpacity>
      </View>

      <TimePickerModal
        visible={isTimePickerVisible}
        onClose={() => setIsTimePickerVisible(false)}
        onSave={handleTimeChange}
        initialTime={notificationSettings.notificationTime}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    color: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
});