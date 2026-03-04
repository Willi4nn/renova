import { useWatch, type Control } from 'react-hook-form';
import type { ServiceFormData } from '../utils/validation';

export interface ServiceCalculation {
  cost_fabric: number;
  total_cost: number;
  final_price: number;
  net_profit: number;
}

export function useServiceCalculator(
  control: Control<ServiceFormData>,
): ServiceCalculation {
  const watchValues = useWatch({ control });

  const fabricPrice = Number(watchValues.fabric_price_per_meter || 0);
  const fabricMeters = Number(watchValues.fabric_meters || 0);
  const costFoam = Number(watchValues.cost_foam || 0);
  const costLabor = Number(watchValues.cost_labor || 0);
  const costShipping = Number(watchValues.cost_shipping || 0);
  const costOther = Number(watchValues.cost_other || 0);

  const cost_fabric = fabricPrice * fabricMeters;
  const total_cost = cost_fabric + costFoam + costShipping + costOther;
  const final_price = total_cost + costLabor;
  const net_profit = final_price - total_cost;

  return { cost_fabric, total_cost, final_price, net_profit };
}
