import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Text } from '@/shared/ui/text';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';
import type { FrenzelDay } from '@/entities/frenzel-training';

interface DayDetailCardProps {
  day: FrenzelDay;
  isCompleted: boolean;
}

/**
 * DayDetailCard Component
 *
 * Displays detailed information for a specific training day.
 * Shows title, goal, training steps, success criteria, and duration.
 *
 * @param day - The training day data
 * @param isCompleted - Whether this day has been completed
 */
export function DayDetailCard({ day, isCompleted }: DayDetailCardProps) {
  const { t } = useTranslation();

  return (
    <ScrollView>
      <Card className="mb-4">
        <CardHeader>
          <View className="flex-row items-center justify-between mb-2">
            <Badge variant={isCompleted ? 'default' : 'secondary'}>
              <Text variant="small" className="font-semibold">
                {t('timer.day', { number: day.dayNumber })}
              </Text>
            </Badge>
            {isCompleted && (
              <Badge variant="default">
                <Text variant="small">✓ {t('timer.complete')}</Text>
              </Badge>
            )}
          </View>
          <CardTitle>{t(day.title)}</CardTitle>
        </CardHeader>

        <CardContent>
          <View className="gap-4">
            {/* Goal Section */}
            <View>
              <Text variant="small" className="font-semibold mb-2">
                🎯 {t('timer.goal')}
              </Text>
              <Text variant="p" className="text-muted-foreground">
                {t(day.goal)}
              </Text>
            </View>

            <Separator />

            {/* Training Steps */}
            <View>
              <Text variant="small" className="font-semibold mb-3">
                📋 {t('timer.trainingSteps')}
              </Text>
              <View className="gap-3">
                {day.steps.map((step, index) => (
                  <View key={`step-${index}`} className="flex-row gap-2 items-center">
                    <View className="w-6 h-6 rounded-full bg-primary/20 items-center justify-center">
                      <Text variant="small" className="font-semibold">
                        
                      </Text>
                    </View>
                    <Text className="flex-1 text-muted-foreground">
                      {index + 1}. {t(step)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Separator />

            {/* Success Criteria */}
            <View>
              <Text variant="small" className="font-semibold mb-2">
                ✅ {t('timer.successCriteria')}
              </Text>
              <Text variant="p" className="text-muted-foreground">
                {t(day.successCriteria)}
              </Text>
            </View>

            <Separator />

            {/* Duration */}
            <View>
              <Text variant="small" className="font-semibold mb-2">
                ⏱️ {t('timer.duration')}
              </Text>
              <Text variant="p" className="text-muted-foreground">
                {day.durationMinutes} {t('timer.minutes')}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
