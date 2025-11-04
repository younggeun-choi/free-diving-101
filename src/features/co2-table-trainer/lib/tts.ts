import * as Speech from 'expo-speech';
import { i18n } from '@/shared/lib/i18n';
import type { SupportedLanguage } from '@/shared/locales';

/**
 * 앱 언어 코드를 TTS 엔진 언어 코드로 매핑
 */
function mapLanguageToTTSCode(language: SupportedLanguage): string {
  const languageMap: Record<SupportedLanguage, string> = {
    en: 'en-US',
    ko: 'ko-KR',
  };
  return languageMap[language];
}

/**
 * TTS 발화 함수
 */
export async function speak(text: string, language: SupportedLanguage = 'en'): Promise<void> {
  const ttsLanguageCode = mapLanguageToTTSCode(language);
  await Speech.speak(text, {
    language: ttsLanguageCode,
    pitch: 1.0,
    rate: 1.0,
  });
}

/**
 * TTS 중단
 */
export async function stopSpeech(): Promise<void> {
  await Speech.stop();
}

/**
 * TTS 가능 여부 확인
 */
export async function isSpeechAvailable(): Promise<boolean> {
  const voices = await Speech.getAvailableVoicesAsync();
  return voices.length > 0;
}

/**
 * 타이머에 맞춘 TTS 발화
 * @param remainingSeconds 남은 시간 (초)
 * @param isBreathing true면 Breathe 단계, false면 Hold 단계
 * @param isPhaseStart 단계 시작 시점인지 여부
 * @param language 언어 코드
 */
export function speakForTimer(
  remainingSeconds: number,
  isBreathing: boolean,
  isPhaseStart: boolean,
  language: SupportedLanguage = 'en'
): void {
  const text = getTTSTextForTime(remainingSeconds, isBreathing, isPhaseStart, language);
  if (text) {
    speak(text, language);
  }
}

/**
 * 시간에 맞는 TTS 텍스트 반환
 * PRD 명세에 따라 특정 시간에만 TTS 발화
 * i18n을 활용하여 다국어 지원
 */
function getTTSTextForTime(
  remainingSeconds: number,
  isBreathing: boolean,
  isPhaseStart: boolean,
  language: SupportedLanguage
): string | null {
  // Breathe/Hold 시작 시점
  if (isPhaseStart) {
    return isBreathing ? i18n.t('tts.breathe') : i18n.t('tts.hold');
  }

  // 분 단위 (3:00, 2:00, 1:00)
  if (remainingSeconds === 180) return i18n.t('tts.minutes.three');
  if (remainingSeconds === 120) return i18n.t('tts.minutes.two');
  if (remainingSeconds === 60) return i18n.t('tts.minutes.one');

  // 30초
  if (remainingSeconds === 30) return i18n.t('tts.seconds.thirty');

  // 10초
  if (remainingSeconds === 10) return i18n.t('tts.seconds.ten');

  // 5~1초 카운트다운
  if (remainingSeconds === 5) return i18n.t('tts.seconds.five');
  if (remainingSeconds === 4) return i18n.t('tts.seconds.four');
  if (remainingSeconds === 3) return i18n.t('tts.seconds.three');
  if (remainingSeconds === 2) return i18n.t('tts.seconds.two');
  if (remainingSeconds === 1) return i18n.t('tts.seconds.one');

  return null;
}

/**
 * 훈련 완료 TTS
 */
export async function speakTrainingComplete(language: SupportedLanguage = 'en'): Promise<void> {
  await speak(i18n.t('tts.completed'), language);
}
