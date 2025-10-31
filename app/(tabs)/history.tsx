import { View, ScrollView, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTrainingHistory } from '@/features/frenzel-trainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Text } from '@/shared/ui/text';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { FRENZEL_TRAINING_SCHEDULE } from '@/entities/frenzel-training';
import type { FrenzelSession } from '@/entities/frenzel-training';

/**
 * Training History Screen
 *
 * Displays user's training session history and progress statistics.
 */
export default function HistoryScreen() {
  const { t } = useTranslation();
  const { sessions, completedDays, clearHistory } = useTrainingHistory();

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.completed).length;
  const completionRate =
    totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  const renderSessionItem = ({ item }: { item: FrenzelSession }) => {
    const day = FRENZEL_TRAINING_SCHEDULE.find((d) => d.dayNumber === item.dayNumber);
    const startTime = new Date(item.startTime);
    const endTime = item.endTime ? new Date(item.endTime) : null;
    const duration = endTime
      ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60)
      : 0;

    return (
      <Card className="mb-3">
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Badge variant={item.completed ? 'default' : 'secondary'}>
                <Text variant="small" className="font-semibold">
                  {t('timer.day', { number: item.dayNumber })}
                </Text>
              </Badge>
              <Text variant="h4">{day ? t(day.title) : ''}</Text>
            </View>
            {item.completed && (
              <Badge variant="default">
                <Text variant="small">✓</Text>
              </Badge>
            )}
          </View>
        </CardHeader>
        <CardContent>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text variant="small" className="text-muted-foreground">
                {t('history.date')}
              </Text>
              <Text variant="small">{startTime.toLocaleDateString()}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text variant="small" className="text-muted-foreground">
                {t('history.time')}
              </Text>
              <Text variant="small">{startTime.toLocaleTimeString()}</Text>
            </View>
            {item.completed && (
              <View className="flex-row justify-between">
                <Text variant="small" className="text-muted-foreground">
                  {t('timer.duration')}
                </Text>
                <Text variant="small">
                  {duration} {t('timer.minutes')}
                </Text>
              </View>
            )}
            {item.notes && (
              <>
                <Separator className="my-2" />
                <View>
                  <Text variant="small" className="font-semibold mb-1">
                    {t('history.notes')}
                  </Text>
                  <Text variant="small" className="text-muted-foreground">
                    {item.notes}
                  </Text>
                </View>
              </>
            )}
          </View>
        </CardContent>
      </Card>
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Statistics Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{t('history.statistics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text variant="small" className="text-muted-foreground">
                  {t('history.completedDays')}
                </Text>
                <Badge variant="default">
                  <Text variant="small" className="font-semibold">
                    {completedDays.length} / 10
                  </Text>
                </Badge>
              </View>
              <View className="flex-row justify-between items-center">
                <Text variant="small" className="text-muted-foreground">
                  {t('history.totalSessions')}
                </Text>
                <Text variant="small" className="font-semibold">
                  {totalSessions}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text variant="small" className="text-muted-foreground">
                  {t('history.completedSessions')}
                </Text>
                <Text variant="small" className="font-semibold">
                  {completedSessions}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text variant="small" className="text-muted-foreground">
                  {t('history.completionRate')}
                </Text>
                <Text variant="small" className="font-semibold">
                  {completionRate}%
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Session History */}
        {sessions.length > 0 ? (
          <>
            <View className="flex-row items-center justify-between mb-3">
              <Text variant="h3">{t('history.sessionHistory')}</Text>
              <Button variant="outline" onPress={clearHistory}>
                <Text variant="small">{t('history.clearAll')}</Text>
              </Button>
            </View>
            <FlatList
              data={sessions.slice().reverse()}
              renderItem={renderSessionItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </>
        ) : (
          <Card>
            <CardContent className="py-8">
              <Text variant="p" className="text-center text-muted-foreground">
                {t('history.noSessions')}
              </Text>
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
