import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { EducationAccordion, DayList, useTrainingHistory } from '@/features/frenzel-trainer';

/**
 * Equalizing Training Screen
 *
 * Main screen for Frenzel equalizing training.
 * Displays educational content and 10-day training schedule.
 *
 * Note: Uses FlatList's ListHeaderComponent to avoid ScrollView nesting warning.
 */
export default function EqualizingScreen() {
  const router = useRouter();
  const { completedDays } = useTrainingHistory();

  const handleDayPress = (day: { dayNumber: number }) => {
    router.push(`/training/${day.dayNumber}`);
  };

  return (
    <View className="flex-1 bg-background">
      <DayList
        completedDays={completedDays}
        onDayPress={handleDayPress}
        ListHeaderComponent={
          <View style={{ paddingTop: 16, marginBottom: 16 }}>
            <EducationAccordion />
          </View>
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
      />
    </View>
  );
}
