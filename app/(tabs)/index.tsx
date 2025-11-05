import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Text } from '@/shared/ui/text';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { Separator } from '@/shared/ui/separator';
import { useTrainingHistory } from '@/stores/training-history-store';
import { FRENZEL_TRAINING_SCHEDULE } from '@/entities/frenzel-training';
import type { TrainingSession } from '@/entities/training-record';
import {
  getCompletedDays,
  findNextDay,
  calculateTotalTime,
  calculateStreak,
  formatDuration,
  getTimeBasedGreeting,
  formatRelativeTimeWithTime,
  formatHoldTime,
} from '@/shared/lib/training-helpers';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { sessions, getFrenzelSessions, getCO2Sessions } = useTrainingHistory();

  // Computed values
  const frenzelSessions = getFrenzelSessions();
  const co2Sessions = getCO2Sessions();
  const completedDays = getCompletedDays(frenzelSessions);
  const nextDay = findNextDay(completedDays);
  const totalTime = calculateTotalTime(sessions);
  const streak = calculateStreak(sessions);
  const recentSessions = sessions.slice(0, 3);

  // Empty state
  if (sessions.length === 0) {
    return <EmptyState insets={insets} />;
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 20 }}
    >
      <View className="p-4 gap-6">
        {/* Greeting Section */}
        <GreetingSection streak={streak} />

        {/* Quick Actions */}
        <QuickActionsSection
          completedDays={completedDays}
          nextDay={nextDay}
          co2Sessions={co2Sessions}
          hasSessions={sessions.length > 0}
          sessionCount={sessions.length}
        />

        {/* Progress Section */}
        <ProgressSection
          completedDays={completedDays}
          totalTime={totalTime}
          streak={streak}
          lastSession={sessions[0]}
        />

        {/* Recent Activity */}
        {recentSessions.length > 0 && (
          <RecentActivitySection sessions={recentSessions} />
        )}
      </View>
    </ScrollView>
  );
}

// ============================================
// Greeting Section
// ============================================

function GreetingSection({ streak }: { streak: number }) {
  const { t } = useTranslation();

  return (
    <View className="gap-2">
      <Text variant="h1">{getTimeBasedGreeting(t)}</Text>
      {streak > 0 && (
        <Text variant="muted" className="text-lg">
          {t('home.streak', { count: streak })} 🔥
        </Text>
      )}
    </View>
  );
}

// ============================================
// Quick Actions Section
// ============================================

interface QuickActionsSectionProps {
  completedDays: Set<number>;
  nextDay: number;
  co2Sessions: TrainingSession[];
  hasSessions: boolean;
  sessionCount: number;
}

function QuickActionsSection({
  completedDays,
  nextDay,
  co2Sessions,
  hasSessions,
  sessionCount,
}: QuickActionsSectionProps) {
  const { t } = useTranslation();

  const isFrenzelComplete = completedDays.size === 10;
  const lastCO2Session = co2Sessions[0];
  const lastHoldTime =
    lastCO2Session && lastCO2Session.type === 'co2-table'
      ? formatHoldTime(lastCO2Session.meta.holdTimeSeconds)
      : null;

  return (
    <View className="gap-3">
      <Text variant="h3">{t('home.quickActions')}</Text>

      {/* Primary Action: Continue/Start Frenzel or Completion Message */}
      {!isFrenzelComplete ? (
        <Card className="bg-primary">
          <CardContent className="p-4">
            <Pressable
              onPress={() => router.push('/(tabs)/equalizing')}
              className="active:opacity-70"
            >
              <View className="gap-2">
                <Text variant="h3" className="text-primary-foreground">
                  {completedDays.size === 0
                    ? t('home.startTraining')
                    : t('home.continueTraining')}
                </Text>
                <Text variant="p" className="text-primary-foreground/90">
                  {t('timer.day', { number: nextDay })}:{' '}
                  {t(FRENZEL_TRAINING_SCHEDULE[nextDay - 1].title)}
                </Text>
                <Text variant="muted" className="text-primary-foreground/70">
                  {t('home.daysCompleted', {
                    completed: completedDays.size,
                    total: 10,
                  })}
                </Text>
              </View>
            </Pressable>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-success">
          <CardContent className="p-4">
            <View className="gap-2 items-center">
              <Text variant="h3" className="text-center">
                🎉 {t('home.frenzelCompleted')}
              </Text>
              <Text variant="p" className="text-center">
                {t('home.frenzelCompletedMessage')}
              </Text>
            </View>
          </CardContent>
        </Card>
      )}

      {/* Secondary Actions: CO₂ + History */}
      <View className="flex-row gap-3">
        {/* Quick CO₂ */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <Pressable
              onPress={() => router.push('/(tabs)/co2-table')}
              className="active:opacity-70"
            >
              <View className="gap-1">
                <Text variant="h4">{t('home.quickCO2')}</Text>
                {lastHoldTime && (
                  <Text variant="small" className="text-muted-foreground">
                    {t('home.lastHold', { time: lastHoldTime })}
                  </Text>
                )}
              </View>
            </Pressable>
          </CardContent>
        </Card>

        {/* View History */}
        {hasSessions && (
          <Card className="flex-1">
            <CardContent className="p-4">
              <Pressable
                onPress={() => router.push('/(tabs)/history')}
                className="active:opacity-70"
              >
                <View className="gap-1">
                  <Text variant="h4">{t('home.viewHistory')}</Text>
                  <Text variant="small" className="text-muted-foreground">
                    {t('home.sessionsCount', { count: sessionCount })}
                  </Text>
                </View>
              </Pressable>
            </CardContent>
          </Card>
        )}
      </View>
    </View>
  );
}

// ============================================
// Progress Section
// ============================================

interface ProgressSectionProps {
  completedDays: Set<number>;
  totalTime: number;
  streak: number;
  lastSession: TrainingSession | undefined;
}

function ProgressSection({
  completedDays,
  totalTime,
  streak,
  lastSession,
}: ProgressSectionProps) {
  const { t } = useTranslation();

  const progressPercent = (completedDays.size / 10) * 100;

  return (
    <View className="gap-3">
      <Text variant="h3">{t('home.progress')}</Text>

      <Card>
        <CardContent className="p-4 gap-4">
          {/* Frenzel Progress Bar */}
          <View className="gap-2">
            <Text variant="h4">{t('home.frenzelTraining')}</Text>
            <Progress value={progressPercent} className="h-2" />
            <Text variant="small" className="text-muted-foreground">
              {t('home.daysCompleted', {
                completed: completedDays.size,
                total: 10,
              })}
            </Text>
          </View>

          <Separator />

          {/* Statistics */}
          <View className="gap-2">
            <Text variant="p">
              {t('home.totalPractice', {
                time: formatDuration(totalTime, t),
              })}
            </Text>
            <Text variant="p">
              {t('home.currentStreak', { count: streak })} {streak > 0 ? '🔥' : ''}
            </Text>
            {lastSession && (
              <Text variant="small" className="text-muted-foreground">
                {t('home.lastTraining', {
                  time: formatRelativeTimeWithTime(lastSession.endTime, t),
                })}
              </Text>
            )}
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

// ============================================
// Recent Activity Section
// ============================================

function RecentActivitySection({ sessions }: { sessions: TrainingSession[] }) {
  const { t } = useTranslation();

  return (
    <View className="gap-3">
      <View className="flex-row justify-between items-center">
        <Text variant="h3">{t('home.recentActivity')}</Text>
        <Pressable onPress={() => router.push('/(tabs)/history')}>
          <Text variant="small" className="text-primary">
            {t('home.viewAll')} →
          </Text>
        </Pressable>
      </View>

      <View className="gap-2">
        {sessions.map((session) => (
          <ActivityCard key={session.id} session={session} />
        ))}
      </View>
    </View>
  );
}

function ActivityCard({ session }: { session: TrainingSession }) {
  const { t } = useTranslation();

  const badgeVariant = session.type === 'frenzel' ? 'default' : 'secondary';
  const badgeLabel =
    session.type === 'frenzel'
      ? t('history.frenzelBadge')
      : t('history.co2Badge');

  const title =
    session.type === 'frenzel'
      ? `${t('timer.day', { number: session.meta.dayNumber })}: ${t(
          FRENZEL_TRAINING_SCHEDULE[session.meta.dayNumber - 1].title
        )}`
      : t('home.co2SessionTitle', {
          holdTime: formatHoldTime(session.meta.holdTimeSeconds),
        });

  return (
    <Card>
      <CardContent className="p-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-1 gap-1">
            <View className="flex-row items-center gap-2">
              <Badge variant={badgeVariant}>
                <Text variant="small">{badgeLabel}</Text>
              </Badge>
              <Text variant="p" className="flex-1">
                {title}
              </Text>
            </View>
          </View>
          <Text variant="small" className="text-muted-foreground">
            {formatRelativeTimeWithTime(session.endTime, t)}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================
// Empty State
// ============================================

function EmptyState({ insets }: { insets: { top: number; bottom: number } }) {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 20,
        flexGrow: 1,
        justifyContent: 'center',
      }}
    >
      <View className="p-6 gap-6 items-center">
        <View className="gap-3 items-center">
          <Text variant="h1" className="text-center">
            {t('home.welcome')}
          </Text>
          <Text variant="p" className="text-center text-muted-foreground">
            {t('home.readyToStart')}
          </Text>
        </View>

        <View className="w-full gap-4 mt-4">
          <Text variant="h3" className="text-center">
            {t('home.startJourney')}
          </Text>

          {/* Start Frenzel Training */}
          <Card>
            <CardContent className="p-4">
              <Pressable
                onPress={() => router.push('/(tabs)/equalizing')}
                className="active:opacity-70"
              >
                <View className="gap-2">
                  <Text variant="h3">{t('home.startTraining')}</Text>
                  <Text variant="p" className="text-muted-foreground">
                    {t('timer.day', { number: 1 })}:{' '}
                    {t(FRENZEL_TRAINING_SCHEDULE[0].title)}
                  </Text>
                  <Text variant="small" className="text-muted-foreground">
                    {FRENZEL_TRAINING_SCHEDULE[0].durationMinutes}{' '}
                    {t('timer.minutes')}
                  </Text>
                </View>
              </Pressable>
            </CardContent>
          </Card>

          <Text variant="p" className="text-center text-muted-foreground">
            {t('home.or')}
          </Text>

          {/* Start CO₂ Table */}
          <Card>
            <CardContent className="p-4">
              <Pressable
                onPress={() => router.push('/(tabs)/co2-table')}
                className="active:opacity-70"
              >
                <View className="gap-2">
                  <Text variant="h3">{t('home.quickCO2')}</Text>
                  <Text variant="p" className="text-muted-foreground">
                    {t('home.breathTraining')}
                  </Text>
                </View>
              </Pressable>
            </CardContent>
          </Card>

          {/* Learn More */}
          <Pressable
            onPress={() => router.push('/(tabs)/equalizing')}
            className="mt-4"
          >
            <Text variant="p" className="text-center text-primary">
              {t('home.learnMore')} →
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
