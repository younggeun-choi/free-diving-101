import { View, FlatList, type ViewStyle } from 'react-native';
import type { ComponentType, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Text } from '@/shared/ui/text';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { FRENZEL_TRAINING_SCHEDULE } from '@/entities/frenzel-training';
import type { FrenzelDay } from '@/entities/frenzel-training';

interface DayListProps {
  completedDays: number[];
  onDayPress: (day: FrenzelDay) => void;
  ListHeaderComponent?: ComponentType | ReactElement | null;
  ListHeaderComponentStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

/**
 * DayList Component
 *
 * Displays a list of 10-day Frenzel training schedule.
 * Shows completion status with badges and allows navigation to day details.
 *
 * @param completedDays - Array of completed day numbers
 * @param onDayPress - Callback when a day is pressed
 * @param ListHeaderComponent - Optional header component (e.g., EducationAccordion)
 * @param ListHeaderComponentStyle - Style for header wrapper
 * @param contentContainerStyle - Style for FlatList content container
 */
export function DayList({
  completedDays,
  onDayPress,
  ListHeaderComponent,
  ListHeaderComponentStyle,
  contentContainerStyle,
}: DayListProps) {
  const { t } = useTranslation();

  const renderDayItem = ({ item }: { item: FrenzelDay }) => {
    const isCompleted = completedDays.includes(item.dayNumber);

    return (
      <Card className="mb-3">
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Badge variant={isCompleted ? 'default' : 'secondary'}>
                <Text variant="small" className="font-semibold">
                  {t('timer.day', { number: item.dayNumber })}
                </Text>
              </Badge>
              <Text variant="h4">{t(item.title)}</Text>
            </View>
            {isCompleted && (
              <Badge variant="default">
                <Text variant="small">✓</Text>
              </Badge>
            )}
          </View>
        </CardHeader>
        <CardContent>
          <View className="gap-3">
            <View>
              <Text variant="small" className="font-semibold mb-1">
                {t('timer.goal')}
              </Text>
              <Text variant="small" className="text-muted-foreground">
                {t(item.goal)}
              </Text>
            </View>

            <View>
              <Text variant="small" className="font-semibold mb-1">
                {t('timer.duration')}
              </Text>
              <Text variant="small" className="text-muted-foreground">
                {item.durationMinutes} {t('timer.minutes')}
              </Text>
            </View>

            <Button
              onPress={() => onDayPress(item)}
              variant={isCompleted ? 'outline' : 'default'}
              className="mt-2">
              <Text variant="small">
                {isCompleted ? t('timer.review') : t('timer.start')}
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    );
  };

  return (
    <FlatList
      data={FRENZEL_TRAINING_SCHEDULE}
      renderItem={renderDayItem}
      keyExtractor={(item) => `day-${item.dayNumber}`}
      ListHeaderComponent={ListHeaderComponent}
      ListHeaderComponentStyle={ListHeaderComponentStyle}
      contentContainerStyle={
        contentContainerStyle || {
          paddingHorizontal: 16,
          paddingBottom: 24,
        }
      }
    />
  );
}
