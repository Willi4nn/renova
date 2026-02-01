import { clientSchema, serviceSchema } from './validation';

describe('clientSchema', () => {
  it('rejects invalid phone number', () => {
    expect(
      clientSchema.safeParse({
        name: 'Will',
        phone_number: '123',
        address: 'Rua teste',
      }).success,
    ).toBe(false);
  });

  it('accepts valid data and normalizes phone number', () => {
    const data = {
      name: 'Willian',
      phone_number: '(34) 99999-8888',
      address: 'Rua das Flores, 123',
    };
    const result = clientSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.phone_number).toBe('34999998888');
  });
});

describe('serviceSchema', () => {
  it('rejects invalid collection date', () => {
    expect(
      serviceSchema.safeParse({ collection_date: 'data-errada' }).success,
    ).toBe(false);
  });
});
