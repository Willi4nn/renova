import { formatCurrency, formatPhone } from './formatters';

describe('formatCurrency', () => {
  it('formats number to Brazilian Real', () => {
    expect(formatCurrency(1250.5)).toContain('1.250,50');
  });
});

describe('formatPhone', () => {
  it.each([
    ['34999991111', '(34) 99999-1111'],
    ['3438221010', '(34) 3822-1010'],
  ])('formats %s to %s', (input, expected) => {
    expect(formatPhone(input)).toBe(expected);
  });
});
