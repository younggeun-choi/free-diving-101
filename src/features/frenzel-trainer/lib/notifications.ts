import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { i18n } from '@/shared/lib/i18n';

/**
 * Notification Configuration
 *
 * Sets up notification handling behavior for the app.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request Notification Permissions
 *
 * Requests permission to send notifications from the user.
 * Required on iOS, automatically granted on Android.
 *
 * @returns Promise resolving to permission status
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permission not granted');
    return false;
  }

  // Android-specific: Create notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('training-complete', {
      name: 'Training Completion',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }

  return true;
}

/**
 * Schedule Training Completion Notification
 *
 * Schedules a local notification to fire after the training duration.
 *
 * @param dayNumber - The training day number
 * @param durationMinutes - Duration of the training session in minutes
 * @returns Promise resolving to notification identifier
 */
export async function scheduleTrainingNotification(
  dayNumber: number,
  durationMinutes: number
): Promise<string> {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notifications.trainingComplete'),
      body: i18n.t('notifications.congratulations', { dayNumber }),
      data: { dayNumber },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: durationMinutes * 60,
      channelId: Platform.OS === 'android' ? 'training-complete' : undefined,
    },
  });

  return notificationId;
}

/**
 * Cancel Scheduled Notification
 *
 * Cancels a previously scheduled notification.
 *
 * @param notificationId - The notification identifier to cancel
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Send Immediate Training Completion Notification
 *
 * Sends an immediate notification when training is completed.
 *
 * @param dayNumber - The training day number
 */
export async function sendTrainingCompleteNotification(dayNumber: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notifications.trainingComplete'),
      body: i18n.t('notifications.greatJob', { dayNumber }),
      data: { dayNumber },
      sound: 'default',
    },
    trigger: null, // Immediate notification
  });
}

/**
 * Clear All Notifications
 *
 * Clears all scheduled and displayed notifications.
 */
export async function clearAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.dismissAllNotificationsAsync();
}
