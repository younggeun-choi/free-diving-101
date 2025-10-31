import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { EducationAccordion, DayList, useTrainingHistory } from '@/features/frenzel-trainer';

/**
 * Equalizing Training Screen
 *
 * Main screen for Frenzel equalizing training.
 * Displays educational content and 10-day training schedule.
 */
export default function EqualizingScreen() {
  const router = useRouter();
  const { completedDays } = useTrainingHistory();

  const handleDayPress = (day: { dayNumber: number }) => {
    router.push(`/training/${day.dayNumber}`);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <EducationAccordion />
        <DayList completedDays={completedDays} onDayPress={handleDayPress} />
      </View>
    </ScrollView>
  );
}
