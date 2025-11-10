/**
 * Expo Speech Mock with error simulation
 *
 * TTS 기능 테스트를 위한 모킹 유틸리티
 */
export const SpeechMock = {
  /**
   * speak 함수 모킹
   */
  speak: jest.fn((text: string, options?: any) => Promise.resolve()),

  /**
   * stop 함수 모킹
   */
  stop: jest.fn(),

  /**
   * isSpeakingAsync 함수 모킹
   */
  isSpeakingAsync: jest.fn(() => Promise.resolve(false)),

  /**
   * 권한 에러 시뮬레이션
   */
  simulatePermissionError() {
    (this.speak as jest.Mock).mockRejectedValueOnce(
      new Error('Permission denied')
    );
  },

  /**
   * TTS 엔진 실패 시뮬레이션
   */
  simulateTTSFailure() {
    (this.speak as jest.Mock).mockRejectedValueOnce(
      new Error('TTS engine not available')
    );
  },

  /**
   * 현재 발화 중 상태로 설정
   */
  setSpeaking(isSpeaking: boolean) {
    (this.isSpeakingAsync as jest.Mock).mockResolvedValue(isSpeaking);
  },

  /**
   * 모든 모킹 초기화
   */
  reset() {
    jest.clearAllMocks();
    (this.isSpeakingAsync as jest.Mock).mockResolvedValue(false);
  },
};
