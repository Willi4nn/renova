export type OrderStatus = 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'PAID';

export interface Client {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  created_at: string;
}

export interface Order {
  id: string;
  client_id: string;
  furniture_name: string;
  fabric_name: string;
  fabric_code?: string;
  fabric_price_per_meter: number;
  fabric_meters: number;
  cost_fabric: number;
  cost_foam: number;
  cost_labor: number;
  cost_shipping: number;
  cost_other: number;
  total_cost: number;
  final_price: number;
  net_profit: number;
  collection_date: string;
  delivery_date?: string;
  status: OrderStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type ViewState =
  | { name: 'dashboard' }
  | { name: 'financial' }
  | { name: 'clients' }
  | { name: 'client-details'; id: string }
  | { name: 'services' }
  | { name: 'service-details'; id: string };
