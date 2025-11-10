import { renderHook, act } from '@testing-library/react-native';
import { useTimer } from '@/features/frenzel-trainer/lib/use-timer';

describe('useTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('초기 상태', () => {
    it('초기 상태가 올바름', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
    });

    it('durationMinutes를 초로 변환', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 5 })
      );

      // Total should be 5 * 60 = 300 seconds
      expect(result.current.elapsedSeconds).toBe(0);
    });
  });

  describe('start', () => {
    it('타이머를 시작하고 시간이 경과', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
      expect(result.current.isPaused).toBe(false);

      // Advance by 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.elapsedSeconds).toBe(5);
    });

    it('타이머 시작 시 elapsedSeconds가 0으로 초기화', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedSeconds).toBe(3);

      // Restart timer
      act(() => {
        result.current.start();
      });

      expect(result.current.elapsedSeconds).toBe(0);
    });

    it('100ms마다 업데이트', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Should update after 100ms
      expect(result.current.elapsedSeconds).toBe(0); // Still 0 (< 1 second)

      act(() => {
        jest.advanceTimersByTime(900);
      });

      expect(result.current.elapsedSeconds).toBe(1);
    });
  });

  describe('pause', () => {
    it('타이머를 일시정지', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedSeconds).toBe(3);

      act(() => {
        result.current.pause();
      });

      expect(result.current.isPaused).toBe(true);
      expect(result.current.isRunning).toBe(true);

      // Advance time while paused
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Time should not advance
      expect(result.current.elapsedSeconds).toBe(3);
    });

    it('이미 일시정지된 상태에서 pause 호출해도 에러 없음', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
        result.current.pause();
      });

      expect(() => {
        act(() => {
          result.current.pause();
        });
      }).not.toThrow();
    });

    it('시작 전 pause 호출해도 에러 없음', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      expect(() => {
        act(() => {
          result.current.pause();
        });
      }).not.toThrow();
    });
  });

  describe('resume', () => {
    it('일시정지에서 재개', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedSeconds).toBe(3);

      act(() => {
        result.current.pause();
        jest.advanceTimersByTime(5000); // Time while paused
      });

      act(() => {
        result.current.resume();
      });

      expect(result.current.isPaused).toBe(false);
      expect(result.current.isRunning).toBe(true);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.elapsedSeconds).toBe(5); // 3 + 2
    });

    it('여러 번 pause/resume 사이클', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.elapsedSeconds).toBe(1);

      // First pause/resume
      act(() => {
        result.current.pause();
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      act(() => {
        result.current.resume();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.elapsedSeconds).toBeGreaterThanOrEqual(2);

      // Second pause/resume
      act(() => {
        result.current.pause();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      act(() => {
        result.current.resume();
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.elapsedSeconds).toBeGreaterThanOrEqual(4);
    });

    it('일시정지 상태가 아닐 때 resume 호출해도 에러 없음', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
      });

      expect(() => {
        act(() => {
          result.current.resume();
        });
      }).not.toThrow();
    });
  });

  describe('complete', () => {
    it('수동으로 complete 호출', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10, onComplete })
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(3000);
      });

      act(() => {
        result.current.complete();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('자동으로 complete (시간 경과)', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 1, onComplete }) // 60 seconds
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(60000); // 60 seconds
      });

      expect(result.current.elapsedSeconds).toBeGreaterThanOrEqual(60);
      expect(result.current.isRunning).toBe(false);
      expect(onComplete).toHaveBeenCalled();
    });

    it('onComplete이 없어도 에러 없음', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
      });

      expect(() => {
        act(() => {
          result.current.complete();
        });
      }).not.toThrow();
    });
  });

  describe('cancel', () => {
    it('타이머를 취소하고 상태 초기화', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.elapsedSeconds).toBe(5);

      act(() => {
        result.current.cancel();
      });

      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
    });

    it('일시정지 중 cancel 호출', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(3000);
        result.current.pause();
      });

      act(() => {
        result.current.cancel();
      });

      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
    });
  });

  describe('reset', () => {
    it('타이머를 리셋', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.elapsedSeconds).toBe(5);

      act(() => {
        result.current.reset();
      });

      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
    });
  });

  describe('언마운트 시 정리', () => {
    it('컴포넌트 언마운트 시 interval 정리', () => {
      const { result, unmount } = renderHook(() =>
        useTimer({ durationMinutes: 10 })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);

      unmount();

      // Should not throw or cause memory leaks
      expect(() => {
        jest.advanceTimersByTime(5000);
      }).not.toThrow();
    });
  });

  describe('엣지 케이스', () => {
    it('0분 duration', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 0, onComplete })
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(100);
      });

      // Should complete immediately
      expect(onComplete).toHaveBeenCalled();
      expect(result.current.isRunning).toBe(false);
    });

    it('매우 짧은 duration (1초)', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 1 / 60, onComplete }) // 1 second
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(1000);
      });

      expect(onComplete).toHaveBeenCalled();
    });

    it('매우 긴 duration (60분)', () => {
      const { result } = renderHook(() =>
        useTimer({ durationMinutes: 60 })
      );

      act(() => {
        result.current.start();
        jest.advanceTimersByTime(3600000); // 60 minutes
      });

      expect(result.current.elapsedSeconds).toBeGreaterThanOrEqual(3600);
    });
  });
});
