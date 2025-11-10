import { render as rtlRender, RenderOptions } from '@testing-library/react-native';
import { ReactElement } from 'react';

/**
 * Custom render function with providers
 *
 * 현재는 providers가 없지만 향후 확장을 위해 래퍼 준비
 * (i18n provider, theme provider 등 추가 가능)
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from React Native Testing Library
export * from '@testing-library/react-native';

// Export custom render as default render
export { renderWithProviders as render };
