import { useState, useCallback } from 'react';

export function usePhoneMask(initialValue = '') {
  function applyMask(value: string): string {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    }
  }

  const [displayValue, setDisplayValue] = useState(() =>
    applyMask(initialValue),
  );

  const handlePhoneChange = useCallback((value: string) => {
    const masked = applyMask(value);
    setDisplayValue(masked);
    return value.replace(/\D/g, '');
  }, []);

  const setPhone = useCallback((value: string) => {
    setDisplayValue(applyMask(value));
  }, []);

  return { displayValue, setDisplayValue: setPhone, handlePhoneChange };
}
