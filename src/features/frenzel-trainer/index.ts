// UI Components
export { EducationAccordion } from './ui/EducationAccordion';
export { DayList } from './ui/DayList';
export { DayDetailCard } from './ui/DayDetailCard';
export { TrainingTimer } from './ui/TrainingTimer';

// Business Logic
export { useTimer } from './lib/use-timer';
export type { UseTimerOptions, UseTimerReturn } from './lib/use-timer';
export {
  requestNotificationPermissions,
  scheduleTrainingNotification,
  cancelNotification,
  sendTrainingCompleteNotification,
  clearAllNotifications,
} from './lib/notifications';
