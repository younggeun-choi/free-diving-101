/**
 * Sanity Check Test
 *
 * Jest 환경 설정이 올바르게 되었는지 확인하는 기본 테스트
 */

describe('Jest Setup Sanity Check', () => {
  it('Jest가 정상적으로 동작함', () => {
    expect(1 + 1).toBe(2);
  });

  it('TypeScript가 정상적으로 동작함', () => {
    const greeting: string = 'Hello, TypeScript!';
    expect(greeting).toBe('Hello, TypeScript!');
  });

  it('Fake timers가 설정되어 있음', () => {
    jest.useFakeTimers();
    const callback = jest.fn();

    setTimeout(callback, 1000);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('AsyncStorage mock이 사용 가능함', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage/jest/async-storage-mock');

    await AsyncStorage.setItem('test-key', 'test-value');
    const value = await AsyncStorage.getItem('test-key');

    expect(value).toBe('test-value');
  });

  it('expo-crypto mock이 사용 가능함', () => {
    const { randomUUID } = require('expo-crypto');
    const uuid = randomUUID();

    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe('string');
    expect(uuid).toMatch(/^test-uuid-/);
  });

  it('expo-speech mock이 사용 가능함', async () => {
    const Speech = require('expo-speech');

    await Speech.speak('Hello');
    expect(Speech.speak).toHaveBeenCalledWith('Hello');

    Speech.stop();
    expect(Speech.stop).toHaveBeenCalled();

    const isSpeaking = await Speech.isSpeakingAsync();
    expect(isSpeaking).toBe(false);
  });
});
