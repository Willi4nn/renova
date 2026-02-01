export interface CreateClientDTO {
  name: string;
  phone_number: string;
  address: string;
}

export interface CreateServiceDTO {
  client_id: string;
  furniture_name: string;
  fabric_name: string;
  fabric_code?: string;
  fabric_price_per_meter: number;
  fabric_meters: number;
  cost_foam: number;
  cost_labor: number;
  cost_shipping: number;
  cost_other: number;
  collection_date: string;
  delivery_date?: string;
  status: ServiceStatus;
  notes?: string;
}

export type ServiceStatus = 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'PAID';
export type UpdateClientDTO = Partial<CreateClientDTO>;
export type UpdateServiceDTO = Partial<CreateServiceDTO>;
