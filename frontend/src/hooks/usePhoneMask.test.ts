import { renderHook, act } from '@testing-library/react';
import { usePhoneMask } from './usePhoneMask';

describe('usePhoneMask', () => {
  it('should apply mask as the user types', () => {
    const { result } = renderHook(() => usePhoneMask());

    act(() => {
      result.current.handlePhoneChange('34999');
    });

    expect(result.current.displayValue).toBe('(34) 999');
  });
});
