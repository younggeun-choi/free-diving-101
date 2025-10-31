import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Text } from '@/shared/ui/text';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import type { FrenzelDay } from '@/entities/frenzel-training';

interface TrainingTimerProps {
  day: FrenzelDay;
  elapsedSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

/**
 * TrainingTimer Component
 *
 * Timer interface for training sessions with progress visualization.
 * Displays elapsed time, progress bar, and control buttons.
 *
 * @param day - The training day data
 * @param elapsedSeconds - Elapsed time in seconds
 * @param isRunning - Whether the timer is running
 * @param isPaused - Whether the timer is paused
 * @param onStart - Start training callback
 * @param onPause - Pause training callback
 * @param onResume - Resume training callback
 * @param onComplete - Complete training callback
 * @param onCancel - Cancel training callback
 */
export function TrainingTimer({
  day,
  elapsedSeconds,
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onComplete,
  onCancel,
}: TrainingTimerProps) {
  const { t } = useTranslation();

  const totalSeconds = day.durationMinutes * 60;
  const progress = Math.min((elapsedSeconds / totalSeconds) * 100, 100);
  const remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <View className="flex-row items-center justify-between mb-2">
          <Badge variant="default">
            <Text variant="small" className="font-semibold">
              Day {day.dayNumber}
            </Text>
          </Badge>
          {isPaused && (
            <Badge variant="secondary">
              <Text variant="small">{t('timer.paused')}</Text>
            </Badge>
          )}
        </View>
        <CardTitle>{t(day.title)}</CardTitle>
      </CardHeader>

      <CardContent>
        <View className="gap-4">
          {/* Timer Display */}
          <View className="items-center gap-2">
            <Text variant="small" className="text-muted-foreground">
              {isRunning ? t('timer.timeRemaining') : t('timer.trainingTime')}
            </Text>
            <Text className="text-5xl font-bold">
              {isRunning ? formatTime(remainingSeconds) : formatTime(totalSeconds)}
            </Text>
            {isRunning && (
              <Text variant="small" className="text-muted-foreground">
                {t('timer.elapsed')}: {formatTime(elapsedSeconds)}
              </Text>
            )}
          </View>

          {/* Progress Bar */}
          {isRunning && (
            <View className="gap-2">
              <Progress value={progress} className="h-3" />
              <Text variant="small" className="text-center text-muted-foreground">
                {progress.toFixed(0)}% {t('timer.percentComplete')}
              </Text>
            </View>
          )}

          {/* Control Buttons */}
          <View className="gap-2 mt-2">
            {!isRunning && (
              <Button onPress={onStart} size="lg">
                <Text variant="small" className="font-semibold">
                  {t('timer.start')}
                </Text>
              </Button>
            )}

            {isRunning && !isPaused && (
              <View className="flex-row gap-2">
                <Button onPress={onPause} variant="outline" className="flex-1">
                  <Text variant="small">{t('timer.pause')}</Text>
                </Button>
                <Button onPress={onComplete} variant="default" className="flex-1">
                  <Text variant="small">{t('timer.complete')}</Text>
                </Button>
              </View>
            )}

            {isRunning && isPaused && (
              <View className="flex-row gap-2">
                <Button onPress={onResume} variant="default" className="flex-1">
                  <Text variant="small">{t('timer.resume')}</Text>
                </Button>
                <Button onPress={onCancel} variant="outline" className="flex-1">
                  <Text variant="small">{t('timer.cancel')}</Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
