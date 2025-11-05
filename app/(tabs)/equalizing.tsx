import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { EducationAccordion, DayList } from '@/features/frenzel-trainer';
import { useTrainingHistory } from '@/stores';

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
  const { getFrenzelSessions } = useTrainingHistory();
  const insets = useSafeAreaInsets();

  // Compute completed days from unified store
  const completedDays = getFrenzelSessions()
    .filter((session) => session.completed)
    .map((session) => {
      // Type guard: getFrenzelSessions returns only type='frenzel'
      if (session.type === 'frenzel') {
        return session.meta.dayNumber;
      }
      return -1; // Should never happen, but TypeScript needs this
    })
    .filter((dayNumber) => dayNumber !== -1);

  const handleDayPress = (day: { dayNumber: number }) => {
    router.push(`/training/${day.dayNumber}`);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
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
