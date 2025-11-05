import { View, ScrollView, FlatList } from 'react-native';
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
    const { dayNumber, dayTitle } = session.meta;
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
    <Card className="mb-3">
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

  // 최신순 정렬
  const sortedSessions = [...sessions].sort(
    (a, b) => b.endTime.getTime() - a.endTime.getTime()
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="p-4">
        <Text variant="h2" className="mb-4">
          {t('history.title')}
        </Text>

        {/* Session History */}
        {sortedSessions.length > 0 ? (
          <FlatList
            data={sortedSessions}
            renderItem={({ item }) => <TrainingRecordCard session={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
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
        )}
      </View>
    </ScrollView>
  );
}
