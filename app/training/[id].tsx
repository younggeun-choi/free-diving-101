import { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  DayDetailCard,
  TrainingTimer,
  useTrainingHistory,
  useTimer,
} from '@/features/frenzel-trainer';
import {
  requestNotificationPermissions,
  scheduleTrainingNotification,
  cancelNotification,
  sendTrainingCompleteNotification,
} from '@/features/frenzel-trainer/lib/notifications';
import { FRENZEL_TRAINING_SCHEDULE } from '@/entities/frenzel-training';
import type { FrenzelDay } from '@/entities/frenzel-training';

/**
 * Training Session Screen
 *
 * Executes a specific day's Frenzel training session.
 * Handles timer, notifications, and session tracking.
 */
export default function TrainingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { completeSession, isDayCompleted, startSession } = useTrainingHistory();

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const [day, setDay] = useState<FrenzelDay | null>(null);

  // Find the training day
  useEffect(() => {
    const dayNumber = parseInt(id, 10);
    const foundDay = FRENZEL_TRAINING_SCHEDULE.find((d) => d.dayNumber === dayNumber);
    setDay(foundDay || null);
  }, [id]);

  // Request notification permissions on mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const handleTimerComplete = async () => {
    if (!day || !currentSessionId) return;

    // Cancel scheduled notification
    if (notificationId) {
      await cancelNotification(notificationId);
      setNotificationId(null);
    }

    // Complete the session
    completeSession(currentSessionId, '');

    // Send immediate notification
    await sendTrainingCompleteNotification(day.dayNumber);

    // Navigate back
    Alert.alert(
      t('notifications.trainingComplete'),
      t('notifications.greatJob', { dayNumber: day.dayNumber }),
      [
        {
          text: t('common.ok'),
          onPress: () => router.back(),
        },
      ]
    );
  };

  // Use the timer hook
  const {
    elapsedSeconds,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    complete,
    cancel,
  } = useTimer({
    durationMinutes: day?.durationMinutes || 0,
    onComplete: handleTimerComplete,
  });

  const handleTimerStart = async () => {
    if (!day) return;

    const sessionId = startSession(day.dayNumber);
    setCurrentSessionId(sessionId);

    // Schedule completion notification
    const notifId = await scheduleTrainingNotification(
      day.dayNumber,
      day.durationMinutes
    );
    setNotificationId(notifId);

    // Start the timer
    start();
  };

  const handleTimerCancel = async () => {
    // Cancel the timer
    cancel();

    // Cancel scheduled notification
    if (notificationId) {
      await cancelNotification(notificationId);
      setNotificationId(null);
    }

    setCurrentSessionId(null);

    Alert.alert(
      t('timer.cancel'),
      '',
      [
        {
          text: t('common.ok'),
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (!day) {
    return null;
  }

  const isCompleted = isDayCompleted(day.dayNumber);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <DayDetailCard day={day} isCompleted={isCompleted} />
        <TrainingTimer
          day={day}
          elapsedSeconds={elapsedSeconds}
          isRunning={isRunning}
          isPaused={isPaused}
          onStart={handleTimerStart}
          onPause={pause}
          onResume={resume}
          onComplete={complete}
          onCancel={handleTimerCancel}
        />
      </View>
    </ScrollView>
  );
}
