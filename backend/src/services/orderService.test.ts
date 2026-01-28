import { calculateOrderValues } from './orderService.js';

describe('OrderService - Financial Calculations', () => {
  it('should correctly calculate net profit and total costs', async () => {
    const mockOrderData = {
      fabric_price_per_meter: 50.0,
      fabric_meters: 10,
      cost_foam: 100.0,
      cost_labor: 500.0,
      cost_shipping: 50.0,
      cost_other: 0,
    };

    const result = calculateOrderValues(mockOrderData);

    expect(result.cost_fabric).toBe(500);
    expect(result.total_cost).toBe(650);
    expect(result.final_price).toBe(1150);
    expect(result.net_profit).toBe(500);
  });

  it('should round monetary values to 2 decimal places', () => {
    const input = { fabric_price_per_meter: 33.333, fabric_meters: 1 };
    const result = calculateOrderValues(input);
    expect(result.cost_fabric).toBe(33.33);
  });
});
