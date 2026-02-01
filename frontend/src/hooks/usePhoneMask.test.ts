import { act, renderHook } from '@testing-library/react';
import { usePhoneMask } from './usePhoneMask';

describe('usePhoneMask', () => {
  it('applies mask as user types', () => {
    const { result } = renderHook(() => usePhoneMask());
    act(() => result.current.handlePhoneChange('34999'));
    expect(result.current.displayValue).toBe('(34) 999');
  });
});
