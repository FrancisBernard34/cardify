import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import useCardStore from '../../stores/card-store';
import useThemeStore from '../../stores/theme-store';
import { useTheme } from '../../hooks/useTheme';
import TimePickerModal from '../../components/TimePickerModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { scheduleNotification, cancelNotifications, requestNotificationPermissions } from '../../utils/notifications';

export default function Settings() {
  const { notificationSettings, updateNotificationSettings, deleteAllCards } = useCardStore();
  const { setTheme, setUseSystemTheme, useSystemTheme, theme } = useThemeStore();
  const { colors, isDark } = useTheme();
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
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

  const handleDeleteConfirm = () => {
    deleteAllCards();
    setIsDeleteDialogVisible(false);
  };

  const handleThemeChange = (useDark: boolean) => {
    setTheme(useDark ? 'dark' : 'light');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingText, { color: colors.text }]}>Use System Theme</Text>
          <Switch
            value={useSystemTheme}
            onValueChange={setUseSystemTheme}
          />
        </View>
        <View style={[styles.settingRow, { 
          borderBottomColor: colors.border,
          opacity: useSystemTheme ? 0.5 : 1
        }]}>
          <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={handleThemeChange}
            disabled={useSystemTheme}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingText, { color: colors.text }]}>Daily Reminder</Text>
          <Switch
            value={notificationSettings.enabled}
            onValueChange={toggleNotifications}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.settingRow,
            { borderBottomColor: colors.border },
            !notificationSettings.enabled && styles.disabled
          ]}
          onPress={handleTimePress}
          disabled={!notificationSettings.enabled}
        >
          <Text style={[styles.settingText, { color: colors.text }]}>Reminder Time</Text>
          <Text style={[
            styles.settingValue,
            { color: colors.primary },
            !notificationSettings.enabled && { color: colors.disabled }
          ]}>
            {new Date(`2000-01-01T${notificationSettings.notificationTime}`).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
        <TouchableOpacity
          style={[styles.settingRow, styles.deleteButton]}
          onPress={() => setIsDeleteDialogVisible(true)}
        >
          <Text style={[styles.deleteText, { color: colors.danger }]}>Delete All Flashcards</Text>
        </TouchableOpacity>
      </View>

      <TimePickerModal
        visible={isTimePickerVisible}
        onClose={() => setIsTimePickerVisible(false)}
        onSave={handleTimeChange}
        initialTime={notificationSettings.notificationTime}
      />

      <ConfirmDialog
        visible={isDeleteDialogVisible}
        title="Delete All Flashcards"
        message="Are you sure you want to delete all flashcards? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogVisible(false)}
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
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  deleteButton: {
    borderBottomWidth: 0,
  },
  deleteText: {
    fontSize: 16,
  },
});