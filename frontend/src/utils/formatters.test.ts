import { formatCurrency, formatPhone } from './formatters';

describe('Formatters - UI Utilities', () => {
  test('formatCurrency should convert number to Brazilian Real', () => {
    expect(formatCurrency(1250.5)).toContain('1.250,50');
  });

  test('formatPhone should format cell phone number with 11 digits correctly', () => {
    expect(formatPhone('34999991111')).toBe('(34) 99999-1111');
  });

  test('formatPhone should format landline phone number with 10 digits', () => {
    expect(formatPhone('3438221010')).toBe('(34) 3822-1010');
  });
});
