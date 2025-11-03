import * as Speech from 'expo-speech';

/**
 * TTS 발화 함수
 */
export async function speak(text: string, language: string = 'en-US'): Promise<void> {
  await Speech.speak(text, {
    language,
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
  language: string = 'en-US'
): void {
  const text = getTTSTextForTime(remainingSeconds, isBreathing, isPhaseStart);
  if (text) {
    speak(text, language);
  }
}

/**
 * 시간에 맞는 TTS 텍스트 반환
 * PRD 명세에 따라 특정 시간에만 TTS 발화
 */
function getTTSTextForTime(
  remainingSeconds: number,
  isBreathing: boolean,
  isPhaseStart: boolean
): string | null {
  // Breathe/Hold 시작 시점
  if (isPhaseStart) {
    return isBreathing ? 'Breathe' : 'Hold';
  }

  // 분 단위 (3:00, 2:00, 1:00)
  if (remainingSeconds === 180) return 'Three minutes';
  if (remainingSeconds === 120) return 'Two minutes';
  if (remainingSeconds === 60) return 'One minute';

  // 30초
  if (remainingSeconds === 30) return 'Thirty seconds';

  // 10초
  if (remainingSeconds === 10) return 'Ten seconds';

  // 5~1초 카운트다운
  if (remainingSeconds === 5) return 'Five';
  if (remainingSeconds === 4) return 'Four';
  if (remainingSeconds === 3) return 'Three';
  if (remainingSeconds === 2) return 'Two';
  if (remainingSeconds === 1) return 'One';

  return null;
}

/**
 * 훈련 완료 TTS
 */
export async function speakTrainingComplete(language: string = 'en-US'): Promise<void> {
  await speak('Training completed', language);
}
