import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  if (!Device.isDevice) {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return false;
  }

  return true;
}

export async function scheduleNotification(time: string) {
  // Cancel any existing notification
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!time) return;

  const [hours, minutes] = time.split(':').map(Number);
  
  // Calculate the next notification time
  const now = new Date();
  let notificationDate = new Date();
  notificationDate.setHours(hours, minutes, 0, 0);

  // If the time has passed today, schedule for tomorrow
  if (notificationDate <= now) {
    notificationDate.setDate(notificationDate.getDate() + 1);
  }

  // Schedule the daily notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to review your cards! 📚",
      body: "Keep your knowledge fresh with some quick reviews.",
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });
}

export async function cancelNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}