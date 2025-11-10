import {
  CO2_TABLE_BREATHE_TIMES,
  CO2_TABLE_ROUNDS,
  DEFAULT_HOLD_TIME_SECONDS,
  HOLD_TIME_STEP_SECONDS,
  MAX_HOLD_TIME_SECONDS,
  MIN_HOLD_TIME_SECONDS,
} from '@/entities/co2-table';
import { calculateTotalTime, formatTime } from '@/features/co2-table-trainer/lib/format-time';
import { useCO2TableTimer } from '@/features/co2-table-trainer/lib/useCO2TableTimer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { Text } from '@/shared/ui/text';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTrainingHistory } from '@/stores';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

export default function CO2TableScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { addSession } = useTrainingHistory();

  const [holdTimeSeconds, setHoldTimeSeconds] = useState(DEFAULT_HOLD_TIME_SECONDS);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [trainingStartTime, setTrainingStartTime] = useState<Date | null>(null);

  const handleComplete = useCallback(() => {
    if (trainingStartTime) {
      addSession({
        type: 'co2-table',
        startTime: trainingStartTime,
        endTime: new Date(),
        completed: true,
        meta: {
          holdTimeSeconds,
          breathTimeSeconds: CO2_TABLE_BREATHE_TIMES[0],
          cycles: CO2_TABLE_ROUNDS,
        },
      });
    }
    setIsTrainingComplete(true);
  }, [addSession, holdTimeSeconds, trainingStartTime]);

  const handleCancel = useCallback(() => {
    setShowCancelDialog(false);
  }, []);

  const {
    currentRound,
    isBreathing,
    remainingSeconds,
    isRunning,
    isPaused,
    breatheProgress,
    holdProgress,
    start,
    pause,
    resume,
    complete,
    cancel,
  } = useCO2TableTimer({
    holdTimeSeconds,
    onComplete: handleComplete,
    onCancel: handleCancel,
  });

  // Keep screen awake during active training
  useEffect(() => {
    const KEEP_AWAKE_TAG = 'co2-table-training';
    let keepAwakeEnabled = false;

    const enableKeepAwake = async () => {
      try {
        await activateKeepAwakeAsync(KEEP_AWAKE_TAG);
        keepAwakeEnabled = true;
      } catch (error) {
        console.warn('Failed to activate keep-awake:', error);
      }
    };

    const disableKeepAwake = async () => {
      if (!keepAwakeEnabled) return;
      keepAwakeEnabled = false;
      try {
        await deactivateKeepAwake(KEEP_AWAKE_TAG);
      } catch (error) {
        console.warn('Failed to deactivate keep-awake:', error);
      }
    };

    if (isRunning && !isPaused) {
      enableKeepAwake();
    } else {
      disableKeepAwake();
    }

    return () => {
      disableKeepAwake();
    };
  }, [isRunning, isPaused]);

  const handleDecreaseHoldTime = useCallback(() => {
    setHoldTimeSeconds((prev) => {
      const newValue = prev - HOLD_TIME_STEP_SECONDS;
      if (newValue < MIN_HOLD_TIME_SECONDS) {
        // TODO: Show toast notification
        return prev;
      }
      return newValue;
    });
  }, []);

  const handleIncreaseHoldTime = useCallback(() => {
    setHoldTimeSeconds((prev) => {
      const newValue = prev + HOLD_TIME_STEP_SECONDS;
      if (newValue > MAX_HOLD_TIME_SECONDS) {
        // TODO: Show toast notification
        return prev;
      }
      return newValue;
    });
  }, []);

  const handleCancelPress = useCallback(() => {
    setShowCancelDialog(true);
  }, []);

  const handleCancelConfirm = useCallback(() => {
    cancel();
    setShowCancelDialog(false);
  }, [cancel]);

  const handleCompletePress = useCallback(() => {
    complete();
  }, [complete]);

  const handleCompletedOk = useCallback(() => {
    setIsTrainingComplete(false);
  }, []);

  const handleStart = useCallback(() => {
    setTrainingStartTime(new Date());
    start();
  }, [start]);

  const totalTime = calculateTotalTime(CO2_TABLE_BREATHE_TIMES, holdTimeSeconds);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        contentInsetAdjustmentBehavior="never"
      >
        <View className="px-4 py-6">
          {/* Timer Display Section */}
          <Card className="p-6 mb-6">
            {/* Round Indicator */}
            <Text variant="h4" className="text-center mb-1">
              {t('co2Table.timer.round', { number: currentRound })}
            </Text>

            {/* Phase Indicator */}
            <Text
              variant="h3"
              className={`text-center mb-4 ${
                isBreathing ? 'text-primary' : 'text-accent'
              }`}
            >
              {isBreathing ? t('co2Table.timer.breathe') : t('co2Table.timer.hold')}
              {isPaused && ` ${t('co2Table.timer.paused')}`}
            </Text>

            {/* Large Timer */}
            <Text variant="h1" className="text-center font-mono mb-6 text-7xl">
              {formatTime(remainingSeconds)}
            </Text>

            {/* Progress Bars */}
            <View className="space-y-3">
              {/* Breathe Progress */}
              <View>
                <Text variant="small" className="mb-1 text-primary">
                  {t('co2Table.timer.breathe')}
                </Text>
                <Progress value={breatheProgress} className="h-3" indicatorClassName="bg-primary" />
              </View>

              {/* Hold Progress */}
              <View>
                <Text variant="small" className="mt-2 mb-1 text-accent">
                  {t('co2Table.timer.hold')}
                </Text>
                <Progress value={holdProgress} className="h-3" indicatorClassName="bg-accent" />
              </View>
            </View>
          </Card>

          {/* Hold Time Control Section */}
          {!isRunning && (
            <Card className="p-4 mb-6">
              <Text variant="p" className="text-center mb-3">
                {t('co2Table.holdTime.label')}
              </Text>
              <View className="flex-row items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onPress={handleDecreaseHoldTime}
                  disabled={holdTimeSeconds <= MIN_HOLD_TIME_SECONDS}
                >
                  <Text>{t('co2Table.holdTime.decrease')}</Text>
                </Button>
                <Text variant="h3" className="font-mono min-w-[80px] text-center">
                  {formatTime(holdTimeSeconds)}
                </Text>
                <Button
                  variant="outline"
                  size="lg"
                  onPress={handleIncreaseHoldTime}
                  disabled={holdTimeSeconds >= MAX_HOLD_TIME_SECONDS}
                >
                  <Text>{t('co2Table.holdTime.increase')}</Text>
                </Button>
              </View>
            </Card>
          )}

          {/* Training Controls */}
          <View className="gap-3 mb-6">
            {!isRunning && (
              <Button size="lg" onPress={handleStart} variant="default">
                <Text className="text-white">{t('co2Table.controls.start')}</Text>
              </Button>
            )}

            {isRunning && !isPaused && (
              <View className="flex-row gap-3">
                <Button size="lg" variant="outline" onPress={pause} className="flex-1">
                  <Text>{t('co2Table.controls.pause')}</Text>
                </Button>
                <Button size="lg" variant="outline" onPress={handleCompletePress} className="flex-1">
                  <Text>{t('co2Table.controls.complete')}</Text>
                </Button>
              </View>
            )}

            {isRunning && isPaused && (
              <View className="flex-row gap-3">
                <Button size="lg" onPress={resume} className="flex-1 bg-blue-600">
                  <Text className="text-white">{t('co2Table.controls.resume')}</Text>
                </Button>
                <Button size="lg" variant="outline" onPress={handleCompletePress} className="flex-1">
                  <Text>{t('co2Table.controls.complete')}</Text>
                </Button>
              </View>
            )}

            {isRunning && (
              <Button size="lg" variant="destructive" onPress={handleCancelPress}>
                <Text className="text-white">{t('co2Table.controls.cancel')}</Text>
              </Button>
            )}
          </View>

          {/* CO2 Table List */}
          <Card className="p-4">
            <Text variant="h4" className="mb-2">
              {t('co2Table.table.totalTime', { time: formatTime(totalTime) })}
            </Text>
            <View className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              {CO2_TABLE_BREATHE_TIMES.map((breatheTime, index) => {
                const roundNumber = index + 1;
                const isCurrentRound = isRunning && currentRound === roundNumber;

                return (
                  <View
                    key={roundNumber}
                    className={`py-2 px-3 rounded-lg mb-1 ${
                    isCurrentRound ? 'bg-primary dark:bg-primary' : ''
                    }`}
                  >
                    <Text
                      variant="small"
                      className={`font-semibold ${isCurrentRound ? 'text-primary-foreground dark:text-primary-foreground' : ''}`}
                    >
                      {t('co2Table.table.round', { number: roundNumber })}
                    </Text>
                    <View className="flex-row justify-between mt-1">
                      <Text 
                        variant="small" 
                        className={`font-semibold ${isCurrentRound ? 'text-primary-foreground dark:text-primary-foreground' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {t('co2Table.table.breathe', { time: formatTime(breatheTime) })}
                      </Text>
                      <Text 
                        variant="small" 
                        className={`font-semibold ${isCurrentRound ? 'text-primary-foreground dark:text-primary-foreground' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {t('co2Table.table.hold', { time: formatTime(holdTimeSeconds) })}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('co2Table.cancelDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('co2Table.cancelDialog.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>{t('co2Table.cancelDialog.cancel')}</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={handleCancelConfirm}>
              <Text>{t('co2Table.cancelDialog.confirm')}</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Training Completed Dialog */}
      <AlertDialog open={isTrainingComplete} onOpenChange={setIsTrainingComplete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('co2Table.completed.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('co2Table.completed.message')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onPress={handleCompletedOk}>
              <Text>{t('common.ok')}</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
