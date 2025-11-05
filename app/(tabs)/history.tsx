import { View, SectionList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTrainingHistory } from '@/stores';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Text } from '@/shared/ui/text';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';
import type { TrainingSession } from '@/entities/training-record';

/**
 * 훈련 제목 생성 헬퍼 함수
 */
function getSessionTitle(session: TrainingSession, t: (key: string, options?: Record<string, unknown>) => string): string {
  if (session.type === 'frenzel') {
    const { dayNumber } = session.meta;
    // dayNumber로부터 i18n 키를 재구성하여 번역
    const dayTitle = t(`equalizing.day${dayNumber}.title`);
    return t('history.frenzelTitle', { dayNumber, dayTitle });
  } else {
    const { holdTimeSeconds } = session.meta;
    const holdTime = formatTime(holdTimeSeconds);
    return t('history.co2TableTitle', { holdTime });
  }
}

/**
 * 시간 포맷 헬퍼 함수 (초 → M:SS)
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 훈련 세션을 날짜별로 그룹핑
 */
function groupSessionsByDate(sessions: TrainingSession[]): {
  date: string;
  data: TrainingSession[];
}[] {
  const grouped = new Map<string, TrainingSession[]>();

  sessions.forEach((session) => {
    const dateKey = session.endTime.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(session);
  });

  // 날짜 최신순으로 정렬
  return Array.from(grouped.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, data]) => ({ date, data }));
}

/**
 * 날짜를 사용자 친화적 형식으로 표시
 * 오늘, 어제, 또는 로케일에 맞는 날짜 형식
 */
function formatSectionDate(
  dateString: string,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 날짜만 비교 (시간 제외)
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) {
    return t('history.today');
  }

  if (isSameDay(date, yesterday)) {
    return t('history.yesterday');
  }

  // 일반 날짜 (로케일에 맞게 표시)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 소요 시간 계산 헬퍼 함수 (i18n 지원)
 */
function calculateDuration(
  startTime: Date,
  endTime: Date,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  const durationMs = endTime.getTime() - startTime.getTime();

  // Negative duration 처리 (clock skew, 잘못된 데이터)
  if (durationMs < 0) {
    return t('history.unknownDuration');
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins === 0) {
    return t('history.durationSeconds', { secs });
  }
  if (secs === 0) {
    return t('history.durationMinutes', { mins });
  }
  return t('history.durationMinutesSeconds', { mins, secs });
}

/**
 * 훈련 기록 카드 컴포넌트
 */
function TrainingRecordCard({ session }: { session: TrainingSession }) {
  const { t } = useTranslation();
  const title = getSessionTitle(session, t);
  const duration = calculateDuration(session.startTime, session.endTime, t);
  const typeLabel = session.type === 'frenzel' ? t('history.frenzelBadge') : t('history.co2Badge');
  const typeBadgeVariant = session.type === 'frenzel' ? 'default' : 'secondary';

  return (
    <Card className="mx-4">
      <CardHeader>
        <Badge variant={typeBadgeVariant}>
          <Text variant="small">{typeLabel}</Text>
        </Badge>
        <Text variant="h4" className="mt-2">{title}</Text>
      </CardHeader>
      <CardContent>
        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text variant="small" className="text-muted-foreground">
              {t('history.completedAt')}
            </Text>
            <Text variant="small">
              {session.endTime.toLocaleDateString()} {session.endTime.toLocaleTimeString()}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text variant="small" className="text-muted-foreground">
              {t('history.duration')}
            </Text>
            <Text variant="small">{duration}</Text>
          </View>
          {session.notes && (
            <>
              <Separator className="my-2" />
              <View>
                <Text variant="small" className="font-semibold mb-1">
                  {t('history.notes')}
                </Text>
                <Text variant="small" className="text-muted-foreground">
                  {session.notes}
                </Text>
              </View>
            </>
          )}
        </View>
      </CardContent>
    </Card>
  );
}

/**
 * Training History Screen
 *
 * 프렌젤 + CO₂ 통합 훈련 기록 표시
 */
export default function HistoryScreen() {
  const { t } = useTranslation();
  const { sessions } = useTrainingHistory();
  const insets = useSafeAreaInsets();

  // 최신순 정렬 후 날짜별 그룹핑
  const sortedSessions = [...sessions].sort(
    (a, b) => b.endTime.getTime() - a.endTime.getTime()
  );
  const sectionedData = groupSessionsByDate(sortedSessions);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <SectionList
        sections={sectionedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TrainingRecordCard session={item} />}
        renderSectionHeader={({ section: { date } }) => (
          <View className="bg-background py-3 px-4 items-center">
            <Text variant="large" className="font-semibold text-muted-foreground uppercase">
              {formatSectionDate(date, t)}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        stickySectionHeadersEnabled={true}
        ListEmptyComponent={
          <View className="p-4">
            <Card>
              <CardContent className="py-8">
                <Text variant="p" className="text-center text-muted-foreground mb-2">
                  {t('history.empty')}
                </Text>
                <Text variant="small" className="text-center text-muted-foreground">
                  {t('history.emptySubtitle')}
                </Text>
              </CardContent>
            </Card>
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-3" />}
        SectionSeparatorComponent={() => <View className="h-1" />}
      />
    </View>
  );
}
