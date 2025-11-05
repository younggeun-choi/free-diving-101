import type { TrainingSession } from '@/entities/training-record';
import type { TFunction } from 'i18next';

/**
 * 완료된 프렌젤 Day 번호들을 반환
 */
export function getCompletedDays(sessions: TrainingSession[]): Set<number> {
  return new Set(
    sessions
      .filter(
        (s): s is Extract<TrainingSession, { type: 'frenzel' }> =>
          s.type === 'frenzel' && s.completed
      )
      .map((s) => s.meta.dayNumber)
  );
}

/**
 * 다음 미완료 Day 번호를 찾음 (1-10)
 */
export function findNextDay(completedDays: Set<number>): number {
  for (let i = 1; i <= 10; i++) {
    if (!completedDays.has(i)) return i;
  }
  return 10; // All completed
}

/**
 * 총 훈련 시간 계산 (밀리초)
 */
export function calculateTotalTime(sessions: TrainingSession[]): number {
  return sessions.reduce((total, session) => {
    const duration = session.endTime.getTime() - session.startTime.getTime();
    return total + duration;
  }, 0);
}

/**
 * 날짜 차이를 일 단위로 계산 (timezone 고려)
 */
function getDaysDifference(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(date2);
  d2.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 연속 훈련일 계산
 */
export function calculateStreak(sessions: TrainingSession[]): number {
  if (sessions.length === 0) return 0;

  const sorted = [...sessions].sort(
    (a, b) => b.endTime.getTime() - a.endTime.getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // 날짜별로 그룹화 (같은 날에 여러 세션이 있을 수 있음)
  const uniqueDates: Date[] = [];
  const seenDates = new Set<string>();

  for (const session of sorted) {
    const sessionDate = new Date(session.endTime);
    sessionDate.setHours(0, 0, 0, 0);
    const dateKey = sessionDate.toISOString();

    if (!seenDates.has(dateKey)) {
      seenDates.add(dateKey);
      uniqueDates.push(sessionDate);
    }
  }

  for (const sessionDate of uniqueDates) {
    const dayDiff = getDaysDifference(sessionDate, currentDate);

    if (dayDiff === 0 || dayDiff === 1) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * 시간 포맷팅 (밀리초 → "2h 15min" 또는 "45min")
 */
export function formatDuration(ms: number, t: TFunction): string {
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return t('home.durationHoursMinutes', { hours, minutes });
  }
  return t('home.durationMinutes', { minutes });
}

/**
 * 시간대별 인사말 반환
 */
export function getTimeBasedGreeting(t: TFunction): string {
  const hour = new Date().getHours();

  if (hour < 12) return t('home.greeting.morning');
  if (hour < 18) return t('home.greeting.afternoon');
  return t('home.greeting.evening');
}

/**
 * 상대 시간 포맷팅 ("오늘", "어제", "2일 전")
 */
export function formatRelativeTime(date: Date, t: TFunction): string {
  const now = new Date();
  const dayDiff = getDaysDifference(date, now);

  if (dayDiff === 0) return t('home.today');
  if (dayDiff === 1) return t('home.yesterday');
  return t('home.daysAgo', { count: dayDiff });
}

/**
 * 시간을 포함한 상대 시간 포맷팅 ("오늘 2:30 PM", "어제", "2일 전")
 */
export function formatRelativeTimeWithTime(date: Date, t: TFunction): string {
  const now = new Date();
  const dayDiff = getDaysDifference(date, now);

  // 오늘인 경우 시간 포함
  if (dayDiff === 0) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeStr = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    return `${t('home.today')} ${timeStr}`;
  }

  if (dayDiff === 1) return t('home.yesterday');
  return t('home.daysAgo', { count: dayDiff });
}

/**
 * CO₂ Hold 시간 포맷팅 (초 → "2:30")
 */
export function formatHoldTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
