import AsyncStorageMock from '@react-native-async-storage/async-storage/jest/async-storage-mock';

/**
 * Enhanced AsyncStorage Mock with failure simulation
 *
 * 테스트에서 AsyncStorage 실패 시나리오를 시뮬레이션할 수 있도록
 * 추가 헬퍼 메소드를 제공합니다.
 */
export const AsyncStorageWithFailure = {
  ...AsyncStorageMock,

  /**
   * 다음 getItem 호출이 실패하도록 시뮬레이션
   */
  simulateGetFailure() {
    (AsyncStorageMock.getItem as jest.Mock).mockRejectedValueOnce(
      new Error('Storage read failed')
    );
  },

  /**
   * 다음 setItem 호출이 실패하도록 시뮬레이션
   */
  simulateSetFailure() {
    (AsyncStorageMock.setItem as jest.Mock).mockRejectedValueOnce(
      new Error('Storage full')
    );
  },

  /**
   * 손상된 JSON 데이터 반환 시뮬레이션
   */
  simulateCorruptedData() {
    (AsyncStorageMock.getItem as jest.Mock).mockResolvedValueOnce(
      '{ invalid json data'
    );
  },

  /**
   * 모든 모킹 초기화
   */
  reset() {
    jest.clearAllMocks();
  },
};
